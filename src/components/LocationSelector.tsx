
import React, { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useLocations } from '@/hooks/useLocations';

interface LocationSelectorProps {
  value?: string;
  onChange: (locationId: string, locationPath: string) => void;
  required?: boolean;
}

const LocationSelector: React.FC<LocationSelectorProps> = ({ value, onChange, required = false }) => {
  const { counties, subCounties, wards, loading, fetchSubCounties, fetchWards, getLocationPath } = useLocations();
  const [selectedCounty, setSelectedCounty] = useState('');
  const [selectedSubCounty, setSelectedSubCounty] = useState('');
  const [selectedWard, setSelectedWard] = useState('');

  useEffect(() => {
    if (value && counties.length > 0) {
      // If there's a value, try to find the location hierarchy
      loadLocationHierarchy(value);
    }
  }, [value, counties]);

  const loadLocationHierarchy = async (locationId: string) => {
    try {
      const path = await getLocationPath(locationId);
      console.log('Location path:', path);
    } catch (error) {
      console.error('Error loading location hierarchy:', error);
    }
  };

  const handleCountyChange = async (countyId: string) => {
    setSelectedCounty(countyId);
    setSelectedSubCounty('');
    setSelectedWard('');
    
    if (countyId) {
      await fetchSubCounties(countyId);
      const path = await getLocationPath(countyId);
      onChange(countyId, path);
    }
  };

  const handleSubCountyChange = async (subCountyId: string) => {
    setSelectedSubCounty(subCountyId);
    setSelectedWard('');
    
    if (subCountyId) {
      await fetchWards(subCountyId);
      const path = await getLocationPath(subCountyId);
      onChange(subCountyId, path);
    }
  };

  const handleWardChange = async (wardId: string) => {
    setSelectedWard(wardId);
    
    if (wardId) {
      const path = await getLocationPath(wardId);
      onChange(wardId, path);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="county">County *</Label>
        <Select value={selectedCounty} onValueChange={handleCountyChange} required={required}>
          <SelectTrigger>
            <SelectValue placeholder="Select county" />
          </SelectTrigger>
          <SelectContent>
            {counties.map((county) => (
              <SelectItem key={county.id} value={county.id}>
                {county.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedCounty && subCounties.length > 0 && (
        <div>
          <Label htmlFor="sub_county">Sub County</Label>
          <Select value={selectedSubCounty} onValueChange={handleSubCountyChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select sub county" />
            </SelectTrigger>
            <SelectContent>
              {subCounties.map((subCounty) => (
                <SelectItem key={subCounty.id} value={subCounty.id}>
                  {subCounty.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {selectedSubCounty && wards.length > 0 && (
        <div>
          <Label htmlFor="ward">Ward</Label>
          <Select value={selectedWard} onValueChange={handleWardChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select ward" />
            </SelectTrigger>
            <SelectContent>
              {wards.map((ward) => (
                <SelectItem key={ward.id} value={ward.id}>
                  {ward.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
};

export default LocationSelector;
