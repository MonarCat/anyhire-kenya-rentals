
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import LocationSelector from '@/components/LocationSelector';

interface LocationFormProps {
  onLocationChange: (locationId: string, locationPath: string) => void;
}

const LocationForm: React.FC<LocationFormProps> = ({ onLocationChange }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Location</h3>
      <LocationSelector
        onChange={onLocationChange}
        required={false}
      />

      <div>
        <Label htmlFor="address">Specific Address (Optional)</Label>
        <Input
          id="address"
          name="address"
          placeholder="Street address or landmark"
        />
      </div>
    </div>
  );
};

export default LocationForm;
