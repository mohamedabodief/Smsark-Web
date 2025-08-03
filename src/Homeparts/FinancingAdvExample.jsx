// import { Button, Box, Typography } from '@mui/material';
// import FinancingAdvertisement from '../FireBase/modelsWithOperations/FinancingAdvertisement';
// import { financingAdsData } from '../FireBase/models/Users/FinAdsData';
// import ManualNotification from './ManualNotification';
// export default function FinancingAdvExample() {
//   const handleInsert = async () => {
//     for (const adData of financingAdsData) {
//       const ad = new FinancingAdvertisement(adData);
//       await ad.save();
//     }
//     alert("✅ تمت إضافة البيانات بنجاح إلى فايربيز");
//   };

//   return (<>
//     <Box sx={{ p: 12 }}>
//       <Typography variant="h5" mb={2}>إدخال بيانات عروض التمويل</Typography>
//       <Button variant="contained" color="primary" onClick={handleInsert}>
//         أضف البيانات إلى Firebase
//       </Button>
//     </Box>
//     <ManualNotification />
//     </>
//   );
// }
