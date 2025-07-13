import React, { useState, useEffect } from 'react';
import useReverseGeocoding from './useReverseGeocoding'
import MapDisplay from './MapDisplay'
import { Box } from '@mui/material';
export default function MapPicker({ lat, lng, onAddressChange }) {
  const [location, setLocation] = useState(null);
  const address = useReverseGeocoding(location);

  useEffect(() => {
    if (lat && lng) {
      setLocation({ lat, lng });
    } else {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocation({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
        },
        (err) => {
          console.warn('Fallback location:', err);
          setLocation({ lat: 30.0444, lng: 31.2357 });
        }
      );
    }
  }, [lat, lng]);

  useEffect(() => {
    if (address && onAddressChange) {
      onAddressChange({ ...address, ...location });
    }
  }, [address, location]);

  return (
    <Box sx={{ width: '100%', height: '100%' }}>
      {location ? (
        <MapDisplay location={location} setLocation={setLocation} />
      ) : (
        <p>جارٍ تحديد موقعك...</p>
      )}
    </Box>
  );
}

