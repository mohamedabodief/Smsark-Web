import { useEffect, useState } from 'react';

export default function useReverseGeocoding(location) {
  const [address, setAddress] = useState({
    city: '',
    governorate: '',
    road: '',
    full: '',
  });

  useEffect(() => {
    if (!location || !location.lat || !location.lng) {
      console.log('[DEBUG] لا توجد إحداثيات صالحة:', location);
      return;
    }
    const { lat, lng } = location;
    console.log('[DEBUG] جلب العنوان للإحداثيات:', { lat, lng });
    fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`, {
      headers: {
        'User-Agent': 'YourAppName/1.0 (your.email@example.com)', // استبدلي باسم التطبيق وبريدك
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log('[DEBUG] استجابة Nominatim:', data);
        const addr = data.address || {};
        const city =
          addr.city || addr.town || addr.village || addr.hamlet || 'غير معروف';
        const governorate =
          addr.state || addr.county || addr.region || 'غير معروفة';
        const road = addr.road || addr.neighbourhood || addr.suburb || 'شارع غير معروف';

        setAddress({
          city,
          governorate,
          road,
          full: `المحافظة: ${governorate} - المدينة: ${city} - الشارع: ${road}`,
        });
      })
      .catch((err) => {
        console.error('فشل جلب العنوان:', err);
        setAddress({
          city: '',
          governorate: '',
          road: '',
          full: 'فشل تحديد العنوان',
        });
      });
  }, [location]);

  return address;
}
