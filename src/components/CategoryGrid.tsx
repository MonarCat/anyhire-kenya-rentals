
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCategories } from '@/hooks/useCategories';
import LoadingSpinner from '@/components/LoadingSpinner';
import HomeButton from '@/components/HomeButton';

const CategoryGrid = () => {
  const { categories, loading, error, refetch } = useCategories();

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <LoadingSpinner size="lg" text="Loading categories..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 mb-4">{error}</p>
        <div className="flex justify-center gap-4">
          <Button onClick={refetch} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
          <HomeButton />
        </div>
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600 mb-4">No categories available at the moment.</p>
        <div className="flex justify-center gap-4">
          <Button onClick={refetch} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <HomeButton />
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {categories.map((category) => (
        <Link key={category.id} to={`/search?category=${encodeURIComponent(category.name)}`}>
          <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
            <CardContent className="p-6 text-center">
              <div className="text-4xl mb-2">{category.icon || '📦'}</div>
              <h3 className="font-semibold text-sm">{category.name}</h3>
              {category.description && (
                <p className="text-xs text-gray-600 mt-1">{category.description}</p>
              )}
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
};

export default CategoryGrid;
