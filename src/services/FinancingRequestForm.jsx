import {
  Box, TextField, Button, Typography, MenuItem
} from '@mui/material';
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import FinancingRequest from '../FireBase/modelsWithOperations/FinancingRequest';
import FinancingAdvertisement from '../FireBase/modelsWithOperations/FinancingAdvertisement';
import { auth } from '../FireBase/firebaseConfig';
import React from 'react';

export default function FinancingRequestForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const advertisementId = location.state?.advertisementId;
  const editRequestId = location.state?.editRequestId;
  const editRequestData = location.state?.editRequestData;
  const advertisementData = location.state?.advertisementData;
  const isEditing = !!editRequestId;

  const [monthlyInstallment, setMonthlyInstallment] = useState('');
  const [isDisabled, setIsDisabled] = useState(false);
  const [requestId, setRequestId] = useState(editRequestId || null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [minAmount, setMinAmount] = useState(advertisementData?.start_limit || 500000);
  const [maxAmount, setMaxAmount] = useState(advertisementData?.end_limit || 1000000);

  // Get current user ID
  const currentUser = auth.currentUser;
  const userId = currentUser?.uid;

  // Check authentication on component mount
  React.useEffect(() => {
    if (!currentUser) {
      alert("يجب تسجيل الدخول أولاً لتقديم طلب التمويل");
      navigate('/login');
    }
  }, [currentUser, navigate]);

  // جلب حدود مبلغ التمويل من الإعلان المرتبط
  React.useEffect(() => {
    async function fetchLimits() {
      if (advertisementData) {
        setMinAmount(advertisementData.start_limit);
        setMaxAmount(advertisementData.end_limit);
      } else if (advertisementId) {
        const ad = await FinancingAdvertisement.getById(advertisementId);
        if (ad) {
          setMinAmount(ad.start_limit);
          setMaxAmount(ad.end_limit);
        }
      }
    }
    fetchLimits();
  }, [advertisementId, advertisementData]);

  // Calculate monthly installment when editing
  React.useEffect(() => {
    if (isEditing && form.financing_amount && form.repayment_years) {
      updateInstallment(form);
    }
  }, [isEditing]);

  const [form, setForm] = useState({
    user_id: userId || '',
    advertisement_id: advertisementId || '',
    monthly_income: editRequestData?.monthly_income || '',
    job_title: editRequestData?.job_title || '',
    employer: editRequestData?.employer || '',
    age: editRequestData?.age || '',
    marital_status: editRequestData?.marital_status || '',
    dependents: editRequestData?.dependents || '',
    financing_amount: editRequestData?.financing_amount || '',
    repayment_years: editRequestData?.repayment_years || '',
    phone_number: editRequestData?.phone_number || '',
  });

  // Update user_id when userId changes
  React.useEffect(() => {
    if (userId) {
      setForm(prev => ({ ...prev, user_id: userId }));
    }
  }, [userId]);

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
    // Check if user is authenticated
    if (!userId) {
      alert("يجب تسجيل الدخول أولاً لتقديم طلب التمويل");
      navigate('/login');
      return;
    }

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
    // Check if user is authenticated
    if (!userId) {
      alert("يجب تسجيل الدخول أولاً لتقديم طلب التمويل");
      navigate('/login');
      return;
    }

    try {
      if (!requestId) {
        const request = new FinancingRequest(form);
        const id = await request.save();
        setRequestId(id);
      } else {
        // If editing, update the request and set status to pending
        const updates = {
          ...form,
          reviewStatus: 'pending',
          review_note: null, // Clear any previous rejection notes
          submitted_at: new Date() // Update submission time
        };
        const request = new FinancingRequest({ ...form, id: requestId });
        await request.update(updates);

        // Send notification to the organization
        if (advertisementData?.userId) {
          const Notification = (await import('../FireBase/MessageAndNotification/Notification')).default;
          const notif = new Notification({
            receiver_id: advertisementData.userId,
            title: 'طلب تمويل معدل بانتظار المراجعة',
            body: `تم تعديل طلب التمويل على إعلانك: ${advertisementData.title}`,
            type: 'system',
            link: `/admin/financing-requests/${requestId}`,
          });
          await notif.send();
        }
      }
      setShowSuccessMessage(true);
      setTimeout(() => {
        navigate('/home');
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
        {isEditing ? 'تعديل طلب التمويل' : 'طلب تمويل عقاري'}
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
                {isEditing ? 'إرسال الطلب المعدل' : 'إرسال الطلب'}
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
            {isEditing ? 'تم إرسال الطلب المعدل بنجاح!' : 'تم إرسال الطلب بنجاح!'}
          </Typography>
        )}
      </Box>
    </Box>
  );
}
