
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

  /** Utility: Crop the image file to a 600x600px max square/jpg before upload */
  const processImage = async (file: File) => {
    try {
      // Crop to square in browser
      const croppedFile = await cropImageToSquare(file);
      // Optionally: resize further here if desired
      return croppedFile;
    } catch (err) {
      toast({
        title: "Image error",
        description: "Failed to process/crop image. Use another image.",
        variant: "destructive",
      });
      throw err;
    }
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setImageError(false);
    const file = event.target.files?.[0];

    // Reset the ref so the same file can be re-selected again later
    if (event.target) {
      event.target.value = "";
    }

    if (!file || !user) return;

    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file",
        description: "Please select a valid image.",
        variant: "destructive",
      });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Pick an image smaller than 5MB.",
        variant: "destructive",
      });
      return;
    }
    setIsUploading(true);

    try {
      // Crop
      const croppedFile = await processImage(file);
      // For preview, show user their image right away
      const reader = new FileReader();
      reader.onload = (e) => setPreviewUrl(e.target?.result as string);
      reader.readAsDataURL(croppedFile);

      // Upload (to 'profile-pictures' bucket!)
      const uploadResult = await uploadImage(croppedFile, "profile-pictures");
      if (uploadResult?.publicUrl) {
        // Set for gallery
        onImageChange(uploadResult.publicUrl);
        setPreviewUrl(null);
        toast({
          title: "Success!",
          description: "Profile picture updated.",
        });
      } else {
        throw new Error("Upload failed");
      }
    } catch (error) {
      setPreviewUrl(null);
      setImageError(true);
      // Toast shown in catch above
    } finally {
      setIsUploading(false);
    }
  };

  const handleCameraCapture = () => cameraInputRef.current?.click();
  const handleGalleryUpload = () => fileInputRef.current?.click();

  const handleRemoveImage = async () => {
    if (!currentImageUrl) return;
    try {
      await deleteImage(currentImageUrl);
      onImageChange("");
      setPreviewUrl(null);
      setImageError(false);
      toast({
        title: "Picture removed",
        description: "Profile picture removed.",
      });
    } catch (error) {
      toast({
        title: "Remove failed",
        description: "Failed to remove profile picture.",
        variant: "destructive",
      });
    }
  };

  const displayImageUrl = previewUrl || currentImageUrl;

  return {
    fileInputRef,
    cameraInputRef,
    isUploading,
    imageError,
    displayImageUrl,
    handleFileSelect,
    handleCameraCapture,
    handleGalleryUpload,
    handleRemoveImage,
  };
}
