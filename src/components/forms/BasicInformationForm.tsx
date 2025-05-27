
import React, { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';

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

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('Fetching categories from database...');
      const { data, error } = await supabase
        .from('categories')
        .select('id, name, icon')
        .eq('is_active', true)
        .order('sort_order', { ascending: true })
        .order('name', { ascending: true });

      if (error) {
        console.error('Error fetching categories:', error);
        setError('Failed to load categories');
        return;
      }

      console.log('Fetched categories:', data);
      if (data && data.length > 0) {
        setCategories(data);
      } else {
        console.log('No categories found in database');
        // If no categories in database, use the prop categories as fallback
        if (propCategories && propCategories.length > 0) {
          setCategories(propCategories);
        } else {
          setError('No categories available');
        }
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      setError('Failed to load categories');
      // Use prop categories as fallback on error
      if (propCategories && propCategories.length > 0) {
        setCategories(propCategories);
        setError(null);
      }
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
                error ? "Error loading categories" :
                categories.length === 0 ? "No categories available" :
                "Select category"
              } />
            </SelectTrigger>
            <SelectContent className="bg-white border border-gray-200 shadow-lg z-50 max-h-[300px] overflow-y-auto">
              {loading ? (
                <SelectItem value="loading" disabled>
                  Loading categories...
                </SelectItem>
              ) : error ? (
                <SelectItem value="error" disabled>
                  {error}
                </SelectItem>
              ) : categories.length === 0 ? (
                <SelectItem value="no-categories" disabled>
                  No categories available
                </SelectItem>
              ) : (
                categories.map((category) => (
                  <SelectItem key={category.id} value={category.id} className="cursor-pointer hover:bg-gray-100 flex items-center">
                    <div className="flex items-center gap-2 w-full">
                      {category.icon && <span className="text-lg">{category.icon}</span>}
                      <span className="flex-1">{category.name}</span>
                    </div>
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
          {!loading && !error && categories.length > 0 && (
            <p className="text-xs text-gray-500 mt-1">
              {categories.length} categories available
            </p>
          )}
          {error && (
            <p className="text-xs text-red-500 mt-1">
              {error}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="condition">Condition *</Label>
          <Select name="condition" required>
            <SelectTrigger id="condition">
              <SelectValue placeholder="Item condition" />
            </SelectTrigger>
            <SelectContent className="bg-white border border-gray-200 shadow-lg z-50">
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
