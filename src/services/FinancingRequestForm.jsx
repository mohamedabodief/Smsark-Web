import { Box, TextField, Button, Typography, MenuItem } from "@mui/material";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import FinancingRequest from "../FireBase/modelsWithOperations/FinancingRequest";
import FinancingAdvertisement from "../FireBase/modelsWithOperations/FinancingAdvertisement";
import { auth } from "../FireBase/firebaseConfig";
import React from "react";

export default function FinancingRequestForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const advertisementId = location.state?.advertisementId;
  const editRequestId = location.state?.editRequestId;
  const editRequestData = location.state?.editRequestData;
  const advertisementData = location.state?.advertisementData;
  const isEditing = !!editRequestId;

  const [monthlyInstallment, setMonthlyInstallment] = useState("");
  const [isDisabled, setIsDisabled] = useState(false);
  const [requestId, setRequestId] = useState(editRequestId || null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [minAmount, setMinAmount] = useState(
    advertisementData?.start_limit || 500000
  );
  const [maxAmount, setMaxAmount] = useState(
    advertisementData?.end_limit || 1000000
  );
  const [errors, setErrors] = useState({});

  // Get current user ID
  const currentUser = auth.currentUser;
  const userId = currentUser?.uid;

  // Scroll to top when component mounts
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Check authentication on component mount
  React.useEffect(() => {
    if (!currentUser) {
      alert("يجب تسجيل الدخول أولاً لتقديم طلب التمويل");
      navigate("/login");
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
    user_id: userId || "",
    advertisement_id: advertisementId || "",
    monthly_income: editRequestData?.monthly_income || "",
    job_title: editRequestData?.job_title || "",
    employer: editRequestData?.employer || "",
    age: editRequestData?.age || "",
    marital_status: editRequestData?.marital_status || "",
    dependents: editRequestData?.dependents || "",
    financing_amount: editRequestData?.financing_amount || "",
    repayment_years: editRequestData?.repayment_years || "",
    phone_number: editRequestData?.phone_number || "",
  });

  // Update user_id when userId changes
  React.useEffect(() => {
    if (userId) {
      setForm((prev) => ({ ...prev, user_id: userId }));
    }
  }, [userId]);

  const updateInstallment = async (updatedForm) => {
    const tempRequest = new FinancingRequest(updatedForm);
    try {
      const result = await tempRequest.calculateMonthlyInstallment();
      setMonthlyInstallment(result);
    } catch (err) {
      console.error("خطأ في حساب القسط الشهري:", err);
      setMonthlyInstallment("");
    }
  };

  const validateField = (name, value) => {
    let error = "";

    switch (name) {
      case "monthly_income":
        if (value <= 0) error = "يجب أن يكون الدخل الشهري أكبر من الصفر";
        break;
      case "job_title":
        if (/[0-9]/.test(value))
          error = "المسمى الوظيفي لا يجب أن يحتوي على أرقام";
        break;
      case "employer":
        if (/[0-9]/.test(value)) error = "جهة العمل لا يجب أن تحتوي على أرقام";
        break;
      case "phone_number":
        if (!/^[0-9]+$/.test(value))
          error = "يجب أن يحتوي رقم الهاتف على أرقام فقط";
        else if (value.length < 11)
          error = "يجب أن يحتوي رقم الهاتف على 11 رقم على الأقل";
        break;
      case "age":
        if (value < 18) error = "يجب أن يكون السن 18 سنة أو أكثر";
        break;
      case "dependents":
        if (value < 0) error = "يجب أن يكون عدد المعالين صفر أو أكثر";
        break;
      case "financing_amount":
        if (value <= 0) error = "يجب أن يكون مبلغ التمويل أكبر من الصفر";
        break;
      case "repayment_years":
        if (value <= 0) error = "يجب أن تكون مدة السداد أكبر من الصفر";
        break;
      default:
        break;
    }

    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Validate the field
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));

    const updatedForm = { ...form, [name]: value };
    setForm(updatedForm);

    if (name === "financing_amount" || name === "repayment_years") {
      updateInstallment(updatedForm);
    }
  };

  // المرحلة الأولى: مجرد قفل النموزج للمراجعة (من غير حفظ)
  const handleSubmit = () => {
    if (!userId) {
      alert("يجب تسجيل الدخول أولاً لتقديم طلب التمويل");
      navigate("/login");
      return;
    }

    // Validate all fields before submission
    const newErrors = {};
    Object.keys(form).forEach((key) => {
      if (
        key !== "user_id" &&
        key !== "advertisement_id" &&
        key !== "marital_status"
      ) {
        const error = validateField(key, form[key]);
        if (error) newErrors[key] = error;
      }
    });

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    if (
      Number(form.financing_amount) < minAmount ||
      Number(form.financing_amount) > maxAmount
    ) {
      alert(
        `مبلغ التمويل يجب أن يكون بين ${minAmount} و ${maxAmount} جنيه مصري.`
      );
      return;
    }

    setIsDisabled(true);
  };

  // زر الإرسال النهائي (هنا بيتم الحفظ في فايربيز)
  const handleFinalSubmit = async () => {
    if (!userId) {
      alert("يجب تسجيل الدخول أولاً لتقديم طلب التمويل");
      navigate("/login");
      return;
    }

    try {
      if (!requestId) {
        const request = new FinancingRequest(form);
        const id = await request.save();
        setRequestId(id);
      } else {
        const updates = {
          ...form,
          reviewStatus: "pending",
          review_note: null,
          submitted_at: new Date(),
        };
        const request = new FinancingRequest({ ...form, id: requestId });
        await request.update(updates);

        if (advertisementData?.userId) {
          const Notification = (
            await import("../FireBase/MessageAndNotification/Notification")
          ).default;
          const notif = new Notification({
            receiver_id: advertisementData.userId,
            title: "طلب تمويل معدل بانتظار المراجعة",
            body: `تم تعديل طلب التمويل على إعلانك: ${advertisementData.title}`,
            type: "system",
            link: `/admin/financing-requests/${requestId}`,
          });
          await notif.send();
        }
      }
      setShowSuccessMessage(true);
      setTimeout(() => {
        navigate("/home");
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
      navigate("/home");
    }, 1500);
  };

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", p: 4, pt: 2, pb: 12 }} dir="rtl">
      <Typography variant="h5" textAlign="center" fontWeight="bold" mb={4}>
        {isEditing ? "تعديل طلب التمويل" : "طلب تمويل عقاري"}
      </Typography>

      <Box component="form" display="flex" flexDirection="column" gap={3}>
        {[
          {
            name: "monthly_income",
            label: "الدخل الشهري (ج.م)",
            type: "number",
          },
          { name: "job_title", label: "المسمى الوظيفي" },
          { name: "employer", label: "جهة العمل" },
          { name: "phone_number", label: "رقم الهاتف", type: "text" },
          { name: "age", label: "السن", type: "number" },
          { name: "dependents", label: "عدد المعالين", type: "number" },
          {
            name: "financing_amount",
            label: "قيمة التمويل المطلوبة (ج.م)",
            type: "number",
          },
          {
            name: "repayment_years",
            label: "مدة السداد (سنوات)",
            type: "number",
          },
        ].map((field) => (
          <Box key={field.name}>
            <Typography fontWeight="bold" mb={1}>
              {field.label}
            </Typography>
            <TextField
              fullWidth
              name={field.name}
              type={field.type || "text"}
              value={form[field.name]}
              onChange={handleChange}
              required
              inputProps={{ dir: "rtl" }}
              disabled={isDisabled}
              error={!!errors[field.name]}
              helperText={errors[field.name]}
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
              inputProps={{ dir: "rtl" }}
            />
          </Box>
        )}

        <Box
          textAlign="center"
          mt={2}
          display="flex"
          gap={2}
          justifyContent="center"
        >
          {isDisabled ? (
            <>
              <Button
                variant="contained"
                color="primary"
                onClick={handleFinalSubmit}
                sx={{ px: 4, py: 1.5, fontWeight: "bold", borderRadius: 3 }}
              >
                {isEditing ? "إرسال الطلب المعدل" : "إرسال الطلب"}
              </Button>
              <Button
                variant="outlined"
                color="primary"
                onClick={handleCancel}
                sx={{ px: 4, py: 1.5, fontWeight: "bold", borderRadius: 3 }}
              >
                إلغاء الطلب
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleEdit}
                sx={{ px: 4, py: 1.5, fontWeight: "bold", borderRadius: 3 }}
              >
                تعديل
              </Button>
            </>
          ) : (
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              sx={{ px: 4, py: 1.5, fontWeight: "bold", borderRadius: 3 }}
            >
              إرسال الطلب
            </Button>
          )}
        </Box>
        {showSuccessMessage && (
          <Typography
            color="success.main"
            textAlign="center"
            mt={2}
            fontWeight="bold"
          >
            {isEditing
              ? "تم إرسال الطلب المعدل بنجاح!"
              : "تم إرسال الطلب بنجاح!"}
          </Typography>
        )}
      </Box>
    </Box>
  );
}
