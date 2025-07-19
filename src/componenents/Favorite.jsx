import { Box, Typography } from "@mui/material";

export default function Favorite() {
  return (
    <Box sx={{ p: 5, direction: 'rtl' }}>
      <Typography variant="h4" fontWeight="bold">قائمة المفضلة</Typography>
      <Typography sx={{ mt: 2 }}>هنا ستظهر العقارات التي قمت بإضافتها إلى المفضلة.</Typography>
    </Box>
  );
}
