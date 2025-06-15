
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import LocationSelector from '@/components/LocationSelector';
import { profileSchema, ProfileFormData } from '@/components/forms/ProfileValidation';

interface ProfileFormProps {
  profile: any;
  userEmail?: string;
  onSave: (data: any) => Promise<void>;
  onCancel: () => void;
}

const ProfileForm: React.FC<ProfileFormProps> = ({ profile, userEmail, onSave, onCancel }) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(profile?.location || '');
  const [formErrors, setFormErrors] = useState<Partial<ProfileFormData>>({});

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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

      await onSave(validatedData);
      onCancel(); // Exit edit mode
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
    setSelectedLocation(locationPath);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
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
          value={userEmail || ''}
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
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default ProfileForm;
