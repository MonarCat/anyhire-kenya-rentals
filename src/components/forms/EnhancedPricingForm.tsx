
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertCircle } from 'lucide-react';

interface EnhancedPricingFormProps {
  formData: Record<string, any>;
  setFormData: (data: Record<string, any>) => void;
  errors?: Record<string, string>;
}

const EnhancedPricingForm: React.FC<EnhancedPricingFormProps> = ({ 
  formData, 
  setFormData,
  errors = {}
}) => {
  const formatPrice = (value: string) => {
    const numericValue = value.replace(/[^\d]/g, '');
    return numericValue ? `KES ${Number(numericValue).toLocaleString()}` : '';
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^\d]/g, '');
    setFormData({ ...formData, price: value });
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Pricing & Availability</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="price" className="flex items-center">
            Rental Price <span className="text-red-500 ml-1">*</span>
          </Label>
          <div className="relative">
            <Input
              id="price"
              name="price"
              type="text"
              placeholder="0"
              required
              value={formData.price || ''}
              onChange={handlePriceChange}
              className={`${errors.price ? 'border-red-500' : ''} pl-12`}
            />
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
              KES
            </div>
          </div>
          {errors.price && (
            <div className="flex items-center mt-1 text-red-500 text-sm">
              <AlertCircle className="w-4 h-4 mr-1" />
              {errors.price}
            </div>
          )}
          {formData.price && (
            <div className="text-xs text-gray-500 mt-1">
              Display: {formatPrice(formData.price)}
            </div>
          )}
        </div>

        <div>
          <Label htmlFor="period" className="flex items-center">
            Rental Period <span className="text-red-500 ml-1">*</span>
          </Label>
          <Select
            name="period"
            required
            value={formData.period || ''}
            onValueChange={(value) => setFormData({ ...formData, period: value })}
          >
            <SelectTrigger className={errors.period ? 'border-red-500' : ''}>
              <SelectValue placeholder="Per..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="hour">Per Hour</SelectItem>
              <SelectItem value="day">Per Day</SelectItem>
              <SelectItem value="week">Per Week</SelectItem>
              <SelectItem value="month">Per Month</SelectItem>
            </SelectContent>
          </Select>
          {errors.period && (
            <div className="flex items-center mt-1 text-red-500 text-sm">
              <AlertCircle className="w-4 h-4 mr-1" />
              {errors.period}
            </div>
          )}
        </div>
      </div>

      <div>
        <Label htmlFor="minRental">Minimum Rental Period</Label>
        <Input
          id="minRental"
          name="minRental"
          placeholder="e.g., 4 hours, 1 day"
          value={formData.minRental || ''}
          onChange={(e) => setFormData({ ...formData, minRental: e.target.value })}
        />
        <div className="text-xs text-gray-500 mt-1">
          Optional: Set minimum rental duration
        </div>
      </div>

      {formData.price && formData.period && (
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-medium text-blue-900">Pricing Summary</h4>
          <p className="text-blue-700">
            Your item will be listed at {formatPrice(formData.price)} per {formData.period}
          </p>
          {formData.minRental && (
            <p className="text-blue-600 text-sm">
              Minimum rental: {formData.minRental}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default EnhancedPricingForm;
