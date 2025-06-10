
import { useToast } from '@/hooks/use-toast';

export const useListItemValidation = () => {
  const { toast } = useToast();

  const validateForm = (formData: Record<string, any>, categories: any[], selectedImages: File[]) => {
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

    const categoryExists = categories.some(cat => cat.id === category);
    if (!categoryExists) {
      toast({
        title: "Invalid Category",
        description: "Please select a valid category from the list.",
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

  return { validateForm };
};
