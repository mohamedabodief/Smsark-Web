import { configureStore } from '@reduxjs/toolkit';
import usersReducer from './slice/usersSlice';
import organizationsReducer from './slice/organizationsSlice';
import adminsReducer from './slice/adminsSlice';
import  profilePicReducer from './slice/profilePicSlice';
import propertiesReducer from './slice/propertiesSlice';
import inquiriesReducer from './slice/inquiriesSlice';
import clientUserReducer from './slice/clientUserSlice';
import authReducer from './authSlice';
import advertisementsReducer from './slice/ClientAdvertismentSlice';
import paidAdsReducer from './slice/paidAdsSlice';
import financialRequestsReducer from './slice/financialRequestSlice';
import developerAdsReducer from '../feature/ads/developerAdsSlice';
import financingAdsReducer from '../feature/ads/financingAdsSlice';
import homepageAdsReducer from '../feature/ads/homepageAdsSlice';
import analyticsReducer from './slice/analyticsSlice';
const store = configureStore({
  reducer: {
    users: usersReducer,
    organizations: organizationsReducer,
    admins: adminsReducer,
    profilePic: profilePicReducer,
    clientUser: clientUserReducer,
    properties: propertiesReducer,
    inquiries: inquiriesReducer,
    auth: authReducer,
    advertisements: advertisementsReducer,
    paidAds: paidAdsReducer, // <--- NEW REDUCER KEY
    financialRequests: financialRequestsReducer, // Add this line
    developerAds: developerAdsReducer,
    financingAds: financingAdsReducer,
    homepageAds: homepageAdsReducer,
    analytics: analyticsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredPaths: [
          'paidAds.developerAds',
          'paidAds.funderAds',
          'advertisements.list',
          'advertisements.currentAd',
          // Ignore any remaining subscription paths
          'homepageAds.subscriptions',
          'developerAds.subscriptions',
          'financingAds.subscriptions',
        ],
        ignoredActions: [
          // Ignore actions that might contain non-serializable values
          'homepageAds/subscribeToUser/fulfilled',
          'homepageAds/subscribeToAll/fulfilled',
          'homepageAds/subscribeByStatus/fulfilled',
        ],
      },
    }),
});
export default store;