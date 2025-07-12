
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
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleImageSelection = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    
    // Validate number of files
    if (selectedImages.length + files.length > 5) {
      toast({
        title: "Too many images",
        description: "Please select maximum 5 images total.",
        variant: "destructive",
      });
      return;
    }

    // Validate file types and sizes
    const validFiles = files.filter(file => {
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid file type",
          description: `${file.name} is not an image file.`,
          variant: "destructive",
        });
        return false;
      }
      
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          title: "File too large",
          description: `${file.name} exceeds 5MB limit.`,
          variant: "destructive",
        });
        return false;
      }
      
      return true;
    });

    if (validFiles.length > 0) {
      onImageSelection([...selectedImages, ...validFiles]);
      // Reset input value to allow selecting the same file again
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Photos ({selectedImages.length}/5)</h3>
        <div className="bg-accent/20 text-accent-foreground text-xs px-2 py-1 rounded-full">
          Public to all users
        </div>
      </div>
      
      <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 hover:bg-accent/30 transition-all duration-200">
        <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-foreground mb-2 font-medium">Upload photos of your item</p>
        <p className="text-sm text-muted-foreground">JPG, PNG, WEBP up to 5MB each (max 5 photos)</p>
        <Input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp"
          className="mt-4 cursor-pointer"
          onChange={handleImageSelection}
          disabled={selectedImages.length >= 5}
        />
      </div>

      {selectedImages.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {selectedImages.map((file, index) => (
            <div key={index} className="relative group">
              <div className="aspect-square rounded-lg overflow-hidden bg-muted ring-2 ring-accent">
                <img
                  src={URL.createObjectURL(file)}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
                />
              </div>
              
              <button
                type="button"
                onClick={() => onRemoveImage(index)}
                className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full w-7 h-7 flex items-center justify-center hover:bg-destructive/80 opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-lg"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="absolute top-2 left-2">
                <div className="bg-accent text-accent-foreground text-xs px-2 py-1 rounded-full">
                  New
                </div>
              </div>
              
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent text-white text-xs p-2 rounded-b-lg">
                <div className="truncate">{file.name}</div>
                <div className="flex justify-between items-center">
                  <span>{(file.size / (1024 * 1024)).toFixed(1)}MB</span>
                  <span className="text-green-300">Will be public</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedImages.length === 0 && (
        <div className="text-center py-8 text-muted-foreground bg-muted/30 rounded-lg border-2 border-dashed border-muted">
          <Upload className="w-12 h-12 mx-auto mb-3 text-muted-foreground/50" />
          <p className="font-medium mb-1">At least one image is required</p>
          <p className="text-sm">Images will be publicly visible to all users browsing your listing</p>
        </div>
      )}
    </div>
  );
};

export default ImageUploadForm;
