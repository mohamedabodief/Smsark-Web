import React, { useState, useEffect } from "react";
import { TextField, Button, CircularProgress, Alert, Box } from "@mui/material";
import { Email, Lock } from "@mui/icons-material";
import { useDispatch } from "react-redux";
import { loginUser } from "../../featuresLR/authSlice";

export default function LoginFormLR({
  onLoginSuccess,
  onSwitchToRegister,
  onForgotPassword,
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const dispatch = useDispatch();

  useEffect(() => {
    setEmail("");
    setPassword("");
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const result = await dispatch(loginUser({ email, password }));

    if (result.meta.requestStatus === "fulfilled") {
      onLoginSuccess();
    } else {
      setError(
        result.payload.includes("auth/invalid-credential")
          ? "البريد الإلكتروني أو كلمة المرور غير صحيحة"
          : "حدث خطأ أثناء تسجيل الدخول"
      );
    }

    setIsLoading(false);
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
   
    >
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

      <TextField
        fullWidth
        label="كلمة المرور"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        margin="normal"
        required
        InputProps={{
          startAdornment: <Lock color="primary" />,
          sx: { borderRadius: "12px" },
        }}
      />

      {error && (
        <Alert severity="error" sx={{ my: 2 }}>
          {error}
        </Alert>
      )}

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
        {isLoading ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
      </Button>

      <Button
        fullWidth
        onClick={onForgotPassword}
        sx={{
          mt: 1,
          color: "#6E00FE",
          textDecoration: "underline",
        }}
      >
        نسيت كلمة المرور؟
      </Button>

      <Button
        fullWidth
        onClick={onSwitchToRegister}
        sx={{
          mt: 1,
          color: "#6E00FE",
          fontWeight: "bold",
        }}
      >
        إنشاء حساب جديد
      </Button>
    </Box>
  );
}
