import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import ClientAdvertisement from "../../FireBase/modelsWithOperations/ClientAdvertisemen";
export const fetchClientAdsByUser = createAsyncThunk(
  "clientAds/fetchByUser",
  async (userId) => {
    const ads = await ClientAdvertisement.getByUserId(userId);
    
    return ads;
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
