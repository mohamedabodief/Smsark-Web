import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import RealEstateDeveloperAdvertisement from "../../FireBase/modelsWithOperations/RealEstateDeveloperAdvertisement";
export const fetchAllDeveloperAds = createAsyncThunk(
  "developerAds/fetchAll",
  async () => {
    const ads = await RealEstateDeveloperAdvertisement.getAll();
  return ads.map((ad, index) => ({
      ...ad,
      id: ad.id || `financing-temp-id-${index}`,
    }));
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
  setDeveloperAdsByUser: (state, action) => {
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
      developer_name: ad.developer_name,
      price_start_from: ad.price_start_from,
      price_end_to: ad.price_end_to,
      location: ad.location,
      rooms: ad.rooms,
      bathrooms: ad.bathrooms,
      floor: ad.floor,
      furnished: ad.furnished,
      type_of_user: ad.type_of_user,
      project_types: ad.project_types,
    }));
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

export const { clearDeveloperAds ,setDeveloperAdsByUser } = developerAdsSlice.actions;

export default developerAdsSlice.reducer;
