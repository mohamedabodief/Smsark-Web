import { useEffect, useState } from 'react';
import { Box, Grid, Typography, Button, Avatar } from '@mui/material';
import { SearchRounded, HomeWorkRounded, ApartmentRounded } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { auth } from '../FireBase/firebaseConfig';
import User from '../FireBase/modelsWithOperations/User';

export default function Advertise() {
  const navigate = useNavigate();
  // const [userType, setUserType] = useState(null);

  // useEffect(() => {
  //   const fetchUserType = async () => {
  //     const uid = auth.currentUser?.uid;
  //     if (!uid) return;

  //     const user = await User.getByUid(uid);
  //     if (user) {
  //       setUserType(user.type_of_user);
  //     }
  //   };

  //   fetchUserType();
  // }, []);

  // اختبار يدوي فقط
  const user = { id: 'test-user', type: 'developer' }; // client | developer | financer
  const userType = user.type;

  const options = [
    {
      icon: <SearchRounded fontSize="large" sx={{ color: '#1976d2' }} />,
      title: 'عميل؟',
      description: 'استكشف أفضل العقارات المتاحة بسهولة ويسر.',
      type: 'client',
      route: '/AddAdvertisement',
    },
    {
      icon: <HomeWorkRounded fontSize="large" sx={{ color: '#388e3c' }} />,
      title: 'مطور؟',
      description: 'أضف عقارك الآن وابدأ في تلقي العروض بسهولة وسرعة.',
      type: 'developer',
      route: '/AdddeveloperAds',
    },
    {
      icon: <ApartmentRounded fontSize="large" sx={{ color: '#f57c00' }} />,
      title: 'ممول؟',
      description: 'قم بإدارة مشاريعك وتواصل مع المهتمين بعقاراتك.',
      type: 'financer',
      route: '/add-financing-ad',
    },
  ];

  const handleNavigate = (item) => {
    if (userType === item.type) {
      navigate(item.route);
    } else {
      alert('غير مصرح لك بالدخول لهذا القسم');
    }
  };

  return (
    <Box sx={{ py: 10, px: { xs: 2, md: 10 }, direction: 'rtl' }}>
      <Grid container spacing={4} justifyContent="center">
        <Grid item xs={12} textAlign="center">
          <Typography variant="h4" fontWeight="bold" mt={14} mb={4}>
            أعلن عن عقارك بكل سهولة
          </Typography>
        </Grid>

        {options.map((item, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Box
              sx={{
                borderRadius: 5,
                p: 4,
                textAlign: 'center',
                height: '100%',
                boxShadow: '0 0 10px rgba(134, 132, 132, 0.1)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'transform 0.3s',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: 12,
                },
              }}
            >
              <Box>
                <Avatar sx={{ width: 70, height: 70, mx: 'auto', mb: 2 }}>
                  {item.icon}
                </Avatar>
                <Typography variant="h6" mb={1} fontWeight="bold">
                  {item.title}
                </Typography>
                <Typography variant="body2" sx={{ color: 'gray' }}>
                  {item.description}
                </Typography>
              </Box>
              <Button
                variant="contained"
                sx={{
                  mt: 3,
                  borderRadius: '25px',
                  textTransform: 'none',
                  width: '140px',
                  mx: 'auto',
                  fontWeight: 'bold',
                }}
                onClick={() => handleNavigate(item)}
              >
                أضف إعلانك
              </Button>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
