
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface PaymentData {
  amount: number;
  phoneNumber: string;
  description: string;
  payment_type: 'subscription' | 'rental_payment';
  plan_id?: string;
  booking_id?: string;
  account_reference: string;
}

export const useMpesaPayment = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const createPayment = async (paymentData: PaymentData) => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('Authentication required');
      }

      const response = await supabase.functions.invoke('create-mpesa-payment', {
        body: {
          ...paymentData,
          callback_url: `${window.location.origin}/payment-callback`,
          transaction_id: crypto.randomUUID()
        },
        headers: {
          Authorization: `Bearer ${session.access_token}`
        }
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      // M-Pesa payment initiated, show success message
      toast({
        title: "Payment Initiated",
        description: "Please check your phone for the M-Pesa payment prompt",
      });

      return response.data;
    } catch (error) {
      console.error('Payment creation error:', error);
      toast({
        title: "Payment Error",
        description: error instanceof Error ? error.message : "Failed to create payment",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    createPayment,
    loading
  };
};
