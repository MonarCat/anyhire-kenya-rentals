
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Location {
  id: string;
  name: string;
  type: 'county' | 'sub_county' | 'ward';
  parent_id?: string;
  code?: string;
}

export const useLocations = () => {
  const [counties, setCounties] = useState<Location[]>([]);
  const [subCounties, setSubCounties] = useState<Location[]>([]);
  const [wards, setWards] = useState<Location[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCounties();
  }, []);

  const fetchCounties = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('locations')
        .select('*')
        .eq('type', 'county')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      setCounties(data || []);
    } catch (error) {
      console.error('Error fetching counties:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSubCounties = async (countyId: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('locations')
        .select('*')
        .eq('type', 'sub_county')
        .eq('parent_id', countyId)
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      setSubCounties(data || []);
    } catch (error) {
      console.error('Error fetching sub-counties:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchWards = async (subCountyId: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('locations')
        .select('*')
        .eq('type', 'ward')
        .eq('parent_id', subCountyId)
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      setWards(data || []);
    } catch (error) {
      console.error('Error fetching wards:', error);
    } finally {
      setLoading(false);
    }
  };

  const getLocationPath = async (locationId: string): Promise<string> => {
    try {
      const { data, error } = await supabase
        .from('locations')
        .select('id, name, type, parent_id')
        .eq('id', locationId)
        .single();

      if (error || !data) return '';

      let path = data.name;
      let currentLocation = data;

      while (currentLocation.parent_id) {
        const { data: parent } = await supabase
          .from('locations')
          .select('id, name, type, parent_id')
          .eq('id', currentLocation.parent_id)
          .single();

        if (parent) {
          path = `${parent.name}, ${path}`;
          currentLocation = parent;
        } else {
          break;
        }
      }

      return path;
    } catch (error) {
      console.error('Error getting location path:', error);
      return '';
    }
  };

  return {
    counties,
    subCounties,
    wards,
    loading,
    fetchSubCounties,
    fetchWards,
    getLocationPath
  };
};
