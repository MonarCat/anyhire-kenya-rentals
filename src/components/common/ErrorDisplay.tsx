
import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ErrorDisplayProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  showHomeButton?: boolean;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  title = "Something went wrong",
  message,
  onRetry,
  showHomeButton = false
}) => {
  return (
    <div className="text-center py-8">
      <Alert variant="destructive" className="max-w-md mx-auto mb-4">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          <strong>{title}</strong>
          <br />
          {message}
        </AlertDescription>
      </Alert>
      
      <div className="flex justify-center gap-4">
        {onRetry && (
          <Button onClick={onRetry} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
        )}
        {showHomeButton && (
          <Button asChild>
            <a href="/">Go Home</a>
          </Button>
        )}
      </div>
    </div>
  );
};

export default ErrorDisplay;
