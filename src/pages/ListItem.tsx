
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import ListItemForm from '@/components/forms/ListItemForm';
import ActiveListingsSidebar from '@/components/ActiveListingsSidebar';
import AuthGuard from '@/components/guards/AuthGuard';
import SubscriptionGuard from '@/components/guards/SubscriptionGuard';

const ListItem = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const { user } = useAuth();
  const { canListMoreItems } = useSubscription();
  const { toast } = useToast();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast({
        title: "Error",
        description: "Failed to load categories. Please refresh the page.",
        variant: "destructive",
      });
    }
  };

  if (!user) {
    return <AuthGuard />;
  }

  if (!canListMoreItems) {
    return <SubscriptionGuard />;
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
