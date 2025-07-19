// // src/redux/paidAdsSlice.js (Renamed file)
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
//       if (type === 'developer') {
//         const devAdInstance = new RealEstateDeveloperAdvertisement({ id });
//         await devAdInstance.delete();
//       } else if (type === 'funder') {
//         const fundAdInstance = new FinancingAdvertisement({ id });
//         await fundAdInstance.delete();
//       }
//       return { id, type };
//     } catch (error) {
//       return rejectWithValue(error.message || 'Failed to delete ad');
//     }
//   }
// );

// export const toggleAdStatus = createAsyncThunk(
//   'paidAds/toggleAdStatus', // Action type prefix changed
//   async ({ ad, type }, { rejectWithValue }) => {
//     try {
//       let instance;
//       const currentAdsStatus = ad.ads;

//       if (type === 'developer') {
//         instance = new RealEstateDeveloperAdvertisement({ id: ad.id });
//       } else if (type === 'funder') {
//         instance = new FinancingAdvertisement({ id: ad.id });
//       } else {
//         throw new Error("Unknown advertisement type.");
//       }

//       if (currentAdsStatus === true) {
//         await instance.removeAds();
//       } else {
//         await instance.adsActivation(30);
//       }
//       return { id: ad.id, type, newStatus: !currentAdsStatus };
//     } catch (error) {
//       return rejectWithValue(error.message || 'Failed to toggle ad status');
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
//       .addCase(deleteAd.pending, (state) => {})
//       .addCase(deleteAd.fulfilled, (state, action) => {})
//       .addCase(deleteAd.rejected, (state, action) => { console.error("Delete ad failed:", action.payload); })
//       .addCase(toggleAdStatus.pending, (state) => {})
//       .addCase(toggleAdStatus.fulfilled, (state, action) => {})
//       .addCase(toggleAdStatus.rejected, (state, action) => { console.error("Toggle ad status failed:", action.payload); });
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

// src/redux/paidAdsSlice.js (Renamed file)
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import FinancingAdvertisement from '../../FireBase/modelsWithOperations/FinancingAdvertisement'; // Adjust path
import RealEstateDeveloperAdvertisement from '../../FireBase/modelsWithOperations/RealEstateDeveloperAdvertisement'; // Adjust path

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

export const deleteAd = createAsyncThunk(
  'paidAds/deleteAd', // Action type prefix changed
  async ({ id, type }, { rejectWithValue }) => {
    try {
      console.log(`Attempting to delete ${type} ad with ID: ${id}`);
      if (type === 'developer') {
        const devAdInstance = new RealEstateDeveloperAdvertisement({ id });
        await devAdInstance.delete();
      } else if (type === 'funder') {
        const fundAdInstance = new FinancingAdvertisement({ id });
        await fundAdInstance.delete();
      } else {
        throw new Error('Invalid ad type for deletion.');
      }
      console.log(`Successfully deleted ${type} ad with ID: ${id}`);
      return { id, type };
    } catch (error) {
      console.error(`Error deleting ${type} ad with ID ${id}:`, error);
      return rejectWithValue(error.message || 'Failed to delete ad');
    }
  }
);

export const toggleAdStatus = createAsyncThunk(
  'paidAds/toggleAdStatus', // Action type prefix changed
  async ({ ad, type }, { rejectWithValue }) => {
    try {
      let instance;
      const currentAdsStatus = ad.ads; // Get current status from the passed ad object

      if (type === 'developer') {
        instance = new RealEstateDeveloperAdvertisement({ id: ad.id });
      } else if (type === 'funder') {
        instance = new FinancingAdvertisement({ id: ad.id });
      } else {
        throw new Error("Unknown advertisement type.");
      }

      if (currentAdsStatus === true) {
        await instance.removeAds(); // Call instance method
      } else {
        await instance.adsActivation(30); // Call instance method
      }
      console.log(`Successfully toggled ${type} ad status for ID: ${ad.id} to ${!currentAdsStatus}`);
      return { id: ad.id, type, newStatus: !currentAdsStatus };
    } catch (error) {
      console.error(`Error toggling ${type} ad status for ID ${ad.id}:`, error);
      return rejectWithValue(error.message || 'Failed to toggle ad status');
    }
  }
);

const paidAdsSlice = createSlice({ // Slice name changed
  name: 'paidAds', // Slice name property changed
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
      .addCase(deleteAd.pending, (state) => {
        // No explicit loading state change here, handled by individual ad loading if needed
      })
      .addCase(deleteAd.fulfilled, (state, action) => {
        const { id, type } = action.payload;
        if (type === 'developer') {
          state.developerAds = state.developerAds.filter(ad => ad.id !== id);
        } else if (type === 'funder') {
          state.funderAds = state.funderAds.filter(ad => ad.id !== id);
        }
      })
      .addCase(deleteAd.rejected, (state, action) => {
        console.error("Delete ad failed:", action.payload);
        // You might want to set a global error state or specific ad error here
      })
      .addCase(toggleAdStatus.pending, (state) => {
        // No explicit loading state change here, handled by individual ad loading if needed
      })
      .addCase(toggleAdStatus.fulfilled, (state, action) => {
        const { id, type, newStatus } = action.payload;
        if (type === 'developer') {
          const adIndex = state.developerAds.findIndex(ad => ad.id === id);
          if (adIndex !== -1) {
            state.developerAds[adIndex].ads = newStatus; // Update the 'ads' status
          }
        } else if (type === 'funder') {
          const adIndex = state.funderAds.findIndex(ad => ad.id === id);
          if (adIndex !== -1) {
            state.funderAds[adIndex].ads = newStatus; // Update the 'ads' status
          }
        }
      })
      .addCase(toggleAdStatus.rejected, (state, action) => {
        console.error("Toggle ad status failed:", action.payload);
        // You might want to set a global error state or specific ad error here
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
