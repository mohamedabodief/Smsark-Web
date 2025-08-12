import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Button
} from '@mui/material';
import Slider from 'react-slick';
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import EmailIcon from '@mui/icons-material/Email';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import { Link } from 'react-router-dom';
import { ShareOutlined as ShareOutlinedIcon } from '@mui/icons-material';
import FavoriteButton from '../Homeparts/FavoriteButton';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
function HorizontalCard({ image, title, price, adress, type, status, city, governoment, phone, onClickCard, id }) {
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    rtl: true,
    arrows: true,
  };

  const handleShare = async (e) => {
    e.stopPropagation();

    if (navigator.share) {
      try {
        await navigator.share({
          title: title || 'إعلان عقاري',
          text: 'تحقق من هذا الإعلان العقاري!',
          url: window.location.href,
        });
        console.log('[DEBUG] تمت المشاركة بنجاح');
      } catch (error) {
        console.error('[DEBUG] حدث خطأ أثناء المشاركة:', error);
      }
    } else {
      alert('المتصفح لا يدعم خاصية المشاركة.');
    }
  };


  const defaultImage = 'https://i.pinimg.com/736x/e7/d7/45/e7d745cda4e178e5dcb9bf751eb39bbd.jpg';
  const imagesToShow = Array.isArray(image) && image.length > 0 && image.every(img => typeof img === 'string' && img.trim() !== '') 
    ? image 
    : [defaultImage];

  return (
    <>
      <Card
        onClick={onClickCard}
        sx={{
          cursor: 'pointer',
          display: 'flex',
          flexDirection: 'row-reverse',
          borderRadius: '10px',
          mb: 2,
          maxWidth: 800,
          height: 'auto',
          position: 'relative',
          boxShadow: 'none',
          border: '1px solid #E3E3E3',
          transition: 'transform 0.3s ease-in-out',
          margin: 'auto',
          marginBottom: '10px',
          '&:hover': {
            backgroundColor: (theme) => 
              theme.palette.mode === 'light' 
                ? theme.palette.grey[50] 
                : theme.palette.grey[900],
            transform: 'scale(1.02)',
            boxShadow: '1px 1px 20px rgba(0, 0, 0, 0.1)'
          },
          flexWrap: 'wrap'
        }}
        dir="ltr"
      >
        {/* حالتها */}
        <Box sx={{ position: 'absolute', top: '10px', left: '50px', color: '#6E00FE' }}>
          {status}
        </Box>

        <Box 
          sx={{ 
            width: 250, 
            height: 250, 
            position: 'relative',
            overflow: 'hidden', 
            backgroundColor: (theme) => 
              theme.palette.mode === 'light' 
                ? theme.palette.grey[50] 
                : theme.palette.grey[900] 
          }} 
          onClick={(e) => e.stopPropagation()}
        >
          <Slider {...settings}>
            {imagesToShow.map((img, index) => (
              <Box
                key={index}
                sx={{
                  width: '100%',
                  height: 250, 
                  display: 'flex'
                }}
              >
                <img
                  src={img}
                  alt={`صورة ${index + 1}`}
                  style={{ 
                    width: '100%', 
                    height: '100%', 
                    objectFit: 'cover', 
                    display: 'block'
                  }}
                />
              </Box>
            ))}
          </Slider>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1 }} dir="rtl" onClick={onClickCard}>
          <CardContent sx={{ flex: '1 0 auto' }}>
            <Typography fontWeight="bold">{type}</Typography>
            <Typography variant="h5" sx={{ mt: '20px', fontWeight: 'bold' }}>
              {title}
            </Typography>
            <Typography variant="body2" sx={{ mt: '20px', fontSize: '18px' }}>
              <AttachMoneyIcon /> {price} جنيه
            </Typography>
            <Typography variant="h6" sx={{ mt: '20px', fontWeight: 'normal', color: 'gray' }}>
              <LocationOnIcon sx={{}} /> {typeof adress === 'object' ? adress.full || '' : adress}، {typeof city === 'object' ? city.full || '' : city} {typeof governoment === 'object' ? governoment.full || '' : governoment}
            </Typography>
          </CardContent>
        </Box>

        <Box
          sx={{
            width: '100%',
            borderTop: '1px solid #E3E3E3',
            px: 2,
            py: 1,
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            backgroundColor: (theme) => 
              theme.palette.mode === 'light' 
                ? theme.palette.grey[50] 
                : theme.palette.grey[900],
            gap: '10px'
          }}
        >
          <Button
            variant="outlined"
            sx={{
              borderColor: '#52498F',
              color: '#52498F',
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              fontWeight: 'bold',
              px: 2,
              py: 0.5,
              borderRadius: '8px',
              textTransform: 'none',
            }}
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              window.location.href = `tel:${phone}`;
            }}
          >
            <PhoneIphoneIcon sx={{ fontSize: 25, color: '#52498F' }} />
            <Typography sx={{ color: '#52498F', fontWeight: '900' }}>اتصل</Typography>
          </Button>
          <Button
            variant="outlined"
            sx={{
              borderColor: '#52498F',
              color: '#52498F',
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              fontWeight: 'bold',
              px: 2,
              py: 0.5,
              borderRadius: '8px',
              textTransform: 'none',
            }}
            onClick={(e) => {
              e.stopPropagation();
              const message = 'مرحبًا، أريد الاستفسار عن الإعلان الخاص بك';
              const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
              window.open(url, '_blank');
            }}
          >
            <WhatsAppIcon sx={{ fontSize: 25, color: '#52498F', fontWeight: '900' }} />
            <Typography sx={{ color: '#52498F', fontWeight: '900' }}>واتساب</Typography>
          </Button>
          <Button
            variant="outlined"
            onClick={handleShare}
            sx={{
              borderColor: '#52498F',
              color: '#52498F',
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              fontWeight: 'bold',
              px: 2,
              py: 0.5,
              borderRadius: '8px',
              textTransform: 'none',
            }}
          >
            <ShareOutlinedIcon sx={{ fontSize: 25, color: '#52498F', fontWeight: '900' }} />
            <Typography sx={{ color: '#52498F', fontWeight: '900' }}>مشاركة</Typography>
          </Button>
          <FavoriteButton advertisementId={id} />
          {/* <Button
            variant="outlined"
            sx={{
              borderColor: '#52498F',
              color: '#52498F',
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              fontWeight: 'bold',
              px: 2,
              py: 0.5,
              borderRadius: '8px',
              textTransform: 'none',

            }}
          > */}
          <FavoriteButton advertisementId={id} />

          {/* </Button> */}
        </Box>
      </Card>
    </>
  );
}

export default HorizontalCard;