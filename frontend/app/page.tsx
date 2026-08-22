"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Navbar } from '@/components/navbar';
import { getPlans } from '@/lib/api';
import { SubscriptionPlan } from '@/types/subscription';
import { formatCurrency } from '@/lib/utils';
import {
  MapPin,
  CheckCircle2,
  Truck,
  Leaf,
  Heart,
  Clock,
  Star,
  ArrowRight,
  HelpCircle,
  Phone,
  Loader2,
} from 'lucide-react';

/* ─────────────────── Data ─────────────────── */

const menuItems = [
  { name: 'Rice', icon: '🍚', desc: 'Freshly steamed Sona Masoori' },
  { name: 'Single Curry', icon: '🥘', desc: 'Daily seasonal vegetable curry' },
  { name: 'Pappu', icon: '🫘', desc: 'Traditional Telugu lentil dal' },
  { name: 'Sambar', icon: '🍲', desc: 'Tamarind-spiced vegetable sambar' },
  { name: 'Pachdi', icon: '🥣', desc: 'Fresh homemade chutney & raita' },
];

const serviceAreas = [
  'Nizampet',
  'Bachupally',
  'Mallampet',
  'Pragati Nagar',
  'Miyapur',
  'Vasanth Nagar',
  'HMT Hills',
  'Sardar Patel Nagar',
];

const whyUs = [
  {
    icon: <Leaf className="w-5 h-5" />,
    title: '100% Pure Vegetarian',
    desc: 'Strictly vegetarian kitchen — no meat, no eggs, ever. Cooked fresh every morning with high hygiene standards.',
  },
  {
    icon: <Heart className="w-5 h-5" />,
    title: 'Amma\'s Homemade Taste',
    desc: 'Traditional Telugu recipes, just like home. Every meal is prepared with love, using authentic spices and fresh ingredients.',
  },
  {
    icon: <Truck className="w-5 h-5" />,
    title: 'Free Home Delivery',
    desc: 'Zero delivery charges. We bring your lunch right to your doorstep across all our service areas.',
  },
  {
    icon: <Clock className="w-5 h-5" />,
    title: 'Lunch-Time Delivery',
    desc: 'Hot meals delivered at lunchtime, so you can enjoy a proper meal in the middle of your busy day.',
  },
  {
    icon: <Star className="w-5 h-5" />,
    title: 'Freshly Cooked Daily',
    desc: 'No stored food. Every item is cooked fresh that morning — from rice to sambar to pachdi.',
  },
  {
    icon: <CheckCircle2 className="w-5 h-5" />,
    title: 'Affordable Pricing',
    desc: 'Wholesome home-cooked meals starting at just ₹229/day. Monthly plans save you even more.',
  },
];

const faqs = [
  {
    q: 'Which areas do you deliver to?',
    a: 'We currently deliver to Nizampet, Bachupally, Mallampet, Pragati Nagar, Miyapur, Vasanth Nagar, HMT Hills, and Sardar Patel Nagar. All deliveries are free of charge.',
  },
  {
    q: 'What does the lunch meal include?',
    a: 'Each meal includes Rice, a Single Curry (seasonal vegetable), Pappu (lentil dal), Sambar, and Pachdi (chutney/raita). Traditional Telugu homemade style.',
  },
  {
    q: 'Is the food 100% vegetarian?',
    a: 'Yes! Kamakshi Amrutham is a pure vegetarian kitchen. We do not use any meat, seafood, or eggs in our cooking.',
  },
  {
    q: 'How does the monthly subscription work?',
    a: 'You pay once for the month and receive fresh lunch deliveries daily (except Sundays/holidays). Single monthly is ₹6,870 and For 2 People monthly is ₹7,770.',
  },
  {
    q: 'What time is lunch delivered?',
    a: 'Meals are delivered between 12:00 PM and 1:30 PM, ensuring your food arrives fresh and hot right at lunchtime.',
  },
  {
    q: 'Can I try before subscribing monthly?',
    a: 'Absolutely! You can order a single day trial — ₹229 for one person or ₹259 for two — before committing to a monthly plan.',
  },
];

/* ─────────────────── Component ─────────────────── */

