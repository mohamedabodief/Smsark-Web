import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    // Mock data for a single client user
    // In a real app, this would be fetched from a backend based on the logged-in user's ID
    clientData: {
        uid: 'CLIENT_MOCK_123',
        cli_name: 'أحمد محمود الحسيني', // Ahmed Mahmoud El-Husseini
        phone: '+966501234567',
        gender: 'ذكر', // Male
        age: 30,
        image: null, // Image URL will be handled by profilePicSlice
        city: 'الرياض', // Riyadh
        governorate: 'منطقة الرياض', // Riyadh Region
        address: 'شارع الأمير محمد بن عبد العزيز، حي العليا، الرياض', // Prince Mohammed bin Abdulaziz Street, Al Olaya District, Riyadh
        // Add email here as it's typically part of user profile
        email: 'ahmed.elhosseiny@example.com',
    },
    // You might add a loading state or error state here for async operations
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
};

const clientUserSlice = createSlice({
    name: 'clientUser',
    initialState,
    reducers: {
        // Action to update client user data
        updateClientProfile: (state, action) => {
            // Merge the updated fields from action.payload into the current clientData
            state.clientData = { ...state.clientData, ...action.payload };
        },
        // You could add reducers for fetching data, setting loading states, etc.
    },
});

export const { updateClientProfile } = clientUserSlice.actions;
export default clientUserSlice.reducer;