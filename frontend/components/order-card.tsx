"use client";

import { DailyOrder, OrderStatus } from '@/types/order';
import { formatDate } from '@/lib/utils';
import { Clock, CheckCircle2, Truck, ChefHat, AlertCircle, XCircle } from 'lucide-react';

interface OrderCardProps {
  order: DailyOrder;
  onConfirmReceived?: (id: string) => void;
  onSkipOrder?: (id: string) => void;
}

export function OrderCard({ order, onConfirmReceived, onSkipOrder }: OrderCardProps) {
  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return {
          label: 'Order Confirmed',
          bg: 'bg-blue-50 text-blue-700 border-blue-200',
          icon: Clock,
        };
      case 'preparing':
        return {
          label: 'Preparing Lunch',
          bg: 'bg-amber-50 text-amber-700 border-amber-200',
          icon: ChefHat,
        };
      case 'out_for_delivery':
        return {
          label: 'Out for Delivery',
          bg: 'bg-orange-50 text-orange-700 border-orange-200',
          icon: Truck,
        };
      case 'delivered':
        return {
          label: 'Delivered',
          bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          icon: CheckCircle2,
        };
      case 'skipped':
        return {
          label: 'Skipped',
          bg: 'bg-stone-100 text-stone-600 border-stone-200',
          icon: AlertCircle,
        };
      case 'cancelled':
        return {
          label: 'Cancelled',
          bg: 'bg-red-50 text-red-700 border-red-200',
          icon: XCircle,
        };
      default:
        return {
          label: status,
          bg: 'bg-stone-50 text-stone-700 border-stone-200',
          icon: Clock,
        };
    }
  };

  const statusInfo = getStatusBadge(order.status);
  const StatusIcon = statusInfo.icon;

  return (
    <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs hover:shadow-md transition-shadow">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-4 mb-4">
        <div>
          <span className="text-xs font-semibold uppercase text-stone-400 tracking-wider">
            Meal Date
          </span>
          <h3 className="font-bold text-stone-900 text-lg">
            {formatDate(order.date)}
          </h3>
        </div>

        <div className="flex items-center space-x-2">
          <span className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${statusInfo.bg}`}>
            <StatusIcon className="w-3.5 h-3.5" />
            <span>{statusInfo.label}</span>
          </span>
          {order.received_status && (
            <span className="inline-flex items-center space-x-1 bg-emerald-100 text-emerald-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full">
              ✓ Received
            </span>
          )}
        </div>
      </div>

      <div className="space-y-2 text-sm text-stone-600 mb-5">
        <p className="flex items-start space-x-2">
          <span className="font-semibold text-stone-800">Address:</span>
          <span>{order.delivery_address}, {order.area}</span>
        </p>
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-stone-50">
        {order.status === 'delivered' && !order.received_status && onConfirmReceived && (
          <button
            onClick={() => onConfirmReceived(order.id)}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm py-2.5 px-4 rounded-xl shadow-xs transition-colors flex items-center justify-center space-x-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Yes, I Received My Meal</span>
          </button>
        )}

        {(order.status === 'pending' || order.status === 'preparing') && onSkipOrder && (
          <button
            onClick={() => onSkipOrder(order.id)}
            className="text-stone-600 hover:text-stone-900 border border-stone-200 hover:bg-stone-50 text-xs font-semibold py-2 px-3 rounded-lg transition-colors"
          >
            Skip Today's Meal
          </button>
        )}
      </div>
    </div>
  );
}
