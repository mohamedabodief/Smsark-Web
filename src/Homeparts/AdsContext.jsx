// src/Homeparts/AdsContext.js
import { createContext, useContext, useEffect, useState } from 'react';
import RealEstateDeveloperAdvertisement from '../FireBase/modelsWithOperations/RealEstateDeveloperAdvertisement';

const AdsContext = createContext();

export function AdsProvider({ children }) {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. جلب البيانات من الكاش أولًا
    const cached = localStorage.getItem('devAdsCache');
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        setOffers(parsed);
        setLoading(false);
      } catch (e) {
        console.warn('❌ Failed to parse localStorage cache:', e);
        localStorage.removeItem('devAdsCache');
      }
    }

    // 2. الاشتراك مع Firebase لمتابعة التحديثات
    const unsubscribe = RealEstateDeveloperAdvertisement.subscribeActiveAds((ads) => {
      const activeAds = ads.filter(ad => ad.ads === true);
      const oldCache = JSON.stringify(localStorage.getItem('devAdsCache'));
      const newCache = JSON.stringify(activeAds);

      if (oldCache !== newCache) {
        console.log('🔁 Firebase data updated, syncing...');
        setOffers(activeAds);
        localStorage.setItem('devAdsCache', newCache);
      }
      setLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <AdsContext.Provider value={{ offers, loading }}>
      {children}
    </AdsContext.Provider>
  );
}

export function useAds() {
  return useContext(AdsContext);
}
