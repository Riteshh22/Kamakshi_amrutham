"use client";

import { Notification } from '@/types/notification';
import { formatDate } from '@/lib/utils';
import { Bell, CheckCircle, Info } from 'lucide-react';

interface NotificationCardProps {
  notification: Notification;
  onMarkAsRead?: (id: string) => void;
}

export function NotificationCard({ notification, onMarkAsRead }: NotificationCardProps) {
  return (
    <div
      className={`p-4 rounded-2xl border transition-all ${
        notification.is_read
          ? 'bg-stone-50/50 border-stone-200 text-stone-600'
          : 'bg-white border-brand-200 shadow-xs text-stone-900 ring-1 ring-brand-100'
      }`}
    >
      <div className="flex items-start space-x-3.5">
        <div
          className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
            notification.is_read
              ? 'bg-stone-200 text-stone-500'
              : 'bg-brand-100 text-brand-700'
          }`}
        >
          <Bell className="w-4 h-4" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1">
            <h4 className="font-bold text-sm text-stone-900 truncate">
              {notification.title}
            </h4>
            <span className="text-[11px] text-stone-400 shrink-0">
              {formatDate(notification.created_at)}
            </span>
          </div>
          <p className="text-xs text-stone-600 leading-relaxed mb-2">
            {notification.message}
          </p>

          {!notification.is_read && onMarkAsRead && (
            <button
              onClick={() => onMarkAsRead(notification.id)}
              className="text-[11px] font-semibold text-brand-700 hover:text-brand-800 transition-colors"
            >
              Mark as read
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
