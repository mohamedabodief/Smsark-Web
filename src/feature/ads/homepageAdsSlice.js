import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import HomepageAdvertisement from "../../FireBase/modelsWithOperations/HomepageAdvertisement"; // Ensure this path is correct


// Ensure HomepageAdvertisement instances are converted to plain serializable objects
const toPlainHomepageAd = (ad, index = 0) => {
  const id = ad?.id ?? ad?.docId ?? ad?.uid ?? `homepage-temp-id-${index}`;
  const adExpiryTime = ad?.adExpiryTime;
  return {
    id,
    title: ad?.title ?? "",
    description: ad?.description ?? "",
    images: ad?.images ?? [],
    image: ad?.image ?? null,
    phone: ad?.phone ?? "",
    userId: ad?.userId ?? ad?.uid ?? null,
    ads: ad?.ads ?? false,
    adExpiryTime: adExpiryTime?.toMillis ? adExpiryTime.toMillis() : (adExpiryTime ?? null),
    reviewStatus: ad?.reviewStatus ?? null,
    reviewed_by: ad?.reviewed_by ?? null,
    review_note: ad?.review_note ?? null,
    status: ad?.status ?? null,
    receipt_image: ad?.receipt_image ?? null,
  };
};
// Fetch all homepage ads
export const fetchAllHomepageAds = createAsyncThunk(
  "homepageAds/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const ads = await HomepageAdvertisement.getAll();
      return ads.map((ad, i) => toPlainHomepageAd(ad, i));
    } catch (error) {
      console.error("Error fetching all homepage ads in thunk:", error);
      return rejectWithValue(error.message || "Failed to fetch homepage ads.");
    }
  }
);

// Fetch homepage ads by user
export const fetchHomepageAdsByUser = createAsyncThunk(
  "homepageAds/fetchByUser",
  async (userId, { rejectWithValue }) => {
    try {
      const ads = await HomepageAdvertisement.getAll();
      return ads.map((ad, i) => toPlainHomepageAd(ad, i)).filter(ad => ad.userId === userId);
    } catch (error) {
      console.error("Error fetching homepage ads by user in thunk:", error);
      return rejectWithValue(error.message || "Failed to fetch user's homepage ads.");
    }
  }
);

// Fetch homepage ads by review status
export const fetchHomepageAdsByStatus = createAsyncThunk(
  "homepageAds/fetchByStatus",
  async (status, { rejectWithValue }) => {
    try {
      const ads = await HomepageAdvertisement.getByReviewStatus(status);
      return ads.map((ad, i) => toPlainHomepageAd(ad, i));
    } catch (error) {
      console.error("Error fetching homepage ads by status in thunk:", error);
      return rejectWithValue(error.message || "Failed to fetch homepage ads by status.");
    }
  }
);
// Subscribe to real-time updates for all ads
export const subscribeToAllHomepageAds = createAsyncThunk(
  "homepageAds/subscribeToAll",
  async (_, { dispatch }) => {
    try {
      const unsubscribe = HomepageAdvertisement.subscribeToAll((ads) => {
        console.log("HomepageAds subscription callback - received ads:", ads.length);
        const plain = ads.map((ad, i) => toPlainHomepageAd(ad, i));
        dispatch(setAllHomepageAds(plain));
      });
      return unsubscribe;
    } catch (error) {
      console.error("Error subscribing to all homepage ads:", error);
      throw error;
    }
  }
);

// Subscribe to real-time updates for user's ads
export const subscribeToUserHomepageAds = createAsyncThunk(
  "homepageAds/subscribeToUser",
  async (userId, { dispatch }) => {
    try {
      console.log("subscribeToUserHomepageAds - Setting up subscription for user:", userId);
      const unsubscribe = HomepageAdvertisement.subscribeByUserId(userId, (ads) => {
        console.log("subscribeToUserHomepageAds - Received ads for user:", userId, "Count:", ads.length);
        const plain = ads.map((ad, i) => toPlainHomepageAd(ad, i));
        dispatch(setUserHomepageAds(plain));
      });

      // Return the unsubscribe function but don't store it in Redux state
      // Components should manage this subscription directly
      return unsubscribe;
    } catch (error) {
      console.error("Error subscribing to user homepage ads:", error);
      throw error;
    }
  }
);

