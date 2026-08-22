"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useUser } from '@/hooks/useUser';
import { Menu, X, LogOut, LayoutDashboard } from 'lucide-react';

/** Inline SVG logo that mirrors the reference: maroon banner + gold text + gold pill sub-label */
function KamakshiLogo({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-2.5 group">
      {/* Icon badge */}
      <div
        className="shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center text-xl shadow-warm group-hover:scale-105 transition-transform"
        style={{ background: 'linear-gradient(145deg, #8B1A2A 0%, #5e111d 100%)' }}
        aria-hidden="true"
      >
        🍚
      </div>

      {/* Text stack */}
      <div className="leading-none">
        {/* Main brand name — maroon + gold gradient like the reference banner */}
        <span
          className="block font-extrabold tracking-tight font-serif"
          style={{
            fontSize: compact ? '1rem' : '1.15rem',
            background: 'linear-gradient(135deg, #8B1A2A 20%, #C9952A 80%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            lineHeight: 1.15,
          }}
        >
          Kamakshi Amrutham
        </span>

        {/* Sub-label pill — matches "Amma Chethi Ruchulu" pill in reference */}
        <span
          className="inline-flex items-center gap-1 mt-0.5 px-2 py-0.5 rounded-full text-white font-bold uppercase tracking-widest"
          style={{
            fontSize: '0.55rem',
            background: 'linear-gradient(135deg, #8B1A2A 0%, #C9952A 100%)',
            letterSpacing: '0.09em',
          }}
        >
          <span>✦</span>
          Amma Chethi Ruchulu
          <span>✦</span>
        </span>
      </div>
    </div>
  );
}

export function Navbar() {
  const router = useRouter();
  const { isAuthenticated, signOut } = useAuth();
  const { profile } = useUser();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    setMobileMenuOpen(false);
    router.push('/');
  };

  const navLinks = [
    { href: '/#about', label: 'Our Meals' },
    { href: '/#pricing', label: 'Pricing' },
    { href: '/#why-us', label: 'Why Us' },
    { href: '/#delivery-areas', label: 'Delivery Areas' },
    { href: '/#faq', label: 'FAQ' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/97 backdrop-blur-md border-b border-stone-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[68px]">

          {/* Logo */}
          <Link href="/" aria-label="Kamakshi Amrutham — Home">
            <KamakshiLogo />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-7 text-sm font-medium text-stone-600">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="hover:text-brand-700 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-3">
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <Link
                  href={profile?.role === 'admin' ? '/admin/dashboard' : '/customer/dashboard'}
                  className="inline-flex items-center space-x-2 text-brand-700 px-4 py-2 rounded-xl font-medium border border-brand-200 bg-brand-50 hover:bg-brand-100 transition-colors text-sm"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Dashboard</span>
                </Link>
                <button
                  id="navbar-signout-btn"
                  onClick={handleSignOut}
                  className="inline-flex items-center gap-1.5 p-2 px-3 text-stone-500 hover:text-red-600 rounded-xl hover:bg-red-50 transition-colors text-sm font-medium"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden lg:inline text-xs">Sign Out</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  href="/login"
                  className="text-stone-600 hover:text-stone-900 px-4 py-2 text-sm font-medium transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-warm transition-all hover:opacity-90 hover:scale-105"
                  style={{ background: 'linear-gradient(135deg, #8B1A2A, #731524)' }}
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-stone-600 hover:bg-stone-100 focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-stone-100 px-4 pt-3 pb-6 shadow-warm space-y-4">
          <nav className="flex flex-col space-y-1 font-medium text-stone-700">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2.5 rounded-xl hover:bg-cream-100 hover:text-brand-700 transition-colors text-sm"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="pt-3 border-t border-stone-100 flex flex-col space-y-2.5">
            {isAuthenticated ? (
              <>
                <Link
                  href={profile?.role === 'admin' ? '/admin/dashboard' : '/customer/dashboard'}
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center text-white font-bold py-3 rounded-xl shadow-warm"
                  style={{ background: 'linear-gradient(135deg, #8B1A2A, #731524)' }}
                >
                  Go to Dashboard
                </Link>
                <button
                  id="mobile-signout-btn"
                  onClick={handleSignOut}
                  className="w-full flex items-center justify-center gap-2 text-stone-500 hover:text-red-600 font-medium py-2 text-sm transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center border border-stone-200 text-stone-800 font-semibold py-2.5 rounded-xl text-sm"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center text-white font-bold py-2.5 rounded-xl shadow-warm"
                  style={{ background: 'linear-gradient(135deg, #8B1A2A, #731524)' }}
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
