
import { useState, useRef } from "react";
import { useImageUpload } from "@/hooks/useImageUpload";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { cropImageToSquare } from "@/utils/imageUtils";

export function useProfilePictureUpload(
  currentImageUrl: string | undefined,
  onImageChange: (url: string) => void
) {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const { uploadImage, deleteImage } = useImageUpload();
  const { user } = useAuth();
  const { toast } = useToast();

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    if (!file.type.startsWith("image/")) {
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
      const croppedFile = await cropImageToSquare(file);

      // Local preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target?.result as string);
      };
      reader.readAsDataURL(croppedFile);

      // Upload cropped image
      const uploadResult = await uploadImage(croppedFile, "profile-pictures");
      if (uploadResult?.publicUrl) {
        onImageChange(uploadResult.publicUrl);
        toast({
          title: "Success!",
          description: "Profile picture updated successfully.",
        });
      } else {
        throw new Error("Failed to get image URL");
      }
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "Failed to upload profile picture. Please try again.",
        variant: "destructive",
      });
      setPreviewUrl(null);
      setImageError(true);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
      if (cameraInputRef.current) cameraInputRef.current.value = "";
    }
  };

  const handleCameraCapture = () => {
    if (cameraInputRef.current) {
      cameraInputRef.current.click();
    }
  };

  const handleGalleryUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleRemoveImage = async () => {
    if (!currentImageUrl) return;
    try {
      await deleteImage(currentImageUrl);
      onImageChange("");
      setPreviewUrl(null);
      setImageError(false);
      toast({
        title: "Success!",
        description: "Profile picture removed.",
      });
    } catch (error) {
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

  return {
    fileInputRef,
    cameraInputRef,
    isUploading,
    imageError,
    previewUrl,
    displayImageUrl,
    handleFileSelect,
    handleCameraCapture,
    handleGalleryUpload,
    handleRemoveImage,
    handleImageError,
    setPreviewUrl,
  };
}
