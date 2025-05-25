
import React, { useState } from 'react';
import { Camera, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface ProfilePictureUploadProps {
  currentImageUrl?: string;
  userName: string;
}

const ProfilePictureUpload: React.FC<ProfilePictureUploadProps> = ({ currentImageUrl, userName }) => {
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();
  const { user, updateProfile } = useAuth();

  const uploadImage = async (file: File) => {
    if (!user) return;

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/avatar.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('profiles')
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('profiles')
        .getPublicUrl(fileName);

      await updateProfile({ avatar_url: publicUrl });

      toast({
        title: "Profile picture updated!",
        description: "Your profile picture has been successfully uploaded.",
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "Upload failed",
        description: "Failed to upload profile picture. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

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

    uploadImage(file);
  };

  return (
    <div className="relative inline-block">
      <Avatar className="w-24 h-24">
        <AvatarImage src={currentImageUrl} alt={userName} />
        <AvatarFallback className="text-2xl bg-blue-100 text-blue-600">
          {userName.charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div className="absolute bottom-0 right-0">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
          id="profile-picture-upload"
          disabled={uploading}
        />
        <label htmlFor="profile-picture-upload">
          <Button
            size="sm"
            className="rounded-full w-8 h-8 p-0 bg-blue-600 hover:bg-blue-700"
            disabled={uploading}
            asChild
          >
            <span className="cursor-pointer">
              {uploading ? (
                <Upload className="w-4 h-4 animate-spin" />
              ) : (
                <Camera className="w-4 h-4" />
              )}
            </span>
          </Button>
        </label>
      </div>
    </div>
  );
};

export default ProfilePictureUpload;
