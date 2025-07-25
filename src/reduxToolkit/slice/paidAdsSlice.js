// // src/reduxToolkit/slice/paidAdsSlice.js (Renamed file)
// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import FinancingAdvertisement from '../../FireBase/modelsWithOperations/FinancingAdvertisement'; // Adjust path
// import RealEstateDeveloperAdvertisement from '../../FireBase/modelsWithOperations/RealEstateDeveloperAdvertisement'; // Adjust path

// const initialState = {
//   developerAds: [],
//   funderAds: [],
//   loading: {
//     developer: false,
//     funder: false,
//   },
//   error: {
//     developer: null,
//     funder: null,
//   },
// };

// export const deleteAd = createAsyncThunk(
//   'paidAds/deleteAd', // Action type prefix changed
//   async ({ id, type }, { rejectWithValue }) => {
//     try {
//       console.log('[deleteAd] Called with:', { id, type });
//       if (type === 'developer') {
//         const ad = await RealEstateDeveloperAdvertisement.getById(id);
//         if (!ad) throw new Error('Ad not found');
//         await ad.delete();
//       } else if (type === 'funder') {
//         const ad = await FinancingAdvertisement.getById(id);
//         if (!ad) throw new Error('Ad not found');
//         await ad.delete();
//       } else {
//         throw new Error('Invalid ad type for deletion.');
//       }
//       console.log(`[deleteAd] Successfully deleted ${type} ad with ID: ${id}`);
//       return { id, type };
//     } catch (error) {
//       console.error('[deleteAd] Error:', error, error?.stack);
//       return rejectWithValue(error.message || error.toString() || 'Failed to delete ad');
//     }
//   }
// );

// export const toggleAdStatus = createAsyncThunk(
//   'paidAds/toggleAdStatus',
//   async ({ ad, type, days }, { rejectWithValue }) => {
//     try {
//       console.log('[toggleAdStatus] Called with:', { ad, type, days });
//       if (!ad || !ad.id) {
//         console.error('[toggleAdStatus] Invalid ad object:', ad);
//         throw new Error('Invalid ad object: missing id');
//       }
//       let instance;
//       if (type === 'developer') {
//         const fullAd = await RealEstateDeveloperAdvertisement.getById(ad.id);
//         if (!fullAd) throw new Error('Ad not found');
//         instance = fullAd;
//       } else if (type === 'funder') {
//         const fullAd = await FinancingAdvertisement.getById(ad.id);
//         if (!fullAd) throw new Error('Ad not found');
//         instance = fullAd;
//       } else {
//         throw new Error('Unknown advertisement type.');
//       }
//       const currentAdsStatus = ad.ads;
//       if (currentAdsStatus === true) {
//         await instance.removeAds();
//       } else {
//         await instance.adsActivation(days);
//       }
//       console.log(`[toggleAdStatus] Successfully toggled ${type} ad status for ID: ${ad.id} to ${!currentAdsStatus}`);
//       return { id: ad.id, type, newStatus: !currentAdsStatus };
//     } catch (error) {
//       console.error('[toggleAdStatus] Error:', error, error?.stack);
//       return rejectWithValue(error.message || error.toString() || 'Failed to toggle ad status');
//     }
//   }
// );

// // --- NEW THUNKS FOR FULL CRUD/REVIEW OPERATIONS ---

// // Approve Ad
// export const approveAd = createAsyncThunk(
//   'paidAds/approveAd',
//   async ({ id, type }, { rejectWithValue }) => {
//     try {
//       console.log('[approveAd] Called with:', { id, type });
//       let instance;
//       if (type === 'developer') {
//         const ad = await RealEstateDeveloperAdvertisement.getById(id);
//         if (!ad) throw new Error('Ad not found');
//         instance = ad;
//       } else if (type === 'funder') {
//         const ad = await FinancingAdvertisement.getById(id);
//         if (!ad) throw new Error('Ad not found');
//         instance = ad;
//       } else {
//         throw new Error('Unknown ad type');
//       }
//       await instance.approve();
//       return { id, type };
//     } catch (error) {
//       console.error('[approveAd] Error:', error, error?.stack);
//       return rejectWithValue(error.message || error.toString() || 'Failed to approve ad');
//     }
//   }
// );

// // Reject Ad
// export const rejectAd = createAsyncThunk(
//   'paidAds/rejectAd',
//   async ({ id, type, reason }, { rejectWithValue }) => {
//     try {
//       console.log('[rejectAd] Called with:', { id, type, reason });
//       let instance;
//       if (type === 'developer') {
//         const ad = await RealEstateDeveloperAdvertisement.getById(id);
//         if (!ad) throw new Error('Ad not found');
//         instance = ad;
//       } else if (type === 'funder') {
//         const ad = await FinancingAdvertisement.getById(id);
//         if (!ad) throw new Error('Ad not found');
//         instance = ad;
//       } else {
//         throw new Error('Unknown ad type');
//       }
//       await instance.reject(reason);
//       return { id, type, reason };
//     } catch (error) {
//       console.error('[rejectAd] Error:', error, error?.stack);
//       return rejectWithValue(error.message || error.toString() || 'Failed to reject ad');
//     }
//   }
// );

