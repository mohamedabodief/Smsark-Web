import { createSlice } from '@reduxjs/toolkit';

// Helper function to get current date/time in ISO format
const getCurrentTimestamp = () => new Date().toISOString();
// Initial mock data for properties
const initialState = {
    list: [
        {
            id: 'PROP001',
            name: 'فيلا فاخرة', // Luxurious Villa
            address: 'شارع النيل، الزمالك، القاهرة', // Nile St, Zamalek, Cairo
            type: 'فيلا', // Villa
            status: 'للبيع', // For Sale
            price: '10,500,000 ج.م', // 10.5M EGP
            details: '5 غرف نوم، 4 حمامات، حديقة خاصة ومسبح.', // 5 beds, 4 baths, private garden & pool.
            createdAt: '2025-06-25T10:00:00Z', // Example old timestamp
        },
        {
            id: 'PROP002',
            name: 'شقة عصرية', // Modern Apartment
            address: 'الرئيسي، التجمع الخامس، القاهرة الجديدة', // Main St, New Cairo, 5th Settlement
            type: 'شقة', // Apartment
            status: 'للإيجار', // For Rent
            price: '15,000 ج.م/شهر', // 15K EGP/month
            details: '3 غرف نوم، 2 حمام، تشطيب سوبر لوكس.', // 3 beds, 2 baths, super lux finishing.
            createdAt: '2025-07-01T14:30:00Z',
        },
        {
            id: 'PROP003',
            name: 'محل تجاري', // Commercial Shop
            address: 'سيتي سنتر، وسط البلد، الإسكندرية', // City Center, Downtown, Alexandria
            type: 'محل', // Shop
            status: 'تم البيع', // Sold (new status)
            price: '2,000,000 ج.م', // 2M EGP
            details: 'مساحة 100 متر مربع، موقع حيوي.', // 100 sqm, vital location.
            createdAt: '2025-07-05T09:15:00Z',
        },
        {
            id: 'PROP004',
            name: 'أرض زراعية', // Agricultural Land
            address: 'الفيوم، طريق الواحات', // Fayoum, Al-Wahat Road
            type: 'أرض', // Land
            status: 'قيد المراجعة', // Pending Review (new status)
            price: '500,000 ج.م/فدان', // 500K EGP/acre
            details: '5 أفدنة، مزروعة بالفاكهة.', // 5 acres, planted with fruits.
            createdAt: '2025-07-08T16:00:00Z',
        },
        {
            id: 'PROP005',
            name: 'استوديو بقلب المدينة', // Studio in Downtown
            address: 'وسط البلد، القاهرة', // Downtown, Cairo
            type: 'شقة', // Apartment
            status: 'للبيع', // For Sale
            price: '950,000 ج.م', // 950K EGP
            details: 'مساحة 50 متر مربع، مفروش بالكامل.', // 50 sqm, fully furnished.
            createdAt: getCurrentTimestamp(), // Most recent timestamp
        },
    ],
    filterStatus: 'الكل', // 'All'
    filterType: 'الكل',     // 'All'
};

const propertiesSlice = createSlice({
    name: 'properties',
    initialState,
    reducers: {
        // Reducer for adding a new property
        addProperty: (state, action) => {
            const newProperty = {
                id: `PROP${Math.floor(Math.random() * 100000).toString().padStart(5, '0')}`, // Generate a unique ID
                createdAt: getCurrentTimestamp(),
                ...action.payload,
            };
            state.list.push(newProperty);
        },
        // Reducer for editing an existing property
        editProperty: (state, action) => {
            const index = state.list.findIndex(prop => prop.id === action.payload.id);
            if (index !== -1) {
                state.list[index] = action.payload; // Replace the property with the updated one
            }
        },
        // Reducer for deleting a property
        deleteProperty: (state, action) => {
            state.list = state.list.filter(prop => prop.id !== action.payload); // action.payload is the id
        },
        // Reducer for setting status filter
        setFilterStatus: (state, action) => {
            state.filterStatus = action.payload;
        },
        // Reducer for setting type filter
        setFilterType: (state, action) => {
            state.filterType = action.payload;
        },
    },
});

// Export actions and reducer
export const { addProperty, editProperty, deleteProperty, setFilterStatus, setFilterType } = propertiesSlice.actions;
export default propertiesSlice.reducer;