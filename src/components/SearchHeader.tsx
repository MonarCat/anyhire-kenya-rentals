
import React from 'react';
import { Search as SearchIcon } from 'lucide-react';
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
    <div className="bg-white border-b py-6">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-4 mb-4">
          <HomeButton size="sm" />
          <h1 className="text-xl font-semibold">Search Items</h1>
        </div>
        <form onSubmit={onSearch} className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                type="text"
                placeholder="Search for items to rent..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full"
              />
            </div>
            <Button type="submit" className="bg-green-600 hover:bg-green-700">
              <SearchIcon className="w-4 h-4 mr-2" />
              Search
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SearchHeader;
