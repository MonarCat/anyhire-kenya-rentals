
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Clock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const PaymentCallback: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [paymentStatus, setPaymentStatus] = useState<'loading' | 'success' | 'failed' | 'pending'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const checkPaymentStatus = async () => {
      const orderTrackingId = searchParams.get('OrderTrackingId');
      const orderMerchantReference = searchParams.get('OrderMerchantReference');

      if (!orderTrackingId) {
        setPaymentStatus('failed');
        setMessage('Invalid payment reference');
        return;
      }

      try {
        // Check transaction status in database
        const { data: transaction, error } = await supabase
          .from('transactions')
          .select('*')
          .eq('pesapal_tracking_id', orderTrackingId)
          .single();

        if (error || !transaction) {
          setPaymentStatus('failed');
          setMessage('Transaction not found');
          return;
        }

        // Check current status
        if (transaction.status === 'completed') {
          setPaymentStatus('success');
          setMessage('Payment completed successfully!');
        } else if (transaction.status === 'failed') {
          setPaymentStatus('failed');
          setMessage('Payment failed. Please try again.');
        } else if (transaction.status === 'cancelled') {
          setPaymentStatus('failed');
          setMessage('Payment was cancelled.');
        } else {
          setPaymentStatus('pending');
          setMessage('Payment is being processed. Please wait...');
          
          // Poll for status updates
          const pollInterval = setInterval(async () => {
            const { data: updatedTransaction } = await supabase
              .from('transactions')
              .select('status')
              .eq('id', transaction.id)
              .single();

            if (updatedTransaction?.status === 'completed') {
              setPaymentStatus('success');
              setMessage('Payment completed successfully!');
              clearInterval(pollInterval);
            } else if (updatedTransaction?.status === 'failed' || updatedTransaction?.status === 'cancelled') {
              setPaymentStatus('failed');
              setMessage('Payment failed. Please try again.');
              clearInterval(pollInterval);
            }
          }, 3000);

          // Stop polling after 5 minutes
          setTimeout(() => {
            clearInterval(pollInterval);
            if (paymentStatus === 'pending') {
              setPaymentStatus('pending');
              setMessage('Payment is still being processed. You will receive a confirmation shortly.');
            }
          }, 300000);
        }
      } catch (error) {
        console.error('Error checking payment status:', error);
        setPaymentStatus('failed');
        setMessage('Error checking payment status');
      }
    };

    checkPaymentStatus();
  }, [searchParams]);

  const getStatusIcon = () => {
    switch (paymentStatus) {
      case 'success':
        return <CheckCircle className="w-16 h-16 text-green-500" />;
      case 'failed':
        return <XCircle className="w-16 h-16 text-red-500" />;
      case 'pending':
        return <Clock className="w-16 h-16 text-yellow-500" />;
      default:
        return <Clock className="w-16 h-16 text-gray-400 animate-spin" />;
    }
  };

  const getStatusTitle = () => {
    switch (paymentStatus) {
      case 'success':
        return 'Payment Successful!';
      case 'failed':
        return 'Payment Failed';
      case 'pending':
        return 'Payment Pending';
      default:
        return 'Processing Payment...';
    }
  };

  const getStatusColor = () => {
    switch (paymentStatus) {
      case 'success':
        return 'text-green-600';
      case 'failed':
        return 'text-red-600';
      case 'pending':
        return 'text-yellow-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            {getStatusIcon()}
          </div>
          <CardTitle className={`text-xl ${getStatusColor()}`}>
            {getStatusTitle()}
          </CardTitle>
          <CardDescription>
            {message}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {paymentStatus === 'success' && (
            <div className="space-y-3">
              <Button 
                onClick={() => navigate('/dashboard')} 
                className="w-full bg-green-600 hover:bg-green-700"
              >
                Go to Dashboard
              </Button>
              <Button 
                onClick={() => navigate('/')} 
                variant="outline" 
                className="w-full"
              >
                Back to Home
              </Button>
            </div>
          )}
          
          {paymentStatus === 'failed' && (
            <div className="space-y-3">
              <Button 
                onClick={() => navigate('/pricing')} 
                className="w-full"
              >
                Try Again
              </Button>
              <Button 
                onClick={() => navigate('/')} 
                variant="outline" 
                className="w-full"
              >
                Back to Home
              </Button>
            </div>
          )}
          
          {paymentStatus === 'pending' && (
            <div className="space-y-3">
              <Button 
                onClick={() => navigate('/dashboard')} 
                className="w-full"
              >
                Go to Dashboard
              </Button>
              <Button 
                onClick={() => window.location.reload()} 
                variant="outline" 
                className="w-full"
              >
                Refresh Status
              </Button>
            </div>
          )}
          
          {paymentStatus === 'loading' && (
            <div className="text-center text-gray-500">
              Checking payment status...
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentCallback;
