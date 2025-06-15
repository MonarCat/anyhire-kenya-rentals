
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useImageUpload } from '@/hooks/useImageUpload';

interface UseImageUploadOptimizedOptions {
  maxFiles?: number;
  maxFileSize?: number; // in bytes
  allowedTypes?: string[];
  bucket?: string;
}

export const useImageUploadOptimized = (options: UseImageUploadOptimizedOptions = {}) => {
  const {
    maxFiles = 5,
    maxFileSize = 5 * 1024 * 1024, // 5MB
    allowedTypes = ['image/jpeg', 'image/png', 'image/webp'],
    bucket = 'items'
  } = options;

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();
  const { uploadImages } = useImageUpload();

  const validateFile = (file: File): string | null => {
    if (!allowedTypes.includes(file.type)) {
      return `${file.name} is not a supported file type. Please use JPG, PNG, or WEBP.`;
    }
    
    if (file.size > maxFileSize) {
      return `${file.name} is too large. Please choose a file smaller than ${(maxFileSize / (1024 * 1024)).toFixed(1)}MB.`;
    }
    
    return null;
  };

  const addFiles = (files: File[]) => {
    if (selectedFiles.length + files.length > maxFiles) {
      toast({
        title: "Too many files",
        description: `Please select maximum ${maxFiles} files total.`,
        variant: "destructive",
      });
      return false;
    }

    const validFiles: File[] = [];
    const errors: string[] = [];

    for (const file of files) {
      const error = validateFile(file);
      if (error) {
        errors.push(error);
      } else {
        validFiles.push(file);
      }
    }

    if (errors.length > 0) {
      toast({
        title: "Invalid files",
        description: errors.join('\n'),
        variant: "destructive",
      });
    }

    if (validFiles.length > 0) {
      setSelectedFiles(prev => [...prev, ...validFiles]);
      return true;
    }

    return false;
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const clearFiles = () => {
    setSelectedFiles([]);
  };

  const uploadFiles = async (): Promise<string[]> => {
    if (selectedFiles.length === 0) {
      return [];
    }

    setUploading(true);
    try {
      const urls = await uploadImages(selectedFiles, bucket);
      if (urls.length > 0) {
        toast({
          title: "Upload successful",
          description: `${urls.length} file(s) uploaded successfully.`,
        });
      }
      return urls;
    } catch (error: any) {
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload files.",
        variant: "destructive",
      });
      return [];
    } finally {
      setUploading(false);
    }
  };

  return {
    selectedFiles,
    uploading,
    addFiles,
    removeFile,
    clearFiles,
    uploadFiles,
    canAddMore: selectedFiles.length < maxFiles
  };
};
