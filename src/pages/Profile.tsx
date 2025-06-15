
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import ProfileHeader from '@/components/profile/ProfileHeader';
import ProfileForm from '@/components/profile/ProfileForm';
import ProfileDisplay from '@/components/profile/ProfileDisplay';

const Profile = () => {
  const { user, profile, updateProfile } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <ProfileHeader 
            avatarUrl=""
            onImageChange={() => {}}
          />
        </Card>
      </div>
    );
  }

  const handleImageChange = async (imageUrl: string) => {
    try {
      await updateProfile({ avatar_url: imageUrl });
      toast({
        title: "Profile picture updated!",
        description: "Your profile picture has been successfully updated.",
      });
    } catch (error) {
      console.error('Profile picture update error:', error);
      toast({
        title: "Error",
        description: "Failed to update profile picture. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSave = async (data: any) => {
    await updateProfile(data);
    toast({
      title: "Profile updated!",
      description: "Your profile has been successfully updated.",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <Card>
          <ProfileHeader 
            avatarUrl={profile?.avatar_url}
            onImageChange={handleImageChange}
          />
          <CardContent>
            {isEditing ? (
              <ProfileForm
                profile={profile}
                userEmail={user.email}
                onSave={handleSave}
                onCancel={() => setIsEditing(false)}
              />
            ) : (
              <ProfileDisplay
                user={user}
                profile={profile}
                onEdit={() => setIsEditing(true)}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
