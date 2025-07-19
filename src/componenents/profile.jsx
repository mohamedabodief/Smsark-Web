import { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
} from '@mui/material';

const Profile = () => {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const savedRequests = JSON.parse(localStorage.getItem('financingRequests')) || [];
    setRequests(savedRequests);
  }, []);

  return (
    <Box sx={{ p: 4, pt: 13, pb: 12 }} dir="rtl">
      <Typography variant="h5" fontWeight="bold" mb={4} textAlign="center">
        طلبات التمويل العقاري الخاصة بك
      </Typography>

      {requests.length === 0 ? (
        <Typography textAlign="center">لا توجد طلبات حتى الآن.</Typography>
      ) : (
        <Grid container spacing={3}>
          {requests.map((req, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
                <CardContent>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    قيمة التمويل: {req.financing_amount} ج.م
                  </Typography>
                  <Typography>معرّف الإعلان: {req.advertisement_id}</Typography>
                  <Typography>الدخل الشهري: {req.monthly_income}</Typography>
                  <Typography>الوظيفة: {req.job_title}</Typography>
                  <Typography>السن: {req.age}</Typography>
                  <Typography>جهة العمل: {req.employer}</Typography>
                  <Typography>الحالة الاجتماعية: {req.marital_status}</Typography>
                  <Typography>عدد المعالين: {req.dependents}</Typography>
                  <Typography>مدة السداد: {req.repayment_years} سنة</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default Profile;
