
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { CreditCard, Smartphone, DollarSign } from 'lucide-react';
import { usePesapalPayment, PaymentData } from '@/hooks/usePesapalPayment';
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
  const [paymentMethod, setPaymentMethod] = useState('mpesa');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  
  const { createPayment, loading } = usePesapalPayment();
  const { profile } = useAuth();

  const handlePayment = async () => {
    try {
      const paymentData: PaymentData = {
        amount: amount * 100, // Convert to cents
        currency: 'KES',
        description,
        payment_type: paymentType,
        plan_id: planId,
        booking_id: bookingId,
        billing_address: {
          email_address: email || profile?.email || '',
          phone_number: phoneNumber,
          country_code: 'KE',
          first_name: firstName || profile?.full_name?.split(' ')[0] || '',
          last_name: lastName || profile?.full_name?.split(' ')[1] || ''
        }
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

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="w-full bg-green-600 hover:bg-green-700">
          <DollarSign className="w-4 h-4 mr-2" />
          Pay {formatAmount(amount)}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Complete Payment</DialogTitle>
          <DialogDescription>
            Choose your preferred payment method to complete the transaction.
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
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <Label className="text-base font-semibold">Payment Method</Label>
            <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
              <div className="flex items-center space-x-2 p-3 border rounded-lg">
                <RadioGroupItem value="mpesa" id="mpesa" />
                <Smartphone className="w-5 h-5 text-green-600" />
                <Label htmlFor="mpesa" className="flex-1 cursor-pointer">
                  M-Pesa
                </Label>
              </div>
              <div className="flex items-center space-x-2 p-3 border rounded-lg">
                <RadioGroupItem value="airtel" id="airtel" />
                <Smartphone className="w-5 h-5 text-red-600" />
                <Label htmlFor="airtel" className="flex-1 cursor-pointer">
                  Airtel Money
                </Label>
              </div>
              <div className="flex items-center space-x-2 p-3 border rounded-lg">
                <RadioGroupItem value="card" id="card" />
                <CreditCard className="w-5 h-5 text-blue-600" />
                <Label htmlFor="card" className="flex-1 cursor-pointer">
                  Credit/Debit Card
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Enter first name"
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Enter last name"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email address"
              />
            </div>

            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="254xxxxxxxxx"
              />
            </div>
          </div>

          <Button 
            onClick={handlePayment} 
            disabled={loading || !phoneNumber || !email || !firstName}
            className="w-full bg-green-600 hover:bg-green-700"
          >
            {loading ? 'Processing...' : `Pay ${formatAmount(amount)}`}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentButton;
