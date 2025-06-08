
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const AuthGuard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <Card className="max-w-md w-full mx-4">
        <CardHeader className="text-center">
          <CardTitle>Authentication Required</CardTitle>
          <CardDescription>
            Please sign in to list an item for rent
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={() => navigate('/auth')}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            Sign In
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthGuard;
