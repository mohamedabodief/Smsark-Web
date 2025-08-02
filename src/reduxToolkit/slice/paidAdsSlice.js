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
      return { id: adId, type };
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
      return { id, type };
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
      return { id, type, reason };
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
      return { id, type };
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
      } else if (type === 'funder') {
        instance = new FinancingAdvertisement(adData);
        id = await instance.save(imageFiles, receiptFile);
      } else {
        throw new Error('نوع الإعلان غير صالح');
      }
      return { id, type };
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
      } else if (type === 'funder') {
        instance = await FinancingAdvertisement.getById(id);
        if (!instance) throw new Error('إعلان التمويل غير موجود');
        await instance.update(updates, newImageFiles, newReceiptFile);
      } else {
        throw new Error('نوع الإعلان غير صالح');
      }
      return { id, type };
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
        const { type } = action.payload;
        if (type === 'developer') {
          state.loading.developer = false;
        } else if (type === 'funder') {
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
        const { type } = action.payload;
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
        const { type } = action.payload;
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
        const { type } = action.payload;
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
        const { type } = action.payload;
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
        const { type } = action.payload;
        if (type === 'developer') {
          state.loading.developer = false;
        } else if (type === 'funder') {
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
        const { type } = action.payload;
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