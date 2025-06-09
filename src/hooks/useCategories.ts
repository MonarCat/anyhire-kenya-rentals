
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

// Global cache to prevent multiple API calls
let categoriesCache: Category[] | null = null;
let isLoading = false;
let loadingPromise: Promise<void> | null = null;

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>(categoriesCache || FALLBACK_CATEGORIES);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchCategories = async () => {
    // If already loading, wait for the existing promise
    if (isLoading && loadingPromise) {
      await loadingPromise;
      setCategories(categoriesCache || FALLBACK_CATEGORIES);
      return;
    }

    // If we have cached data, use it
    if (categoriesCache) {
      setCategories(categoriesCache);
      return;
    }

    setLoading(true);
    isLoading = true;
    setError(null);
    
    loadingPromise = (async () => {
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
          categoriesCache = data;
          setCategories(data);
        } else {
          console.log('No categories found in database, using fallback categories');
          categoriesCache = FALLBACK_CATEGORIES;
          setCategories(FALLBACK_CATEGORIES);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
        setError('Failed to load categories');
        categoriesCache = FALLBACK_CATEGORIES;
        setCategories(FALLBACK_CATEGORIES);
        
        console.log('Using fallback categories due to error');
      } finally {
        setLoading(false);
        isLoading = false;
        loadingPromise = null;
      }
    })();

    await loadingPromise;
  };

  useEffect(() => {
    fetchCategories();
  }, []); // Empty dependency array to prevent re-fetching

  return {
    categories,
    loading,
    error,
    refetch: () => {
      // Clear cache and refetch
      categoriesCache = null;
      fetchCategories();
    },
  };
};
