
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home } from 'lucide-react';

interface HomeButtonProps {
  className?: string;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg';
}

const HomeButton: React.FC<HomeButtonProps> = ({ 
  className = '', 
  variant = 'outline',
  size = 'default'
}) => {
  return (
    <Button asChild variant={variant} size={size} className={className}>
      <Link to="/">
        <Home className="w-4 h-4 mr-2" />
        Home
      </Link>
    </Button>
  );
};

export default HomeButton;
