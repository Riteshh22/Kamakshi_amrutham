"use client";

import { useState, useEffect } from 'react';
import { Sidebar } from '@/components/sidebar';
import { useUser } from '@/hooks/useUser';
import { MapPin, User, Save, AlertCircle, CheckCircle } from 'lucide-react';

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

export default function CustomerProfilePage() {
  const { profile, loading: userLoading, updateProfile } = useUser();
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    email: '',
    delivery_address: '',
    area: 'Kukatpally',
    pincode: '500072',
  });

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        phone: profile.phone || '',
        email: profile.email || '',
        delivery_address: profile.delivery_address || '',
        area: profile.area || 'Kukatpally',
        pincode: profile.pincode || '500072',
      });
    }
  }, [profile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    try {
      setSaving(true);
      await updateProfile(formData);
      setMessage({ type: 'success', text: 'Delivery address and profile updated successfully!' });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to update profile.' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-cream-50">
      <Sidebar mode="customer" />

      <main className="flex-1 p-4 sm:p-8 max-w-4xl mx-auto w-full">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-stone-900 font-serif">
            Profile & Delivery Address
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Manage your personal contact details and saved delivery address in Hyderabad
          </p>
        </div>

        {message && (
          <div
            className={`mb-6 p-4 rounded-2xl text-xs font-medium flex items-center space-x-2 ${
              message.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}
          >
            {message.type === 'success' ? (
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            )}
            <span>{message.text}</span>
          </div>
        )}

        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs">
          <form className="space-y-6" onSubmit={handleSubmit}>
            
            {/* Section 1: Personal Details */}
            <div>
              <h3 className="text-sm font-extrabold text-stone-900 uppercase tracking-wider mb-4 pb-2 border-b border-stone-100 flex items-center space-x-2">
                <User className="w-4 h-4 text-brand-600" />
                <span>Personal Contact Details</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="full_name"
                    required
                    value={formData.full_name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-stone-300 rounded-xl text-sm focus:ring-2 focus:ring-brand-500 outline-none"
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
                    className="w-full px-4 py-3 border border-stone-300 rounded-xl text-sm focus:ring-2 focus:ring-brand-500 outline-none"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  disabled
                  value={formData.email}
                  className="w-full px-4 py-3 bg-stone-100 border border-stone-200 rounded-xl text-sm text-stone-500 cursor-not-allowed"
                />
                <span className="text-[11px] text-stone-400 mt-1 block">
                  Email is linked to your authentication account and cannot be changed here.
                </span>
              </div>
            </div>

            {/* Section 2: Delivery Address */}
            <div>
              <h3 className="text-sm font-extrabold text-stone-900 uppercase tracking-wider mb-4 pb-2 border-b border-stone-100 flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-brand-600" />
                <span>Saved Delivery Address (Hyderabad)</span>
              </h3>

              <div className="p-4 bg-brand-50 rounded-2xl border border-brand-200 mb-4">
                <p className="text-xs text-brand-800 font-semibold leading-relaxed">
                  ℹ️ All future mid-day meal deliveries will be dispatched to this saved address. Please ensure door number, building name, and landmark are accurate.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Complete Street Address
                  </label>
                  <textarea
                    name="delivery_address"
                    rows={3}
                    required
                    value={formData.delivery_address}
                    onChange={handleChange}
                    placeholder="Flat No 402, Fortune Towers, Mindspace Road"
                    className="w-full px-4 py-3 border border-stone-300 rounded-xl text-sm focus:ring-2 focus:ring-brand-500 outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                      Hyderabad Delivery Area
                    </label>
                    <select
                      name="area"
                      value={formData.area}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-stone-300 rounded-xl text-sm focus:ring-2 focus:ring-brand-500 outline-none bg-white"
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
                      className="w-full px-4 py-3 border border-stone-300 rounded-xl text-sm focus:ring-2 focus:ring-brand-500 outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-stone-100 flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="bg-brand-600 hover:bg-brand-700 text-white font-bold py-3 px-6 rounded-xl shadow-xs transition-colors flex items-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? 'Saving Changes...' : 'Save Profile & Address'}</span>
              </button>
            </div>

          </form>
        </div>
      </main>
    </div>
  );
}
