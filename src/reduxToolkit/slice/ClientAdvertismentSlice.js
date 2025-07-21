import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import ClientAdvertisement from '../../FireBase/modelsWithOperations/ClientAdvertisemen';

// Async Thunk for fetching all advertisements
const fetchAdvertisements = createAsyncThunk(
  'advertisements/fetchAdvertisements',
  async (_, { rejectWithValue }) => {
    try {
      const ads = await ClientAdvertisement.getAll();
      // Convert ClientAdvertisement instances to plain objects
      const plainAds = ads.map(ad => ({
        id: ad.id,
        title: ad.title,
        type: ad.type,
        price: ad.price,
        area: ad.area,
        date_of_building: ad.date_of_building,
        images: ad.images,
        location: ad.location,
        address: ad.address,
        city: ad.city,
        governorate: ad.governorate,
        phone: ad.phone,
        user_name: ad.user_name,
        userId: ad.userId,
        ad_type: ad.ad_type,
        ad_status: ad.ad_status,
        type_of_user: ad.type_of_user,
        ads: ad.ads,
        adExpiryTime: ad.adExpiryTime,
        description: ad.description,
        reviewed_by: ad.reviewed_by,
        review_note: ad.review_note,
        reviewStatus: ad.reviewStatus,
        status: ad.status,
        receipt_image: ad.receipt_image,
      }));
      return plainAds;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch advertisements.');
    }
  }
);

// Async Thunk for fetching advertisements by review status
const fetchAdvertisementsByReviewStatus = createAsyncThunk(
  'advertisements/fetchAdvertisementsByReviewStatus',
  async (status, { rejectWithValue }) => {
    try {
      const ads = await ClientAdvertisement.getByReviewStatus(status);
      // Convert ClientAdvertisement instances to plain objects
      const plainAds = ads.map(ad => ({
        id: ad.id,
        title: ad.title,
        type: ad.type,
        price: ad.price,
        area: ad.area,
        date_of_building: ad.date_of_building,
        images: ad.images,
        location: ad.location,
        address: ad.address,
        city: ad.city,
        governorate: ad.governorate,
        phone: ad.phone,
        user_name: ad.user_name,
        userId: ad.userId,
        ad_type: ad.ad_type,
        ad_status: ad.ad_status,
        type_of_user: ad.type_of_user,
        ads: ad.ads,
        adExpiryTime: ad.adExpiryTime,
        description: ad.description,
        reviewed_by: ad.reviewed_by,
        review_note: ad.review_note,
        reviewStatus: ad.reviewStatus,
        status: ad.status,
        receipt_image: ad.receipt_image,
      }));
      return { status, ads: plainAds };
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch advertisements by status.');
    }
  }
);

// Async Thunk for fetching advertisements by ad status
const fetchAdvertisementsByAdStatus = createAsyncThunk(
  'advertisements/fetchAdvertisementsByAdStatus',
  async (status, { rejectWithValue }) => {
    try {
      const ads = await ClientAdvertisement.getByAdStatus(status);
      // Convert ClientAdvertisement instances to plain objects
      const plainAds = ads.map(ad => ({
        id: ad.id,
        title: ad.title,
        type: ad.type,
        price: ad.price,
        area: ad.area,
        date_of_building: ad.date_of_building,
        images: ad.images,
        location: ad.location,
        address: ad.address,
        city: ad.city,
        governorate: ad.governorate,
        phone: ad.phone,
        user_name: ad.user_name,
        userId: ad.userId,
        ad_type: ad.ad_type,
        ad_status: ad.ad_status,
        type_of_user: ad.type_of_user,
        ads: ad.ads,
        adExpiryTime: ad.adExpiryTime,
        description: ad.description,
        reviewed_by: ad.reviewed_by,
        review_note: ad.review_note,
        reviewStatus: ad.reviewStatus,
        status: ad.status,
        receipt_image: ad.receipt_image,
      }));
      return { status, ads: plainAds };
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch advertisements by ad status.');
    }
  }
);

