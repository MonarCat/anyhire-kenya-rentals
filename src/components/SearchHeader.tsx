
import React from 'react';
import { Search as SearchIcon, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import HomeButton from '@/components/HomeButton';

interface SearchHeaderProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onSearch: (e: React.FormEvent) => void;
}

const SearchHeader: React.FC<SearchHeaderProps> = ({ 
  searchQuery, 
  onSearchChange, 
  onSearch 
}) => {
  return (
    <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border-b py-8">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-4 mb-6">
          <HomeButton size="sm" />
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Search Items
            </h1>
            <Sparkles className="w-5 h-5 text-yellow-500" />
          </div>
        </div>
        <form onSubmit={onSearch} className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative group">
              <Input
                type="text"
                placeholder="Search for items to rent... (e.g., camera, bicycle, sound system)"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full h-12 pl-4 pr-12 border-2 border-emerald-200 focus:border-emerald-400 rounded-xl shadow-lg focus:shadow-xl transition-all duration-300 bg-white"
              />
              <SearchIcon className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
            </div>
            <Button 
              type="submit" 
              className="h-12 px-8 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 rounded-xl group"
            >
              <SearchIcon className="w-4 h-4 mr-2 group-hover:animate-pulse" />
              Search
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SearchHeader;
