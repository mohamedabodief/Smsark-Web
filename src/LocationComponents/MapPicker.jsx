import React, { useState, useEffect, useRef } from 'react';
import MapDisplay from './MapDisplay';
import { Box } from '@mui/material';

export default function MapPicker({ lat, lng, onLocationSelect }) {
  const [location, setLocation] = useState(null);
  const prevLocation = useRef(null);

  useEffect(() => {
    console.log('[DEBUG] MapPicker props:', { lat, lng, onLocationSelect });
    if (lat && lng) {
      console.log('[DEBUG] تعيين الإحداثيات من الـ props:', { lat, lng });
      setLocation({ lat, lng });
    } else {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const newLocation = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          };
          console.log('[DEBUG] موقع المستخدم من geolocation:', newLocation);
          setLocation(newLocation);
        },
        (err) => {
          console.warn('[DEBUG] Fallback location:', err);
          const fallbackLocation = { lat: 30.0444, lng: 31.2357 };
          setLocation(fallbackLocation);
        }
      );
    }
  }, [lat, lng]);

  useEffect(() => {
    if (
      location &&
      (!prevLocation.current ||
        prevLocation.current.lat !== location.lat ||
        prevLocation.current.lng !== location.lng)
    ) {
      console.log('[DEBUG] تمرير الإحداثيات إلى onLocationSelect:', location);
      if (typeof onLocationSelect === 'function') {
        onLocationSelect(location);
      } else {
        console.error('[DEBUG] onLocationSelect ليست دالة:', onLocationSelect);
      }
      prevLocation.current = location;
    }
  }, [location, onLocationSelect]);

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