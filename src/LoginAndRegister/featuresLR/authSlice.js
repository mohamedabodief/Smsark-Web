// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import loginWithEmailAndPassword from "../../FireBase/authService/loginWithEmailAndPassword";
// import registerWithEmailAndPassword from "../../FireBase/authService/registerWithEmailAndPassword";
// import User from "../../FireBase/modelsWithOperations/User"

// export const loginUser = createAsyncThunk(
//   "auth/loginUser",
//   async ({ email, password }, { rejectWithValue }) => {
//     try {
//       // Attempt to log in with Firebase Authentication
//       const res = await loginWithEmailAndPassword(email, password);

//       // Check if Firebase authentication was successful and a UID is available
//       if (res.success && res.uid) {
//         // If successful, fetch the full user data from Firestore using the User class
//         const userData = await User.getByUid(res.uid);

//         // Check if user data was found in Firestore
//         if (userData) {
//           // Return the full user data including uid, type_of_user, and type_of_organization
//           // This payload will be stored in the Redux state upon fulfillment
//           return {
//             uid: userData.uid,
//             type_of_user: userData.type_of_user,
//             type_of_organization: userData.type_of_organization || null, // Ensure it's null if not set for clients
//           };
//         } else {
//           // If user is authenticated but no profile found in Firestore, reject
//           return rejectWithValue("User profile not found. Please complete registration.");
//         }
//       } else {
//         // If Firebase authentication failed, reject with the error message
//         return rejectWithValue(res.error);
//       }
//     } catch (error) {
//       // Catch any unexpected errors during the process
//       console.error("Login failed:", error);
//       return rejectWithValue(error.message || "An unknown error occurred during login.");
//     }
//   }
// );

// // إنشاء حساب جديد عبر Firebase Auth
// export const registerUser = createAsyncThunk(
//   "auth/registerUser",
//   async ({ email, password }, { rejectWithValue }) => {
//     const res = await registerWithEmailAndPassword(email, password);
//     if (res.success) return res.uid;
//     return rejectWithValue(res.error);
//   }
// );


// const initialState = {
//   uid: null,
//   type_of_user: null,
//   type_of_organization: null,
//   adm_name: null,
//   status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
//   error: null,
// };

// const authSlice = createSlice({
//   name: "auth",
//   initialState,
//   reducers: {
//     logout(state) {
//       state.uid = null;
//       state.type_of_user = null;
//       state.type_of_organization = null;
//       state.adm_name = null;
//       state.status = "idle";
//       state.error = null;
//     },
//     setAuthUserData(state, action) {
//       state.uid = action.payload.uid;
//       state.type_of_user = action.payload.type_of_user;
//       state.type_of_organization = action.payload.type_of_organization || null;
//       state.adm_name = action.payload.adm_name || null;
//       state.status = "succeeded";
//       state.error = null;
//     },
//   },
// extraReducers: (builder) => {
//     builder
//       // Handle pending state for loginUser
//       .addCase(loginUser.pending, (state) => {
//         state.status = "loading";
//         state.error = null;
//       })
//       // Handle fulfilled state for loginUser
//       .addCase(loginUser.fulfilled, (state, action) => {
//         state.status = "succeeded";
//         state.uid = action.payload.uid;
//         state.type_of_user = action.payload.type_of_user;
//         state.type_of_organization = action.payload.type_of_organization;
//         state.adm_name = action.payload.adm_name; // Store admin name from payload
//         console.log("authSlice: loginUser fulfilled, state updated:", {
//           uid: state.uid,
//           type_of_user: state.type_of_user,
//           type_of_organization: state.type_of_organization,
//           adm_name: state.adm_name,
//         });
//       })
//       .addCase(loginUser.rejected, (state, action) => {
//         state.status = "failed";
//         state.error = action.payload;
//         state.uid = null;
//         state.type_of_user = null;
//         state.type_of_organization = null;
//         state.adm_name = null; // Clear admin name on failed login
//         console.error("authSlice: loginUser rejected, error:", action.payload);
//       })
//       // Handle pending state for registerUser
//       .addCase(registerUser.pending, (state) => {
//         state.status = "loading";
//         state.error = null;
//       })
//       // Handle fulfilled state for registerUser
//       .addCase(registerUser.fulfilled, (state, action) => {
//         state.status = "succeeded";
//         state.uid = action.payload;
//         console.log("authSlice: registerUser fulfilled, UID:", state.uid);
//       })
//       .addCase(registerUser.rejected, (state, action) => {
//         state.status = "failed";
//         state.error = action.payload;
//         state.uid = null;
//         console.error("authSlice: registerUser rejected, error:", action.payload);
//       });
//   },
// });

