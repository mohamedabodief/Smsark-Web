import { useState, useEffect } from 'react';
import { Box, IconButton } from '@mui/material';
import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';
import HomepageAdvertisement from '../FireBase/modelsWithOperations/HomepageAdvertisement';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';

// ✅ صور fallback من public
// const fallbackImages = ['/main1.jpg', '/main2.jpg', '/main3.jpg', '/main4.jpg'];

async function fixStorageUrl(url) {
  if (!url) return "/main3.jpg"; // 👈 هنا بدل getRandomFallback استخدم main3

  // gs:// → حوله لرابط قابل للعرض
  if (url.startsWith('gs://')) {
    try {
      const storage = getStorage();
      const path = url.split('gs://')[1].split('/').slice(1).join('/');
      const storageRef = ref(storage, path);
      const downloadUrl = await getDownloadURL(storageRef);
      console.log('[FIXED gs:// URL]:', downloadUrl);
      return downloadUrl;
    } catch (err) {
      console.error('Error fetching gs:// URL:', err);
      return "/main3.jpg"; // 👈 هنا برضه لو حصل خطأ
    }
  }

  // https:// مباشر
  if (url.startsWith('http')) {
    console.log('[HTTP URL]:', url);
    return url;
  }

  return "/main3.jpg"; // 👈 fallback أساسي
}

export default function SimpleHeroSlider() {
  const [ads, setAds] = useState([]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const unsubscribe = HomepageAdvertisement.subscribeActiveAds(async (data) => {
      const adsWithUrls = await Promise.all(
        data.map(async (ad) => ({
          ...ad,
          image: await fixStorageUrl(ad.image),
        }))
      );

      // لو مفيش أي إعلان، نعرض main3 كغلاف
      if (adsWithUrls.length === 0) {
        setAds([{ image: "/main3.jpg" }]);
      } else {
        setAds(adsWithUrls);
      }

      setIndex(0);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (ads.length === 0) return;
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % ads.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [ads.length]);

  const nextSlide = () => setIndex((prev) => (prev + 1) % ads.length);
  const prevSlide = () => setIndex((prev) => (prev - 1 + ads.length) % ads.length);

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
      {ads.length > 0 && (
        <Box
          component="img"
          src={ads[index]?.image || "/main3.jpg"} // 👈 هنا لو مفيش صورة، استخدم main3
          alt="slider image"
          sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
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
