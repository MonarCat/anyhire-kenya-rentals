
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';

type SubscriptionPlan = Tables<'subscription_plans'> & {
  itemLimit: number | null; // Add computed property for consistency
};

interface SubscriptionContextType {
  currentPlan: SubscriptionPlan | null;
  plans: SubscriptionPlan[];
  loading: boolean;
  itemCount: number;
  userItemCount: number;
  canCreateMore: boolean;
  canListMoreItems: boolean;
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
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [itemCount, setItemCount] = useState(0);
  const { user } = useAuth();

  const transformPlan = (plan: Tables<'subscription_plans'>): SubscriptionPlan => ({
    ...plan,
    itemLimit: plan.item_limit,
    features: Array.isArray(plan.features) ? plan.features as string[] : []
  });

  const fetchPlans = async () => {
    try {
      const { data, error } = await supabase
        .from('subscription_plans')
        .select('*')
        .eq('is_active', true)
        .order('sort_order');

      if (error) {
        console.error('Error fetching plans:', error);
        return;
      }

      const transformedPlans = data?.map(transformPlan) || [];
      setPlans(transformedPlans);
    } catch (error) {
      console.error('Error in fetchPlans:', error);
    }
  };

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
        .maybeSingle();

      if (subError) {
        console.error('Error fetching subscription:', subError);
        // If no subscription found, assign basic plan
        const { data: basicPlan } = await supabase
          .from('subscription_plans')
          .select('*')
          .eq('id', 'basic')
          .single();
          
        if (basicPlan) {
          setCurrentPlan(transformPlan(basicPlan));
        }
      } else if (subscription?.subscription_plans) {
        setCurrentPlan(transformPlan(subscription.subscription_plans));
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
    fetchPlans();
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
      plans,
      loading,
      itemCount,
      userItemCount: itemCount,
      canCreateMore,
      canListMoreItems: canCreateMore,
      refreshSubscription
    }}>
      {children}
    </SubscriptionContext.Provider>
  );
};
