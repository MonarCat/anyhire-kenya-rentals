
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

export const useImageUpload = () => {
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const ensureBucketExists = async (bucketName: string) => {
    try {
      const { data, error } = await supabase.storage.getBucket(bucketName);
      
      if (error && error.message.includes('not found')) {
        console.log(`Creating bucket: ${bucketName}`);
        const { error: createError } = await supabase.storage.createBucket(bucketName, {
          public: true,
          allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
          fileSizeLimit: 5242880 // 5MB
        });
        
        if (createError) {
          console.error('Error creating bucket:', createError);
        } else {
          console.log(`Bucket ${bucketName} created successfully`);
        }
      } else if (error) {
        console.error('Error checking bucket:', error);
      }
    } catch (error) {
      console.error('Error ensuring bucket exists:', error);
    }
  };

  const uploadImages = async (files: File[], folder: string = 'items'): Promise<string[]> => {
    if (!user || files.length === 0) return [];

    setUploading(true);
    const uploadedUrls: string[] = [];

    try {
      // Ensure bucket exists
      await ensureBucketExists(folder);

      for (const file of files) {
        // Validate file type
        if (!file.type.startsWith('image/')) {
          toast({
            title: "Invalid file type",
            description: `${file.name} is not an image file.`,
            variant: "destructive",
          });
          continue;
        }

        // Validate file size (max 5MB)
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
          toast({
            title: "File too large",
            description: `${file.name} must be smaller than 5MB.`,
            variant: "destructive",
          });
          continue;
        }

        const fileExt = file.name.split('.').pop();
        const fileName = `${user.id}/${Date.now()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from(folder)
          .upload(fileName, file, {
            cacheControl: '3600',
            upsert: false
          });

        if (uploadError) {
          console.error('Upload error:', uploadError);
          toast({
            title: "Upload failed",
            description: `Failed to upload ${file.name}: ${uploadError.message}`,
            variant: "destructive",
          });
          continue;
        }

        const { data: { publicUrl } } = supabase.storage
          .from(folder)
          .getPublicUrl(fileName);

        uploadedUrls.push(publicUrl);
      }

      if (uploadedUrls.length > 0) {
        toast({
          title: "Upload successful",
          description: `Successfully uploaded ${uploadedUrls.length} image(s)`,
        });
      }

      return uploadedUrls;
    } catch (error) {
      console.error('Error uploading images:', error);
      toast({
        title: "Upload failed",
        description: "An error occurred while uploading images",
        variant: "destructive",
      });
      return [];
    } finally {
      setUploading(false);
    }
  };

  const uploadImage = async (file: File, folder: string = 'profile-pictures') => {
    if (!user) return null;

    setUploading(true);

    try {
      // Ensure bucket exists
      await ensureBucketExists(folder);

      // Validate file type
      if (!file.type.startsWith('image/')) {
        throw new Error('Invalid file type. Please select an image file.');
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('File too large. Please select an image smaller than 5MB.');
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from(folder)
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        throw new Error(`Upload failed: ${uploadError.message}`);
      }

      const { data: { publicUrl } } = supabase.storage
        .from(folder)
        .getPublicUrl(fileName);

      return { publicUrl };
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    } finally {
      setUploading(false);
    }
  };

  const deleteImage = async (imageUrl: string) => {
    if (!imageUrl) return;

    try {
      // Extract the file path from the URL
      const url = new URL(imageUrl);
      const pathParts = url.pathname.split('/');
      const bucket = pathParts[pathParts.length - 3];
      const folder = pathParts[pathParts.length - 2];
      const fileName = pathParts[pathParts.length - 1];
      const filePath = `${folder}/${fileName}`;

      const { error } = await supabase.storage
        .from(bucket)
        .remove([filePath]);

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error('Error deleting image:', error);
      throw error;
    }
  };

  return { uploadImages, uploadImage, deleteImage, uploading };
};
