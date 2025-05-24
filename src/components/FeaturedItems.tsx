
import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const FeaturedItems = () => {
  const featuredItems = [
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
      title: 'DJ Equipment - Full Setup',
      price: 150,
      period: 'hour',
      location: 'CBD, Nairobi',
      image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop',
      category: 'Events & Party',
      rating: 4.9,
      isPromoted: true
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {featuredItems.map((item) => (
        <Link key={item.id} to={`/item/${item.id}`}>
          <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
            <CardContent className="p-0">
              <div className="relative">
                <img 
                  src={item.image} 
                  alt={item.title}
                  className="w-full h-48 object-cover rounded-t-lg group-hover:scale-105 transition-transform"
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
  );
};

export default FeaturedItems;
