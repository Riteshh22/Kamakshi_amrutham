"use client";

import { useEffect, useState } from 'react';
import { Sidebar } from '@/components/sidebar';
import { getAdminFeedback } from '@/lib/api';
import { Feedback } from '@/types/feedback';
import { formatDate } from '@/lib/utils';
import { Star, MessageSquare, Filter } from 'lucide-react';

const mockAdminFeedback: Feedback[] = [
  {
    id: 'fb-1',
    user_id: 'usr-1',
    order_id: 'ord-101',
    rating: 5,
    comment: 'The Tadka Dal and Phulkas were hot and freshly made! Loved the homestyle taste.',
    created_at: '2026-02-15T13:30:00Z',
    customer_name: 'Ramesh Kumar',
    order_date: '2026-02-15',
  },
  {
    id: 'fb-2',
    user_id: 'usr-2',
    order_id: 'ord-102',
    rating: 4,
    comment: 'Good food quality, but delivery arrived at 1:15 PM. Would appreciate if delivered by 12:30 PM.',
    created_at: '2026-02-14T14:00:00Z',
    customer_name: 'Priya Sharma',
    order_date: '2026-02-14',
  },
  {
    id: 'fb-3',
    user_id: 'usr-3',
    order_id: 'ord-103',
    rating: 5,
    comment: 'Curd was super fresh and meal box was intact. Excellent lunchtime subscription.',
    created_at: '2026-02-13T13:45:00Z',
    customer_name: 'Suresh Reddy',
    order_date: '2026-02-13',
  },
];

export default function AdminFeedbackPage() {
  const [feedbackList, setFeedbackList] = useState<Feedback[]>(mockAdminFeedback);
  const [ratingFilter, setRatingFilter] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchFb() {
      try {
        setLoading(true);
        const data = await getAdminFeedback(ratingFilter || undefined).catch(() => null);
        if (data && data.length > 0) {
          setFeedbackList(data);
        }
      } catch (err) {
        console.error('Failed to fetch admin feedback:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchFb();
  }, [ratingFilter]);

  const filteredFb = feedbackList.filter((f) => {
    if (ratingFilter === 0) return true;
    return f.rating === ratingFilter;
  });

  const avgRating = (
    feedbackList.reduce((acc, f) => acc + f.rating, 0) / (feedbackList.length || 1)
  ).toFixed(1);

  return (
    <div className="flex min-h-screen bg-stone-900 text-stone-100">
      <Sidebar mode="admin" />

      <main className="flex-1 p-4 sm:p-8 max-w-7xl mx-auto w-full">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold font-serif text-white">
              Customer Feedback & Reviews
            </h1>
            <p className="text-xs text-stone-400 mt-1">
              Ratings and meal quality comments submitted by active subscribers
            </p>
          </div>

          <div className="flex items-center space-x-3 bg-stone-800 border border-stone-700 rounded-2xl px-4 py-2 text-xs">
            <span className="text-stone-400 font-bold uppercase">Average Rating:</span>
            <span className="text-amber-400 font-extrabold text-base flex items-center space-x-1">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span>{avgRating} / 5.0</span>
            </span>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="bg-stone-800 border border-stone-700 rounded-2xl p-4 mb-6 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-stone-400" />
            <span className="text-xs font-bold text-stone-300">Filter by Rating:</span>
          </div>
          <div className="flex items-center space-x-2">
            {[0, 5, 4, 3, 2, 1].map((stars) => (
              <button
                key={stars}
                onClick={() => setRatingFilter(stars)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                  ratingFilter === stars
                    ? 'bg-brand-600 text-white shadow-xs'
                    : 'bg-stone-900 text-stone-300 hover:bg-stone-700'
                }`}
              >
                {stars === 0 ? 'All Ratings' : `${stars} ★`}
              </button>
            ))}
          </div>
        </div>

        {/* Feedback Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredFb.map((fb) => (
            <div key={fb.id} className="bg-stone-800 border border-stone-700/80 rounded-3xl p-6 shadow-md space-y-3">
              <div className="flex items-center justify-between border-b border-stone-700 pb-3">
                <span className="font-bold text-white text-sm">{fb.customer_name || 'Subscriber'}</span>
                <span className="text-[11px] text-stone-400">{formatDate(fb.created_at)}</span>
              </div>

              <div className="flex items-center space-x-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < fb.rating ? 'fill-amber-400 text-amber-400' : 'text-stone-600'
                    }`}
                  />
                ))}
                <span className="text-xs font-bold text-stone-300 ml-2">{fb.rating} / 5</span>
              </div>

              {fb.comment ? (
                <p className="text-xs text-stone-300 italic leading-relaxed">"{fb.comment}"</p>
              ) : (
                <p className="text-[11px] text-stone-500 italic">No comment provided.</p>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
