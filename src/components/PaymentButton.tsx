
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Smartphone, DollarSign } from 'lucide-react';
import { useMpesaPayment, PaymentData } from '@/hooks/useMpesaPayment';
import { useAuth } from '@/contexts/AuthContext';

interface PaymentButtonProps {
  amount: number;
  description: string;
  paymentType: 'subscription' | 'rental_payment';
  planId?: string;
  bookingId?: string;
  onSuccess?: () => void;
}

const PaymentButton: React.FC<PaymentButtonProps> = ({
  amount,
  description,
  paymentType,
  planId,
  bookingId,
  onSuccess
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  
  const { createPayment, loading } = useMpesaPayment();
  const { profile, user } = useAuth();

  const handlePayment = async () => {
    try {
      const paymentData: PaymentData = {
        amount,
        phoneNumber,
        description,
        payment_type: paymentType,
        plan_id: planId,
        booking_id: bookingId,
        account_reference: `${paymentType}_${planId || bookingId || 'payment'}`
      };

      await createPayment(paymentData);
      setIsOpen(false);
      onSuccess?.();
    } catch (error) {
      console.error('Payment error:', error);
    }
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES'
    }).format(amount);
  };

  const formatPhoneNumber = (phone: string) => {
    // Remove any non-digit characters
    const digits = phone.replace(/\D/g, '');
    
    // If starts with 0, replace with 254
    if (digits.startsWith('0')) {
      return '254' + digits.slice(1);
    }
    
    // If starts with +254, remove +
    if (digits.startsWith('254')) {
      return digits;
    }
    
    // If 9 digits, assume it's missing country code
    if (digits.length === 9) {
      return '254' + digits;
    }
    
    return digits;
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="w-full bg-green-600 hover:bg-green-700">
          <DollarSign className="w-4 h-4 mr-2" />
          Pay {formatAmount(amount)}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Smartphone className="w-5 h-5 mr-2 text-green-600" />
            M-Pesa Payment
          </DialogTitle>
          <DialogDescription>
            Pay securely using M-Pesa mobile money
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Payment Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Amount:</span>
                  <span className="font-semibold">{formatAmount(amount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Description:</span>
                  <span className="text-sm">{description}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Payment Method:</span>
                  <span className="text-sm font-medium text-green-600">M-Pesa</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <div>
              <Label htmlFor="phone">M-Pesa Phone Number</Label>
              <Input
                id="phone"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="254700123456 or 0700123456"
                type="tel"
              />
              <p className="text-xs text-gray-500 mt-1">
                Enter your Safaricom number registered with M-Pesa
              </p>
            </div>
          </div>

          <Button 
            onClick={handlePayment} 
            disabled={loading || !phoneNumber}
            className="w-full bg-green-600 hover:bg-green-700"
          >
            {loading ? 'Processing...' : `Pay ${formatAmount(amount)} via M-Pesa`}
          </Button>
          
          <div className="text-xs text-gray-500 text-center">
            You will receive an M-Pesa payment prompt on your phone
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentButton;
