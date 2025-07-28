// src/Homeparts/adsCacheUtils.js
const CACHE_EXPIRY = 30 * 60 * 1000; // 30 دقيقة

export const getCachedAds = (cacheKey) => {
  try {
    const cached = localStorage.getItem(cacheKey);
    const timestamp = localStorage.getItem(`${cacheKey}_timestamp`);
    
    if (cached && timestamp && (Date.now() - parseInt(timestamp)) < CACHE_EXPIRY) {
      return JSON.parse(cached);
    }
    return null;
  } catch (error) {
    console.error('Error reading cache:', error);
    return null;
  }
};

export const saveAdsToCache = (cacheKey, ads) => {
  try {
    localStorage.setItem(cacheKey, JSON.stringify(ads));
    localStorage.setItem(`${cacheKey}_timestamp`, Date.now().toString());
  } catch (error) {
    console.error('Error saving to cache:', error);
  }
};

export const hasAdsChanged = (oldAds, newAds) => {
  if (!oldAds || !newAds || oldAds.length !== newAds.length) return true;
  
  return newAds.some((newAd, i) => {
    const oldAd = oldAds[i];
    if (!oldAd || !newAd) return true;
    
    // Compare important fields
    return newAd.id !== oldAd.id || 
           newAd.updatedAt?.toMillis() !== oldAd.updatedAt?.toMillis() ||
           newAd.ads !== oldAd.ads;
  });
};