// // Return Ad to Pending
// export const returnAdToPending = createAsyncThunk(
//   'paidAds/returnAdToPending',
//   async ({ id, type }, { rejectWithValue }) => {
//     try {
//       console.log('[returnAdToPending] Called with:', { id, type });
//       let instance;
//       if (type === 'developer') {
//         const ad = await RealEstateDeveloperAdvertisement.getById(id);
//         if (!ad) throw new Error('Ad not found');
//         instance = ad;
//       } else if (type === 'funder') {
//         const ad = await FinancingAdvertisement.getById(id);
//         if (!ad) throw new Error('Ad not found');
//         instance = ad;
//       } else {
//         throw new Error('Unknown ad type');
//       }
//       await instance.returnToPending();
//       return { id, type };
//     } catch (error) {
//       console.error('[returnAdToPending] Error:', error, error?.stack);
//       return rejectWithValue(error.message || error.toString() || 'Failed to return ad to pending');
//     }
//   }
// );

// // Fetch All Ads
// export const fetchAllAds = createAsyncThunk(
//   'paidAds/fetchAllAds',
//   async ({ type }, { rejectWithValue }) => {
//     try {
//       let ads;
//       if (type === 'developer') {
//         ads = await RealEstateDeveloperAdvertisement.getAll();
//       } else if (type === 'funder') {
//         ads = await FinancingAdvertisement.getAll();
//       } else {
//         throw new Error('Unknown ad type');
//       }
//       return { type, ads };
//     } catch (error) {
//       return rejectWithValue(error.message || 'Failed to fetch ads');
//     }
//   }
// );

// // Fetch Ads by Review Status
// export const fetchAdsByReviewStatus = createAsyncThunk(
//   'paidAds/fetchAdsByReviewStatus',
//   async ({ type, status }, { rejectWithValue }) => {
//     try {
//       let ads;
//       if (type === 'developer') {
//         ads = await RealEstateDeveloperAdvertisement.getByReviewStatus(status);
//       } else if (type === 'funder') {
//         ads = await FinancingAdvertisement.getByReviewStatus(status);
//       } else {
//         throw new Error('Unknown ad type');
//       }
//       return { type, ads, status };
//     } catch (error) {
//       return rejectWithValue(error.message || 'Failed to fetch ads by review status');
//     }
//   }
// );

// // Fetch Ads by User
// export const fetchAdsByUser = createAsyncThunk(
//   'paidAds/fetchAdsByUser',
//   async ({ type, userId }, { rejectWithValue }) => {
//     try {
//       let ads;
//       if (type === 'developer') {
//         ads = await RealEstateDeveloperAdvertisement.getByUserId(userId);
//       } else if (type === 'funder') {
//         ads = await FinancingAdvertisement.getByUserId(userId);
//       } else {
//         throw new Error('Unknown ad type');
//       }
//       return { type, ads, userId };
//     } catch (error) {
//       return rejectWithValue(error.message || 'Failed to fetch ads by user');
//     }
//   }
// );

// // Create Ad
// export const createAd = createAsyncThunk(
//   'paidAds/createAd',
//   async ({ type, adData, imageFiles = [], receiptFile = null }, { rejectWithValue }) => {
//     try {
//       let instance, id, createdAd;
//       if (type === 'developer') {
//         instance = new RealEstateDeveloperAdvertisement(adData);
//         id = await instance.save(imageFiles, receiptFile);
//         createdAd = await RealEstateDeveloperAdvertisement.getById(id);
//       } else if (type === 'funder') {
//         instance = new FinancingAdvertisement(adData);
//         id = await instance.save(imageFiles, receiptFile);
//         createdAd = await FinancingAdvertisement.getById(id);
//       } else {
//         throw new Error('Unknown ad type');
//       }
//       return { id, type, ad: createdAd };
//     } catch (error) {
//       return rejectWithValue(error.message || 'Failed to create ad');
//     }
//   }
// );

// // Update Ad
// export const updateAd = createAsyncThunk(
//   'paidAds/updateAd',
//   async ({ type, id, updates, newImageFiles = null, newReceiptFile = null }, { rejectWithValue }) => {
//     try {
//       console.log('[updateAd] Called with:', { id, type, updates });
//       let instance;
//       if (type === 'developer') {
//         const ad = await RealEstateDeveloperAdvertisement.getById(id);
//         if (!ad) throw new Error('Ad not found');
//         instance = ad;
//       } else if (type === 'funder') {
//         const ad = await FinancingAdvertisement.getById(id);
//         if (!ad) throw new Error('Ad not found');
//         instance = ad;
//       } else {
//         throw new Error('Unknown ad type');
//       }
//       await instance.update(updates, newImageFiles, newReceiptFile);
//       return { id, type, updates };
//     } catch (error) {
//       console.error('[updateAd] Error:', error, error?.stack);
//       return rejectWithValue(error.message || error.toString() || 'Failed to update ad');
//     }
//   }
// );

