import {
  Box, TextField, Button, Typography, MenuItem
} from '@mui/material';
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import FinancingRequest from '../FireBase/modelsWithOperations/FinancingRequest';

export default function FinancingRequestForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const advertisementId = location.state?.advertisementId;
  const [monthlyInstallment, setMonthlyInstallment] = useState('');

  const [form, setForm] = useState({
    user_id: 'user-id',
    advertisement_id: advertisementId || '',
    monthly_income: '',
    job_title: '',
    employer: '',
    age: '',
    marital_status: '',
    dependents: '',
    financing_amount: '',
    repayment_years: '',
  });

  const updateInstallment = (updatedForm) => {
    const tempRequest = new FinancingRequest(updatedForm);
    const result = tempRequest.calculateMonthlyInstallment();
    setMonthlyInstallment(result);
  };

  const handleChange = (e) => {
    const updatedForm = { ...form, [e.target.name]: e.target.value };
    setForm(updatedForm);

    if (
      e.target.name === 'financing_amount' ||
      e.target.name === 'repayment_years'
    ) {
      updateInstallment(updatedForm);
    }
  };

  const handleSubmit = async () => {
    try {
      const request = new FinancingRequest(form);
      await request.save();

      alert("تم إرسال طلب التمويل بنجاح");

      const savedRequests = JSON.parse(localStorage.getItem('financingRequests')) || [];
      savedRequests.push(form);
      localStorage.setItem('financingRequests', JSON.stringify(savedRequests));

      setForm({
        user_id: 'user-id',
        advertisement_id: advertisementId || '',
        monthly_income: '',
        job_title: '',
        employer: '',
        age: '',
        marital_status: '',
        dependents: '',
        financing_amount: '',
        repayment_years: '',
      });

      navigate('/profile');
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
          { name: 'monthly_income', label: 'الدخل الشهري (ج.م)', type: 'number' },
          { name: 'job_title', label: 'المسمى الوظيفي' },
          { name: 'employer', label: 'جهة العمل' },
          { name: 'age', label: 'السن', type: 'number' },
          { name: 'dependents', label: 'عدد المعالين', type: 'number' },
          { name: 'financing_amount', label: 'قيمة التمويل المطلوبة (ج.م)', type: 'number' },
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

        {monthlyInstallment && (
          <Box>
            <Typography fontWeight="bold" mb={1}>
              القسط الشهري المتوقع (ج.م)
            </Typography>
            <TextField
              fullWidth
              value={`${monthlyInstallment} ج.م`}
              disabled
              inputProps={{ dir: 'rtl' }}
            />
          </Box>
        )}

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
