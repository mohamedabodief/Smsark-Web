//src/LoginAndRegister/modulesLR/LoginRegister.jsx
import React, { useState } from "react";
import { Box, Typography, Paper, Alert } from "@mui/material";
import { styled } from "@mui/material/styles";
import LoginFormLR from "../componentsLR/authLR/LoginFormLR";
import RegisterStep1LR from "../componentsLR/authLR/RegisterStep1LR";
import RegisterStep2LR from "../componentsLR/authLR/RegisterStep2LR";
import RegisterStep3LR from "../componentsLR/authLR/RegisterStep3LR";
import background from "../../assets/background.jpg";

import { useNavigate } from 'react-router-dom';

// import { red } from "@mui/material/colors";

const StyledContainer = styled(Box)({
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  backgroundImage: `url(${background})`,
  backgroundColor: "#000000ff", // Fallback color
  backgroundSize: "cover",
  backgroundPosition: "center",

  padding: "0 px",
  // margin: "0",
});


const StyledPaper = styled(Paper)(({ theme }) => ({
  // background: "rgba(255, 255, 255, 0.95)",
  borderRadius: "16px",
  padding: theme.spacing(2),
  width: "100%",
  maxWidth: "500px", // زيادة maxWidth لتتناسب مع التصميم الجديد
  margin: "auto", // لتوسيط الكارد

  // boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",

  backgroundColor: "transparent",
  boxShadow: "none",

  
  // height: "70%"// عشان يأخذ الحجم الطبيعي
}));


export default function LoginRegister() {
  const [isLogin, setIsLogin] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);
  const [userType, setUserType] = useState(null);
  const [registerData, setRegisterData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState({ text: "", type: "" });
  const navigate = useNavigate();
  const handleLoginSuccess = () => {
    setMessage({
      text: "تم تسجيل الدخول بنجاح! يتم تحويلك...",
      type: "success",
    });
    setTimeout(() => {
    navigate('/home');
  }, 1500);
  };

  const handleRegisterStep1Success = (data) => {
    setRegisterData(data);
    setCurrentStep(2);
  };

  const handleRegisterStep2Success = (type) => {
    setUserType(type);
    setCurrentStep(3);
  };

  const handleRegisterComplete = () => {
    setMessage({
      text: "تم التسجيل بنجاح! يتم تحويلك...",
      type: "success",
    });
  };

  return (
    <StyledContainer>
      <StyledPaper elevation={3}>
        <Typography
          variant="h4"
          align="center"
          sx={{
            mb: 2,
            color: "#6E00FE",
            fontWeight: "bold",
          }}
        >
          {isLogin ? "تسجيل الدخول" : "إنشاء حساب جديد"}
        </Typography>

        {message.text && (
          <Alert severity={message.type} sx={{ mb: 3 }}>
            {message.text}
          </Alert>
        )}

        {isLogin ? (
          <LoginFormLR
            onLoginSuccess={handleLoginSuccess}
            onSwitchToRegister={() => {
              setIsLogin(false);
              setCurrentStep(1);
              setMessage({ text: "", type: "" });
            }}
          />
        ) : (
          <>
            {currentStep === 1 && (
              <RegisterStep1LR
                onSuccess={handleRegisterStep1Success}
                onSwitchToLogin={() => {
                  setIsLogin(true);
                  setMessage({ text: "", type: "" });
                }}
              />
            )}
            {currentStep === 2 && (
              <RegisterStep2LR
                onNext={handleRegisterStep2Success}
                onBack={() => {
                  setCurrentStep(1);
                  setMessage({ text: "", type: "" });
                }}
              />
            )}
            {currentStep === 3 && (
              <RegisterStep3LR
                userType={userType}
                registerData={registerData}
                onComplete={handleRegisterComplete}
                onBack={() => {
                  setCurrentStep(2);
                  setMessage({ text: "", type: "" });
                }}
              />
            )}
          </>
        )}
      </StyledPaper>
    </StyledContainer>
  );
}
