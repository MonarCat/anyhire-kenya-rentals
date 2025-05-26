import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

const CategoryGrid = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading categories...</div>;
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      {categories.map((category: any) => (
        <Link key={category.id} to={`/search?category=${encodeURIComponent(category.name)}`}>
          <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
            <CardContent className="p-0">
              <div className="relative">
                <img 
                  src={category.image_url || 'https://images.pexels.com/photos/325153/pexels-photo-325153.jpeg'} 
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
                <p className="text-sm text-gray-600">{category.description}</p>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
};

export default CategoryGrid;