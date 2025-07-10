
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { useToast } from '@/hooks/use-toast';
import { useImageUpload } from '@/hooks/useImageUpload';
import { supabase } from '@/integrations/supabase/client';
import { useListItemValidation } from '@/utils/listItemValidation';
import { getAdTypeFromPlan } from '@/utils/subscriptionUtils';

export const useListItemSubmission = (categories: any[]) => {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { currentPlan, canCreateMore, refreshSubscription } = useSubscription();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { uploadImages, uploading } = useImageUpload();
  const { validateForm } = useListItemValidation();

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
    formData: Record<string, any>,
    selectedImages: File[],
    selectedLocation: string,
    onSuccess: () => void
  ) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to list an item.",
        variant: "destructive",
      });
      return;
    }

    // Check subscription limits
    if (!canCreateMore) {
      toast({
        title: "Listing Limit Reached",
        description: `You've reached your plan limit of ${currentPlan?.item_limit} items. Please upgrade your subscription.`,
        variant: "destructive",
      });
      return;
    }

    if (!validateForm(formData, categories, selectedImages)) {
      return;
    }

    setIsLoading(true);

    try {
      const { title, description, category, condition, price, period, minRental, address } = formData;

      console.log('Selected category ID:', category);
      console.log('Available categories:', categories);
      console.log('Form submission data:', {
        title,
        description, 
        category,
        condition,
        price,
        period,
        minRental,
        address,
        selectedLocation,
        imageCount: selectedImages.length
      });

      // Upload images first
      let imageUrls: string[] = [];
      if (selectedImages.length > 0) {
        toast({
          title: "Uploading Images",
          description: "Please wait while we upload your images...",
        });
        
        imageUrls = await uploadImages(selectedImages, 'items');
        if (imageUrls.length === 0) {
          throw new Error('Failed to upload images');
        }
      }

      // Prepare item data
      const itemData: any = {
        user_id: user.id,
        title: title.trim(),
        description: description.trim(),
        category_id: category,
        condition,
        price: Math.round(Number(price) * 100), // Convert to cents
        price_period: period,
        min_rental_period: minRental || null,
        location: selectedLocation || 'Kenya',
        address: address?.trim() || null,
        images: imageUrls,
        features: [],
        included_items: [],
        is_available: true,
        ad_type: getAdTypeFromPlan(currentPlan)
      };

      console.log('Inserting item data:', itemData);

      const { data: newItem, error } = await supabase
        .from('items')
        .insert(itemData)
        .select()
        .single();

      if (error) {
        console.error('Database insert error:', error);
        throw new Error(`Failed to create listing: ${error.message}`);
      }

      console.log('Item created successfully:', newItem);

      // Refresh subscription data to update item count
      await refreshSubscription();

      toast({
        title: "Success!",
        description: "Your item has been listed successfully.",
      });

      onSuccess();

      // Navigate to dashboard after a short delay
      setTimeout(() => navigate('/dashboard'), 1500);

    } catch (error: any) {
      console.error('Error creating item:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to list item. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return { handleSubmit, isLoading, uploading };
};