export default function LandingPage() {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loadingPlans, setLoadingPlans] = useState(true);

  useEffect(() => {
    getPlans()
      .then((data) => setPlans(data || []))
      .catch((err) => {
        console.error('Error fetching plans on landing page:', err);
        setPlans([]);
      })
      .finally(() => setLoadingPlans(false));
  }, []);

  return (
    <div className="min-h-screen bg-cream-50">
      <Navbar />

      {/* ════════ HERO ════════ */}
      <section className="relative overflow-hidden pt-14 pb-20 sm:pt-20 sm:pb-28 bg-cream-50">
        {/* Subtle warm radial bg */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full bg-brand-600/5 blur-3xl" />
          <div className="absolute bottom-0 -left-24 w-[400px] h-[400px] rounded-full bg-gold-400/10 blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-8 items-center">

            {/* Left: Text */}
            <div className="space-y-7 text-center lg:text-left">
              {/* Eyebrow */}
              <div className="section-ornament justify-center lg:justify-start">
                <MapPin className="w-3.5 h-3.5 text-gold-500 inline" />
                Lunch Meals Only · Free Home Delivery
              </div>

              <div>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-stone-900 tracking-tight leading-tight font-serif">
                  Kamakshi{' '}
                  <span
                    style={{
                      background: 'linear-gradient(135deg, #8B1A2A 30%, #C9952A)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    Amrutham
                  </span>
                </h1>
                <p className="mt-2 text-lg font-semibold text-gold-600 tracking-wider font-serif italic">
                  Anna · Pindi · Pachullu
                </p>
              </div>

              <p className="text-base text-stone-600 max-w-lg mx-auto lg:mx-0 leading-relaxed">
                Fresh, pure vegetarian homemade-style lunch meals delivered to your doorstep.
                Taste the warmth of traditional Telugu cooking every day.
              </p>

              {/* Trust Badges */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3">
                {['Pure Veg', 'Freshly Cooked', 'Free Delivery', 'Homemade Style'].map((b) => (
                  <span
                    key={b}
                    className="inline-flex items-center gap-1.5 bg-white border border-stone-200 text-stone-700 text-xs font-semibold px-3 py-1.5 rounded-full shadow-sm"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-forest-500" />
                    {b}
                  </span>
                ))}
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  id="hero-view-plans"
                  href="#pricing"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 text-white font-bold px-8 py-4 rounded-2xl shadow-warm-lg transition-all hover:scale-105 hover:opacity-90"
                  style={{ background: 'linear-gradient(135deg, #8B1A2A, #731524)' }}
                >
                  View Pricing
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  id="hero-register"
                  href="/register"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border-2 border-brand-600 text-brand-700 font-bold px-8 py-3.5 rounded-2xl transition-all hover:bg-brand-600 hover:text-white text-center"
                >
                  Get Started
                </Link>
              </div>
            </div>

            {/* Right: Hero visual card */}
            <div className="relative flex justify-center">
              <div className="relative bg-white rounded-3xl shadow-warm-lg border border-stone-100 p-5 max-w-sm w-full">
                {/* Badge */}
                <div className="absolute -top-3 left-6 badge-traditional z-10">
                  🌿 Lunch Meals Only
                </div>

                {/* Today's menu card */}
                <div className="pt-3">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="font-bold text-stone-900 font-serif text-base">Today's Lunch</h4>
                      <p className="text-xs text-stone-400">Freshly cooked every morning</p>
                    </div>
                    <span className="bg-forest-100 text-forest-700 text-xs font-bold px-3 py-1 rounded-full border border-forest-200">
                      Ready
                    </span>
                  </div>

                  <div className="space-y-2 mb-4">
                    {menuItems.map((item) => (
                      <div
                        key={item.name}
                        className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-cream-100 border border-cream-300"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-base">{item.icon}</span>
                          <span className="text-sm font-semibold text-stone-800">{item.name}</span>
                        </div>
                        <span className="text-xs text-brand-700 font-semibold">Fresh</span>
                      </div>
                    ))}
                  </div>

                  <div
                    className="rounded-2xl p-3 flex items-center justify-between gap-3"
                    style={{ background: 'linear-gradient(135deg, #fdf2f3, #fefbf0)' }}
                  >
                    <div className="flex items-center gap-2">
                      <Truck className="w-4 h-4 text-brand-600 shrink-0" />
                      <div>
                        <p className="text-xs font-bold text-stone-900">Free Home Delivery</p>
                        <p className="text-[10px] text-stone-500">Nizampet · Bachupally · More</p>
                      </div>
                    </div>
                    <span className="text-xs font-extrabold text-brand-700">₹229/day</span>
                  </div>
                </div>
              </div>

              {/* Decorative blur behind card */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-brand-600/10 rounded-full blur-3xl -z-10" />
            </div>
          </div>
        </div>
      </section>

      {/* ════════ STATS STRIP ════════ */}
      <section className="bg-white border-y border-stone-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            {[
              { value: '100%', label: 'Pure Vegetarian' },
              { value: 'Daily', label: 'Freshly Cooked' },
              { value: '₹0', label: 'Delivery Charge' },
              { value: '8+', label: 'Service Areas' },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-2xl sm:text-3xl font-extrabold font-serif" style={{ color: '#8B1A2A' }}>
                  {stat.value}
                </p>
                <p className="text-xs text-stone-500 font-semibold mt-0.5 uppercase tracking-wide">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════ ABOUT / MENU SECTION ════════ */}
      <section id="about" className="py-20 bg-cream-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

            {/* Left: Image */}
            <div className="relative">
              <div className="relative rounded-3xl overflow-hidden shadow-warm-lg border border-stone-100">
                <Image
                  src="/thali.jpg"
                  alt="Traditional South Indian vegetarian lunch thali by Kamakshi Amrutham"
                  width={620}
                  height={465}
                  className="w-full h-auto object-cover"
                  priority
                />
              </div>
              {/* Floating label */}
              <div className="absolute -bottom-4 left-6 bg-white shadow-warm border border-stone-100 rounded-2xl px-4 py-3 flex items-center gap-2">
                <span className="text-2xl">🌿</span>
                <div>
                  <p className="text-xs font-bold text-stone-900">Pure Veg · Homemade</p>
                  <p className="text-[10px] text-stone-500">Freshly cooked every morning</p>
                </div>
              </div>
            </div>

            {/* Right: Description */}
            <div className="space-y-6">
              <div className="section-ornament">About Our Meals</div>

              <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900 font-serif leading-tight">
                Amma Chethi Ruchulu —{' '}
                <span className="text-brand-600">The Taste of Home</span>
              </h2>

              <p className="text-stone-600 leading-relaxed text-sm">
                At <strong>Kamakshi Amrutham</strong>, we believe every person deserves a warm, healthy,
                home-cooked lunch — even on the busiest days. Our meals are crafted using traditional
                Telugu recipes, fresh ingredients, and zero shortcuts. Every dish is made with love,
                just the way your mother would make it.
              </p>

              <p className="text-stone-600 leading-relaxed text-sm">
                We serve <strong>Lunch Meals Only</strong> — ensuring complete focus on quality and
                freshness. No reheated food, no preservatives. Just pure vegetarian goodness, straight
                from our kitchen to your home.
              </p>

              {/* Menu items */}
              <div>
                <p className="text-xs font-bold text-gold-600 uppercase tracking-widest mb-3">
                  What's Included in Every Meal
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {menuItems.map((item) => (
                    <div
                      key={item.name}
                      className="flex items-start gap-3 bg-white border border-stone-100 rounded-2xl px-4 py-3 shadow-sm hover-lift"
                    >
                      <span className="text-xl mt-0.5">{item.icon}</span>
                      <div>
                        <p className="text-sm font-bold text-stone-900">{item.name}</p>
                        <p className="text-xs text-stone-500">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════ PRICING ════════ */}
      <section id="pricing" className="py-20 bg-white border-y border-stone-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14 space-y-3">
            <div className="section-ornament justify-center">Our Pricing</div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900 font-serif">
              Simple & Transparent Pricing
            </h2>
            <p className="text-stone-500 text-sm max-w-lg mx-auto">
              No hidden charges. Free home delivery included. Pick what suits your household.
            </p>
          </div>

          {loadingPlans ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-brand-600" />
            </div>
          ) : plans.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {plans.map((plan) => (
                <div
                  key={plan.id}
                  className="relative rounded-3xl border-2 border-brand-600 bg-brand-50/40 p-8 shadow-warm hover-lift overflow-hidden flex flex-col justify-between"
                >
                  <div>
                    <h3 className="text-xl font-bold text-stone-900 font-serif mb-1">{plan.name}</h3>
                    <p className="text-xs text-stone-500 mb-5">{plan.description}</p>

                    <div className="mb-6">
                      <div className="flex items-baseline gap-1">
                        <span className="text-4xl font-extrabold text-stone-900 font-serif">
                          {formatCurrency(plan.price)}
                        </span>
                        <span className="text-sm text-stone-500">
                          / {plan.duration_days === 1 ? 'day' : `${plan.duration_days} days`}
                        </span>
                      </div>
                    </div>

                    <ul className="space-y-2.5 mb-7">
                      {plan.features?.map((f, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-sm text-stone-700">
                          <CheckCircle2 className="w-4 h-4 text-forest-500 shrink-0 mt-0.5" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Link
                    href={`/register?plan=${plan.id}`}
                    className="block w-full py-3.5 rounded-2xl font-bold text-sm text-center text-white shadow-warm transition-all hover:opacity-90 hover:scale-[1.02]"
                    style={{ background: 'linear-gradient(135deg, #8B1A2A, #731524)' }}
                  >
                    Subscribe Now
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-cream-100 rounded-3xl p-8 border border-cream-300 text-center max-w-xl mx-auto">
              <p className="text-stone-800 font-bold text-base font-serif">Pure Vegetarian Homemade Lunch Meals</p>
              <p className="text-xs text-stone-600 mt-2">
                Rice · Single Curry · Pappu · Sambar · Pachdi
              </p>
              <p className="text-xs text-brand-700 font-semibold mt-1">Lunch Meals Only · Free Home Delivery</p>
              <Link
                href="/register"
                className="inline-block mt-5 text-white font-bold px-7 py-3 rounded-2xl text-xs shadow-warm transition-all hover:opacity-90 hover:scale-105"
                style={{ background: 'linear-gradient(135deg, #8B1A2A, #731524)' }}
              >
                Register to Subscribe
              </Link>
            </div>
          )}

          {/* Contact nudge */}
          <p className="text-center text-xs text-stone-400 mt-8">
            Questions? Call or WhatsApp us to start your subscription today.
          </p>
        </div>
      </section>

      {/* ════════ WHY CHOOSE US ════════ */}
      <section id="why-us" className="py-20 bg-cream-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14 space-y-3">
            <div className="section-ornament justify-center">Why Choose Us</div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900 font-serif">
              Made with Care, Served with Love
            </h2>
            <p className="text-stone-500 text-sm max-w-xl mx-auto">
              Everything about Kamakshi Amrutham is designed to give you the comfort of home food
              without the effort of cooking.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {whyUs.map((item) => (
              <div
                key={item.title}
                className="bg-white rounded-3xl p-6 border border-stone-100 shadow-sm hover-lift"
              >
                <div
                  className="w-10 h-10 rounded-2xl flex items-center justify-center mb-4 text-white"
                  style={{ background: 'linear-gradient(135deg, #8B1A2A, #C9952A)' }}
                >
                  {item.icon}
                </div>
                <h3 className="font-bold text-stone-900 text-base mb-1.5 font-serif">{item.title}</h3>
                <p className="text-xs text-stone-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════ SERVICE AREAS ════════ */}
      <section id="delivery-areas" className="py-20 bg-white border-y border-stone-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl overflow-hidden shadow-warm-lg">
            <div
              className="px-8 sm:px-12 py-10 sm:py-14"
              style={{ background: 'linear-gradient(135deg, #4e0f1a 0%, #731524 50%, #8B1A2A 100%)' }}
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
                {/* Left text */}
                <div className="text-white space-y-4">
                  <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-gold-300 text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>Free Home Delivery</span>
                  </div>
                  <h2 className="text-3xl sm:text-4xl font-bold font-serif leading-tight">
                    Delivering Fresh Meals
                    <br />
                    Across Your Neighbourhood
                  </h2>
                  <p className="text-stone-300 text-sm leading-relaxed max-w-md">
                    We currently serve these areas with free home delivery every day at lunchtime.
                    No extra charges, no minimum orders — just good food at your door.
                  </p>
                  <div className="flex items-center gap-2 text-gold-300 text-sm font-semibold">
                    <Truck className="w-4 h-4" />
                    <span>Zero delivery charge, always.</span>
                  </div>
                </div>

                {/* Right: area tiles */}
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4 gap-3">
                  {serviceAreas.map((area) => (
                    <div
                      key={area}
                      className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-2xl px-3 py-3 text-center hover:bg-white/20 transition-colors"
                    >
                      <p className="text-white text-xs font-bold">📍 {area}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════ HOW IT WORKS ════════ */}
      <section id="how-it-works" className="py-20 bg-cream-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14 space-y-3">
            <div className="section-ornament justify-center">Simple Process</div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900 font-serif">
              How It Works
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { num: '1', title: 'Choose Your Plan', desc: 'Pick Single or For 2 People, day or monthly.' },
              { num: '2', title: 'Register & Pay', desc: 'Create your account and complete the payment securely.' },
              { num: '3', title: 'We Cook Fresh', desc: 'Our kitchen prepares your meal fresh every morning.' },
              { num: '4', title: 'Delivered Hot', desc: 'Hot lunch delivered to your door between 12 – 1:30 PM.' },
            ].map((step) => (
              <div
                key={step.num}
                className="bg-white rounded-3xl p-6 border border-stone-100 shadow-sm text-center hover-lift"
              >
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-5 text-white font-extrabold text-lg shadow-warm"
                  style={{ background: 'linear-gradient(135deg, #8B1A2A, #C9952A)' }}
                >
                  {step.num}
                </div>
                <h3 className="font-bold text-stone-900 text-base mb-1.5 font-serif">{step.title}</h3>
                <p className="text-xs text-stone-500 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════ FAQ ════════ */}
      <section id="faq" className="py-20 bg-white border-y border-stone-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14 space-y-3">
            <div className="section-ornament justify-center">FAQs</div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900 font-serif">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-cream-50 border border-stone-100 rounded-2xl p-6 shadow-sm">
                <h3 className="font-bold text-stone-900 text-sm mb-2 flex items-start gap-2 font-serif">
                  <HelpCircle className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
                  {faq.q}
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed pl-6">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════ CTA ════════ */}
      <section className="py-20 bg-cream-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-7">
          <div className="section-ornament justify-center">Start Today</div>
          <h2 className="text-3xl sm:text-5xl font-extrabold font-serif text-stone-900">
            Ready for a{' '}
            <span
              style={{
                background: 'linear-gradient(135deg, #8B1A2A 30%, #C9952A)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              home-cooked lunch
            </span>{' '}
            tomorrow?
          </h2>
          <p className="text-stone-500 text-sm max-w-xl mx-auto leading-relaxed">
            Join families across Nizampet, Bachupally, Miyapur and more who enjoy fresh,
            traditional vegetarian lunch every day — delivered free to their homes.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              id="cta-register"
              href="/register"
              className="inline-flex items-center gap-2 text-white font-bold px-8 py-4 rounded-2xl shadow-warm-lg transition-all hover:scale-105 hover:opacity-90"
              style={{ background: 'linear-gradient(135deg, #8B1A2A, #731524)' }}
            >
              Get Started Now
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              id="cta-whatsapp"
              href="tel:+91XXXXXXXXXX"
              className="inline-flex items-center gap-2 border-2 border-stone-300 text-stone-700 font-semibold px-7 py-3.5 rounded-2xl hover:border-brand-600 hover:text-brand-600 transition-colors"
            >
              <Phone className="w-4 h-4" />
              Call Us
            </a>
          </div>
        </div>
      </section>

      {/* ════════ FOOTER ════════ */}
      <footer className="bg-stone-950 text-stone-400 py-12 border-t border-stone-800 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-10">
            {/* Brand */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-2xl flex items-center justify-center text-white text-base font-bold"
                  style={{ background: 'linear-gradient(135deg, #8B1A2A, #C9952A)' }}
                >
                  🍚
                </div>
                <div>
                  <p className="font-bold text-white text-sm font-serif">Kamakshi Amrutham</p>
                  <p className="text-[10px] text-gold-500 font-semibold tracking-wider">Anna · Pindi · Pachullu</p>
                </div>
              </div>
              <p className="text-xs text-stone-500 leading-relaxed max-w-xs">
                Pure vegetarian homemade-style lunch meals with free home delivery.
                Lunch Meals Only.
              </p>
            </div>

            {/* Service areas */}
            <div>
              <p className="text-white font-bold text-xs uppercase tracking-widest mb-3">Service Areas</p>
              <div className="grid grid-cols-2 gap-1">
                {serviceAreas.map((area) => (
                  <p key={area} className="text-stone-500 text-xs">📍 {area}</p>
                ))}
              </div>
            </div>

            {/* Links */}
            <div>
              <p className="text-white font-bold text-xs uppercase tracking-widest mb-3">Account</p>
              <div className="space-y-2">
                <Link href="/login" className="block text-stone-400 hover:text-white transition-colors text-xs">
                  Customer Login
                </Link>
                <Link href="/register" className="block text-stone-400 hover:text-white transition-colors text-xs">
                  Register
                </Link>
                <Link href="/admin/login" className="block text-stone-400 hover:text-white transition-colors text-xs">
                  Admin Login
                </Link>
              </div>
            </div>
          </div>

          <div className="divider-gold mb-6" />

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-stone-600">
            <p>© {new Date().getFullYear()} Kamakshi Amrutham. All rights reserved.</p>
            <p className="text-gold-600 font-semibold">Made with ❤️ for Hyderabad families</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
