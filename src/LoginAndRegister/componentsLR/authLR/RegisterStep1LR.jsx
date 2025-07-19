// src/LoginAndRegister/componentsLR/authLR/RegisterStep1LR.jsx
import React, { useState } from "react";
import { TextField, Button, Alert, Box, CircularProgress } from "@mui/material";
import { Email, Lock } from "@mui/icons-material";
import { useDispatch } from "react-redux";
import { registerUser } from "../../featuresLR/authSlice";

export default function RegisterStep1LR({ onSuccess, onSwitchToLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const dispatch = useDispatch();

  const validateForm = () => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("البريد الإلكتروني غير صالح");
      return false;
    }
    if (password.length < 6) {
      setError("كلمة المرور يجب أن تكون 6 أحرف على الأقل");
      return false;
    }
    if (password !== confirmPassword) {
      setError("كلمات المرور غير متطابقة");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) return;

    setIsLoading(true);
    const result = await dispatch(registerUser({ email, password }));

    if (result.meta.requestStatus === "fulfilled") {
      onSuccess({ email, password });
    } else {
      setError(
        result.payload.includes("auth/email-already-in-use")
          ? "البريد الإلكتروني مستخدم بالفعل"
          : result.payload.includes("auth/weak-password")
          ? "كلمة المرور ضعيفة جدًا"
          : result.payload.includes("auth/invalid-email")
          ? "البريد الإلكتروني غير صالح"
          : "حدث خطأ أثناء التسجيل"
      );
    }

    setIsLoading(false);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
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

      <TextField
        fullWidth
        label="تأكيد كلمة المرور"
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        margin="normal"
        required
        InputProps={{
          startAdornment: <Lock color="primary" />,
          sx: { borderRadius: "12px" },
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
        {isLoading ? "جاري التحقق..." : "التالي"}
      </Button>

      <Box sx={{ textAlign: "center", mt: 2 }}>
        <Button onClick={onSwitchToLogin} sx={{ color: "#6E00FE" }}>
          لديك حساب بالفعل؟ تسجيل الدخول
        </Button>
      </Box>
    </Box>
  );
}
//=========================================================


// import React, { useState } from 'react';
// import { Button, Alert, Card, CircularProgress } from '@mui/material';
// import { Email, Lock } from '@mui/icons-material';
// import { useDispatch } from 'react-redux';
// import { registerUser } from '../../featuresLR/authSlice';
// import CustomTextField from '../CustomTextField'; // تعديل المسار

// export default function RegisterStep1LR({ onSuccess, onSwitchToLogin }) {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState('');
//   const dispatch = useDispatch();

//   const validateForm = () => {
//     if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
//       setError('البريد الإلكتروني غير صالح');
//       return false;
//     }
//     if (password.length < 6) {
//       setError('كلمة المرور يجب أن تكون 6 أحرف على الأقل');
//       return false;
//     }
//     if (password !== confirmPassword) {
//       setError('كلمات المرور غير متطابقة');
//       return false;
//     }
//     return true;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');

//     if (!validateForm()) return;

//     setIsLoading(true);
//     const result = await dispatch(registerUser({ email, password }));

//     if (result.meta.requestStatus === 'fulfilled') {
//       onSuccess({ email, password });
//     } else {
//       setError(
//         result.error?.code === 'auth/email-already-in-use'
//           ? 'البريد الإلكتروني مسجل بالفعل'
//           : result.error?.code === 'auth/weak-password'
//           ? 'كلمة المرور ضعيفة جدًا'
//           : result.error?.code === 'auth/invalid-email'
//           ? 'البريد الإلكتروني غير صالح'
//           : 'حدث خطأ أثناء التسجيل'
//       );
//     }

//     setIsLoading(false);
//   };

//   return (
//     <Card sx={{ bgcolor: 'background.paper', mt: 2 }}>
//       <form onSubmit={handleSubmit}>
//         {error && (
//           <Alert severity="error" sx={{ mb: 2 }}>
//             {error}
//           </Alert>
//         )}

//         <CustomTextField
//           label="البريد الإلكتروني"
//           type="email"
//           icon={<Email color="primary" />}
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           required
//         />

//         <CustomTextField
//           label="كلمة المرور"
//           type="password"
//           icon={<Lock color="primary" />}
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           required
//         />

//         <CustomTextField
//           label="تأكيد كلمة المرور"
//           type="password"
//           icon={<Lock color="primary" />}
//           value={confirmPassword}
//           onChange={(e) => setConfirmPassword(e.target.value)}
//           required
//         />

//         <Button
//           type="submit"
//           fullWidth
//           variant="contained"
//           disabled={isLoading}
//           sx={{
//             mt: 3,
//             py: 1.5,
//             borderRadius: '12px',
//             backgroundColor: '#6E00FE',
//             '&:hover': { backgroundColor: '#5A00D6' },
//           }}
//           startIcon={isLoading && <CircularProgress size={20} color="inherit" />}
//         >
//           {isLoading ? 'جاري التحقق...' : 'التالي'}
//         </Button>

//         <Button
//           fullWidth
//           onClick={onSwitchToLogin}
//           sx={{ mt: 2, color: '#6E00FE' }}
//         >
//           لديك حساب بالفعل؟ تسجيل الدخول
//         </Button>
//       </form>
//     </Card>
//   );
// }