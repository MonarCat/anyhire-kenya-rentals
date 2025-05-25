
import React from 'react';
import { Upload, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

interface ImageUploadFormProps {
  selectedImages: File[];
  onImageSelection: (files: File[]) => void;
  onRemoveImage: (index: number) => void;
}

const ImageUploadForm: React.FC<ImageUploadFormProps> = ({
  selectedImages,
  onImageSelection,
  onRemoveImage
}) => {
  const { toast } = useToast();

  const handleImageSelection = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length > 5) {
      toast({
        title: "Too many images",
        description: "Please select maximum 5 images.",
        variant: "destructive",
      });
      return;
    }
    onImageSelection(files);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Photos</h3>
      
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600 mb-2">Upload photos of your item</p>
        <p className="text-sm text-gray-500">JPG, PNG up to 10MB each (max 5 photos)</p>
        <Input
          type="file"
          multiple
          accept="image/*"
          className="mt-4"
          onChange={handleImageSelection}
        />
      </div>

      {selectedImages.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {selectedImages.map((file, index) => (
            <div key={index} className="relative">
              <img
                src={URL.createObjectURL(file)}
                alt={`Preview ${index + 1}`}
                className="w-full h-24 object-cover rounded-lg"
              />
              <button
                type="button"
                onClick={() => onRemoveImage(index)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageUploadForm;
