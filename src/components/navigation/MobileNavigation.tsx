
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Menu, 
  Home, 
  Search, 
  Plus, 
  MessageSquare, 
  User, 
  Settings,
  LogOut,
  Heart,
  Wallet,
  HelpCircle
} from 'lucide-react';

interface NavigationItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  requiresAuth?: boolean;
  badge?: number;
}

const MobileNavigation: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const { user, signOut } = useAuth();
  const location = useLocation();

  useEffect(() => {
    if (user) {
      // Fetch unread message count would go here
    }
  }, [user]);

  const navigationItems: NavigationItem[] = [
    {
      label: 'Home',
      href: '/',
      icon: <Home className="w-5 h-5" />
    },
    {
      label: 'Search',
      href: '/search',
      icon: <Search className="w-5 h-5" />
    },
    {
      label: 'List Item',
      href: '/list-item',
      icon: <Plus className="w-5 h-5" />,
      requiresAuth: true
    },
    {
      label: 'Messages',
      href: '/messages',
      icon: <MessageSquare className="w-5 h-5" />,
      requiresAuth: true,
      badge: unreadMessages
    }
  ];

  const secondaryItems: NavigationItem[] = [
    {
      label: 'Dashboard',
      href: '/dashboard',
      icon: <Settings className="w-5 h-5" />,
      requiresAuth: true
    },
    {
      label: 'Favorites',
      href: '/favorites',
      icon: <Heart className="w-5 h-5" />,
      requiresAuth: true
    },
    {
      label: 'Wallet',
      href: '/wallet',
      icon: <Wallet className="w-5 h-5" />,
      requiresAuth: true
    },
    {
      label: 'Help',
      href: '/help',
      icon: <HelpCircle className="w-5 h-5" />
    }
  ];

  const handleLogout = async () => {
    try {
      await signOut();
      setIsOpen(false);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const isActivePath = (href: string) => {
    if (href === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(href);
  };

  return (
    <>
      {/* MOBILE ONLY - Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
        <div className="flex items-center justify-around py-2">
          {navigationItems.slice(0, 4).map((item) => {
            if (item.requiresAuth && !user) return null;
            
            return (
              <Link
                key={item.href}
                to={item.href}
                className={`flex flex-col items-center p-2 relative ${
                  isActivePath(item.href) 
                    ? 'text-blue-600' 
                    : 'text-gray-600'
                }`}
              >
                {item.icon}
                <span className="text-xs mt-1">{item.label}</span>
                {item.badge && item.badge > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                  >
                    {item.badge > 99 ? '99+' : item.badge}
                  </Badge>
                )}
              </Link>
            );
          })}
          
          {/* Menu Button */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="flex flex-col items-center p-2 text-gray-600"
              >
                <Menu className="w-5 h-5" />
                <span className="text-xs mt-1">More</span>
              </Button>
            </SheetTrigger>
            
            <SheetContent side="right" className="w-80">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              
              <div className="mt-6">
                {/* User Section */}
                {user ? (
                  <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg mb-6">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={user.user_metadata?.avatar_url} />
                      <AvatarFallback>
                        {user.user_metadata?.full_name?.charAt(0).toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {user.user_metadata?.full_name || 'User'}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {user.email}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 bg-gray-50 rounded-lg mb-6">
                    <p className="text-sm text-gray-600 mb-3">
                      Sign in to access all features
                    </p>
                    <div className="space-y-2">
                      <Button asChild className="w-full">
                        <Link to="/auth" onClick={() => setIsOpen(false)}>
                          Sign In
                        </Link>
                      </Button>
                    </div>
                  </div>
                )}

                {/* Navigation Items */}
                <div className="space-y-1">
                  {secondaryItems.map((item) => {
                    if (item.requiresAuth && !user) return null;
                    
                    return (
                      <Link
                        key={item.href}
                        to={item.href}
                        onClick={() => setIsOpen(false)}
                        className={`flex items-center space-x-3 w-full p-3 rounded-lg transition-colors ${
                          isActivePath(item.href)
                            ? 'bg-blue-50 text-blue-600'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {item.icon}
                        <span className="flex-1">{item.label}</span>
                        {item.badge && item.badge > 0 && (
                          <Badge variant="secondary">
                            {item.badge > 99 ? '99+' : item.badge}
                          </Badge>
                        )}
                      </Link>
                    );
                  })}
                </div>

                {/* Logout Button */}
                {user && (
                  <div className="mt-6 pt-6 border-t">
                    <Button
                      variant="outline"
                      onClick={handleLogout}
                      className="w-full flex items-center space-x-3"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </Button>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Bottom padding for mobile nav - MOBILE ONLY */}
      <div className="md:hidden h-16" />
    </>
  );
};

export default MobileNavigation;
