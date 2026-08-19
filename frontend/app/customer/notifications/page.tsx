"use client";

import { useEffect, useState } from 'react';
import { Sidebar } from '@/components/sidebar';
import { NotificationCard } from '@/components/notification-card';
import { getNotifications, markNotificationRead, markAllNotificationsRead } from '@/lib/api';
import { Notification } from '@/types/notification';
import { Bell, CheckCheck } from 'lucide-react';

export default function CustomerNotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const data = await getNotifications().catch(() => []);
      setNotifications(data);
    } catch (err) {
      console.error('Failed to load notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      await markNotificationRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
      );
    } catch (err) {
      console.error('Failed to mark notification read:', err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllNotificationsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    } catch (err) {
      console.error('Failed to mark all read:', err);
    }
  };

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return (
    <div className="flex min-h-screen bg-cream-50">
      <Sidebar mode="customer" />

      <main className="flex-1 p-4 sm:p-8 max-w-4xl mx-auto w-full">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-stone-900 font-serif">
              Notifications Center
            </h1>
            <p className="text-xs text-stone-500 mt-1">
              Updates on meal deliveries, subscription status, and service alerts
            </p>
          </div>

          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              className="inline-flex items-center space-x-1.5 bg-white border border-stone-200 hover:bg-stone-50 text-stone-700 text-xs font-bold px-4 py-2 rounded-xl transition-colors shrink-0"
            >
              <CheckCheck className="w-4 h-4 text-brand-600" />
              <span>Mark All as Read</span>
            </button>
          )}
        </div>

        {notifications.length > 0 ? (
          <div className="space-y-4">
            {notifications.map((n) => (
              <NotificationCard
                key={n.id}
                notification={n}
                onMarkAsRead={handleMarkAsRead}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-12 text-center border border-stone-200">
            <Bell className="w-10 h-10 text-stone-300 mx-auto mb-3" />
            <h4 className="font-bold text-stone-800 text-base">No notifications yet</h4>
            <p className="text-xs text-stone-500 mt-1">
              Important alerts about your midday meal deliveries will appear here.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
