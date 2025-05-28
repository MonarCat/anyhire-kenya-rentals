
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { useToast } from '@/hooks/use-toast';
import { useImageUpload } from '@/hooks/useImageUpload';
import { supabase } from '@/integrations/supabase/client';
import BasicInformationForm from '@/components/forms/BasicInformationForm';
import PricingForm from '@/components/forms/PricingForm';
import LocationForm from '@/components/forms/LocationForm';
import ImageUploadForm from '@/components/forms/ImageUploadForm';

const ListItem = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedLocationId, setSelectedLocationId] = useState('');
  const { user } = useAuth();
  const { canListMoreItems, currentPlan } = useSubscription();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { uploadImages, uploading } = useImageUpload();

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
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardHeader className="text-center">
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>
              Please sign in to list an item for rent
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => navigate('/auth')}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!canListMoreItems) {
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
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      
      // Validate required fields
      const title = formData.get('title') as string;
      const description = formData.get('description') as string;
      const category = formData.get('category') as string;
      const condition = formData.get('condition') as string;
      const price = formData.get('price') as string;
      const period = formData.get('period') as string;

      console.log('Form data:', { title, description, category, condition, price, period });

      if (!title || !description || !category || !condition || !price || !period) {
        toast({
          title: "Missing Information",
          description: "Please fill in all required fields.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      // Upload images first if any
      let imageUrls: string[] = [];
      if (selectedImages.length > 0) {
        console.log('Uploading images...');
        imageUrls = await uploadImages(selectedImages, 'items');
        console.log('Images uploaded:', imageUrls);
      }

      // Create the item
      const itemData = {
        user_id: user.id,
        title,
        description,
        category_id: category,
        condition,
        price: parseInt(price) * 100, // Convert to cents
        price_period: period,
        min_rental_period: formData.get('minRental') as string || null,
        location: selectedLocation || 'Kenya',
        address: formData.get('address') as string || null,
        images: imageUrls,
        features: [],
        included_items: [],
        is_available: true,
        ad_type: currentPlan.adType || 'normal'
      };

      // Add location_id if we have one
      if (selectedLocationId) {
        (itemData as any).location_id = selectedLocationId;
      }

      console.log('Creating item with data:', itemData);

      const { data: newItem, error } = await supabase
        .from('items')
        .insert(itemData)
        .select()
        .single();

      if (error) {
        console.error('Database error:', error);
        throw error;
      }

      console.log('Item created successfully:', newItem);
      
      toast({
        title: "Success!",
        description: "Your item has been listed successfully.",
      });

      // Navigate to dashboard with a short delay to ensure the toast shows
      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);

    } catch (error) {
      console.error('Error creating item:', error);
      toast({
        title: "Error",
        description: "Failed to list item. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLocationChange = (locationId: string, locationPath: string) => {
    setSelectedLocationId(locationId);
    setSelectedLocation(locationPath);
  };

  const handleImageSelection = (files: File[]) => {
    setSelectedImages(files);
  };

  const removeImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">List Your Item</CardTitle>
            <CardDescription>
              Create a listing to rent out your item and start earning
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <BasicInformationForm categories={categories} />
              <PricingForm />
              <LocationForm onLocationChange={handleLocationChange} />
              <ImageUploadForm
                selectedImages={selectedImages}
                onImageSelection={handleImageSelection}
                onRemoveImage={removeImage}
              />

              <Button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={isLoading || uploading}
              >
                {isLoading || uploading ? 'Publishing...' : 'Publish Listing'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ListItem;
