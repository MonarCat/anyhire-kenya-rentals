
import React from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  text?: string;
  className?: string;
  overlay?: boolean;
  fullScreen?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  text,
  className,
  overlay = false,
  fullScreen = false
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl'
  };

  const spinner = (
    <div className={cn(
      'flex flex-col items-center justify-center',
      fullScreen && 'min-h-screen',
      className
    )}>
      <Loader2 className={cn(
        'animate-spin text-blue-600',
        sizeClasses[size]
      )} />
      {text && (
        <p className={cn(
          'mt-2 text-gray-600',
          textSizeClasses[size]
        )}>
          {text}
        </p>
      )}
    </div>
  );

  if (overlay) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6">
          {spinner}
        </div>
      </div>
    );
  }

  return spinner;
};

// Skeleton Loading Components
export const SkeletonCard: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn('animate-pulse', className)}>
    <div className="bg-gray-200 rounded-lg h-48 mb-4"></div>
    <div className="space-y-2">
      <div className="bg-gray-200 rounded h-4 w-3/4"></div>
      <div className="bg-gray-200 rounded h-4 w-1/2"></div>
      <div className="bg-gray-200 rounded h-4 w-1/4"></div>
    </div>
  </div>
);

export const SkeletonList: React.FC<{ count?: number; className?: string }> = ({ 
  count = 3, 
  className 
}) => (
  <div className={cn('space-y-4', className)}>
    {Array.from({ length: count }).map((_, index) => (
      <div key={index} className="animate-pulse flex space-x-4">
        <div className="bg-gray-200 rounded-full h-12 w-12"></div>
        <div className="flex-1 space-y-2 py-1">
          <div className="bg-gray-200 rounded h-4 w-3/4"></div>
          <div className="bg-gray-200 rounded h-4 w-1/2"></div>
        </div>
      </div>
    ))}
  </div>
);

export const SkeletonText: React.FC<{ 
  lines?: number; 
  className?: string;
}> = ({ lines = 3, className }) => (
  <div className={cn('animate-pulse space-y-2', className)}>
    {Array.from({ length: lines }).map((_, index) => (
      <div 
        key={index} 
        className={cn(
          'bg-gray-200 rounded h-4',
          index === lines - 1 ? 'w-2/3' : 'w-full'
        )}
      ></div>
    ))}
  </div>
);

export default LoadingSpinner;
