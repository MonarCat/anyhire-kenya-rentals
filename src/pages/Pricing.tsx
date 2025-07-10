
import React from 'react';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import PaymentButton from '@/components/PaymentButton';

const Pricing = () => {
  const { plans, currentPlan, loading } = useSubscription();
  const { user } = useAuth();
  const { toast } = useToast();

  const handlePaymentSuccess = () => {
    toast({
      title: "Payment Successful!",
      description: "Your subscription has been upgraded successfully.",
    });
    // Refresh the page to update the subscription context
    window.location.reload();
  };

  const handleFreeUpgrade = (planId: string) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to upgrade your plan.",
        variant: "destructive",
      });
      return;
    }

    // Handle free plan upgrade locally
    localStorage.setItem(`anyhire_plan_${user.id}`, planId);
    toast({
      title: "Plan upgraded!",
      description: "Your subscription has been successfully updated.",
    });
    window.location.reload();
  };

  // Show loading state while subscription data is being fetched
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading pricing plans...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Choose Your Plan</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Select the perfect plan for your rental needs. All plans include our 5% commission on successful rentals.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 max-w-7xl mx-auto">
          {plans.map((plan) => {
            // Safely handle features as an array
            const features = Array.isArray(plan.features) ? plan.features : [];
            
            return (
              <Card key={plan.id} className={`relative ${currentPlan?.id === plan.id ? 'ring-2 ring-green-500' : ''}`}>
                <CardHeader className="text-center">
                  {plan.id === 'silver' && (
                    <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-green-600">
                      Most Popular
                    </Badge>
                  )}
                  {currentPlan?.id === plan.id && (
                    <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-600">
                      Current Plan
                    </Badge>
                  )}
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <CardDescription>
                    {plan.price === 0 ? 'Free' : `KES ${plan.price.toLocaleString()}/month`}
                  </CardDescription>
                  <div className="text-3xl font-bold text-green-600">
                    {plan.item_limit === null ? '∞' : plan.item_limit}
                    <span className="text-sm text-gray-600 font-normal"> items</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <Check className="w-4 h-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  {currentPlan?.id === plan.id ? (
                    <Button className="w-full" variant="outline" disabled>
                      Current Plan
                    </Button>
                  ) : plan.price === 0 ? (
                    <Button 
                      className="w-full" 
                      onClick={() => handleFreeUpgrade(plan.id)}
                    >
                      Get Started
                    </Button>
                  ) : (
                    <PaymentButton
                      amount={plan.price}
                      description={`${plan.name} Subscription Plan - ${plan.item_limit === null ? 'Unlimited' : plan.item_limit} items`}
                      paymentType="subscription"
                      planId={plan.id}
                      onSuccess={handlePaymentSuccess}
                    />
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <h2 className="text-2xl font-bold mb-4">Commission Structure</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            AnyHire charges a 5% commission on all successful rental transactions. 
            This helps us maintain the platform and provide excellent customer support.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
