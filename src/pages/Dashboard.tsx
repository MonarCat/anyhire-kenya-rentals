import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Eye, Edit, Trash2, TrendingUp, DollarSign, Package, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { useRealtimeItems } from '@/hooks/useRealtimeItems';
import ProfileAvatar from "@/components/ProfileAvatar";
import DashboardStats from "@/components/dashboard/DashboardStats";
import UserListedItems from "@/components/dashboard/UserListedItems";

const Dashboard = () => {
  const { user, profile } = useAuth();
  const { currentPlan, userItemCount } = useSubscription();
  const { userItems, loading } = useRealtimeItems();

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardHeader className="text-center">
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>Please sign in to access your dashboard</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full bg-blue-600 hover:bg-blue-700">
              <Link to="/auth">Sign In</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const displayName = profile?.full_name || user.email?.split('@')[0] || 'User';

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-gray-600 mt-1">Welcome back, {displayName}</p>
          </div>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <Button asChild className="bg-blue-600 hover:bg-blue-700">
              <Link to="/list-item">
                <Plus className="w-4 h-4 mr-2" />
                List New Item
              </Link>
            </Button>
          </div>
        </div>

        {/* Subscription Status and Stats */}
        <DashboardStats currentPlan={currentPlan} userItemCount={userItemCount} />

        {/* Listings: Real only, edit options */}
        <Tabs defaultValue="listings" className="space-y-4">
          <TabsList>
            <TabsTrigger value="listings">My Listings</TabsTrigger>
            <TabsTrigger value="rentals">My Rentals</TabsTrigger>
          </TabsList>

          <TabsContent value="listings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Your Listed Items</CardTitle>
                <CardDescription>
                  Manage your rental listings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <UserListedItems userItems={userItems} loading={loading} />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Rentals section not shown for brevity */}
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
