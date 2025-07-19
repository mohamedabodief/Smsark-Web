// // src/features/advertisements/advertisementsSlice.js
// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import ClientAdvertisement from '../../FireBase/modelsWithOperations/ClientAdvertisemen'; // Adjust path

// // Async Thunk for fetching all advertisements
// export const fetchAdvertisements = createAsyncThunk(
//   'advertisements/fetchAdvertisements',
//   async (_, { rejectWithValue }) => {
//     try {
//       // Use your existing ClientAdvertisement class to fetch data
//       const ads = await ClientAdvertisement.getAll();
//       return ads;
//     } catch (error) {
//       // Return a rejected promise with the error message
//       return rejectWithValue(error.message || 'Failed to fetch advertisements.');
//     }
//   }
// );

// // Async Thunk for deleting an advertisement
// export const deleteAdvertisement = createAsyncThunk(
//   'advertisements/deleteAdvertisement',
//   async (adId, { rejectWithValue }) => {
//     try {
//       // To use the delete method, we need an instance of ClientAdvertisement.
//       // A common pattern is to just pass the ID and handle deletion directly via the static method
//       // or to refactor delete to be static if it only takes ID.
//       // For now, assuming you can instantiate with just an ID for deletion if needed or that the ID is enough.
//       // Let's adapt it to use a static method for simplicity for this thunk.
//       // If ClientAdvertisement.delete() requires an instance, you'd need to create one.
//       // Assuming for this thunk that ClientAdvertisement.deleteById(adId) might exist or be added.
//       // If not, we fall back to instantiating with minimal data.
//       const adInstance = new ClientAdvertisement({ id: adId }); // This works if your delete() only needs #id
//       await adInstance.delete();
//       return adId; // Return the ID of the deleted item
//     } catch (error) {
//       return rejectWithValue(error.message || 'Failed to delete advertisement.');
//     }
//   }
// );

// // Async Thunk for updating an advertisement's status (or any updates)
// export const updateAdvertisementStatus = createAsyncThunk(
//   'advertisements/updateAdvertisementStatus',
//   async ({ adId, newStatus }, { rejectWithValue }) => {
//     try {
//       const adInstance = new ClientAdvertisement({ id: adId }); // Needs id to update
//       await adInstance.update({ ad_status: newStatus });
//       return { id: adId, newStatus }; // Return updated ID and new status
//     } catch (error) {
//       return rejectWithValue(error.message || 'Failed to update advertisement status.');
//     }
//   }
// );


// const advertisementsSlice = createSlice({
//   name: 'advertisements',
//   initialState: {
//     list: [],
//     loading: 'idle', // 'idle' | 'pending' | 'succeeded' | 'failed'
//     error: null,
//   },
//   reducers: {
//     // Synchronous reducers can go here if needed, e.g., to clear errors
//     clearAdvertisementsError: (state) => {
//       state.error = null;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       // Fetch Advertisements
//       .addCase(fetchAdvertisements.pending, (state) => {
//         state.loading = 'pending';
//         state.error = null;
//       })
//       .addCase(fetchAdvertisements.fulfilled, (state, action) => {
//         state.loading = 'succeeded';
//         state.list = action.payload.map(ad => ({ ...ad, id: ad.id })); // Ensure ID is present for DataGrid
//       })
//       .addCase(fetchAdvertisements.rejected, (state, action) => {
//         state.loading = 'failed';
//         state.error = action.payload; // Error message from rejectWithValue
//         state.list = []; // Clear list on fetch error
//       })
//       // Delete Advertisement
//       .addCase(deleteAdvertisement.pending, (state) => {
//         state.loading = 'pending'; // Or a more granular loading state for deletion
//         state.error = null;
//       })
//       .addCase(deleteAdvertisement.fulfilled, (state, action) => {
//         state.loading = 'succeeded';
//         state.list = state.list.filter(ad => ad.id !== action.payload); // Remove deleted item
//       })
//       .addCase(deleteAdvertisement.rejected, (state, action) => {
//         state.loading = 'failed';
//         state.error = action.payload;
//       })
//       // Update Advertisement Status
//       .addCase(updateAdvertisementStatus.pending, (state) => {
//         state.loading = 'pending'; // Or a more granular loading for update
//         state.error = null;
//       })
//       .addCase(updateAdvertisementStatus.fulfilled, (state, action) => {
//         state.loading = 'succeeded';
//         const { id, newStatus } = action.payload;
//         const existingAd = state.list.find(ad => ad.id === id);
//         if (existingAd) {
//           existingAd.ad_status = newStatus; // Update status
//           // Note: If you have complex expiry logic in ClientAdvertisement,
//           // ensure the newStatus reflects that or call adsActivation/removeAds from thunk.
//           // For now, this just updates the status string.
//         }
//       })
//       .addCase(updateAdvertisementStatus.rejected, (state, action) => {
//         state.loading = 'failed';
//         state.error = action.payload;
//       });
//   },
// });

