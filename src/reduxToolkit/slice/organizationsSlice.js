// src/slices/organizationsSlice.js (or wherever your slice is located)
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    organizations: [
        // Added 'type' property to distinguish between developers and funders
        { id: 'DEV001', name: 'شركة العمران الحديثة', contact: 'info@modernurban.com', type: 'developer' },
        { id: 'DEV002', name: 'المطورون المبتكرون', contact: 'sales@innovativedev.net', type: 'developer' },
        { id: 'FUND001', name: 'صندوق التمويل العقاري الرائد', contact: 'invest@leadingfund.com', type: 'funder' },
        { id: 'FUND002', name: 'مؤسسة الدعم العقاري', contact: 'support@realestatesupport.co', type: 'funder' },
        { id: 'ORG003', name: 'Innovate Minds LLC', contact: 'hello@innovate.com', type: 'developer' }, // Example of an existing org defaulting to developer type
    ],
};

const organizationsSlice = createSlice({
    name: 'organizations',
    initialState,
    reducers: {
        addOrganization: (state, action) => {
            // Ensure payload includes 'id', 'name', 'contact', and 'type'
            state.organizations.push(action.payload);
        },
        editOrganization: (state, action) => {
            // Destructure all expected fields, including 'type'
            const { id, name, contact, type } = action.payload;
            const index = state.organizations.findIndex((org) => org.id === id);
            if (index !== -1) {
                // Update all relevant fields
                state.organizations[index] = { ...state.organizations[index], name, contact, type };
            }
        },
        deleteOrganization: (state, action) => {
            state.organizations = state.organizations.filter((org) => org.id !== action.payload);
        },
    },
});

export const { addOrganization, editOrganization, deleteOrganization } = organizationsSlice.actions;
export default organizationsSlice.reducer;