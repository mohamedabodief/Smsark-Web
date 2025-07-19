import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../LoginAndRegister/featuresLR/authSlice";
import userReducer from "../LoginAndRegister/featuresLR/userSlice";
// import propertyReducer from "../property/propertySlice";
// import usersReducer from "../reduxToolkit/slice/usersSlice";
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
    //  users: usersReducer,
        organizations: organizationsReducer,
        admins: adminsReducer,
        profilePic: profilePicReducer,
        clientUser: clientUserReducer,
        properties: propertiesReducer,
        inquiries: inquiriesReducer,
        // auth: authReducer,
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
          // Keep existing ignored paths if ClientAdvertismentSlice also has non-serializable data
          // 'advertisements.somePath',
        ],
      },
    }),
});
