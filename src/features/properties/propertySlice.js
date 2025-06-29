// src/features/properties/propertySlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchPropertiesFromFirebase } from './propertyService';

export const getProperties = createAsyncThunk(
  'property/getProperties',
  async () => {
    const data = await fetchPropertiesFromFirebase();
    return data;
  }
);

const propertySlice = createSlice({
  name: 'property',
  initialState: {
    properties: [],
    isLoading: false,
    error: null,
    searchTerm: ''
  },
  reducers: {
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getProperties.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getProperties.fulfilled, (state, action) => {
        state.isLoading = false;
        state.properties = action.payload;
      })
      .addCase(getProperties.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });
  },
});

export const { setSearchTerm } = propertySlice.actions;
export default propertySlice.reducer;


