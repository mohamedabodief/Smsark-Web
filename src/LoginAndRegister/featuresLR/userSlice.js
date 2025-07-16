import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../FireBase/firebaseConfig";
import ClientUserData from "../../FireBase/models/Users/ClientUserData";
import OrganizationUserData from "../../FireBase/models/Users/OrganizationUserData";

// حفظ بيانات الملف الشخصي في Firestore
export const saveUserProfile = createAsyncThunk(
  "user/saveUserProfile",
  async ({ uid, userType, formData }, { rejectWithValue }) => {
    try {
      const data =
        userType === "client"
          ? new ClientUserData({ uid, ...formData })
          : new OrganizationUserData({ uid, ...formData });
      // تحويل الكائن إلى plain object
      const plainData = { ...data };
      await setDoc(doc(db, "users", uid), plainData);
      return plainData;
    } catch (error) {
      return rejectWithValue(error.message || "حدث خطأ أثناء حفظ البيانات");
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
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(saveUserProfile.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(saveUserProfile.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.profile = action.payload;
      })
      .addCase(saveUserProfile.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default userSlice.reducer;
