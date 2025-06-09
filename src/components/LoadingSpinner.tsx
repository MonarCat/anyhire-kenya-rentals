
import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  text?: string;
  timeout?: number;
}

const LoadingSpinner = ({ size = 'md', className, text, timeout = 8000 }: LoadingSpinnerProps) => {
  const [showTimeout, setShowTimeout] = useState(false);

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  useEffect(() => {
    if (timeout) {
      const timer = setTimeout(() => {
        setShowTimeout(true);
      }, timeout);

      return () => clearTimeout(timer);
    }
  }, [timeout]);

  if (showTimeout) {
    return (
      <div className={cn('flex flex-col items-center justify-center gap-2', className)}>
        <p className="text-sm text-gray-600">Loading is taking longer than expected...</p>
        <button 
          onClick={() => window.location.reload()} 
          className="text-sm text-blue-600 hover:text-blue-800 underline"
        >
          Try refreshing the page
        </button>
      </div>
    );
  }

  return (
    <div className={cn('flex flex-col items-center justify-center gap-2', className)}>
      <div
        className={cn(
          'animate-spin rounded-full border-2 border-gray-300 border-t-green-600',
          sizeClasses[size]
        )}
      />
      {text && <p className="text-sm text-gray-600">{text}</p>}
    </div>
  );
};

export default LoadingSpinner;
