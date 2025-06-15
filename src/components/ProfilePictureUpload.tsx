
import React from "react";
import { Button } from "@/components/ui/button";
import ProfileAvatar from "./ProfileAvatar";
import { Camera, Upload } from "lucide-react";
import { useProfilePictureUpload } from "@/hooks/useProfilePictureUpload";

// Make sure we have loading overlays and reset properly!
const ProfilePictureUpload = ({
  currentImageUrl,
  onImageChange,
  className = "",
}) => {
  const {
    isUploading,
    imageError,
    displayImageUrl,
    fileInputRef,
    cameraInputRef,
    handleFileSelect,
    handleCameraCapture,
    handleGalleryUpload,
    handleRemoveImage,
  } = useProfilePictureUpload(currentImageUrl, onImageChange);

  return (
    <div className={`flex flex-col items-center space-y-4 ${className}`}>
      <div className="relative">
        <ProfileAvatar
          imageUrl={displayImageUrl}
          isUploading={isUploading}
          imageError={imageError}
          onRemove={handleRemoveImage}
        />
        {isUploading && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-full z-10">
            <span className="text-white text-xs animate-pulse">Uploading...</span>
          </div>
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
      {/* File inputs */}
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
        Take a photo or choose from gallery. Images must be cropped square before uploading. Max file size: 5MB.
      </p>
    </div>
  );
};

export default ProfilePictureUpload;
