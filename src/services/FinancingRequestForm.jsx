import {
  Box, TextField, Button, Typography, MenuItem
} from '@mui/material';
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import FinancingRequest from '../FireBase/modelsWithOperations/FinancingRequest';
import FinancingAdvertisement from '../FireBase/modelsWithOperations/FinancingAdvertisement';
import React from 'react';

export default function FinancingRequestForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const advertisementId = location.state?.advertisementId;
  const [monthlyInstallment, setMonthlyInstallment] = useState('');
  const [isDisabled, setIsDisabled] = useState(false);
  const [requestId, setRequestId] = useState(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [minAmount, setMinAmount] = useState(500000);
  const [maxAmount, setMaxAmount] = useState(1000000);

  // جلب حدود مبلغ التمويل من الإعلان المرتبط
  React.useEffect(() => {
    async function fetchLimits() {
      if (advertisementId) {
        const ad = await FinancingAdvertisement.getById(advertisementId);
        if (ad) {
          setMinAmount(ad.start_limit);
          setMaxAmount(ad.end_limit);
        }
      }
    }
    fetchLimits();
  }, [advertisementId]);

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
    phone_number: '', // أضف رقم الهاتف
  });

  const updateInstallment = async (updatedForm) => {
  const tempRequest = new FinancingRequest(updatedForm);
  try {
    const result = await tempRequest.calculateMonthlyInstallment();
    setMonthlyInstallment(result);
  } catch (err) {
    console.error('خطأ في حساب القسط الشهري:', err);
    setMonthlyInstallment('');
  }
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
    // تحقق من مبلغ التمويل قبل الإرسال بناءً على حدود الإعلان
    if (Number(form.financing_amount) < minAmount || Number(form.financing_amount) > maxAmount) {
      alert(`مبلغ التمويل يجب أن يكون بين ${minAmount} و ${maxAmount} جنيه مصري.`);
      return;
    }
    try {
      if (!requestId) {
        const request = new FinancingRequest(form);
        const id = await request.save();
        setRequestId(id);
        setIsDisabled(true);
        // لا تظهر رسالة النجاح هنا، فقط بعد الإرسال النهائي
      } else {
        // تعديل طلب موجود
        const request = new FinancingRequest({ ...form, id: requestId });
        await request.update({ ...form });
        setIsDisabled(true);
        // لا تظهر رسالة النجاح هنا، فقط بعد الإرسال النهائي
      }
    } catch (err) {
      alert("حدث خطأ أثناء الإرسال");
      console.error(err);
    }
  };

  // زر الإرسال النهائي (يظهر رسالة النجاح ويعيد التوجيه)
  const handleFinalSubmit = async () => {
    try {
      if (!requestId) {
        const request = new FinancingRequest(form);
        const id = await request.save();
        setRequestId(id);
      } else {
        const request = new FinancingRequest({ ...form, id: requestId });
        await request.update({ ...form });
      }
      setShowSuccessMessage(true);
      setTimeout(() => {
        navigate('/profile');
      }, 1500);
    } catch (err) {
      alert("حدث خطأ أثناء الإرسال");
      console.error(err);
    }
  };

  const handleEdit = () => {
    setIsDisabled(false);
  };

  const handleCancel = () => {
    setIsDisabled(true);
    setShowSuccessMessage(false);
    setTimeout(() => {
      navigate('/details/financingAds');
    }, 1500);

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
          { name: 'phone_number', label: 'رقم الهاتف', type: 'text' },
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
              disabled={isDisabled}
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
            disabled={isDisabled}
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

        <Box textAlign="center" mt={2} display="flex" gap={2} justifyContent="center">
          {isDisabled ? (
            <>
              <Button
                variant="contained"
                color="primary"
                onClick={handleFinalSubmit}
                sx={{ px: 4, py: 1.5, fontWeight: 'bold', borderRadius: 3 }}
              >
                إرسال الطلب
              </Button>
              <Button
                variant="outlined"
                color="primary"
                onClick={handleCancel}
                sx={{ px: 4, py: 1.5, fontWeight: 'bold', borderRadius: 3 }}
              >
                إلغاء الطلب
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleEdit}
                sx={{ px: 4, py: 1.5, fontWeight: 'bold', borderRadius: 3 }}
              >
                تعديل
              </Button>
            </>
          ) : (
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              sx={{ px: 4, py: 1.5, fontWeight: 'bold', borderRadius: 3 }}
            >
              إرسال الطلب
            </Button>
          )}
        </Box>
        {showSuccessMessage && (
          <Typography color="success.main" textAlign="center" mt={2} fontWeight="bold">
            تم إرسال أو تعديل الطلب بنجاح!
          </Typography>
        )}
      </Box>
    </Box>
  );
}
