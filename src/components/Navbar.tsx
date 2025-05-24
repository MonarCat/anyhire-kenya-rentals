
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Plus, User, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const Navbar = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const categories = [
    'Electronics', 'Vehicles', 'Tools & Equipment', 'Furniture', 
    'Sports & Outdoor', 'Events & Party', 'Fashion', 'Books & Media'
  ];

  return (
    <header className="bg-white shadow-sm border-b">
      {/* Top bar */}
      <div className="bg-green-600 text-white py-2">
        <div className="container mx-auto px-4 text-center text-sm">
          Welcome to AnyHire Kenya - Rent Anything, Anytime!
        </div>
      </div>

      {/* Main navbar */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">A</span>
            </div>
            <span className="text-2xl font-bold text-green-600">AnyHire</span>
          </Link>

          {/* Search bar - Desktop */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-2xl mx-8">
            <div className="relative flex w-full">
              <Input
                type="text"
                placeholder="Search for items to rent..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="rounded-r-none border-r-0 focus:ring-green-500"
              />
              <Button type="submit" className="rounded-l-none bg-green-600 hover:bg-green-700">
                <Search className="w-4 h-4" />
              </Button>
            </div>
          </form>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Button asChild className="hidden md:flex bg-green-600 hover:bg-green-700">
                  <Link to="/list-item">
                    <Plus className="w-4 h-4 mr-2" />
                    List Item
                  </Link>
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                      <User className="w-4 h-4" />
                      <span className="hidden md:block">{user.full_name || user.email}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem asChild>
                      <Link to="/dashboard">Dashboard</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/profile">Profile</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/pricing">Subscription</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={signOut}>
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <Button asChild className="bg-green-600 hover:bg-green-700">
                <Link to="/auth">Sign In</Link>
              </Button>
            )}

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile search */}
        <form onSubmit={handleSearch} className="md:hidden mt-4">
          <div className="relative flex">
            <Input
              type="text"
              placeholder="Search for items to rent..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="rounded-r-none border-r-0"
            />
            <Button type="submit" className="rounded-l-none bg-green-600 hover:bg-green-700">
              <Search className="w-4 h-4" />
            </Button>
          </div>
        </form>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t pt-4">
            {user && (
              <Button asChild className="w-full mb-2 bg-green-600 hover:bg-green-700">
                <Link to="/list-item">
                  <Plus className="w-4 h-4 mr-2" />
                  List Item
                </Link>
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Categories bar */}
      <div className="bg-gray-50 border-t">
        <div className="container mx-auto px-4 py-2">
          <div className="flex space-x-6 overflow-x-auto scrollbar-hide">
            {categories.map((category) => (
              <Link
                key={category}
                to={`/search?category=${encodeURIComponent(category)}`}
                className="text-sm text-gray-600 hover:text-green-600 whitespace-nowrap"
              >
                {category}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
