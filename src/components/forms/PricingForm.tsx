
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const PricingForm: React.FC = () => {
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
          />
        </div>

        <div>
          <Label htmlFor="period">Rental Period *</Label>
          <Select name="period" required>
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
        />
      </div>
    </div>
  );
};

export default PricingForm;