// const paidAdsSlice = createSlice({ // Slice name changed
//   name: 'paidAds', // Slice name property changed
//   initialState,
//   reducers: {
//     setDeveloperAds(state, action) {
//       state.developerAds = action.payload;
//       state.loading.developer = false;
//       state.error.developer = null;
//     },
//     setFunderAds(state, action) {
//       state.funderAds = action.payload;
//       state.loading.funder = false;
//       state.error.funder = null;
//     },
//     setLoadingDeveloper(state, action) {
//       state.loading.developer = action.payload;
//       if (action.payload) state.error.developer = null;
//     },
//     setLoadingFunder(state, action) {
//       state.loading.funder = action.payload;
//       if (action.payload) state.error.funder = null;
//     },
//     setErrorDeveloper(state, action) {
//       state.error.developer = action.payload;
//       state.loading.developer = false;
//     },
//     setErrorFunder(state, action) {
//       state.error.funder = action.payload;
//       state.loading.funder = false;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(deleteAd.pending, (state) => {
//         // No explicit loading state change here, handled by individual ad loading if needed
//       })
//       .addCase(deleteAd.fulfilled, (state, action) => {
//         const { id, type } = action.payload;
//         if (type === 'developer') {
//           state.developerAds = state.developerAds.filter(ad => ad.id !== id);
//         } else if (type === 'funder') {
//           state.funderAds = state.funderAds.filter(ad => ad.id !== id);
//         }
//       })
//       .addCase(deleteAd.rejected, (state, action) => {
//         console.error("Delete ad failed:", action.payload);
//         // You might want to set a global error state or specific ad error here
//       })
//       .addCase(toggleAdStatus.pending, (state) => {
//         // No explicit loading state change here, handled by individual ad loading if needed
//       })
//       .addCase(toggleAdStatus.fulfilled, (state, action) => {
//         const { id, type, newStatus } = action.payload;
//         if (type === 'developer') {
//           const adIndex = state.developerAds.findIndex(ad => ad.id === id);
//           if (adIndex !== -1) {
//             state.developerAds[adIndex].ads = newStatus; // Update the 'ads' status
//           }
//         } else if (type === 'funder') {
//           const adIndex = state.funderAds.findIndex(ad => ad.id === id);
//           if (adIndex !== -1) {
//             state.funderAds[adIndex].ads = newStatus; // Update the 'ads' status
//           }
//         }
//       })
//       .addCase(toggleAdStatus.rejected, (state, action) => {
//         console.error("Toggle ad status failed:", action.payload);
//         // You might want to set a global error state or specific ad error here
//       })
//       // Approve Ad
//       .addCase(approveAd.fulfilled, (state, action) => {
//         const { id, type } = action.payload;
//         const adsArr = type === 'developer' ? state.developerAds : state.funderAds;
//         const adIndex = adsArr.findIndex(ad => ad.id === id);
//         if (adIndex !== -1) {
//           adsArr[adIndex].reviewStatus = 'approved';
//         }
//       })
//       // Reject Ad
//       .addCase(rejectAd.fulfilled, (state, action) => {
//         const { id, type, reason } = action.payload;
//         const adsArr = type === 'developer' ? state.developerAds : state.funderAds;
//         const adIndex = adsArr.findIndex(ad => ad.id === id);
//         if (adIndex !== -1) {
//           adsArr[adIndex].reviewStatus = 'rejected';
//           adsArr[adIndex].review_note = reason;
//         }
//       })
//       // Return to Pending
//       .addCase(returnAdToPending.fulfilled, (state, action) => {
//         const { id, type } = action.payload;
//         const adsArr = type === 'developer' ? state.developerAds : state.funderAds;
//         const adIndex = adsArr.findIndex(ad => ad.id === id);
//         if (adIndex !== -1) {
//           adsArr[adIndex].reviewStatus = 'pending';
//         }
//       })
//       // Fetch All Ads
//       .addCase(fetchAllAds.fulfilled, (state, action) => {
//         const { type, ads } = action.payload;
//         if (type === 'developer') {
//           state.developerAds = ads;
//         } else if (type === 'funder') {
//           state.funderAds = ads;
//         }
//       })
//       // Fetch Ads by Review Status
//       .addCase(fetchAdsByReviewStatus.fulfilled, (state, action) => {
//         const { type, ads } = action.payload;
//         if (type === 'developer') {
//           state.developerAds = ads;
//         } else if (type === 'funder') {
//           state.funderAds = ads;
//         }
//       })
//       // Fetch Ads by User
//       .addCase(fetchAdsByUser.fulfilled, (state, action) => {
//         const { type, ads } = action.payload;
//         if (type === 'developer') {
//           state.developerAds = ads;
//         } else if (type === 'funder') {
//           state.funderAds = ads;
//         }
//       })
//       // Create Ad
//       .addCase(createAd.fulfilled, (state, action) => {
//         const { type, ad } = action.payload;
//         if (type === 'developer') {
//           state.developerAds.push(ad);
//         } else if (type === 'funder') {
//           state.funderAds.push(ad);
//         }
//       })
//       // Update Ad
//       .addCase(updateAd.fulfilled, (state, action) => {
//         const { id, type, updates } = action.payload;
//         const adsArr = type === 'developer' ? state.developerAds : state.funderAds;
//         const adIndex = adsArr.findIndex(ad => ad.id === id);
//         if (adIndex !== -1) {
//           adsArr[adIndex] = { ...adsArr[adIndex], ...updates };
//         }
//       });
//   },
// });

// export const {
//   setDeveloperAds,
//   setFunderAds,
//   setLoadingDeveloper,
//   setLoadingFunder,
//   setErrorDeveloper,
//   setErrorFunder,
// } = paidAdsSlice.actions;

// export default paidAdsSlice.reducer;

// // // src/redux/paidAdsSlice.js (Renamed file)
// // import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// // import FinancingAdvertisement from '../../FireBase/modelsWithOperations/FinancingAdvertisement'; // Adjust path
// // import RealEstateDeveloperAdvertisement from '../../FireBase/modelsWithOperations/RealEstateDeveloperAdvertisement'; // Adjust path

// // const initialState = {
// //   developerAds: [],
// //   funderAds: [],
// //   loading: {
// //     developer: false,
// //     funder: false,
// //   },
// //   error: {
// //     developer: null,
// //     funder: null,
// //   },
// // };

// // export const deleteAd = createAsyncThunk(
// //   'paidAds/deleteAd', // Action type prefix changed
// //   async ({ id, type }, { rejectWithValue }) => {
// //     try {
// //       if (type === 'developer') {
// //         const devAdInstance = new RealEstateDeveloperAdvertisement({ id });
// //         await devAdInstance.delete();
// //       } else if (type === 'funder') {
// //         const fundAdInstance = new FinancingAdvertisement({ id });
// //         await fundAdInstance.delete();
// //       }
// //       return { id, type };
// //     } catch (error) {
// //       return rejectWithValue(error.message || 'Failed to delete ad');
// //     }
// //   }
// // );

