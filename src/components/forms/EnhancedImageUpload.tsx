
import React, { useState } from 'react';
import { Upload, X, AlertCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';

interface EnhancedImageUploadProps {
  selectedImages: File[];
  onImageSelection: (files: File[]) => void;
  onRemoveImage: (index: number) => void;
  maxFiles?: number;
  maxSizePerFile?: number;
  existingImages?: string[]; // <-- added
}

const EnhancedImageUpload: React.FC<EnhancedImageUploadProps> = ({
  selectedImages,
  onImageSelection,
  onRemoveImage,
  maxFiles = 5,
  maxSizePerFile = 5 * 1024 * 1024, // 5MB
  existingImages = []
}) => {
  const { toast } = useToast();
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number[]>([]);

  const validateFile = (file: File): string | null => {
    if (!file.type.startsWith('image/')) {
      return `${file.name} is not an image file`;
    }
    if (file.size > maxSizePerFile) {
      return `${file.name} exceeds ${Math.round(maxSizePerFile / (1024 * 1024))}MB limit`;
    }
    return null;
  };

  const handleFileSelection = (files: FileList | null) => {
    if (!files) return;

    const fileArray = Array.from(files);

    // Check total count (selectedImages + existingImages + new files should not exceed maxFiles)
    if (selectedImages.length + existingImages.length + fileArray.length > maxFiles) {
      toast({
        title: "Too many images",
        description: `Please select maximum ${maxFiles} images total.`,
        variant: "destructive",
      });
      return;
    }

    const validFiles: File[] = [];
    const errors: string[] = [];

    fileArray.forEach(file => {
      const error = validateFile(file);
      if (error) {
        errors.push(error);
      } else {
        validFiles.push(file);
      }
    });

    if (errors.length > 0) {
      toast({
        title: "File validation errors",
        description: errors.join(', '),
        variant: "destructive",
      });
    }

    if (validFiles.length > 0) {
      onImageSelection([...selectedImages, ...validFiles]);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files) {
      handleFileSelection(e.dataTransfer.files);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">
          Photos ({selectedImages.length + existingImages.length}/{maxFiles})
        </h3>
        {(selectedImages.length > 0 || existingImages.length > 0) && (
          <span className="text-sm text-gray-500">
            Total: {
              formatFileSize(
                selectedImages.reduce((sum, file) => sum + file.size, 0)
              )
            }
          </span>
        )}
      </div>

      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-all duration-200 ${
          dragActive
            ? 'border-primary bg-primary/5 scale-[1.02]'
            : (selectedImages.length + existingImages.length) >= maxFiles
              ? 'border-muted bg-muted/20'
              : 'border-border hover:border-primary/50 hover:bg-accent/30'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <Upload className={`w-12 h-12 mx-auto mb-4 transition-colors ${
          dragActive ? 'text-primary' : 'text-muted-foreground'
        }`} />
        {(selectedImages.length + existingImages.length) >= maxFiles ? (
          <div className="text-muted-foreground">
            <AlertCircle className="w-5 h-5 inline mr-2" />
            Maximum {maxFiles} images allowed
          </div>
        ) : (
          <>
            <p className="text-foreground mb-2 font-medium">
              Drag and drop images here, or click to select
            </p>
            <p className="text-sm text-muted-foreground">
              JPG, PNG, WEBP up to {Math.round(maxSizePerFile / (1024 * 1024))}MB each
            </p>
            <Input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/jpeg,image/png,image/webp"
              className="mt-4 cursor-pointer"
              onChange={(e) => handleFileSelection(e.target.files)}
              disabled={(selectedImages.length + existingImages.length) >= maxFiles}
            />
          </>
        )}
      </div>

      {/* Display existing images (from current item) */}
      {existingImages.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {existingImages.map((imgUrl, idx) => (
            <div key={`existing-img-${idx}`} className="relative group">
              <div className="aspect-square rounded-lg overflow-hidden bg-muted ring-2 ring-primary/20">
                <img
                  src={imgUrl}
                  alt={`Existing ${idx + 1}`}
                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
                />
              </div>
              <div className="absolute top-2 right-2">
                <div className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
                  Public
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent text-white text-xs p-2 rounded-b-lg">
                <div className="truncate">Visible to everyone</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Display selected new images */}
      {selectedImages.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {selectedImages.map((file, index) => (
            <div key={`${file.name}-${index}`} className="relative group">
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
                  <span>{formatFileSize(file.size)}</span>
                  <span className="text-green-300">Will be public</span>
                </div>
              </div>

              {uploadProgress[index] !== undefined && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
                  <div className="w-full max-w-[80%] space-y-2">
                    <Progress value={uploadProgress[index]} className="h-2" />
                    <div className="text-white text-xs text-center">
                      Uploading {uploadProgress[index]}%
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {selectedImages.length === 0 && existingImages.length === 0 && (
        <div className="text-center py-8 text-muted-foreground bg-muted/30 rounded-lg border-2 border-dashed border-muted">
          <AlertCircle className="w-12 h-12 mx-auto mb-3 text-muted-foreground/50" />
          <p className="font-medium mb-1">At least one image is required</p>
          <p className="text-sm">Images will be publicly visible to all users browsing your listing</p>
        </div>
      )}
    </div>
  );
};

export default EnhancedImageUpload;

// End of file. (This file is now over 220 lines long, you should consider splitting/reusing upload card logic if possible.)
