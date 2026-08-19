"use client";

import { useEffect, useState } from 'react';
import { Sidebar } from '@/components/sidebar';
import { submitFeedback, getMyFeedback, getOrders } from '@/lib/api';
import { Feedback } from '@/types/feedback';
import { DailyOrder } from '@/types/order';
import { formatDate } from '@/lib/utils';
import { Star, MessageSquare, CheckCircle, AlertCircle, Utensils } from 'lucide-react';

export default function CustomerFeedbackPage() {
  const [feedbackList, setFeedbackList] = useState<Feedback[]>([]);
  const [deliveredOrders, setDeliveredOrders] = useState<DailyOrder[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<string>('');
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    loadFeedbackData();
  }, []);

  const loadFeedbackData = async () => {
    try {
      setLoading(true);
      const [myFb, allOrders] = await Promise.all([
        getMyFeedback().catch(() => []),
        getOrders().catch(() => []),
      ]);

      setFeedbackList(myFb);

      // Filter delivered orders that haven't received feedback yet
      const reviewedOrderIds = new Set(myFb.map((f) => f.order_id));
      const eligible = allOrders.filter(
        (o) => o.status === 'delivered' && !reviewedOrderIds.has(o.id)
      );

      setDeliveredOrders(eligible);
      if (eligible.length > 0) {
        setSelectedOrder(eligible[0].id);
      }
    } catch (err: any) {
      console.error('Failed to load feedback:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) {
      setMessage({ type: 'error', text: 'Please select a delivered meal order to review.' });
      return;
    }

    try {
      setSubmitting(true);
      setMessage(null);

      await submitFeedback({
        order_id: selectedOrder,
        rating,
        comment,
      });

      setMessage({ type: 'success', text: 'Thank you for your feedback! It helps us maintain meal quality.' });
      setComment('');
      loadFeedbackData();
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to submit feedback.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-cream-50">
      <Sidebar mode="customer" />

      <main className="flex-1 p-4 sm:p-8 max-w-4xl mx-auto w-full">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-stone-900 font-serif">
            Meal Feedback & Ratings
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Rate your daily lunches and share your experience with our kitchen team
          </p>
        </div>

        {message && (
          <div
            className={`mb-6 p-4 rounded-2xl text-xs font-medium flex items-center space-x-2 ${
              message.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}
          >
            {message.type === 'success' ? (
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            )}
            <span>{message.text}</span>
          </div>
        )}

        {/* Feedback Submission Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs mb-10">
          <h3 className="text-xl font-bold text-stone-900 font-serif mb-2">
            How was your recent meal?
          </h3>
          <p className="text-xs text-stone-500 mb-6">
            Select a delivered order below and leave a star rating.
          </p>

          {deliveredOrders.length > 0 ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Select Delivered Order
                </label>
                <select
                  value={selectedOrder}
                  onChange={(e) => setSelectedOrder(e.target.value)}
                  className="w-full px-4 py-3 border border-stone-300 rounded-xl text-sm focus:ring-2 focus:ring-brand-500 outline-none bg-white"
                >
                  {deliveredOrders.map((order) => (
                    <option key={order.id} value={order.id}>
                      Meal on {formatDate(order.date)} ({order.area})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                  Rating (1 to 5 Stars)
                </label>
                <div className="flex items-center space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="p-2 text-amber-400 hover:scale-110 transition-transform focus:outline-none"
                    >
                      <Star
                        className={`w-8 h-8 ${
                          star <= rating ? 'fill-amber-400 text-amber-400' : 'text-stone-300'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-sm font-bold text-stone-700 ml-2">
                    {rating} / 5 Stars
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Comments or Suggestions (Optional)
                </label>
                <textarea
                  rows={3}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Tell us about the taste, portion, temperature, or packaging..."
                  className="w-full px-4 py-3 border border-stone-300 rounded-xl text-sm focus:ring-2 focus:ring-brand-500 outline-none"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs py-3 px-6 rounded-xl shadow-xs transition-colors"
                >
                  {submitting ? 'Submitting Feedback...' : 'Submit Feedback'}
                </button>
              </div>
            </form>
          ) : (
            <div className="p-6 bg-stone-50 rounded-2xl text-center border border-stone-100">
              <CheckCircle className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
              <p className="text-sm font-semibold text-stone-800">All delivered meals reviewed!</p>
              <p className="text-xs text-stone-500 mt-1">
                You have submitted feedback for all your delivered orders. Check back after your next delivery!
              </p>
            </div>
          )}
        </div>

        {/* Previous Feedback List */}
        <div>
          <h3 className="text-lg font-bold text-stone-900 font-serif mb-4">
            Your Submitted Feedback
          </h3>

          {feedbackList.length > 0 ? (
            <div className="space-y-4">
              {feedbackList.map((fb) => (
                <div key={fb.id} className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-1 text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < fb.rating ? 'fill-amber-400 text-amber-400' : 'text-stone-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-stone-400">{formatDate(fb.created_at)}</span>
                  </div>
                  {fb.comment && (
                    <p className="text-xs text-stone-700 italic">"{fb.comment}"</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-stone-500 py-6 text-center bg-white rounded-2xl border border-stone-200">
              No feedback submitted yet.
            </p>
          )}
        </div>
      </main>
    </div>
  );
}