// // Export actions and reducer
// export const { logout, setAuthUserData } = authSlice.actions;
// export default authSlice.reducer;


import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import loginWithEmailAndPassword from "../../FireBase/authService/loginWithEmailAndPassword";
import registerWithEmailAndPassword from "../../FireBase/authService/registerWithEmailAndPassword";
import User from "../../FireBase/modelsWithOperations/User";

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      // 1. محاولة تسجيل الدخول باستخدام Firebase Authentication
      const res = await loginWithEmailAndPassword(email, password);

      if (res.success && res.uid) {
        try {
          // 2. محاولة جلب بيانات المستخدم من Firestore
          let userData = await User.getByUid(res.uid);
          
          // 3. إذا لم يوجد ملف تعريف، ننشئ واحدًا افتراضيًا
          if (!userData) {
            console.warn("No user profile found, creating default profile...");
            const newUser = new User({
              uid: res.uid,
              email: email,
              type_of_user: "client", // قيمة افتراضية
              createdAt: new Date().toISOString()
            });

            await newUser.saveToFirestore();
            userData = await User.getByUid(res.uid);

            if (!userData) {
              return rejectWithValue("Failed to create user profile");
            }
          } else if (!userData.email) {
            // 4. إذا كان المستخدم موجود لكن بدون إيميل، نحدث الإيميل
            console.warn("User profile exists but missing email, updating...");
            await userData.updateInFirestore({ email: email });
            userData.email = email;
          }

          return {
            uid: userData.uid,
            type_of_user: userData.type_of_user,
            type_of_organization: userData.type_of_organization || null,
            adm_name: userData.adm_name || null
          };

        } catch (firestoreError) {
          console.error("Firestore error:", firestoreError);
          return rejectWithValue("Error accessing user data");
        }
      } else {
        return rejectWithValue(res.error || "Authentication failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      return rejectWithValue(
        error.code === "auth/invalid-credential" 
          ? "البريد الإلكتروني أو كلمة المرور غير صحيحة"
          : error.message || "حدث خطأ أثناء تسجيل الدخول"
      );
    }
  }
);

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async ({ email, password, userType = "client" }, { rejectWithValue }) => {
    try {
      const res = await registerWithEmailAndPassword(email, password);
      
      if (res.success && res.uid) {
        // إنشاء ملف مستخدم جديد في Firestore
        const newUser = new User({
          uid: res.uid,
          email: email, // ✅ حفظ الإيميل
          type_of_user: userType,
          createdAt: new Date().toISOString()
        });

        await newUser.saveToFirestore();
        return res.uid;
      } else {
        return rejectWithValue(res.error || "Registration failed");
      }
    } catch (error) {
      console.error("Registration error:", error);
      return rejectWithValue(
        error.code === "auth/email-already-in-use"
          ? "البريد الإلكتروني مستخدم بالفعل"
          : "حدث خطأ أثناء التسجيل"
      );
    }
  }
);

const initialState = {
  uid: null,
  type_of_user: null,
  type_of_organization: null,
  adm_name: null,
  status: "idle",
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.uid = null;
      state.type_of_user = null;
      state.type_of_organization = null;
      state.adm_name = null;
      state.status = "idle";
      state.error = null;
    },
    setAuthUserData(state, action) {
      state.uid = action.payload.uid;
      state.type_of_user = action.payload.type_of_user;
      state.type_of_organization = action.payload.type_of_organization || null;
      state.adm_name = action.payload.adm_name || null;
      state.status = "succeeded";
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
        state.uid = action.payload.uid;
        state.type_of_user = action.payload.type_of_user;
        state.type_of_organization = action.payload.type_of_organization;
        state.adm_name = action.payload.adm_name;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
        state.uid = null;
        state.type_of_user = null;
        state.type_of_organization = null;
        state.adm_name = null;
      })
      .addCase(registerUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.uid = action.payload;
        state.type_of_user = "client"; // Default value, will be updated when profile is saved
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
        state.uid = null;
      });
  },
});

export const { logout, setAuthUserData } = authSlice.actions;
export default authSlice.reducer;