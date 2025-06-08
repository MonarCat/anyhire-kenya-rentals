
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { title, description, category, condition, price, period, minRental, address } = formData;

      if (!title || !description || !category || !condition || !price || !period) {
        toast({
          title: "Missing Information",
          description: "Please fill in all required fields.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      if (selectedImages.length === 0) {
        toast({
          title: "Images Required",
          description: "Please upload at least one image of your item.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      let imageUrls: string[] = [];
      if (selectedImages.length > 0) {
        imageUrls = await uploadImages(selectedImages, 'items');
        if (imageUrls.length === 0) {
          toast({
            title: "Upload Failed",
            description: "Failed to upload images. Please try again.",
            variant: "destructive",
          });
          setIsLoading(false);
          return;
        }
      }

      const itemData: any = {
        user_id: user.id,
        title,
        description,
        category_id: category,
        condition,
        price: parseInt(price) * 100,
        price_period: period,
        min_rental_period: minRental || null,
        location: selectedLocation || 'Kenya',
        address: address || null,
        images: imageUrls,
        features: [],
        included_items: [],
        is_available: true,
        ad_type: currentPlan.adType || 'normal'
      };

      const { data: newItem, error } = await supabase
        .from('items')
        .insert(itemData)
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Your item has been listed successfully.",
      });

      // Reset form
      setFormData({});
      setSelectedImages([]);
      setSelectedLocation('');

      setTimeout(() => navigate('/dashboard'), 1000);

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