// // export const toggleAdStatus = createAsyncThunk(
// //   'paidAds/toggleAdStatus', // Action type prefix changed
// //   async ({ ad, type }, { rejectWithValue }) => {
// //     try {
// //       let instance;
// //       const currentAdsStatus = ad.ads;

// //       if (type === 'developer') {
// //         instance = new RealEstateDeveloperAdvertisement({ id: ad.id });
// //       } else if (type === 'funder') {
// //         instance = new FinancingAdvertisement({ id: ad.id });
// //       } else {
// //         throw new Error("Unknown advertisement type.");
// //       }

// //       if (currentAdsStatus === true) {
// //         await instance.removeAds();
// //       } else {
// //         await instance.adsActivation(30);
// //       }
// //       return { id: ad.id, type, newStatus: !currentAdsStatus };
// //     } catch (error) {
// //       return rejectWithValue(error.message || 'Failed to toggle ad status');
// //     }
// //   }
// // );

// // const paidAdsSlice = createSlice({ // Slice name changed
// //   name: 'paidAds', // Slice name property changed
// //   initialState,
// //   reducers: {
// //     setDeveloperAds(state, action) {
// //       state.developerAds = action.payload;
// //       state.loading.developer = false;
// //       state.error.developer = null;
// //     },
// //     setFunderAds(state, action) {
// //       state.funderAds = action.payload;
// //       state.loading.funder = false;
// //       state.error.funder = null;
// //     },
// //     setLoadingDeveloper(state, action) {
// //       state.loading.developer = action.payload;
// //       if (action.payload) state.error.developer = null;
// //     },
// //     setLoadingFunder(state, action) {
// //       state.loading.funder = action.payload;
// //       if (action.payload) state.error.funder = null;
// //     },
// //     setErrorDeveloper(state, action) {
// //       state.error.developer = action.payload;
// //       state.loading.developer = false;
// //     },
// //     setErrorFunder(state, action) {
// //       state.error.funder = action.payload;
// //       state.loading.funder = false;
// //     },
// //   },
// //   extraReducers: (builder) => {
// //     builder
// //       .addCase(deleteAd.pending, (state) => {})
// //       .addCase(deleteAd.fulfilled, (state, action) => {})
// //       .addCase(deleteAd.rejected, (state, action) => { console.error("Delete ad failed:", action.payload); })
// //       .addCase(toggleAdStatus.pending, (state) => {})
// //       .addCase(toggleAdStatus.fulfilled, (state, action) => {})
// //       .addCase(toggleAdStatus.rejected, (state, action) => { console.error("Toggle ad status failed:", action.payload); });
// //   },
// // });

// // export const {
// //   setDeveloperAds,
// //   setFunderAds,
// //   setLoadingDeveloper,
// //   setLoadingFunder,
// //   setErrorDeveloper,
// //   setErrorFunder,
// // } = paidAdsSlice.actions;

// // export default paidAdsSlice.reducer;
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import FinancingAdvertisement from '../../FireBase/modelsWithOperations/FinancingAdvertisement';
import RealEstateDeveloperAdvertisement from '../../FireBase/modelsWithOperations/RealEstateDeveloperAdvertisement';
import { auth } from '../../FireBase/firebaseConfig'; // Import auth for user checks
import User from '../../FireBase/modelsWithOperations/User'; // Import User for admin checks

const initialState = {
  developerAds: [],
  funderAds: [],
  loading: {
    developer: false,
    funder: false,
  },
  error: {
    developer: null,
    funder: null,
  },
};

// Helper function to convert ad instance to plain object
const toPlainAd = (ad) => ({
  id: ad.id,
  title: ad.title,
  description: ad.description,
  images: ad.images,
  phone: ad.phone,
  userId: ad.userId,
  ads: ad.ads,
  adExpiryTime: ad.adExpiryTime,
  reviewStatus: ad.reviewStatus,
  reviewed_by: ad.reviewed_by,
  review_note: ad.review_note,
  status: ad.status,
  receipt_image: ad.receipt_image,
  // Developer-specific fields
  developer_name: ad.developer_name,
  price_start_from: ad.price_start_from,
  price_end_to: ad.price_end_to,
  location: ad.location,
  rooms: ad.rooms,
  bathrooms: ad.bathrooms,
  floor: ad.floor,
  furnished: ad.furnished,
  type_of_user: ad.type_of_user,
  // Funder-specific fields
  financing_model: ad.financing_model,
  start_limit: ad.start_limit,
  end_limit: ad.end_limit,
  org_name: ad.org_name,
  interest_rate_upto_5: ad.interest_rate_upto_5,
  interest_rate_upto_10: ad.interest_rate_upto_10,
  interest_rate_above_10: ad.interest_rate_above_10,
});

// Async Thunk for deleting an ad
export const deleteAd = createAsyncThunk(
  'paidAds/deleteAd',
  async ({ id, type }, { rejectWithValue }) => {
    try {
      if (!auth.currentUser) {
        throw new Error('يجب تسجيل الدخول أولاً');
      }
      const user = await User.getByUid(auth.currentUser.uid);
      if (user.type_of_user !== 'admin') {
        throw new Error('فقط المشرفون يمكنهم حذف الإعلانات');
      }
      console.log('[deleteAd] Called with:', { id, type });
      let ad;
      if (type === 'developer') {
        ad = await RealEstateDeveloperAdvertisement.getById(id);
        if (!ad) throw new Error('إعلان المطور غير موجود');
        await ad.delete();
      } else if (type === 'funder') {
        ad = await FinancingAdvertisement.getById(id);
        if (!ad) throw new Error('إعلان التمويل غير موجود');
        await ad.delete();
      } else {
        throw new Error('نوع الإعلان غير صالح');
      }
      console.log(`[deleteAd] Successfully deleted ${type} ad with ID: ${id}`);
      return { id, type };
    } catch (error) {
      console.error('[deleteAd] Error:', error, error?.stack);
      return rejectWithValue(error.message || 'فشل حذف الإعلان');
    }
  }
);

