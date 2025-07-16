import {
  Box, TextField, Button, Typography, MenuItem
} from '@mui/material';
import { useState } from 'react';
import FinancingRequest from '../FireBase/modelsWithOperations/FinancingRequest';

export default function FinancingRequestForm() {
  const [form, setForm] = useState({
    user_id: 'user-id',
    advertisement_id: '', 
    monthly_income: '',
    job_title: '',
    employer: '',
    age: '',
    marital_status: '',
    dependents: '',
    financing_amount: '',
    repayment_years: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const request = new FinancingRequest(form);
      await request.save();
      alert("تم إرسال طلب التمويل بنجاح");
      setForm({
        monthly_income: '',
        job_title: '',
        employer: '',
        age: '',
        marital_status: '',
        dependents: '',
        financing_amount: '',
        repayment_years: '',
      });
    } catch (err) {
      alert("حدث خطأ أثناء الإرسال");
      console.error(err);
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', p: 4, pt: 13, pb: 12 }} dir="rtl">
      <Typography
        variant="h5"
        textAlign="center"
        fontWeight="bold"
        mb={4}
      >
        طلب تمويل عقاري
      </Typography>

      <Box component="form" display="flex" flexDirection="column" gap={3}>
        {[
          { name: 'monthly_income', label: 'الدخل الشهري', type: 'number' },
          { name: 'job_title', label: 'المسمى الوظيفي' },
          { name: 'employer', label: 'جهة العمل' },
          { name: 'age', label: 'السن', type: 'number' },
          { name: 'dependents', label: 'عدد المعالين', type: 'number' },
          { name: 'financing_amount', label: 'قيمة التمويل المطلوبة', type: 'number' },
          { name: 'repayment_years', label: 'مدة السداد (سنوات)', type: 'number' },
        ].map((field) => (
          <Box key={field.name}>
            <Typography fontWeight="bold" mb={1}>
              {field.label}
            </Typography>
            <TextField
              fullWidth
              name={field.name}
              type={field.type || 'text'}
              value={form[field.name]}
              onChange={handleChange}
              required
              inputProps={{ dir: 'rtl' }}
            />
          </Box>
        ))}


        <Box>
          <Typography fontWeight="bold" mb={1}>
            الحالة الاجتماعية
          </Typography>
          <TextField
            fullWidth
            select
            name="marital_status"
            value={form.marital_status}
            onChange={handleChange}
            required
          >
            <MenuItem value="single">أعزب</MenuItem>
            <MenuItem value="married">متزوج</MenuItem>
          </TextField>
        </Box>

        <Box textAlign="center" mt={2}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            sx={{ px: 5, py: 1.5, fontWeight: 'bold', borderRadius: 3 }}
          >
            إرسال الطلب
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
