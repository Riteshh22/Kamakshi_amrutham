"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { loginCustomer } from '@/lib/api';
import { Eye, EyeOff, AlertCircle, Loader2 } from 'lucide-react';

export default function CustomerLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      setLoading(true);

      // Primary flow: call backend login endpoint
      const authRes = await loginCustomer({
        email: email.trim().toLowerCase(),
        password,
      });

      // If backend returned access_token and refresh_token, establish Supabase session
      if (authRes.access_token && authRes.refresh_token && supabase?.auth) {
        try {
          await supabase.auth.setSession({
            access_token: authRes.access_token,
            refresh_token: authRes.refresh_token,
          });
        } catch (sessionErr) {
          console.warn('Supabase setSession note:', sessionErr);
        }
      } else if (authRes.access_token && supabase?.auth) {
        try {
          await supabase.auth.setSession({
            access_token: authRes.access_token,
            refresh_token: authRes.access_token,
          });
        } catch (sessionErr) {
          console.warn('Supabase setSession note:', sessionErr);
        }
      }

      // Authoritative redirect based on role returned from server
      if (authRes.role === 'admin') {
        router.push('/admin/dashboard');
      } else {
        router.push('/customer/dashboard');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      // Fallback: If backend is momentarily unreachable, try direct Supabase auth
      try {
        if (supabase?.auth) {
          const { data, error: sbError } = await supabase.auth.signInWithPassword({
            email: email.trim().toLowerCase(),
            password,
          });
          if (sbError) throw sbError;
          if (data?.user) {
            router.push('/customer/dashboard');
            return;
          }
        }
      } catch (fallbackErr: any) {
        console.warn('Supabase fallback error:', fallbackErr);
      }

      setError(err.message || 'Invalid email or password. Please try again.');
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
        <h1 className="text-3xl font-extrabold text-stone-900 font-serif">
          Customer Login
        </h1>
        <p className="mt-2 text-xs text-stone-600 font-medium">
          Sign in to manage your meal subscription & daily deliveries
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-warm-lg border border-stone-100 sm:rounded-3xl sm:px-10">
          
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 p-4 rounded-2xl text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form className="space-y-5" onSubmit={handleLogin}>
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="customer@example.com"
                className="w-full px-4 py-3 border border-stone-300 rounded-xl text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 border border-stone-300 rounded-xl text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full text-white font-bold py-3.5 px-4 rounded-xl shadow-warm transition-all flex items-center justify-center space-x-2 hover:opacity-95"
              style={{ background: 'linear-gradient(135deg, #8B1A2A, #731524)' }}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <span>Sign In</span>
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-stone-500 space-y-2">
            <div>
              Don't have a subscription yet?{' '}
              <Link href="/register" className="font-bold text-brand-700 hover:underline">
                Create an Account
              </Link>
            </div>
            <div>
              <Link href="/admin/login" className="text-stone-400 hover:text-stone-600 underline">
                Admin Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
