"use client";

import { useEffect, useState } from 'react';
import { Sidebar } from '@/components/sidebar';
import { getAdminOrdersToday, updateAdminOrderStatus } from '@/lib/api';
import { DailyOrder, OrderStatus } from '@/types/order';
import { Search, Filter, RefreshCw, CheckCircle2, Truck, ChefHat, Clock } from 'lucide-react';

const hyderabadAreas = [
  'All Areas',
  'Kukatpally',
  'Madhapur',
  'Ameerpet',
  'Miyapur',
  'Gachibowli',
  'Kondapur',
  'Hitec City',
  'Jubilee Hills',
  'Banjara Hills',
  'Begumpet',
  'KPHB Colony',
];

const mockAdminOrders: DailyOrder[] = [
  {
    id: 'ord-101',
    user_id: 'usr-1',
    subscription_id: 'sub-1',
    date: new Date().toISOString().split('T')[0],
    status: 'delivered',
    received_status: true,
    delivery_address: 'Flat 402, Fortune Towers, Mindspace Road',
    area: 'Madhapur',
    created_at: new Date().toISOString(),
    customer_name: 'Ramesh Kumar',
    phone: '+91 9876543210',
    subscription_plan_name: 'Monthly Plan',
    payment_status: 'paid',
  },
  {
    id: 'ord-102',
    user_id: 'usr-2',
    subscription_id: 'sub-2',
    date: new Date().toISOString().split('T')[0],
    status: 'out_for_delivery',
    received_status: false,
    delivery_address: 'Plot 88, KPHB Phase 3',
    area: 'Kukatpally',
    created_at: new Date().toISOString(),
    customer_name: 'Priya Sharma',
    phone: '+91 9123456789',
    subscription_plan_name: 'Monthly Plan',
    payment_status: 'paid',
  },
  {
    id: 'ord-103',
    user_id: 'usr-3',
    subscription_id: 'sub-3',
    date: new Date().toISOString().split('T')[0],
    status: 'preparing',
    received_status: false,
    delivery_address: 'H.No 12-5, Green Park Colony',
    area: 'Ameerpet',
    created_at: new Date().toISOString(),
    customer_name: 'Suresh Reddy',
    phone: '+91 9988776655',
    subscription_plan_name: 'Daily Trial',
    payment_status: 'paid',
  },
  {
    id: 'ord-104',
    user_id: 'usr-4',
    subscription_id: 'sub-4',
    date: new Date().toISOString().split('T')[0],
    status: 'pending',
    received_status: false,
    delivery_address: 'Villa 14, Prime Meadows',
    area: 'Miyapur',
    created_at: new Date().toISOString(),
    customer_name: 'Ananya Rao',
    phone: '+91 9445566778',
    subscription_plan_name: '3 Months Plan',
    payment_status: 'paid',
  },
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<DailyOrder[]>(mockAdminOrders);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedArea, setSelectedArea] = useState('All Areas');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, [selectedArea, selectedStatus]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await getAdminOrdersToday({
        area: selectedArea === 'All Areas' ? undefined : selectedArea,
        delivery_status: selectedStatus === 'all' ? undefined : selectedStatus,
      }).catch(() => null);

      if (data && data.length > 0) {
        setOrders(data);
      }
    } catch (err) {
      console.error('Failed to fetch admin orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    try {
      setUpdatingId(orderId);
      await updateAdminOrderStatus(orderId, newStatus).catch(() => null);
      
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
    } catch (err) {
      console.error('Failed to update order status:', err);
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      (order.customer_name?.toLowerCase().includes(search.toLowerCase()) ?? false) ||
      (order.phone?.includes(search) ?? false) ||
      (order.delivery_address?.toLowerCase().includes(search.toLowerCase()) ?? false);

    const matchesArea = selectedArea === 'All Areas' || order.area === selectedArea;
    const matchesStatus = selectedStatus === 'all' || order.status === selectedStatus;

    return matchesSearch && matchesArea && matchesStatus;
  });

  return (
    <div className="flex min-h-screen bg-stone-900 text-stone-100">
      <Sidebar mode="admin" />

      <main className="flex-1 p-4 sm:p-8 max-w-7xl mx-auto w-full">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold font-serif text-white">
              Today's Orders & Dispatch
            </h1>
            <p className="text-xs text-stone-400 mt-1">
              Live operational table for managing daily meal status across Hyderabad
            </p>
          </div>

          <button
            onClick={fetchOrders}
            className="inline-flex items-center space-x-2 bg-stone-800 hover:bg-stone-700 text-stone-200 px-4 py-2 rounded-xl text-xs font-semibold border border-stone-700 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh Table</span>
          </button>
        </div>

        {/* Filters Bar */}
        <div className="bg-stone-800 border border-stone-700 rounded-2xl p-4 mb-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search customer, phone, address..."
              className="w-full pl-9 pr-4 py-2 bg-stone-900 border border-stone-700 rounded-xl text-xs text-white focus:ring-2 focus:ring-brand-500 outline-none"
            />
          </div>

          {/* Area Filter */}
          <div>
            <select
              value={selectedArea}
              onChange={(e) => setSelectedArea(e.target.value)}
              className="w-full px-4 py-2 bg-stone-900 border border-stone-700 rounded-xl text-xs text-white focus:ring-2 focus:ring-brand-500 outline-none"
            >
              {hyderabadAreas.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-4 py-2 bg-stone-900 border border-stone-700 rounded-xl text-xs text-white focus:ring-2 focus:ring-brand-500 outline-none"
            >
              <option value="all">All Delivery Statuses</option>
              <option value="pending">Pending</option>
              <option value="preparing">Preparing</option>
              <option value="out_for_delivery">Out for Delivery</option>
              <option value="delivered">Delivered</option>
              <option value="skipped">Skipped</option>
            </select>
          </div>

        </div>

        {/* Operational Orders Table */}
        <div className="bg-stone-800 border border-stone-700 rounded-3xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-stone-300">
              <thead className="bg-stone-900/90 text-stone-400 uppercase tracking-wider text-[11px] font-bold border-b border-stone-700">
                <tr>
                  <th className="py-4 px-6">Customer</th>
                  <th className="py-4 px-6">Phone</th>
                  <th className="py-4 px-6">Subscription</th>
                  <th className="py-4 px-6">Payment</th>
                  <th className="py-4 px-6">Address & Area</th>
                  <th className="py-4 px-6">Delivery Status</th>
                  <th className="py-4 px-6">Received</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-700/60">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-stone-750 transition-colors">
                    <td className="py-4 px-6 font-bold text-white">
                      {order.customer_name || 'Customer'}
                    </td>
                    <td className="py-4 px-6 font-mono text-stone-400">
                      {order.phone || 'N/A'}
                    </td>
                    <td className="py-4 px-6 text-brand-300 font-semibold">
                      {order.subscription_plan_name || 'Monthly Plan'}
                    </td>
                    <td className="py-4 px-6">
                      <span className="bg-emerald-950 text-emerald-300 border border-emerald-800 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase">
                        {order.payment_status || 'Paid'}
                      </span>
                    </td>
                    <td className="py-4 px-6 max-w-xs truncate">
                      <span className="text-white block font-semibold">{order.area}</span>
                      <span className="text-stone-400 block text-[11px] truncate">
                        {order.delivery_address}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                        disabled={updatingId === order.id}
                        className="bg-stone-900 border border-stone-700 text-white font-bold px-3 py-1.5 rounded-xl text-xs focus:ring-2 focus:ring-brand-500 outline-none"
                      >
                        <option value="pending">Pending</option>
                        <option value="preparing">Preparing</option>
                        <option value="out_for_delivery">Out for Delivery</option>
                        <option value="delivered">Delivered</option>
                        <option value="skipped">Skipped</option>
                      </select>
                    </td>
                    <td className="py-4 px-6">
                      {order.received_status ? (
                        <span className="bg-emerald-900/80 text-emerald-200 border border-emerald-700 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold">
                          ✓ YES
                        </span>
                      ) : (
                        <span className="text-stone-500 text-[11px]">NO</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
