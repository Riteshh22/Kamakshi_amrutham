"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useUser } from '@/hooks/useUser';
import { UtensilsCrossed, Menu, X, User, LogOut, LayoutDashboard } from 'lucide-react';

export function Navbar() {
  const { isAuthenticated, signOut } = useAuth();
  const { profile } = useUser();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-stone-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-11 h-11 rounded-2xl bg-brand-600 flex items-center justify-center text-white shadow-md shadow-brand-200 group-hover:scale-105 transition-transform">
              <UtensilsCrossed className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xl font-bold text-stone-900 tracking-tight block font-serif">
                Kamakshi Amrutham
              </span>
              <span className="text-[10px] uppercase font-semibold text-brand-700 tracking-wider block -mt-1">
                Pure Veg Hyderabad
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-stone-700">
            <Link href="/" className="hover:text-brand-600 transition-colors">
              Home
            </Link>
            <Link href="/#how-it-works" className="hover:text-brand-600 transition-colors">
              How It Works
            </Link>
            <Link href="/#plans" className="hover:text-brand-600 transition-colors">
              Plans
            </Link>
            <Link href="/#about" className="hover:text-brand-600 transition-colors">
              Why Us
            </Link>
            <Link href="/#delivery-areas" className="hover:text-brand-600 transition-colors">
              Hyderabad Delivery
            </Link>
            <Link href="/#faq" className="hover:text-brand-600 transition-colors">
              FAQ
            </Link>
          </nav>

          {/* Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <Link
                  href={profile?.role === 'admin' ? '/admin/dashboard' : '/customer/dashboard'}
                  className="inline-flex items-center space-x-2 bg-brand-50 text-brand-700 px-4 py-2 rounded-xl font-medium border border-brand-200 hover:bg-brand-100 transition-colors"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Dashboard</span>
                </Link>
                <button
                  onClick={signOut}
                  className="p-2 text-stone-500 hover:text-red-600 rounded-xl hover:bg-stone-100 transition-colors"
                  title="Log Out"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  href="/login"
                  className="text-stone-700 hover:text-stone-900 px-4 py-2 text-sm font-medium transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="bg-brand-600 hover:bg-brand-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-md shadow-brand-200 transition-all hover:shadow-lg"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-stone-600 hover:bg-stone-100 focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-stone-200 px-4 pt-2 pb-6 space-y-4 shadow-xl">
          <nav className="flex flex-col space-y-3 font-medium text-stone-700">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-stone-50"
            >
              Home
            </Link>
            <Link
              href="/#how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-stone-50"
            >
              How It Works
            </Link>
            <Link
              href="/#plans"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-stone-50"
            >
              Plans
            </Link>
            <Link
              href="/#about"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-stone-50"
            >
              Why Us
            </Link>
            <Link
              href="/#delivery-areas"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-stone-50"
            >
              Hyderabad Coverage
            </Link>
            <Link
              href="/#faq"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-stone-50"
            >
              FAQ
            </Link>
          </nav>

          <div className="pt-4 border-t border-stone-100 flex flex-col space-y-3">
            {isAuthenticated ? (
              <>
                <Link
                  href={profile?.role === 'admin' ? '/admin/dashboard' : '/customer/dashboard'}
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center bg-brand-600 text-white font-semibold py-3 rounded-xl shadow-sm"
                >
                  Go to Dashboard
                </Link>
                <button
                  onClick={() => {
                    signOut();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-center text-stone-600 hover:text-red-600 font-medium py-2"
                >
                  Log Out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center border border-stone-300 text-stone-800 font-semibold py-2.5 rounded-xl"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center bg-brand-600 text-white font-semibold py-2.5 rounded-xl shadow-sm"
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
