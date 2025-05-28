// Updated PricingForm.tsx
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface PricingFormProps {
  formData: Record<string, any>;
  setFormData: (data: Record<string, any>) => void;
}

const PricingForm: React.FC<PricingFormProps> = ({ formData, setFormData }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Pricing & Availability</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="price">Rental Price (KES) *</Label>
          <Input
            id="price"
            name="price"
            type="number"
            placeholder="500"
            min="1"
            required
            value={formData.price || ''}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
          />
        </div>

        <div>
          <Label htmlFor="period">Rental Period *</Label>
          <Select
            name="period"
            required
            value={formData.period || ''}
            onValueChange={(value) => setFormData({ ...formData, period: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Per..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="hour">Per Hour</SelectItem>
              <SelectItem value="day">Per Day</SelectItem>
              <SelectItem value="week">Per Week</SelectItem>
              <SelectItem value="month">Per Month</SelectItem>
            </SelectContent>
          </Select>
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