// Async Thunk for fetching advertisements by user ID
const fetchAdvertisementsByUserId = createAsyncThunk(
  'advertisements/fetchAdvertisementsByUserId',
  async (userId, { rejectWithValue }) => {
    try {
      const ads = await ClientAdvertisement.getByUserId(userId);
      // Convert ClientAdvertisement instances to plain objects
      const plainAds = ads.map(ad => ({
        id: ad.id,
        title: ad.title,
        type: ad.type,
        price: ad.price,
        area: ad.area,
        date_of_building: ad.date_of_building,
        images: ad.images,
        location: ad.location,
        address: ad.address,
        city: ad.city,
        governorate: ad.governorate,
        phone: ad.phone,
        user_name: ad.user_name,
        userId: ad.userId,
        ad_type: ad.ad_type,
        ad_status: ad.ad_status,
        type_of_user: ad.type_of_user,
        ads: ad.ads,
        adExpiryTime: ad.adExpiryTime,
        description: ad.description,
        reviewed_by: ad.reviewed_by,
        review_note: ad.review_note,
        reviewStatus: ad.reviewStatus,
        status: ad.status,
        receipt_image: ad.receipt_image,
      }));
      return plainAds;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch advertisements by user ID.');
    }
  }
);

// Async Thunk for getting advertisement by ID
const fetchAdvertisementById = createAsyncThunk(
  'advertisements/fetchAdvertisementById',
  async (id, { rejectWithValue }) => {
    try {
      const ad = await ClientAdvertisement.getById(id);
      if (ad) {
        // Convert ClientAdvertisement instance to plain object
        const plainAd = {
          id: ad.id,
          title: ad.title,
          type: ad.type,
          price: ad.price,
          area: ad.area,
          date_of_building: ad.date_of_building,
          images: ad.images,
          location: ad.location,
          address: ad.address,
          city: ad.city,
          governorate: ad.governorate,
          phone: ad.phone,
          user_name: ad.user_name,
          userId: ad.userId,
          ad_type: ad.ad_type,
          ad_status: ad.ad_status,
          type_of_user: ad.type_of_user,
          ads: ad.ads,
          adExpiryTime: ad.adExpiryTime,
          description: ad.description,
          reviewed_by: ad.reviewed_by,
          review_note: ad.review_note,
          reviewStatus: ad.reviewStatus,
          status: ad.status,
          receipt_image: ad.receipt_image,
        };
        return plainAd;
      }
      return null;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch advertisement.');
    }
  }
);

// Async Thunk for deleting an advertisement
const deleteAdvertisement = createAsyncThunk(
  'advertisements/deleteAdvertisement',
  async (adId, { rejectWithValue }) => {
    try {
      const adInstance = new ClientAdvertisement({ id: adId });
      await adInstance.delete();
      return adId;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to delete advertisement.');
    }
  }
);

// Async Thunk for updating advertisement status
const updateAdvertisementStatus = createAsyncThunk(
  'advertisements/updateAdvertisementStatus',
  async ({ adId, newStatus }, { rejectWithValue }) => {
    try {
      const adInstance = new ClientAdvertisement({ id: adId });
      await adInstance.updateStatus(newStatus);
      return { adId, newStatus };
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to update advertisement status.');
    }
  }
);

// Async Thunk for approving advertisement
const approveAdvertisement = createAsyncThunk(
  'advertisements/approveAdvertisement',
  async (adId, { rejectWithValue }) => {
    try {
      const adInstance = new ClientAdvertisement({ id: adId });
      await adInstance.approveAd();
      return adId;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to approve advertisement.');
    }
  }
);

// Async Thunk for rejecting advertisement
const rejectAdvertisement = createAsyncThunk(
  'advertisements/rejectAdvertisement',
  async ({ adId, reason }, { rejectWithValue }) => {
    try {
      const adInstance = new ClientAdvertisement({ id: adId });
      await adInstance.rejectAd(reason);
      return { adId, reason };
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to reject advertisement.');
    }
  }
);

// Async Thunk for returning advertisement to pending
const returnAdvertisementToPending = createAsyncThunk(
  'advertisements/returnAdvertisementToPending',
  async (adId, { rejectWithValue }) => {
    try {
      const adInstance = new ClientAdvertisement({ id: adId });
      await adInstance.returnToPending();
      return adId;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to return advertisement to pending.');
    }
  }
);

