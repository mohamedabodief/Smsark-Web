import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../FireBase/firebaseConfig";
import ClientUserData from "../../FireBase/models/Users/ClientUserData";
import OrganizationUserData from "../../FireBase/models/Users/OrganizationUserData";
import User from "../../FireBase/modelsWithOperations/User";
import { uploadProfileImage } from '../../FireBase/uploadProfileImage';
import { setAuthUserData } from './authSlice';
// حفظ بيانات الملف الشخصي في Firestore
export const saveUserProfile = createAsyncThunk(
  "user/saveUserProfile",
  async ({ uid, userType, formData }, { rejectWithValue, dispatch }) => {
    try {
      const data =
        userType === "client"
          ? new ClientUserData({ uid, ...formData })
          : new OrganizationUserData({ uid, ...formData });
      // تحويل الكائن إلى plain object
      const plainData = { ...data };
      await setDoc(doc(db, "users", uid), plainData);

      // Update auth state with the correct user type
      dispatch(setAuthUserData({
        uid: uid,
        type_of_user: userType,
        type_of_organization: userType === "organization" ? formData.type_of_organization : null,
        adm_name: userType === "admin" ? formData.adm_name : null,
      }));

      return plainData;
    } catch (error) {
      return rejectWithValue(error.message || "حدث خطأ أثناء حفظ البيانات");
    }
  }
);
// New: Async thunk to fetch user profile from Firestore
export const fetchUserProfile = createAsyncThunk(
  "user/fetchUserProfile",
  async (uid, { rejectWithValue }) => {
    console.log("fetchUserProfile: Received UID:", uid, "Type:", typeof uid); // DEBUG LOG

    // Defensive check: Ensure UID is a non-empty string
    if (typeof uid !== 'string' || uid.trim() === '') {
      console.error("fetchUserProfile: Invalid UID provided. Must be a non-empty string.");
      return rejectWithValue("Invalid user ID provided for profile fetch.");
    }

    try {
      // Use your User class to get the user data by UID
      const userData = await User.getByUid(uid);
      console.log("fetchUserProfile: Data received from User.getByUid:", userData); // NEW DEBUG LOG
      if (userData) {
        // Extract only serializable properties from User class instance
        const plainUserData = {
          uid: userData.uid,
          type_of_user: userData.type_of_user,
          phone: userData.phone,
          image: userData.image,
          city: userData.city,
          governorate: userData.governorate,
          address: userData.address,
          cli_name: userData.cli_name,
          fcm_token: userData.fcm_token,
          gender: userData.gender,
          age: userData.age,
          org_name: userData.org_name,
          type_of_organization: userData.type_of_organization,
          adm_name: userData.adm_name,
          email: userData.email,
        };
        console.log("fetchUserProfile: Converted to plain object:", plainUserData);
        return plainUserData;
      } else {
        console.error("fetchUserProfile: User profile not found in Firestore for UID:", uid); // NEW DEBUG LOG
        return rejectWithValue("User profile not found in Firestore.");
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
      return rejectWithValue(error.message || "Failed to fetch user profile.");
    }
  }
);

// New: Async thunk to update user profile in Firestore
export const updateUserProfile = createAsyncThunk(
  "user/updateUserProfile",
  async ({ uid, updates }, { rejectWithValue }) => {
    console.log("updateUserProfile: Received UID:", uid, "Type:", typeof uid); // DEBUG LOG

    // Defensive check: Ensure UID is a non-empty string
    if (typeof uid !== 'string' || uid.trim() === '') {
      console.error("updateUserProfile: Invalid UID provided. Must be a non-empty string.");
      return rejectWithValue("Invalid user ID provided for profile update.");
    }
    try {
      // Create a User instance and call its updateInFirestore method
      const userInstance = new User({ uid }); // Create a minimal instance just for the update method
      await userInstance.updateInFirestore(updates);
      return updates; // Return the updates that were successfully applied
    } catch (error) {
      console.error("Error updating user profile:", error);
      return rejectWithValue(error.message || "حدث خطأ أثناء تحديث البيانات");
    }
  }
);
// Thunk: Upload profile image to Firebase Storage and save URL to Firestore
export const uploadAndSaveProfileImage = createAsyncThunk(
  'user/uploadAndSaveProfileImage',
  async ({ uid, file }, { rejectWithValue }) => {
    try {
      // Upload image to Firebase Storage
      const imageUrl = await uploadProfileImage(file, uid);
      // Update Firestore with new image URL
      const userInstance = new User({ uid });
      await userInstance.updateInFirestore({ image: imageUrl });
      return { image: imageUrl };
    } catch (error) {
      return rejectWithValue(error.message || 'حدث خطأ أثناء رفع أو حفظ صورة الملف الشخصي');
    }
  }
);
const userSlice = createSlice({
  name: "user",
  initialState: {
    profile: null,
    status: "idle",
    error: null,
  },
  reducers: {
        // Reducer to clear profile data, useful on logout
    clearProfile(state) {
      state.profile = null;
      state.status = "idle";
      state.error = null;
    },
    // Reducer to update profile data locally after a successful update (optimistic update or after API success)
    updateLocalProfile(state, action) {
      if (state.profile) {
        state.profile = { ...state.profile, ...action.payload };
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(saveUserProfile.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(saveUserProfile.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.profile = action.payload;
        console.log("userSlice: saveUserProfile fulfilled, profile set:", state.profile); // NEW DEBUG LOG
      })
      .addCase(saveUserProfile.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
        console.error("userSlice: saveUserProfile rejected, error:", action.payload); // NEW DEBUG LOG
      })
      // Cases for fetchUserProfile
      .addCase(fetchUserProfile.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.profile = action.payload; // Set the profile with the fetched data
        console.log("userSlice: fetchUserProfile fulfilled, profile set:", state.profile); // NEW DEBUG LOG
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
        state.profile = null; // Clear profile on fetch failure
        console.error("userSlice: fetchUserProfile rejected, error:", action.payload); // NEW DEBUG LOG
      })
      // Cases for updateUserProfile
      .addCase(updateUserProfile.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.status = "succeeded";
        // Update the local profile with the changes returned from the thunk
        if (state.profile) {
          state.profile = { ...state.profile, ...action.payload };
        }
        console.log("userSlice: updateUserProfile fulfilled, profile updated:", state.profile); // NEW DEBUG LOG
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
        console.error("userSlice: updateUserProfile rejected, error:", action.payload); // NEW DEBUG LOG
      })
      // Case for uploadAndSaveProfileImage
      .addCase(uploadAndSaveProfileImage.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(uploadAndSaveProfileImage.fulfilled, (state, action) => {
        state.status = "succeeded";
        if (state.profile && action.payload && action.payload.image) {
          state.profile.image = action.payload.image;
        }
      })
      .addCase(uploadAndSaveProfileImage.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});
export const { clearProfile, updateLocalProfile } = userSlice.actions;
export default userSlice.reducer;
