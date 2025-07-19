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
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredPaths: [
          'paidAds.developerAds',          'paidAds.funderAds',
          'advertisements.somePathIfApplicable'
          // Keep existing ignored paths if ClientAdvertismentSlice also has non-serializable data
          // 'advertisements.somePath',
        ],
      },
    }),
});
export default store;