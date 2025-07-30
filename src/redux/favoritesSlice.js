// redux/favoritesSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import Favorite from '../FireBase/modelsWithOperations/Favorite';

// helpers for localStorage
const FAVORITES_KEY = 'favorites';

const saveFavoritesToLocalStorage = (favorites) => {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
};

const loadFavoritesFromLocalStorage = () => {
  const data = localStorage.getItem(FAVORITES_KEY);
  return data ? JSON.parse(data) : [];
};


export const toggleFavoriteAsync = createAsyncThunk(
  'favorites/toggleFavoriteAsync',
  async ({ userId, advertisementId, type }) => {
    const result = await Favorite.toggleFavorite(userId, advertisementId);
    return { advertisementId, favorited: result.favorited, type };
  }
);

export const loadFavoritesAsync = createAsyncThunk(
  'favorites/loadFavoritesAsync',
  async (userId) => {
    return new Promise((resolve) => {
      Favorite.subscribeByUser(userId, (favorites) => {
        // هنا بنرجع كل من id و type عشان الكومبوننت يقدر يحدد isFavorited صح
        resolve(favorites.map((fav) => ({
          advertisement_id: fav.advertisement_id,
          type: fav.type
        })));
      });
    });
  }
);


const favoritesSlice = createSlice({
  name: 'favorites',
  initialState: {
    list: loadFavoritesFromLocalStorage(),
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(toggleFavoriteAsync.fulfilled, (state, action) => {
        const { advertisementId, type } = action.meta.arg;
        const { favorited } = action.payload;

        if (favorited) {
          state.list.push({ advertisement_id: advertisementId, type });
        } else {
          state.list = state.list.filter(
            (fav) =>
              !(fav.advertisement_id === advertisementId && fav.type === type)
          );
        }
        saveFavoritesToLocalStorage(state.list);
      })

      .addCase(loadFavoritesAsync.fulfilled, (state, action) => {
  state.list = action.payload;
  saveFavoritesToLocalStorage(state.list);
});

  },
});

export default favoritesSlice.reducer;

// stop______________________