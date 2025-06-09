
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Category {
  id: string;
  name: string;
  icon?: string;
  description?: string;
  image_url?: string;
  sort_order?: number;
}

const FALLBACK_CATEGORIES: Category[] = [
  { id: 'electronics', name: 'Electronics', icon: '📱' },
  { id: 'tools', name: 'Tools & Equipment', icon: '🔧' },
  { id: 'books', name: 'Books & Media', icon: '📚' },
  { id: 'sports', name: 'Sports & Recreation', icon: '⚽' },
  { id: 'furniture', name: 'Furniture', icon: '🪑' },
  { id: 'other', name: 'Other', icon: '📦' },
];

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchCategories = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('Fetching categories from Supabase...');
      
      const { data, error } = await supabase
        .from('categories')
        .select('id, name, icon, description, image_url, sort_order')
        .eq('is_active', true)
        .order('sort_order', { ascending: true })
        .order('name', { ascending: true });

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      console.log('Categories fetched successfully:', data);
      
      if (data && data.length > 0) {
        setCategories(data);
      } else {
        console.log('No categories found, using fallback');
        setCategories(FALLBACK_CATEGORIES);
        toast({
          title: "Using Default Categories",
          description: "No categories found in database, using defaults.",
          variant: "default",
        });
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      setError('Failed to load categories');
      setCategories(FALLBACK_CATEGORIES);
      
      toast({
        title: "Connection Issue",
        description: "Using default categories. The app will work normally.",
        variant: "default",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return {
    categories,
    loading,
    error,
    refetch: fetchCategories,
  };
};
