import { useState, useEffect } from 'react';
import { Box, IconButton } from '@mui/material';
import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';
import HomepageAdvertisement from '../FireBase/modelsWithOperations/HomepageAdvertisement';

export default function SimpleHeroSlider() {
  const [ads, setAds] = useState([]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const unsubscribe = HomepageAdvertisement.subscribeActiveAds(async (data) => {
      setAds(data);
    });

    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % ads.length);
    }, 5000);

    return () => {
      unsubscribe();
      clearInterval(interval);
    };
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
        // maxWidth: '100%',
        // maxHeight: '30%',
        overflow: 'hidden',
        direction: 'rtl',
        margin: 0,
        padding: 0,
      }}
    >
      {ads[index]?.image && (
        <Box
          component="img"
          src={ads[index].image}
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
      >
        <ArrowForwardIos />
      </IconButton>
    </Box>
  );
}
