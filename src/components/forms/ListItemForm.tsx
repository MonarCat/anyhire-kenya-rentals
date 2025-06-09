
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { useToast } from '@/hooks/use-toast';
import { useImageUpload } from '@/hooks/useImageUpload';
import { supabase } from '@/integrations/supabase/client';
import BasicInformationForm from '@/components/forms/BasicInformationForm';
import PricingForm from '@/components/forms/PricingForm';
import LocationForm from '@/components/forms/LocationForm';
import ImageUploadForm from '@/components/forms/ImageUploadForm';

interface ListItemFormProps {
  categories: any[];
}

const ListItemForm: React.FC<ListItemFormProps> = ({ categories }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [formData, setFormData] = useState<Record<string, any>>({});
  
  const { user } = useAuth();
  const { currentPlan } = useSubscription();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { uploadImages, uploading } = useImageUpload();

  const validateForm = () => {
    const { title, description, category, condition, price, period } = formData;

    if (!title?.trim()) {
      toast({
        title: "Missing Title",
        description: "Please enter an item title.",
        variant: "destructive",
      });
      return false;
    }

    if (!description?.trim()) {
      toast({
        title: "Missing Description",
        description: "Please enter an item description.",
        variant: "destructive",
      });
      return false;
    }

    if (!category) {
      toast({
        title: "Missing Category",
        description: "Please select a category.",
        variant: "destructive",
      });
      return false;
    }

    if (!condition) {
      toast({
        title: "Missing Condition",
        description: "Please select item condition.",
        variant: "destructive",
      });
      return false;
    }

    if (!price || isNaN(Number(price)) || Number(price) <= 0) {
      toast({
        title: "Invalid Price",
        description: "Please enter a valid price.",
        variant: "destructive",
      });
      return false;
    }

    if (!period) {
      toast({
        title: "Missing Price Period",
        description: "Please select a price period.",
        variant: "destructive",
      });
      return false;
    }

    if (selectedImages.length === 0) {
      toast({
        title: "Images Required",
        description: "Please upload at least one image of your item.",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to list an item.",
        variant: "destructive",
      });
      return;
    }

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const { title, description, category, condition, price, period, minRental, address } = formData;

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

      // Improved UUID validation - accepts both standard UUIDs and our fallback format
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(category)) {
        throw new Error(`Invalid category ID format: ${category}. Please select a valid category.`);
      }

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
        ad_type: currentPlan?.adType || 'normal'
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

      toast({
        title: "Success!",
        description: "Your item has been listed successfully.",
      });

      // Reset form
      setFormData({});
      setSelectedImages([]);
      setSelectedLocation('');

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

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <BasicInformationForm 
        categories={categories} 
        formData={formData} 
        setFormData={setFormData} 
      />
      <PricingForm 
        formData={formData} 
        setFormData={setFormData} 
      />
      <LocationForm 
        onLocationChange={(id, loc) => {
          setSelectedLocation(loc);
        }} 
      />
      <ImageUploadForm
        selectedImages={selectedImages}
        onImageSelection={setSelectedImages}
        onRemoveImage={(index) => setSelectedImages(prev => prev.filter((_, i) => i !== index))}
      />
      <Button 
        type="submit" 
        className="w-full bg-blue-600 hover:bg-blue-700" 
        disabled={isLoading || uploading}
      >
        {isLoading || uploading ? 'Publishing...' : 'Publish Listing'}
      </Button>
    </form>
  );
};

export default ListItemForm;
