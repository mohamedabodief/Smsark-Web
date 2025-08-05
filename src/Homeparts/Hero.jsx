import { useState, useEffect } from 'react';
import { Box, IconButton } from '@mui/material';
import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';
import HomepageAdvertisement from '../FireBase/modelsWithOperations/HomepageAdvertisement';

export default function SimpleHeroSlider() {
  const [ads, setAds] = useState([]);
  const [index, setIndex] = useState(0);

  // Subscribe to active ads
  useEffect(() => {
    const unsubscribe = HomepageAdvertisement.subscribeActiveAds(async (data) => {
      setAds(data);
      setIndex(0); // Reset index if ads change
    });
    return () => unsubscribe();
  }, []);

  // Auto-advance slider
  useEffect(() => {
    if (ads.length === 0) return;
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % ads.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [ads.length]);

  // Navigation functions
  const nextSlide = () => {
    setIndex((prev) => (prev + 1) % ads.length);
  };

  const prevSlide = () => {
    setIndex((prev) => (prev - 1 + ads.length) % ads.length);
  };

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        height: '30%',
        overflow: 'hidden',
        direction: 'rtl',
        margin: 0,
        padding: 0,
      }}
    >
      {ads.length > 0 && ads[index] && (
        <>
          <Box
            component="img"
            src={ads[index] && ads[index].image ? ads[index].image : '/no-image.svg'}
            alt="slider image"
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
            }}
          />
          {/* Safe display for title/location/description if present */}
          {/* {ads[index].title && (
            <Box sx={{
              position: 'absolute',
              bottom: 24,
              right: 24,
              background: 'rgba(0,0,0,0.5)',
              color: 'white',
              px: 2,
              py: 1,
              borderRadius: 2,
              maxWidth: '60%',
            }}>
              {typeof ads[index].title === 'object' ? JSON.stringify(ads[index].title) : ads[index].title}
              {ads[index].location && (
                <div style={{ fontSize: 14, marginTop: 4 }}>
                  {typeof ads[index].location === 'object' ? (ads[index].location.full || JSON.stringify(ads[index].location)) : ads[index].location}
                </div>
              )}
              {ads[index].description && (
                <div style={{ fontSize: 13, marginTop: 4, color: '#ccc' }}>
                  {typeof ads[index].description === 'object' ? JSON.stringify(ads[index].description) : ads[index].description}
                </div>
              )}
            </Box>
          )} */}
        </>
      )}

      <IconButton
        onClick={nextSlide}
        sx={{
          position: 'absolute',
          top: '50%',
          left: 16,
          transform: 'translateY(-50%)',
          color: 'white',
          backgroundColor: 'rgba(0,0,0,0.4)',
          '&:hover': { backgroundColor: 'rgba(0,0,0,0.6)' },
        }}
        disabled={ads.length === 0}
      >
        <ArrowBackIos />
      </IconButton>

      <IconButton
        onClick={prevSlide}
        sx={{
          position: 'absolute',
          top: '50%',
          right: 16,
          transform: 'translateY(-50%)',
          color: 'white',
          backgroundColor: 'rgba(0,0,0,0.4)',
          '&:hover': { backgroundColor: 'rgba(0,0,0,0.6)' },
        }}
        disabled={ads.length === 0}
      >
        <ArrowForwardIos />
      </IconButton>
    </Box>
  );
}

// // src/Homeparts/Hero.jsx
// import { useState, useEffect } from "react";
// import { Box, IconButton } from "@mui/material";
// import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";
// import HomepageAdvertisement from "../FireBase/modelsWithOperations/HomepageAdvertisement";
// import { getCachedAds, saveAdsToCache, hasAdsChanged } from "./adsCacheUtils";

// const CACHE_KEY = "hero_ads_cache";

// export default function SimpleHeroSlider() {
//   const [ads, setAds] = useState([]);
//   const [index, setIndex] = useState(0);

//   useEffect(() => {
//     // 1. Check cache first
//     const cachedAds = getCachedAds(CACHE_KEY);
//     if (cachedAds) {
//       setAds(cachedAds);
//     }

