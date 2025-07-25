import {
  Box, Typography, Card, CardMedia, CardContent, IconButton, Tooltip
} from '@mui/material';
import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';
import FavoriteButton from './FavoriteButton';
import { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RealEstateDeveloperAdvertisement from '../FireBase/modelsWithOperations/RealEstateDeveloperAdvertisement';
import { devAdsData } from '../FireBase/models/Users/devAdsData';

export default function BestDev() {
  const sliderRef = useRef();
  const navigate = useNavigate();
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const addUniqueAds = async () => {
      try {
        console.log('Fetching existing developer ads...');
        const existingAds = await RealEstateDeveloperAdvertisement.getAll();
        console.log('Existing ads:', existingAds);

        for (const adData of devAdsData) {
          const alreadyExists = existingAds.some(
            (ad) => ad.title === adData.title && ad.developer_name === adData.developer_name
          );

          if (!alreadyExists) {
            console.log('Adding new ad:', adData);
            const ad = new RealEstateDeveloperAdvertisement(adData);
            await ad.save();
            console.log('Successfully saved ad:', adData.title);
          } else {
            console.log('Ad already exists, skipping:', adData.title);
          }
        }
      } catch (error) {
        console.error('Failed to add unique ads:', error);
        setLoading(false);
      }
    };

    addUniqueAds();

    console.log('Subscribing to active developer ads...');
    const unsubscribe = RealEstateDeveloperAdvertisement.subscribeActiveAds((ads) => {
      console.log('Received active ads:', ads);
      // Explicitly filter ads to ensure ads: true
      const activeAds = ads.filter(ad => ad.ads === true);
      console.log('Filtered active ads (ads: true):', activeAds);
      setOffers(activeAds);
      setLoading(false);
    });

    const interval = setInterval(() => {
      const cardWidth = 344;
      if (sliderRef.current) {
        console.log('Auto-scrolling slider...');
        sliderRef.current.scrollBy({
          left: -cardWidth,
          behavior: 'smooth',
        });
      }
    }, 5000);

    return () => {
      console.log('Unsubscribing from active ads and clearing interval...');
      unsubscribe();
      clearInterval(interval);
    };
  }, []);

  const scroll = (direction) => {
    const cardWidth = 344;
    if (sliderRef.current) {
      console.log(`Scrolling ${direction}...`);
      sliderRef.current.scrollBy({
        left: direction === 'left' ? -cardWidth : cardWidth,
        behavior: 'smooth',
      });
    }
  };

  return (
    <Box sx={{ direction: 'rtl', paddingTop: 8, px: 5 }}>
      <Typography variant="h4" fontWeight="bold" textAlign="center" mb={4}>
        أفضل عروض التطوير العقاري
      </Typography>

      <Box sx={{ position: 'relative' }}>
        <IconButton onClick={() => scroll('left')} sx={{ position: 'absolute', top: '50%', left: -10, transform: 'translateY(-50%)', zIndex: 1, backgroundColor: 'white', boxShadow: 2 }}>
          <ArrowBackIos sx={{ color: 'grey' }} />
        </IconButton>

        <IconButton onClick={() => scroll('right')} sx={{ position: 'absolute', top: '50%', right: -10, transform: 'translateY(-50%)', zIndex: 1, backgroundColor: 'white', boxShadow: 2 }}>
          <ArrowForwardIos sx={{ color: 'grey' }} />
        </IconButton>

        <Box ref={sliderRef} sx={{
          display: 'flex', justifyContent: 'center', overflowX: 'auto', gap: 3, scrollSnapType: 'x mandatory', scrollPaddingRight: '60px', pb: 2,
          pl: 5,
          '&::-webkit-scrollbar': { display: 'none' }
        }}>
          {loading ? (
            <Typography>...جاري تحميل العروض</Typography>
          ) : offers.length === 0 ? (
            <Typography>لا توجد عروض تطوير مفعلة حالياً.</Typography>
          ) : (
            offers.map((item, index) => (
              <Box
                key={index}
                onClick={() => {
                  console.log('Navigating to ad details:', item.id);
                  navigate(`/details/developmentAds/${item.id}`);
                }}
                sx={{ cursor: 'pointer' }}
              >
                <Card sx={{ minWidth: { xs: 260, sm: 300, md: 320 }, scrollSnapAlign: 'start', flexShrink: 0, borderRadius: 3, position: 'relative', height: '100%' }}>
                  <CardMedia component="img" height="160" image={item.images?.[0] || '/default-placeholder.png'} />
                  <FavoriteButton advertisementId={item.id} type="developer" />
                  <CardContent>
                    <Typography color="primary" fontWeight="bold">
                      {item.price_start_from?.toLocaleString()} - {item.price_end_to?.toLocaleString()} ج.م
                    </Typography>
                    <Typography variant="subtitle1">{item.developer_name}</Typography>
                    {/* <Typography variant="body2" color="text.secondary">{item.location}</Typography> */}
                    <Typography variant="body2" color="text.secondary">
    {typeof item.location === 'object'
      ? `${item.location.governorate || ''} - ${item.location.city || ''}`
      : item.location}
  </Typography>
                    <Typography variant="body2" mt={1}>{item.description}</Typography>
                  </CardContent>
                </Card>
              </Box>
            ))
          )}
        </Box>
      </Box>
    </Box>
  );
}