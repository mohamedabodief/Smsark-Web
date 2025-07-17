import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import loginWithEmailAndPassword from "../../FireBase/authService/loginWithEmailAndPassword";
import registerWithEmailAndPassword from "../../FireBase/authService/registerWithEmailAndPassword";

// تسجيل الدخول عبر Firebase Auth
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ email, password }, { rejectWithValue }) => {
    const res = await loginWithEmailAndPassword(email, password);
    if (res.success) return res.uid;
    return rejectWithValue(res.error);
  }
);

// إنشاء حساب جديد عبر Firebase Auth
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async ({ email, password }, { rejectWithValue }) => {
    const res = await registerWithEmailAndPassword(email, password);
    if (res.success) return res.uid;
    return rejectWithValue(res.error);
  }
);

const initialState = {
  uid: null,
  status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.uid = null;
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.uid = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(registerUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.uid = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
