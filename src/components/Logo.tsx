
import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'white' | 'dark';
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ size = 'md', variant = 'default', className = '' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8 text-lg',
    md: 'w-12 h-12 text-2xl',
    lg: 'w-16 h-16 text-3xl',
    xl: 'w-24 h-24 text-5xl'
  };

  const variantClasses = {
    default: 'bg-gradient-to-br from-blue-600 to-blue-800 text-white',
    white: 'bg-white text-blue-600 border-2 border-blue-600',
    dark: 'bg-gray-900 text-white'
  };

  return (
    <div className={`${sizeClasses[size]} ${variantClasses[variant]} rounded-lg flex items-center justify-center font-bold shadow-lg ${className}`}>
      <span className="tracking-tight">AH</span>
    </div>
  );
};

export default Logo;
