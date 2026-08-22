"use client";

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { registerCustomer } from '@/lib/api';
import { ArrowRight, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';

const hyderabadAreas = [
  'Nizampet',
  'Bachupally',
  'Mallampet',
  'Pragati Nagar',
  'Miyapur',
  'Vasanth Nagar',
  'HMT Hills',
  'Sardar Patel Nagar',
];

// Inner component that uses useSearchParams — must be wrapped in Suspense
function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedPlan = searchParams.get('plan') || 'monthly';

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    deliveryAddress: '',
    area: 'Nizampet',
    pincode: '500090',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    try {
      setLoading(true);

      // Primary flow: call backend register API
      const authRes = await registerCustomer({
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        full_name: formData.fullName.trim(),
        phone: formData.phone.trim(),
        delivery_address: formData.deliveryAddress.trim(),
        area: formData.area,
        pincode: formData.pincode.trim(),
      });

      // If tokens returned, set Supabase session
      if (authRes.access_token && authRes.refresh_token && supabase?.auth) {
        try {
          await supabase.auth.setSession({
            access_token: authRes.access_token,
            refresh_token: authRes.refresh_token,
          });
        } catch (sErr) {
          console.warn('Supabase setSession note:', sErr);
        }
      }

      setSuccess(true);
      setTimeout(() => {
        router.push(`/customer/dashboard?subscribed_plan=${selectedPlan}`);
      }, 1200);
    } catch (err: any) {
      console.error('Registration error:', err);

      // Fallback: direct Supabase signup
      try {
        if (supabase?.auth) {
          const { data: authData, error: authError } = await supabase.auth.signUp({
            email: formData.email.trim().toLowerCase(),
            password: formData.password,
            options: {
              data: {
                full_name: formData.fullName.trim(),
                role: 'customer',
              },
            },
          });

          if (authError) throw authError;

          if (authData?.user) {
            await supabase.from('Profiles').insert({
              id: authData.user.id,
              full_name: formData.fullName.trim(),
              email: formData.email.trim().toLowerCase(),
              phone: formData.phone.trim(),
              full_address: formData.deliveryAddress.trim(),
              area: formData.area,
              pincode: formData.pincode.trim(),
              role: 'customer',
            });

            setSuccess(true);
            setTimeout(() => {
              router.push(`/customer/dashboard?subscribed_plan=${selectedPlan}`);
            }, 1200);
            return;
          }
        }
      } catch (fallbackErr: any) {
        console.warn('Supabase fallback signup error:', fallbackErr);
      }

      setError(err.message || 'Failed to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-flex items-center space-x-3 mb-4 group">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center text-white text-2xl shadow-warm group-hover:scale-105 transition-transform"
            style={{ background: 'linear-gradient(135deg, #8B1A2A, #C9952A)' }}
          >
            🍚
          </div>
        </Link>
        <h2 className="text-3xl font-extrabold text-stone-900 font-serif">
          Create your account
        </h2>
        <p className="mt-2 text-xs text-stone-600">
          Subscribe for fresh vegetarian meal delivery in Hyderabad
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-lg">
        <div className="bg-white py-8 px-6 shadow-xl border border-stone-200 sm:rounded-3xl sm:px-10">
          
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 p-4 rounded-2xl text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="mb-6 bg-emerald-50 border border-emerald-200 text-emerald-700 p-4 rounded-2xl text-xs flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 shrink-0" />
              <span>Account created successfully! Redirecting to dashboard...</span>
            </div>
          )}

          <form className="space-y-4" onSubmit={handleRegister}>
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                Full Name
              </label>
              <input
                type="text"
                name="fullName"
                required
                value={formData.fullName}
                onChange={handleChange}
                placeholder="e.g. Ramesh Kumar"
                className="w-full px-4 py-3 border border-stone-300 rounded-xl text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="ramesh@example.com"
                  className="w-full px-4 py-3 border border-stone-300 rounded-xl text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+91 9876543210"
                  className="w-full px-4 py-3 border border-stone-300 rounded-xl text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 border border-stone-300 rounded-xl text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 border border-stone-300 rounded-xl text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
                />
              </div>
            </div>

            <div className="pt-2 border-t border-stone-100">
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                Static Delivery Address (Hyderabad)
              </label>
              <textarea
                name="deliveryAddress"
                rows={2}
                required
                value={formData.deliveryAddress}
                onChange={handleChange}
                placeholder="Flat No, Building Name, Street / Landmark"
                className="w-full px-4 py-2.5 border border-stone-300 rounded-xl text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Area
                </label>
                <select
                  name="area"
                  value={formData.area}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-stone-300 rounded-xl text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none bg-white"
                >
                  {hyderabadAreas.map((area) => (
                    <option key={area} value={area}>
                      {area}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Pincode
                </label>
                <input
                  type="text"
                  name="pincode"
                  required
                  value={formData.pincode}
                  onChange={handleChange}
                  placeholder="500072"
                  className="w-full px-4 py-3 border border-stone-300 rounded-xl text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 bg-brand-600 hover:bg-brand-700 text-white font-bold py-3.5 px-4 rounded-xl shadow-md transition-all flex items-center justify-center space-x-2"
            >
              <span>{loading ? 'Creating Account...' : 'Complete Registration'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-stone-500">
            Already have an account?{' '}
            <Link href="/login" className="font-bold text-brand-700 hover:underline">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// Default export wraps the form in Suspense (required by Next.js for useSearchParams)
export default function RegisterPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-cream-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600" />
      </div>
    }>
      <RegisterForm />
    </Suspense>
  );
}
