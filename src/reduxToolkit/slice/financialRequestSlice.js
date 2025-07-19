import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { collection, getDocs, deleteDoc, doc, updateDoc, query, where } from "firebase/firestore";
import { db } from "../../FireBase/firebaseConfig";

// Async thunk to fetch all financing requests
export const fetchFinancialRequests = createAsyncThunk(
  "financialRequests/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const colRef = collection(db, "FinancingRequests");
      const querySnapshot = await getDocs(colRef);
      return querySnapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }));
    } catch (error) {
      return rejectWithValue(error.message || "فشل تحميل طلبات التمويل");
    }
  }
);

// Async thunk to delete a financing request
export const deleteFinancialRequest = createAsyncThunk(
  "financialRequests/delete",
  async (id, { rejectWithValue }) => {
    try {
      await deleteDoc(doc(db, "FinancingRequests", id));
      return id;
    } catch (error) {
      return rejectWithValue(error.message || "فشل حذف الطلب");
    }
  }
);

// Async thunk to update a financing request
export const updateFinancialRequest = createAsyncThunk(
  "financialRequests/update",
  async ({ id, updates }, { rejectWithValue }) => {
    try {
      const docRef = doc(db, "FinancingRequests", id);
      await updateDoc(docRef, updates);
      return { id, updates };
    } catch (error) {
      return rejectWithValue(error.message || "فشل تحديث الطلب");
    }
  }
);

// Async thunk to delete all requests for a specific advertisement
export const deleteRequestsByAdvertisement = createAsyncThunk(
  "financialRequests/deleteByAdvertisement",
  async (advertisementId, { rejectWithValue }) => {
    try {
      const colRef = collection(db, "FinancingRequests");
      const q = query(colRef, where("advertisement_id", "==", advertisementId));
      const querySnapshot = await getDocs(q);
      const batchDeletes = querySnapshot.docs.map((docSnap) => deleteDoc(docSnap.ref));
      await Promise.all(batchDeletes);
      return advertisementId;
    } catch (error) {
      return rejectWithValue(error.message || "فشل حذف الطلبات المرتبطة بالإعلان");
    }
  }
);

const financialRequestSlice = createSlice({
  name: "financialRequests",
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFinancialRequests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFinancialRequests.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchFinancialRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteFinancialRequest.fulfilled, (state, action) => {
        state.list = state.list.filter((req) => req.id !== action.payload);
      })
      .addCase(deleteFinancialRequest.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(updateFinancialRequest.fulfilled, (state, action) => {
        const { id, updates } = action.payload;
        const idx = state.list.findIndex((req) => req.id === id);
        if (idx !== -1) {
          state.list[idx] = { ...state.list[idx], ...updates };
        }
      })
      .addCase(updateFinancialRequest.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(deleteRequestsByAdvertisement.fulfilled, (state, action) => {
        // Remove all requests with the given advertisement_id
        state.list = state.list.filter((req) => req.advertisement_id !== action.payload);
      })
      .addCase(deleteRequestsByAdvertisement.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default financialRequestSlice.reducer; 