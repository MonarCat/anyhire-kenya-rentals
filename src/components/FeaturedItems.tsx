
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Home, RefreshCw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import LoadingSpinner from '@/components/LoadingSpinner';

interface Item {
  id: string;
  title: string;
  price: number;
  price_period: string;
  location: string;
  condition: string;
  images: string[];
  ad_type: string;
  rating?: number;
  user_id: string;
}

const FeaturedItems = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchFeaturedItems();
  }, []);

  const fetchFeaturedItems = async () => {
    try {
      console.log('Fetching featured items...');
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('items')
        .select(`
          id,
          title,
          price,
          price_period,
          location,
          condition,
          images,
          ad_type,
          rating,
          user_id
        `)
        .eq('is_available', true)
        .order('created_at', { ascending: false })
        .limit(8);

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      console.log('Items fetched successfully:', data);
      
      const transformedData: Item[] = (data || []).map(item => ({
        ...item,
        images: Array.isArray(item.images) 
          ? item.images.filter((img): img is string => typeof img === 'string')
          : typeof item.images === 'string' 
            ? [item.images] 
            : [],
        rating: item.rating ? Number(item.rating) : 0
      }));
      
      setItems(transformedData);
    } catch (error) {
      console.error('Error fetching featured items:', error);
      setError('Failed to load items');
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (priceInCents: number) => {
    return (priceInCents / 100).toLocaleString();
  };

  const getImageUrl = (images: string[]) => {
    if (images && images.length > 0) {
      return images[0];
    }
    return 'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=400&h=300&fit=crop';
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <LoadingSpinner size="lg" text="Loading featured items..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 mb-4">{error}</p>
        <div className="flex justify-center gap-4">
          <Button onClick={fetchFeaturedItems} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
          <Button asChild>
            <Link to="/">
              <Home className="w-4 h-4 mr-2" />
              Go Home
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600 mb-4">No featured items available at the moment.</p>
        <Button asChild>
          <Link to="/search">
            Browse All Items
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {items.map((item) => (
        <Link key={item.id} to={`/item/${item.id}`}>
          <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
            <CardContent className="p-0">
              <div className="relative">
                <img 
                  src={getImageUrl(item.images)} 
                  alt={item.title}
                  className="w-full h-48 object-cover rounded-t-lg group-hover:scale-105 transition-transform"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=400&h=300&fit=crop';
                  }}
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
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
};

export default FeaturedItems;
