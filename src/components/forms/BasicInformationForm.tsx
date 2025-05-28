
import React, { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BasicInformationFormProps {
  categories: {
    id: string;
    name: string;
    icon?: string;
  }[];
}

const BasicInformationForm: React.FC<BasicInformationFormProps> = ({ categories: propCategories }) => {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    console.log('Fetching categories from database...');
    setLoading(true);
    setError(null);
    
    try {
      // First, try to use prop categories if available
      if (propCategories && propCategories.length > 0) {
        console.log('Using prop categories:', propCategories);
        setCategories(propCategories);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('categories')
        .select('id, name, icon')
        .eq('is_active', true)
        .order('sort_order', { ascending: true })
        .order('name', { ascending: true });

      console.log('Categories query result:', { data, error });

      if (error) {
        console.error('Supabase error:', error);
        // Provide fallback categories if database fails
        const fallbackCategories = [
          { id: 'electronics', name: 'Electronics', icon: '📱' },
          { id: 'cameras', name: 'Cameras & Photography', icon: '📷' },
          { id: 'tools', name: 'Tools & Equipment', icon: '🔧' },
          { id: 'sports', name: 'Sports & Recreation', icon: '⚽' },
          { id: 'vehicles', name: 'Vehicles', icon: '🚗' },
          { id: 'home', name: 'Home & Garden', icon: '🏠' },
          { id: 'fashion', name: 'Fashion & Accessories', icon: '👗' },
          { id: 'books', name: 'Books & Media', icon: '📚' },
          { id: 'musical', name: 'Musical Instruments', icon: '🎸' },
          { id: 'other', name: 'Other', icon: '📦' }
        ];
        setCategories(fallbackCategories);
        setError('Using default categories (database connection failed)');
        return;
      }

      if (data && data.length > 0) {
        console.log('Successfully loaded categories:', data);
        setCategories(data);
      } else {
        console.log('No categories found in database, using fallback');
        const fallbackCategories = [
          { id: 'electronics', name: 'Electronics', icon: '📱' },
          { id: 'cameras', name: 'Cameras & Photography', icon: '📷' },
          { id: 'tools', name: 'Tools & Equipment', icon: '🔧' },
          { id: 'sports', name: 'Sports & Recreation', icon: '⚽' },
          { id: 'vehicles', name: 'Vehicles', icon: '🚗' },
          { id: 'home', name: 'Home & Garden', icon: '🏠' },
          { id: 'fashion', name: 'Fashion & Accessories', icon: '👗' },
          { id: 'books', name: 'Books & Media', icon: '📚' },
          { id: 'musical', name: 'Musical Instruments', icon: '🎸' },
          { id: 'other', name: 'Other', icon: '📦' }
        ];
        setCategories(fallbackCategories);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      // Provide fallback categories on any error
      const fallbackCategories = [
        { id: 'electronics', name: 'Electronics', icon: '📱' },
        { id: 'cameras', name: 'Cameras & Photography', icon: '📷' },
        { id: 'tools', name: 'Tools & Equipment', icon: '🔧' },
        { id: 'sports', name: 'Sports & Recreation', icon: '⚽' },
        { id: 'vehicles', name: 'Vehicles', icon: '🚗' },
        { id: 'home', name: 'Home & Garden', icon: '🏠' },
        { id: 'fashion', name: 'Fashion & Accessories', icon: '👗' },
        { id: 'books', name: 'Books & Media', icon: '📚' },
        { id: 'musical', name: 'Musical Instruments', icon: '🎸' },
        { id: 'other', name: 'Other', icon: '📦' }
      ];
      setCategories(fallbackCategories);
      setError('Using default categories (connection error)');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Basic Information</h3>
      
      <div>
        <Label htmlFor="title">Item Title *</Label>
        <Input
          id="title"
          name="title"
          placeholder="e.g., Professional DSLR Camera"
          required
        />
      </div>

      <div>
        <Label htmlFor="description">Description *</Label>
        <Textarea
          id="description"
          name="description"
          placeholder="Describe your item, its condition, and any special features..."
          rows={4}
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="category">Category *</Label>
          <Select name="category" required>
            <SelectTrigger id="category">
              <SelectValue placeholder={
                loading ? "Loading categories..." : 
                categories.length === 0 ? "No categories available" :
                "Select category"
              } />
            </SelectTrigger>
            <SelectContent className="max-h-[300px] overflow-y-auto">
              {loading ? (
                <SelectItem value="loading" disabled>
                  Loading categories...
                </SelectItem>
              ) : categories.length === 0 ? (
                <SelectItem value="no-categories" disabled>
                  No categories available
                </SelectItem>
              ) : (
                categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    <div className="flex items-center gap-2">
                      {category.icon && <span className="text-lg">{category.icon}</span>}
                      <span>{category.name}</span>
                    </div>
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
          {error && (
            <div className="flex items-center gap-2 mt-1">
              <p className="text-sm text-orange-600">{error}</p>
              <Button 
                type="button"
                variant="ghost"
                size="sm"
                onClick={fetchCategories}
                className="h-6 w-6 p-0"
              >
                <RefreshCw className="h-3 w-3" />
              </Button>
            </div>
          )}
        </div>

        <div>
          <Label htmlFor="condition">Condition *</Label>
          <Select name="condition" required>
            <SelectTrigger id="condition">
              <SelectValue placeholder="Item condition" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="new">New</SelectItem>
              <SelectItem value="excellent">Excellent</SelectItem>
              <SelectItem value="good">Good</SelectItem>
              <SelectItem value="fair">Fair</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default BasicInformationForm;
