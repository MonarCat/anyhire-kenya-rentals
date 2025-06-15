
import React from "react";
import { Button } from "@/components/ui/button";
import ProfileAvatar from "./ProfileAvatar";
import { Camera, Upload } from "lucide-react";
import { useProfilePictureUpload } from "@/hooks/useProfilePictureUpload";

interface ProfilePictureUploadProps {
  currentImageUrl?: string;
  onImageChange: (imageUrl: string) => void;
  className?: string;
}

const ProfilePictureUpload: React.FC<ProfilePictureUploadProps> = ({
  currentImageUrl,
  onImageChange,
  className = "",
}) => {
  const {
    fileInputRef,
    cameraInputRef,
    isUploading,
    imageError,
    displayImageUrl,
    handleFileSelect,
    handleCameraCapture,
    handleGalleryUpload,
    handleRemoveImage,
    handleImageError,
  } = useProfilePictureUpload(currentImageUrl, onImageChange);

  return (
    <div className={`flex flex-col items-center space-y-4 ${className}`}>
      <ProfileAvatar
        imageUrl={displayImageUrl}
        isUploading={isUploading}
        imageError={imageError}
        onRemove={handleRemoveImage}
      />

      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleCameraCapture}
          disabled={isUploading}
        >
          <Camera className="w-4 h-4 mr-2" />
          {isUploading ? "Uploading..." : "Camera"}
        </Button>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleGalleryUpload}
          disabled={isUploading}
        >
          <Upload className="w-4 h-4 mr-2" />
          {isUploading ? "Uploading..." : "Gallery"}
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
