
import React from 'react';
import { Mail, Phone, MapPin, User as UserIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProfileDisplayProps {
  user: any;
  profile: any;
  onEdit: () => void;
}

const ProfileDisplay: React.FC<ProfileDisplayProps> = ({ user, profile, onEdit }) => {
  return (
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

      <Button onClick={onEdit} className="bg-blue-600 hover:bg-blue-700">
        Edit Profile
      </Button>
    </div>
  );
};

export default ProfileDisplay;
