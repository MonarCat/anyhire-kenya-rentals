
import React from 'react';
import { CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import ProfilePictureUpload from '@/components/ProfilePictureUpload';

interface ProfileHeaderProps {
  avatarUrl?: string;
  onImageChange: (imageUrl: string) => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ avatarUrl, onImageChange }) => {
  return (
    <CardHeader className="text-center">
      <ProfilePictureUpload 
        currentImageUrl={avatarUrl || ''} 
        onImageChange={onImageChange}
      />
      <CardTitle className="mt-4">Profile Settings</CardTitle>
      <CardDescription>
        Manage your AnyHire profile information
      </CardDescription>
    </CardHeader>
  );
};

export default ProfileHeader;
