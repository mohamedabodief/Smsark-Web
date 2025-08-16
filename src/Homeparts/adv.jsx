// import { useEffect, useState } from 'react';
// import { Box, Grid, Typography, Button, Avatar } from '@mui/material';
// import { SearchRounded, HomeWorkRounded, ApartmentRounded } from '@mui/icons-material';
// import { useNavigate } from 'react-router-dom';
// import { auth } from '../FireBase/firebaseConfig';
// import User from '../FireBase/modelsWithOperations/User';
// export default function Advertise() {
//   const navigate = useNavigate();
//   const [userType, setUserType] = useState(null);

//   useEffect(() => {
//     const fetchUserType = async () => {
//       const uid = auth.currentUser?.uid;
//       if (!uid) return;

//       const user = await User.getByUid(uid);
//       if (user) {
//         setUserType(user.type_of_user);
//       }
//     };

//     //   fetchUserType();
//     // }, []);

//     // اختبار يدوي فقط
//     //   const user = { id: 'test-user', type: 'financer' }; // client | developer | financer
//     //   const userType = user.type;

//     fetchUserType();
//   }, []);


//   const options = [
//     {
//       icon: <SearchRounded fontSize="large" sx={{ color: '#1976d2' }} />,
//       title: 'عميل؟',
//       description: 'استكشف أفضل العقارات المتاحة بسهولة ويسر.',
//       type: 'client',
//       route: '/AddAdvertisement',
//     },
//     {
//       icon: <HomeWorkRounded fontSize="large" sx={{ color: '#388e3c' }} />,
//       title: 'مطور؟',
//       description: 'أضف عقارك الآن وابدأ في تلقي العروض بسهولة.',
//       type: 'developer',
//       route: '/AdddeveloperAds',
//     },
//     {
//       icon: <ApartmentRounded fontSize="large" sx={{ color: '#f57c00' }} />,
//       title: 'ممول؟',
//       description: 'قم بإدارة مشاريعك وتواصل مع المهتمين بعقاراتك.',
//       type: 'financer',
//       route: '/add-financing-ad',
//     },
//   ];

//   const handleNavigate = (item) => {
//     if (!userType) {
//       alert('يرجى تسجيل الدخول أولاً');
//       return;
//     }

//     if (userType === 'admin') {
//       navigate(item.route);
//     } else if (userType === 'organization') {
//       if (item.type === 'developer') {
//         navigate('/AdddeveloperAds');
//       } else if (item.type === 'financer') {
//         navigate('/add-financing-ad');
//       } else {
//         alert('غير مسموح للمُنظمات بإضافة إعلانات العملاء');
//       }
//     } else if (userType === item.type) {
//       navigate(item.route);
//     } else {
//       alert('غير مصرح لك بالدخول لهذا القسم');
//     }
//   };


//   return (
// <Box sx={{ py: 10, px: { xs: 2, md: 10 }, direction: 'rtl' }}>
//   <Grid container spacing={7} justifyContent="center">
//     <Grid item xs={12} md={12} textAlign="center">
//       <Typography variant="h5" fontWeight="bold" mt={10} mb={4} >
//         أعلن عن عقارك
//       </Typography>
//     </Grid>

//     {options.map((item, index) => (
//       <Grid item xs={12} md={12} key={index}>
//         <Box
//           sx={{
//             borderRadius: 5,
//             p: 4,
//             textAlign: 'center',
//             height: '100%',
//             boxShadow: '0 0 10px rgba(134, 132, 132, 0.1)',
//             display: 'flex',
//             flexDirection: 'column',
//             justifyContent: 'space-between',
//             transition: 'transform 0.3s',
//             '&:hover': {
//               transform: 'translateY(-8px)',
//               boxShadow: 12,
//             },
//           }}
//         >
//           <Box>
//             <Avatar sx={{ width: 70, height: 70, mx: 'auto', mb: 2 }}>
//               {item.icon}
//             </Avatar>
//             <Typography variant="h6" mb={1} fontWeight="bold">
//               {item.title}
//             </Typography>
//             <Typography variant="body2" sx={{ color: 'gray' }}>
//               {item.description}
//             </Typography>
//           </Box>
//           <Button
//             variant="contained"
//             sx={{
//               mt: 3,
//               borderRadius: '25px',
//               textTransform: 'none',
//               width: '140px',
//               mx: 'auto',
//               fontWeight: 'bold',
//             }}
//             onClick={() => handleNavigate(item)}
//           >
//             أضف إعلانك
//           </Button>
//         </Box>
//       </Grid>
//     ))}
//   </Grid>
// </Box>

// );
// }








// import { useEffect, useState } from 'react';
// import { Box, Grid, Typography, Button, Avatar, Popover } from '@mui/material';
// import { SearchRounded, HomeWorkRounded, ApartmentRounded } from '@mui/icons-material';
// import { useNavigate } from 'react-router-dom';
// import { auth } from '../FireBase/firebaseConfig';
// import User from '../FireBase/modelsWithOperations/User';

