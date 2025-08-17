import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import ClientAdvertisement from "../../FireBase/modelsWithOperations/ClientAdvertisemen";

// Ensure we only return plain serializable objects from thunks
const toPlainClientAd = (ad, index = 0) => ({
  id: ad.id || `client-temp-id-${index}`,
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
  // include additional fields if needed
});
export const fetchClientAdsByUser = createAsyncThunk(
  "clientAds/fetchByUser",
  async (userId) => {
    const ads = await ClientAdvertisement.getByUserId(userId);
    return ads.map((ad, index) => toPlainClientAd(ad, index));
  }
);
export const fetchAllClientAds = createAsyncThunk(
  "clientAds/fetchAll",
  async () => {
    const ads = await ClientAdvertisement.getAll();

    // هنا نضيف id وهمي لو مش موجود
    return ads.map((ad, index) => ({
      ...ad,
      id: ad.id || `temp-id-${index}`, // أو أي طريقة تضمن وجود id
    }));
  }
);
const clientAdsSlice = createSlice({
  name: "clientAds",
  initialState: {
    all: [],
    byUser: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearClientAds: (state) => {
      state.byUser = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchClientAdsByUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchClientAdsByUser.fulfilled, (state, action) => {
        state.loading = false;
        state.byUser = action.payload;
      })
      .addCase(fetchClientAdsByUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchAllClientAds.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllClientAds.fulfilled, (state, action) => {
        state.loading = false;
        state.all = action.payload;
      })
      .addCase(fetchAllClientAds.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { clearClientAds } = clientAdsSlice.actions;

export default clientAdsSlice.reducer;
