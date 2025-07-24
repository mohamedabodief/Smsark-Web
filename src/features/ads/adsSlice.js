// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import RealEstateDeveloperAdvertisement from '../../FireBase/modelsWithOperations/RealEstateDeveloperAdvertisement'

// // 1. عمل thunk لتحميل البيانات من Firebase باستخدام الـ class الجاهز
// export const fetchActiveAds = createAsyncThunk(
//   'ads/fetchActiveAds',
//   async (_, thunkAPI) => {
//     return new Promise((resolve, reject) => {
//       // نستخدم الدالة subscribeActiveAds للمتابعة اللحظية للبيانات
//       const unsubscribe = RealEstateDeveloperAdvertisement.subscribeActiveAds((ads) => {
//         resolve(ads);
//       });
//       // return () => unsubscribe();
//     });
//   }
// );
// const adsSlice = createSlice({
//   name: 'ads',
//   initialState: {
//     adsList: [],
//     status: 'idle', // idle | loading | succeeded | failed
//     error: null,
//   },
//   reducers: {
//     // ممكن تضيفي دوال عادية لو حابة
//   },
//   extraReducers(builder) {
//     builder
//       .addCase(fetchActiveAds.pending, (state, action) => {
//         state.status = 'loading';
//       })
//       .addCase(fetchActiveAds.fulfilled, (state, action) => {
//         state.status = 'succeeded';
//         state.adsList = action.payload;
//       })
//       .addCase(fetchActiveAds.rejected, (state, action) => {
//         state.status = 'failed';
//         state.error = action.error.message;
//       });
//   },
// });

// export default adsSlice.reducer;
