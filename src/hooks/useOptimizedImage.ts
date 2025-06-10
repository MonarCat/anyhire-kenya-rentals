
import { useState, useEffect, useCallback } from 'react';

interface UseOptimizedImageProps {
  src: string;
  placeholder?: string;
  quality?: number;
  sizes?: string;
}

export const useOptimizedImage = ({ 
  src, 
  placeholder = '', 
  quality = 80,
  sizes = '100vw'
}: UseOptimizedImageProps) => {
  const [imageSrc, setImageSrc] = useState(placeholder);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const optimizeSupabaseImage = useCallback((url: string, width?: number, height?: number) => {
    if (!url || !url.includes('supabase')) return url;
    
    try {
      const urlObj = new URL(url);
      const params = new URLSearchParams();
      
      if (width) params.set('width', width.toString());
      if (height) params.set('height', height.toString());
      params.set('quality', quality.toString());
      params.set('format', 'webp');
      
      // Add transform parameters to Supabase storage URL
      urlObj.pathname = urlObj.pathname.replace('/object/public/', '/render/image/public/');
      urlObj.search = params.toString();
      
      return urlObj.toString();
    } catch {
      return url;
    }
  }, [quality]);

  const loadImage = useCallback((imgSrc: string) => {
    if (!imgSrc) return;

    setIsLoading(true);
    setError(null);

    const img = new Image();
    
    img.onload = () => {
      setImageSrc(imgSrc);
      setIsLoading(false);
    };
    
    img.onerror = () => {
      setError('Failed to load image');
      setIsLoading(false);
      if (placeholder) {
        setImageSrc(placeholder);
      }
    };

    img.src = imgSrc;
  }, [placeholder]);

  useEffect(() => {
    if (src) {
      loadImage(src);
    }
  }, [src, loadImage]);

  const getResponsiveImageSrc = useCallback((width: number) => {
    return optimizeSupabaseImage(src, width);
  }, [src, optimizeSupabaseImage]);

  const generateSrcSet = useCallback(() => {
    const widths = [320, 640, 768, 1024, 1280, 1920];
    return widths
      .map(width => `${optimizeSupabaseImage(src, width)} ${width}w`)
      .join(', ');
  }, [src, optimizeSupabaseImage]);

  return {
    src: imageSrc,
    isLoading,
    error,
    getResponsiveImageSrc,
    generateSrcSet,
    reload: () => loadImage(src)
  };
};

// Optimized Image Component
import React from 'react';

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
