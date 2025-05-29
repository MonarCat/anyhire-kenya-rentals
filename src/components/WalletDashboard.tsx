
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { Wallet, DollarSign, ArrowUpRight, ArrowDownLeft, Clock, CheckCircle, XCircle } from 'lucide-react';
import { useWallet } from '@/hooks/useWallet';

const WalletDashboard: React.FC = () => {
  const { wallet, transactions, withdrawalRequests, loading, requestWithdrawal } = useWallet();
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawMethod, setWithdrawMethod] = useState('mpesa');
  const [accountDetails, setAccountDetails] = useState({
    phone_number: '',
    bank_name: '',
    account_number: '',
    account_name: ''
  });

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES'
    }).format(amount / 100);
  };

  const handleWithdrawal = async () => {
    try {
      const amount = parseFloat(withdrawAmount) * 100; // Convert to cents
      
      const details = withdrawMethod === 'mpesa' || withdrawMethod === 'airtel'
        ? { phone_number: accountDetails.phone_number }
        : {
            bank_name: accountDetails.bank_name,
            account_number: accountDetails.account_number,
            account_name: accountDetails.account_name
          };

      await requestWithdrawal(amount, withdrawMethod, details);
      setIsWithdrawOpen(false);
      setWithdrawAmount('');
      setAccountDetails({
        phone_number: '',
        bank_name: '',
        account_number: '',
        account_name: ''
      });
    } catch (error) {
      console.error('Withdrawal error:', error);
    }
  };

  const getTransactionIcon = (type: string, amount: number) => {
    if (type === 'withdrawal') {
      return <ArrowUpRight className="w-4 h-4 text-red-500" />;
    } else if (type === 'rental_payment' || type === 'deposit') {
      return <ArrowDownLeft className="w-4 h-4 text-green-500" />;
    }
    return <DollarSign className="w-4 h-4 text-blue-500" />;
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: 'default',
      completed: 'default',
      failed: 'destructive',
      cancelled: 'secondary',
      approved: 'default',
      rejected: 'destructive'
    } as const;

    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      completed: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800',
      cancelled: 'bg-gray-100 text-gray-800',
      approved: 'bg-blue-100 text-blue-800',
      rejected: 'bg-red-100 text-red-800'
    };

    return (
      <Badge variant={variants[status as keyof typeof variants]} className={colors[status as keyof typeof colors]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  if (!wallet) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-gray-500">
            Loading wallet information...
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Wallet Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Balance</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatAmount(wallet.balance)}
            </div>
            <p className="text-xs text-muted-foreground">
              Available for withdrawal
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Earned</CardTitle>
            <ArrowDownLeft className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatAmount(wallet.total_earned)}
            </div>
            <p className="text-xs text-muted-foreground">
              Lifetime earnings
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Withdrawn</CardTitle>
            <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatAmount(wallet.total_withdrawn)}
            </div>
            <p className="text-xs text-muted-foreground">
              Total withdrawals
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Withdraw Button */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Withdraw your earnings to your mobile money or bank account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Dialog open={isWithdrawOpen} onOpenChange={setIsWithdrawOpen}>
            <DialogTrigger asChild>
              <Button 
                disabled={wallet.balance < 10000} // Minimum KES 100
                className="bg-green-600 hover:bg-green-700"
              >
                <ArrowUpRight className="w-4 h-4 mr-2" />
                Withdraw Funds
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Withdraw Funds</DialogTitle>
                <DialogDescription>
                  Minimum withdrawal amount is KES 100. Funds will be processed within 24 hours.
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="amount">Withdrawal Amount (KES)</Label>
                  <Input
                    id="amount"
                    type="number"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    placeholder="Enter amount"
                    min="100"
                    max={wallet.balance / 100}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Available: {formatAmount(wallet.balance)}
                  </p>
                </div>

                <div>
                  <Label>Withdrawal Method</Label>
                  <RadioGroup value={withdrawMethod} onValueChange={setWithdrawMethod}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="mpesa" id="mpesa" />
                      <Label htmlFor="mpesa">M-Pesa</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="airtel" id="airtel" />
                      <Label htmlFor="airtel">Airtel Money</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="bank" id="bank" />
                      <Label htmlFor="bank">Bank Transfer</Label>
                    </div>
                  </RadioGroup>
                </div>

                {(withdrawMethod === 'mpesa' || withdrawMethod === 'airtel') && (
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={accountDetails.phone_number}
                      onChange={(e) => setAccountDetails(prev => ({
                        ...prev,
                        phone_number: e.target.value
                      }))}
                      placeholder="254xxxxxxxxx"
                    />
                  </div>
                )}

                {withdrawMethod === 'bank' && (
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="bankName">Bank Name</Label>
                      <Input
                        id="bankName"
                        value={accountDetails.bank_name}
                        onChange={(e) => setAccountDetails(prev => ({
                          ...prev,
                          bank_name: e.target.value
                        }))}
                        placeholder="Enter bank name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="accountNumber">Account Number</Label>
                      <Input
                        id="accountNumber"
                        value={accountDetails.account_number}
                        onChange={(e) => setAccountDetails(prev => ({
                          ...prev,
                          account_number: e.target.value
                        }))}
                        placeholder="Enter account number"
                      />
                    </div>
                    <div>
                      <Label htmlFor="accountName">Account Name</Label>
                      <Input
                        id="accountName"
                        value={accountDetails.account_name}
                        onChange={(e) => setAccountDetails(prev => ({
                          ...prev,
                          account_name: e.target.value
                        }))}
                        placeholder="Enter account name"
                      />
                    </div>
                  </div>
                )}

                <Button 
                  onClick={handleWithdrawal} 
                  disabled={loading || !withdrawAmount || parseFloat(withdrawAmount) < 100}
                  className="w-full"
                >
                  {loading ? 'Processing...' : 'Submit Withdrawal Request'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>

      {/* Tabs for Transactions and Withdrawals */}
      <Tabs defaultValue="transactions" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="transactions">Transaction History</TabsTrigger>
          <TabsTrigger value="withdrawals">Withdrawal Requests</TabsTrigger>
        </TabsList>

        <TabsContent value="transactions">
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>
                Your recent earnings and payments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {transactions.length === 0 ? (
                  <p className="text-center text-gray-500 py-4">No transactions yet</p>
                ) : (
                  transactions.map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        {getTransactionIcon(transaction.transaction_type, transaction.amount)}
                        <div>
                          <p className="font-medium">
                            {transaction.description || transaction.transaction_type.replace('_', ' ')}
                          </p>
                          <p className="text-sm text-gray-500">
                            {new Date(transaction.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-semibold ${
                          transaction.transaction_type === 'withdrawal' ? 'text-red-600' : 'text-green-600'
                        }`}>
                          {transaction.transaction_type === 'withdrawal' ? '-' : '+'}
                          {formatAmount(transaction.amount)}
                        </p>
                        {getStatusBadge(transaction.status)}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="withdrawals">
          <Card>
            <CardHeader>
              <CardTitle>Withdrawal Requests</CardTitle>
              <CardDescription>
                Track your withdrawal requests and their status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {withdrawalRequests.length === 0 ? (
                  <p className="text-center text-gray-500 py-4">No withdrawal requests yet</p>
                ) : (
                  withdrawalRequests.map((request) => (
                    <div key={request.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <ArrowUpRight className="w-4 h-4 text-blue-500" />
                        <div>
                          <p className="font-medium">
                            {request.payment_method.toUpperCase()} Withdrawal
                          </p>
                          <p className="text-sm text-gray-500">
                            {new Date(request.requested_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-red-600">
                          -{formatAmount(request.amount)}
                        </p>
                        {getStatusBadge(request.status)}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WalletDashboard;
