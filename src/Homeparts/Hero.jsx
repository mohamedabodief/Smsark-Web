import { useState, useEffect } from 'react';
import { Box, IconButton } from '@mui/material';
import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';
import HomepageAdvertisement from '../FireBase/modelsWithOperations/HomepageAdvertisement';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';

export default function SimpleHeroSlider() {
  const [ads, setAds] = useState([]);
  const [index, setIndex] = useState(0);

  // Subscribe to active ads
  useEffect(() => {
    const unsubscribe = HomepageAdvertisement.subscribeActiveAds(async (data) => {
      const storage = getStorage();

      const adsWithUrls = await Promise.all(
        data.map(async (ad) => {
          if (ad.image && ad.image.startsWith('gs://')) {
            try {
              // ✅ عدلنا هنا
              const path = ad.image.replace('gs://smsark-alaqary.appspot.com/', '');
              const storageRef = ref(storage, path);
              const url = await getDownloadURL(storageRef);
              return { ...ad, image: url };
            } catch (err) {
              console.error('Error fetching image URL:', err);
              return { ...ad, image: '/no-image.svg' };
            }
          }
          return ad;
        })
      );

      setAds(adsWithUrls);
      setIndex(0); // Reset index if ads change
    });

    return () => unsubscribe();
  }, []);

  // Auto-advance slider
  useEffect(() => {
    if (ads.length === 0) return;
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % ads.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [ads.length]);

  // Navigation functions
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
