import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import RealEstateDeveloperAdvertisement from "../../FireBase/modelsWithOperations/RealEstateDeveloperAdvertisement";
export const fetchAllDeveloperAds = createAsyncThunk(
  "developerAds/fetchAll",
  async () => {
    const ads = await RealEstateDeveloperAdvertisement.getAll();
    return ads;
  }
);
export const fetchDeveloperAdsByUser = createAsyncThunk(
  "developerAds/fetchByUser",
  async (userId) => {
    const ads = await RealEstateDeveloperAdvertisement.getByUserId(userId);
    return ads;
  }
);
export const fetchActiveDeveloperAdsByUser = createAsyncThunk(
  "developerAds/fetchActiveByUser",
  async (userId) => {
    const ads = await RealEstateDeveloperAdvertisement.getActiveByUser(userId);
    return ads;
  }
);

const developerAdsSlice = createSlice({
  name: "developerAds",
  initialState: {
    all: [],
    byUser: [],
    activeByUser: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearDeveloperAds: (state) => {
      state.byUser = [];
      state.activeByUser = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllDeveloperAds.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllDeveloperAds.fulfilled, (state, action) => {
        state.loading = false;
        state.all = action.payload;
      })
      .addCase(fetchAllDeveloperAds.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(fetchDeveloperAdsByUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDeveloperAdsByUser.fulfilled, (state, action) => {
        state.loading = false;
        state.byUser = action.payload;
      })
      .addCase(fetchDeveloperAdsByUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(fetchActiveDeveloperAdsByUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchActiveDeveloperAdsByUser.fulfilled, (state, action) => {
        state.loading = false;
        state.activeByUser = action.payload;
      })
      .addCase(fetchActiveDeveloperAdsByUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { clearDeveloperAds } = developerAdsSlice.actions;

export default developerAdsSlice.reducer;
