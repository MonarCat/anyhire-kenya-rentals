
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
}

const EnhancedImageUpload: React.FC<EnhancedImageUploadProps> = ({
  selectedImages,
  onImageSelection,
  onRemoveImage,
  maxFiles = 5,
  maxSizePerFile = 5 * 1024 * 1024 // 5MB
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
    
    // Check total count
    if (selectedImages.length + fileArray.length > maxFiles) {
      toast({
        title: "Too many images",
        description: `Please select maximum ${maxFiles} images total.`,
        variant: "destructive",
      });
      return;
    }

    // Validate each file
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

    // Show errors if any
    if (errors.length > 0) {
      toast({
        title: "File validation errors",
        description: errors.join(', '),
        variant: "destructive",
      });
    }

    // Add valid files
    if (validFiles.length > 0) {
      onImageSelection([...selectedImages, ...validFiles]);
      // Reset input
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
        <h3 className="text-lg font-semibold">Photos ({selectedImages.length}/{maxFiles})</h3>
        {selectedImages.length > 0 && (
          <span className="text-sm text-gray-500">
            Total: {formatFileSize(selectedImages.reduce((sum, file) => sum + file.size, 0))}
          </span>
        )}
      </div>
      
      <div 
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          dragActive 
            ? 'border-blue-500 bg-blue-50' 
            : selectedImages.length >= maxFiles 
              ? 'border-gray-200 bg-gray-50' 
              : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        {selectedImages.length >= maxFiles ? (
          <div className="text-gray-500">
            <AlertCircle className="w-5 h-5 inline mr-2" />
            Maximum {maxFiles} images allowed
          </div>
        ) : (
          <>
            <p className="text-gray-600 mb-2">
              Drag and drop images here, or click to select
            </p>
            <p className="text-sm text-gray-500">
              JPG, PNG, WEBP up to {Math.round(maxSizePerFile / (1024 * 1024))}MB each
            </p>
            <Input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/jpeg,image/png,image/webp"
              className="mt-4"
              onChange={(e) => handleFileSelection(e.target.files)}
              disabled={selectedImages.length >= maxFiles}
            />
          </>
        )}
      </div>

      {selectedImages.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {selectedImages.map((file, index) => (
            <div key={`${file.name}-${index}`} className="relative group">
              <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                <img
                  src={URL.createObjectURL(file)}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <button
                type="button"
                onClick={() => onRemoveImage(index)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-4 h-4" />
              </button>
              
              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-75 text-white text-xs p-2 rounded-b-lg">
                <div className="truncate">{file.name}</div>
                <div>{formatFileSize(file.size)}</div>
              </div>

              {uploadProgress[index] !== undefined && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
                  <div className="w-full max-w-[80%]">
                    <Progress value={uploadProgress[index]} className="h-2" />
                    <div className="text-white text-xs text-center mt-1">
                      {uploadProgress[index]}%
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {selectedImages.length === 0 && (
        <div className="text-center py-4 text-gray-500">
          <AlertCircle className="w-8 h-8 mx-auto mb-2 text-gray-300" />
          <p>At least one image is required for your listing</p>
        </div>
      )}
    </div>
  );
};

export default EnhancedImageUpload;