// Async Thunk for toggling ad status (activate/deactivate)
export const toggleAdStatus = createAsyncThunk(
  'paidAds/toggleAdStatus',
  async ({ adId, type, days }, { rejectWithValue }) => {
    try {
      if (!auth.currentUser) {
        throw new Error('يجب تسجيل الدخول أولاً');
      }
      const user = await User.getByUid(auth.currentUser.uid);
      if (user.type_of_user !== 'admin') {
        throw new Error('فقط المشرفون يمكنهم تفعيل/إلغاء تفعيل الإعلانات');
      }
      console.log('[toggleAdStatus] Called with:', { adId, type, days });
      let instance;
      if (type === 'developer') {
        instance = await RealEstateDeveloperAdvertisement.getById(adId);
        if (!instance) throw new Error('إعلان المطور غير موجود');
      } else if (type === 'funder') {
        instance = await FinancingAdvertisement.getById(adId);
        if (!instance) throw new Error('إعلان التمويل غير موجود');
      } else {
        throw new Error('نوع الإعلان غير صالح');
      }
      const currentAdsStatus = instance.ads;
      if (currentAdsStatus) {
        await instance.removeAds();
      } else {
        if (!days) throw new Error('يجب تحديد عدد الأيام لتفعيل الإعلان');
        await instance.adsActivation(days);
      }
      console.log(`[toggleAdStatus] Successfully toggled ${type} ad status for ID: ${adId} to ${!currentAdsStatus}`);
      return { id: adId, type, ad: toPlainAd(instance) };
    } catch (error) {
      console.error('[toggleAdStatus] Error:', error, error?.stack);
      return rejectWithValue(error.message || 'فشل تفعيل/إلغاء تفعيل الإعلان');
    }
  }
);

// Async Thunk for approving an ad
export const approveAd = createAsyncThunk(
  'paidAds/approveAd',
  async ({ id, type }, { rejectWithValue }) => {
    try {
      if (!auth.currentUser) {
        throw new Error('يجب تسجيل الدخول أولاً');
      }
      const user = await User.getByUid(auth.currentUser.uid);
      if (user.type_of_user !== 'admin') {
        throw new Error('فقط المشرفون يمكنهم الموافقة على الإعلانات');
      }
      console.log('[approveAd] Called with:', { id, type });
      let instance;
      if (type === 'developer') {
        instance = await RealEstateDeveloperAdvertisement.getById(id);
        if (!instance) throw new Error('إعلان المطور غير موجود');
        await instance.approve();
      } else if (type === 'funder') {
        instance = await FinancingAdvertisement.getById(id);
        if (!instance) throw new Error('إعلان التمويل غير موجود');
        await instance.approve();
      } else {
        throw new Error('نوع الإعلان غير صالح');
      }
      return { id, type, ad: toPlainAd(instance) };
    } catch (error) {
      console.error('[approveAd] Error:', error, error?.stack);
      return rejectWithValue(error.message || 'فشل الموافقة على الإعلان');
    }
  }
);

// Async Thunk for rejecting an ad
export const rejectAd = createAsyncThunk(
  'paidAds/rejectAd',
  async ({ id, type, reason }, { rejectWithValue }) => {
    try {
      if (!auth.currentUser) {
        throw new Error('يجب تسجيل الدخول أولاً');
      }
      const user = await User.getByUid(auth.currentUser.uid);
      if (user.type_of_user !== 'admin') {
        throw new Error('فقط المشرفون يمكنهم رفض الإعلانات');
      }
      console.log('[rejectAd] Called with:', { id, type, reason });
      let instance;
      if (type === 'developer') {
        instance = await RealEstateDeveloperAdvertisement.getById(id);
        if (!instance) throw new Error('إعلان المطور غير موجود');
        await instance.reject(reason);
      } else if (type === 'funder') {
        instance = await FinancingAdvertisement.getById(id);
        if (!instance) throw new Error('إعلان التمويل غير موجود');
        await instance.reject(reason);
      } else {
        throw new Error('نوع الإعلان غير صالح');
      }
      return { id, type, reason, ad: toPlainAd(instance) };
    } catch (error) {
      console.error('[rejectAd] Error:', error, error?.stack);
      return rejectWithValue(error.message || 'فشل رفض الإعلان');
    }
  }
);

// Async Thunk for returning an ad to pending
export const returnAdToPending = createAsyncThunk(
  'paidAds/returnAdToPending',
  async ({ id, type }, { rejectWithValue }) => {
    try {
      if (!auth.currentUser) {
        throw new Error('يجب تسجيل الدخول أولاً');
      }
      const user = await User.getByUid(auth.currentUser.uid);
      if (user.type_of_user !== 'admin') {
        throw new Error('فقط المشرفون يمكنهم إعادة الإعلان للمراجعة');
      }
      console.log('[returnAdToPending] Called with:', { id, type });
      let instance;
      if (type === 'developer') {
        instance = await RealEstateDeveloperAdvertisement.getById(id);
        if (!instance) throw new Error('إعلان المطور غير موجود');
        await instance.returnToPending();
      } else if (type === 'funder') {
        instance = await FinancingAdvertisement.getById(id);
        if (!instance) throw new Error('إعلان التمويل غير موجود');
        await instance.returnToPending();
      } else {
        throw new Error('نوع الإعلان غير صالح');
      }
      return { id, type, ad: toPlainAd(instance) };
    } catch (error) {
      console.error('[returnAdToPending] Error:', error, error?.stack);
      return rejectWithValue(error.message || 'فشل إعادة الإعلان للمراجعة');
    }
  }
);

