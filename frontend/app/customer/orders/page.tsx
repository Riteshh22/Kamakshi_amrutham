"use client";

import { useEffect, useState } from 'react';
import { Sidebar } from '@/components/sidebar';
import { OrderCard } from '@/components/order-card';
import { getOrders, getTodayOrder, confirmOrder, skipOrder } from '@/lib/api';
import { DailyOrder } from '@/types/order';
import { formatDate } from '@/lib/utils';
import { Utensils, CheckCircle2, Clock, Truck, ChefHat, AlertCircle, Filter } from 'lucide-react';

export default function CustomerOrdersPage() {
  const [orders, setOrders] = useState<DailyOrder[]>([]);
  const [todayOrder, setTodayOrder] = useState<DailyOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    loadOrdersData();
  }, []);

  const loadOrdersData = async () => {
    try {
      setLoading(true);
      const [todayData, allOrdersData] = await Promise.all([
        getTodayOrder().catch(() => null),
        getOrders().catch(() => []),
      ]);

      setTodayOrder(todayData);
      setOrders(allOrdersData);
    } catch (err: any) {
      console.error('Failed to load orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmReceived = async (orderId: string) => {
    try {
      setActionLoading(true);
      await confirmOrder(orderId);
      setMessage({ type: 'success', text: 'Meal delivery confirmed as received!' });
      loadOrdersData();
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to confirm receipt.' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleSkipOrder = async (orderId: string) => {
    try {
      setActionLoading(true);
      await skipOrder(orderId);
      setMessage({ type: 'success', text: 'Meal skipped for today.' });
      loadOrdersData();
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to skip order.' });
    } finally {
      setActionLoading(false);
    }
  };

  const filteredOrders = orders.filter((o) => {
    if (statusFilter === 'all') return true;
    return o.status === statusFilter;
  });

  return (
    <div className="flex min-h-screen bg-cream-50">
      <Sidebar mode="customer" />

      <main className="flex-1 p-4 sm:p-8 max-w-7xl mx-auto w-full">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-stone-900 font-serif">
            Daily Orders & History
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Track today's lunchtime meal dispatch and review your past delivery logs
          </p>
        </div>

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

        {/* Prominent Today's Order Timeline Banner */}
        {todayOrder && (
          <div className="mb-10 bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm">
            <div className="flex items-center justify-between border-b border-stone-100 pb-4 mb-6">
              <div>
                <span className="text-xs font-extrabold uppercase tracking-wider text-brand-700">
                  Today's Order Timeline
                </span>
                <h3 className="text-xl font-bold text-stone-900 font-serif mt-0.5">
                  {formatDate(todayOrder.date)}
                </h3>
              </div>
              <span className="bg-brand-100 text-brand-800 text-xs font-extrabold px-3.5 py-1 rounded-full uppercase">
                {todayOrder.status.replace('_', ' ')}
              </span>
            </div>

            {/* Visual Timeline Steps */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 py-4 border-b border-stone-100 mb-6 text-center text-xs">
              <div className={`p-3 rounded-2xl ${['pending', 'preparing', 'out_for_delivery', 'delivered'].includes(todayOrder.status) ? 'bg-brand-50 text-brand-800 font-bold border border-brand-200' : 'bg-stone-50 text-stone-400'}`}>
                <Clock className="w-4 h-4 mx-auto mb-1" />
                <span>1. Confirmed</span>
              </div>

              <div className={`p-3 rounded-2xl ${['preparing', 'out_for_delivery', 'delivered'].includes(todayOrder.status) ? 'bg-amber-50 text-amber-800 font-bold border border-amber-200' : 'bg-stone-50 text-stone-400'}`}>
                <ChefHat className="w-4 h-4 mx-auto mb-1" />
                <span>2. Preparing</span>
              </div>

              <div className={`p-3 rounded-2xl ${['out_for_delivery', 'delivered'].includes(todayOrder.status) ? 'bg-orange-50 text-orange-800 font-bold border border-orange-200' : 'bg-stone-50 text-stone-400'}`}>
                <Truck className="w-4 h-4 mx-auto mb-1" />
                <span>3. On The Way</span>
              </div>

              <div className={`p-3 rounded-2xl ${todayOrder.status === 'delivered' ? 'bg-emerald-50 text-emerald-800 font-bold border border-emerald-200' : 'bg-stone-50 text-stone-400'}`}>
                <CheckCircle2 className="w-4 h-4 mx-auto mb-1" />
                <span>4. Delivered</span>
              </div>

              <div className={`p-3 rounded-2xl ${todayOrder.received_status ? 'bg-emerald-100 text-emerald-900 font-extrabold border border-emerald-300' : 'bg-stone-50 text-stone-400'}`}>
                <Utensils className="w-4 h-4 mx-auto mb-1" />
                <span>5. Confirmed</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <p className="text-xs text-stone-600">
                <span className="font-semibold text-stone-900">Address:</span> {todayOrder.delivery_address}, {todayOrder.area}
              </p>

              {todayOrder.status === 'delivered' && !todayOrder.received_status && (
                <button
                  onClick={() => handleConfirmReceived(todayOrder.id)}
                  disabled={actionLoading}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-xs transition-colors"
                >
                  Confirm Meal Received ✓
                </button>
              )}
            </div>
          </div>
        )}

        {/* Orders Filter & List */}
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-lg font-bold text-stone-900 font-serif">Delivery History</h3>
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-stone-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-white border border-stone-200 rounded-xl px-3 py-1.5 text-xs font-semibold text-stone-700 outline-none"
            >
              <option value="all">All Statuses</option>
              <option value="delivered">Delivered</option>
              <option value="pending">Pending</option>
              <option value="preparing">Preparing</option>
              <option value="out_for_delivery">Out for Delivery</option>
              <option value="skipped">Skipped</option>
            </select>
          </div>
        </div>

        {filteredOrders.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredOrders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onConfirmReceived={handleConfirmReceived}
                onSkipOrder={handleSkipOrder}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-12 text-center border border-stone-200">
            <Utensils className="w-10 h-10 text-stone-300 mx-auto mb-3" />
            <h4 className="font-bold text-stone-800 text-base">No orders found</h4>
            <p className="text-xs text-stone-500 mt-1">
              Your daily meal orders will appear here as your subscription generates them.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
