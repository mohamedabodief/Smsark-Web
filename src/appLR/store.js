import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../LoginAndRegister/featuresLR/authSlice";
import userReducer from "../LoginAndRegister/featuresLR/userSlice";
// import propertyReducer from "../property/propertySlice";
import favoritesReducer from "../redux/favoritesSlice"

import propertyReducer from "../RealEstateDeveloperAnnouncement/propertySlice";
import clientAdsReducer from '../feature/ads/clientAdsSlice'
import financingAdsReducer from '../feature/ads/financingAdsSlice'
import developerAdsReducer from "../feature/ads/developerAdsSlice";
import organizationsReducer from "../reduxToolkit/slice/organizationsSlice";
import adminsReducer from "../reduxToolkit/slice/adminsSlice";
import profilePicReducer from "../reduxToolkit/slice/profilePicSlice";
import clientUserReducer from "../reduxToolkit/slice/clientUserSlice";
import propertiesReducer from "../reduxToolkit/slice/propertiesSlice";
import inquiriesReducer from "../reduxToolkit/slice/inquiriesSlice";
import clientAdvertisementsReducer from "../reduxToolkit/slice/ClientAdvertismentSlice";
import paidAdsReducer from "../reduxToolkit/slice/paidAdsSlice";
import adminUsersReducer from "../reduxToolkit/slice/adminUsersSlice";
import financialRequestsReducer from '../reduxToolkit/slice/financialRequestSlice';
export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    // property: propertyReducer,
    favorites: favoritesReducer,
    property: propertyReducer,
    clientAds: clientAdsReducer,
    financingAds: financingAdsReducer,
    developerAds: developerAdsReducer,
    organizations: organizationsReducer,
    admins: adminsReducer,
    profilePic: profilePicReducer,
    clientUser: clientUserReducer,
    properties: propertiesReducer,
    inquiries: inquiriesReducer,
    advertisements: clientAdvertisementsReducer,
    paidAds: paidAdsReducer,
    adminUsers: adminUsersReducer,
    financialRequests: financialRequestsReducer,
  },
    middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredPaths: [
          'paidAds.developerAds',
          'paidAds.funderAds',
          'advertisements.somePathIfApplicable'
        ],
      },
    }),
});
