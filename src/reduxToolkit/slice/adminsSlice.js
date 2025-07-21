import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  admins: [
    { id: 'admin-1', name: 'Admin One', email: 'admin1@example.com' },
    { id: 'admin-2', name: 'Super Admin', email: 'super@example.com' },
  ],
};

const adminsSlice = createSlice({
  name: 'admins',
  initialState,
  reducers: {
    addAdmin: (state, action) => {
      state.admins.push(action.payload);
    },
    editAdmin: (state, action) => {
      const { id, name, email } = action.payload;
      const index = state.admins.findIndex((admin) => admin.id === id);
      if (index !== -1) {
        state.admins[index] = { ...state.admins[index], name, email };
      }
    },
    deleteAdmin: (state, action) => {
      state.admins = state.admins.filter((admin) => admin.id !== action.payload);
    },
  },
});

export const { addAdmin, editAdmin, deleteAdmin } = adminsSlice.actions;
export default adminsSlice.reducer;