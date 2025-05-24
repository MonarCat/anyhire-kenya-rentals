
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';

interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  itemLimit: number;
  features: string[];
  adType: 'normal' | 'top' | 'super' | 'vip';
}

interface SubscriptionContextType {
  currentPlan: SubscriptionPlan;
  plans: SubscriptionPlan[];
  userItemCount: number;
  canListMoreItems: boolean;
  upgradePlan: (planId: string) => Promise<void>;
}

const plans: SubscriptionPlan[] = [
  {
    id: 'basic',
    name: 'Basic',
    price: 0,
    itemLimit: 5,
    features: ['Up to 5 free listings', 'Basic support'],
    adType: 'normal'
  },
  {
    id: 'bronze',
    name: 'Bronze',
    price: 150,
    itemLimit: 15,
    features: ['Up to 15 listings', 'Normal ads', 'Email support'],
    adType: 'normal'
  },
  {
    id: 'silver',
    name: 'Silver',
    price: 350,
    itemLimit: 40,
    features: ['Up to 40 listings', 'Top ads placement', 'Priority support'],
    adType: 'top'
  },
  {
    id: 'gold',
    name: 'Gold',
    price: 750,
    itemLimit: 100,
    features: ['Up to 100 listings', 'Super top ads', 'Phone support'],
    adType: 'super'
  },
  {
    id: 'diamond',
    name: 'Diamond',
    price: 3500,
    itemLimit: Infinity,
    features: ['Unlimited listings', 'VIP ads placement', 'Dedicated support'],
    adType: 'vip'
  }
];

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
};

export const SubscriptionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [currentPlan, setCurrentPlan] = useState<SubscriptionPlan>(plans[0]);
  const [userItemCount, setUserItemCount] = useState(0);

  useEffect(() => {
    if (user) {
      // Simulate fetching user's current plan and item count
      const storedPlan = localStorage.getItem(`anyhire_plan_${user.id}`);
      if (storedPlan) {
        const plan = plans.find(p => p.id === storedPlan) || plans[0];
        setCurrentPlan(plan);
      }
      
      const storedItemCount = localStorage.getItem(`anyhire_items_${user.id}`);
      setUserItemCount(storedItemCount ? parseInt(storedItemCount) : 0);
    }
  }, [user]);

  const canListMoreItems = userItemCount < currentPlan.itemLimit;

  const upgradePlan = async (planId: string) => {
    const newPlan = plans.find(p => p.id === planId);
    if (newPlan && user) {
      setCurrentPlan(newPlan);
      localStorage.setItem(`anyhire_plan_${user.id}`, planId);
    }
  };

  return (
    <SubscriptionContext.Provider value={{
      currentPlan,
      plans,
      userItemCount,
      canListMoreItems,
      upgradePlan
    }}>
      {children}
    </SubscriptionContext.Provider>
  );
};
