"use client";

import { useEffect, useState } from 'react';
import { Sidebar } from '@/components/sidebar';
import { getAdminComplaints, updateAdminComplaint } from '@/lib/api';
import { Complaint, ComplaintStatus } from '@/types/complaint';
import { formatDate } from '@/lib/utils';
import { ShieldAlert, AlertTriangle, CheckCircle, Clock, Send, MessageSquare } from 'lucide-react';

const mockAdminComplaints: Complaint[] = [
  {
    id: 'cmp-1',
    user_id: 'usr-2',
    order_id: 'ord-102',
    description: 'Delivery was delayed until 2:10 PM. Lunch hour was almost over.',
    status: 'pending',
    created_at: '2026-02-15T14:30:00Z',
    customer_name: 'Priya Sharma',
  },
  {
    id: 'cmp-2',
    user_id: 'usr-3',
    order_id: 'ord-103',
    description: 'Curry container lid was loosely sealed and leaked inside the box during transit.',
    status: 'in_progress',
    admin_response: 'Investigating with Kukatpally delivery partner team.',
    created_at: '2026-02-14T15:00:00Z',
    customer_name: 'Suresh Reddy',
  },
];

export default function AdminComplaintsPage() {
  const [complaints, setComplaints] = useState<Complaint[]>(mockAdminComplaints);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [responseInput, setResponseInput] = useState<string>('');
  const [statusInput, setStatusInput] = useState<ComplaintStatus>('in_progress');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function fetchComplaints() {
      try {
        setLoading(true);
        const data = await getAdminComplaints().catch(() => null);
        if (data && data.length > 0) {
          setComplaints(data);
        }
      } catch (err) {
        console.error('Failed to fetch admin complaints:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchComplaints();
  }, []);

  const handleOpenEdit = (comp: Complaint) => {
    setEditingId(comp.id);
    setStatusInput(comp.status);
    setResponseInput(comp.admin_response || '');
  };

  const handleSaveResponse = async (id: string) => {
    try {
      setSubmitting(true);
      await updateAdminComplaint(id, {
        status: statusInput,
        admin_response: responseInput,
      }).catch(() => null);

      setComplaints((prev) =>
        prev.map((c) =>
          c.id === id ? { ...c, status: statusInput, admin_response: responseInput } : c
        )
      );

      setEditingId(null);
    } catch (err) {
      console.error('Failed to update complaint:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-stone-900 text-stone-100">
      <Sidebar mode="admin" />

      <main className="flex-1 p-4 sm:p-8 max-w-7xl mx-auto w-full">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold font-serif text-white">
            Customer Complaints Management
          </h1>
          <p className="text-xs text-stone-400 mt-1">
            Review delivery issues, assign investigation status, and compose responses for customers
          </p>
        </div>

        {/* Complaints Cards List */}
        <div className="space-y-6">
          {complaints.map((comp) => (
            <div key={comp.id} className="bg-stone-800 border border-stone-700/80 rounded-3xl p-6 shadow-xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-700 pb-4">
                <div>
                  <span className="text-xs font-bold text-brand-400">
                    Customer: {comp.customer_name || 'Subscriber'}
                  </span>
                  <p className="text-xs text-stone-400">
                    Complaint ID: #{comp.id.slice(0, 8)} • Order: #{comp.order_id.slice(0, 8)} • Date: {formatDate(comp.created_at)}
                  </p>
                </div>

                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold uppercase border shrink-0 ${
                    comp.status === 'pending'
                      ? 'bg-amber-950 text-amber-300 border-amber-800'
                      : comp.status === 'in_progress'
                      ? 'bg-blue-950 text-blue-300 border-blue-800'
                      : comp.status === 'resolved'
                      ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                      : 'bg-stone-900 text-stone-400 border-stone-700'
                  }`}
                >
                  {comp.status.replace('_', ' ')}
                </span>
              </div>

              <div>
                <p className="text-xs font-bold text-stone-400 uppercase mb-1">Issue Description:</p>
                <p className="text-sm text-stone-200 bg-stone-900/80 p-3 rounded-2xl border border-stone-750">
                  {comp.description}
                </p>
              </div>

              {comp.admin_response && editingId !== comp.id && (
                <div>
                  <p className="text-xs font-bold text-brand-400 uppercase mb-1">Posted Admin Response:</p>
                  <p className="text-xs text-stone-300 bg-stone-900/40 p-3 rounded-2xl border border-stone-750">
                    {comp.admin_response}
                  </p>
                </div>
              )}

              {/* Action / Edit Section */}
              {editingId === comp.id ? (
                <div className="p-4 bg-stone-900 rounded-2xl border border-stone-700 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-stone-400 uppercase mb-1">
                        Update Status
                      </label>
                      <select
                        value={statusInput}
                        onChange={(e) => setStatusInput(e.target.value as ComplaintStatus)}
                        className="w-full px-3 py-2 bg-stone-800 border border-stone-700 rounded-xl text-xs text-white outline-none"
                      >
                        <option value="pending">Pending</option>
                        <option value="in_progress">In Progress</option>
                        <option value="resolved">Resolved</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-400 uppercase mb-1">
                      Compose Admin Response
                    </label>
                    <textarea
                      rows={2}
                      value={responseInput}
                      onChange={(e) => setResponseInput(e.target.value)}
                      placeholder="Write response message visible to customer..."
                      className="w-full px-3 py-2 bg-stone-800 border border-stone-700 rounded-xl text-xs text-white outline-none"
                    />
                  </div>

                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => setEditingId(null)}
                      className="px-3 py-1.5 text-xs text-stone-400 hover:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleSaveResponse(comp.id)}
                      disabled={submitting}
                      className="bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs px-4 py-1.5 rounded-xl shadow-xs"
                    >
                      Save Status & Response
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex justify-end pt-2">
                  <button
                    onClick={() => handleOpenEdit(comp)}
                    className="bg-stone-700 hover:bg-stone-600 text-white font-bold text-xs px-4 py-2 rounded-xl transition-colors"
                  >
                    Respond / Update Status
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
