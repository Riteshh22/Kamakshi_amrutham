"use client";

import { useEffect, useState } from 'react';
import { Sidebar } from '@/components/sidebar';
import { SubscriptionCard } from '@/components/subscription-card';
import {
  getPlans,
  getCurrentSubscription,
  createSubscription,
  cancelSubscription,
  pauseSubscription,
  getSubscriptionPauses,
  resumeSubscriptionPause,
} from '@/lib/api';
import { SubscriptionPlan, Subscription } from '@/types/subscription';
import { SubscriptionPause } from '@/types/subscription-pause';
import { formatDate, formatCurrency } from '@/lib/utils';
import { PauseCircle, AlertCircle, Loader2 } from 'lucide-react';

export default function CustomerSubscriptionPage() {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [currentSub, setCurrentSub] = useState<Subscription | null>(null);
  const [pauses, setPauses] = useState<SubscriptionPause[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Pause Form state
  const [showPauseModal, setShowPauseModal] = useState(false);
  const [pauseForm, setPauseForm] = useState({
    startDate: '',
    endDate: '',
    reason: 'Out of town',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      // Fetch plans strictly from the database via backend API
      const [plansData, subData] = await Promise.all([
        getPlans().catch((err) => {
          console.error('Failed to load plans from database:', err);
          return [];
        }),
        getCurrentSubscription().catch((err) => {
          console.error('Failed to load current subscription:', err);
          return null;
        }),
      ]);

      setPlans(plansData);
      setCurrentSub(subData);

      if (subData?.id) {
        const pauseList = await getSubscriptionPauses(subData.id).catch(() => []);
        setPauses(pauseList);
      }
    } catch (err: any) {
      console.error('Subscription page load error:', err);
      setMessage({ type: 'error', text: 'Unable to load subscription details. Please refresh.' });
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async (planId: string) => {
    try {
      setActionLoading(true);
      setMessage(null);
      const newSub = await createSubscription(planId);
      setCurrentSub(newSub);
      setMessage({ type: 'success', text: 'Subscription created & activated successfully!' });
      loadData();
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to subscribe.' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!currentSub) return;
    if (!confirm('Are you sure you want to cancel your active subscription?')) return;

    try {
      setActionLoading(true);
      const updated = await cancelSubscription(currentSub.id);
      setCurrentSub(updated);
      setMessage({ type: 'success', text: 'Subscription cancelled.' });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to cancel subscription.' });
    } finally {
      setActionLoading(false);
    }
  };

  const handlePauseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentSub) return;

    try {
      setActionLoading(true);
      await pauseSubscription(currentSub.id, {
        subscription_id: currentSub.id,
        start_date: pauseForm.startDate,
        end_date: pauseForm.endDate,
        reason: pauseForm.reason,
      });

      setMessage({ type: 'success', text: 'Subscription pause range scheduled successfully!' });
      setShowPauseModal(false);
      loadData();
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to pause subscription.' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleResumePause = async (pauseId: string) => {
    if (!currentSub) return;
    try {
      setActionLoading(true);
      await resumeSubscriptionPause(currentSub.id, pauseId);
      setMessage({ type: 'success', text: 'Pause range removed. Deliveries resumed.' });
      loadData();
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to resume subscription.' });
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-cream-50">
      <Sidebar mode="customer" />

      <main className="flex-1 p-4 sm:p-8 max-w-7xl mx-auto w-full">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-stone-900 font-serif">
            My Subscription
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            View active plan details, pause dates, or choose a new plan
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

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center space-y-3">
              <Loader2 className="w-8 h-8 animate-spin text-brand-600" />
              <p className="text-xs text-stone-500 font-medium">Loading subscription plans...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Active Subscription Banner */}
            {currentSub && (
              <div className="mb-10 bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-6 mb-6">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-brand-700">
                      Current Active Plan
                    </span>
                    <h2 className="text-2xl font-bold text-stone-900 font-serif mt-1">
                      {currentSub.plan?.name || 'Active Subscription'}
                    </h2>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="bg-emerald-100 text-emerald-800 text-xs font-extrabold px-3 py-1 rounded-full uppercase">
                      {currentSub.status}
                    </span>
                    <button
                      onClick={() => setShowPauseModal(true)}
                      className="bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-xs font-bold px-4 py-2 rounded-xl transition-colors flex items-center space-x-1.5"
                    >
                      <PauseCircle className="w-4 h-4" />
                      <span>Pause Delivery Dates</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-stone-700 text-xs">
                  <div>
                    <span className="text-stone-400 block font-medium">Price</span>
                    <span className="font-bold text-stone-900 text-base">
                      {currentSub.plan?.price != null ? formatCurrency(currentSub.plan.price) : '—'}
                    </span>
                  </div>
                  <div>
                    <span className="text-stone-400 block font-medium">Start Date</span>
                    <span className="font-bold text-stone-900">{formatDate(currentSub.start_date)}</span>
                  </div>
                  <div>
                    <span className="text-stone-400 block font-medium">Expiry Date</span>
                    <span className="font-bold text-stone-900">{formatDate(currentSub.end_date)}</span>
                  </div>
                  <div>
                    <span className="text-stone-400 block font-medium">Pause Feature</span>
                    <span className="font-bold text-emerald-700">Active & Available</span>
                  </div>
                </div>

                {/* Scheduled Pauses */}
                {pauses.length > 0 && (
                  <div className="mt-6 pt-6 border-t border-stone-100">
                    <h3 className="text-xs font-bold text-stone-700 uppercase tracking-wider mb-3">
                      Scheduled Subscription Pauses
                    </h3>
                    <div className="space-y-2">
                      {pauses.map((p) => (
                        <div
                          key={p.id}
                          className="p-3 bg-amber-50 rounded-xl border border-amber-200 flex items-center justify-between text-xs text-amber-900"
                        >
                          <div>
                            <span className="font-bold">
                              {formatDate(p.start_date)} – {formatDate(p.end_date)}
                            </span>
                            {p.reason && <span className="ml-2 text-amber-700">({p.reason})</span>}
                          </div>
                          <button
                            onClick={() => handleResumePause(p.id)}
                            disabled={actionLoading}
                            className="text-stone-700 font-bold hover:underline"
                          >
                            Remove Pause
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Subscription Plans Selection */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-stone-900 font-serif mb-2">
                Available Subscription Plans
              </h2>
              <p className="text-xs text-stone-500 mb-6">
                Choose or switch your vegetarian meal plan
              </p>

              {plans.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
                  {plans.map((plan) => (
                    <SubscriptionCard
                      key={plan.id}
                      plan={plan}
                      isPopular={plan.id.toLowerCase().includes('month') || plan.name.toLowerCase().includes('month')}
                      isActive={currentSub?.plan_id === plan.id}
                      onSubscribe={handleSubscribe}
                      loading={actionLoading}
                    />
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-3xl p-8 border border-stone-200 text-center">
                  <AlertCircle className="w-8 h-8 text-stone-400 mx-auto mb-3" />
                  <p className="text-sm font-semibold text-stone-700">No active plans found in the system.</p>
                  <p className="text-xs text-stone-500 mt-1">Please check back later or contact customer support.</p>
                </div>
              )}
            </div>
          </>
        )}

        {/* Pause Modal */}
        {showPauseModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-stone-200">
              <h3 className="text-xl font-bold text-stone-900 font-serif mb-2">
                Pause Meal Subscription
              </h3>
              <p className="text-xs text-stone-500 mb-6">
                Specify the date range during which you do not want lunch delivered.
              </p>

              <form onSubmit={handlePauseSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Start Pause Date
                  </label>
                  <input
                    type="date"
                    required
                    value={pauseForm.startDate}
                    onChange={(e) => setPauseForm({ ...pauseForm, startDate: e.target.value })}
                    className="w-full px-4 py-3 border border-stone-300 rounded-xl text-sm focus:ring-2 focus:ring-brand-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    End Pause Date
                  </label>
                  <input
                    type="date"
                    required
                    value={pauseForm.endDate}
                    onChange={(e) => setPauseForm({ ...pauseForm, endDate: e.target.value })}
                    className="w-full px-4 py-3 border border-stone-300 rounded-xl text-sm focus:ring-2 focus:ring-brand-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Reason (Optional)
                  </label>
                  <input
                    type="text"
                    value={pauseForm.reason}
                    onChange={(e) => setPauseForm({ ...pauseForm, reason: e.target.value })}
                    placeholder="e.g. Travelling / Out of office"
                    className="w-full px-4 py-3 border border-stone-300 rounded-xl text-sm focus:ring-2 focus:ring-brand-500 outline-none"
                  />
                </div>

                <div className="pt-4 flex items-center justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowPauseModal(false)}
                    className="px-4 py-2.5 text-xs font-semibold text-stone-600 hover:text-stone-900"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={actionLoading}
                    className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-xs"
                  >
                    Confirm Pause Range
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
