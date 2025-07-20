import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// تحميل الفيفوريت من localStorage
const loadFavoritesFromLocalStorage = () => {
  const data = localStorage.getItem('favorites');
  return data ? JSON.parse(data) : [];
};

// حفظ الفيفوريت في localStorage
const saveFavoritesToLocalStorage = (favorites) => {
  localStorage.setItem('favorites', JSON.stringify(favorites));
};

export const toggleFavoriteAsync = createAsyncThunk(
  'favorites/toggleFavorite',
  async ({ userId, advertisementId, type }) => {
    return { userId, advertisementId, type };
  }
);

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState: {
    list: loadFavoritesFromLocalStorage(),
  },
  reducers: {
    setFavorites(state, action) {
      state.list = action.payload;
      saveFavoritesToLocalStorage(state.list);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(toggleFavoriteAsync.fulfilled, (state, action) => {
      const { advertisementId, type } = action.payload;
      const index = state.list.findIndex(
        (fav) =>
          fav.advertisement_id === advertisementId && fav.type === type
      );

      if (index >= 0) {
        state.list.splice(index, 1);
      } else {
        state.list.push({ advertisement_id: advertisementId, type });
      }

      saveFavoritesToLocalStorage(state.list);
    });
  },
});

export const { setFavorites } = favoritesSlice.actions;
export default favoritesSlice.reducer;