// Subscribe to real-time updates for ads by status
export const subscribeToHomepageAdsByStatus = createAsyncThunk(
  "homepageAds/subscribeByStatus",
  async (status, { dispatch }) => {
    try {
      const unsubscribe = HomepageAdvertisement.subscribeByStatus(status, (ads) => {
        const plain = ads.map((ad, i) => toPlainHomepageAd(ad, i));
        dispatch(setHomepageAdsByStatus(plain));
      });
      return unsubscribe;
    } catch (error) {
      console.error("Error subscribing to homepage ads by status:", error);
      throw error;
    }
  }
);
// Create new homepage ad
export const createHomepageAd = createAsyncThunk(
  "homepageAds/create",
  async ({ adData, imageFile, receiptFile }, { rejectWithValue }) => {
    try {
      const ad = new HomepageAdvertisement(adData);
      const id = await ad.save(imageFile, receiptFile);
      // Return the full ad object with the new ID for the state
      // Fetch the ad by ID to get its full plain object representation
      const createdAd = await HomepageAdvertisement.getById(id);
      return createdAd;
    } catch (error) {
      console.error("Error creating homepage ad in thunk:", error);
      return rejectWithValue(error.message || "Failed to create homepage ad.");
    }
  }
);

// Update homepage ad
export const updateHomepageAd = createAsyncThunk(
  "homepageAds/update",
  async ({ id, updates, newImageFile, newReceiptFile }, { rejectWithValue }) => {
    try {
      const ad = new HomepageAdvertisement({ id });
      await ad.update(updates, newImageFile, newReceiptFile);
      // Fetch the updated ad to get its full plain object representation
      const updatedAd = await HomepageAdvertisement.getById(id);
      return updatedAd;
    } catch (error) {
      console.error("Error updating homepage ad in thunk:", error);
      return rejectWithValue(error.message || "Failed to update homepage ad.");
    }
  }
);

// Delete homepage ad
export const deleteHomepageAd = createAsyncThunk(
  "homepageAds/delete",
  async (id, { rejectWithValue }) => {
    try {
      const ad = new HomepageAdvertisement({ id });
      await ad.delete();
      return id;
    } catch (error) {
      console.error("Error deleting homepage ad in thunk:", error);
      return rejectWithValue(error.message || "Failed to delete homepage ad.");
    }
  }
);

// Approve homepage ad
export const approveHomepageAd = createAsyncThunk(
  "homepageAds/approve",
  async (id, { rejectWithValue }) => {
    try {
      const ad = await HomepageAdvertisement.getById(id);
      const updatedAd = new HomepageAdvertisement(ad);
      await updatedAd.approve();
      return updatedAd;
    } catch (error) {
      console.error("Error approving homepage ad in thunk:", error);
      return rejectWithValue(error.message || "Failed to approve homepage ad.");
    }
  }
);

// Reject homepage ad
export const rejectHomepageAd = createAsyncThunk(
  "homepageAds/reject",
  async ({ id, reason }, { rejectWithValue }) => {
    try {
      const ad = await HomepageAdvertisement.getById(id);
      const updatedAd = new HomepageAdvertisement(ad);
      await updatedAd.reject(reason);
      return updatedAd;
    } catch (error) {
      console.error("Error rejecting homepage ad in thunk:", error);
      return rejectWithValue(error.message || "Failed to reject homepage ad.");
    }
  }
);

// Return to pending
export const returnHomepageAdToPending = createAsyncThunk(
  "homepageAds/returnToPending",
  async (id, { rejectWithValue }) => {
    try {
      const ad = new HomepageAdvertisement({ id });
      await ad.returnToPending();
      const updatedAd = await HomepageAdvertisement.getById(id);
      return updatedAd; // Now returns the full plain object
    } catch (error) {
      console.error("Error returning homepage ad to pending in thunk:", error);
      return rejectWithValue(error.message || "Failed to return homepage ad to pending.");
    }
  }
);

// Activate ad
export const activateHomepageAd = createAsyncThunk(
  "homepageAds/activate",
  async ({ id, days }, { rejectWithValue }) => {
    try {
      const ad = new HomepageAdvertisement({ id });
      await ad.adsActivation(days);
      const updatedAd = await HomepageAdvertisement.getById(id);
      return updatedAd; // Now returns the full plain object
    } catch (error) {
      console.error("Error activating homepage ad in thunk:", error);
      return rejectWithValue(error.message || "Failed to activate homepage ad.");
    }
  }
);

