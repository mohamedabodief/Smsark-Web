import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardMedia,
  CardContent,
  CardActionArea
} from '@mui/material';
import RealEstateDeveloperAdvertisement from '../FireBase/modelsWithOperations/RealEstateDeveloperAdvertisement';
import FinancingAdvertisement from '../FireBase/modelsWithOperations/FinancingAdvertisement';
import FavoriteButton from '../Homeparts/FavoriteButton';
import ClientAdvertisement from '../FireBase/modelsWithOperations/ClientAdvertisemen';
const Favorite = () => {
  const favoriteItems = useSelector((state) => state.favorites.list);
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAds = async () => {
      const cleanedItems = favoriteItems.filter(
        (item) => item && item.advertisement_id
      );

      const results = await Promise.all(
        cleanedItems.map(async ({ advertisement_id }) => {
          let ad = await RealEstateDeveloperAdvertisement.getById(advertisement_id);
          if (!ad) {
            ad = await FinancingAdvertisement.getById(advertisement_id);
          }
          if (!ad) {
            ad = await ClientAdvertisement.getById(advertisement_id);
          }
          return ad;
        })
      );


      setAds(results.filter(Boolean));
      setLoading(false);
    };

    if (favoriteItems.length > 0) {
      fetchAds();
    } else {
      setAds([]);
      setLoading(false);
    }
  }, [favoriteItems]);


  const handleCardClick = (item) => {
    if (item.price_start_from !== undefined && item.price_end_to !== undefined) {
      navigate(`/details/developmentAds/${item.id}`);
    } else if (item.start_limit !== undefined && item.end_limit !== undefined) {
      navigate(`/details/financingAds/${item.id}`);
    } else {
      navigate(`/details/clientAds/${item.id}`);
    }
  };


  return (
    <Box sx={{ p: 4, pt: 13, pb: 8 }}>
      <Typography variant="h4" textAlign="center" fontWeight="bold" mb={4}>
        قائمة المفضلة
      </Typography>

      {loading ? (
        <Typography>جاري التحميل...</Typography>
      ) : ads.length === 0 ? (
        <Typography textAlign="center">لا توجد إعلانات محفوظة في المفضلة.</Typography>
      ) : (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, justifyContent: 'center' }}>
          {ads.map((item) => (
            <Card
              key={item.id}
              sx={{
                width: 320,
                borderRadius: 3,
                position: 'relative',
                cursor: 'pointer',
              }}
            >
              <Box sx={{ position: 'absolute', top: 10, left: 10, zIndex: 10 }} onClick={(e) => e.stopPropagation()}>
                <FavoriteButton
                  advertisementId={item.id}
                // type={item.type}
                />
              </Box>

              <CardActionArea onClick={() => handleCardClick(item)}>
                <CardMedia
                  component="img"
                  height="160"
                  image={item.image || '/default-placeholder.png'}
                />
                <CardContent>
                  {item.price_start_from !== undefined && item.price_end_to !== undefined && (
                    <>
                      <Typography color="primary" fontWeight="bold">
                        {item.price_start_from?.toLocaleString()} - {item.price_end_to?.toLocaleString()} ج.م
                      </Typography>
                      <Typography variant="subtitle1">{item.developer_name}</Typography>
                      <Typography variant="body2" color="text.secondary">{item.location}</Typography>
                      <Typography variant="body2" mt={1}>{item.description}</Typography>
                    </>
                  )}

                  {item.start_limit !== undefined && item.end_limit !== undefined && (
                    <>
                      <Typography color="primary" fontWeight="bold">
                        {item.start_limit?.toLocaleString()} - {item.end_limit?.toLocaleString()} ج.م
                      </Typography>
                      <Typography variant="subtitle1">{item.org_name}</Typography>
                      <Typography variant="body2" color="text.secondary">{item.financing_model}</Typography>
                    </>
                  )}

                  {item.title && item.city && item.governorate && (
                    <>
                      <Typography variant="subtitle1">{item.title}</Typography>
                      <Typography variant="body2" color="text.secondary">{item.city} - {item.governorate}</Typography>
                      <Typography variant="body2" mt={1}>{item.description}</Typography>
                    </>
                  )}
                </CardContent>

              </CardActionArea>
            </Card>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default Favorite;

// stop______________________