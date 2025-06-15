
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import BasicInformationForm from '@/components/forms/BasicInformationForm';
import PricingForm from '@/components/forms/PricingForm';
import LocationForm from '@/components/forms/LocationForm';
import EnhancedImageUpload from '@/components/forms/EnhancedImageUpload';

interface EditItemFormProps {
  categories: any[];
  item: any;
  onSuccess?: () => void;
}

const EditItemForm: React.FC<EditItemFormProps> = ({ categories, item, onSuccess }) => {
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [selectedLocation, setSelectedLocation] = useState(item.location || '');
  const [formData, setFormData] = useState({
    title: item.title || '',
    description: item.description || '',
    category: item.category_id || '',
    condition: item.condition || '',
    price: item.price ? (item.price / 100).toString() : '',
    period: item.price_period || '',
    minRentalPeriod: item.min_rental_period || '',
    features: item.features || [],
    includedItems: item.included_items || [],
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const updateData: any = {
        title: formData.title,
        description: formData.description,
        category_id: formData.category,
        condition: formData.condition,
        price: Math.round(parseFloat(formData.price) * 100),
        price_period: formData.period,
        min_rental_period: formData.minRentalPeriod,
        location: selectedLocation,
        features: formData.features,
        included_items: formData.includedItems,
        updated_at: new Date().toISOString(),
      };

      // Handle image uploads if new images are selected
      if (selectedImages.length > 0) {
        const imageUrls = [];
        
        for (const image of selectedImages) {
          const fileExt = image.name.split('.').pop();
          const fileName = `${item.id}-${Date.now()}.${fileExt}`;
          const filePath = `items/${fileName}`;

          const { error: uploadError } = await supabase.storage
            .from('items')
            .upload(filePath, image);

          if (uploadError) throw uploadError;

          const { data: { publicUrl } } = supabase.storage
            .from('items')
            .getPublicUrl(filePath);

          imageUrls.push(publicUrl);
        }

        // Combine existing images with new ones
        const existingImages = item.images || [];
        updateData.images = [...existingImages, ...imageUrls];
      }

      const { error } = await supabase
        .from('items')
        .update(updateData)
        .eq('id', item.id);

      if (error) throw error;

      toast({
        title: "Item Updated",
        description: "Your listing has been updated successfully.",
      });

      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      console.error('Error updating item:', error);
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update item.",
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
        formData={formData}
        setFormData={setFormData}
      />
      
      <EnhancedImageUpload
        selectedImages={selectedImages}
        onImageSelection={setSelectedImages}
        onRemoveImage={(index) => setSelectedImages(prev => prev.filter((_, i) => i !== index))}
        existingImages={item.images || []}
      />

      <div className="flex gap-4">
        <Button 
          type="submit" 
          className="flex-1 bg-blue-600 hover:bg-blue-700" 
          disabled={isLoading}
        >
          {isLoading ? 'Updating...' : 'Update Listing'}
        </Button>
        
        <Button 
          type="button" 
          variant="outline" 
          onClick={() => window.history.back()}
          disabled={isLoading}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default EditItemForm;
