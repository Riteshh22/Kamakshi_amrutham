"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShieldCheck, AlertCircle, Mail, ArrowRight, Loader2 } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // POST to backend: email → auth.users UUID → Profiles.role check → signed JWT
      const res = await fetch(`${API_URL}/api/admin/auth/verify-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });

      const data = await res.json();

      if (!res.ok) {
        // Backend returns 403 with detail message for non-admin/not-found
        setError(data.detail || 'Access Denied: You do not have administrator permissions.');
        return;
      }

      // Store the backend-signed admin session token
      sessionStorage.setItem('admin_access_token', data.access_token);
      sessionStorage.setItem('admin_user_id', data.user_id);
      sessionStorage.setItem('admin_email', data.email);

      router.push('/admin/dashboard');
    } catch (err: any) {
      console.error('Admin login error:', err);
      setError('Unable to connect to the server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-900 text-stone-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-brand-600 text-white mb-4 shadow-xl">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <h2 className="text-3xl font-extrabold font-serif text-white">
          Admin Operations Portal
        </h2>
        <p className="mt-2 text-xs text-stone-400">
          Authorized personnel only — Kamakshi Amrutham Hyderabad
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-stone-800/90 border border-stone-700 py-8 px-6 shadow-2xl rounded-3xl sm:px-10">

          {error && (
            <div className="mb-6 bg-red-950/80 border border-red-800 text-red-300 p-4 rounded-2xl text-xs flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form className="space-y-5" onSubmit={handleAdminLogin}>
            <div>
              <label
                htmlFor="admin-email"
                className="block text-xs font-bold text-stone-300 uppercase tracking-wider mb-1"
              >
                Admin Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500" />
                <input
                  id="admin-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your admin email"
                  className="w-full pl-10 pr-4 py-3 bg-stone-900 border border-stone-700 rounded-xl text-sm text-white placeholder-stone-500 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
                  autoComplete="email"
                />
              </div>
              <p className="mt-1.5 text-[10px] text-stone-500">
                Access is granted based on your registered admin account — no password required.
              </p>
            </div>

            <button
              type="submit"
              id="admin-login-btn"
              disabled={loading || !email.trim()}
              className="w-full bg-brand-600 hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3.5 px-4 rounded-xl shadow-lg transition-all flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying Access...</span>
                </>
              ) : (
                <>
                  <span>Verify & Enter Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-stone-500">
            <Link href="/login" className="hover:text-stone-300 underline">
              Return to Customer Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
