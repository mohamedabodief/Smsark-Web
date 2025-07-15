import { Button, Box, Typography } from '@mui/material';
import RealEstateDeveloperAdvertisement from '../FireBase/modelsWithOperations/RealEstateDeveloperAdvertisement';
import { devAdsData } from '../FireBase/models/Users/devAdsData';

export default function RealEstateDevAdvExample() {
  const handleInsert = async () => {
    for (const data of devAdsData) {
      const ad = new RealEstateDeveloperAdvertisement(data);
      await ad.save();
    }
    alert("✅ تمت إضافة بيانات المطورين إلى Firebase");
  };

  return (
    <Box sx={{ p: 12 }}>
      <Typography variant="h5" mb={2}>إدخال بيانات المطورين العقاريين</Typography>
      <Button variant="contained" color="primary" onClick={handleInsert}>
        أضف البيانات إلى Firebase
      </Button>
    </Box>
  );
}
