import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, SubscriptionTier } from '@/types';

interface UserStore {
  // Auth state
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;

  // Actions
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  updateSubscription: (tier: SubscriptionTier, expiresAt: string | null) => void;
  logout: () => void;

  // Subscription helpers
  isPro: () => boolean;
  canAccessPremiumContent: () => boolean;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      user: null,
      isLoading: true,
      isAuthenticated: false,

      setUser: (user) =>
        set({
          user,
          isAuthenticated: !!user,
          isLoading: false,
        }),

      setLoading: (loading) => set({ isLoading: loading }),

      updateSubscription: (tier, expiresAt) =>
        set((state) => ({
          user: state.user
            ? { ...state.user, subscriptionTier: tier, subscriptionExpiresAt: expiresAt }
            : null,
        })),

      logout: () =>
        set({
          user: null,
          isAuthenticated: false,
        }),

      isPro: () => {
        const { user } = get();
        if (!user) return false;
        return user.subscriptionTier === 'pro' || user.subscriptionTier === 'premium';
      },

      canAccessPremiumContent: () => {
        const { user } = get();
        if (!user) return false;
        
        // Check if subscription is valid
        if (user.subscriptionTier === 'free') return false;
        
        if (user.subscriptionExpiresAt) {
          const expiryDate = new Date(user.subscriptionExpiresAt);
          if (expiryDate < new Date()) return false;
        }
        
        return true;
      },
    }),
    {
      name: 'rvmt-user-storage',
      partialize: (state) => ({ user: state.user }),
    }
  )
);
