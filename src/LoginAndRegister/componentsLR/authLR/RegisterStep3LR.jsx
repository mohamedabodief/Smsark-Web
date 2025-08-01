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
} from "@mui/material";
import {
  Phone,
  Person,
  Business,
  LocationCity,
  Home,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { saveUserProfile } from "../../featuresLR/userSlice";
import CustomTextField from "../CustomTextField";

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validatePhone = (phone) => {
    const cleanedPhone = phone.replace(/\D/g, "");
    const regex = /^01[0125][0-9]{8}$/;
    return regex.test(cleanedPhone);
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
    setError("");

    try {
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
      )}

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
          disabled={isLoading}
          sx={{
            borderRadius: "12px",
            backgroundColor: "#6E00FE",
            "&:hover": { backgroundColor: "#5A00D6" },
            "&:disabled": { backgroundColor: "#cccccc" },
          }}
          startIcon={
            isLoading && <CircularProgress size={20} color="inherit" />
          }
        >
          {isLoading ? "جاري التسجيل..." : "إنهاء التسجيل"}
        </Button>
      </Box>
    </form>
  );
}
