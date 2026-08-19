"use client";

import { useEffect, useState } from 'react';
import { Sidebar } from '@/components/sidebar';
import { getAdminPayments } from '@/lib/api';
import { Payment } from '@/types/payment';
import { formatDate, formatCurrency } from '@/lib/utils';
import { CreditCard, AlertCircle, CheckCircle2, Info } from 'lucide-react';

const mockPayments: Payment[] = [
  {
    id: 'pay-1',
    user_id: 'usr-1',
    subscription_id: 'sub-1',
    amount: 5500,
    payment_method: 'UPI / Card',
    transaction_id: 'txn_987654321',
    status: 'paid',
    paid_at: '2026-02-01T10:05:00Z',
    created_at: '2026-02-01T10:00:00Z',
    customer_name: 'Ramesh Kumar',
    plan_name: 'Monthly Subscription',
  },
  {
    id: 'pay-2',
    user_id: 'usr-2',
    subscription_id: 'sub-2',
    amount: 5500,
    payment_method: 'Net Banking',
    transaction_id: 'txn_123456789',
    status: 'paid',
    paid_at: '2026-01-20T09:10:00Z',
    created_at: '2026-01-20T09:00:00Z',
    customer_name: 'Priya Sharma',
    plan_name: 'Monthly Subscription',
  },
  {
    id: 'pay-3',
    user_id: 'usr-3',
    subscription_id: 'sub-3',
    amount: 219,
    payment_method: 'UPI',
    transaction_id: 'txn_555444333',
    status: 'paid',
    paid_at: '2026-02-10T14:25:00Z',
    created_at: '2026-02-10T14:20:00Z',
    customer_name: 'Suresh Reddy',
    plan_name: 'Daily Trial',
  },
];

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>(mockPayments);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchPayments() {
      try {
        setLoading(true);
        const data = await getAdminPayments().catch(() => null);
        if (data && data.length > 0) {
          setPayments(data);
        }
      } catch (err) {
        console.error('Failed to fetch admin payments:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchPayments();
  }, []);

  return (
    <div className="flex min-h-screen bg-stone-900 text-stone-100">
      <Sidebar mode="admin" />

      <main className="flex-1 p-4 sm:p-8 max-w-7xl mx-auto w-full">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold font-serif text-white">
            Payments & Transactions
          </h1>
          <p className="text-xs text-stone-400 mt-1">
            Audit subscription payments, transaction IDs, and settlement records
          </p>
        </div>

        {/* Razorpay Deferred Notice Banner */}
        <div className="mb-8 p-4 bg-amber-950/60 border border-amber-800 rounded-2xl flex items-start space-x-3 text-amber-200 text-xs">
          <Info className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold block">Payment Gateway Note:</span>
            <span>
              Payment architecture is prepared. Live Razorpay webhooks and direct automated verification will be plugged in during the upcoming payment integration phase.
            </span>
          </div>
        </div>

        {/* Payments Table */}
        <div className="bg-stone-800 border border-stone-700 rounded-3xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-stone-300">
              <thead className="bg-stone-900/90 text-stone-400 uppercase tracking-wider text-[11px] font-bold border-b border-stone-700">
                <tr>
                  <th className="py-4 px-6">Customer</th>
                  <th className="py-4 px-6">Plan</th>
                  <th className="py-4 px-6">Amount</th>
                  <th className="py-4 px-6">Payment Method</th>
                  <th className="py-4 px-6">Transaction ID</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6">Paid Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-700/60">
                {payments.map((p) => (
                  <tr key={p.id} className="hover:bg-stone-750 transition-colors">
                    <td className="py-4 px-6 font-bold text-white">
                      {p.customer_name || 'Customer'}
                    </td>
                    <td className="py-4 px-6 font-semibold text-brand-300">
                      {p.plan_name || 'Monthly Subscription'}
                    </td>
                    <td className="py-4 px-6 font-bold text-white">
                      {formatCurrency(p.amount)}
                    </td>
                    <td className="py-4 px-6 text-stone-400">{p.payment_method}</td>
                    <td className="py-4 px-6 font-mono text-stone-400">{p.transaction_id}</td>
                    <td className="py-4 px-6">
                      <span className="bg-emerald-950 text-emerald-300 border border-emerald-800 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase">
                        {p.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-stone-400">{formatDate(p.paid_at)}</td>
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
