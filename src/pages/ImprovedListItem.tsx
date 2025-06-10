
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { useCategories } from '@/hooks/useCategories';
import ImprovedListItemForm from '@/components/forms/ImprovedListItemForm';
import ActiveListingsSidebar from '@/components/ActiveListingsSidebar';
import AuthGuard from '@/components/guards/AuthGuard';
import SubscriptionGuard from '@/components/guards/SubscriptionGuard';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, AlertCircle } from 'lucide-react';

const ImprovedListItem = () => {
  const { user } = useAuth();
  const { canListMoreItems } = useSubscription();
  const { categories, loading, error } = useCategories();

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

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Failed to load categories: {error}
            </AlertDescription>
          </Alert>
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
                <CardTitle className="text-2xl flex items-center">
                  <CheckCircle className="w-6 h-6 mr-2 text-green-500" />
                  List Your Item
                </CardTitle>
                <CardDescription>
                  Create a listing to rent out your item and start earning. Fill out all required fields marked with *.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Alert className="mb-6">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Tips for a successful listing:</strong>
                    <ul className="mt-2 list-disc list-inside text-sm">
                      <li>Use clear, high-quality photos</li>
                      <li>Write detailed descriptions</li>
                      <li>Set competitive pricing</li>
                      <li>Be honest about item condition</li>
                    </ul>
                  </AlertDescription>
                </Alert>
                
                <ImprovedListItemForm categories={categories} />
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

export default ImprovedListItem;
