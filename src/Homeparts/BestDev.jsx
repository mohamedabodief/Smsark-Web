
import { useAuth } from '../context/AuthContext';
import {
  Box, Typography, Card, CardMedia, CardContent, IconButton
} from '@mui/material';
import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';
import FavoriteButton from './FavoriteButton';
import { useRef, useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import RealEstateDeveloperAdvertisement from '../FireBase/modelsWithOperations/RealEstateDeveloperAdvertisement';
// import { devAdsData } from '../FireBase/models/Users/devAdsData';

export default function BestDev() {
  const sliderRef = useRef();
  const navigate = useNavigate();
  const { user } = useAuth(); // حالة المستخدم، null أو بيانات المستخدم
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  const initializeAds = useCallback(async () => {
    setLoading(true);
    try {
      if (user) {
        // لو المستخدم مسجل دخول: جلب الإعلانات من Firebase
        // const existingAds = await RealEstateDeveloperAdvertisement.getAll();

        // for (const adData of devAdsData) {
        //   const alreadyExists = existingAds.some(
        //     (ad) => ad.title === adData.title && ad.developer_name === adData.developer_name
        //   );
        //   if (!alreadyExists) {
        //     const ad = new RealEstateDeveloperAdvertisement(adData);
        //     await ad.save();
        //   }
        // }

        const freshAds = await RealEstateDeveloperAdvertisement.getActiveAds();
        const activeAds = freshAds.filter(ad => ad.ads === true);
        setOffers(activeAds);

      }
      //  else {
      //   // لو مش مسجل دخول: اعرض البيانات المحلية فقط بدون استدعاء getAll()
      //   // const activeAds = devAdsData.filter(ad => ad.ads === true);
      //   // setOffers(activeAds);
      // }
    } catch (error) {
      console.error('Initialization error:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    initializeAds();

    // الاشتراك في تحديثات الإعلانات النشطة لو المستخدم مسجل دخول فقط
    let unsubscribe = () => {};
    if (user) {
      unsubscribe = RealEstateDeveloperAdvertisement.subscribeActiveAds((newAds) => {
        const activeAds = newAds.filter(ad => ad.ads === true);
        setOffers(activeAds);
        setLoading(false);
      });
    }

    // التمرير التلقائي
    const interval = setInterval(() => {
      const cardWidth = 344;
      if (sliderRef.current) {
        sliderRef.current.scrollBy({
          left: -cardWidth,
          behavior: 'smooth',
        });
      }
    }, 5000);

    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, [initializeAds, user]);

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
                <Card sx={{ minWidth: { xs: 260, sm: 300, md: 320 }, width: { xs: 260, sm: 300, md: 320 }, scrollSnapAlign: 'start', flexShrink: 0, borderRadius: 3, position: 'relative', height: '100%' }}>
                  <CardMedia component="img"  width='300' height="160" image={item.images?.[0] || '/no-img.jpeg'} />
                  <FavoriteButton advertisementId={item.id}  />
                  <CardContent>
                    <Typography color="primary" fontWeight="bold">
                      {item.price_start_from?.toLocaleString()} - {item.price_end_to?.toLocaleString()} ج.م
                    </Typography>
                    <Typography variant="subtitle1">{item.developer_name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {typeof item.location === 'object'
                        ? `${item.location.governorate || ''} - ${item.location.city || ''}`
                        : item.location}
                    </Typography>
                    <Typography variant="body2" mt={1} sx={{ overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{item.description}</Typography>
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

// import {
//   Box, Typography, Card, CardMedia, CardContent, IconButton
// } from '@mui/material';
// import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';
// import FavoriteButton from './FavoriteButton';
// import { useRef, useEffect, useState, useCallback } from 'react';
// import { useNavigate } from 'react-router-dom';
// import RealEstateDeveloperAdvertisement from '../FireBase/modelsWithOperations/RealEstateDeveloperAdvertisement';
// import { devAdsData } from '../FireBase/models/Users/devAdsData';
// import { getCachedAds, saveAdsToCache, hasAdsChanged } from './adsCacheUtils';

// const CACHE_KEY = 'dev_ads_cache';

// export default function BestDev() {
//   const sliderRef = useRef();
//   const navigate = useNavigate();
//   const [offers, setOffers] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const initializeAds = useCallback(async () => {
//     try {
//       // أولاً نحاول نجيب البيانات من الكاش لو موجودة
//       const cachedAds = getCachedAds(CACHE_KEY);
//       if (cachedAds) {
//         setOffers(cachedAds);
//         setLoading(false);
//       }

//       // نجيب الإعلانات من Firebase
//       const existingAds = await RealEstateDeveloperAdvertisement.getAll();

//       // نضيف بيانات devAdsData الجديدة لو مش موجودة في Firebase
//       for (const adData of devAdsData) {
//         const alreadyExists = existingAds.some(
//           (ad) => ad.title === adData.title && ad.developer_name === adData.developer_name
//         );
//         if (!alreadyExists) {
//           const ad = new RealEstateDeveloperAdvertisement(adData);
//           await ad.save();
//         }
//       }

//       // لو ما كانش في كاش مسبقاً نحدث الحالة بالبيانات الجديدة
//       if (!cachedAds) {
//         const freshAds = await RealEstateDeveloperAdvertisement.getActiveAds();
//         setOffers(freshAds);
//         saveAdsToCache(CACHE_KEY, freshAds);
//         setLoading(false);
//       }
//     } catch (error) {
//       console.error('Initialization error:', error);
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     initializeAds();

//     // الاشتراك في التحديثات الجديدة للإعلانات
//     const unsubscribe = RealEstateDeveloperAdvertisement.subscribeActiveAds((newAds) => {
//       setOffers(prevOffers => {
//         const currentAds = prevOffers.length > 0 ? prevOffers : getCachedAds(CACHE_KEY);
//         if (!currentAds || hasAdsChanged(currentAds, newAds)) {
//           saveAdsToCache(CACHE_KEY, newAds);
//           return newAds;
//         }
//         return prevOffers;
//       });
//       setLoading(false);
//     });

//     // التمرير التلقائي
//     const interval = setInterval(() => {
//       const cardWidth = 344;
//       if (sliderRef.current) {
//         sliderRef.current.scrollBy({
//           left: -cardWidth,
//           behavior: 'smooth',
//         });
//       }
//     }, 5000);

//     return () => {
//       unsubscribe();
//       clearInterval(interval);
//     };
//   }, [initializeAds]);

//   const scroll = (direction) => {
//     const cardWidth = 344;
//     if (sliderRef.current) {
//       sliderRef.current.scrollBy({
//         left: direction === 'left' ? -cardWidth : cardWidth,
//         behavior: 'smooth',
//       });
//     }
//   };

//   return (
//     <Box sx={{ direction: 'rtl', paddingTop: 8, px: 5 }}>
//       <Typography variant="h4" fontWeight="bold" textAlign="center" mb={4}>
//         أفضل عروض التطوير العقاري
//       </Typography>

//       <Box sx={{ position: 'relative' }}>
//         <IconButton onClick={() => scroll('left')} sx={{ position: 'absolute', top: '50%', left: -10, transform: 'translateY(-50%)', zIndex: 1, backgroundColor: 'white', boxShadow: 2 }}>
//           <ArrowBackIos sx={{ color: 'grey' }} />
//         </IconButton>

//         <IconButton onClick={() => scroll('right')} sx={{ position: 'absolute', top: '50%', right: -10, transform: 'translateY(-50%)', zIndex: 1, backgroundColor: 'white', boxShadow: 2 }}>
//           <ArrowForwardIos sx={{ color: 'grey' }} />
//         </IconButton>

//         <Box
//           ref={sliderRef}
//           sx={{
//             display: 'flex', justifyContent: 'center', overflowX: 'auto', gap: 3, scrollSnapType: 'x mandatory', scrollPaddingRight: '60px', pb: 2,
//             pl: 5,
//             '&::-webkit-scrollbar': { display: 'none' }
//           }}
//         >
//           {loading ? (
//             <Typography>...جاري تحميل العروض</Typography>
//           ) : offers.length === 0 ? (
//             // بدل رسالة "لا توجد عروض"، نعرض كل الإعلانات بغض النظر عن حالة الإعلانات النشطة
//             devAdsData.map((item, index) => (
//               <Box
//                 key={index}
//                 onClick={() => navigate(`/details/developmentAds/${item.id}`)}
//                 sx={{ cursor: 'pointer' }}
//               >
//                 <Card sx={{ minWidth: { xs: 260, sm: 300, md: 320 }, scrollSnapAlign: 'start', flexShrink: 0, borderRadius: 3, position: 'relative', height: '100%' }}>
//                   <CardMedia component="img" height="160" image={item.images?.[0] || '/default-placeholder.png'} />
//                   <FavoriteButton advertisementId={item.id} type="developer" />
//                   <CardContent>
//                     <Typography color="primary" fontWeight="bold">
//                       {item.price_start_from?.toLocaleString()} - {item.price_end_to?.toLocaleString()} ج.م
//                     </Typography>
//                     <Typography variant="subtitle1">{item.developer_name}</Typography>
//                     <Typography variant="body2" color="text.secondary">
//                       {typeof item.location === 'object'
//                         ? `${item.location.governorate || ''} - ${item.location.city || ''}`
//                         : item.location}
//                     </Typography>
//                     <Typography variant="body2" mt={1}>{item.description}</Typography>
//                   </CardContent>
//                 </Card>
//               </Box>
//             ))
//           ) : (
//             offers.map((item, index) => (
//               <Box
//                 key={index}
//                 onClick={() => navigate(`/details/developmentAds/${item.id}`)}
//                 sx={{ cursor: 'pointer' }}
//               >
//                 <Card sx={{ minWidth: { xs: 260, sm: 300, md: 320 }, scrollSnapAlign: 'start', flexShrink: 0, borderRadius: 3, position: 'relative', height: '100%' }}>
//                   <CardMedia component="img" height="160" image={item.images?.[0] || '/default-placeholder.png'} />
//                   <FavoriteButton advertisementId={item.id} type="developer" />
//                   <CardContent>
//                     <Typography color="primary" fontWeight="bold">
//                       {item.price_start_from?.toLocaleString()} - {item.price_end_to?.toLocaleString()} ج.م
//                     </Typography>
//                     <Typography variant="subtitle1">{item.developer_name}</Typography>
//                     <Typography variant="body2" color="text.secondary">
//                       {typeof item.location === 'object'
//                         ? `${item.location.governorate || ''} - ${item.location.city || ''}`
//                         : item.location}
//                     </Typography>
//                     <Typography variant="body2" mt={1}>{item.description}</Typography>
//                   </CardContent>
//                 </Card>
//               </Box>
//             ))
//           )}
//         </Box>
//       </Box>
//     </Box>
//   );
// }
