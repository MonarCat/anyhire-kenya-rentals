
import React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { User, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProfileAvatarProps {
  imageUrl?: string | null;
  isUploading: boolean;
  imageError: boolean;
  onRemove?: () => void;
}

const ProfileAvatar: React.FC<ProfileAvatarProps> = ({
  imageUrl,
  isUploading,
  imageError,
  onRemove,
}) => {
  const hasValidImage = imageUrl && !imageError;

  return (
    <div className="relative">
      <Avatar className="w-24 h-24">
        {hasValidImage ? (
          <AvatarImage
            src={imageUrl || undefined}
            alt="Profile picture"
            onError={() => {}}
          />
        ) : (
          <AvatarFallback>
            <User className="w-8 h-8 text-gray-400" />
          </AvatarFallback>
        )}
      </Avatar>
      {hasValidImage && onRemove && (
        <Button
          type="button"
          variant="destructive"
          size="icon"
          className="absolute -top-2 -right-2 w-6 h-6 rounded-full"
          onClick={onRemove}
          disabled={isUploading}
        >
          <X className="w-3 h-3" />
        </Button>
      )}
    </div>
  );
};

export default ProfileAvatar;
