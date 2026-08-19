"use client";

import { useEffect, useState, useCallback } from 'react';
import { useAuth } from './useAuth';
import { getProfile, updateProfile } from '@/lib/api';
import { UserProfile } from '@/types/user';

export function useUser() {
  const { user, loading: authLoading } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    if (!user) {
      setProfile(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await getProfile();
      setProfile(data);
    } catch (err: any) {
      console.error("Error fetching profile:", err);
      setError(err.message || 'Failed to load user profile');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!authLoading) {
      fetchProfile();
    }
  }, [authLoading, fetchProfile]);

  const handleUpdateProfile = async (data: Partial<UserProfile>) => {
    try {
      setLoading(true);
      const updated = await updateProfile(data);
      setProfile(updated);
      return updated;
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    profile,
    loading: authLoading || loading,
    error,
    refreshProfile: fetchProfile,
    updateProfile: handleUpdateProfile,
    isAdmin: profile?.role === 'admin',
  };
}
