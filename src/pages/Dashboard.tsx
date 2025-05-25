
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Eye, Edit, Trash2, TrendingUp, DollarSign, Package, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { useSubscription } from '@/contexts/SubscriptionContext';

const Dashboard = () => {
  const { user, profile } = useAuth();
  const { currentPlan, userItemCount } = useSubscription();

  const mockStats = {
    totalListings: userItemCount,
    activeRentals: 0,
    totalEarnings: 0,
    totalViews: 0
  };

  const mockListings: any[] = [];
  const mockRentals: any[] = [];

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

        {/* Subscription Status */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Current Plan: {currentPlan.name}</span>
              <Badge variant={currentPlan.id === 'basic' ? 'secondary' : 'default'}>
                {currentPlan.price === 0 ? 'Free' : `KES ${currentPlan.price}/month`}
              </Badge>
            </CardTitle>
            <CardDescription>
              You've used {userItemCount} of {currentPlan.itemLimit === Infinity ? '∞' : currentPlan.itemLimit} listings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="flex-1">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ 
                      width: currentPlan.itemLimit === Infinity 
                        ? '0%' 
                        : `${Math.min((userItemCount / currentPlan.itemLimit) * 100, 100)}%` 
                    }}
                  ></div>
                </div>
              </div>
              <Button asChild variant="outline" className="ml-4">
                <Link to="/pricing">Upgrade Plan</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Listings</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockStats.totalListings}</div>
              <p className="text-xs text-muted-foreground">
                Active items listed
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Rentals</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockStats.activeRentals}</div>
              <p className="text-xs text-muted-foreground">
                Items currently rented
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">KES {mockStats.totalEarnings.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                Start listing to earn
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Views</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockStats.totalViews.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                Item page views
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs for Listings and Rentals */}
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
                {mockListings.length === 0 ? (
                  <div className="text-center py-8">
                    <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No items listed yet</h3>
                    <p className="text-gray-600 mb-4">Start earning by listing your first item for rent</p>
                    <Button asChild className="bg-blue-600 hover:bg-blue-700">
                      <Link to="/list-item">
                        <Plus className="w-4 h-4 mr-2" />
                        List Your First Item
                      </Link>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {mockListings.map((listing) => (
                      <div key={listing.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                        <img 
                          src={listing.image} 
                          alt={listing.title}
                          className="w-16 h-16 object-cover rounded"
                        />
                        <div className="flex-1">
                          <h3 className="font-semibold">{listing.title}</h3>
                          <p className="text-sm text-gray-600">
                            KES {listing.price}/{listing.period} • {listing.views} views • {listing.bookings} bookings
                          </p>
                        </div>
                        <Badge variant={listing.status === 'active' ? 'default' : 'secondary'}>
                          {listing.status}
                        </Badge>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="ghost">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="ghost">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="ghost" className="text-red-600">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="rentals" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Items You're Renting</CardTitle>
                <CardDescription>
                  Track your current and past rentals
                </CardDescription>
              </CardHeader>
              <CardContent>
                {mockRentals.length === 0 ? (
                  <div className="text-center py-8">
                    <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No rentals yet</h3>
                    <p className="text-gray-600 mb-4">Browse items to find what you need</p>
                    <Button asChild className="bg-blue-600 hover:bg-blue-700">
                      <Link to="/search">
                        Browse Items
                      </Link>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {mockRentals.map((rental) => (
                      <div key={rental.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h3 className="font-semibold">{rental.item}</h3>
                          <p className="text-sm text-gray-600">
                            Rented from {rental.renter} • {rental.startDate} to {rental.endDate}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">KES {rental.amount.toLocaleString()}</p>
                          <Badge variant={rental.status === 'active' ? 'default' : 'secondary'}>
                            {rental.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
