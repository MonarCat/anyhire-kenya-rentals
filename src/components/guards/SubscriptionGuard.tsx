
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useSubscription } from '@/contexts/SubscriptionContext';

const SubscriptionGuard: React.FC = () => {
  const navigate = useNavigate();
  const { currentPlan } = useSubscription();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <Card className="max-w-md w-full mx-4">
        <CardHeader className="text-center">
          <CardTitle>Listing Limit Reached</CardTitle>
          <CardDescription>
            You've reached your limit of {currentPlan.itemLimit} items for the {currentPlan.name} plan.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={() => navigate('/pricing')}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            Upgrade Plan
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default SubscriptionGuard;
