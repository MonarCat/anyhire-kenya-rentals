
import React from 'react';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const Pricing = () => {
  const { plans, currentPlan, upgradePlan } = useSubscription();
  const { user } = useAuth();
  const { toast } = useToast();

  const handleUpgrade = async (planId: string) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to upgrade your plan.",
        variant: "destructive",
      });
      return;
    }

    try {
      await upgradePlan(planId);
      toast({
        title: "Plan upgraded!",
        description: "Your subscription has been successfully updated.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upgrade plan. Please try again.",
        variant: "destructive",
      });
    }
  };

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
          {plans.map((plan) => (
            <Card key={plan.id} className={`relative ${currentPlan.id === plan.id ? 'ring-2 ring-green-500' : ''}`}>
              <CardHeader className="text-center">
                {plan.id === 'silver' && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-green-600">
                    Most Popular
                  </Badge>
                )}
                {currentPlan.id === plan.id && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-600">
                    Current Plan
                  </Badge>
                )}
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <CardDescription>
                  {plan.price === 0 ? 'Free' : `KES ${plan.price.toLocaleString()}/month`}
                </CardDescription>
                <div className="text-3xl font-bold text-green-600">
                  {plan.itemLimit === Infinity ? '∞' : plan.itemLimit}
                  <span className="text-sm text-gray-600 font-normal"> items</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <Check className="w-4 h-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button 
                  className="w-full" 
                  variant={currentPlan.id === plan.id ? "outline" : "default"}
                  onClick={() => handleUpgrade(plan.id)}
                  disabled={currentPlan.id === plan.id}
                >
                  {currentPlan.id === plan.id ? 'Current Plan' : 
                   plan.price === 0 ? 'Get Started' : 'Upgrade'}
                </Button>
              </CardContent>
            </Card>
          ))}
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
