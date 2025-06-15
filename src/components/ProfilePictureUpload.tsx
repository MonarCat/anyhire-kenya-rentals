import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Camera, Upload, X, User } from 'lucide-react';
import { useImageUpload } from '@/hooks/useImageUpload';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

import { cropImageToSquare } from '@/utils/imageUtils';

interface ProfilePictureUploadProps {
  currentImageUrl?: string;
  onImageChange: (imageUrl: string) => void;
  className?: string;
}

const ProfilePictureUpload: React.FC<ProfilePictureUploadProps> = ({
  currentImageUrl,
  onImageChange,
  className = ''
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  
  const { uploadImage, deleteImage } = useImageUpload();
  const { user } = useAuth();
  const { toast } = useToast();

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    console.log('File selected:', { fileName: file.name, fileSize: file.size });

    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file.",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image smaller than 5MB.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    setImageError(false);

    try {
      // Crop image to square before upload
      const croppedFile = await cropImageToSquare(file);

      // Local preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target?.result as string);
      };
      reader.readAsDataURL(croppedFile);

      // Upload cropped image
      const uploadResult = await uploadImage(croppedFile, 'profile-pictures');
      
      if (uploadResult?.publicUrl) {
        onImageChange(uploadResult.publicUrl);
        toast({
          title: "Success!",
          description: "Profile picture updated successfully.",
        });
      } else {
        throw new Error('Failed to get image URL');
      }
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      toast({
        title: "Upload failed",
        description: "Failed to upload profile picture. Please try again.",
        variant: "destructive",
      });
      setPreviewUrl(null);
      setImageError(true);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
      if (cameraInputRef.current) cameraInputRef.current.value = '';
    }
  };

  const handleCameraCapture = () => {
    console.log('Camera capture requested');
    if (cameraInputRef.current) {
      cameraInputRef.current.click();
    }
  };

  const handleGalleryUpload = () => {
    console.log('Gallery upload requested');
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleRemoveImage = async () => {
    if (!currentImageUrl) return;
    
    try {
      await deleteImage(currentImageUrl);
      onImageChange('');
      setPreviewUrl(null);
      setImageError(false);
      toast({
        title: "Success!",
        description: "Profile picture removed.",
      });
    } catch (error) {
      console.error('Error removing profile picture:', error);
      toast({
        title: "Remove failed",
        description: "Failed to remove profile picture. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const displayImageUrl = previewUrl || currentImageUrl;
  const hasValidImage = displayImageUrl && !imageError;

  return (
    <div className={`flex flex-col items-center space-y-4 ${className}`}>
      <div className="relative">
        <Avatar className="w-24 h-24">
          {hasValidImage ? (
            <AvatarImage 
              src={displayImageUrl} 
              alt="Profile picture" 
              onError={handleImageError}
            />
          ) : (
            <AvatarFallback>
              <User className="w-8 h-8 text-gray-400" />
            </AvatarFallback>
          )}
        </Avatar>
        
        {hasValidImage && (
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute -top-2 -right-2 w-6 h-6 rounded-full"
            onClick={handleRemoveImage}
          >
            <X className="w-3 h-3" />
          </Button>
        )}
      </div>

      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleCameraCapture}
          disabled={isUploading}
        >
          <Camera className="w-4 h-4 mr-2" />
          {isUploading ? 'Uploading...' : 'Camera'}
        </Button>
        
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleGalleryUpload}
          disabled={isUploading}
        >
          <Upload className="w-4 h-4 mr-2" />
          {isUploading ? 'Uploading...' : 'Gallery'}
        </Button>
      </div>

      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileSelect}
        className="hidden"
      />

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      <p className="text-xs text-gray-500 text-center max-w-xs">
        Take a photo or choose from gallery. Images will be auto-cropped to square before upload.
      </p>
    </div>
  );
};

export default ProfilePictureUpload;
