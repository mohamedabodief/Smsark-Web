import { useState, useEffect } from "react";
import {
  Box,
  IconButton,
  Typography,
} from "@mui/material";
import ArrowBackIos from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIos from "@mui/icons-material/ArrowForwardIos";
import HomepageAdvertisement from "../FireBase/modelsWithOperations/HomepageAdvertisement";
import { getCachedAds, saveAdsToCache, hasAdsChanged } from "./adsCacheUtils";
import { getStorage, ref, getDownloadURL } from "firebase/storage";

const CACHE_KEY = "hero_ads_cache";

// 🔹 دالة تصحيح رابط الصور
async function fixStorageUrl(ad) {
  if (!ad.image) return { ...ad, image: "/hero-placeholder.png" };

  try {
    // لو اللينك gs://
    if (ad.image.startsWith("gs://")) {
      const storage = getStorage();
      // استخرج المسار بعد الـ bucket
      const bucketPrefix = "gs://smsark-alaqary.firebasestorage.app/";
      const path = ad.image.replace(bucketPrefix, "");
      const storageRef = ref(storage, path);
      const url = await getDownloadURL(storageRef);
      return { ...ad, image: url };
    }

    // لو اللينك https:// جاهز
    if (ad.image.startsWith("http")) {
      return ad;
    }

    return { ...ad, image: "/hero-placeholder.png" };
  } catch (err) {
    console.error("Error fixing storage URL:", err);
    return { ...ad, image: "/hero-placeholder.png" };
  }
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
        margin: 0,
        padding: 0,
      }}
    >
      {ads.length > 0 && ads[index] && (
        <>
          <Box
            component="img"
            src={ads[index]?.image || "/hero-placeholder.png"}
            alt="slider image"
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
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
              {typeof ads[index].title === "object"
                ? JSON.stringify(ads[index].title)
                : ads[index].title}
              {ads[index].location && (
                <div style={{ fontSize: 14, marginTop: 4 }}>
                  {typeof ads[index].location === "object"
                    ? ads[index].location.full || JSON.stringify(ads[index].location)
                    : ads[index].location}
                </div>
              )}
              {ads[index].description && (
                <div style={{ fontSize: 13, marginTop: 4, color: "#ccc" }}>
                  {typeof ads[index].description === "object"
                    ? JSON.stringify(ads[index].description)
                    : ads[index].description}
                </div>
              )}
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
    if (cachedAds) {
      setAds(cachedAds);
    }

    const unsubscribe = HomepageAdvertisement.subscribeActiveAds(async (newAds) => {
      const fixedAds = await Promise.all(newAds.map(fixStorageUrl));
      if (!cachedAds || hasAdsChanged(cachedAds, fixedAds)) {
        setAds(fixedAds);
        saveAdsToCache(CACHE_KEY, fixedAds);
      }
    });

    if (!cachedAds) {
      HomepageAdvertisement.getActiveAds().then(async (ads) => {
        const fixedAds = await Promise.all(ads.map(fixStorageUrl));
        setAds(fixedAds);
        saveAdsToCache(CACHE_KEY, fixedAds);
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
          fontSize: {
            xs: "2.4rem",
            sm: "2.4rem",
            md: "3rem",
            lg: "4rem",
            xl: "4rem",
          },
        }}
      >
        دوّر على بيتك عندنا
      </Typography>
    </Box>
  );
}
