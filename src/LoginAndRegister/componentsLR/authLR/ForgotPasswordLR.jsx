import React, { useState } from "react";
import {
  TextField,
  Button,
  CircularProgress,
  Alert,
  Box,
  Typography,
} from "@mui/material";
import { Email } from "@mui/icons-material";
import sendResetPasswordEmail from "../../../FireBase/authService/sendResetPasswordEmail";

export default function ForgotPasswordLR({ onSuccess, onBackToLogin }) {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccessMessage("");

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("الرجاء إدخال بريد إلكتروني صحيح");
      setIsLoading(false);
      return;
    }

    try {
      const result = await sendResetPasswordEmail(email);
      if (result.success) {
        setSuccessMessage(result.message);
        if (onSuccess) onSuccess();
      } else {
        setError(
          result.error.includes("user-not-found")
            ? "لا يوجد حساب مرتبط بهذا البريد الإلكتروني"
            : "حدث خطأ أثناء إرسال رابط الاستعادة"
        );
      }
    } catch (err) {
      setError("حدث خطأ غير متوقع أثناء محاولة استعادة كلمة السر");
      console.error("Error in password reset:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      
    >
      <Typography variant="h6" gutterBottom sx={{ color: "#6E00FE", mb: 2 }}>
        استعادة كلمة المرور
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {successMessage && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {successMessage}
        </Alert>
      )}

      <TextField
        fullWidth
        label="البريد الإلكتروني"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        margin="normal"
        required
        InputProps={{
          startAdornment: <Email color="primary" />,
          sx: { borderRadius: "12px" },
        }}
        sx={{
          "& .MuiOutlinedInput-root": {
            "& fieldset": { borderColor: "#6E00FE" },
          },
        }}
      />

      <Button
        type="submit"
        fullWidth
        variant="contained"
        disabled={isLoading}
        sx={{
          mt: 3,
          py: 1.5,
          borderRadius: "12px",
          backgroundColor: "#6E00FE",
          "&:hover": { backgroundColor: "#5A00D6" },
        }}
        startIcon={isLoading && <CircularProgress size={20} color="inherit" />}
      >
        {isLoading ? "جاري الإرسال..." : "إرسال رابط الاستعادة"}
      </Button>

      <Button
        fullWidth
        onClick={onBackToLogin}
        sx={{
          mt: 2,
          color: "#6E00FE",
          fontWeight: "bold",
        }}
      >
        العودة لتسجيل الدخول
      </Button>
    </Box>
  );
}
