import React, { useState } from 'react';
import { Container, Box, Typography, keyframes } from '@mui/material';
import MapPicker from "../../LocationComponents/MapPicker";
import CallIcon from '@mui/icons-material/Call';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import FavoriteIcon from '@mui/icons-material/Favorite';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
function DetailsForFinincingAds() {
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
    const images = ['/build1.jpg', '/build2.jpg', '/build3.jpeg', '/builg4.jpg'];
    const [mainImage, setMainImage] = useState(images[0]);

    const [city, setCity] = useState('');
    const [governorate, setGovernorate] = useState('');
const [road,setRoad]=useState('')
    return (

        <Container maxWidth="md" sx={{ py: 4, position: 'relative' }}>
            <Box
                sx={{
                    position: 'fixed',
                    top: 10,
                    left: 10,
                    backgroundColor: '#1976d2',
                    color: 'white',
                    px: 2,
                    py: 0.5,
                    borderRadius: '8px',
                    fontWeight: 'bold',
                    zIndex: 10,
                }}
            >
                💰 تمويل عقاري
            </Box>
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
                    fontWeight: 'bold',
                    zIndex: 999,
                    cursor: 'pointer',
                    animation: `${pulse} 2s infinite`,
                    transition: 'transform 0.3s',
                    '&:hover': {
                        transform: 'scale(1.2)',
                    },
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
            {/* imges*/}
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
                        src={mainImage}
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
                    {images.map((src, index) => (
                        <Box
                            key={index}
                            sx={{
                                height: { xs: 90, md: 100, lg: 120 },
                                cursor: 'pointer',
                                border: mainImage === src ? '2px solid #1976d2' : 'none',
                                borderRadius: '8px',
                                overflow: 'hidden',
                            }}
                            onClick={() => setMainImage(src)}
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

            {/* des*/}
            <Box dir="rtl" sx={{ mt: '60px' }}>
                <Typography sx={{ fontWeight: 'bold' }} variant="h5">
                    عنوان الاعلان :- تمويل شقق فى العاصمه الاداريه بدون مقدم وعلى تسهيلات فى الاقساط
                </Typography>
                <Typography variant="h5" sx={{ color: 'blue', mt: '10px' }}>
                    اسم المؤسسه: بنك مصر
                </Typography>
                <Typography variant="body1" sx={{ mt: '10px' }}>
                    <Typography variant="h6">  وصف التمويل :- </Typography>  نوفر لك تمويل يصل ل 600000الف بدون مقدم
                </Typography>

                <Typography variant="body1" sx={{ mt: '10px' }}>
                    <Typography variant="h6">  رقم التواصل :- </Typography>  010203994
                </Typography>
                <Typography variant="body1" sx={{ mt: '10px' }}>
                    <Typography variant="h6">  نوع المستخدم :- </Typography>  افراد
                </Typography>
                <Typography variant="body1" sx={{ mt: '10px' }}>
                    <Typography variant="h6">حدود التمويل :- </Typography> من 50.000 الى 50.000.00
                </Typography>
                <Typography variant="body1" sx={{ mt: '10px' }}>
                    <Typography variant="h6">نسب الفائده :- </Typography> - حتى 5 سنوات: 8%
                    - من 6 إلى 10 سنوات: 10%
                    - أكثر من 10 سنوات: 12%
                </Typography>
                <Typography variant="body1" sx={{ mt: '10px' }}>
                    <Typography variant="h6">حاله الاعلان :-  </Typography> إعلان مفعّل حتى: 2025-07-10
                </Typography>
            </Box>

            <Box sx={{ mt: '30px' }} display="flex" >
                <MapPicker 
                    onAddressChange={({ city, governorate ,road}) => {
                        setCity(city);
                        setGovernorate(governorate);
                       setRoad(road)
                    }}
                />

                <Box
                    dir="rtl"
                    sx={{ display: 'flex', marginTop: '30px', flexDirection: 'column', gap: 5, marginLeft: '20px' }}
                    flex={1}
                >
                    <Typography variant='h6'> المحافظة: {governorate} </Typography>
                    <Typography variant='h6'> المدينة: {city} </Typography>
                      <Typography variant='h6'> الشارع :- {road} </Typography>
                    <Typography variant='h6'> تاريخ العقار :- </Typography>
                </Box>
            </Box>
            <Box
                sx={{
                    mt: '50px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    borderRadius: '20px',
                    flexWrap: 'wrap',
                    gap: 2,
                }}
            >
                {/* Call Us */}
                <Box
                    sx={{
                        cursor: 'pointer',
                        backgroundColor: '#6E00FE',
                        padding: '8px 16px',
                        borderRadius: '20px',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1.2,
                    }}
                >
                    <CallIcon />تواصل
                </Box>

                {/* Add to saved */}
                <Box
                    sx={{
                        cursor: 'pointer',
                        backgroundColor: '#6E00FE',
                        padding: '8px 16px',
                        borderRadius: '20px',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1.2,
                    }}
                >
                    <BookmarkIcon /> اضافه للمحفوضات
                </Box>

                {/* Add to fav */}
                <Box
                    sx={{
                        cursor: 'pointer',
                        backgroundColor: '#6E00FE',
                        padding: '8px 16px',
                        borderRadius: '20px',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1.2,
                    }}
                >
                    <FavoriteIcon /> اضافه للمفضله
                </Box>

                {/* Eye Icon Only */}
                <Box
                    sx={{
                        cursor: 'pointer',
                        backgroundColor: '#6E00FE',
                        padding: '8px',
                        borderRadius: '20px',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                    }}
                >
                    <RemoveRedEyeIcon /> عدد المشاهدات
                </Box>
            </Box>
        </Container>
    );
}

export default DetailsForFinincingAds;
