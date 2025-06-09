
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
  plans: SubscriptionPlan[];
  canListMoreItems: boolean;
  userItemCount: number;
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
    id: 'silver',
    name: 'Silver',
    price: 500,
    currency: 'KES',
    itemLimit: 10,
    features: ['List up to 10 items', 'Priority support', 'Featured listings'],
    adType: 'featured'
  },
  {
    id: 'gold',
    name: 'Gold',
    price: 1500,
    currency: 'KES',
    itemLimit: 50,
    features: ['List up to 50 items', 'Priority support', 'Featured listings', 'Analytics'],
    adType: 'premium'
  },
  {
    id: 'platinum',
    name: 'Platinum',
    price: 3000,
    currency: 'KES',
    itemLimit: 200,
    features: ['List up to 200 items', 'Priority support', 'Featured listings', 'Advanced analytics', 'Premium placement'],
    adType: 'premium'
  },
  {
    id: 'diamond',
    name: 'Diamond',
    price: 5000,
    currency: 'KES',
    itemLimit: Infinity,
    features: ['Unlimited listings', 'VIP support', 'Featured listings', 'Advanced analytics', 'Premium placement', 'Custom branding'],
    adType: 'premium'
  }
];

export const SubscriptionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [currentPlan, setCurrentPlan] = useState<SubscriptionPlan | null>(null);
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);
  const [userItemCount, setUserItemCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchUserItemCount = async () => {
    if (!user) {
      setUserItemCount(0);
      return;
    }

    try {
      const { count, error } = await supabase
        .from('items')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('is_available', true);

      if (error) {
        console.error('Error fetching user item count:', error);
        setUserItemCount(0);
      } else {
        setUserItemCount(count || 0);
      }
    } catch (error) {
      console.error('Error in fetchUserItemCount:', error);
      setUserItemCount(0);
    }
  };

  const fetchSubscription = async () => {
    if (!user) {
      setCurrentPlan(defaultPlans[0]);
      setSubscription(null);
      setUserItemCount(0);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      
      // Fetch user subscription
      const { data: userSub, error } = await supabase
        .from('user_subscriptions')
        .select('plan_id, status, current_period_end')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching subscription:', error);
        setCurrentPlan(defaultPlans[0]);
        setSubscription(null);
      } else {
        setSubscription(userSub);

        if (userSub && userSub.status === 'active') {
          const plan = defaultPlans.find(p => p.id === userSub.plan_id) || defaultPlans[0];
          setCurrentPlan(plan);
        } else {
          setCurrentPlan(defaultPlans[0]);
        }
      }

      // Fetch user item count
      await fetchUserItemCount();
    } catch (error) {
      console.error('Error in fetchSubscription:', error);
      setCurrentPlan(defaultPlans[0]);
      setSubscription(null);
      setUserItemCount(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscription();
  }, [user]);

  const canListMoreItems = currentPlan ? 
    (currentPlan.itemLimit === Infinity || userItemCount < currentPlan.itemLimit) : false;

  const value: SubscriptionContextType = {
    currentPlan,
    subscription,
    plans: defaultPlans,
    canListMoreItems,
    userItemCount,
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