// Async Thunk for fetching all ads
export const fetchAllAds = createAsyncThunk(
  'paidAds/fetchAllAds',
  async ({ type }, { rejectWithValue }) => {
    try {
      if (!auth.currentUser) {
        throw new Error('يجب تسجيل الدخول أولاً');
      }
      let ads;
      if (type === 'developer') {
        ads = await RealEstateDeveloperAdvertisement.getAll();
      } else if (type === 'funder') {
        ads = await FinancingAdvertisement.getAll();
      } else {
        throw new Error('نوع الإعلان غير صالح');
      }
      return { type, ads: ads.map(toPlainAd) };
    } catch (error) {
      return rejectWithValue(error.message || 'فشل جلب الإعلانات');
    }
  }
);

// Async Thunk for fetching ads by review status
export const fetchAdsByReviewStatus = createAsyncThunk(
  'paidAds/fetchAdsByReviewStatus',
  async ({ type, status }, { rejectWithValue }) => {
    try {
      if (!auth.currentUser) {
        throw new Error('يجب تسجيل الدخول أولاً');
      }
      let ads;
      if (type === 'developer') {
        ads = await RealEstateDeveloperAdvertisement.getByReviewStatus(status);
      } else if (type === 'funder') {
        ads = await FinancingAdvertisement.getByReviewStatus(status);
      } else {
        throw new Error('نوع الإعلان غير صالح');
      }
      return { type, ads: ads.map(toPlainAd), status };
    } catch (error) {
      return rejectWithValue(error.message || 'فشل جلب الإعلانات حسب حالة المراجعة');
    }
  }
);

// Async Thunk for fetching ads by user
export const fetchAdsByUser = createAsyncThunk(
  'paidAds/fetchAdsByUser',
  async ({ type, userId }, { rejectWithValue }) => {
    try {
      if (!auth.currentUser) {
        throw new Error('يجب تسجيل الدخول أولاً');
      }
      let ads;
      if (type === 'developer') {
        ads = await RealEstateDeveloperAdvertisement.getByUserId(userId);
      } else if (type === 'funder') {
        ads = await FinancingAdvertisement.getByUserId(userId);
      } else {
        throw new Error('نوع الإعلان غير صالح');
      }
      return { type, ads: ads.map(toPlainAd), userId };
    } catch (error) {
      return rejectWithValue(error.message || 'فشل جلب إعلانات المستخدم');
    }
  }
);

// Async Thunk for creating an ad
export const createAd = createAsyncThunk(
  'paidAds/createAd',
  async ({ type, adData, imageFiles = [], receiptFile = null }, { rejectWithValue }) => {
    try {
      if (!auth.currentUser) {
        throw new Error('يجب تسجيل الدخول أولاً');
      }
      let instance, id;
      if (type === 'developer') {
        instance = new RealEstateDeveloperAdvertisement(adData);
        id = await instance.save(imageFiles, receiptFile);
        instance = await RealEstateDeveloperAdvertisement.getById(id);
      } else if (type === 'funder') {
        instance = new FinancingAdvertisement(adData);
        id = await instance.save(imageFiles, receiptFile);
        instance = await FinancingAdvertisement.getById(id);
      } else {
        throw new Error('نوع الإعلان غير صالح');
      }
      return { id, type, ad: toPlainAd(instance) };
    } catch (error) {
      return rejectWithValue(error.message || 'فشل إنشاء الإعلان');
    }
  }
);

// Async Thunk for updating an ad
export const updateAd = createAsyncThunk(
  'paidAds/updateAd',
  async ({ type, id, updates, newImageFiles = null, newReceiptFile = null }, { rejectWithValue }) => {
    try {
      if (!auth.currentUser) {
        throw new Error('يجب تسجيل الدخول أولاً');
      }
      console.log('[updateAd] Called with:', { id, type, updates });
      let instance;
      if (type === 'developer') {
        instance = await RealEstateDeveloperAdvertisement.getById(id);
        if (!instance) throw new Error('إعلان المطور غير موجود');
        await instance.update(updates, newImageFiles, newReceiptFile);
        instance = await RealEstateDeveloperAdvertisement.getById(id);
      } else if (type === 'funder') {
        instance = await FinancingAdvertisement.getById(id);
        if (!instance) throw new Error('إعلان التمويل غير موجود');
        await instance.update(updates, newImageFiles, newReceiptFile);
        instance = await FinancingAdvertisement.getById(id);
      } else {
        throw new Error('نوع الإعلان غير صالح');
      }
      return { id, type, ad: toPlainAd(instance) };
    } catch (error) {
      console.error('[updateAd] Error:', error, error?.stack);
      return rejectWithValue(error.message || 'فشل تحديث الإعلان');
    }
  }
);

