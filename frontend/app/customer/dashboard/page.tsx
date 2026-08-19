"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Sidebar } from '@/components/sidebar';
import { OrderCard } from '@/components/order-card';
import { useUser } from '@/hooks/useUser';
import {
  getCurrentSubscription,
  getTodayOrder,
  confirmOrder,
  skipOrder,
  getNotifications,
  getOrders,
} from '@/lib/api';
import { Subscription } from '@/types/subscription';
import { DailyOrder } from '@/types/order';
import { Notification } from '@/types/notification';
import { formatCurrency, formatDate } from '@/lib/utils';
import {
  CalendarCheck,
  Utensils,
  MapPin,
  CheckCircle2,
  Clock,
  ChevronRight,
  Sparkles,
  AlertCircle,
  PauseCircle,
  MessageSquare,
  AlertTriangle,
  RotateCw,
  Bell,
} from 'lucide-react';

export default function CustomerDashboardPage() {
  const { profile, loading: userLoading } = useUser();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [todayOrder, setTodayOrder] = useState<DailyOrder | null>(null);
  const [recentOrders, setRecentOrders] = useState<DailyOrder[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        setLoading(true);
        const [subData, orderData, allOrders, notifData] = await Promise.all([
          getCurrentSubscription().catch(() => null),
          getTodayOrder().catch(() => null),
          getOrders().catch(() => []),
          getNotifications().catch(() => []),
        ]);

        setSubscription(subData);
        setTodayOrder(orderData);
        setRecentOrders(allOrders.slice(0, 3));
        setNotifications(notifData.slice(0, 3));
      } catch (err: any) {
        console.error('Dashboard load error:', err);
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  const handleConfirmReceived = async (orderId: string) => {
    try {
      setActionLoading(true);
      const updated = await confirmOrder(orderId);
      setTodayOrder(updated);
      setMessage({ type: 'success', text: 'Thank you! Delivery confirmed as received.' });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to confirm receipt.' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleSkipToday = async (orderId: string) => {
    try {
      setActionLoading(true);
      const updated = await skipOrder(orderId);
      setTodayOrder(updated);
      setMessage({ type: 'success', text: "Today's meal skipped successfully." });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to skip order.' });
    } finally {
      setActionLoading(false);
    }
  };

  // Helper calculation for remaining days
  const getDaysRemaining = () => {
    if (!subscription?.end_date) return 0;
    const end = new Date(subscription.end_date);
    const today = new Date();
    const diffTime = end.getTime() - today.getTime();
    return Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
  };

  return (
    <div className="flex min-h-screen bg-cream-50">
      <Sidebar mode="customer" />

      <main className="flex-1 p-4 sm:p-8 max-w-7xl mx-auto w-full">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 text-xs font-bold text-brand-700 bg-brand-100 px-3 py-1 rounded-full mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Hyderabad Lunch Subscription</span>
            </div>
            <h1 className="text-3xl font-extrabold text-stone-900 font-serif">
              Good afternoon, {profile?.full_name || 'Valued Customer'} 👋
            </h1>
            <p className="text-xs text-stone-500 mt-1">
              Here is your daily meal summary and subscription status
            </p>
          </div>

          <Link
            href="/customer/subscription"
            className="inline-flex items-center space-x-2 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-xs transition-colors"
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span>Manage Subscription</span>
          </Link>
        </div>

        {/* Action Message Alert */}
        {message && (
          <div
            className={`mb-6 p-4 rounded-2xl text-xs font-medium flex items-center justify-between ${
              message.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}
          >
            <span>{message.text}</span>
            <button onClick={() => setMessage(null)} className="text-stone-400 font-bold hover:text-stone-600">
              ✕
            </button>
          </div>
        )}

        {/* Key Summary Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          
          {/* Card 1: Active Subscription */}
          <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-stone-400">
                  Active Subscription
                </span>
                <span
                  className={`text-xs font-extrabold px-3 py-1 rounded-full ${
                    subscription
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {subscription ? subscription.status.toUpperCase() : 'NO ACTIVE PLAN'}
                </span>
              </div>

              {subscription ? (
                <div>
                  <h3 className="text-2xl font-bold text-stone-900 font-serif">
                    {formatCurrency(subscription.plan?.price || 5500)}
                  </h3>
                  <p className="text-sm font-semibold text-stone-700 mt-1">
                    {subscription.plan?.name || 'Monthly Subscription'}
                  </p>
                  <p className="text-xs text-brand-700 font-bold mt-3">
                    ⏳ {getDaysRemaining()} days remaining
                  </p>
                </div>
              ) : (
                <div className="py-2">
                  <p className="text-sm text-stone-600 font-medium">
                    You don't have an active subscription yet.
                  </p>
                  <Link
                    href="/customer/subscription"
                    className="inline-block mt-4 text-xs font-bold text-brand-700 hover:underline"
                  >
                    Browse Subscription Plans →
                  </Link>
                </div>
              )}
            </div>

            {subscription && (
              <div className="pt-4 border-t border-stone-100 text-xs text-stone-500 flex justify-between">
                <span>Start: {formatDate(subscription.start_date)}</span>
                <span>End: {formatDate(subscription.end_date)}</span>
              </div>
            )}
          </div>

          {/* Card 2: Today's Meal Status */}
          <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs flex flex-col justify-between lg:col-span-2">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-stone-400">
                  Today's Lunch Meal
                </span>
                {todayOrder && (
                  <span className="bg-brand-100 text-brand-800 text-xs font-extrabold px-3 py-1 rounded-full">
                    {todayOrder.status.replace('_', ' ').toUpperCase()}
                  </span>
                )}
              </div>

              {todayOrder ? (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h4 className="text-xl font-bold text-stone-900 font-serif">
                        Vegetarian Mid-Day Lunch Thali
                      </h4>
                      <p className="text-xs text-stone-500 mt-1 flex items-center space-x-1">
                        <MapPin className="w-3.5 h-3.5 text-stone-400" />
                        <span>Deliver to: {todayOrder.delivery_address}, {todayOrder.area}</span>
                      </p>
                    </div>

                    {!todayOrder.received_status && todayOrder.status === 'delivered' && (
                      <button
                        onClick={() => handleConfirmReceived(todayOrder.id)}
                        disabled={actionLoading}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-5 py-3 rounded-2xl shadow-xs transition-colors flex items-center space-x-2 shrink-0"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Yes, I Received My Meal</span>
                      </button>
                    )}
                  </div>

                  {todayOrder.received_status && (
                    <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold p-3 rounded-xl flex items-center space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Meal received and confirmed! Enjoy your lunch! 🍱</span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="py-4 text-center">
                  <Utensils className="w-8 h-8 text-stone-300 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-stone-700">No meal order generated for today.</p>
                  <p className="text-xs text-stone-500 mt-1">
                    {subscription
                      ? 'Daily order will update automatically before 11:30 AM.'
                      : 'Subscribe to a plan to start receiving daily lunches.'}
                  </p>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-stone-100 flex items-center justify-between text-xs">
              <span className="text-stone-500">Delivery Window: 12:00 PM – 1:30 PM</span>
              {todayOrder && todayOrder.status === 'pending' && (
                <button
                  onClick={() => handleSkipToday(todayOrder.id)}
                  disabled={actionLoading}
                  className="text-stone-600 hover:text-stone-900 font-semibold underline"
                >
                  Skip Today's Meal
                </button>
              )}
            </div>
          </div>

        </div>

        {/* Quick Actions Bar */}
        <div className="mb-8">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-stone-400 mb-4">
            Quick Actions
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <Link
              href="/customer/orders"
              className="bg-white hover:bg-stone-50 border border-stone-200 p-4 rounded-2xl text-center shadow-xs transition-all group"
            >
              <Utensils className="w-5 h-5 text-brand-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold text-stone-800 block">View Orders</span>
            </Link>

            <Link
              href="/customer/subscription"
              className="bg-white hover:bg-stone-50 border border-stone-200 p-4 rounded-2xl text-center shadow-xs transition-all group"
            >
              <PauseCircle className="w-5 h-5 text-amber-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold text-stone-800 block">Pause Subscription</span>
            </Link>

            <Link
              href="/customer/feedback"
              className="bg-white hover:bg-stone-50 border border-stone-200 p-4 rounded-2xl text-center shadow-xs transition-all group"
            >
              <MessageSquare className="w-5 h-5 text-blue-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold text-stone-800 block">Give Feedback</span>
            </Link>

            <Link
              href="/customer/complaints"
              className="bg-white hover:bg-stone-50 border border-stone-200 p-4 rounded-2xl text-center shadow-xs transition-all group"
            >
              <AlertTriangle className="w-5 h-5 text-red-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold text-stone-800 block">Raise Complaint</span>
            </Link>

            <Link
              href="/customer/subscription"
              className="bg-white hover:bg-stone-50 border border-stone-200 p-4 rounded-2xl text-center shadow-xs transition-all group"
            >
              <RotateCw className="w-5 h-5 text-emerald-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold text-stone-800 block">Renew Plan</span>
            </Link>

            <Link
              href="/customer/profile"
              className="bg-white hover:bg-stone-50 border border-stone-200 p-4 rounded-2xl text-center shadow-xs transition-all group"
            >
              <MapPin className="w-5 h-5 text-purple-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold text-stone-800 block">Update Address</span>
            </Link>
          </div>
        </div>

        {/* Dashboard Grid: Recent Orders & Notifications */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Recent Deliveries */}
          <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-stone-900 font-serif">Recent Orders</h3>
              <Link href="/customer/orders" className="text-xs font-bold text-brand-700 hover:underline">
                View All →
              </Link>
            </div>

            {recentOrders.length > 0 ? (
              <div className="space-y-3">
                {recentOrders.map((order) => (
                  <div
                    key={order.id}
                    className="p-3.5 rounded-2xl bg-stone-50 border border-stone-100 flex items-center justify-between"
                  >
                    <div>
                      <p className="font-bold text-sm text-stone-900">{formatDate(order.date)}</p>
                      <p className="text-xs text-stone-500">{order.area}</p>
                    </div>
                    <span className="text-xs font-bold uppercase px-2.5 py-1 rounded-full bg-white border border-stone-200 text-stone-700">
                      {order.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-stone-500 py-6 text-center">No order history available yet.</p>
            )}
          </div>

          {/* Recent Notifications */}
          <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-stone-900 font-serif">Notifications</h3>
              <Link href="/customer/notifications" className="text-xs font-bold text-brand-700 hover:underline">
                View All →
              </Link>
            </div>

            {notifications.length > 0 ? (
              <div className="space-y-3">
                {notifications.map((n) => (
                  <div key={n.id} className="p-3.5 rounded-2xl bg-brand-50/50 border border-brand-100">
                    <h5 className="font-bold text-xs text-stone-900">{n.title}</h5>
                    <p className="text-xs text-stone-600 mt-0.5">{n.message}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-stone-500 py-6 text-center">No notifications at the moment.</p>
            )}
          </div>

        </div>
      </main>
    </div>
  );
}
