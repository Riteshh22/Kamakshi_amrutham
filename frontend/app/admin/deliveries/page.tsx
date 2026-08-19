"use client";

import { useEffect, useState } from 'react';
import { Sidebar } from '@/components/sidebar';
import { getAdminDeliveries } from '@/lib/api';
import { Truck, MapPin, CheckCircle2, Clock, ChefHat } from 'lucide-react';

interface AreaDeliverySummary {
  area: string;
  total_orders: number;
  delivered: number;
  out_for_delivery: number;
  preparing: number;
}

export default function AdminDeliveriesPage() {
  const [deliveries, setDeliveries] = useState<AreaDeliverySummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDeliveries() {
      try {
        setLoading(true);
        const data = await getAdminDeliveries().catch(() => []);
        setDeliveries(data || []);
      } catch (err) {
        console.error('Failed to fetch admin deliveries:', err);
        setDeliveries([]);
      } finally {
        setLoading(false);
      }
    }
    fetchDeliveries();
  }, []);

  return (
    <div className="flex min-h-screen bg-stone-900 text-stone-100">
      <Sidebar mode="admin" />

      <main className="flex-1 p-4 sm:p-8 max-w-7xl mx-auto w-full">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold font-serif text-white">
            Hyderabad Area Deliveries Management
          </h1>
          <p className="text-xs text-stone-400 mt-1">
            Area-wise logistics breakdown and lunch delivery route dispatch tracking
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-stone-800 border border-stone-700/80 rounded-3xl p-6 animate-pulse h-48" />
            ))}
          </div>
        ) : deliveries.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-stone-500">
            <Truck className="w-12 h-12 mb-4 opacity-30" />
            <p className="text-lg font-semibold">No deliveries for today</p>
            <p className="text-sm mt-1">Orders will appear here once generated for today&apos;s date.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {deliveries.map((item, i) => (
            <div key={i} className="bg-stone-800 border border-stone-700/80 rounded-3xl p-6 shadow-md">
              <div className="flex items-center justify-between border-b border-stone-700 pb-4 mb-4">
                <div className="flex items-center space-x-2 text-white font-bold text-lg font-serif">
                  <MapPin className="w-5 h-5 text-brand-400" />
                  <span>{item.area}</span>
                </div>
                <span className="bg-brand-900 text-brand-300 font-extrabold text-xs px-3 py-1 rounded-full border border-brand-700">
                  {item.total_orders} Orders
                </span>
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between p-3 bg-stone-900 rounded-xl border border-stone-750">
                  <div className="flex items-center space-x-2 text-emerald-400 font-semibold">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Delivered & Confirmed</span>
                  </div>
                  <span className="font-extrabold text-white text-sm">{item.delivered}</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-stone-900 rounded-xl border border-stone-750">
                  <div className="flex items-center space-x-2 text-orange-400 font-semibold">
                    <Truck className="w-4 h-4" />
                    <span>Out for Delivery</span>
                  </div>
                  <span className="font-extrabold text-white text-sm">{item.out_for_delivery}</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-stone-900 rounded-xl border border-stone-750">
                  <div className="flex items-center space-x-2 text-amber-400 font-semibold">
                    <ChefHat className="w-4 h-4" />
                    <span>Kitchen Preparing</span>
                  </div>
                  <span className="font-extrabold text-white text-sm">{item.preparing}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
