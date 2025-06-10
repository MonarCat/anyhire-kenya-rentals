
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

interface EnhancedBasicInformationFormProps {
  categories: {
    id: string;
    name: string;
    icon?: string;
  }[];
  formData: Record<string, any>;
  setFormData: (data: Record<string, any>) => void;
  errors?: Record<string, string>;
}

const EnhancedBasicInformationForm: React.FC<EnhancedBasicInformationFormProps> = ({ 
  categories, 
  formData, 
  setFormData,
  errors = {}
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Basic Information</h3>

      <div>
        <Label htmlFor="title" className="flex items-center">
          Item Title <span className="text-red-500 ml-1">*</span>
        </Label>
        <Input
          id="title"
          name="title"
          placeholder="e.g., Professional DSLR Camera"
          required
          value={formData.title || ''}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className={errors.title ? 'border-red-500' : ''}
        />
        {errors.title && (
          <div className="flex items-center mt-1 text-red-500 text-sm">
            <AlertCircle className="w-4 h-4 mr-1" />
            {errors.title}
          </div>
        )}
        <div className="text-xs text-gray-500 mt-1">
          {formData.title?.length || 0}/100 characters
        </div>
      </div>

      <div>
        <Label htmlFor="description" className="flex items-center">
          Description <span className="text-red-500 ml-1">*</span>
        </Label>
        <Textarea
          id="description"
          name="description"
          placeholder="Describe your item, its condition, and any special features..."
          rows={4}
          required
          value={formData.description || ''}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className={errors.description ? 'border-red-500' : ''}
        />
        {errors.description && (
          <div className="flex items-center mt-1 text-red-500 text-sm">
            <AlertCircle className="w-4 h-4 mr-1" />
            {errors.description}
          </div>
        )}
        <div className="text-xs text-gray-500 mt-1">
          {formData.description?.length || 0}/500 characters
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="category" className="flex items-center">
            Category <span className="text-red-500 ml-1">*</span>
          </Label>
          <Select
            name="category"
            required
            value={formData.category || ''}
            onValueChange={(value) => {
              console.log('Selected category ID:', value);
              console.log('Available categories:', categories);
              setFormData({ ...formData, category: value });
            }}
          >
            <SelectTrigger id="category" className={errors.category ? 'border-red-500' : ''}>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent className="max-h-[300px] overflow-y-auto">
              {categories.length === 0 ? (
                <SelectItem value="no-categories" disabled>
                  Loading categories...
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
          {errors.category && (
            <div className="flex items-center mt-1 text-red-500 text-sm">
              <AlertCircle className="w-4 h-4 mr-1" />
              {errors.category}
            </div>
          )}
        </div>

        <div>
          <Label htmlFor="condition" className="flex items-center">
            Condition <span className="text-red-500 ml-1">*</span>
          </Label>
          <Select
            name="condition"
            required
            value={formData.condition || ''}
            onValueChange={(value) => setFormData({ ...formData, condition: value })}
          >
            <SelectTrigger id="condition" className={errors.condition ? 'border-red-500' : ''}>
              <SelectValue placeholder="Item condition" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="new">New - Never used</SelectItem>
              <SelectItem value="excellent">Excellent - Like new</SelectItem>
              <SelectItem value="good">Good - Minor wear</SelectItem>
              <SelectItem value="fair">Fair - Shows wear</SelectItem>
            </SelectContent>
          </Select>
          {errors.condition && (
            <div className="flex items-center mt-1 text-red-500 text-sm">
              <AlertCircle className="w-4 h-4 mr-1" />
              {errors.condition}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EnhancedBasicInformationForm;
