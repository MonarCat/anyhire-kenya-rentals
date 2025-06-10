
import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface SearchFilters {
  query: string;
  category: string;
  location: string;
  minPrice: number | null;
  maxPrice: number | null;
  condition: string;
  sortBy: 'price_asc' | 'price_desc' | 'newest' | 'oldest' | 'rating';
}

export const useAdvancedSearch = () => {
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const { toast } = useToast();

  const search = useCallback(async (
    filters: SearchFilters, 
    page: number = 1, 
    limit: number = 20
  ) => {
    setLoading(true);
    
    try {
      let query = supabase
        .from('items')
        .select(`
          *,
          categories!inner (
            id,
            name,
            icon
          ),
          profiles!inner (
            full_name,
            avatar_url,
            rating,
            verified
          )
        `, { count: 'exact' })
        .eq('is_available', true);

      // Apply text search if query exists
      if (filters.query && filters.query.trim()) {
        query = query.textSearch('title,description', filters.query.trim(), {
          type: 'websearch',
          config: 'english'
        });
      }

      // Apply category filter
      if (filters.category) {
        query = query.eq('category_id', filters.category);
      }

      // Apply location filter
      if (filters.location) {
        query = query.ilike('location', `%${filters.location}%`);
      }

      // Apply price range filters
      if (filters.minPrice !== null) {
        query = query.gte('price', filters.minPrice * 100); // Convert to cents
      }
      if (filters.maxPrice !== null) {
        query = query.lte('price', filters.maxPrice * 100); // Convert to cents
      }

      // Apply condition filter
      if (filters.condition) {
        query = query.eq('condition', filters.condition);
      }

      // Apply sorting
      switch (filters.sortBy) {
        case 'price_asc':
          query = query.order('price', { ascending: true });
          break;
        case 'price_desc':
          query = query.order('price', { ascending: false });
          break;
        case 'newest':
          query = query.order('created_at', { ascending: false });
          break;
        case 'oldest':
          query = query.order('created_at', { ascending: true });
          break;
        case 'rating':
          query = query.order('rating', { ascending: false });
          break;
        default:
          query = query.order('created_at', { ascending: false });
      }

      // Apply pagination
      const from = (page - 1) * limit;
      const to = from + limit - 1;
      query = query.range(from, to);

      const { data, error, count } = await query;

      if (error) {
        console.error('Search error:', error);
        throw error;
      }

      setResults(data || []);
      setTotalCount(count || 0);

    } catch (error: any) {
      console.error('Search failed:', error);
      toast({
        title: "Search failed",
        description: error.message || "Failed to search items",
        variant: "destructive",
      });
      setResults([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const searchNearby = useCallback(async (
    latitude: number,
    longitude: number,
    radiusKm: number = 50,
    filters: Partial<SearchFilters> = {}
  ) => {
    setLoading(true);
    
    try {
      // For now, we'll do a basic location search
      // In a real app, you'd use PostGIS for geographic queries
      const { data, error } = await supabase
        .from('items')
        .select(`
          *,
          categories!inner (
            id,
            name,
            icon
          ),
          profiles!inner (
            full_name,
            avatar_url,
            rating,
            verified
          )
        `)
        .eq('is_available', true)
        .not('latitude', 'is', null)
        .not('longitude', 'is', null)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;

      // Filter by distance (simplified calculation)
      const filtered = (data || []).filter(item => {
        if (!item.latitude || !item.longitude) return false;
        
        const distance = calculateDistance(
          latitude, longitude,
          item.latitude, item.longitude
        );
        
        return distance <= radiusKm;
      });

      setResults(filtered);
      setTotalCount(filtered.length);

    } catch (error: any) {
      console.error('Nearby search failed:', error);
      toast({
        title: "Nearby search failed",
        description: error.message || "Failed to search nearby items",
        variant: "destructive",
      });
      setResults([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  }, [toast]);

  return {
    results,
    loading,
    totalCount,
    search,
    searchNearby,
    clearResults: () => {
      setResults([]);
      setTotalCount(0);
    }
  };
};

// Helper function to calculate distance between two points
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const d = R * c; // Distance in kilometers
  return d;
}