// Async Thunk for client returning advertisement to pending
const clientReturnAdvertisementToPending = createAsyncThunk(
  'advertisements/clientReturnAdvertisementToPending',
  async (adId, { rejectWithValue }) => {
    try {
      const adInstance = new ClientAdvertisement({ id: adId });
      await adInstance.clientReturnToPending();
      return adId;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to return advertisement to pending.');
    }
  }
);

// Async Thunk for activating advertisement
const activateAdvertisement = createAsyncThunk(
  'advertisements/activateAdvertisement',
  async ({ adId, days }, { rejectWithValue }) => {
    try {
      const adInstance = new ClientAdvertisement({ id: adId });
      await adInstance.adsActivation(days);
      return { adId, days };
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to activate advertisement.');
    }
  }
);

// Async Thunk for deactivating advertisement
const deactivateAdvertisement = createAsyncThunk(
  'advertisements/deactivateAdvertisement',
  async (adId, { rejectWithValue }) => {
    try {
      const adInstance = new ClientAdvertisement({ id: adId });
      await adInstance.removeAds();
      return adId;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to deactivate advertisement.');
    }
  }
);

// Async Thunk for updating advertisement
const updateAdvertisement = createAsyncThunk(
  'advertisements/updateAdvertisement',
  async ({ adId, updates, newImageFiles, newReceiptFile }, { rejectWithValue }) => {
    try {
      const adInstance = new ClientAdvertisement({ id: adId });
      await adInstance.update(updates, newImageFiles, newReceiptFile);
      return { adId, updates };
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to update advertisement.');
    }
  }
);

