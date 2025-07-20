import { useState, useEffect } from 'react';
import { Box, IconButton } from '@mui/material';
import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';
import HomepageAdvertisement from '../FireBase/modelsWithOperations/HomepageAdvertisement';

export default function SimpleHeroSlider() {
  const [ads, setAds] = useState([]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const unsubscribe = HomepageAdvertisement.subscribeActiveAds(async (data) => {
      // const extraImage = {
      //   image: 'https://www.google.com/url?sa=i&url=https%3A%2F%2Felbayt.com%2Far%2Funit%2Fvilla-for-sale-in-karma-4-sheikh-zayed-2758&psig=AOvVaw0-5fwpyDl-kNt3yrj_wJV2&ust=1753054230055000&source=images&cd=vfe&opi=89978449&ved=0CBUQjRxqFwoTCIjaiIiKyo4DFQAAAAAdAAAAABAL',
      //   ads: true,
      //   id: 'manual-img', 
      // };

      // const updatedData = [...data, extraImage];
      // setAds(updatedData);
      setAds(data);
    });

    return () => unsubscribe();
  }, []);

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
      {ads.length > 0 && (
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
