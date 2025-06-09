
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  itemLimit: number;
  features: string[];
  adType: string;
}

interface UserSubscription {
  plan_id: string;
  status: string;
  current_period_end: string | null;
}

interface SubscriptionContextType {
  currentPlan: SubscriptionPlan | null;
  subscription: UserSubscription | null;
  canListMoreItems: boolean;
  loading: boolean;
  refreshSubscription: () => Promise<void>;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

const defaultPlans: SubscriptionPlan[] = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    currency: 'KES',
    itemLimit: 3,
    features: ['List up to 3 items', 'Basic support'],
    adType: 'normal'
  },
  {
    id: 'basic',
    name: 'Basic',
    price: 500,
    currency: 'KES',
    itemLimit: 10,
    features: ['List up to 10 items', 'Priority support', 'Featured listings'],
    adType: 'featured'
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 1500,
    currency: 'KES',
    itemLimit: -1, // Unlimited
    features: ['Unlimited listings', 'Priority support', 'Featured listings', 'Analytics'],
    adType: 'premium'
  }
];

export const SubscriptionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [currentPlan, setCurrentPlan] = useState<SubscriptionPlan | null>(null);
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchSubscription = async () => {
    if (!user) {
      setCurrentPlan(defaultPlans[0]); // Free plan for non-authenticated users
      setSubscription(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      
      // Try to fetch user subscription with simplified query
      const { data: userSub, error } = await supabase
        .from('user_subscriptions')
        .select('plan_id, status, current_period_end')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .maybeSingle(); // Use maybeSingle to avoid 406 errors

      if (error && error.code !== 'PGRST116') { // PGRST116 is "not found" which is acceptable
        console.error('Error fetching subscription:', error);
        // Fall back to free plan on error
        setCurrentPlan(defaultPlans[0]);
        setSubscription(null);
        setLoading(false);
        return;
      }

      setSubscription(userSub);

      // Find the current plan
      if (userSub && userSub.status === 'active') {
        const plan = defaultPlans.find(p => p.id === userSub.plan_id) || defaultPlans[0];
        setCurrentPlan(plan);
      } else {
        setCurrentPlan(defaultPlans[0]); // Default to free plan
      }
    } catch (error) {
      console.error('Error in fetchSubscription:', error);
      setCurrentPlan(defaultPlans[0]); // Default to free plan on any error
      setSubscription(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscription();
  }, [user]);

  const canListMoreItems = currentPlan ? (currentPlan.itemLimit === -1 || currentPlan.itemLimit > 0) : false;

  const value: SubscriptionContextType = {
    currentPlan,
    subscription,
    canListMoreItems,
    loading,
    refreshSubscription: fetchSubscription,
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscription = (): SubscriptionContextType => {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
};
