import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import HomepageAdvertisement from "../../FireBase/modelsWithOperations/HomepageAdvertisement";

// Fetch all homepage ads
export const fetchAllHomepageAds = createAsyncThunk(
  "homepageAds/fetchAll",
  async () => {
    const ads = await HomepageAdvertisement.getAll();
    return ads.map(ad => ({ ...ad }));
  }
);

// Fetch homepage ads by user
export const fetchHomepageAdsByUser = createAsyncThunk(
  "homepageAds/fetchByUser",
  async (userId) => {
    const ads = await HomepageAdvertisement.getAll();
    return ads.filter(ad => ad.userId === userId);
  }
);

// Fetch homepage ads by review status
export const fetchHomepageAdsByStatus = createAsyncThunk(
  "homepageAds/fetchByStatus",
  async (status) => {
    const ads = await HomepageAdvertisement.getByReviewStatus(status);
    return ads;
  }
);

// Create new homepage ad
export const createHomepageAd = createAsyncThunk(
  "homepageAds/create",
  async ({ adData, imageFile, receiptFile }) => {
    const ad = new HomepageAdvertisement(adData);
    const id = await ad.save(imageFile, receiptFile);
    return { ...adData, id };
  }
);

// Update homepage ad
export const updateHomepageAd = createAsyncThunk(
  "homepageAds/update",
  async ({ id, updates, newImageFile, newReceiptFile }) => {
    const ad = new HomepageAdvertisement({ id });
    await ad.update(updates, newImageFile, newReceiptFile);
    return { id, ...updates };
  }
);

// Delete homepage ad
export const deleteHomepageAd = createAsyncThunk(
  "homepageAds/delete",
  async (id) => {
    const ad = new HomepageAdvertisement({ id });
    await ad.delete();
    return id;
  }
);

// Approve homepage ad
export const approveHomepageAd = createAsyncThunk(
  "homepageAds/approve",
  async (id) => {
    const ad = new HomepageAdvertisement({ id });
    await ad.approve();
    return id;
  }
);

// Reject homepage ad
export const rejectHomepageAd = createAsyncThunk(
  "homepageAds/reject",
  async ({ id, reason }) => {
    const ad = new HomepageAdvertisement({ id });
    await ad.reject(reason);
    return { id, reason };
  }
);

// Return to pending
export const returnHomepageAdToPending = createAsyncThunk(
  "homepageAds/returnToPending",
  async (id) => {
    const ad = new HomepageAdvertisement({ id });
    await ad.returnToPending();
    return id;
  }
);

// Activate ad
export const activateHomepageAd = createAsyncThunk(
  "homepageAds/activate",
  async ({ id, days }) => {
    const ad = new HomepageAdvertisement({ id });
    await ad.adsActivation(days);
    return { id, days };
  }
);

// Deactivate ad
export const deactivateHomepageAd = createAsyncThunk(
  "homepageAds/deactivate",
  async (id) => {
    const ad = new HomepageAdvertisement({ id });
    await ad.removeAds();
    return id;
  }
);

const homepageAdsSlice = createSlice({
  name: "homepageAds",
  initialState: {
    all: [],
    byUser: [],
    byStatus: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearHomepageAds: (state) => {
      state.all = [];
      state.byUser = [];
      state.byStatus = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all ads
      .addCase(fetchAllHomepageAds.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllHomepageAds.fulfilled, (state, action) => {
        state.loading = false;
        state.all = action.payload;
      })
      .addCase(fetchAllHomepageAds.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Fetch by user
      .addCase(fetchHomepageAdsByUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHomepageAdsByUser.fulfilled, (state, action) => {
        state.loading = false;
        state.byUser = action.payload;
      })
      .addCase(fetchHomepageAdsByUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Fetch by status
      .addCase(fetchHomepageAdsByStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHomepageAdsByStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.byStatus = action.payload;
      })
      .addCase(fetchHomepageAdsByStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Create ad
      .addCase(createHomepageAd.fulfilled, (state, action) => {
        state.all.push(action.payload);
        state.byUser.push(action.payload);
      })

      // Update ad
      .addCase(updateHomepageAd.fulfilled, (state, action) => {
        const { id, ...updates } = action.payload;
        const updateAd = (ads) => ads.map(ad => ad.id === id ? { ...ad, ...updates } : ad);
        state.all = updateAd(state.all);
        state.byUser = updateAd(state.byUser);
        state.byStatus = updateAd(state.byStatus);
      })

      // Delete ad
      .addCase(deleteHomepageAd.fulfilled, (state, action) => {
        const id = action.payload;
        state.all = state.all.filter(ad => ad.id !== id);
        state.byUser = state.byUser.filter(ad => ad.id !== id);
        state.byStatus = state.byStatus.filter(ad => ad.id !== id);
      })

      // Approve ad
      .addCase(approveHomepageAd.fulfilled, (state, action) => {
        const id = action.payload;
        const updateAd = (ads) => ads.map(ad => 
          ad.id === id ? { ...ad, reviewStatus: 'approved' } : ad
        );
        state.all = updateAd(state.all);
        state.byUser = updateAd(state.byUser);
        state.byStatus = updateAd(state.byStatus);
      })

      // Reject ad
      .addCase(rejectHomepageAd.fulfilled, (state, action) => {
        const { id, reason } = action.payload;
        const updateAd = (ads) => ads.map(ad => 
          ad.id === id ? { ...ad, reviewStatus: 'rejected', review_note: reason } : ad
        );
        state.all = updateAd(state.all);
        state.byUser = updateAd(state.byUser);
        state.byStatus = updateAd(state.byStatus);
      })

      // Return to pending
      .addCase(returnHomepageAdToPending.fulfilled, (state, action) => {
        const id = action.payload;
        const updateAd = (ads) => ads.map(ad => 
          ad.id === id ? { ...ad, reviewStatus: 'pending', review_note: null } : ad
        );
        state.all = updateAd(state.all);
        state.byUser = updateAd(state.byUser);
        state.byStatus = updateAd(state.byStatus);
      })

      // Activate ad
      .addCase(activateHomepageAd.fulfilled, (state, action) => {
        const { id, days } = action.payload;
        const expiryTime = Date.now() + (days * 24 * 60 * 60 * 1000);
        const updateAd = (ads) => ads.map(ad => 
          ad.id === id ? { ...ad, ads: true, adExpiryTime: expiryTime } : ad
        );
        state.all = updateAd(state.all);
        state.byUser = updateAd(state.byUser);
        state.byStatus = updateAd(state.byStatus);
      })

      // Deactivate ad
      .addCase(deactivateHomepageAd.fulfilled, (state, action) => {
        const id = action.payload;
        const updateAd = (ads) => ads.map(ad => 
          ad.id === id ? { ...ad, ads: false, adExpiryTime: null } : ad
        );
        state.all = updateAd(state.all);
        state.byUser = updateAd(state.byUser);
        state.byStatus = updateAd(state.byStatus);
      });
  },
});

export const { clearHomepageAds } = homepageAdsSlice.actions;
export default homepageAdsSlice.reducer; 