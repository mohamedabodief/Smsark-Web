import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import FinancingAdvertisement from "../../FireBase/modelsWithOperations/FinancingAdvertisement";

// Ensure we only return plain serializable objects from thunks
const toPlainFinancingAd = (ad, index = 0) => ({
  id: ad.id || `financing-temp-id-${index}`,
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
  financing_model: ad.financing_model,
  start_limit: ad.start_limit,
  end_limit: ad.end_limit,
  org_name: ad.org_name,
  interest_rate_upto_5: ad.interest_rate_upto_5,
  interest_rate_upto_10: ad.interest_rate_upto_10,
  interest_rate_above_10: ad.interest_rate_above_10,
});
export const fetchAllFinancingAds = createAsyncThunk(
  "financingAds/fetchAll",
  async () => {
    const ads = await FinancingAdvertisement.getAll();
    return ads.map((ad, index) => toPlainFinancingAd(ad, index));
  }
);

export const fetchFinancingAdsByUser = createAsyncThunk(
  "financingAds/fetchByUser",
  async (userId) => {
    const ads = await FinancingAdvertisement.getByUserId(userId);
    return ads.map((ad, index) => toPlainFinancingAd(ad, index));
  }
);

export const fetchActiveFinancingAdsByUser = createAsyncThunk(
  "financingAds/fetchActiveByUser",
  async (userId) => {
    const ads = await FinancingAdvertisement.getActiveByUser(userId);
    return ads.map((ad, index) => toPlainFinancingAd(ad, index));
  }
);

const financingAdsSlice = createSlice({
  name: "financingAds",
  initialState: {
    all: [],
    byUser: [],
    activeByUser: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearFinancingAds: (state) => {
      state.byUser = [];
      state.activeByUser = [];
    },
    setFinancingAdsByUser: (state, action) => {
      // Convert class instances to plain objects to ensure id is accessible
      state.byUser = action.payload.map(ad => ({
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
        financing_model: ad.financing_model,
        start_limit: ad.start_limit,
        end_limit: ad.end_limit,
        org_name: ad.org_name,
        interest_rate_upto_5: ad.interest_rate_upto_5,
        interest_rate_upto_10: ad.interest_rate_upto_10,
        interest_rate_above_10: ad.interest_rate_above_10,
      }));
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllFinancingAds.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllFinancingAds.fulfilled, (state, action) => {
        state.loading = false;
        state.all = action.payload;
      })
      .addCase(fetchAllFinancingAds.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })


      .addCase(fetchFinancingAdsByUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFinancingAdsByUser.fulfilled, (state, action) => {
        state.loading = false;
        state.byUser = action.payload;
      })
      .addCase(fetchFinancingAdsByUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(fetchActiveFinancingAdsByUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchActiveFinancingAdsByUser.fulfilled, (state, action) => {
        state.loading = false;
        state.activeByUser = action.payload;
      })
      .addCase(fetchActiveFinancingAdsByUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { clearFinancingAds ,setFinancingAdsByUser } = financingAdsSlice.actions;

export default financingAdsSlice.reducer;
