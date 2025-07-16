import {
  Box, Typography, Card, CardMedia, CardContent, IconButton, Tooltip
} from '@mui/material';
import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';
import FavoriteIcon from '@mui/icons-material/Favorite';
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
      const existingAds = await RealEstateDeveloperAdvertisement.getAll();

      devAdsData.forEach(async (adData) => {
        const alreadyExists = existingAds.some(
          (ad) => ad.title === adData.title && ad.developer_name === adData.developer_name
        );

        if (!alreadyExists) {
          const ad = new RealEstateDeveloperAdvertisement(adData);
          await ad.save();
        }
      });
    };

    addUniqueAds();

    const unsubscribe = RealEstateDeveloperAdvertisement.subscribeActiveAds((ads) => {
      setOffers(ads);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);


  const scroll = (direction) => {
    const cardWidth = 344;
    if (sliderRef.current) {
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
                onClick={() => navigate(`/details/developmentAds/${item.id}`)}
                sx={{ cursor: 'pointer' }}
              >
                <Card sx={{ minWidth: { xs: 260, sm: 300, md: 320 }, scrollSnapAlign: 'start', flexShrink: 0, borderRadius: 3, position: 'relative' }}>
                  <CardMedia component="img" height="160" image={item.image || '/default-placeholder.png'} />
                  <Tooltip title="قائمة المفضل">
                    <IconButton size="small" onClick={() => navigate('/favorite')} sx={{ position: 'absolute', top: 10, left: 10, backgroundColor: '#fff', '&:hover': { backgroundColor: '#f0f0f0' } }}>
                      <FavoriteIcon color="error" />
                    </IconButton>
                  </Tooltip>
                  <CardContent>
                    <Typography color="primary" fontWeight="bold">
                      {item.price_start_from?.toLocaleString()} - {item.price_end_to?.toLocaleString()} ج.م
                    </Typography>
                    <Typography variant="subtitle1">{item.developer_name}</Typography>
                    <Typography variant="body2" color="text.secondary">{item.location}</Typography>
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
