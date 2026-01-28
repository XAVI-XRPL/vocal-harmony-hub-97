import { useState, useEffect, useCallback } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useUserStore } from '@/stores/userStore';

interface AuthState {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    session: null,
    isLoading: true,
    isAuthenticated: false,
  });

  const { setUser, setLoading, logout: storeLogout } = useUserStore();

  // Sync auth state to user store
  const syncToStore = useCallback((user: User | null) => {
    if (user) {
      setUser({
        id: user.id,
        email: user.email || '',
        displayName: user.user_metadata?.display_name || user.email?.split('@')[0] || 'User',
        avatarUrl: user.user_metadata?.avatar_url || null,
        subscriptionTier: 'free',
        subscriptionExpiresAt: null,
      });
    } else {
      setUser(null);
    }
    setLoading(false);
  }, [setUser, setLoading]);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setAuthState({
          user: session?.user ?? null,
          session: session ?? null,
          isLoading: false,
          isAuthenticated: !!session?.user,
        });
        
        // Sync to user store
        syncToStore(session?.user ?? null);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setAuthState({
        user: session?.user ?? null,
        session: session ?? null,
        isLoading: false,
        isAuthenticated: !!session?.user,
      });
      
      // Sync to user store
      syncToStore(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [syncToStore]);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const signUp = async (email: string, password: string) => {
    const redirectUrl = `${window.location.origin}/`;
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
      },
    });
    return { error };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      storeLogout();
    }
    return { error };
  };

  return {
    ...authState,
    signIn,
    signUp,
    signOut,
  };
}
