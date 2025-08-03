// import { Button, Box, Typography } from '@mui/material';
// import RealEstateDeveloperAdvertisement from '../FireBase/modelsWithOperations/RealEstateDeveloperAdvertisement';
// import { devAdsData } from '../FireBase/models/Users/devAdsData';
// import { auth } from '../FireBase/firebaseConfig';

// export default function RealEstateDevAdvExample() {
//   const handleInsert = async () => {
//     const currentUser = auth.currentUser;
//     if (!currentUser) {
//       alert('يجب تسجيل الدخول أولاً!');
//       return;
//     }
//     for (const data of devAdsData) {
//       // إذا لم يوجد userId في البيانات، أضفه تلقائياً
//       const adData = {
//         ...data,
//         userId: data.userId || currentUser.uid,
//       };
//       const ad = new RealEstateDeveloperAdvertisement(adData);
//       await ad.save();
//     }
//     alert("✅ تمت إضافة بيانات المطورين إلى Firebase");
//   };

//   return (
//     <Box sx={{ p: 12 }}>
//       <Typography variant="h5" mb={2}>إدخال بيانات المطورين العقاريين</Typography>
//       <Button variant="contained" color="primary" onClick={handleInsert}>
//         أضف البيانات إلى Firebase
//       </Button>
//     </Box>
//   );
// }
