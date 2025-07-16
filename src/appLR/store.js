import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../LoginAndRegister/featuresLR/authSlice";
import userReducer from "../LoginAndRegister/featuresLR/userSlice";

import propertyReducer from "../RealEstateDeveloperAnnouncement/propertySlice";
import clientAdsReducer from '../feature/ads/clientAdsSlice'
import financingAdsReducer from '../feature/ads/financingAdsSlice'
import developerAdsReducer from "../feature/ads/developerAdsSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    property: propertyReducer,
    clientAds: clientAdsReducer,
    financingAds: financingAdsReducer,
    developerAds: developerAdsReducer,
  },
});
