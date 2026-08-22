"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useUser } from '@/hooks/useUser';
import {
  LayoutDashboard,
  CalendarCheck,
  Utensils,
  MessageSquare,
  AlertTriangle,
  Bell,
  User,
  Users,
  CreditCard,
  Truck,
  LogOut,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  mode: 'customer' | 'admin';
}

export function Sidebar({ mode }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { signOut } = useAuth();
  const { profile } = useUser();

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  const customerLinks = [
    { name: 'Dashboard', href: '/customer/dashboard', icon: LayoutDashboard },
    { name: 'My Subscription', href: '/customer/subscription', icon: CalendarCheck },
    { name: 'Daily Orders', href: '/customer/orders', icon: Utensils },
    { name: 'Feedback', href: '/customer/feedback', icon: MessageSquare },
    { name: 'Complaints', href: '/customer/complaints', icon: AlertTriangle },
    { name: 'Notifications', href: '/customer/notifications', icon: Bell },
    { name: 'Profile & Address', href: '/customer/profile', icon: User },
  ];

  const adminLinks = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: "Today's Orders", href: '/admin/orders', icon: Utensils },
    { name: 'Customers', href: '/admin/customers', icon: Users },
    { name: 'Subscriptions', href: '/admin/subscriptions', icon: CalendarCheck },
    { name: 'Payments', href: '/admin/payments', icon: CreditCard },
    { name: 'Deliveries', href: '/admin/deliveries', icon: Truck },
    { name: 'Feedback', href: '/admin/feedback', icon: MessageSquare },
    { name: 'Complaints', href: '/admin/complaints', icon: ShieldAlert },
  ];

  const links = mode === 'admin' ? adminLinks : customerLinks;

  return (
    <aside className="w-64 bg-white border-r border-stone-200 min-h-screen flex flex-col justify-between p-4 hidden md:flex">
      <div>
        {/* Brand Header */}
        <div className="mb-8 px-2 pt-2">
          <div className="flex items-center gap-2 mb-2">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-lg shadow-sm shrink-0"
              style={{ background: 'linear-gradient(145deg, #8B1A2A 0%, #5e111d 100%)' }}
            >
              🍚
            </div>
            <div className="leading-none">
              <span
                className="block font-extrabold font-serif"
                style={{
                  fontSize: '0.95rem',
                  background: 'linear-gradient(135deg, #8B1A2A 20%, #C9952A 80%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  lineHeight: 1.2,
                }}
              >
                Kamakshi Amrutham
              </span>
              <span
                className="inline-flex items-center gap-0.5 mt-0.5 px-1.5 py-0.5 rounded-full text-white font-bold uppercase tracking-widest"
                style={{
                  fontSize: '0.5rem',
                  background: 'linear-gradient(135deg, #8B1A2A 0%, #C9952A 100%)',
                }}
              >
                ✦ Amma Chethi Ruchulu ✦
              </span>
            </div>
          </div>
          <div
            className="text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full text-center"
            style={{ background: '#fdf2f3', color: '#8B1A2A' }}
          >
            {mode === 'admin' ? '⚙ Admin Portal' : '👤 Customer Portal'}
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-150',
                  isActive
                    ? 'font-semibold border shadow-xs'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
                )}
                style={isActive ? { background: '#fdf2f3', color: '#8B1A2A', borderColor: '#f5c9ce' } : {}}
              >
                <div className="flex items-center space-x-3">
                  <Icon
                    className={cn('w-4 h-4', isActive ? '' : 'text-stone-400')}
                    style={isActive ? { color: '#8B1A2A' } : {}}
                  />
                  <span>{link.name}</span>
                </div>
                {isActive && <ChevronRight className="w-3.5 h-3.5" style={{ color: '#8B1A2A' }} />}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* User Profile Footer */}
      <div className="pt-4 border-t border-stone-100">
        <div className="px-3 py-2 bg-stone-50 rounded-xl mb-3 flex items-center space-x-3">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs shrink-0"
            style={{ background: 'linear-gradient(135deg, #8B1A2A, #C9952A)' }}
          >
            {profile?.full_name ? profile.full_name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-stone-900 truncate">
              {profile?.full_name || 'Loading...'}
            </p>
            <p className="text-[10px] text-stone-500 truncate">{profile?.email}</p>
          </div>
        </div>

        <button
          id="sidebar-signout-btn"
          onClick={handleSignOut}
          className="w-full flex items-center justify-center space-x-2 px-3 py-2.5 text-xs font-semibold text-stone-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
