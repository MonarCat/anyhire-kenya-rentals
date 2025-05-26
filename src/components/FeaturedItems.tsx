import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';

const FeaturedItems = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedItems();
  }, []);

  const fetchFeaturedItems = async () => {
    try {
      const { data, error } = await supabase
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
        .eq('is_available', true)
        .eq('is_featured', true)
        .order('created_at', { ascending: false })
        .limit(4);

      if (error) throw error;
      setItems(data || []);
    } catch (error) {
      console.error('Error fetching featured items:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading featured items...</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {items.map((item: any) => (
        <Link key={item.id} to={`/item/${item.id}`}>
          <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
            <CardContent className="p-0">
              <div className="relative">
                <img 
                  src={item.images?.[0] || 'https://images.pexels.com/photos/325153/pexels-photo-325153.jpeg'} 
                  alt={item.title}
                  className="w-full h-48 object-cover rounded-t-lg group-hover:scale-105 transition-transform"
                />
                {item.ad_type !== 'normal' && (
                  <Badge className="absolute top-2 left-2 bg-yellow-500 text-black">
                    Featured
                  </Badge>
                )}
                <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-sm">
                  ⭐ {item.rating || '0.0'}
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-2 line-clamp-2">{item.title}</h3>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl font-bold text-green-600">
                    KES {(item.price / 100).toLocaleString()}
                  </span>
                  <span className="text-sm text-gray-600">/{item.price_period}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600 mb-2">
                  <MapPin className="w-4 h-4 mr-1" />
                  {item.location}
                </div>
                <div className="flex justify-between items-center">
                  <Badge variant="secondary" className="text-xs">
                    {item.categories?.name}
                  </Badge>
                  {item.profiles?.full_name && (
                    <span className="text-xs text-gray-500">
                      by {item.profiles.full_name}
                    </span>
                  )}
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