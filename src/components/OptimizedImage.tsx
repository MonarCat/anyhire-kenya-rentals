
import React from 'react';
import { useOptimizedImage } from '@/hooks/useOptimizedImage';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  placeholder?: string;
  quality?: number;
  priority?: boolean;
  sizes?: string;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  className = '',
  placeholder = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2VlZSIvPjx0ZXh0IHg9IjEwMCIgeT0iMTAwIiBmb250LXNpemU9IjE4IiBmaWxsPSIjYWFhIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+TG9hZGluZy4uLjwvdGV4dD48L3N2Zz4=',
  quality = 80,
  priority = false,
  sizes = '100vw'
}) => {
  const { 
    src: optimizedSrc, 
    isLoading, 
    error, 
    generateSrcSet 
  } = useOptimizedImage({ src, placeholder, quality, sizes });

  return (
    <img
      src={optimizedSrc}
      srcSet={generateSrcSet()}
      sizes={sizes}
      alt={alt}
      width={width}
      height={height}
      className={`transition-opacity duration-300 ${isLoading ? 'opacity-50' : 'opacity-100'} ${className}`}
      loading={priority ? 'eager' : 'lazy'}
      onError={(e) => {
        console.error('Image failed to load:', src);
      }}
    />
  );
};

export default OptimizedImage;
