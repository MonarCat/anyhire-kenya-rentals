import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Clock, Smartphone } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const PaymentCallback: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [paymentStatus, setPaymentStatus] = useState<'loading' | 'success' | 'failed' | 'pending'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const checkPaymentStatus = async () => {
      const transactionId = searchParams.get('transaction_id');
      const checkoutRequestId = searchParams.get('checkout_request_id');

      if (!transactionId && !checkoutRequestId) {
        setPaymentStatus('failed');
        setMessage('Invalid payment reference');
        return;
      }

      try {
        // Check transaction status in database
        const { data: transactions, error } = await supabase
          .from('transactions')
          .select('*')
          .or(
            transactionId 
              ? `id.eq.${transactionId}` 
              : `mpesa_checkout_request_id.eq.${checkoutRequestId}`
          );

        if (error || !transactions || transactions.length === 0) {
          setPaymentStatus('failed');
          setMessage('Transaction not found');
          return;
        }

        const transaction = transactions[0];

        // Check current status
        if (transaction.status === 'completed') {
          setPaymentStatus('success');
          setMessage('M-Pesa payment completed successfully!');
        } else if (transaction.status === 'failed') {
          setPaymentStatus('failed');
          setMessage('M-Pesa payment failed. Please try again.');
        } else if (transaction.status === 'cancelled') {
          setPaymentStatus('failed');
          setMessage('M-Pesa payment was cancelled.');
        } else {
          setPaymentStatus('pending');
          setMessage('M-Pesa payment is being processed. Please complete the payment on your phone.');
          
          // Poll for status updates
          const pollInterval = setInterval(async () => {
            const { data: updatedTransactions } = await supabase
              .from('transactions')
              .select('status')
              .eq('id', transaction.id);

            const updatedTransaction = updatedTransactions?.[0];

            if (updatedTransaction?.status === 'completed') {
              setPaymentStatus('success');
              setMessage('M-Pesa payment completed successfully!');
              clearInterval(pollInterval);
            } else if (updatedTransaction?.status === 'failed' || updatedTransaction?.status === 'cancelled') {
              setPaymentStatus('failed');
              setMessage('M-Pesa payment failed. Please try again.');
              clearInterval(pollInterval);
            }
          }, 3000);

          // Stop polling after 5 minutes
          setTimeout(() => {
            clearInterval(pollInterval);
            if (paymentStatus === 'pending') {
              setPaymentStatus('pending');
              setMessage('M-Pesa payment is still being processed. You will receive a confirmation shortly.');
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
        return <Smartphone className="w-16 h-16 text-green-500 animate-pulse" />;
      default:
        return <Clock className="w-16 h-16 text-gray-400 animate-spin" />;
    }
  };

  const getStatusTitle = () => {
    switch (paymentStatus) {
      case 'success':
        return 'M-Pesa Payment Successful!';
      case 'failed':
        return 'M-Pesa Payment Failed';
      case 'pending':
        return 'Complete M-Pesa Payment';
      default:
        return 'Processing M-Pesa Payment...';
    }
  };

  const getStatusColor = () => {
    switch (paymentStatus) {
      case 'success':
        return 'text-green-600';
      case 'failed':
        return 'text-red-600';
      case 'pending':
        return 'text-green-600';
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
          {paymentStatus === 'pending' && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center">
                <Smartphone className="w-5 h-5 text-green-600 mr-2" />
                <span className="text-sm font-medium text-green-800">
                  Check your phone for M-Pesa payment prompt
                </span>
              </div>
            </div>
          )}
          
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
                className="w-full bg-green-600 hover:bg-green-700"
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
                variant="outline"
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
              Checking M-Pesa payment status...
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentCallback;
