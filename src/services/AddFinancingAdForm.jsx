import {
  Box, TextField, Button, Typography
} from '@mui/material';
import { useState } from 'react';
import FinancingAdvertisement from '../FireBase/modelsWithOperations/FinancingAdvertisement';

export default function AddFinancingAdForm() {
  const [form, setForm] = useState({
    title: '',
    description: '',
    financing_model: '',
    image: '',
    phone: '',
    start_limit: '',
    end_limit: '',
    org_name: '',
    userId: 'admin',
    type_of_user: 'individual',
    ads: true,
    adExpiryTime: Date.now() + 30 * 24 * 60 * 60 * 1000,
    interest_rate_upto_5: '',
    interest_rate_upto_10: '',
    interest_rate_above_10: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const isFormValid = () => {
    const requiredFields = [
      'title', 'description', 'financing_model', 'image', 'phone', 'org_name',
      'start_limit', 'end_limit',
      'interest_rate_upto_5', 'interest_rate_upto_10', 'interest_rate_above_10'
    ];

    for (let key of requiredFields) {
      if (!form[key] || form[key].toString().trim() === '') {
        alert(` من فضلك أدخل ${key}`);
        return false;
      }
    }

    // تحقق منطقي للفائدة
    const above10 = Number(form.interest_rate_above_10);
    if (isNaN(above10) || above10 <= 0) {
      alert("الفائدة لأكثر من 10 سنوات يجب أن تكون رقمًا أكبر من صفر");
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!isFormValid()) return;

    try {
      const ad = new FinancingAdvertisement({
        ...form,
        start_limit: Number(form.start_limit),
        end_limit: Number(form.end_limit),
        interest_rate_upto_5: Number(form.interest_rate_upto_5),
        interest_rate_upto_10: Number(form.interest_rate_upto_10),
        interest_rate_above_10: Number(form.interest_rate_above_10),
      });

      await ad.save();
      alert(" تم حفظ إعلان التمويل بنجاح");
    } catch (err) {
      console.error(err);
      alert(" حدث خطأ أثناء حفظ الإعلان");
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', p: 4, pt: 16 }} dir="rtl">
      <Typography
        variant="h5"
        fontWeight="bold"
        textAlign="center"
        mb={5}
        sx={{ fontSize: '1.8rem' }}
      >
        إعلان جديد عن تمويل عقاري
      </Typography>

      <Box component="form" display="flex" flexDirection="column" gap={3}>
        {[
          { name: 'title', label: 'العنوان' },
          { name: 'description', label: 'الوصف' },
          { name: 'financing_model', label: 'نموذج التمويل' },
          { name: 'image', label: 'رابط الصورة' },
          { name: 'phone', label: 'رقم الهاتف' },
          { name: 'org_name', label: 'اسم الجهة' },
          { name: 'start_limit', label: 'الحد الأدنى', type: 'number' },
          { name: 'end_limit', label: 'الحد الأقصى', type: 'number' },
          { name: 'interest_rate_upto_5', label: 'فائدة حتى 5 سنوات', type: 'number' },
          { name: 'interest_rate_upto_10', label: 'فائدة حتى 10 سنوات', type: 'number' },
          { name: 'interest_rate_above_10', label: 'فائدة أكثر من 10 سنوات', type: 'number' },
        ].map((field) => (
          <Box key={field.name}>
            <Typography fontWeight="bold" mb={1}>
              {field.label}
            </Typography>
            <TextField
              fullWidth
              required
              name={field.name}
              type={field.type || 'text'}
              value={form[field.name]}
              onChange={handleChange}
              inputProps={{ dir: 'rtl' }}
            />
          </Box>
        ))}

        <Box textAlign="center" mt={2}>
          <Button
            variant="contained"
            size="large"
            sx={{ px: 5, py: 1.5, fontWeight: 'bold', borderRadius: 3 }}
            onClick={handleSubmit}
          >
            حفظ الإعلان
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
