
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const MessageSystem: React.FC = () => {
  const { user, profile } = useAuth();

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Messages
          </CardTitle>
          <CardDescription>
            Connect with other users
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center text-gray-500 py-8">
            {profile?.avatar_url && (
              <img
                src={profile.avatar_url}
                alt={profile.full_name || "User"}
                className="mx-auto w-12 h-12 rounded-full object-cover border mb-4"
              />
            )}
            <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p className="text-lg font-medium mb-2">No messages yet</p>
            <p className="text-sm">Start a conversation with other users to see messages here.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MessageSystem;