//     // 2. Subscribe to realtime updates
//     const unsubscribe = HomepageAdvertisement.subscribeActiveAds((newAds) => {
//       if (!cachedAds || hasAdsChanged(cachedAds, newAds)) {
//         setAds(newAds);
//         saveAdsToCache(CACHE_KEY, newAds);
//       }
//       setIndex(0);
//     });

//     // 3. Initial fetch if no cache
//     if (!cachedAds) {
//       HomepageAdvertisement.getActiveAds().then((ads) => {
//         setAds(ads);
//         saveAdsToCache(CACHE_KEY, ads);
//       });
//     }

//     return () => unsubscribe();
//   }, []);

//   // Auto-advance slider
//   useEffect(() => {
//     if (ads.length === 0) return;
//     const interval = setInterval(() => {
//       setIndex((prev) => (prev + 1) % ads.length);
//     }, 5000);
//     return () => clearInterval(interval);
//   }, [ads.length]);

//   // Navigation functions
//   const nextSlide = () => {
//     setIndex((prev) => (prev + 1) % ads.length);
//   };

//   const prevSlide = () => {
//     setIndex((prev) => (prev - 1 + ads.length) % ads.length);
//   };

//   return (
//     <Box
//       sx={{
//         position: "relative",
//         width: "100%",
//         height: "30%",
//         overflow: "hidden",
//         direction: "rtl",
//         margin: 0,
//         padding: 0,
//       }}
//     >
//       {ads.length > 0 && ads[index] && (
//         <>
//           <Box
//             component="img"
//             src={
//               ads[index] && ads[index].image
//                 ? ads[index].image
//                 : "/no-image.svg"
//             }
//             alt="slider image"
//             sx={{
//               width: "100%",
//               height: "60%",
//               objectFit: "cover",
//             }}
//           />
//           {ads[index].title && (
//             <Box
//               sx={{
//                 position: "absolute",
//                 bottom: 24,
//                 right: 24,
//                 background: "rgba(0,0,0,0.5)",
//                 color: "white",
//                 px: 2,
//                 py: 1,
//                 borderRadius: 2,
//                 maxWidth: "60%",
//               }}
//             >
//               {typeof ads[index].title === "object"
//                 ? JSON.stringify(ads[index].title)
//                 : ads[index].title}
//               {ads[index].location && (
//                 <div style={{ fontSize: 14, marginTop: 4 }}>
//                   {typeof ads[index].location === "object"
//                     ? ads[index].location.full ||
//                       JSON.stringify(ads[index].location)
//                     : ads[index].location}
//                 </div>
//               )}
//               {ads[index].description && (
//                 <div style={{ fontSize: 13, marginTop: 4, color: "#ccc" }}>
//                   {typeof ads[index].description === "object"
//                     ? JSON.stringify(ads[index].description)
//                     : ads[index].description}
//                 </div>
//               )}
//             </Box>
//           )}
//         </>
//       )}

//       <IconButton
//         onClick={nextSlide}
//         sx={{
//           position: "absolute",
//           top: "50%",
//           left: 16,
//           transform: "translateY(-50%)",
//           color: "white",
//           backgroundColor: "rgba(0,0,0,0.4)",
//           "&:hover": { backgroundColor: "rgba(0,0,0,0.6)" },
//         }}
//         disabled={ads.length === 0}
//       >
//         <ArrowBackIos />
//       </IconButton>

//       <IconButton
//         onClick={prevSlide}
//         sx={{
//           position: "absolute",
//           top: "50%",
//           right: 16,
//           transform: "translateY(-50%)",
//           color: "white",
//           backgroundColor: "rgba(0,0,0,0.4)",
//           "&:hover": { backgroundColor: "rgba(0,0,0,0.6)" },
//         }}
//         disabled={ads.length === 0}
//       >
//         <ArrowForwardIos />
//       </IconButton>
//     </Box>
//   );
// }
