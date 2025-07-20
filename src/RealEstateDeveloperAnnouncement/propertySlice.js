//scr/RealEstateDeveloperAnnouncement/Slice.js

// import { createSlice } from "@reduxjs/toolkit";

// const initialState = {
//   formData: {
//     developer_name: "",
//     description: "",
//     project_types: [],
//     images: [],
//     phone: "",
//     location: { city: "", governorate: "" },
//     price_start_from: "",
//     price_end_to: "",
//     userId: "",
//     type_of_user: "developer",
//     rooms: "",
//     bathrooms: "",
//     floor: "",
//     furnished: "نعم",
//     status: "جاهز",
//     paymentMethod: "كاش",
//     negotiable: "نعم",
//     deliveryTerms: "",
//     features: [],
//     area: "",
//   },
// };

// const propertySlice = createSlice({
//   name: "property",
//   initialState,
//   reducers: {
//     setFormData: (state, action) => {
//       state.formData = { ...state.formData, ...action.payload };
//     },
//     resetForm: (state) => {
//       state.formData = initialState.formData;
//     },
//   },
// });

// export const { setFormData, resetForm } = propertySlice.actions;
// export default propertySlice.reducer;



//scr/RealEstateDeveloperAnnouncement/propertySlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  formData: {
    developer_name: "",
    description: "",
    project_types: [],
    phone: "",
    location: { city: "", governorate: "" },
    price_start_from: "",
    price_end_to: "",
    userId: "",
    type_of_user: "developer",
    rooms: "",
    bathrooms: "",
    floor: "",
    furnished: "نعم",
    status: "جاهز",
    paymentMethod: "كاش",
    negotiable: "نعم",
    deliveryTerms: "",
    features: [],
    area: "",
  },
};

const propertySlice = createSlice({
  name: "property",
  initialState,
  reducers: {
    setFormData: (state, action) => {
      state.formData = { ...state.formData, ...action.payload };
    },
    resetForm: (state) => {
      state.formData = initialState.formData;
    },
  },
});

export const { setFormData, resetForm } = propertySlice.actions;
export default propertySlice.reducer;