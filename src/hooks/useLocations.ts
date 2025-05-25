
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
      // Use raw SQL query since 'locations' table isn't in types yet
      const { data, error } = await supabase
        .rpc('get_counties') 
        .catch(async () => {
          // Fallback to direct query if RPC doesn't exist
          return await supabase
            .from('locations' as any)
            .select('*')
            .eq('type', 'county')
            .eq('is_active', true)
            .order('name');
        });

      if (error) throw error;
      setCounties(data || []);
    } catch (error) {
      console.error('Error fetching counties:', error);
      // Fallback to hardcoded counties if database query fails
      setCounties([
        { id: '1', name: 'Nairobi', type: 'county', code: '47' },
        { id: '2', name: 'Mombasa', type: 'county', code: '01' },
        { id: '3', name: 'Kisumu', type: 'county', code: '42' },
        { id: '4', name: 'Nakuru', type: 'county', code: '32' },
        { id: '5', name: 'Kiambu', type: 'county', code: '22' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const fetchSubCounties = async (countyId: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('locations' as any)
        .select('*')
        .eq('type', 'sub_county')
        .eq('parent_id', countyId)
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      setSubCounties(data || []);
    } catch (error) {
      console.error('Error fetching sub-counties:', error);
      // Fallback for Nairobi sub-counties
      if (countyId === '1') {
        setSubCounties([
          { id: '101', name: 'Westlands', type: 'sub_county', parent_id: '1' },
          { id: '102', name: 'Dagoretti North', type: 'sub_county', parent_id: '1' },
          { id: '103', name: 'Lang\'ata', type: 'sub_county', parent_id: '1' },
          { id: '104', name: 'Kasarani', type: 'sub_county', parent_id: '1' },
          { id: '105', name: 'Embakasi South', type: 'sub_county', parent_id: '1' }
        ]);
      } else {
        setSubCounties([]);
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchWards = async (subCountyId: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('locations' as any)
        .select('*')
        .eq('type', 'ward')
        .eq('parent_id', subCountyId)
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      setWards(data || []);
    } catch (error) {
      console.error('Error fetching wards:', error);
      // Fallback for Westlands wards
      if (subCountyId === '101') {
        setWards([
          { id: '1001', name: 'Kitisuru', type: 'ward', parent_id: '101' },
          { id: '1002', name: 'Parklands/Highridge', type: 'ward', parent_id: '101' },
          { id: '1003', name: 'Karura', type: 'ward', parent_id: '101' },
          { id: '1004', name: 'Kangemi', type: 'ward', parent_id: '101' },
          { id: '1005', name: 'Mountain View', type: 'ward', parent_id: '101' }
        ]);
      } else {
        setWards([]);
      }
    } finally {
      setLoading(false);
    }
  };

  const getLocationPath = async (locationId: string): Promise<string> => {
    try {
      const { data, error } = await supabase
        .from('locations' as any)
        .select('id, name, type, parent_id')
        .eq('id', locationId)
        .single();

      if (error || !data) return '';

      let path = data.name;
      let currentLocation = data;

      while (currentLocation.parent_id) {
        const { data: parent } = await supabase
          .from('locations' as any)
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
