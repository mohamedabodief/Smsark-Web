import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  keyframes
} from '@mui/material';
import {
  Call as CallIcon,
  Bookmark as BookmarkIcon,
  Favorite as FavoriteIcon,
  RemoveRedEye as RemoveRedEyeIcon,
  WhatsApp as WhatsAppIcon,
  BookmarkBorder as BookmarkBorderIcon,
  FavoriteBorder as FavoriteBorderIcon,
  OutlinedFlag as OutlinedFlagIcon,
  ShareOutlined as ShareOutlinedIcon
} from '@mui/icons-material';

import { useParams } from 'react-router-dom';
import MapPicker from '../../LocationComponents/MapPicker';
import ClientAdvertisement from '../../FireBase/modelsWithOperations/ClientAdvertisemen';

function DetailsForClient() {
  const { id } = useParams();
  const [clientAds, setClientAds] = useState(null);
  const [mainImage, setMainImage] = useState('');
  const [city, setCity] = useState('');
  const [governorate, setGovernorate] = useState('');
  const [road, setRoad] = useState('');
console.log('ID from params:', id);

  useEffect(() => {
    const fetchAd = async () => {
      const ad = await ClientAdvertisement.getById(id);
      if (ad) {
        setClientAds(ad);
        if (Array.isArray(ad.images) && ad.images.length > 0) {
          setMainImage(ad.images[0]);
        }
      }
    };

    if (id) fetchAd();
  }, [id]);

  const pulse = keyframes`
    0% {
      transform: scale(1);
      box-shadow: 0 0 0 0 rgba(37, 211, 102, 0.4);
    }
    70% {
      transform: scale(1.1);
      box-shadow: 0 0 0 10px rgba(37, 211, 102, 0);
    }
    100% {
      transform: scale(1);
      box-shadow: 0 0 0 0 rgba(37, 211, 102, 0);
    }
  `;

  if (!clientAds) return <p>جارٍ تحميل البيانات...</p>;

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box
        sx={{
          position: 'fixed',
          bottom: 20,
          right: 20,
          backgroundColor: '#25D366',
          color: 'white',
          px: 2,
          py: 1,
          borderRadius: '50%',
          zIndex: 999,
          cursor: 'pointer',
          animation: `${pulse} 2s infinite`,
          transition: 'transform 0.3s',
          '&:hover': { transform: 'scale(1.2)' },
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0px 4px 12px rgba(0,0,0,0.2)',
          width: 50,
          height: 50,
        }}
      >
        <WhatsAppIcon sx={{ fontSize: 30 }} />
      </Box>

      {/* الازرار الى فوق مفضله وحفط وشترك وبلغ*/}
      <Box sx={{display:'flex',justifyContent:'space-between'}}>
      <Box sx={{ marginBottom: '40px', display: 'flex', gap: '40px' }}>
        <Box sx={{ display: 'flex', gap: '7px' }}>
          <Typography sx={{ fontWeight: 'bold' }}>مفضله</Typography>
          <FavoriteBorderIcon />
        </Box>

        <Box sx={{ display: 'flex', gap: '7px' }}>
          <Typography sx={{ fontWeight: 'bold' }}>حفظ</Typography>
          <BookmarkBorderIcon />
        </Box>

        <Box sx={{ display: 'flex', gap: '7px' }}>
          <Typography sx={{ fontWeight: 'bold' }}>ابلاغ</Typography>
          <OutlinedFlagIcon />
        </Box>

        <Box sx={{ display: 'flex', gap: '7px' }}>
          <Typography sx={{ fontWeight: 'bold' }}>شارك</Typography>
          <ShareOutlinedIcon />
        </Box>
        
      </Box>
<Box>
  <Typography sx={{fontSize:'20px'}}>نشر بواسطه {clientAds.user_name}</Typography>
</Box>
</Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: {
            xs: 'column',
            md: 'column',
            lg: 'row',
          },
          gap: 2,
        }}
      >
        <Box sx={{ flex: 3, height: '500px' }}>
          <img
            src={mainImage || 'https://via.placeholder.com/800x500'}
            alt="Main"
            style={{
              width: '100%',
              height: '100%',
              borderRadius: '8px',
              objectFit: 'cover',
            }}
          />
        </Box>

        <Box
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: {
              xs: 'row',
              md: 'row',
              lg: 'column',
            },
            gap: 1,
            mt: { xs: 2, md: 2, lg: 0 },
            height: { lg: '100%' },
          }}
        >
          {clientAds?.images?.map((src, index) => (
            <Box
              key={index}
              onClick={() => setMainImage(src)}
              sx={{
                height: { xs: 90, md: 100, lg: 120 },
                cursor: 'pointer',
                border: mainImage === src ? '2px solid #1976d2' : 'none',
                borderRadius: '8px',
                overflow: 'hidden',
              }}
            >
              <img
                src={src}
                alt={`img-${index}`}
                style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: '8px',
                  objectFit: 'cover',
                }}
              />
            </Box>
          ))}
        </Box>
      </Box>

      {/* البيانات*/}
      <Box dir="rtl" sx={{ mt: '60px' }}>
        <Typography sx={{ fontWeight: 'bold' }} variant="h5">
          عنوان الاعلان: -  {clientAds.title}
        </Typography>
         

        <Typography sx={{  mt: 3 }} variant="h6">
          السعر: - {clientAds.price}جنية 
        </Typography>
      

        <Typography sx={{ fontWeight: 'bold', mt: 3 }} variant="h5">
          وصف الاعلان:-    {clientAds.description || 'لا يوجد وصف'}
        </Typography>
       
      </Box>

      {/* خريطه*/}
   <Box
  sx={{
    mt: 4,
    display: 'flex',
    flexDirection: 'column',
    gap: 3,
    alignItems: 'stretch',
  }}
>
  {/* Map  */}
 <Box
  sx={{
    mt: 4,
    display: 'flex',
    flexDirection: { xs: 'column', md: 'row' },
    gap: 4,
    alignItems: 'stretch',
  }}
>
  {/* بيانات العنوان */}
  <Box
    dir="rtl"
    sx={{
      flex: 1,
      backgroundColor: '#fff',
      borderRadius: '16px',
      p: 3,
      boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      border: '1px solid #e0e0e0',
    }}
  >
    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: '#333' }}>
      📍 تفاصيل الموقع
    </Typography>

    <Typography variant="body1" sx={{ mb: 1.5, fontSize: '16px' }}>
      <strong>المحافظة:</strong> {clientAds?.governorate || '---'}
    </Typography>

    <Typography variant="body1" sx={{ mb: 1.5, fontSize: '16px' }}>
      <strong>المدينة:</strong> {clientAds?.city || '---'}
    </Typography>

    <Typography variant="body1" sx={{ fontSize: '16px' }}>
      <strong>الشارع:</strong> {clientAds?.address || '---'}
    </Typography>
  </Box>

  {/* الخريطة */}
  <Box
    sx={{
      flex: 1,
      minHeight: '300px',
      borderRadius: '16px',
      overflow: 'hidden',
      boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
      border: '1px solid #e0e0e0',
    }}
  >
   <MapPicker
  defaultAddress={`${clientAds.address}, ${clientAds.city}, ${clientAds.governorate}`}
  onAddressChange={({ city, governorate, road }) => {
    setCity(city);
    setGovernorate(governorate);
    setRoad(road);
  }}
/>

  </Box>
</Box>

</Box>

    </Container>
  );
}

export default DetailsForClient;









