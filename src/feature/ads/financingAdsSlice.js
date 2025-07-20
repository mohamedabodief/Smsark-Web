import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import FinancingAdvertisement from "../../FireBase/modelsWithOperations/FinancingAdvertisement";
export const fetchAllFinancingAds = createAsyncThunk(
  "financingAds/fetchAll",
  async () => {
    const ads = await FinancingAdvertisement.getAll();

    return ads.map((ad, index) => ({
      ...ad,
      id: ad.id || `financing-temp-id-${index}`,
    }));
  }
);

export const fetchFinancingAdsByUser = createAsyncThunk(
  "financingAds/fetchByUser",
  async (userId) => {
    const ads = await FinancingAdvertisement.getByUserId(userId);
    return ads;
  }
);

export const fetchActiveFinancingAdsByUser = createAsyncThunk(
  "financingAds/fetchActiveByUser",
  async (userId) => {
    const ads = await FinancingAdvertisement.getActiveByUser(userId);
    return ads;
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

export const { clearFinancingAds } = financingAdsSlice.actions;

export default financingAdsSlice.reducer;
