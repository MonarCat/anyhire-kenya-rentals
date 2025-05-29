
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface PaymentData {
  amount: number;
  currency: string;
  description: string;
  payment_type: 'subscription' | 'rental_payment';
  plan_id?: string;
  booking_id?: string;
  billing_address: {
    email_address: string;
    phone_number: string;
    country_code: string;
    first_name: string;
    last_name: string;
  };
}

export const usePesapalPayment = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const createPayment = async (paymentData: PaymentData) => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('Authentication required');
      }

      const response = await supabase.functions.invoke('create-pesapal-payment', {
        body: {
          ...paymentData,
          callback_url: `${window.location.origin}/payment-callback`,
          notification_id: crypto.randomUUID()
        },
        headers: {
          Authorization: `Bearer ${session.access_token}`
        }
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      // Redirect to Pesapal payment page
      if (response.data?.redirect_url) {
        window.location.href = response.data.redirect_url;
      }

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
