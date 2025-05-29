
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface Wallet {
  id: string;
  user_id: string;
  balance: number;
  total_earned: number;
  total_withdrawn: number;
  created_at: string;
  updated_at: string;
}

export interface Transaction {
  id: string;
  user_id: string;
  booking_id?: string;
  transaction_type: string;
  amount: number;
  currency: string;
  status: string;
  payment_method?: string;
  description?: string;
  created_at: string;
}

export interface WithdrawalRequest {
  id: string;
  amount: number;
  payment_method: string;
  account_details: any;
  status: string;
  requested_at: string;
  processed_at?: string;
}

export const useWallet = () => {
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [withdrawalRequests, setWithdrawalRequests] = useState<WithdrawalRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchWallet = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_wallets')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      setWallet(data);
    } catch (error) {
      console.error('Error fetching wallet:', error);
    }
  };

  const fetchTransactions = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setTransactions(data || []);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  const fetchWithdrawalRequests = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('withdrawal_requests')
        .select('*')
        .eq('user_id', user.id)
        .order('requested_at', { ascending: false });

      if (error) throw error;
      setWithdrawalRequests(data || []);
    } catch (error) {
      console.error('Error fetching withdrawal requests:', error);
    }
  };

  const requestWithdrawal = async (amount: number, paymentMethod: string, accountDetails: any) => {
    if (!user) throw new Error('Authentication required');

    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Authentication required');

      const response = await supabase.functions.invoke('process-withdrawal', {
        body: {
          amount,
          payment_method: paymentMethod,
          account_details: accountDetails
        },
        headers: {
          Authorization: `Bearer ${session.access_token}`
        }
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      toast({
        title: "Withdrawal Request Submitted",
        description: "Your withdrawal request has been submitted and will be processed within 24 hours.",
      });

      // Refresh data
      await Promise.all([fetchWallet(), fetchWithdrawalRequests(), fetchTransactions()]);

      return response.data;
    } catch (error) {
      console.error('Withdrawal request error:', error);
      toast({
        title: "Withdrawal Error",
        description: error instanceof Error ? error.message : "Failed to submit withdrawal request",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchWallet();
      fetchTransactions();
      fetchWithdrawalRequests();
    }
  }, [user]);

  // Set up real-time subscriptions
  useEffect(() => {
    if (!user) return;

    const walletSubscription = supabase
      .channel('wallet-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_wallets',
          filter: `user_id=eq.${user.id}`
        },
        () => {
          fetchWallet();
        }
      )
      .subscribe();

    const transactionSubscription = supabase
      .channel('transaction-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'transactions',
          filter: `user_id=eq.${user.id}`
        },
        () => {
          fetchTransactions();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(walletSubscription);
      supabase.removeChannel(transactionSubscription);
    };
  }, [user]);

  return {
    wallet,
    transactions,
    withdrawalRequests,
    loading,
    requestWithdrawal,
    refetchWallet: fetchWallet,
    refetchTransactions: fetchTransactions,
    refetchWithdrawalRequests: fetchWithdrawalRequests
  };
};
