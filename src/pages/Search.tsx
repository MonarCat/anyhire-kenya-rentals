
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search as SearchIcon, Grid, List, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import SearchFilters from '@/components/SearchFilters';
import { useCategories } from '@/hooks/useCategories';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import LoadingSpinner from '@/components/LoadingSpinner';

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [showFilters, setShowFilters] = useState(false);
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { categories } = useCategories();

  const [filters, setFilters] = useState({
    location: searchParams.get('location') || 'All Locations',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    condition: searchParams.get('condition') || 'All Conditions',
    category: searchParams.get('category') || 'All Categories'
  });

  useEffect(() => {
    fetchItems();
  }, [filters, searchQuery]);

  const fetchItems = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('items')
        .select(`
          *,
          profiles:user_id (
            full_name,
            avatar_url
          ),
          categories:category_id (
            name
          )
        `)
        .eq('is_available', true);

      // Apply search query
      if (searchQuery) {
        query = query.or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`);
      }

      // Apply location filter
      if (filters.location && filters.location !== 'All Locations') {
        query = query.ilike('location', `%${filters.location}%`);
      }

      // Apply category filter
      if (filters.category && filters.category !== 'All Categories') {
        // Find the category ID by name
        const categoryMatch = categories.find(cat => cat.name === filters.category);
        if (categoryMatch) {
          query = query.eq('category_id', categoryMatch.id);
        }
      }

      // Apply price filters
      if (filters.minPrice) {
        query = query.gte('price', parseInt(filters.minPrice) * 100); // Convert to cents
      }
      if (filters.maxPrice) {
        query = query.lte('price', parseInt(filters.maxPrice) * 100); // Convert to cents
      }

      // Apply condition filter
      if (filters.condition && filters.condition !== 'All Conditions') {
        query = query.eq('condition', filters.condition);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching items:', error);
        toast({
          title: "Error",
          description: "Failed to load items. Please try again.",
          variant: "destructive",
        });
        return;
      }

      setItems(data || []);
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateSearchParams();
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleClearFilters = () => {
    setFilters({
      location: 'All Locations',
      minPrice: '',
      maxPrice: '',
      condition: 'All Conditions',
      category: 'All Categories'
    });
    setSearchQuery('');
    setSearchParams({});
  };

  const updateSearchParams = () => {
    const params = new URLSearchParams();
    if (searchQuery) params.set('q', searchQuery);
    if (filters.location && filters.location !== 'All Locations') params.set('location', filters.location);
    if (filters.category && filters.category !== 'All Categories') params.set('category', filters.category);
    if (filters.minPrice) params.set('minPrice', filters.minPrice);
    if (filters.maxPrice) params.set('maxPrice', filters.maxPrice);
    if (filters.condition && filters.condition !== 'All Conditions') params.set('condition', filters.condition);
    setSearchParams(params);
  };

  const formatPrice = (priceInCents: number) => {
    return (priceInCents / 100).toLocaleString();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Search Header */}
      <div className="bg-white border-b py-6">
        <div className="container mx-auto px-4">
          <form onSubmit={handleSearch} className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Input
                  type="text"
                  placeholder="Search for items to rent..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
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

      <div className="container mx-auto px-4 py-6">
        {/* Filters */}
        <SearchFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
          isOpen={showFilters}
          onToggle={() => setShowFilters(!showFilters)}
        />

        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">
              {searchQuery || Object.values(filters).some(f => f && f !== 'All Locations' && f !== 'All Conditions' && f !== 'All Categories') ? 'Search Results' : 'All Items'}
            </h1>
            <p className="text-gray-600">
              {loading ? 'Loading...' : `${items.length} items found`}
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <Grid className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Results Grid */}
        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" text="Loading items..." />
          </div>
        ) : (
          <div className={`grid gap-6 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
              : 'grid-cols-1'
          }`}>
            {items.map((item) => (
              <Link key={item.id} to={`/item/${item.id}`}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
                  <CardContent className="p-0">
                    <div className="relative">
                      <img 
                        src={item.images && item.images.length > 0 ? item.images[0] : 'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=400&h=300&fit=crop'} 
                        alt={item.title}
                        className={`w-full object-cover rounded-t-lg group-hover:scale-105 transition-transform ${
                          viewMode === 'grid' ? 'h-48' : 'h-32 md:h-40'
                        }`}
                      />
                      {item.ad_type !== 'normal' && (
                        <Badge className="absolute top-2 left-2 bg-yellow-500 text-black">
                          Featured
                        </Badge>
                      )}
                      <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-sm">
                        ⭐ {item.rating || 0}
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-lg mb-2 line-clamp-2">{item.title}</h3>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-2xl font-bold text-green-600">
                          KES {formatPrice(item.price)}
                        </span>
                        <span className="text-sm text-gray-600">/{item.price_period}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600 mb-2">
                        <MapPin className="w-4 h-4 mr-1" />
                        {item.location}
                      </div>
                      <div className="flex justify-between items-center">
                        <Badge variant="secondary" className="text-xs capitalize">
                          {item.condition}
                        </Badge>
                        {/* Show lister's avatar and name always */}
                        {item.profiles?.avatar_url && (
                          <span className="flex items-center gap-1 ml-2">
                            <img 
                              src={item.profiles.avatar_url}
                              alt={item.profiles.full_name || 'User'}
                              className="w-6 h-6 rounded-full object-cover border"
                            />
                            <span className="text-xs text-gray-500">
                              {item.profiles.full_name || 'User'}
                            </span>
                          </span>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}

        {!loading && items.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold mb-2">No items found</h3>
            <p className="text-gray-600">Try adjusting your search terms or filters</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
