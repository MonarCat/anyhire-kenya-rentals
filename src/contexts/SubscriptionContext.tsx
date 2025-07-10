
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  item_limit: number | null;
  features: string[];
  ad_type: string;
}

interface SubscriptionContextType {
  currentPlan: SubscriptionPlan | null;
  loading: boolean;
  itemCount: number;
  canCreateMore: boolean;
  refreshSubscription: () => Promise<void>;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
};

export const SubscriptionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentPlan, setCurrentPlan] = useState<SubscriptionPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [itemCount, setItemCount] = useState(0);
  const { user } = useAuth();

  const fetchSubscription = async () => {
    if (!user) {
      setCurrentPlan(null);
      setItemCount(0);
      setLoading(false);
      return;
    }

    try {
      // Fetch user's current subscription
      const { data: subscription, error: subError } = await supabase
        .from('user_subscriptions')
        .select(`
          *,
          subscription_plans (*)
        `)
        .eq('user_id', user.id)
        .eq('status', 'active')
        .single();

      if (subError && subError.code !== 'PGRST116') {
        console.error('Error fetching subscription:', subError);
        // If no subscription found, assign basic plan
        const { data: basicPlan } = await supabase
          .from('subscription_plans')
          .select('*')
          .eq('id', 'basic')
          .single();
          
        setCurrentPlan(basicPlan);
      } else if (subscription) {
        setCurrentPlan(subscription.subscription_plans);
      }

      // Fetch user's item count
      const { data: items, error: itemsError } = await supabase
        .from('items')
        .select('id')
        .eq('user_id', user.id);

      if (itemsError) {
        console.error('Error fetching item count:', itemsError);
      } else {
        setItemCount(items?.length || 0);
      }
    } catch (error) {
      console.error('Error in fetchSubscription:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscription();
  }, [user]);

  const canCreateMore = currentPlan
    ? currentPlan.item_limit === null || itemCount < currentPlan.item_limit
    : false;

  const refreshSubscription = async () => {
    setLoading(true);
    await fetchSubscription();
  };

  return (
    <SubscriptionContext.Provider value={{
      currentPlan,
      loading,
      itemCount,
      canCreateMore,
      refreshSubscription
    }}>
      {children}
    </SubscriptionContext.Provider>
  );
};
