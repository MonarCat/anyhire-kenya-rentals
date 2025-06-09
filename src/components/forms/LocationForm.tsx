
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import LocationSelector from '@/components/LocationSelector';

interface LocationFormProps {
  onLocationChange: (locationId: string, locationPath: string) => void;
  formData?: Record<string, any>;
  setFormData?: (data: Record<string, any>) => void;
}

const LocationForm: React.FC<LocationFormProps> = ({ 
  onLocationChange, 
  formData, 
  setFormData 
}) => {
  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (setFormData && formData) {
      setFormData({
        ...formData,
        address: e.target.value
      });
    }
  };

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
          value={formData?.address || ''}
          onChange={handleAddressChange}
          placeholder="Street address or landmark"
        />
      </div>
    </div>
  );
};

export default LocationForm;
