
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
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ListItem = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const { canListMoreItems } = useSubscription();
  const { toast } = useToast();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('Fetching categories...');
      
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      console.log('Categories fetched:', data);
      setCategories(data || []);
      
      if (!data || data.length === 0) {
        console.log('No categories found, using fallback');
        // Fallback categories if none exist in database
        setCategories([
          { id: 'electronics', name: 'Electronics', icon: '📱' },
          { id: 'tools', name: 'Tools & Equipment', icon: '🔧' },
          { id: 'books', name: 'Books & Media', icon: '📚' },
          { id: 'sports', name: 'Sports & Recreation', icon: '⚽' },
          { id: 'furniture', name: 'Furniture', icon: '🪑' },
          { id: 'other', name: 'Other', icon: '📦' },
        ]);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      setError('Failed to load categories');
      
      // Use fallback categories on error
      setCategories([
        { id: 'electronics', name: 'Electronics', icon: '📱' },
        { id: 'tools', name: 'Tools & Equipment', icon: '🔧' },
        { id: 'books', name: 'Books & Media', icon: '📚' },
        { id: 'sports', name: 'Sports & Recreation', icon: '⚽' },
        { id: 'furniture', name: 'Furniture', icon: '🪑' },
        { id: 'other', name: 'Other', icon: '📦' },
      ]);
      
      toast({
        title: "Connection Issue",
        description: "Using default categories. You can still list your item.",
        variant: "default",
      });
    } finally {
      setLoading(false);
    }
  };

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
          <div className="flex items-center justify-center">
            <div className="text-center">
              <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
              <p>Loading categories...</p>
            </div>
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
                {error && (
                  <div className="flex items-center gap-2 text-orange-600">
                    <span className="text-sm">{error}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={fetchCategories}
                      className="h-6 w-6 p-0"
                    >
                      <RefreshCw className="h-3 w-3" />
                    </Button>
                  </div>
                )}
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
