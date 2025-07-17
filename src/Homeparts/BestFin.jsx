import {
  Box, Typography, Card, CardMedia, CardContent, IconButton, Tooltip
} from '@mui/material';
import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteButton from './FavoriteButton';
import { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FinancingAdvertisement from '../FireBase/modelsWithOperations/FinancingAdvertisement';
import { financingAdsData } from '../FireBase/models/Users/FinAdsData';

export default function BestFin() {
  const sliderRef = useRef();
  const navigate = useNavigate();
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const addUniqueAds = async () => {
      const existingAds = await FinancingAdvertisement.getAll(); // استرجاع البيانات الحالية

      financingAdsData.forEach(async (data) => {
        const alreadyExists = existingAds.some(
          (ad) => ad.title === data.title && ad.price === data.price
        );

        if (!alreadyExists) {
          const ad = new FinancingAdvertisement(data);
          await ad.save();
        }
      });
    };

    addUniqueAds();

    const unsubscribe = FinancingAdvertisement.subscribeActiveAds((ads) => {
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
        أفضل عروض التمويل
      </Typography>

      <Box sx={{ position: 'relative' }}>
        <IconButton onClick={() => scroll('left')} sx={{ position: 'absolute', top: '50%', left: -10, transform: 'translateY(-50%)', zIndex: 1, backgroundColor: 'white', boxShadow: 2 }}>
          <ArrowBackIos sx={{ color: 'grey' }} />
        </IconButton>

        <IconButton onClick={() => scroll('right')} sx={{ position: 'absolute', top: '50%', right: -10, transform: 'translateY(-50%)', zIndex: 1, backgroundColor: 'white', boxShadow: 2 }}>
          <ArrowForwardIos sx={{ color: 'grey' }} />
        </IconButton>

        <Box ref={sliderRef} sx={{ display: 'flex', justifyContent: 'center', overflowX: 'auto', gap: 3, scrollSnapType: 'x mandatory', scrollPaddingRight: '60px', pb: 2, pl: 5, '&::-webkit-scrollbar': { display: 'none' } }}>
          {loading ? (
            <Typography>...جاري تحميل العروض</Typography>
          ) : offers.length === 0 ? (
            <Typography>لا توجد عروض تمويل مفعلة حالياً.</Typography>
          ) : (
            offers.map((item, index) => (
              <Box
                key={index}
                onClick={() => navigate(`/details/financingAds/${item.id}`)}
                sx={{ cursor: 'pointer' }}
              >
                <Card sx={{ minWidth: { xs: 260, sm: 300, md: 320 }, scrollSnapAlign: 'start', flexShrink: 0, borderRadius: 3, position: 'relative' }}>
                  <CardMedia component="img" height="160" image={item.image || '/default-placeholder.png'} />
                  <FavoriteButton advertisementId={item.id} type="financing" />
                  <CardContent>
                    <Typography color="primary" fontWeight="bold">
                      {item.start_limit?.toLocaleString()} - {item.end_limit?.toLocaleString()} ج.م
                    </Typography>
                    <Typography variant="subtitle1">{item.org_name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {item.financing_model}
                    </Typography>

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
