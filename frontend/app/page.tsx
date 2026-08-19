"use client";

import Link from 'next/link';
import { Navbar } from '@/components/navbar';
import { SubscriptionCard } from '@/components/subscription-card';
import { SubscriptionPlan } from '@/types/subscription';
import {
  UtensilsCrossed,
  MapPin,
  Clock,
  ShieldCheck,
  Calendar,
  ThumbsUp,
  HelpCircle,
  ArrowRight,
  CheckCircle2,
  Heart,
  Truck,
  RotateCcw,
} from 'lucide-react';

const mockPlans: SubscriptionPlan[] = [
  {
    id: 'daily',
    name: 'Daily Trial',
    price: 219,
    duration_days: 1,
    description: 'Perfect for trying out our authentic mid-day meal service.',
    features: [
      'Fresh pure vegetarian meal',
      'Mid-day lunchtime delivery',
      'Includes rice, roti, dal, curry & curd',
      'Doorstep delivery in Hyderabad',
    ],
  },
  {
    id: 'monthly',
    name: 'Monthly Subscription',
    price: 5500,
    duration_days: 30,
    description: 'Our most popular choice for working professionals and families.',
    features: [
      '30 Days of fresh vegetarian lunches',
      'Flexible meal skip & pause option',
      'Daily menu variation',
      'Priority delivery schedule',
      'Free delivery across covered areas',
    ],
  },
  {
    id: 'quarterly',
    name: '3 Months Plan',
    price: 15000,
    duration_days: 90,
    description: 'Best value long-term plan with maximum savings.',
    features: [
      '90 Days complete meal plan',
      'Save ₹1,500 compared to monthly',
      'Unlimited pause & skip flexibility',
      'Dedicated delivery manager',
      'Complimentary festive special thalis',
    ],
  },
];

const hyderabadAreas = [
  'Kukatpally',
  'Madhapur',
  'Ameerpet',
  'Miyapur',
  'Gachibowli',
  'Kondapur',
  'Hitec City',
  'Jubilee Hills',
  'Banjara Hills',
  'Begumpet',
  'KPHB Colony',
  'Manikonda',
];

