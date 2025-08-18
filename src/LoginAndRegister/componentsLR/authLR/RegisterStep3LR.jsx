// src/LoginAndRegister/componentsLR/authLR/RegisterStep3LR.jsx

import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  MenuItem,
  Alert,
  CircularProgress,
  Card,
  IconButton,
} from "@mui/material";
import {
  Phone,
  Person,
  Business,
  LocationCity,
  Home,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { saveUserProfile } from "../../featuresLR/userSlice";
import CustomTextField from "../CustomTextField";
import { storage, auth } from "../../../FireBase/firebaseConfig";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const governorates = [
  "القاهرة",
  "الإسكندرية",
  "الجيزة",
  "الشرقية",
  "الدقهلية",
  "البحيرة",
  "المنيا",
  "أسيوط",
];

const organizationTypes = ["مطور عقاري", "ممول عقاري"];

export default function RegisterStep3LR({
  userType,
  registerData,
  onComplete,
  onBack,
}) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { uid } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    cli_name: "",
    org_name: "",
    phone: "",
    city: "",
    governorate: "",
    address: "",
    ...(userType === "client"
      ? {
          gender: "male",
          age: "",
        }
      : {
          type_of_organization: "",
        }),
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // حالات الصور للمنظمات
  const [taxCardImages, setTaxCardImages] = useState([]);
  const [taxCardPreviewUrls, setTaxCardPreviewUrls] = useState([]);
  const [uploadingImages, setUploadingImages] = useState(false);

  // تنظيف object URLs عند إلغاء تحميل المكون
  React.useEffect(() => {
    return () => {
      taxCardPreviewUrls.forEach((url) => {
        if (url.startsWith("blob:")) {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, [taxCardPreviewUrls]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validatePhone = (phone) => {
    const cleanedPhone = phone.replace(/\D/g, "");
    const regex = /^01[0125][0-9]{8}$/;
    return regex.test(cleanedPhone);
  };

  // دالة للتعامل مع تغيير صور البطاقة الضريبية
  const handleTaxCardImageChange = (e) => {
    const files = Array.from(e.target.files);
    const validTypes = ["image/jpeg", "image/png"];
    const maxSize = 5 * 1024 * 1024; // 5 ميجابايت
    const invalidFiles = files.filter(
      (file) => !validTypes.includes(file.type) || file.size > maxSize
    );

    if (invalidFiles.length > 0) {
      setError("يرجى رفع صور بصيغة JPEG أو PNG وبحجم أقل من 5 ميجابايت");
      return;
    }

    if (files.length + taxCardImages.length > 4) {
      setError("يمكنك تحميل 4 صور كحد أقصى للبطاقة الضريبية");
      return;
    }

    setTaxCardImages((prev) => [...prev, ...files]);
    setError(""); // مسح أي أخطاء سابقة

    const newPreviewUrls = files.map((file) => URL.createObjectURL(file));
    setTaxCardPreviewUrls((prev) => [...prev, ...newPreviewUrls]);
  };

  // دالة لإزالة صورة البطاقة الضريبية
  const removeTaxCardImage = (index) => {
    const newImages = [...taxCardImages];
    newImages.splice(index, 1);
    setTaxCardImages(newImages);

    const newPreviews = [...taxCardPreviewUrls];
    // تحقق من أن الصورة هي blob URL قبل حذفها
    if (newPreviews[index] && newPreviews[index].startsWith("blob:")) {
      URL.revokeObjectURL(newPreviews[index]);
    }
    newPreviews.splice(index, 1);
    setTaxCardPreviewUrls(newPreviews);
  };

  // دالة لرفع صور البطاقة الضريبية إلى Firebase Storage
  const uploadTaxCardImagesToFirebase = async (files, userId) => {
    // التحقق من وجود مستخدم مسجل الدخول
    const currentUser = auth.currentUser;
    if (!currentUser || !userId) {
      throw new Error("يجب تسجيل الدخول أولاً. يرجى تسجيل الدخول من جديد.");
    }

    console.log("Uploading tax card images for user:", currentUser.uid);

    const uploadPromises = files.map(async (file, index) => {
      const timestamp = Date.now();
      const fileName = `tax_card_${timestamp}_${index}.jpg`;
      // استخدام نفس مسار الصور العادية مع userId من المستخدم الحالي
      const storageRef = ref(
        storage,
        `property_images/${currentUser.uid}/${fileName}`
      );

      try {
        await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(storageRef);
        return downloadURL;
      } catch (error) {
        console.error("Error uploading tax card image:", error);
        if (error.code === "storage/unauthorized") {
          throw new Error("ليس لديك صلاحية لرفع الصور. تأكد من تسجيل الدخول.");
        } else {
          throw new Error(
            `فشل في رفع صورة البطاقة الضريبية ${index + 1}: ${error.message}`
          );
        }
      }
    });

    return Promise.all(uploadPromises);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const cleanedPhone = formData.phone.replace(/\D/g, "");
    if (!validatePhone(cleanedPhone)) {
      setError(
        "رقم الهاتف يجب أن يكون 11 رقمًا ويبدأ بـ 010 أو 011 أو 012 أو 015"
      );
      return;
    }

    setIsLoading(true);
    setUploadingImages(true);
    setError("");

    try {
      let taxCardImageUrls = [];

      // رفع صور البطاقة الضريبية للمنظمات فقط
      if (userType === "organization" && taxCardImages.length > 0) {
        try {
          console.log("Starting tax card images upload...");
          taxCardImageUrls = await uploadTaxCardImagesToFirebase(
            taxCardImages,
            uid
          );
          console.log(
            "Tax card images uploaded successfully:",
            taxCardImageUrls
          );
        } catch (uploadError) {
          console.error("Tax card upload error:", uploadError);
          setError(
            uploadError.message || "حدث خطأ أثناء رفع صور البطاقة الضريبية"
          );
          return;
        }
      }

      await dispatch(
        saveUserProfile({
          uid,
          userType,
          formData: {
            ...formData,
            phone: cleanedPhone,
            email: registerData.email,
            ...(userType === "client"
              ? { cli_name: formData.cli_name }
              : {
                  org_name: formData.org_name,
                  type_of_organization: formData.type_of_organization,
                  tax_card_images: taxCardImageUrls, // إضافة صور البطاقة الضريبية
                }),
          },
        })
      );
      onComplete(); // استدعاء onComplete أولاً
      // التوجيه بشكل مستقل
      setTimeout(() => {
        console.log("Navigating to /registration-success...");
        navigate("/registration-success", { replace: true });
      }, 1500);
    } catch (err) {
      setError(err.message || "حدث خطأ أثناء حفظ البيانات");
    } finally {
      setIsLoading(false);
      setUploadingImages(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Typography variant="h6" gutterBottom sx={{ color: "#6E00FE" }}>
        {userType === "client" ? "معلومات العميل" : "معلومات المنظمة"}
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <CustomTextField
        label={userType === "client" ? "الاسم بالكامل" : "اسم المنظمة"}
        name={userType === "client" ? "cli_name" : "org_name"}
        icon={
          userType === "client" ? (
            <Person color="primary" />
          ) : (
            <Business color="primary" />
          )
        }
        value={userType === "client" ? formData.cli_name : formData.org_name}
        onChange={handleChange}
        required
      />

      {userType === "client" ? (
        <>
          <CustomTextField
            select
            label="النوع"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            required
          >
            <MenuItem value="male">ذكر</MenuItem>
            <MenuItem value="female">أنثى</MenuItem>
          </CustomTextField>

          <CustomTextField
            label="العمر"
            name="age"
            type="number"
            value={formData.age}
            onChange={handleChange}
            required
            inputProps={{ min: 10, max: 100 }}
          />
        </>
      ) : (
        <>
          <CustomTextField
            select
            label="نوع المنظمة"
            name="type_of_organization"
            icon={<Business color="primary" />}
            value={formData.type_of_organization}
            onChange={handleChange}
            required
          >
            {organizationTypes.map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </CustomTextField>

          {/* قسم صور البطاقة الضريبية */}
          <Box sx={{ mt: 3, mb: 2 }} dir="rtl">
            <Typography
              variant="h6"
              sx={{ color: "#6E00FE", mb: 2, textAlign: "right" }}
            >
              صورة البطاقة الضريبية
            </Typography>
            <input
              accept="image/jpeg,image/png"
              type="file"
              multiple
              onChange={handleTaxCardImageChange}
              disabled={isLoading || uploadingImages}
              style={{
                marginBottom: "16px",
                width: "100%",
                padding: "8px",
                border: "1px solid #ddd",
                borderRadius: "4px",
              }}
            />

            {/* عرض الصور المحملة */}
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mt: 2 }} dir="rtl"
            > 
              {taxCardPreviewUrls.map((url, index) => (
                <Box key={index} sx={{ position: "relative" }}>
                  <img
                    src={url}
                    alt={`البطاقة الضريبية ${index + 1}`}
                    style={{
                      width: "100px",
                      height: "100px",
                      objectFit: "cover",
                      borderRadius: "8px",
                      border: "2px solid #6E00FE",
                    }}
                  />
                  <IconButton
                    sx={{
                      position: "absolute",
                      top: -8,
                      right: -8,
                      bgcolor: "white",
                      "&:hover": { bgcolor: "grey.200" },
                      boxShadow: 1,
                    }}
                    onClick={() => removeTaxCardImage(index)}
                    disabled={isLoading || uploadingImages}
                  >
                    <DeleteIcon color="error" fontSize="small" />
                  </IconButton>
                </Box>
              ))}

              {taxCardPreviewUrls.length === 0 && !uploadingImages && (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "100px",
                    height: "100px",
                    border: "2px dashed #ccc",
                    borderRadius: "8px",
                    color: "text.secondary",
                    backgroundColor: "#f5f5f5",
                  }}
                >
                  <Typography
                    variant="caption"
                    color="primary"
                    textAlign="center"
                  >
                    لا توجد صور
                  </Typography>
                </Box>
              )}

              {uploadingImages && (
                <Box
                  sx={{
                    width: "100px",
                    height: "100px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "2px dashed #ccc",
                    borderRadius: "8px",
                  }}
                >
                  <CircularProgress size={30} />
                </Box>
              )}
            </Box>
          </Box>
        </>
      )}
      <CustomTextField
        label="رقم الهاتف"
        name="phone"
        icon={<Phone color="primary" />}
        value={formData.phone}
        onChange={handleChange}
        required
        error={!!error && error.includes("الهاتف")}
        helperText={error.includes("الهاتف") ? error : ""}
      />
      <CustomTextField
        select
        label="المحافظة"
        name="governorate"
        icon={<LocationCity color="primary" />}
        value={formData.governorate}
        onChange={handleChange}
        required
      >
        {governorates.map((gov) => (
          <MenuItem key={gov} value={gov}>
            {gov}
          </MenuItem>
        ))}
      </CustomTextField>

      <CustomTextField
        label="المدينة/القرية"
        name="city"
        value={formData.city}
        onChange={handleChange}
        required
      />

      <CustomTextField
        label="العنوان بالتفصيل"
        name="address"
        icon={<Home color="primary" />}
        value={formData.address}
        onChange={handleChange}
        required
      />

      <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
        <Button
          fullWidth
          variant="outlined"
          onClick={onBack}
          disabled={isLoading}
          sx={{
            borderRadius: "12px",
            borderColor: "#6E00FE",
            color: "#6E00FE",
            "&:hover": { borderColor: "#5A00D6" },
          }}
        >
          رجوع
        </Button>
        <Button
          fullWidth
          variant="contained"
          type="submit"
          disabled={isLoading || uploadingImages}
          sx={{
            borderRadius: "12px",
            backgroundColor: "#6E00FE",
            "&:hover": { backgroundColor: "#5A00D6" },
            "&:disabled": { backgroundColor: "#cccccc" },
          }}
          startIcon={
            (isLoading || uploadingImages) && (
              <CircularProgress size={20} color="inherit" />
            )
          }
        >
          {uploadingImages
            ? "جاري رفع الصور..."
            : isLoading
            ? "جاري التسجيل..."
            : "إنهاء التسجيل"}
        </Button>
      </Box>
    </form>
  );
}
