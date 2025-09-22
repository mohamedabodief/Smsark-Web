import { useState, useEffect } from 'react';
import { Box, IconButton } from '@mui/material';
import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';
import HomepageAdvertisement from '../FireBase/modelsWithOperations/HomepageAdvertisement';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';

// ✅ دالة لتصحيح اللينك
function fixStorageUrl(url) {
  if (!url) return '/no-image.svg';

  // لو اللينك قديم فيه firebasestorage.app
  if (url.includes('firebasestorage.app')) {
    return url.replace('firebasestorage.app', 'appspot.com');
  }

  return url;
}

export default function SimpleHeroSlider() {
  const [ads, setAds] = useState([]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const unsubscribe = HomepageAdvertisement.subscribeActiveAds(async (data) => {
      const storage = getStorage();

      const adsWithUrls = await Promise.all(
        data.map(async (ad) => {
          if (ad.image) {
            // ✅ تصحيح اللينك قبل أي حاجة
            let fixedUrl = fixStorageUrl(ad.image);

            // لو gs:// → رجّع URL صحيح
            if (fixedUrl.startsWith('gs://')) {
              try {
                const path = fixedUrl.replace('gs://smsark-alaqary.appspot.com/', '');
                const storageRef = ref(storage, path);
                const url = await getDownloadURL(storageRef);
                return { ...ad, image: url };
              } catch (err) {
                console.error('Error fetching image URL:', err);
                return { ...ad, image: '/no-image.svg' };
              }
            }

            // لو لينك https:// بعد التصحيح
            if (fixedUrl.startsWith('http')) {
              return { ...ad, image: fixedUrl };
            }
          }

          return { ...ad, image: '/no-image.svg' };
        })
      );

      setAds(adsWithUrls);
      setIndex(0);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (ads.length === 0) return;
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % ads.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [ads.length]);

  const nextSlide = () => {
    setIndex((prev) => (prev + 1) % ads.length);
  };

  const prevSlide = () => {
    setIndex((prev) => (prev - 1 + ads.length) % ads.length);
  };

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        height: '30%',
        overflow: 'hidden',
        direction: 'rtl',
        margin: 0,
        padding: 0,
      }}
    >
      {ads.length > 0 && ads[index] && (
        <Box
          component="img"
          src={ads[index]?.image || '/no-image.svg'}
          alt="slider image"
          sx={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
      )}

      <IconButton
        onClick={nextSlide}
        sx={{
          position: 'absolute',
          top: '50%',
          left: 16,
          transform: 'translateY(-50%)',
          color: 'white',
          backgroundColor: 'rgba(0,0,0,0.4)',
          '&:hover': { backgroundColor: 'rgba(0,0,0,0.6)' },
        }}
        disabled={ads.length === 0}
      >
        <ArrowBackIos />
      </IconButton>

      <IconButton
        onClick={prevSlide}
        sx={{
          position: 'absolute',
          top: '50%',
          right: 16,
          transform: 'translateY(-50%)',
          color: 'white',
          backgroundColor: 'rgba(0,0,0,0.4)',
          '&:hover': { backgroundColor: 'rgba(0,0,0,0.6)' },
        }}
        disabled={ads.length === 0}
      >
        <ArrowForwardIos />
      </IconButton>
    </Box>
  );
}