const paidAdsSlice = createSlice({
  name: 'paidAds',
  initialState,
  reducers: {
    setDeveloperAds(state, action) {
      state.developerAds = action.payload;
      state.loading.developer = false;
      state.error.developer = null;
    },
    setFunderAds(state, action) {
      state.funderAds = action.payload;
      state.loading.funder = false;
      state.error.funder = null;
    },
    setLoadingDeveloper(state, action) {
      state.loading.developer = action.payload;
      if (action.payload) state.error.developer = null;
    },
    setLoadingFunder(state, action) {
      state.loading.funder = action.payload;
      if (action.payload) state.error.funder = null;
    },
    setErrorDeveloper(state, action) {
      state.error.developer = action.payload;
      state.loading.developer = false;
    },
    setErrorFunder(state, action) {
      state.error.funder = action.payload;
      state.loading.funder = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Delete Ad
      .addCase(deleteAd.pending, (state, action) => {
        const { type } = action.meta.arg;
        if (type === 'developer') {
          state.loading.developer = true;
          state.error.developer = null;
        } else if (type === 'funder') {
          state.loading.funder = true;
          state.error.funder = null;
        }
      })
      .addCase(deleteAd.fulfilled, (state, action) => {
        const { id, type } = action.payload;
        if (type === 'developer') {
          state.developerAds = state.developerAds.filter(ad => ad.id !== id);
          state.loading.developer = false;
        } else if (type === 'funder') {
          state.funderAds = state.funderAds.filter(ad => ad.id !== id);
          state.loading.funder = false;
        }
      })
      .addCase(deleteAd.rejected, (state, action) => {
        const { type } = action.meta.arg;
        if (type === 'developer') {
          state.error.developer = action.payload;
          state.loading.developer = false;
        } else if (type === 'funder') {
          state.error.funder = action.payload;
          state.loading.funder = false;
        }
      })
      // Toggle Ad Status
      .addCase(toggleAdStatus.pending, (state, action) => {
        const { type } = action.meta.arg;
        if (type === 'developer') {
          state.loading.developer = true;
          state.error.developer = null;
        } else if (type === 'funder') {
          state.loading.funder = true;
          state.error.funder = null;
        }
      })
      .addCase(toggleAdStatus.fulfilled, (state, action) => {
        const { id, type, ad } = action.payload;
        const adsArr = type === 'developer' ? state.developerAds : state.funderAds;
        const adIndex = adsArr.findIndex(ad => ad.id === id);
        if (adIndex !== -1) {
          adsArr[adIndex] = ad;
        } else {
          adsArr.push(ad);
        }
        if (type === 'developer') {
          state.loading.developer = false;
        } else if (type === 'funder') {
          state.loading.funder = false;
        }
      })
      .addCase(toggleAdStatus.rejected, (state, action) => {
        const { type } = action.meta.arg;
        if (type === 'developer') {
          state.error.developer = action.payload;
          state.loading.developer = false;
        } else if (type === 'funder') {
          state.error.funder = action.payload;
          state.loading.funder = false;
        }
      })
      // Approve Ad
      .addCase(approveAd.pending, (state, action) => {
        const { type } = action.meta.arg;
        if (type === 'developer') {
          state.loading.developer = true;
          state.error.developer = null;
        } else if (type === 'funder') {
          state.loading.funder = true;
          state.error.funder = null;
        }
      })
      .addCase(approveAd.fulfilled, (state, action) => {
        const { id, type, ad } = action.payload;
        const adsArr = type === 'developer' ? state.developerAds : state.funderAds;
        const adIndex = adsArr.findIndex(ad => ad.id === id);
        if (adIndex !== -1) {
          adsArr[adIndex] = ad;
        } else {
          adsArr.push(ad);
        }
        if (type === 'developer') {
          state.loading.developer = false;
        } else if (type === 'funder') {
          state.loading.funder = false;
        }
      })
      .addCase(approveAd.rejected, (state, action) => {
        const { type } = action.meta.arg;
        if (type === 'developer') {
          state.error.developer = action.payload;
          state.loading.developer = false;
        } else if (type === 'funder') {
          state.error.funder = action.payload;
          state.loading.funder = false;
        }
      })
      // Reject Ad
      .addCase(rejectAd.pending, (state, action) => {
        const { type } = action.meta.arg;
        if (type === 'developer') {
          state.loading.developer = true;
          state.error.developer = null;
        } else if (type === 'funder') {
          state.loading.funder = true;
          state.error.funder = null;
        }
      })
      .addCase(rejectAd.fulfilled, (state, action) => {
        const { id, type, ad } = action.payload;
        const adsArr = type === 'developer' ? state.developerAds : state.funderAds;
        const adIndex = adsArr.findIndex(ad => ad.id === id);
        if (adIndex !== -1) {
          adsArr[adIndex] = ad;
        } else {
          adsArr.push(ad);
        }
        if (type === 'developer') {
          state.loading.developer = false;
        } else if (type === 'funder') {
          state.loading.funder = false;
        }
      })
      .addCase(rejectAd.rejected, (state, action) => {
        const { type } = action.meta.arg;
        if (type === 'developer') {
          state.error.developer = action.payload;
          state.loading.developer = false;
        } else if (type === 'funder') {
          state.error.funder = action.payload;
          state.loading.funder = false;
        }
      })
      // Return to Pending
      .addCase(returnAdToPending.pending, (state, action) => {
        const { type } = action.meta.arg;
        if (type === 'developer') {
          state.loading.developer = true;
          state.error.developer = null;
        } else if (type === 'funder') {
          state.loading.funder = true;
          state.error.funder = null;
        }
      })
      .addCase(returnAdToPending.fulfilled, (state, action) => {
        const { id, type, ad } = action.payload;
        const adsArr = type === 'developer' ? state.developerAds : state.funderAds;
        const adIndex = adsArr.findIndex(ad => ad.id === id);
        if (adIndex !== -1) {
          adsArr[adIndex] = ad;
        } else {
          adsArr.push(ad);
        }
        if (type === 'developer') {
          state.loading.developer = false;
        } else if (type === 'funder') {
          state.loading.funder = false;
        }
      })
      .addCase(returnAdToPending.rejected, (state, action) => {
        const { type } = action.meta.arg;
        if (type === 'developer') {
          state.error.developer = action.payload;
          state.loading.developer = false;
        } else if (type === 'funder') {
          state.error.funder = action.payload;
          state.loading.funder = false;
        }
      })
      // Fetch All Ads
      .addCase(fetchAllAds.pending, (state, action) => {
        const { type } = action.meta.arg;
        if (type === 'developer') {
          state.loading.developer = true;
          state.error.developer = null;
        } else if (type === 'funder') {
          state.loading.funder = true;
          state.error.funder = null;
        }
      })
      .addCase(fetchAllAds.fulfilled, (state, action) => {
        const { type, ads } = action.payload;
        if (type === 'developer') {
          state.developerAds = ads;
          state.loading.developer = false;
        } else if (type === 'funder') {
          state.funderAds = ads;
          state.loading.funder = false;
        }
      })
      .addCase(fetchAllAds.rejected, (state, action) => {
        const { type } = action.meta.arg;
        if (type === 'developer') {
          state.error.developer = action.payload;
          state.loading.developer = false;
        } else if (type === 'funder') {
          state.error.funder = action.payload;
          state.loading.funder = false;
        }
      })
      // Fetch Ads by Review Status
      .addCase(fetchAdsByReviewStatus.pending, (state, action) => {
        const { type } = action.meta.arg;
        if (type === 'developer') {
          state.loading.developer = true;
          state.error.developer = null;
        } else if (type === 'funder') {
          state.loading.funder = true;
          state.error.funder = null;
        }
      })
      .addCase(fetchAdsByReviewStatus.fulfilled, (state, action) => {
        const { type, ads } = action.payload;
        if (type === 'developer') {
          state.developerAds = ads;
          state.loading.developer = false;
        } else if (type === 'funder') {
          state.funderAds = ads;
          state.loading.funder = false;
        }
      })
      .addCase(fetchAdsByReviewStatus.rejected, (state, action) => {
        const { type } = action.meta.arg;
        if (type === 'developer') {
          state.error.developer = action.payload;
          state.loading.developer = false;
        } else if (type === 'funder') {
          state.error.funder = action.payload;
          state.loading.funder = false;
        }
      })
      // Fetch Ads by User
      .addCase(fetchAdsByUser.pending, (state, action) => {
        const { type } = action.meta.arg;
        if (type === 'developer') {
          state.loading.developer = true;
          state.error.developer = null;
        } else if (type === 'funder') {
          state.loading.funder = true;
          state.error.funder = null;
        }
      })
      .addCase(fetchAdsByUser.fulfilled, (state, action) => {
        const { type, ads } = action.payload;
        if (type === 'developer') {
          state.developerAds = ads;
          state.loading.developer = false;
        } else if (type === 'funder') {
          state.funderAds = ads;
          state.loading.funder = false;
        }
      })
      .addCase(fetchAdsByUser.rejected, (state, action) => {
        const { type } = action.meta.arg;
        if (type === 'developer') {
          state.error.developer = action.payload;
          state.loading.developer = false;
        } else if (type === 'funder') {
          state.error.funder = action.payload;
          state.loading.funder = false;
        }
      })
      // Create Ad
      .addCase(createAd.pending, (state, action) => {
        const { type } = action.meta.arg;
        if (type === 'developer') {
          state.loading.developer = true;
          state.error.developer = null;
        } else if (type === 'funder') {
          state.loading.funder = true;
          state.error.funder = null;
        }
      })
      .addCase(createAd.fulfilled, (state, action) => {
        const { type, ad } = action.payload;
        if (type === 'developer') {
          state.developerAds.push(ad);
          state.loading.developer = false;
        } else if (type === 'funder') {
          state.funderAds.push(ad);
          state.loading.funder = false;
        }
      })
      .addCase(createAd.rejected, (state, action) => {
        const { type } = action.meta.arg;
        if (type === 'developer') {
          state.error.developer = action.payload;
          state.loading.developer = false;
        } else if (type === 'funder') {
          state.error.funder = action.payload;
          state.loading.funder = false;
        }
      })
      // Update Ad
      .addCase(updateAd.pending, (state, action) => {
        const { type } = action.meta.arg;
        if (type === 'developer') {
          state.loading.developer = true;
          state.error.developer = null;
        } else if (type === 'funder') {
          state.loading.funder = true;
          state.error.funder = null;
        }
      })
      .addCase(updateAd.fulfilled, (state, action) => {
        const { id, type, ad } = action.payload;
        const adsArr = type === 'developer' ? state.developerAds : state.funderAds;
        const adIndex = adsArr.findIndex(ad => ad.id === id);
        if (adIndex !== -1) {
          adsArr[adIndex] = ad;
        } else {
          adsArr.push(ad);
        }
        if (type === 'developer') {
          state.loading.developer = false;
        } else if (type === 'funder') {
          state.loading.funder = false;
        }
      })
      .addCase(updateAd.rejected, (state, action) => {
        const { type } = action.meta.arg;
        if (type === 'developer') {
          state.error.developer = action.payload;
          state.loading.developer = false;
        } else if (type === 'funder') {
          state.error.funder = action.payload;
          state.loading.funder = false;
        }
      });
  },
});

export const {
  setDeveloperAds,
  setFunderAds,
  setLoadingDeveloper,
  setLoadingFunder,
  setErrorDeveloper,
  setErrorFunder,
} = paidAdsSlice.actions;

export default paidAdsSlice.reducer;