// Deactivate ad
export const deactivateHomepageAd = createAsyncThunk(
  "homepageAds/deactivate",
  async (id, { rejectWithValue }) => {
    try {
      const ad = new HomepageAdvertisement({ id });
      await ad.removeAds();
      const updatedAd = await HomepageAdvertisement.getById(id);
      return updatedAd;
    } catch (error) {
      console.error("Error deactivating homepage ad in thunk:", error);
      return rejectWithValue(error.message || "Failed to deactivate homepage ad.");
    }
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
    // Removed subscriptions from state - they should be managed outside Redux
  },
  reducers: {
    clearHomepageAds: (state) => {
      state.all = [];
      state.byUser = [];
      state.byStatus = [];
    },
    setAllHomepageAds: (state, action) => {
      console.log("setAllHomepageAds reducer - setting ads:", action.payload.length);
      state.all = action.payload;
    },
    setUserHomepageAds: (state, action) => {
      state.byUser = action.payload;
    },
    setHomepageAdsByStatus: (state, action) => {
      state.byStatus = action.payload;
    },
    // Removed setSubscription and clearSubscriptions reducers
    // Subscriptions should be managed outside Redux to avoid non-serializable values
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
        state.all = action.payload; // payload is already plain objects with 'id'
      })
      .addCase(fetchAllHomepageAds.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message; // Use payload for custom error message
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
        state.error = action.payload || action.error.message;
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
        state.error = action.payload || action.error.message;
      })

      // Create ad
      .addCase(createHomepageAd.fulfilled, (state, action) => {
        // No manual state update - let onSnapshot handle it
      })
      .addCase(createHomepageAd.rejected, (state, action) => {
        state.error = action.payload || action.error.message;
      })

      // Update ad
      .addCase(updateHomepageAd.fulfilled, (state, action) => {
        // No manual state update - let onSnapshot handle it
      })
      .addCase(updateHomepageAd.rejected, (state, action) => {
        state.error = action.payload || action.error.message;
      })

      // Delete ad
      .addCase(deleteHomepageAd.fulfilled, (state, action) => {
        // No manual state update - let onSnapshot handle it
      })
      .addCase(deleteHomepageAd.rejected, (state, action) => {
        state.error = action.payload || action.error.message;
      })

      // Approve ad
      .addCase(approveHomepageAd.fulfilled, (state, action) => {
        // No manual state update - let onSnapshot handle it
      })
      .addCase(approveHomepageAd.rejected, (state, action) => {
        state.error = action.payload || action.error.message;
      })

      // Reject ad
      .addCase(rejectHomepageAd.fulfilled, (state, action) => {
        // No manual state update - let onSnapshot handle it
      })
      .addCase(rejectHomepageAd.rejected, (state, action) => {
        state.error = action.payload || action.error.message;
      })

      // Return to pending
      .addCase(returnHomepageAdToPending.fulfilled, (state, action) => {
        // No manual state update - let onSnapshot handle it
      })
      .addCase(returnHomepageAdToPending.rejected, (state, action) => {
        state.error = action.payload || action.error.message;
      })

      // Activate ad
      .addCase(activateHomepageAd.fulfilled, (state, action) => {
        // No manual state update - let onSnapshot handle it
      })
      .addCase(activateHomepageAd.rejected, (state, action) => {
        state.error = action.payload || action.error.message;
      })

      // Deactivate ad
      .addCase(deactivateHomepageAd.fulfilled, (state, action) => {
        // No manual state update - let onSnapshot handle it
      })
      .addCase(deactivateHomepageAd.rejected, (state, action) => {
        state.error = action.payload || action.error.message;
      })

      // Subscribe to all ads - subscription management moved outside Redux
      .addCase(subscribeToAllHomepageAds.fulfilled, (state, action) => {
        // Subscription is managed outside Redux to avoid non-serializable values
        // The subscription callback will update the state via setAllHomepageAds
      })
      .addCase(subscribeToAllHomepageAds.rejected, (state, action) => {
        state.error = action.payload || action.error.message;
      });
  },
});

export const {
  clearHomepageAds,
  setAllHomepageAds,
  setUserHomepageAds,
  setHomepageAdsByStatus
  // Removed setSubscription and clearSubscriptions exports
} = homepageAdsSlice.actions;
export default homepageAdsSlice.reducer;
