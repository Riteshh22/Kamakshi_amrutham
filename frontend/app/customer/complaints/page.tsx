"use client";

import { useEffect, useState } from 'react';
import { Sidebar } from '@/components/sidebar';
import { submitComplaint, getMyComplaints, getOrders } from '@/lib/api';
import { Complaint, ComplaintStatus } from '@/types/complaint';
import { DailyOrder } from '@/types/order';
import { formatDate } from '@/lib/utils';
import { AlertTriangle, ShieldAlert, CheckCircle, Clock, XCircle, MessageSquare } from 'lucide-react';

export default function CustomerComplaintsPage() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [orders, setOrders] = useState<DailyOrder[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    loadComplaintsData();
  }, []);

  const loadComplaintsData = async () => {
    try {
      setLoading(true);
      const [myComp, allOrders] = await Promise.all([
        getMyComplaints().catch(() => []),
        getOrders().catch(() => []),
      ]);

      setComplaints(myComp);
      setOrders(allOrders);
      if (allOrders.length > 0) {
        setSelectedOrder(allOrders[0].id);
      }
    } catch (err: any) {
      console.error('Failed to load complaints data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder || !description.trim()) {
      setMessage({ type: 'error', text: 'Please select an order and describe your issue.' });
      return;
    }

    try {
      setSubmitting(true);
      setMessage(null);

      await submitComplaint({
        order_id: selectedOrder,
        description,
      });

      setMessage({ type: 'success', text: 'Complaint registered successfully. Our operations team will review it.' });
      setDescription('');
      loadComplaintsData();
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to submit complaint.' });
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = (status: ComplaintStatus) => {
    switch (status) {
      case 'pending':
        return { label: 'Pending Review', bg: 'bg-amber-50 text-amber-800 border-amber-200', icon: Clock };
      case 'in_progress':
        return { label: 'In Progress', bg: 'bg-blue-50 text-blue-800 border-blue-200', icon: AlertTriangle };
      case 'resolved':
        return { label: 'Resolved', bg: 'bg-emerald-50 text-emerald-800 border-emerald-200', icon: CheckCircle };
      case 'rejected':
        return { label: 'Rejected', bg: 'bg-stone-100 text-stone-600 border-stone-200', icon: XCircle };
      default:
        return { label: status, bg: 'bg-stone-50 text-stone-700 border-stone-200', icon: Clock };
    }
  };

  return (
    <div className="flex min-h-screen bg-cream-50">
      <Sidebar mode="customer" />

      <main className="flex-1 p-4 sm:p-8 max-w-4xl mx-auto w-full">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-stone-900 font-serif">
            Raise a Complaint / Issue
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Report delivery delays, missing items, or packaging concerns for immediate resolution
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

        {/* Raise Complaint Form */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs mb-10">
          <h3 className="text-xl font-bold text-stone-900 font-serif mb-2 flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <span>Submit a New Complaint</span>
          </h3>
          <p className="text-xs text-stone-500 mb-6">
            Select the relevant daily order and detail what went wrong.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                Select Order
              </label>
              <select
                value={selectedOrder}
                onChange={(e) => setSelectedOrder(e.target.value)}
                className="w-full px-4 py-3 border border-stone-300 rounded-xl text-sm focus:ring-2 focus:ring-brand-500 outline-none bg-white"
              >
                {orders.map((order) => (
                  <option key={order.id} value={order.id}>
                    Order on {formatDate(order.date)} — Status: {order.status} ({order.area})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                Complaint Description
              </label>
              <textarea
                rows={4}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Please describe your issue (e.g. Late delivery after 2:00 PM, spilled curry container, missing Phulka)..."
                className="w-full px-4 py-3 border border-stone-300 rounded-xl text-sm focus:ring-2 focus:ring-brand-500 outline-none"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={submitting}
                className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs py-3 px-6 rounded-xl shadow-xs transition-colors"
              >
                {submitting ? 'Submitting...' : 'Register Complaint'}
              </button>
            </div>
          </form>
        </div>

        {/* Previous Complaints History */}
        <div>
          <h3 className="text-lg font-bold text-stone-900 font-serif mb-4">
            Complaint Tracker & History
          </h3>

          {complaints.length > 0 ? (
            <div className="space-y-4">
              {complaints.map((comp) => {
                const statusBadge = getStatusBadge(comp.status);
                const StatusIcon = statusBadge.icon;

                return (
                  <div key={comp.id} className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-4">
                    <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                      <div>
                        <span className="text-xs text-stone-400">Complaint ID: #{comp.id.slice(0, 8)}</span>
                        <h4 className="font-bold text-stone-900 text-sm">
                          Submitted on {formatDate(comp.created_at)}
                        </h4>
                      </div>
                      <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-bold border ${statusBadge.bg}`}>
                        <StatusIcon className="w-3.5 h-3.5" />
                        <span>{statusBadge.label}</span>
                      </span>
                    </div>

                    <div>
                      <p className="text-xs font-semibold text-stone-800">Issue Description:</p>
                      <p className="text-xs text-stone-600 mt-1 leading-relaxed">{comp.description}</p>
                    </div>

                    {/* Admin Response Section */}
                    {comp.admin_response ? (
                      <div className="p-4 bg-stone-900 text-stone-100 rounded-2xl text-xs space-y-1">
                        <div className="flex items-center space-x-2 text-brand-400 font-bold">
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>Admin / Operations Response:</span>
                        </div>
                        <p className="text-stone-300 leading-relaxed">{comp.admin_response}</p>
                      </div>
                    ) : (
                      <p className="text-[11px] text-stone-400 italic">
                        Awaiting response from Kamakshi Amrutham operations team...
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-xs text-stone-500 py-6 text-center bg-white rounded-2xl border border-stone-200">
              No active or past complaints registered.
            </p>
          )}
        </div>
      </main>
    </div>
  );
}
