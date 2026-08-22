"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Session, User } from '@supabase/supabase-js';

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    // Immediately clear local state so the UI updates before Supabase responds
    setSession(null);
    setUser(null);
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('admin_access_token');
      sessionStorage.removeItem('admin_user_id');
      sessionStorage.removeItem('admin_email');
    }
    try {
      await supabase.auth.signOut();
    } catch (err) {
      // Silently ignore network errors — local state is already cleared
      console.warn('Supabase signOut error (session cleared locally):', err);
    }
  };

  return {
    session,
    user,
    loading,
    isAuthenticated: !!user,
    signOut,
  };
}
