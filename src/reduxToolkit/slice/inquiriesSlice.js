import { createSlice } from '@reduxjs/toolkit';

// Function to generate unique IDs and current timestamp
const generateUniqueId = () => `INQ${Date.now()}-${Math.floor(Math.random() * 1000)}`;
const getCurrentTimestamp = () => new Date().toISOString();

const initialState = {
    list: [
        {
            id: generateUniqueId(),
            user_id: 'USER001',
            advertisement_id: 'PROP001', // Corresponds to 'فيلا فاخرة'
            message: 'مرحبًا، أنا مهتم بهذه الفيلا. هل يمكنني الحصول على مزيد من التفاصيل أو تحديد موعد للمعاينة؟',
            status: 'pending', // "pending" | "contacted" | "closed"
            created_at: '2025-07-08T10:30:00Z',
        },
        {
            id: generateUniqueId(),
            user_id: 'USER002',
            advertisement_id: 'PROP002', // Corresponds to 'شقة عصرية'
            message: 'السلام عليكم، كم الإيجار الشهري وهل الشقة مفروشة بالكامل؟',
            status: 'contacted',
            created_at: '2025-07-07T14:15:00Z',
        },
        {
            id: generateUniqueId(),
            user_id: 'USER003',
            advertisement_id: 'PROP001', // Another inquiry for 'فيلا فاخرة'
            message: 'أود الاستفسار عن إمكانية الشراء بالتقسيط لهذه الفيلا.',
            status: 'pending',
            created_at: '2025-07-09T09:00:00Z',
        },
        {
            id: generateUniqueId(),
            user_id: 'USER004',
            advertisement_id: 'PROP003', // Corresponds to 'محل تجاري' (even if sold, inquiry might predate sale)
            message: 'هل المحل التجاري لا يزال متاحًا؟ وما هي مساحته الفعلية؟',
            status: 'closed',
            created_at: '2025-07-06T11:00:00Z',
        },
        {
            id: generateUniqueId(),
            user_id: 'USER005',
            advertisement_id: 'PROP005', // Corresponds to 'استوديو بقلب المدينة'
            message: 'هل الاستوديو متاح للمعاينة نهاية الأسبوع؟',
            status: 'pending',
            created_at: getCurrentTimestamp(), // Most recent inquiry
        },
    ],
    filterStatus: 'الكل', // 'All'
};

const inquiriesSlice = createSlice({
    name: 'inquiries',
    initialState,
    reducers: {
        // Reducer to add a new inquiry
        addInquiry: (state, action) => {
            const newInquiry = {
                id: generateUniqueId(),
                created_at: getCurrentTimestamp(),
                status: 'pending', // New inquiries are always pending initially
                ...action.payload,
            };
            state.list.push(newInquiry);
        },
        // Reducer to update an inquiry's status or other details
        updateInquiry: (state, action) => {
            const { id, ...updatedFields } = action.payload;
            const index = state.list.findIndex(inquiry => inquiry.id === id);
            if (index !== -1) {
                state.list[index] = { ...state.list[index], ...updatedFields };
            }
        },
        // Reducer to delete an inquiry
        deleteInquiry: (state, action) => {
            state.list = state.list.filter(inquiry => inquiry.id !== action.payload);
        },
        // Reducer to set inquiry status filter
        setFilterStat: (state, action) => {
            state.filterStatus = action.payload;
        },
    },
});

export const { addInquiry, updateInquiry, deleteInquiry, setFilterStat } = inquiriesSlice.actions;
export default inquiriesSlice.reducer;