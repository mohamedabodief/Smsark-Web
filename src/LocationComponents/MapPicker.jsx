import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import MapDisplay from './MapDisplay';
import useReverseGeocoding from './useReverseGeocoding';

export default function MapPicker({ onAddressChange }) {
  const [location, setLocation] = useState(null);
  const address = useReverseGeocoding(location);
  // أول مرة: تحديد الموقع تلقائيًا
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      (err) => {
        console.warn('فشل تحديد الموقع، استخدام موقع افتراضي:', err);
        setLocation({ lat: 30.0444, lng: 31.2357 }); // القاهرة
      }
    );
  }, []);

  // إرسال البيانات للخارج لو فيه onAddressChange
  useEffect(() => {
    if (address && onAddressChange) {
      onAddressChange({ ...address, ...location });
    }
  }, [address, location]);

  return (
    <Box sx={{ width: '100%', height: '100%' }}>
      {location ? (
        <>
          <MapDisplay location={location} setLocation={setLocation} />
        </>
      ) : (
        <p>جارٍ تحديد موقعك...</p>
      )}
    </Box>
  );
}
