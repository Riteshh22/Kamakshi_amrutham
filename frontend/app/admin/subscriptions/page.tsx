"use client";

import { useEffect, useState } from 'react';
import { Sidebar } from '@/components/sidebar';
import { getAdminSubscriptions } from '@/lib/api';
import { Subscription } from '@/types/subscription';
import { formatDate, formatCurrency } from '@/lib/utils';
import { CalendarCheck, Filter, AlertCircle } from 'lucide-react';

const mockAdminSubscriptions: Subscription[] = [
  {
    id: 'sub-1',
    user_id: 'usr-1',
    plan_id: 'monthly',
    status: 'active',
    start_date: '2026-02-01',
    end_date: '2026-03-03',
    created_at: '2026-02-01T10:00:00Z',
    plan: {
      id: 'monthly',
      name: 'Monthly Subscription',
      price: 5500,
      duration_days: 30,
      description: '30 days meal plan',
      features: [],
    },
  },
  {
    id: 'sub-2',
    user_id: 'usr-2',
    plan_id: 'monthly',
    status: 'active',
    start_date: '2026-01-20',
    end_date: '2026-02-19',
    created_at: '2026-01-20T09:00:00Z',
    plan: {
      id: 'monthly',
      name: 'Monthly Subscription',
      price: 5500,
      duration_days: 30,
      description: '30 days meal plan',
      features: [],
    },
  },
  {
    id: 'sub-3',
    user_id: 'usr-3',
    plan_id: 'daily',
    status: 'expired',
    start_date: '2026-02-10',
    end_date: '2026-02-11',
    created_at: '2026-02-10T14:20:00Z',
    plan: {
      id: 'daily',
      name: 'Daily Trial',
      price: 219,
      duration_days: 1,
      description: 'Single day meal plan',
      features: [],
    },
  },
];

export default function AdminSubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(mockAdminSubscriptions);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    async function fetchSubs() {
      try {
        setLoading(true);
        const data = await getAdminSubscriptions(statusFilter === 'all' ? undefined : statusFilter).catch(() => null);
        if (data && data.length > 0) {
          setSubscriptions(data);
        }
      } catch (err) {
        console.error('Failed to fetch admin subscriptions:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchSubs();
  }, [statusFilter]);

  const filteredSubs = subscriptions.filter((s) => {
    if (statusFilter === 'all') return true;
    return s.status === statusFilter;
  });

  return (
    <div className="flex min-h-screen bg-stone-900 text-stone-100">
      <Sidebar mode="admin" />

      <main className="flex-1 p-4 sm:p-8 max-w-7xl mx-auto w-full">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold font-serif text-white">
              Customer Subscriptions
            </h1>
            <p className="text-xs text-stone-400 mt-1">
              Active meal plans, expiration dates, and renewal status monitoring
            </p>
          </div>

          {/* Filter */}
          <div className="flex items-center space-x-2 bg-stone-800 border border-stone-700 rounded-xl px-3 py-1.5">
            <Filter className="w-4 h-4 text-stone-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent text-xs font-bold text-white outline-none"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active Plans</option>
              <option value="expired">Expired Plans</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Subscriptions Table */}
        <div className="bg-stone-800 border border-stone-700 rounded-3xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-stone-300">
              <thead className="bg-stone-900/90 text-stone-400 uppercase tracking-wider text-[11px] font-bold border-b border-stone-700">
                <tr>
                  <th className="py-4 px-6">Subscription ID</th>
                  <th className="py-4 px-6">Plan Name</th>
                  <th className="py-4 px-6">Amount</th>
                  <th className="py-4 px-6">Start Date</th>
                  <th className="py-4 px-6">End Date</th>
                  <th className="py-4 px-6">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-700/60">
                {filteredSubs.map((sub) => (
                  <tr key={sub.id} className="hover:bg-stone-750 transition-colors">
                    <td className="py-4 px-6 font-mono text-stone-400">#{sub.id.slice(0, 8)}</td>
                    <td className="py-4 px-6 font-bold text-white">
                      {sub.plan?.name || 'Monthly Subscription'}
                    </td>
                    <td className="py-4 px-6 font-semibold text-brand-300">
                      {formatCurrency(sub.plan?.price || 5500)}
                    </td>
                    <td className="py-4 px-6 text-stone-300">{formatDate(sub.start_date)}</td>
                    <td className="py-4 px-6 text-stone-300">{formatDate(sub.end_date)}</td>
                    <td className="py-4 px-6">
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase border ${
                          sub.status === 'active'
                            ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                            : 'bg-stone-900 text-stone-400 border-stone-700'
                        }`}
                      >
                        {sub.status}
                      </span>
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
