
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search as SearchIcon, Filter, MapPin, Grid, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Link } from 'react-router-dom';

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  
  const mockItems = [
    {
      id: '1',
      title: 'Professional Camera - Canon EOS R5',
      price: 500,
      period: 'day',
      location: 'Westlands, Nairobi',
      image: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&h=300&fit=crop',
      category: 'Electronics',
      rating: 4.9,
      isPromoted: true
    },
    {
      id: '2',
      title: 'Toyota Prado - 7 Seater',
      price: 8000,
      period: 'day',
      location: 'Karen, Nairobi',
      image: 'https://images.unsplash.com/photo-1502877338535-766e1452684a?w=400&h=300&fit=crop',
      category: 'Vehicles',
      rating: 4.8,
      isPromoted: true
    },
    {
      id: '3',
      title: 'Power Tools Set - Complete Kit',
      price: 200,
      period: 'day',
      location: 'Industrial Area, Nairobi',
      image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400&h=300&fit=crop',
      category: 'Tools & Equipment',
      rating: 4.7,
      isPromoted: false
    },
    {
      id: '4',
      title: 'Wedding Decoration Package',
      price: 15000,
      period: 'day',
      location: 'Lavington, Nairobi',
      image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=400&h=300&fit=crop',
      category: 'Events & Party',
      rating: 4.9,
      isPromoted: false
    },
    {
      id: '5',
      title: 'Gaming Laptop - High Performance',
      price: 300,
      period: 'day',
      location: 'Kilimani, Nairobi',
      image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=300&fit=crop',
      category: 'Electronics',
      rating: 4.6,
      isPromoted: false
    },
    {
      id: '6',
      title: 'Mountain Bike - Trek',
      price: 150,
      period: 'day',
      location: 'Parklands, Nairobi',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
      category: 'Sports & Outdoor',
      rating: 4.5,
      isPromoted: false
    }
  ];

  const categories = [
    'All Categories', 'Electronics', 'Vehicles', 'Tools & Equipment', 
    'Furniture', 'Sports & Outdoor', 'Events & Party', 'Fashion', 'Books & Media'
  ];

  const filteredItems = mockItems.filter(item => {
    const matchesSearch = !searchQuery || 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = !category || category === 'All Categories' || item.category === category;
    
    return matchesSearch && matchesCategory;
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery) params.set('q', searchQuery);
    if (category && category !== 'All Categories') params.set('category', category);
    setSearchParams(params);
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
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="md:w-48">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button type="submit" className="bg-green-600 hover:bg-green-700">
                <SearchIcon className="w-4 h-4 mr-2" />
                Search
              </Button>
            </div>
          </form>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">
              {searchQuery || category ? 'Search Results' : 'All Items'}
            </h1>
            <p className="text-gray-600">{filteredItems.length} items found</p>
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
        <div className={`grid gap-6 ${
          viewMode === 'grid' 
            ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
            : 'grid-cols-1'
        }`}>
          {filteredItems.map((item) => (
            <Link key={item.id} to={`/item/${item.id}`}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
                <CardContent className="p-0">
                  <div className="relative">
                    <img 
                      src={item.image} 
                      alt={item.title}
                      className={`w-full object-cover rounded-t-lg group-hover:scale-105 transition-transform ${
                        viewMode === 'grid' ? 'h-48' : 'h-32 md:h-40'
                      }`}
                    />
                    {item.isPromoted && (
                      <Badge className="absolute top-2 left-2 bg-yellow-500 text-black">
                        Featured
                      </Badge>
                    )}
                    <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-sm">
                      ⭐ {item.rating}
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-2 line-clamp-2">{item.title}</h3>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-2xl font-bold text-green-600">
                        KES {item.price.toLocaleString()}
                      </span>
                      <span className="text-sm text-gray-600">/{item.period}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600 mb-2">
                      <MapPin className="w-4 h-4 mr-1" />
                      {item.location}
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {item.category}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold mb-2">No items found</h3>
            <p className="text-gray-600">Try adjusting your search terms or browse all categories</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
