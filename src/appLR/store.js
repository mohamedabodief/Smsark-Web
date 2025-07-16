import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../LoginAndRegister/featuresLR/authSlice";
import userReducer from "../LoginAndRegister/featuresLR/userSlice";
// import propertyReducer from "../property/propertySlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    // property: propertyReducer,
  },
});
