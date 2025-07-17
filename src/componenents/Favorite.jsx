import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Box, Typography, Card, CardMedia, CardContent } from '@mui/material';
import RealEstateDeveloperAdvertisement from '../FireBase/modelsWithOperations/RealEstateDeveloperAdvertisement';
import FinancingAdvertisement from '../FireBase/modelsWithOperations/FinancingAdvertisement';

// نفترض أن Redux يخزن المفضلة بهذا الشكل:
// { advertisement_id: 'xyz', type: 'developer' أو 'financing' }

const Favorite = () => {
  const favoriteItems = useSelector((state) => state.favorites.list); // array of {advertisement_id, type}
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAds = async () => {
      const results = await Promise.all(
        favoriteItems.map(async ({ advertisement_id, type }) => {
          if (type === 'developer') {
            return await RealEstateDeveloperAdvertisement.getById(advertisement_id);
          } else if (type === 'financing') {
            return await FinancingAdvertisement.getById(advertisement_id);
          }
          return null;
        })
      );

      setAds(results.filter(Boolean)); // إزالة أي null
      setLoading(false);
    };

    if (favoriteItems.length > 0) {
      fetchAds();
    } else {
      setAds([]);
      setLoading(false);
    }
  }, [favoriteItems]);

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
            <Card key={item.id} sx={{ width: 320, borderRadius: 3, position: 'relative' }}>
              <CardMedia
                component="img"
                height="160"
                image={item.image || '/default-placeholder.png'}
              />
              <CardContent>
                {item.price_start_from ? (
                  // عرض إعلان مطور 
                  <>
                    <Typography color="primary" fontWeight="bold">
                      {item.price_start_from?.toLocaleString()} - {item.price_end_to?.toLocaleString()} ج.م
                    </Typography>
                    <Typography variant="subtitle1">{item.developer_name}</Typography>
                    <Typography variant="body2" color="text.secondary">{item.location}</Typography>
                    <Typography variant="body2" mt={1}>{item.description}</Typography>
                  </>
                ) : (
                  // عرض إعلان تمويل 
                  <>
                    <Typography color="primary" fontWeight="bold">
                      {item.start_limit?.toLocaleString()} - {item.end_limit?.toLocaleString()} ج.م
                    </Typography>
                    <Typography variant="subtitle1">{item.org_name}</Typography>
                    <Typography variant="body2" color="text.secondary">{item.financing_model}</Typography>
                  </>
                )}
              </CardContent>
            </Card>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default Favorite;
