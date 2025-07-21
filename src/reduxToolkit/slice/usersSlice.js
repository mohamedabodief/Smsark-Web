import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  users: [
    { id: '12345', name: 'John Doe', email: 'john.doe@example.com' },
    { id: '12346', name: 'Jane Smith', email: 'jane.smith@example.com' },
    { id: '12347', name: 'Peter Jones', email: 'peter.jones@example.com' },
    { id: '12348', name: 'Alice Brown', email: 'alice.b@example.com' },
  ],
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    addUser: (state, action) => {
      state.users.push(action.payload);
    },
    editUser: (state, action) => {
      const { id, name, email } = action.payload;
      const index = state.users.findIndex((user) => user.id === id);
      if (index !== -1) {
        state.users[index] = { ...state.users[index], name, email };
      }
    },
    deleteUser: (state, action) => {
      state.users = state.users.filter((user) => user.id !== action.payload);
    },
  },
});

export const { addUser, editUser, deleteUser } = usersSlice.actions;
export default usersSlice.reducer;