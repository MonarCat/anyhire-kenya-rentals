
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useListItemSubmission } from '@/hooks/useListItemSubmission';
import BasicInformationForm from '@/components/forms/BasicInformationForm';
import PricingForm from '@/components/forms/PricingForm';
import LocationForm from '@/components/forms/LocationForm';
import EnhancedImageUpload from '@/components/forms/EnhancedImageUpload';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ImprovedListItemFormProps {
  categories: any[];
}

const ImprovedListItemForm: React.FC<ImprovedListItemFormProps> = ({ categories }) => {
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [submitError, setSubmitError] = useState<string>('');
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  
  const { handleSubmit, isLoading, uploading } = useListItemSubmission(categories);
  const { toast } = useToast();

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    if (!formData.title?.trim()) {
      errors.title = 'Title is required';
    }
    
    if (!formData.description?.trim()) {
      errors.description = 'Description is required';
    }
    
    if (!formData.category) {
      errors.category = 'Category is required';
    }
    
    if (!formData.condition) {
      errors.condition = 'Condition is required';
    }
    
    if (!formData.price || isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
      errors.price = 'Valid price is required';
    }
    
    if (!formData.period) {
      errors.period = 'Price period is required';
    }
    
    if (selectedImages.length === 0) {
      errors.images = 'At least one image is required';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const resetForm = () => {
    setFormData({});
    setSelectedImages([]);
    setSelectedLocation('');
    setSubmitError('');
    setValidationErrors({});
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitError('');
    
    console.log('Form submission started with data:', {
      formData,
      imageCount: selectedImages.length,
      location: selectedLocation
    });

    // Client-side validation
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors below and try again.",
        variant: "destructive",
      });
      return;
    }

    try {
      await handleSubmit(e, formData, selectedImages, selectedLocation, resetForm);
    } catch (error: any) {
      console.error('Form submission error:', error);
      setSubmitError(error.message || 'Failed to submit listing. Please try again.');
    }
  };

  const getFieldError = (fieldName: string) => {
    return validationErrors[fieldName];
  };

  const isFormValid = () => {
    return formData.title && 
           formData.description && 
           formData.category && 
           formData.condition && 
           formData.price && 
           formData.period && 
           selectedImages.length > 0;
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {submitError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{submitError}</AlertDescription>
        </Alert>
      )}

      {Object.keys(validationErrors).length > 0 && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Please fix the following errors:
            <ul className="mt-2 list-disc list-inside">
              {Object.values(validationErrors).map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      <BasicInformationForm 
        categories={categories} 
        formData={formData} 
        setFormData={setFormData}
        errors={{
          title: getFieldError('title'),
          description: getFieldError('description'),
          category: getFieldError('category'),
          condition: getFieldError('condition')
        }}
      />
      
      <PricingForm 
        formData={formData} 
        setFormData={setFormData}
        errors={{
          price: getFieldError('price'),
          period: getFieldError('period')
        }}
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
      />

      {getFieldError('images') && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{getFieldError('images')}</AlertDescription>
        </Alert>
      )}

      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">Form Completion</span>
          <span className="text-sm text-gray-600">
            {isFormValid() ? (
              <span className="flex items-center text-green-600">
                <CheckCircle className="w-4 h-4 mr-1" />
                Ready to submit
              </span>
            ) : (
              'Fill all required fields'
            )}
          </span>
        </div>
      </div>

      <Button 
        type="submit" 
        className="w-full bg-blue-600 hover:bg-blue-700" 
        disabled={isLoading || uploading || !isFormValid()}
      >
        {isLoading || uploading ? (
          <span className="flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            {uploading ? 'Uploading images...' : 'Publishing listing...'}
          </span>
        ) : (
          'Publish Listing'
        )}
      </Button>
    </form>
  );
};

export default ImprovedListItemForm;
