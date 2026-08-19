"use client";

import { useEffect, useState } from 'react';
import { Sidebar } from '@/components/sidebar';
import { getAdminCustomers } from '@/lib/api';
import { UserProfile } from '@/types/user';
import { formatDate } from '@/lib/utils';
import { Search, Users, Phone, Mail, MapPin, Calendar } from 'lucide-react';

const mockCustomers: UserProfile[] = [
  {
    id: 'usr-1',
    full_name: 'Ramesh Kumar',
    email: 'ramesh@example.com',
    phone: '+91 9876543210',
    delivery_address: 'Flat 402, Fortune Towers, Mindspace Road',
    area: 'Madhapur',
    pincode: '500081',
    role: 'customer',
    created_at: '2026-01-15T10:00:00Z',
  },
  {
    id: 'usr-2',
    full_name: 'Priya Sharma',
    email: 'priya@example.com',
    phone: '+91 9123456789',
    delivery_address: 'Plot 88, KPHB Phase 3',
    area: 'Kukatpally',
    pincode: '500072',
    role: 'customer',
    created_at: '2026-02-01T11:30:00Z',
  },
  {
    id: 'usr-3',
    full_name: 'Suresh Reddy',
    email: 'suresh@example.com',
    phone: '+91 9988776655',
    delivery_address: 'H.No 12-5, Green Park Colony',
    area: 'Ameerpet',
    pincode: '500016',
    role: 'customer',
    created_at: '2026-02-10T14:20:00Z',
  },
];

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<UserProfile[]>(mockCustomers);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<UserProfile | null>(null);

  useEffect(() => {
    async function fetchCustomers() {
      try {
        setLoading(true);
        const data = await getAdminCustomers().catch(() => null);
        if (data && data.length > 0) {
          setCustomers(data);
        }
      } catch (err) {
        console.error('Failed to fetch customers:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchCustomers();
  }, []);

  const filteredCustomers = customers.filter(
    (c) =>
      c.full_name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search) ||
      c.area.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-stone-900 text-stone-100">
      <Sidebar mode="admin" />

      <main className="flex-1 p-4 sm:p-8 max-w-7xl mx-auto w-full">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold font-serif text-white">
            Customer Directory
          </h1>
          <p className="text-xs text-stone-400 mt-1">
            Registered customer accounts, contact information, and delivery locations in Hyderabad
          </p>
        </div>

        {/* Search Bar */}
        <div className="bg-stone-800 border border-stone-700 rounded-2xl p-4 mb-6">
          <div className="relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search customer by name, email, phone, or Hyderabad area..."
              className="w-full pl-9 pr-4 py-2.5 bg-stone-900 border border-stone-700 rounded-xl text-xs text-white focus:ring-2 focus:ring-brand-500 outline-none"
            />
          </div>
        </div>

        {/* Customer Table */}
        <div className="bg-stone-800 border border-stone-700 rounded-3xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-stone-300">
              <thead className="bg-stone-900/90 text-stone-400 uppercase tracking-wider text-[11px] font-bold border-b border-stone-700">
                <tr>
                  <th className="py-4 px-6">Customer Name</th>
                  <th className="py-4 px-6">Phone</th>
                  <th className="py-4 px-6">Email</th>
                  <th className="py-4 px-6">Area</th>
                  <th className="py-4 px-6">Joined Date</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-700/60">
                {filteredCustomers.map((c) => (
                  <tr key={c.id} className="hover:bg-stone-750 transition-colors">
                    <td className="py-4 px-6 font-bold text-white flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-brand-600/30 border border-brand-500/50 flex items-center justify-center text-brand-300 font-bold text-xs">
                        {c.full_name.charAt(0)}
                      </div>
                      <span>{c.full_name}</span>
                    </td>
                    <td className="py-4 px-6 font-mono text-stone-400">{c.phone}</td>
                    <td className="py-4 px-6 text-stone-300">{c.email}</td>
                    <td className="py-4 px-6 font-semibold text-brand-300">{c.area}</td>
                    <td className="py-4 px-6 text-stone-400">{formatDate(c.created_at)}</td>
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => setSelectedCustomer(c)}
                        className="bg-stone-700 hover:bg-stone-600 text-stone-200 px-3 py-1.5 rounded-xl font-semibold text-[11px] transition-colors"
                      >
                        View Profile
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal: Customer Profile Details */}
        {selectedCustomer && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <div className="bg-stone-800 border border-stone-700 rounded-3xl p-6 sm:p-8 max-w-lg w-full text-stone-100 shadow-2xl">
              <h3 className="text-xl font-bold font-serif text-white mb-4">
                Customer Profile Details
              </h3>

              <div className="space-y-4 text-xs">
                <div>
                  <span className="text-stone-400 block font-semibold">Full Name</span>
                  <span className="text-base font-bold text-white">{selectedCustomer.full_name}</span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-stone-400 block font-semibold">Phone</span>
                    <span className="font-mono text-stone-200">{selectedCustomer.phone}</span>
                  </div>
                  <div>
                    <span className="text-stone-400 block font-semibold">Email</span>
                    <span className="text-stone-200">{selectedCustomer.email}</span>
                  </div>
                </div>

                <div className="p-4 bg-stone-900 rounded-2xl border border-stone-700">
                  <span className="text-stone-400 block font-semibold mb-1">
                    Static Delivery Address (Hyderabad)
                  </span>
                  <p className="text-stone-200 font-medium">{selectedCustomer.delivery_address}</p>
                  <p className="text-brand-400 font-bold mt-2">
                    📍 Area: {selectedCustomer.area} ({selectedCustomer.pincode})
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-stone-700 flex justify-end">
                <button
                  onClick={() => setSelectedCustomer(null)}
                  className="bg-stone-700 hover:bg-stone-600 text-white font-bold px-4 py-2 rounded-xl text-xs"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
