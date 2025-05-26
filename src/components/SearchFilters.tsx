
import React from 'react';
import { Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface SearchFiltersProps {
  filters: {
    location: string;
    minPrice: string;
    maxPrice: string;
    condition: string;
    category: string;
  };
  onFilterChange: (key: string, value: string) => void;
  onClearFilters: () => void;
  isOpen: boolean;
  onToggle: () => void;
}

const SearchFilters: React.FC<SearchFiltersProps> = ({
  filters,
  onFilterChange,
  onClearFilters,
  isOpen,
  onToggle
}) => {
  const activeFiltersCount = Object.values(filters).filter(value => value && value !== 'All Categories').length;

  const locations = [
    'All Locations',
    'Nairobi',
    'Mombasa', 
    'Kisumu',
    'Nakuru',
    'Eldoret',
    'Thika',
    'Malindi',
    'Kitale',
    'Garissa'
  ];

  const conditions = [
    'All Conditions',
    'new',
    'excellent', 
    'good',
    'fair'
  ];

  const categories = [
    'All Categories',
    'Electronics',
    'Vehicles', 
    'Tools & Equipment',
    'Furniture',
    'Sports & Outdoor',
    'Events & Party',
    'Fashion',
    'Books & Media'
  ];

  if (!isOpen) {
    return (
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          onClick={onToggle}
          className="flex items-center gap-2"
        >
          <Filter className="w-4 h-4" />
          Filters
          {activeFiltersCount > 0 && (
            <Badge variant="secondary" className="ml-1">
              {activeFiltersCount}
            </Badge>
          )}
        </Button>
        {activeFiltersCount > 0 && (
          <Button variant="ghost" size="sm" onClick={onClearFilters}>
            Clear all
          </Button>
        )}
      </div>
    );
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Filters</CardTitle>
          <Button variant="ghost" size="sm" onClick={onToggle}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Location Filter */}
          <div>
            <label className="text-sm font-medium mb-2 block">Location</label>
            <Select value={filters.location} onValueChange={(value) => onFilterChange('location', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {locations.map((location) => (
                  <SelectItem key={location} value={location}>
                    {location}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Price Range */}
          <div>
            <label className="text-sm font-medium mb-2 block">Min Price (KES)</label>
            <Input
              type="number"
              placeholder="Min price"
              value={filters.minPrice}
              onChange={(e) => onFilterChange('minPrice', e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Max Price (KES)</label>
            <Input
              type="number"
              placeholder="Max price"
              value={filters.maxPrice}
              onChange={(e) => onFilterChange('maxPrice', e.target.value)}
            />
          </div>

          {/* Condition Filter */}
          <div>
            <label className="text-sm font-medium mb-2 block">Condition</label>
            <Select value={filters.condition} onValueChange={(value) => onFilterChange('condition', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {conditions.map((condition) => (
                  <SelectItem key={condition} value={condition}>
                    {condition === 'All Conditions' ? condition : condition.charAt(0).toUpperCase() + condition.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Active Filters */}
        {activeFiltersCount > 0 && (
          <div className="mt-4 pt-4 border-t">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-medium">Active filters:</span>
              {filters.location && filters.location !== 'All Locations' && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Location: {filters.location}
                  <X 
                    className="w-3 h-3 cursor-pointer" 
                    onClick={() => onFilterChange('location', 'All Locations')}
                  />
                </Badge>
              )}
              {filters.minPrice && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Min: KES {filters.minPrice}
                  <X 
                    className="w-3 h-3 cursor-pointer" 
                    onClick={() => onFilterChange('minPrice', '')}
                  />
                </Badge>
              )}
              {filters.maxPrice && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Max: KES {filters.maxPrice}
                  <X 
                    className="w-3 h-3 cursor-pointer" 
                    onClick={() => onFilterChange('maxPrice', '')}
                  />
                </Badge>
              )}
              {filters.condition && filters.condition !== 'All Conditions' && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  {filters.condition.charAt(0).toUpperCase() + filters.condition.slice(1)}
                  <X 
                    className="w-3 h-3 cursor-pointer" 
                    onClick={() => onFilterChange('condition', 'All Conditions')}
                  />
                </Badge>
              )}
              {filters.category && filters.category !== 'All Categories' && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  {filters.category}
                  <X 
                    className="w-3 h-3 cursor-pointer" 
                    onClick={() => onFilterChange('category', 'All Categories')}
                  />
                </Badge>
              )}
              <Button variant="ghost" size="sm" onClick={onClearFilters}>
                Clear all
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SearchFilters;
