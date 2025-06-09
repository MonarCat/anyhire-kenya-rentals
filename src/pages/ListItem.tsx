
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { useCategories } from '@/hooks/useCategories';
import ListItemForm from '@/components/forms/ListItemForm';
import ActiveListingsSidebar from '@/components/ActiveListingsSidebar';
import AuthGuard from '@/components/guards/AuthGuard';
import SubscriptionGuard from '@/components/guards/SubscriptionGuard';
import LoadingSpinner from '@/components/LoadingSpinner';

const ListItem = () => {
  const { user } = useAuth();
  const { canListMoreItems } = useSubscription();
  const { categories, loading } = useCategories();

  if (!user) {
    return <AuthGuard />;
  }

  if (!canListMoreItems) {
    return <SubscriptionGuard />;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner size="lg" text="Loading categories..." />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">List Your Item</CardTitle>
                <CardDescription>
                  Create a listing to rent out your item and start earning
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ListItemForm categories={categories} />
              </CardContent>
            </Card>
          </div>

          {/* Live Items Sidebar */}
          <div className="lg:col-span-1">
            <ActiveListingsSidebar />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListItem;