const faqs = [
  {
    q: 'How does the Kamakshi Amrutham subscription work?',
    a: 'Simply choose a plan (Daily, Monthly, or 3 Months), enter your delivery address in Hyderabad, and make a payment. We prepare fresh vegetarian meals every morning and deliver them directly to your door before lunch.',
  },
  {
    q: 'Which areas in Hyderabad do you deliver to?',
    a: 'We currently cover major hubs including Kukatpally, Madhapur, Ameerpet, Miyapur, Gachibowli, Kondapur, Hitec City, Jubilee Hills, and surrounding localities.',
  },
  {
    q: 'Can I skip a meal if I am out of town?',
    a: 'Yes! You can easily mark a meal as "Skipped" or set a "Pause" range on your customer dashboard before 9:00 AM on the delivery date.',
  },
  {
    q: 'What time is lunch delivered?',
    a: 'All mid-day meal deliveries occur between 12:00 PM and 1:30 PM, ensuring your food arrives hot and fresh right in time for lunch.',
  },
  {
    q: 'How do I renew my subscription?',
    a: 'You can quickly renew your subscription from your customer dashboard with a single click before your current plan expires.',
  },
  {
    q: 'What if I have feedback or a complaint about an order?',
    a: 'We welcome your inputs! You can rate each meal from 1 to 5 stars or submit a complaint directly via your dashboard. Our support team responds promptly.',
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-cream-50">
      {/* 1. Navbar */}
      <Navbar />

      {/* 2. Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 sm:pt-20 sm:pb-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
            
            <div className="space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center space-x-2 bg-brand-100 text-brand-800 text-xs font-extrabold uppercase tracking-wider px-3.5 py-1.5 rounded-full border border-brand-200">
                <MapPin className="w-3.5 h-3.5 text-brand-600" />
                <span>Exclusively Delivering in Hyderabad</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-stone-900 tracking-tight leading-tight font-serif">
                Your Midday Meal, <br />
                <span className="text-brand-600">Delivered Fresh.</span>
              </h1>

              <p className="text-lg text-stone-600 max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium">
                Subscribe to wholesome vegetarian meals and enjoy convenient doorstep delivery across Hyderabad.
              </p>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <Link
                  href="#plans"
                  className="w-full sm:w-auto bg-brand-600 hover:bg-brand-700 text-white font-bold px-8 py-4 rounded-2xl shadow-lg shadow-brand-200 transition-all hover:scale-105 text-center"
                >
                  View Plans
                </Link>
                <Link
                  href="/register"
                  className="w-full sm:w-auto border-2 border-stone-800 hover:bg-stone-900 hover:text-white text-stone-900 font-bold px-8 py-3.5 rounded-2xl transition-all text-center"
                >
                  Get Started
                </Link>
              </div>

              <div className="pt-6 border-t border-stone-200/80 flex items-center justify-center lg:justify-start space-x-6 text-xs text-stone-500 font-semibold">
                <div className="flex items-center space-x-1.5">
                  <CheckCircle2 className="w-4 h-4 text-brand-600" />
                  <span>Pure Vegetarian</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <CheckCircle2 className="w-4 h-4 text-brand-600" />
                  <span>On-Time Delivery</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <CheckCircle2 className="w-4 h-4 text-brand-600" />
                  <span>Easy Pause / Skip</span>
                </div>
              </div>
            </div>

            {/* Hero Visual Card */}
            <div className="relative">
              <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-stone-200/80 max-w-lg mx-auto relative z-10">
                <div className="flex items-center justify-between border-b border-stone-100 pb-4 mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-2xl bg-brand-600 text-white flex items-center justify-center font-bold">
                      <UtensilsCrossed className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-stone-900 font-serif">Today's Lunch Thali</h4>
                      <p className="text-xs text-stone-500">Freshly prepared at 10:00 AM</p>
                    </div>
                  </div>
                  <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full">
                    Ready
                  </span>
                </div>

                <div className="space-y-3 mb-6 text-sm text-stone-700">
                  <div className="p-3 rounded-xl bg-stone-50 border border-stone-100 flex items-center justify-between">
                    <span className="font-medium">Steam Sona Masoori Rice</span>
                    <span className="text-xs text-brand-700 font-semibold">Unlimited</span>
                  </div>
                  <div className="p-3 rounded-xl bg-stone-50 border border-stone-100 flex items-center justify-between">
                    <span className="font-medium">Traditional Tadka Dal & Sambar</span>
                    <span className="text-xs text-brand-700 font-semibold">Fresh</span>
                  </div>
                  <div className="p-3 rounded-xl bg-stone-50 border border-stone-100 flex items-center justify-between">
                    <span className="font-medium">Seasonal Veg Curry & Phulkas</span>
                    <span className="text-xs text-brand-700 font-semibold">Homestyle</span>
                  </div>
                  <div className="p-3 rounded-xl bg-stone-50 border border-stone-100 flex items-center justify-between">
                    <span className="font-medium">Fresh Curd & Homemade Pickle</span>
                    <span className="text-xs text-brand-700 font-semibold">Authentic</span>
                  </div>
                </div>

                <div className="bg-brand-50 rounded-2xl p-4 border border-brand-200 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Truck className="w-5 h-5 text-brand-600" />
                    <div>
                      <p className="text-xs font-bold text-stone-900">Delivery in Progress</p>
                      <p className="text-[11px] text-stone-500">Madhapur & Hitec City route</p>
                    </div>
                  </div>
                  <span className="text-xs font-extrabold text-brand-700">12:30 PM</span>
                </div>
              </div>

              {/* Decorative Blur */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-brand-300/30 rounded-full blur-3xl -z-10" />
            </div>

          </div>
        </div>
      </section>

      {/* 3. How It Works */}
      <section id="how-it-works" className="py-20 bg-white border-y border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs font-extrabold uppercase tracking-widest text-brand-700 mb-2">
              Simple 4-Step Process
            </h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-stone-900 font-serif">
              How Kamakshi Amrutham Works
            </h3>
            <p className="mt-3 text-stone-600 text-sm">
              Enjoying hot, nutritious vegetarian lunch at work or home is effortless.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-cream-50 rounded-3xl p-6 border border-stone-200 text-center relative">
              <div className="w-12 h-12 rounded-2xl bg-brand-600 text-white font-extrabold text-lg flex items-center justify-center mx-auto mb-5 shadow-md">
                1
              </div>
              <h4 className="font-bold text-stone-900 text-lg mb-2 font-serif">Choose Your Plan</h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                Select from Daily, Monthly, or 3 Months vegetarian meal subscriptions.
              </p>
            </div>

            <div className="bg-cream-50 rounded-3xl p-6 border border-stone-200 text-center relative">
              <div className="w-12 h-12 rounded-2xl bg-brand-600 text-white font-extrabold text-lg flex items-center justify-center mx-auto mb-5 shadow-md">
                2
              </div>
              <h4 className="font-bold text-stone-900 text-lg mb-2 font-serif">Enter Delivery Address</h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                Provide your static home or office delivery address & pincode in Hyderabad.
              </p>
            </div>

            <div className="bg-cream-50 rounded-3xl p-6 border border-stone-200 text-center relative">
              <div className="w-12 h-12 rounded-2xl bg-brand-600 text-white font-extrabold text-lg flex items-center justify-center mx-auto mb-5 shadow-md">
                3
              </div>
              <h4 className="font-bold text-stone-900 text-lg mb-2 font-serif">We Prepare & Deliver</h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                Our kitchen cooks fresh every morning and dispatches doorstep delivery before 1:00 PM.
              </p>
            </div>

            <div className="bg-cream-50 rounded-3xl p-6 border border-stone-200 text-center relative">
              <div className="w-12 h-12 rounded-2xl bg-brand-600 text-white font-extrabold text-lg flex items-center justify-center mx-auto mb-5 shadow-md">
                4
              </div>
              <h4 className="font-bold text-stone-900 text-lg mb-2 font-serif">Confirm Your Meal</h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                Confirm receipt on your dashboard, give feedback, or pause anytime.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Subscription Plans */}
      <section id="plans" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs font-extrabold uppercase tracking-widest text-brand-700 mb-2">
              Subscription Plans
            </h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-stone-900 font-serif">
              Affordable Meals, Transparent Pricing
            </h3>
            <p className="mt-3 text-stone-600 text-sm">
              No hidden charges. Doorstep delivery included across Hyderabad.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch max-w-6xl mx-auto">
            {mockPlans.map((plan) => (
              <SubscriptionCard
                key={plan.id}
                plan={plan}
                isPopular={plan.id === 'monthly'}
                onSubscribe={() => {
                  window.location.href = `/register?plan=${plan.id}`;
                }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 5. Why Kamakshi Amrutham */}
      <section id="about" className="py-20 bg-white border-y border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs font-extrabold uppercase tracking-widest text-brand-700 mb-2">
              Why Choose Us
            </h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-stone-900 font-serif">
              Built for Convenient Everyday Dining
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-cream-50 rounded-3xl p-6 border border-stone-200">
              <div className="w-12 h-12 rounded-2xl bg-brand-100 text-brand-700 flex items-center justify-center mb-5">
                <UtensilsCrossed className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-stone-900 text-lg mb-2 font-serif">Convenient Daily Meals</h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                Save time cooking and planning lunches. Receive a wholesome mid-day thali right on schedule every day.
              </p>
            </div>

            <div className="bg-cream-50 rounded-3xl p-6 border border-stone-200">
              <div className="w-12 h-12 rounded-2xl bg-brand-100 text-brand-700 flex items-center justify-center mb-5">
                <Heart className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-stone-900 text-lg mb-2 font-serif">100% Pure Vegetarian</h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                Prepared in a strictly vegetarian kitchen following traditional recipes and immaculate hygiene standards.
              </p>
            </div>

            <div className="bg-cream-50 rounded-3xl p-6 border border-stone-200">
              <div className="w-12 h-12 rounded-2xl bg-brand-100 text-brand-700 flex items-center justify-center mb-5">
                <RotateCcw className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-stone-900 text-lg mb-2 font-serif">Flexible Subscription</h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                Skip single daily orders or pause your subscription for date ranges whenever you travel or take a day off.
              </p>
            </div>

            <div className="bg-cream-50 rounded-3xl p-6 border border-stone-200">
              <div className="w-12 h-12 rounded-2xl bg-brand-100 text-brand-700 flex items-center justify-center mb-5">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-stone-900 text-lg mb-2 font-serif">Simple Delivery Confirmation</h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                Confirm meal receipt with one click on your dashboard so you always know your delivery status.
              </p>
            </div>

            <div className="bg-cream-50 rounded-3xl p-6 border border-stone-200">
              <div className="w-12 h-12 rounded-2xl bg-brand-100 text-brand-700 flex items-center justify-center mb-5">
                <ThumbsUp className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-stone-900 text-lg mb-2 font-serif">Easy Feedback & Support</h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                Rate every meal from 1 to 5 stars or raise a complaint directly from your account for instant attention.
              </p>
            </div>

            <div className="bg-cream-50 rounded-3xl p-6 border border-stone-200">
              <div className="w-12 h-12 rounded-2xl bg-brand-100 text-brand-700 flex items-center justify-center mb-5">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-stone-900 text-lg mb-2 font-serif">Reliable Doorstep Delivery</h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                Dedicated delivery partners ensure food is handed over safely to your home or office reception.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Delivery Areas in Hyderabad */}
      <section id="delivery-areas" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-brand-900 to-stone-900 rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden">
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <div className="inline-flex items-center space-x-2 bg-brand-800/80 text-brand-200 text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full mb-4 border border-brand-700">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Coverage Map</span>
                </div>
                <h3 className="text-3xl sm:text-4xl font-bold font-serif mb-4">
                  Delivering Across Major Hyderabad Hubs
                </h3>
                <p className="text-stone-300 text-sm leading-relaxed mb-6">
                  We service residential communities and IT hubs across Hyderabad every afternoon. Enter your address during registration to start receiving meals.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {hyderabadAreas.map((area, i) => (
                  <div
                    key={i}
                    className="bg-white/10 backdrop-blur-md border border-white/15 rounded-xl px-4 py-3 text-center text-xs font-bold tracking-wide"
                  >
                    📍 {area}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Customer Experience Timeline */}
      <section className="py-20 bg-white border-y border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs font-extrabold uppercase tracking-widest text-brand-700 mb-2">
              Daily Operational Timeline
            </h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-stone-900 font-serif">
              A Seamless Lunch Experience
            </h3>
          </div>

          <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-4 gap-6 text-center">
            <div className="bg-cream-50 p-6 rounded-2xl border border-stone-200">
              <span className="text-xs font-extrabold text-brand-700 block mb-1">08:30 AM</span>
              <h5 className="font-bold text-stone-900 text-sm mb-1">Menu Preparation</h5>
              <p className="text-xs text-stone-500">Fresh ingredients sourced & cooked</p>
            </div>
            <div className="bg-cream-50 p-6 rounded-2xl border border-stone-200">
              <span className="text-xs font-extrabold text-brand-700 block mb-1">11:00 AM</span>
              <h5 className="font-bold text-stone-900 text-sm mb-1">Hygienic Packing</h5>
              <p className="text-xs text-stone-500">Sealed in eco-friendly meal boxes</p>
            </div>
            <div className="bg-cream-50 p-6 rounded-2xl border border-stone-200">
              <span className="text-xs font-extrabold text-brand-700 block mb-1">12:15 PM</span>
              <h5 className="font-bold text-stone-900 text-sm mb-1">Out for Delivery</h5>
              <p className="text-xs text-stone-500">En route to your location</p>
            </div>
            <div className="bg-cream-50 p-6 rounded-2xl border border-stone-200">
              <span className="text-xs font-extrabold text-brand-700 block mb-1">12:45 PM</span>
              <h5 className="font-bold text-stone-900 text-sm mb-1">Meal Received</h5>
              <p className="text-xs text-stone-500">Hot lunch ready to enjoy</p>
            </div>
          </div>
        </div>
      </section>

      {/* 8. FAQ Section */}
      <section id="faq" className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-xs font-extrabold uppercase tracking-widest text-brand-700 mb-2">
              Frequently Asked Questions
            </h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-stone-900 font-serif">
              Everything You Need to Know
            </h3>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs">
                <h4 className="font-bold text-stone-900 text-base mb-2 font-serif flex items-center space-x-2">
                  <HelpCircle className="w-4 h-4 text-brand-600 shrink-0" />
                  <span>{faq.q}</span>
                </h4>
                <p className="text-xs text-stone-600 leading-relaxed pl-6">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. CTA Section */}
      <section className="py-20 bg-brand-600 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-3xl sm:text-5xl font-extrabold font-serif">
            Ready for your next midday meal?
          </h2>
          <p className="text-brand-100 text-base max-w-xl mx-auto font-medium">
            Join hundreds of satisfied customers in Hyderabad enjoying wholesome vegetarian lunches every day.
          </p>
          <div>
            <Link
              href="/register"
              className="inline-flex items-center space-x-2 bg-stone-900 hover:bg-black text-white font-bold px-8 py-4 rounded-2xl shadow-xl transition-all hover:scale-105"
            >
              <span>Subscribe Now</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 10. Footer */}
      <footer className="bg-stone-900 text-stone-400 py-12 border-t border-stone-800 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-xl bg-brand-600 text-white flex items-center justify-center font-bold">
              <UtensilsCrossed className="w-4 h-4" />
            </div>
            <span className="font-bold text-white text-base font-serif">Kamakshi Amrutham</span>
          </div>
          <p>© {new Date().getFullYear()} Kamakshi Amrutham. All rights reserved. Hyderabad, India.</p>
          <div className="flex space-x-6 text-stone-400">
            <Link href="/login" className="hover:text-white transition-colors">Customer Login</Link>
            <Link href="/admin/login" className="hover:text-white transition-colors">Admin Login</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