const advertisementsSlice = createSlice({
  name: 'advertisements',
  initialState: {
    list: [],
    currentAd: null,
    loading: 'idle', // 'idle' | 'pending' | 'succeeded' | 'failed'
    error: null,
    filters: {
      reviewStatus: null,
      adStatus: null,
    },
  },
  reducers: {
    clearAdvertisementsError: (state) => {
      state.error = null;
    },
    clearCurrentAd: (state) => {
      state.currentAd = null;
    },
    setFilter: (state, action) => {
      const { type, value } = action.payload;
      state.filters[type] = value;
    },
    clearFilters: (state) => {
      state.filters = {
        reviewStatus: null,
        adStatus: null,
      };
    },
    updateAdInList: (state, action) => {
      const { id, updates } = action.payload;
      const adIndex = state.list.findIndex(ad => ad.id === id);
      if (adIndex !== -1) {
        state.list[adIndex] = { ...state.list[adIndex], ...updates };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch All Advertisements
      .addCase(fetchAdvertisements.pending, (state) => {
        state.loading = 'pending';
        state.error = null;
      })
      .addCase(fetchAdvertisements.fulfilled, (state, action) => {
        state.loading = 'succeeded';
        state.list = action.payload;
      })
      .addCase(fetchAdvertisements.rejected, (state, action) => {
        state.loading = 'failed';
        state.error = action.payload;
        state.list = [];
      })
      
      // Fetch By Review Status
      .addCase(fetchAdvertisementsByReviewStatus.pending, (state) => {
        state.loading = 'pending';
        state.error = null;
      })
      .addCase(fetchAdvertisementsByReviewStatus.fulfilled, (state, action) => {
        state.loading = 'succeeded';
        state.list = action.payload.ads;
        state.filters.reviewStatus = action.payload.status;
      })
      .addCase(fetchAdvertisementsByReviewStatus.rejected, (state, action) => {
        state.loading = 'failed';
        state.error = action.payload;
      })
      
      // Fetch By Ad Status
      .addCase(fetchAdvertisementsByAdStatus.pending, (state) => {
        state.loading = 'pending';
        state.error = null;
      })
      .addCase(fetchAdvertisementsByAdStatus.fulfilled, (state, action) => {
        state.loading = 'succeeded';
        state.list = action.payload.ads;
        state.filters.adStatus = action.payload.status;
      })
      .addCase(fetchAdvertisementsByAdStatus.rejected, (state, action) => {
        state.loading = 'failed';
        state.error = action.payload;
      })
      
      // Fetch By User ID
      .addCase(fetchAdvertisementsByUserId.pending, (state) => {
        state.loading = 'pending';
        state.error = null;
      })
      .addCase(fetchAdvertisementsByUserId.fulfilled, (state, action) => {
        state.loading = 'succeeded';
        state.list = action.payload;
      })
      .addCase(fetchAdvertisementsByUserId.rejected, (state, action) => {
        state.loading = 'failed';
        state.error = action.payload;
      })
      
      // Fetch By ID
      .addCase(fetchAdvertisementById.pending, (state) => {
        state.loading = 'pending';
        state.error = null;
      })
      .addCase(fetchAdvertisementById.fulfilled, (state, action) => {
        state.loading = 'succeeded';
        state.currentAd = action.payload;
      })
      .addCase(fetchAdvertisementById.rejected, (state, action) => {
        state.loading = 'failed';
        state.error = action.payload;
      })
      
      // Delete Advertisement
      .addCase(deleteAdvertisement.pending, (state) => {
        state.loading = 'pending';
        state.error = null;
      })
      .addCase(deleteAdvertisement.fulfilled, (state, action) => {
        state.loading = 'succeeded';
        state.list = state.list.filter(ad => ad.id !== action.payload);
        if (state.currentAd && state.currentAd.id === action.payload) {
          state.currentAd = null;
        }
      })
      .addCase(deleteAdvertisement.rejected, (state, action) => {
        state.loading = 'failed';
        state.error = action.payload;
      })
      
      // Update Advertisement Status
      .addCase(updateAdvertisementStatus.pending, (state) => {
        state.loading = 'pending';
        state.error = null;
      })
      .addCase(updateAdvertisementStatus.fulfilled, (state, action) => {
        state.loading = 'succeeded';
        const { adId, newStatus } = action.payload;
        const existingAd = state.list.find(ad => ad.id === adId);
        if (existingAd) {
          existingAd.status = newStatus;
        }
        if (state.currentAd && state.currentAd.id === adId) {
          state.currentAd.status = newStatus;
        }
      })
      .addCase(updateAdvertisementStatus.rejected, (state, action) => {
        state.loading = 'failed';
        state.error = action.payload;
      })
      
      // Approve Advertisement
      .addCase(approveAdvertisement.pending, (state) => {
        state.loading = 'pending';
        state.error = null;
      })
      .addCase(approveAdvertisement.fulfilled, (state, action) => {
        state.loading = 'succeeded';
        const adId = action.payload;
        const existingAd = state.list.find(ad => ad.id === adId);
        if (existingAd) {
          existingAd.reviewStatus = 'approved';
        }
        if (state.currentAd && state.currentAd.id === adId) {
          state.currentAd.reviewStatus = 'approved';
        }
      })
      .addCase(approveAdvertisement.rejected, (state, action) => {
        state.loading = 'failed';
        state.error = action.payload;
      })
      
      // Reject Advertisement
      .addCase(rejectAdvertisement.pending, (state) => {
        state.loading = 'pending';
        state.error = null;
      })
      .addCase(rejectAdvertisement.fulfilled, (state, action) => {
        state.loading = 'succeeded';
        const { adId } = action.payload;
        const existingAd = state.list.find(ad => ad.id === adId);
        if (existingAd) {
          existingAd.reviewStatus = 'rejected';
        }
        if (state.currentAd && state.currentAd.id === adId) {
          state.currentAd.reviewStatus = 'rejected';
        }
      })
      .addCase(rejectAdvertisement.rejected, (state, action) => {
        state.loading = 'failed';
        state.error = action.payload;
      })
      
      // Return to Pending
      .addCase(returnAdvertisementToPending.pending, (state) => {
        state.loading = 'pending';
        state.error = null;
      })
      .addCase(returnAdvertisementToPending.fulfilled, (state, action) => {
        state.loading = 'succeeded';
        const adId = action.payload;
        const existingAd = state.list.find(ad => ad.id === adId);
        if (existingAd) {
          existingAd.reviewStatus = 'pending';
        }
        if (state.currentAd && state.currentAd.id === adId) {
          state.currentAd.reviewStatus = 'pending';
        }
      })
      .addCase(returnAdvertisementToPending.rejected, (state, action) => {
        state.loading = 'failed';
        state.error = action.payload;
      })
      
      // Client Return to Pending
      .addCase(clientReturnAdvertisementToPending.pending, (state) => {
        state.loading = 'pending';
        state.error = null;
      })
      .addCase(clientReturnAdvertisementToPending.fulfilled, (state, action) => {
        state.loading = 'succeeded';
        const adId = action.payload;
        const existingAd = state.list.find(ad => ad.id === adId);
        if (existingAd) {
          existingAd.reviewStatus = 'pending';
        }
        if (state.currentAd && state.currentAd.id === adId) {
          state.currentAd.reviewStatus = 'pending';
        }
      })
      .addCase(clientReturnAdvertisementToPending.rejected, (state, action) => {
        state.loading = 'failed';
        state.error = action.payload;
      })
      
      // Activate Advertisement
      .addCase(activateAdvertisement.pending, (state) => {
        state.loading = 'pending';
        state.error = null;
      })
      .addCase(activateAdvertisement.fulfilled, (state, action) => {
        state.loading = 'succeeded';
        const { adId } = action.payload;
        const existingAd = state.list.find(ad => ad.id === adId);
        if (existingAd) {
          existingAd.ads = true;
          existingAd.adExpiryTime = Date.now() + (action.payload.days * 24 * 60 * 60 * 1000);
        }
        if (state.currentAd && state.currentAd.id === adId) {
          state.currentAd.ads = true;
          state.currentAd.adExpiryTime = Date.now() + (action.payload.days * 24 * 60 * 60 * 1000);
        }
      })
      .addCase(activateAdvertisement.rejected, (state, action) => {
        state.loading = 'failed';
        state.error = action.payload;
      })
      
      // Deactivate Advertisement
      .addCase(deactivateAdvertisement.pending, (state) => {
        state.loading = 'pending';
        state.error = null;
      })
      .addCase(deactivateAdvertisement.fulfilled, (state, action) => {
        state.loading = 'succeeded';
        const adId = action.payload;
        const existingAd = state.list.find(ad => ad.id === adId);
        if (existingAd) {
          existingAd.ads = false;
          existingAd.adExpiryTime = null;
        }
        if (state.currentAd && state.currentAd.id === adId) {
          state.currentAd.ads = false;
          state.currentAd.adExpiryTime = null;
        }
      })
      .addCase(deactivateAdvertisement.rejected, (state, action) => {
        state.loading = 'failed';
        state.error = action.payload;
      })
      
      // Update Advertisement
      .addCase(updateAdvertisement.pending, (state) => {
        state.loading = 'pending';
        state.error = null;
      })
      .addCase(updateAdvertisement.fulfilled, (state, action) => {
        state.loading = 'succeeded';
        const { adId, updates } = action.payload;
        const existingAd = state.list.find(ad => ad.id === adId);
        if (existingAd) {
          Object.assign(existingAd, updates);
        }
        if (state.currentAd && state.currentAd.id === adId) {
          Object.assign(state.currentAd, updates);
        }
      })
      .addCase(updateAdvertisement.rejected, (state, action) => {
        state.loading = 'failed';
        state.error = action.payload;
      });
  },
});

export const { 
  clearAdvertisementsError, 
  clearCurrentAd, 
  setFilter, 
  clearFilters, 
  updateAdInList 
} = advertisementsSlice.actions;

// Export async thunks
export { 
  fetchAdvertisements,
  fetchAdvertisementsByReviewStatus,
  fetchAdvertisementsByAdStatus,
  fetchAdvertisementsByUserId,
  fetchAdvertisementById,
  deleteAdvertisement,
  updateAdvertisementStatus,
  approveAdvertisement,
  rejectAdvertisement,
  returnAdvertisementToPending,
  clientReturnAdvertisementToPending,
  activateAdvertisement,
  deactivateAdvertisement,
  updateAdvertisement,
};

export default advertisementsSlice.reducer;
