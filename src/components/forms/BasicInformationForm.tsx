// Updated BasicInformationForm.tsx
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
  formData: Record<string, any>;
  setFormData: (data: Record<string, any>) => void;
}

const BasicInformationForm: React.FC<BasicInformationFormProps> = ({ categories: propCategories, formData, setFormData }) => {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      if (propCategories && propCategories.length > 0) {
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

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      setError('Using default categories (connection error)');
      setCategories([
        { id: 'electronics', name: 'Electronics', icon: '📱' },
        { id: 'tools', name: 'Tools & Equipment', icon: '🔧' },
        { id: 'books', name: 'Books & Media', icon: '📚' },
        { id: 'other', name: 'Other', icon: '📦' },
      ]);
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
          value={formData.title || ''}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
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
          value={formData.description || ''}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="category">Category *</Label>
          <Select
            name="category"
            required
            value={formData.category || ''}
            onValueChange={(value) => setFormData({ ...formData, category: value })}
          >
            <SelectTrigger id="category">
              <SelectValue placeholder={loading ? 'Loading categories...' : 'Select category'} />
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
          <Select
            name="condition"
            required
            value={formData.condition || ''}
            onValueChange={(value) => setFormData({ ...formData, condition: value })}
          >
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
