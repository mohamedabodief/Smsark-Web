//src/LoginAndRegister/modulesLR/LoginRegister.jsx
import React, { useEffect, useState } from "react";
import { Box, Typography, Paper, Alert } from "@mui/material";
import { styled } from "@mui/material/styles";
import LoginFormLR from "../componentsLR/authLR/LoginFormLR";
import RegisterStep1LR from "../componentsLR/authLR/RegisterStep1LR";
import RegisterStep2LR from "../componentsLR/authLR/RegisterStep2LR";
import RegisterStep3LR from "../componentsLR/authLR/RegisterStep3LR";
import background from "../../assets/background.jpg";
import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { auth } from "../../FireBase/firebaseConfig";

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
  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
  // height: "70%"// عشان يأخذ الحجم الطبيعي
}));

export default function LoginRegister() {
  const location = useLocation(); // Get the current location object
  // Initialize isLogin based on the current path
  const [isLogin, setIsLogin] = useState(location.pathname === '/login');
  const [currentStep, setCurrentStep] = useState(1);
  const [userType, setUserType] = useState(null);
  const [registerData, setRegisterData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState({ text: "", type: "" });
  const [hasRedirected, setHasRedirected] = useState(false);

  // Use useSelector to get auth state from Redux
  const authStatus = useSelector((state) => state.auth.status);
  const authUid = useSelector((state) => state.auth.uid);
  const authUserType = useSelector((state) => state.auth.type_of_user);
  const authOrganizationType = useSelector((state) => state.auth.type_of_organization);
  const authAdminName = useSelector((state) => state.auth.adm_name);

  const navigate = useNavigate(); // Initialize useNavigate hook

  // Update isLogin when location changes
  useEffect(() => {
    setIsLogin(location.pathname === '/login');
  }, [location.pathname]);

  useEffect(() => {
    console.log('authUserType:', authUserType, 'authStatus:', authStatus, 'authUid:', authUid, 'isLogin:', isLogin, 'hasRedirected:', hasRedirected);
    
    // Reset hasRedirected when user logs out
    if (authStatus === "idle" && !authUid) {
      setHasRedirected(false);
      setMessage({ text: "", type: "" });
    }
    
    // Only proceed if we are currently in the login view AND authentication succeeded
    // AND we haven't already redirected
    if (isLogin && authStatus === "succeeded" && authUid && !hasRedirected) {
      setMessage({
        text: "تم تسجيل الدخول بنجاح! يتم تحويلك...",
        type: "success",
      });
      setHasRedirected(true);
      
      // Immediate redirect for testing
      console.log('🎯 Immediate redirect test...');
      try {
        if (authUserType === "admin") {
          navigate("/admin-dashboard", { replace: true });
        } else {
          // For client or organization, always go to home
          navigate("/home", { replace: true });
        }
      } catch (error) {
        console.error("❌ Navigation error:", error);
      }
    }
  }, [isLogin, authStatus, authUid, authUserType, navigate, hasRedirected]);

  const handleLoginSuccess = () => {
    // The redirect will be handled by the useEffect based on Redux state
    // This function is kept for compatibility but doesn't handle navigation
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
    navigate("/login", { replace: true });
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
              navigate("/register", { replace: true });
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
                  navigate("/login", { replace: true });
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
