import React, { useState } from 'react';
import { MapPin, Phone, Mail, User as UserIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import ProfilePictureUpload from '@/components/ProfilePictureUpload';
import LocationSelector from '@/components/LocationSelector';
import { profileSchema, ProfileFormData } from '@/components/forms/ProfileValidation';

const Profile = () => {
  const { user, profile, updateProfile } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(profile?.location || '');
  const [formErrors, setFormErrors] = useState<Partial<ProfileFormData>>({});

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardHeader className="text-center">
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>Please sign in to view your profile</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const validateForm = (formData: FormData) => {
    const data = {
      full_name: formData.get('full_name') as string || '',
      phone: formData.get('phone') as string || '',
      location: selectedLocation || (formData.get('location') as string) || '',
      bio: formData.get('bio') as string || '',
      website: formData.get('website') as string || '',
    };

    try {
      profileSchema.parse(data);
      setFormErrors({});
      return data;
    } catch (error: any) {
      const errors: Partial<ProfileFormData> = {};
      if (error.errors) {
        error.errors.forEach((err: any) => {
          if (err.path && err.path[0]) {
            errors[err.path[0] as keyof ProfileFormData] = err.message;
          }
        });
      }
      setFormErrors(errors);
      return null;
    }
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const formData = new FormData(e.currentTarget);
      const validatedData = validateForm(formData);
      
      if (!validatedData) {
        toast({
          title: "Validation Error",
          description: "Please fix the errors in the form.",
          variant: "destructive",
        });
        return;
      }

      console.log('Updating profile with data:', validatedData);
      await updateProfile(validatedData);
      setIsEditing(false);
      toast({
        title: "Profile updated!",
        description: "Your profile has been successfully updated.",
      });
    } catch (error) {
      console.error('Profile update error:', error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLocationChange = (locationId: string, locationPath: string) => {
    console.log('Location changed:', { locationId, locationPath });
    setSelectedLocation(locationPath);
  };

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

  const displayName = profile?.full_name || user.email?.split('@')[0] || 'User';

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <Card>
          <CardHeader className="text-center">
            <ProfilePictureUpload 
              currentImageUrl={profile?.avatar_url || ''} 
              onImageChange={handleImageChange}
            />
            <CardTitle className="mt-4">Profile Settings</CardTitle>
            <CardDescription>
              Manage your AnyHire profile information
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isEditing ? (
              <form onSubmit={handleSave} className="space-y-6">
                <div>
                  <Label htmlFor="full_name">Full Name *</Label>
                  <Input
                    id="full_name"
                    name="full_name"
                    defaultValue={profile?.full_name || ''}
                    placeholder="Enter your full name"
                    className={formErrors.full_name ? 'border-red-500' : ''}
                  />
                  {formErrors.full_name && (
                    <p className="text-sm text-red-500 mt-1">{formErrors.full_name}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    value={user.email || ''}
                    disabled
                    className="bg-gray-100"
                  />
                  <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    name="phone"
                    defaultValue={profile?.phone || ''}
                    placeholder="+254 700 000 000"
                    className={formErrors.phone ? 'border-red-500' : ''}
                  />
                  {formErrors.phone && (
                    <p className="text-sm text-red-500 mt-1">{formErrors.phone}</p>
                  )}
                </div>

                <div>
                  <Label>Location *</Label>
                  <LocationSelector
                    onChange={handleLocationChange}
                    required={true}
                  />
                  {selectedLocation && (
                    <p className="text-sm text-gray-600 mt-1">Selected: {selectedLocation}</p>
                  )}
                  {formErrors.location && (
                    <p className="text-sm text-red-500 mt-1">{formErrors.location}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    name="website"
                    defaultValue={profile?.website || ''}
                    placeholder="https://yourwebsite.com"
                    className={formErrors.website ? 'border-red-500' : ''}
                  />
                  {formErrors.website && (
                    <p className="text-sm text-red-500 mt-1">{formErrors.website}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    name="bio"
                    defaultValue={profile?.bio || ''}
                    placeholder="Tell others about yourself..."
                    rows={3}
                    className={formErrors.bio ? 'border-red-500' : ''}
                  />
                  {formErrors.bio && (
                    <p className="text-sm text-red-500 mt-1">{formErrors.bio}</p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">Maximum 500 characters</p>
                </div>

                <div className="flex space-x-4">
                  <Button type="submit" disabled={isLoading} className="bg-blue-600 hover:bg-blue-700">
                    {isLoading ? 'Saving...' : 'Save Changes'}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => {
                      setIsEditing(false);
                      setFormErrors({});
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            ) : (
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="font-medium">{user.email}</p>
                    </div>
                  </div>

                  {profile?.full_name && (
                    <div className="flex items-center space-x-3">
                      <UserIcon className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Full Name</p>
                        <p className="font-medium">{profile.full_name}</p>
                      </div>
                    </div>
                  )}

                  {profile?.phone && (
                    <div className="flex items-center space-x-3">
                      <Phone className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Phone</p>
                        <p className="font-medium">{profile.phone}</p>
                      </div>
                    </div>
                  )}

                  {profile?.location && (
                    <div className="flex items-center space-x-3">
                      <MapPin className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Location</p>
                        <p className="font-medium">{profile.location}</p>
                      </div>
                    </div>
                  )}

                  {profile?.bio && (
                    <div className="flex items-start space-x-3">
                      <div className="w-5 h-5 text-gray-400 mt-1">📝</div>
                      <div>
                        <p className="text-sm text-gray-600">Bio</p>
                        <p className="font-medium">{profile.bio}</p>
                      </div>
                    </div>
                  )}

                  {profile?.website && (
                    <div className="flex items-center space-x-3">
                      <div className="w-5 h-5 text-gray-400">🌐</div>
                      <div>
                        <p className="text-sm text-gray-600">Website</p>
                        <a href={profile.website} target="_blank" rel="noopener noreferrer" className="font-medium text-blue-600 hover:underline">
                          {profile.website}
                        </a>
                      </div>
                    </div>
                  )}
                </div>

                <Button onClick={() => setIsEditing(true)} className="bg-blue-600 hover:bg-blue-700">
                  Edit Profile
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
