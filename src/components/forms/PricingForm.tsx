
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertCircle } from 'lucide-react';

interface PricingFormProps {
  formData: Record<string, any>;
  setFormData: (data: Record<string, any>) => void;
  errors?: Record<string, string>;
}

const PricingForm: React.FC<PricingFormProps> = ({ formData, setFormData, errors = {} }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Pricing & Availability</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="price" className="flex items-center">
            Rental Price (KES) <span className="text-red-500 ml-1">*</span>
          </Label>
          <Input
            id="price"
            name="price"
            type="number"
            placeholder="500"
            min="1"
            required
            value={formData.price || ''}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            className={errors.price ? 'border-red-500' : ''}
          />
          {errors.price && (
            <div className="flex items-center mt-1 text-red-500 text-sm">
              <AlertCircle className="w-4 h-4 mr-1" />
              {errors.price}
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
      </div>
    </div>
  );
};

export default PricingForm;
