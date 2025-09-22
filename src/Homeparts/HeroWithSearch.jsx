import { useState, useEffect } from "react";
import { Box, IconButton, Typography } from "@mui/material";
import ArrowBackIos from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIos from "@mui/icons-material/ArrowForwardIos";
import HomepageAdvertisement from "../FireBase/modelsWithOperations/HomepageAdvertisement";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { getCachedAds, saveAdsToCache, hasAdsChanged } from "./adsCacheUtils";

const CACHE_KEY = "hero_ads_cache";

async function fixStorageUrl(image) {
  if (!image) return "/hero-placeholder.png";

  // لو gs://
  if (image.startsWith("gs://")) {
    try {
      const storage = getStorage();
      const path = image.split("gs://")[1].split("/").slice(1).join("/"); // استخراج المسار
      const storageRef = ref(storage, path);
      const url = await getDownloadURL(storageRef);
      return url;
    } catch (err) {
      console.error("Error converting gs:// URL:", err);
      return "/hero-placeholder.png";
    }
  }

  // لو https://
  if (image.startsWith("http")) return image;

  return "/hero-placeholder.png";
}

function HeroSlider({ ads }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (ads.length === 0) return;
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % ads.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [ads.length]);

  const nextSlide = () => setIndex((prev) => (prev + 1) % ads.length);
  const prevSlide = () => setIndex((prev) => (prev - 1 + ads.length) % ads.length);

  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        height: { xs: "50vh", md: "75vh" },
        overflow: "hidden",
        direction: "rtl",
      }}
    >
      {ads.length > 0 && ads[index] && (
        <>
          <Box
            component="img"
            src={ads[index].image || "/hero-placeholder.png"}
            alt="slider image"
            sx={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
          {ads[index].title && (
            <Box
              sx={{
                position: "absolute",
                bottom: 24,
                right: 24,
                background: "rgba(0,0,0,0.5)",
                color: "white",
                px: 2,
                py: 1,
                borderRadius: 2,
                maxWidth: "60%",
              }}
            >
              {ads[index].title}
            </Box>
          )}
        </>
      )}

      <IconButton
        onClick={nextSlide}
        sx={{
          position: "absolute",
          top: "50%",
          left: 16,
          transform: "translateY(-50%)",
          color: "white",
          backgroundColor: "rgba(0,0,0,0.4)",
          "&:hover": { backgroundColor: "rgba(0,0,0,0.6)" },
        }}
        disabled={ads.length === 0}
      >
        <ArrowBackIos />
      </IconButton>

      <IconButton
        onClick={prevSlide}
        sx={{
          position: "absolute",
          top: "50%",
          right: 16,
          transform: "translateY(-50%)",
          color: "white",
          backgroundColor: "rgba(0,0,0,0.4)",
          "&:hover": { backgroundColor: "rgba(0,0,0,0.6)" },
        }}
        disabled={ads.length === 0}
      >
        <ArrowForwardIos />
      </IconButton>
    </Box>
  );
}

export default function HeroWithSearch() {
  const [ads, setAds] = useState([]);

  useEffect(() => {
    const cachedAds = getCachedAds(CACHE_KEY);
    if (cachedAds) setAds(cachedAds);

    const unsubscribe = HomepageAdvertisement.subscribeActiveAds(async (newAds) => {
      // تعديل الروابط قبل الحفظ
      const adsWithUrls = await Promise.all(
        newAds.map(async (ad) => ({
          ...ad,
          image: await fixStorageUrl(ad.image),
        }))
      );

      if (!cachedAds || hasAdsChanged(cachedAds, adsWithUrls)) {
        setAds(adsWithUrls);
        saveAdsToCache(CACHE_KEY, adsWithUrls);
      }
    });

    if (!cachedAds) {
      HomepageAdvertisement.getActiveAds().then(async (adsData) => {
        const adsWithUrls = await Promise.all(
          adsData.map(async (ad) => ({ ...ad, image: await fixStorageUrl(ad.image) }))
        );
        setAds(adsWithUrls);
        saveAdsToCache(CACHE_KEY, adsWithUrls);
      });
    }

    return () => unsubscribe();
  }, []);

  return (
    <Box sx={{ position: "relative", width: "100%" }}>
      <HeroSlider ads={ads} />
      <Typography
        variant="h2"
        sx={{
          position: "absolute",
          top: "103%",
          left: "50%",
          transform: "translateX(-50%)",
          color: "#5121a5ff",
          fontWeight: "bold",
          textShadow: "2px 2px 6px rgba(0,0,0,0.7)",
          maxWidth: "50%",
          textAlign: "center",
          direction: "rtl",
          marginBottom: "20px",
          zIndex: 10,
          fontSize: { xs: "2.4rem", sm: "2.4rem", md: "3rem", lg: "4rem", xl: "4rem" },
        }}
      >
        دوّر على بيتك عندنا
      </Typography>
    </Box>
  );
}
