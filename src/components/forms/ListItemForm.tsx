
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useListItemSubmission } from '@/hooks/useListItemSubmission';
import BasicInformationForm from '@/components/forms/BasicInformationForm';
import PricingForm from '@/components/forms/PricingForm';
import LocationForm from '@/components/forms/LocationForm';
import ImageUploadForm from '@/components/forms/ImageUploadForm';

interface ListItemFormProps {
  categories: any[];
}

const ListItemForm: React.FC<ListItemFormProps> = ({ categories }) => {
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [formData, setFormData] = useState<Record<string, any>>({});
  
  const { handleSubmit, isLoading, uploading } = useListItemSubmission(categories);

  const resetForm = () => {
    setFormData({});
    setSelectedImages([]);
    setSelectedLocation('');
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    handleSubmit(e, formData, selectedImages, selectedLocation, resetForm);
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6">
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
