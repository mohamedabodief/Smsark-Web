import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  profilePicUrl: './admin.jpg',
};

export const profilePicSlice = createSlice({
  name: 'profilePic',
  initialState,
  reducers: {
    setProfilePic: (state, action) => {
      state.profilePicUrl = action.payload;
    },
  },
});

export const { setProfilePic } = profilePicSlice.actions;

export default profilePicSlice.reducer;