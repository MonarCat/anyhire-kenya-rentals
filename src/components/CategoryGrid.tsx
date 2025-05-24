
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';

const CategoryGrid = () => {
  const categories = [
    {
      name: 'Electronics',
      icon: '📱',
      count: '2,340 items',
      image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=300&fit=crop'
    },
    {
      name: 'Vehicles',
      icon: '🚗',
      count: '1,890 items',
      image: 'https://images.unsplash.com/photo-1502877338535-766e1452684a?w=400&h=300&fit=crop'
    },
    {
      name: 'Tools & Equipment',
      icon: '🔧',
      count: '3,456 items',
      image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400&h=300&fit=crop'
    },
    {
      name: 'Furniture',
      icon: '🪑',
      count: '987 items',
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop'
    },
    {
      name: 'Sports & Outdoor',
      icon: '⚽',
      count: '1,234 items',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop'
    },
    {
      name: 'Events & Party',
      icon: '🎉',
      count: '765 items',
      image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=400&h=300&fit=crop'
    },
    {
      name: 'Fashion',
      icon: '👗',
      count: '543 items',
      image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&h=300&fit=crop'
    },
    {
      name: 'Books & Media',
      icon: '📚',
      count: '321 items',
      image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop'
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      {categories.map((category) => (
        <Link key={category.name} to={`/search?category=${encodeURIComponent(category.name)}`}>
          <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
            <CardContent className="p-0">
              <div className="relative">
                <img 
                  src={category.image} 
                  alt={category.name}
                  className="w-full h-32 object-cover rounded-t-lg group-hover:scale-105 transition-transform"
                />
                <div className="absolute inset-0 bg-black bg-opacity-20 rounded-t-lg"></div>
                <div className="absolute top-2 left-2 text-2xl bg-white rounded-lg w-10 h-10 flex items-center justify-center">
                  {category.icon}
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-lg">{category.name}</h3>
                <p className="text-sm text-gray-600">{category.count}</p>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
};

export default CategoryGrid;
