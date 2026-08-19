"use client";

import { SubscriptionPlan } from '@/types/subscription';
import { formatCurrency } from '@/lib/utils';
import { Check, Star } from 'lucide-react';

interface SubscriptionCardProps {
  plan: SubscriptionPlan;
  isPopular?: boolean;
  isActive?: boolean;
  onSubscribe?: (planId: string) => void;
  loading?: boolean;
}

export function SubscriptionCard({
  plan,
  isPopular = false,
  isActive = false,
  onSubscribe,
  loading = false,
}: SubscriptionCardProps) {
  return (
    <div
      className={`relative bg-white rounded-3xl p-6 sm:p-8 border transition-all duration-200 flex flex-col justify-between ${
        isPopular
          ? 'border-brand-500 shadow-xl ring-2 ring-brand-500/20 scale-[1.02]'
          : 'border-stone-200 shadow-sm hover:shadow-md'
      }`}
    >
      {isPopular && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-brand-600 to-saffron-500 text-white text-xs font-bold uppercase tracking-wider px-4 py-1 rounded-full shadow-sm flex items-center space-x-1">
          <Star className="w-3 h-3 fill-current" />
          <span>Most Popular</span>
        </div>
      )}

      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xl font-bold text-stone-900 font-serif">{plan.name}</h3>
          {isActive && (
            <span className="bg-brand-100 text-brand-800 text-xs font-bold px-3 py-1 rounded-full">
              Current Plan
            </span>
          )}
        </div>

        <p className="text-xs text-stone-500 mb-6">{plan.description}</p>

        <div className="mb-6 pb-6 border-b border-stone-100">
          <div className="flex items-baseline space-x-1">
            <span className="text-3xl sm:text-4xl font-extrabold text-stone-900 font-serif">
              {formatCurrency(plan.price)}
            </span>
            <span className="text-sm text-stone-500 font-medium">
              / {plan.duration_days === 1 ? 'day' : `${plan.duration_days} days`}
            </span>
          </div>
        </div>

        <ul className="space-y-3 mb-8">
          {plan.features.map((feature, i) => (
            <li key={i} className="flex items-start space-x-3 text-sm text-stone-700">
              <div className="w-5 h-5 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center shrink-0 mt-0.5">
                <Check className="w-3.5 h-3.5" />
              </div>
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      <div>
        {onSubscribe && !isActive && (
          <button
            onClick={() => onSubscribe(plan.id)}
            disabled={loading}
            className={`w-full py-3.5 px-6 rounded-2xl font-bold text-sm shadow-sm transition-all ${
              isPopular
                ? 'bg-brand-600 hover:bg-brand-700 text-white shadow-brand-200'
                : 'bg-stone-900 hover:bg-stone-800 text-white'
            }`}
          >
            {loading ? 'Processing...' : 'Subscribe Now'}
          </button>
        )}

        {isActive && (
          <div className="w-full py-3 text-center bg-brand-50 text-brand-700 font-bold text-sm rounded-2xl border border-brand-200">
            Active Subscription
          </div>
        )}
      </div>
    </div>
  );
}