// export default function Advertise() {
//   const navigate = useNavigate();
//   const [userType, setUserType] = useState(null);
//   const [loginPromptAnchorEl, setLoginPromptAnchorEl] = useState(null);

//   // تعريف options
//   const options = [
//     {
//       icon: <SearchRounded fontSize="large" sx={{ color: '#1976d2' }} />,
//       title: 'عميل؟',
//       description: 'استكشف أفضل العقارات المتاحة بسهولة ويسر.',
//       type: 'client',
//       route: '/AddAdvertisement',
//     },
//     {
//       icon: <HomeWorkRounded fontSize="large" sx={{ color: '#388e3c' }} />,
//       title: 'مطور؟',
//       description: 'أضف عقارك الآن وابدأ في تلقي العروض بسهولة.',
//       type: 'developer',
//       route: '/AdddeveloperAds',
//     },
//     {
//       icon: <ApartmentRounded fontSize="large" sx={{ color: '#f57c00' }} />,
//       title: 'ممول؟',
//       description: 'قم بإدارة مشاريعك وتواصل مع المهتمين بعقاراتك.',
//       type: 'financer',
//       route: '/add-financing-ad',
//     },
//   ];

//   useEffect(() => {
//     const fetchUserType = async () => {
//       const uid = auth.currentUser?.uid;
//       if (!uid) return;

//       const user = await User.getByUid(uid);
//       if (user) {
//         setUserType(user.type_of_user);
//       }
//     };

//     fetchUserType();
//   }, []);

//   useEffect(() => {
//     if (loginPromptAnchorEl) {
//       const timer = setTimeout(() => {
//         setLoginPromptAnchorEl(null);
//         navigate('/login');
//       }, 1000); // إغلاق الـ Popover والانتقال بعد ثانية واحدة

//       return () => clearTimeout(timer); // تنظيف الـ timer
//     }
//   }, [loginPromptAnchorEl, navigate]);

//   const handleNavigate = (item) => {
//     if (!userType) {
//       setLoginPromptAnchorEl(document.body); // فتح الـ Popover في منتصف الصفحة
//       return;
//     }

//     if (userType === 'admin') {
//       navigate(item.route);
//     } else if (userType === 'organization') {
//       if (item.type === 'developer') {
//         navigate('/AdddeveloperAds');
//       } else if (item.type === 'financer') {
//         navigate('/add-financing-ad');
//       } else {
//         alert('غير مسموح للمُنظمات بإضافة إعلانات العملاء');
//       }
//     } else if (userType === item.type) {
//       navigate(item.route);
//     } else {
//       alert('غير مصرح لك بالدخول لهذا القسم');
//     }
//   };

//   const loginPromptOpen = Boolean(loginPromptAnchorEl);

//   return (
//     <Box sx={{ py: 10, px: { xs: 2, md: 10 }, direction: 'rtl' }}>
//       <Grid container spacing={7} justifyContent="center">
//         <Grid item xs={12} md={12} textAlign="center">
//           <Typography variant="h5" fontWeight="bold" mt={10} mb={4}>
//             أعلن عن عقارك
//           </Typography>
//         </Grid>

//         {options.map((item, index) => (
//           <Grid item xs={12} md={12} key={index}>
//             <Box
//               sx={{
//                 borderRadius: 5,
//                 p: 4,
//                 textAlign: 'center',
//                 height: '100%',
//                 boxShadow: '0 0 10px rgba(134, 132, 132, 0.1)',
//                 display: 'flex',
//                 flexDirection: 'column',
//                 justifyContent: 'space-between',
//                 transition: 'transform 0.3s',
//                 '&:hover': {
//                   transform: 'translateY(-8px)',
//                   boxShadow: 12,
//                 },
//               }}
//             >
//               <Box>
//                 <Avatar sx={{ width: 70, height: 70, mx: 'auto', mb: 2 }}>
//                   {item.icon}
//                 </Avatar>
//                 <Typography variant="h6" mb={1} fontWeight="bold">
//                   {item.title}
//                 </Typography>
//                 <Typography variant="body2" sx={{ color: 'gray' }}>
//                   {item.description}
//                 </Typography>
//               </Box>
//               <Button
//                 variant="contained"
//                 sx={{
//                   mt: 3,
//                   borderRadius: '25px',
//                   textTransform: 'none',
//                   width: '140px',
//                   mx: 'auto',
//                   fontWeight: 'bold',
//                 }}
//                 onClick={() => handleNavigate(item)}
//               >
//                 أضف إعلانك
//               </Button>
//             </Box>
//           </Grid>
//         ))}
//       </Grid>

