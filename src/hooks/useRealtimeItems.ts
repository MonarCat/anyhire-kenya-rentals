
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const useRealtimeItems = () => {
  const [userItems, setUserItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      setUserItems([]);
      setLoading(false);
      return;
    }

    // Initial fetch with detailed logging
    const fetchUserItems = async () => {
      try {
        console.log('Fetching items for user:', user.id);
        
        const { data, error } = await supabase
          .from('items')
          .select(`
            *,
            categories!inner (
              id,
              name,
              icon
            )
          `)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching user items:', error);
          throw error;
        }
        
        console.log('Fetched user items:', data);
        setUserItems(data || []);
      } catch (error) {
        console.error('Error fetching user items:', error);
        setUserItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUserItems();

    // Set up real-time subscription
    const channel = supabase
      .channel('user-items-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'items',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          console.log('Item change detected:', payload);
          
          if (payload.eventType === 'INSERT') {
            console.log('Adding new item:', payload.new);
            setUserItems(prev => [payload.new as any, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            console.log('Updating item:', payload.new);
            setUserItems(prev => 
              prev.map(item => 
                item.id === payload.new.id ? { ...item, ...payload.new } : item
              )
            );
          } else if (payload.eventType === 'DELETE') {
            console.log('Removing item:', payload.old);
            setUserItems(prev => 
              prev.filter(item => item.id !== payload.old.id)
            );
          }
        }
      )
      .subscribe();

    return () => {
      console.log('Cleaning up realtime subscription');
      supabase.removeChannel(channel);
    };
  }, [user]);

  return { userItems, loading };
};
