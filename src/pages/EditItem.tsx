import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useCategories } from '@/hooks/useCategories';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import AuthGuard from '@/components/guards/AuthGuard';
import LoadingSpinner from '@/components/LoadingSpinner';
import EditItemForm from '@/components/forms/EditItemForm';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

const EditItem = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { categories, loading: categoriesLoading } = useCategories();

  const { data: item, isLoading: itemLoading, error } = useQuery({
    queryKey: ['item', id],
    queryFn: async () => {
      if (!id) throw new Error('Item ID is required');
      
      const { data, error } = await supabase
        .from('items')
        .select('*')
        .eq('id', id)
        .eq('user_id', user?.id) // Ensure user can only edit their own items
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!id && !!user,
  });

  if (!user) {
    return <AuthGuard />;
  }

  if (!id) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>Invalid item ID</AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  if (categoriesLoading || itemLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner size="lg" text="Loading item..." />
          </div>
        </div>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {error?.message || 'Item not found or you do not have permission to edit this item'}
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Edit Item</CardTitle>
            <CardDescription>
              Update your listing details
            </CardDescription>
          </CardHeader>
          <CardContent>
            <EditItemForm 
              categories={categories} 
              item={item}
              onSuccess={() => {
                navigate('/dashboard');
              }}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EditItem;
