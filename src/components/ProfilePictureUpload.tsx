
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Camera, Upload, X, ImagePlus } from 'lucide-react';
import { useImageUpload } from '@/hooks/useImageUpload';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  
  const { uploadImage, deleteImage } = useImageUpload();
  const { user } = useAuth();
  const { toast } = useToast();

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>, fromCamera: boolean = false) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    console.log('File selected:', { fileName: file.name, fileSize: file.size, fromCamera });

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file.",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image smaller than 5MB.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    
    try {
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      // Upload image using profile-pictures bucket
      const uploadResult = await uploadImage(file, 'profile-pictures');
      
      if (uploadResult?.publicUrl) {
        onImageChange(uploadResult.publicUrl);
        toast({
          title: "Profile picture updated",
          description: "Your profile picture has been successfully updated.",
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
    } finally {
      setIsUploading(false);
      // Reset file inputs
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      if (cameraInputRef.current) {
        cameraInputRef.current.value = '';
      }
    }
  };

  const handleCameraCapture = () => {
    console.log('Camera capture requested');
    
    // Check if device supports camera
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      toast({
        title: "Camera not supported",
        description: "Your device doesn't support camera access.",
        variant: "destructive",
      });
      return;
    }

    // Trigger the camera input
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
      toast({
        title: "Profile picture removed",
        description: "Your profile picture has been removed.",
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

  const displayImageUrl = previewUrl || currentImageUrl;

  return (
    <div className={`flex flex-col items-center space-y-4 ${className}`}>
      <div className="relative">
        <Avatar className="w-24 h-24">
          <AvatarImage src={displayImageUrl} alt="Profile picture" />
          <AvatarFallback>
            <Camera className="w-8 h-8 text-gray-400" />
          </AvatarFallback>
        </Avatar>
        
        {displayImageUrl && (
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

      <div className="flex gap-2 flex-wrap justify-center">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleCameraCapture}
          disabled={isUploading}
        >
          <Camera className="w-4 h-4 mr-2" />
          {isUploading ? 'Uploading...' : 'Take Photo'}
        </Button>
        
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleGalleryUpload}
          disabled={isUploading}
        >
          <ImagePlus className="w-4 h-4 mr-2" />
          {isUploading ? 'Uploading...' : 'Choose Photo'}
        </Button>
      </div>

      {/* Camera input - captures directly from camera */}
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="user"
        onChange={(e) => handleFileSelect(e, true)}
        className="hidden"
      />

      {/* Gallery input - selects from gallery */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={(e) => handleFileSelect(e, false)}
        className="hidden"
      />

      <p className="text-xs text-gray-500 text-center max-w-xs">
        Take a new photo with your camera or choose an existing image from your gallery
      </p>
    </div>
  );
};

export default ProfilePictureUpload;