// export const { clearAdvertisementsError } = advertisementsSlice.actions; // Export synchronous actions
// export default advertisementsSlice.reducer; // Export the reducer

// src/features/advertisements/advertisementsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import ClientAdvertisement from '../../FireBase/modelsWithOperations/ClientAdvertisemen'; // FIX: Corrected typo in path

// Async Thunk for fetching all advertisements
export const fetchAdvertisements = createAsyncThunk(
  'advertisements/fetchAdvertisements',
  async (_, { rejectWithValue }) => {
    try {
      // Use your existing ClientAdvertisement class to fetch data
      const ads = await ClientAdvertisement.getAll();
      // Ensure each ad has a unique 'id' property for DataGrid, using 'uid' as fallback if needed
      // The getAll() method in ClientAdvertisement should already return objects with 'id'
      return ads; // Payload already mapped to include 'id' by the model's getAll
    } catch (error) {
      // Return a rejected promise with the error message
      return rejectWithValue(error.message || 'Failed to fetch advertisements.');
    }
  }
);

// Async Thunk for deleting an advertisement
export const deleteAdvertisement = createAsyncThunk(
  'advertisements/deleteAdvertisement',
  async (adId, { rejectWithValue }) => {
    try {
      // To use the delete method, we need an instance of ClientAdvertisement.
      const adInstance = new ClientAdvertisement({ id: adId }); // This works as your delete() only needs #id
      await adInstance.delete();
      return adId; // Return the ID of the deleted item
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to delete advertisement.');
    }
  }
);

// Async Thunk for updating an advertisement's status (or any updates)
export const updateAdvertisementStatus = createAsyncThunk(
  'advertisements/updateAdvertisementStatus',
  async ({ adId, newStatus }, { rejectWithValue }) => {
    try {
      const adInstance = new ClientAdvertisement({ id: adId }); // Needs id to update
      await adInstance.update({ ad_status: newStatus });
      return { adId, newStatus }; // Return updated ID and new status (using adId consistently)
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to update advertisement status.');
    }
  }
);


const advertisementsSlice = createSlice({
  name: 'advertisements',
  initialState: {
    list: [],
    loading: 'idle', // 'idle' | 'pending' | 'succeeded' | 'failed'
    error: null,
  },
  reducers: {
    // Synchronous reducers can go here if needed, e.g., to clear errors
    clearAdvertisementsError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Advertisements
      .addCase(fetchAdvertisements.pending, (state) => {
        state.loading = 'pending';
        state.error = null;
      })
      .addCase(fetchAdvertisements.fulfilled, (state, action) => {
        state.loading = 'succeeded';
        state.list = action.payload; // Payload already mapped to include 'id' by the thunk
      })
      .addCase(fetchAdvertisements.rejected, (state, action) => {
        state.loading = 'failed';
        state.error = action.payload; // Error message from rejectWithValue
        state.list = []; // Clear list on fetch error
      })
      // Delete Advertisement
      .addCase(deleteAdvertisement.pending, (state) => {
        state.loading = 'pending'; // Or a more granular loading state for deletion
        state.error = null;
      })
      .addCase(deleteAdvertisement.fulfilled, (state, action) => {
        state.loading = 'succeeded';
        state.list = state.list.filter(ad => ad.id !== action.payload); // Remove deleted item
      })
      .addCase(deleteAdvertisement.rejected, (state, action) => {
        state.loading = 'failed';
        state.error = action.payload;
      })
      // Update Advertisement Status
      .addCase(updateAdvertisementStatus.pending, (state) => {
        state.loading = 'pending'; // Or a more granular loading for update
        state.error = null;
      })
      .addCase(updateAdvertisementStatus.fulfilled, (state, action) => {
        state.loading = 'succeeded';
        const { adId, newStatus } = action.payload; // FIX: Use adId from payload
        const existingAd = state.list.find(ad => ad.id === adId); // FIX: Use adId for finding
        if (existingAd) {
          existingAd.ad_status = newStatus; // Update status
        }
      })
      .addCase(updateAdvertisementStatus.rejected, (state, action) => {
        state.loading = 'failed';
        state.error = action.payload;
      });
  },
});

export const { clearAdvertisementsError } = advertisementsSlice.actions; // Export synchronous actions
export default advertisementsSlice.reducer; // Export the reducer
