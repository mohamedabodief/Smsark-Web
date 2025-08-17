// src/Homeparts/BestFin.jsx
import {
  Box,
  Typography,
  Card,
  CardMedia,
  CardContent,
  IconButton,
} from "@mui/material";
import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";
import FavoriteButton from "./FavoriteButton";
import { useRef, useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import FinancingAdvertisement from "../FireBase/modelsWithOperations/FinancingAdvertisement";
// import { financingAdsData } from '../FireBase/models/Users/FinAdsData';
import { getCachedAds, saveAdsToCache, hasAdsChanged } from "./adsCacheUtils";

const CACHE_KEY = "fin_ads_cache";

export default function BestFin() {
  const sliderRef = useRef();
  const navigate = useNavigate();
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Duplicate the offers to create a seamless looping effect
  const duplicatedOffers = offers.length > 0 ? [...offers, ...offers] : [];

  const initializeAds = useCallback(async () => {
    try {
      const cachedAds = getCachedAds(CACHE_KEY);
      if (cachedAds) {
        setOffers(cachedAds);
        setLoading(false);
      }

      if (!cachedAds) {
        const activeAds = await FinancingAdvertisement.getActiveAds();
        setOffers(activeAds);
        saveAdsToCache(CACHE_KEY, activeAds);
        setLoading(false);
      }
    } catch (error) {
      console.error("Initialization error:", error);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    initializeAds();
    let unsubscribe = () => {};
     unsubscribe = FinancingAdvertisement.subscribeActiveAds((activeAds) => {
      setOffers((prevOffers) => {
        const currentAds =
          prevOffers.length > 0 ? prevOffers : getCachedAds(CACHE_KEY);
        if (!currentAds || hasAdsChanged(currentAds, activeAds)) {
          saveAdsToCache(CACHE_KEY, activeAds);
          return activeAds;
        }
        return prevOffers;
      });
      setLoading(false);
    });

    const cardWidth = 344; // Card width for calculations
    const cardGap = 24; // Gap between cards (from your `gap: 3`)
    const scrollAmount = cardWidth + cardGap;
    
    // Auto-scrolling logic
    let autoScrollInterval;
    const startAutoScroll = () => {
  if (sliderRef.current) {
        autoScrollInterval = setInterval(() => {
          const container = sliderRef.current;
          const maxScrollLeft = offers.length * scrollAmount;

          if (container.scrollLeft >= maxScrollLeft) {
            // Jump back to the start of the duplicated set
            container.scrollTo({ left: 0, behavior: 'auto' });
          }
          // Now scroll to the next card smoothly
          container.scrollBy({ left: scrollAmount, behavior: 'smooth' });

        }, 2500); // 3-second interval
      }
    };

    
    // Start auto-scroll
    startAutoScroll();

    // Clear interval when user interacts
    const container = sliderRef.current;
    if (container) {
      container.addEventListener('wheel', () => clearInterval(autoScrollInterval), { once: true });
      container.addEventListener('mousedown', () => clearInterval(autoScrollInterval), { once: true });
    }

    return () => {
      unsubscribe();
      clearInterval(autoScrollInterval);
      if (container) {
        container.removeEventListener('wheel', () => clearInterval(autoScrollInterval));
        container.removeEventListener('mousedown', () => clearInterval(autoScrollInterval));
      }
    };
  }, [initializeAds, offers.length]);

  // Manual navigation logic
  const scroll = (direction) => {
    if (!sliderRef.current) return;
    const cardWidth = 344;
    const cardGap = 24;
    const scrollAmount = cardWidth + cardGap;
    
    if (direction === "left") {
      sliderRef.current.scrollBy({ left: -scrollAmount, behavior: "smooth" });
    } else {
      sliderRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <Box sx={{  paddingTop: 15, px: 5 }}>
      <Typography variant="h4" fontWeight="bold" textAlign="center" mb={4}>
        أفضل عروض التمويل
      </Typography>

      <Box sx={{ position: "relative" }}>
        <IconButton
          onClick={() => scroll("left")}
          sx={{
            position: "absolute",
            top: "50%",
            left: -10,
            transform: "translateY(-50%)",
            zIndex: 1,
            backgroundColor: "white",
            boxShadow: 2,
          }}
        >
          <ArrowBackIos sx={{ color: "grey" }} />
        </IconButton>

        <IconButton
          onClick={() => scroll("right")}
          sx={{
            position: "absolute",
            top: "50%",
            right: -10,
            transform: "translateY(-50%)",
            zIndex: 1,
            backgroundColor: "white",
            boxShadow: 2,
          }}
        >
          <ArrowForwardIos sx={{ color: "grey" }} />
        </IconButton>

        <Box
          ref={sliderRef}
          sx={{
            display: "flex",
            overflowX: "hidden",
            gap: 3,
            pb: 2,
            pl: 5,
            // scrollBehavior: "smooth",
            "&::-webkit-scrollbar": { display: "none" },
          }}
        >
          {loading ? (
            <Typography>...جاري تحميل العروض</Typography>
          ) : offers.length === 0 ? (
            <Typography>لا توجد عروض تمويل مفعلة حالياً.</Typography>
          ) : (
            duplicatedOffers.map((item, index) => (
              <Box
                key={`${item?.id}-${index}`}
                onClick={() => navigate(`/details/financingAds/${item.id}`)}
                sx={{
                  cursor: "pointer",
                  flexShrink: 0,
                  minWidth: { xs: 260, sm: 300, md: 320 },
                  width: { xs: 260, sm: 300, md: 320 },
                }}
              >
                <Card
                  sx={{
                    minWidth: { xs: 260, sm: 300, md: 320 },
                    width: { xs: 260, sm: 300, md: 320 },
                    scrollSnapAlign: "start",
                    flexShrink: 0,
                    borderRadius: 3,
                    position: "relative",
                    height: "100%",
                  }}
                >
                  <CardMedia
                    component="img"
                    // objectFit="contain"
                    sx={{ backgroundSize: "contain" }}
                    width="300"
                    height="160"
                    image={item?.images?.[0] || "/no-img.jpeg"}
                  />
                  <FavoriteButton advertisementId={item?.id} />

                  <CardContent>
                    <Typography color="primary" fontWeight="bold">
                      {item?.start_limit?.toLocaleString()} -{" "}
                      {item?.end_limit?.toLocaleString()} ج.م
                    </Typography>
                    <Typography variant="subtitle1">{item?.org_name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {item?.financing_model}
                    </Typography>
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
