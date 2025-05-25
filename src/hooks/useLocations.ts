
import { useState, useEffect } from 'react';

interface Location {
  id: string;
  name: string;
  type: 'county' | 'sub_county' | 'ward';
  parent_id?: string;
  code?: string;
}

// Hardcoded location data for Kenya
const hardcodedCounties: Location[] = [
  { id: '1', name: 'Nairobi', type: 'county', code: '47' },
  { id: '2', name: 'Mombasa', type: 'county', code: '01' },
  { id: '3', name: 'Kisumu', type: 'county', code: '42' },
  { id: '4', name: 'Nakuru', type: 'county', code: '32' },
  { id: '5', name: 'Kiambu', type: 'county', code: '22' }
];

const hardcodedSubCounties: { [key: string]: Location[] } = {
  '1': [
    { id: '101', name: 'Westlands', type: 'sub_county', parent_id: '1' },
    { id: '102', name: 'Dagoretti North', type: 'sub_county', parent_id: '1' },
    { id: '103', name: 'Lang\'ata', type: 'sub_county', parent_id: '1' },
    { id: '104', name: 'Kasarani', type: 'sub_county', parent_id: '1' },
    { id: '105', name: 'Embakasi South', type: 'sub_county', parent_id: '1' }
  ],
  '2': [
    { id: '201', name: 'Mvita', type: 'sub_county', parent_id: '2' },
    { id: '202', name: 'Changamwe', type: 'sub_county', parent_id: '2' },
    { id: '203', name: 'Jomba', type: 'sub_county', parent_id: '2' }
  ]
};

const hardcodedWards: { [key: string]: Location[] } = {
  '101': [
    { id: '1001', name: 'Kitisuru', type: 'ward', parent_id: '101' },
    { id: '1002', name: 'Parklands/Highridge', type: 'ward', parent_id: '101' },
    { id: '1003', name: 'Karura', type: 'ward', parent_id: '101' },
    { id: '1004', name: 'Kangemi', type: 'ward', parent_id: '101' },
    { id: '1005', name: 'Mountain View', type: 'ward', parent_id: '101' }
  ],
  '102': [
    { id: '1006', name: 'Mutu-ini', type: 'ward', parent_id: '102' },
    { id: '1007', name: 'Ngando', type: 'ward', parent_id: '102' },
    { id: '1008', name: 'Riruta', type: 'ward', parent_id: '102' }
  ]
};

export const useLocations = () => {
  const [counties, setCounties] = useState<Location[]>([]);
  const [subCounties, setSubCounties] = useState<Location[]>([]);
  const [wards, setWards] = useState<Location[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCounties();
  }, []);

  const fetchCounties = async () => {
    setLoading(true);
    // Use hardcoded data
    setCounties(hardcodedCounties);
    setLoading(false);
  };

  const fetchSubCounties = async (countyId: string) => {
    setLoading(true);
    const subCountiesForCounty = hardcodedSubCounties[countyId] || [];
    setSubCounties(subCountiesForCounty);
    setLoading(false);
  };

  const fetchWards = async (subCountyId: string) => {
    setLoading(true);
    const wardsForSubCounty = hardcodedWards[subCountyId] || [];
    setWards(wardsForSubCounty);
    setLoading(false);
  };

  const getLocationPath = async (locationId: string): Promise<string> => {
    // Build path from hardcoded data
    const allLocations = [
      ...hardcodedCounties,
      ...Object.values(hardcodedSubCounties).flat(),
      ...Object.values(hardcodedWards).flat()
    ];

    const location = allLocations.find(loc => loc.id === locationId);
    if (!location) return '';

    let path = location.name;
    let currentLocation = location;

    while (currentLocation.parent_id) {
      const parent = allLocations.find(loc => loc.id === currentLocation.parent_id);
      if (parent) {
        path = `${parent.name}, ${path}`;
        currentLocation = parent;
      } else {
        break;
      }
    }

    return path;
  };

  return {
    counties,
    subCounties,
    wards,
    loading,
    fetchSubCounties,
    fetchWards,
    getLocationPath
  };
};