//       <Popover
//         open={loginPromptOpen}
//         anchorEl={loginPromptAnchorEl}
//         anchorOrigin={{
//           vertical: 'top',
//           horizontal: 'center',
//         }}
//         transformOrigin={{
//           vertical: 'top',
//           horizontal: 'center',
//         }}
//         sx={{
//           mt: '64px', // إزاحة لأسفل بمقدار ارتفاع الناف بار
//         }}
//         disableRestoreFocus // منع إعادة التركيز
//       >
//         <Box sx={{ p: 2, bgcolor: '#fff', borderRadius: '8px' }}>
//           <Typography>يرجى تسجيل الدخول أولاً</Typography>
//         </Box>
//       </Popover>
//     </Box>
//   );
// }

import { useEffect, useState } from 'react';
import { Box, Grid, Typography, Button, Avatar, Popover } from '@mui/material';
import { SearchRounded, HomeWorkRounded, ApartmentRounded } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { auth } from '../FireBase/firebaseConfig';
import User from '../FireBase/modelsWithOperations/User';

export default function Advertise() {
  const navigate = useNavigate();
  const [userType, setUserType] = useState(null);
  const [loginPromptAnchorEl, setLoginPromptAnchorEl] = useState(null);
  const [errorPromptAnchorEl, setErrorPromptAnchorEl] = useState(null);
  const [requestedType, setRequestedType] = useState(null); // نوع القسم الذي تم الضغط عليه

  // تعريف options
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
      description: 'أضف عقارك الآن وابدأ في تلقي العروض بسهولة.',
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

  useEffect(() => {
    const fetchUserType = async () => {
      const uid = auth.currentUser?.uid;
      if (!uid) return;

      const user = await User.getByUid(uid);
      if (user) {
        setUserType(user.type_of_user);
      }
    };

    fetchUserType();
  }, []);

  useEffect(() => {
    if (loginPromptAnchorEl) {
      const timer = setTimeout(() => {
        setLoginPromptAnchorEl(null);
        navigate('/login');
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [loginPromptAnchorEl, navigate]);

  useEffect(() => {
    if (errorPromptAnchorEl) {
      const timer = setTimeout(() => {
        setErrorPromptAnchorEl(null);
        setRequestedType(null); // إعادة تعيين النوع المطلوب
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [errorPromptAnchorEl]);

  const handleNavigate = (item) => {
    if (!userType) {
      setLoginPromptAnchorEl(document.body);
      return;
    }

    if (userType === 'admin') {
      navigate(item.route);
    } else if (userType === 'organization') {
      if (item.type === 'developer') {
        navigate('/AdddeveloperAds');
      } else if (item.type === 'financer') {
        navigate('/add-financing-ad');
      } else {
        setRequestedType(item.type);
        setErrorPromptAnchorEl(document.body);
      }
    } else if (userType === item.type) {
      navigate(item.route);
    } else {
      setRequestedType(item.type);
      setErrorPromptAnchorEl(document.body);
    }
  };

  const loginPromptOpen = Boolean(loginPromptAnchorEl);
  const errorPromptOpen = Boolean(errorPromptAnchorEl);

  const getErrorMessage = () => {
    switch (requestedType) {
      case 'client':
        return 'غير مصرح لك بالدخول، يجب التسجيل كـ عميل أولاً';
      case 'developer':
        return 'غير مصرح لك بالدخول، يجب التسجيل كـ مطور أولاً';
      case 'financer':
        return 'غير مصرح لك بالدخول، يجب التسجيل كـ ممول أولاً';
      // default:
        // return 'غير مصرح لك بالدخول لهذا القسم';
    }
  };

  return (
    <Box sx={{ py: 10, px: { xs: 2, md: 10 }, direction: 'rtl' }}>
      <Grid container spacing={7} justifyContent="center">
        <Grid size={{ xs: 12, md: 12 }} textAlign="center">
          <Typography variant="h5" fontWeight="bold" mt={10} mb={4}>
            أعلن عن عقارك
          </Typography>
        </Grid>

        {options.map((item, index) => (
          <Grid size={{ xs: 12, md: 12 }} key={index}>
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

      <Popover
        open={loginPromptOpen}
        anchorEl={loginPromptAnchorEl}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        sx={{
          mt: '64px',
        }}
        disableRestoreFocus
      >
        <Box sx={{ p: 2, bgcolor: 'primary', borderRadius: '8px' }}>
          <Typography>يرجى تسجيل الدخول أولاً</Typography>
        </Box>
      </Popover>

      <Popover
        open={errorPromptOpen}
        anchorEl={errorPromptAnchorEl}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        sx={{
          mt: '64px',
        }}
        disableRestoreFocus
      >
        <Box sx={{ p: 2,backgroundColor: (theme) => 
            theme.palette.mode === 'light' 
              ? theme.palette.grey[50] 
              : theme.palette.grey[900], borderRadius: '8px' }}>
          <Typography>{getErrorMessage()}</Typography>
        </Box>
      </Popover>
    </Box>
  );
}
