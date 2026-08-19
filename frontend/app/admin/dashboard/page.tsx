"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/sidebar';
import { formatCurrency } from '@/lib/utils';
import {
  Utensils,
  CheckCircle2,
  Clock,
  AlertCircle,
  Users,
  CreditCard,
  Star,
  ShieldAlert,
  TrendingUp,
  BarChart2,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://kamakshi-amrutham.onrender.com';

interface DashboardStats {
  today_orders: number;
  delivered: number;
  pending: number;
  skipped: number;
  active_subscribers: number;
  today_revenue: number;
  average_rating: number;
  open_complaints: number;
  total_customers: number;
  date?: string;
}

const EMPTY_STATS: DashboardStats = {
  today_orders: 0, delivered: 0, pending: 0, skipped: 0,
  active_subscribers: 0, today_revenue: 0, average_rating: 0,
  open_complaints: 0, total_customers: 0,
};

function StatCard({
  label, value, sub, icon: Icon, color = 'text-white',
}: { label: string; value: React.ReactNode; sub?: string; icon: any; color?: string }) {
  return (
    <div className="bg-stone-800 border border-stone-700/80 rounded-2xl p-5 shadow-sm">
      <div className="flex items-center justify-between text-stone-400 mb-2">
        <span className="text-xs font-bold uppercase tracking-wide">{label}</span>
        <Icon className={`w-4 h-4 ${color}`} />
      </div>
      <p className={`text-3xl font-extrabold font-serif ${color}`}>{value}</p>
      {sub && <p className="text-[11px] text-stone-400 mt-1">{sub}</p>}
    </div>
  );
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats>(EMPTY_STATS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = sessionStorage.getItem('admin_access_token');
    if (!token) {
      router.push('/admin/login');
      return;
    }

    async function loadStats() {
      const token = sessionStorage.getItem('admin_access_token');
      try {
        setLoading(true);
        const res = await fetch(`${API_URL}/api/admin/dashboard`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.status === 401 || res.status === 403) {
          sessionStorage.removeItem('admin_access_token');
          router.push('/admin/login');
          return;
        }
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setStats(data);
      } catch (err: any) {
        setError('Failed to load dashboard data. Please refresh.');
        console.error('Dashboard load error:', err);
      } finally {
        setLoading(false);
      }
    }

    loadStats();
  }, [router]);

  // Build chart data from real stats — only bar chart (no hardcoded mock series)
  const subscriptionBreakdown = [
    { name: 'Active Subs', value: stats.active_subscribers, color: '#16a34a' },
    { name: 'Total Customers', value: stats.total_customers, color: '#8b5cf6' },
  ].filter((d) => d.value > 0);

  const deliveryBreakdown = [
    { name: 'Delivered', value: stats.delivered, color: '#22c55e' },
    { name: 'Pending', value: stats.pending, color: '#f59e0b' },
    { name: 'Skipped', value: stats.skipped, color: '#6b7280' },
  ];

  return (
    <div className="flex min-h-screen bg-stone-900 text-stone-100">
      <Sidebar mode="admin" />

      <main className="flex-1 p-4 sm:p-8 max-w-7xl mx-auto w-full">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-brand-400">
              Operations Control
            </span>
            <h1 className="text-3xl font-extrabold font-serif text-white mt-1">
              Admin Operations Dashboard
            </h1>
            <p className="text-xs text-stone-400 mt-1">
              Real-time delivery status, order fulfillment, and subscription analytics for Hyderabad
            </p>
          </div>
          {stats.date && (
            <span className="text-xs text-stone-500 bg-stone-800 px-3 py-1.5 rounded-lg border border-stone-700">
              📅 {stats.date}
            </span>
          )}
        </div>

        {error && (
          <div className="mb-6 bg-red-950/80 border border-red-800 text-red-300 p-4 rounded-2xl text-sm">
            {error}
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-stone-800 border border-stone-700/50 rounded-2xl p-5 animate-pulse h-24" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            <StatCard label="Today's Orders" value={stats.today_orders} sub="Hyderabad dispatches" icon={Utensils} color="text-white" />
            <StatCard label="Delivered" value={stats.delivered} sub="Confirmed received" icon={CheckCircle2} color="text-emerald-400" />
            <StatCard label="Pending / Transit" value={stats.pending} sub="Out for delivery" icon={Clock} color="text-amber-400" />
            <StatCard label="Active Subscribers" value={stats.active_subscribers} sub="Paying customers" icon={Users} color="text-white" />
            <StatCard label="Today's Revenue" value={formatCurrency(stats.today_revenue)} sub="Daily run-rate" icon={CreditCard} color="text-blue-400" />
            <StatCard
              label="Avg Food Rating"
              value={stats.average_rating > 0 ? `${stats.average_rating} ★` : '—'}
              sub={stats.average_rating > 0 ? 'Customer feedback' : 'No ratings yet'}
              icon={Star}
              color="text-amber-400"
            />
            <StatCard label="Open Complaints" value={stats.open_complaints} sub="Requires action" icon={ShieldAlert} color="text-red-400" />
            <StatCard label="Skipped Today" value={stats.skipped} sub="Marked by customer" icon={AlertCircle} color="text-stone-300" />
          </div>
        )}

        {/* Charts */}
        {!loading && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Today's Order Breakdown */}
            <div className="bg-stone-800 border border-stone-700/80 rounded-3xl p-6 lg:col-span-2">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-white font-serif flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4 text-brand-400" />
                  <span>Today's Delivery Status</span>
                </h3>
                <span className="text-xs text-stone-400">Hyderabad Hubs</span>
              </div>

              {stats.today_orders === 0 ? (
                <div className="h-64 flex flex-col items-center justify-center text-stone-500">
                  <BarChart2 className="w-10 h-10 mb-3 opacity-30" />
                  <p className="text-sm">No orders generated for today yet</p>
                </div>
              ) : (
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={deliveryBreakdown}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} />
                      <YAxis stroke="#9ca3af" fontSize={12} allowDecimals={false} />
                      <Tooltip contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#fff' }} />
                      <Bar dataKey="value" radius={[4, 4, 0, 0]} name="Orders">
                        {deliveryBreakdown.map((entry, index) => (
                          <Cell key={index} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>

            {/* Subscription Summary */}
            <div className="bg-stone-800 border border-stone-700/80 rounded-3xl p-6 flex flex-col justify-between">
              <h3 className="text-lg font-bold text-white font-serif mb-4">
                Subscriber Summary
              </h3>

              {stats.active_subscribers === 0 && stats.total_customers === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-stone-500">
                  <Users className="w-10 h-10 mb-3 opacity-30" />
                  <p className="text-sm text-center">No customer data yet</p>
                </div>
              ) : (
                <>
                  <div className="h-48 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={subscriptionBreakdown}
                          cx="50%"
                          cy="50%"
                          innerRadius={45}
                          outerRadius={75}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {subscriptionBreakdown.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151' }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="space-y-2 text-xs pt-4 border-t border-stone-700">
                    {subscriptionBreakdown.map((item, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                          <span className="text-stone-300">{item.name}</span>
                        </div>
                        <span className="font-bold text-white">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
