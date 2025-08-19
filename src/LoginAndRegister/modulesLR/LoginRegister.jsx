import React, { useEffect, useState } from "react";
import { Box, Typography, Paper, Alert } from "@mui/material";
import { styled } from "@mui/material/styles";
import LoginFormLR from "../componentsLR/authLR/LoginFormLR";
import RegisterStep1LR from "../componentsLR/authLR/RegisterStep1LR";
import RegisterStep2LR from "../componentsLR/authLR/RegisterStep2LR";
import RegisterStep3LR from "../componentsLR/authLR/RegisterStep3LR";
import ForgotPasswordLR from "../componentsLR/authLR/ForgotPasswordLR";
import background from "../../assets/background.jpg";
import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";

const StyledContainer = styled(Box)({
  minHeight: "92vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  backgroundImage: `url(${background})`,
  backgroundColor: "#000000",
  backgroundSize: "cover",
  backgroundPosition: "center",
  padding: "0 px",
});

const StyledPaper = styled(Paper)(() => ({
  borderRadius: "16px",
  padding:"30px",
  minHeight: "50vh",
  width: "100%",
  maxWidth: "480px",
  margin: "30px ",
  boxShadow: "0 8px 32px rgba(0, 0, 0, 0)",
}));

export default function LoginRegister() {
  const location = useLocation();
  const [isLogin, setIsLogin] = useState(location.pathname === "/login");
  const [currentStep, setCurrentStep] = useState(1);
  const [userType, setUserType] = useState(null);
  const [registerData, setRegisterData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState({ text: "", type: "" });
  const [hasRedirected, setHasRedirected] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const authStatus = useSelector((state) => state.auth.status);
  const authUid = useSelector((state) => state.auth.uid);
  const authUserType = useSelector((state) => state.auth.type_of_user);

  const navigate = useNavigate();

  useEffect(() => {
    setIsLogin(location.pathname === "/login");
  }, [location.pathname]);

  useEffect(() => {
    console.log(
      "authUserType:",
      authUserType,
      "authStatus:",
      authStatus,
      "authUid:",
      authUid,
      "isLogin:",
      isLogin,
      "hasRedirected:",
      hasRedirected
    );

    if (authStatus === "idle" && !authUid) {
      setHasRedirected(false);
      setMessage({ text: "", type: "" });
    }

    if (isLogin && authStatus === "succeeded" && authUid && !hasRedirected) {
      console.log("🚀 Starting redirect process...");
      setMessage({
        text: "تم تسجيل الدخول بنجاح! يتم تحويلك...",
        type: "success",
      });
      setHasRedirected(true);

      console.log("🎯 Immediate redirect test...");
      try {
        if (authUserType === "admin") {
          console.log("Immediately redirecting to admin dashboard...");
          navigate("/admin-dashboard", { replace: true });
        } else if (
          authUserType === "client" ||
          authUserType === "organization"
        ) {
          console.log("Immediately redirecting to home page...");
          navigate("/home", { replace: true });
        } else {
          console.warn("Unknown user type, immediately redirecting to home.");
          navigate("/home", { replace: true });
        }
      } catch (error) {
        console.error("❌ Immediate navigation error:", error);
      }

      const redirectTimer = setTimeout(() => {
        console.log("🎯 Delayed redirect based on user type:", authUserType);

        try {
          if (authUserType === "admin") {
            navigate("/admin-dashboard", { replace: true });
          } else if (
            authUserType === "client" ||
            authUserType === "organization"
          ) {
            navigate("/home", { replace: true });
          } else {
            navigate("/home", { replace: true });
          }
        } catch (error) {
          console.error("❌ Delayed navigation error:", error);
        }
      }, 1500);

      return () => clearTimeout(redirectTimer);
    }
  }, [isLogin, authStatus, authUid, authUserType, navigate, hasRedirected]);

  const handleLoginSuccess = () => {
    // The redirect will be handled by the useEffect
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
    navigate("/registration-success", { replace: true });
  };

  const handleForgotPassword = () => {
    setShowForgotPassword(true);
    setMessage({ text: "", type: "" });
  };

  const handleBackToLogin = () => {
    setShowForgotPassword(false);
    setMessage({ text: "", type: "" });
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
          {isLogin
            ? showForgotPassword
              ? "استعادة كلمة المرور"
              : "تسجيل الدخول"
            : "إنشاء حساب جديد"}
        </Typography>

        {message.text && (
          <Alert severity={message.type} sx={{ mb: 3 }}>
            {message.text}
          </Alert>
        )}

        {isLogin ? (
          showForgotPassword ? (
            <ForgotPasswordLR
              onSuccess={() => {
                setMessage({
                  text: "تم إرسال رابط استعادة كلمة المرور إلى بريدك الإلكتروني",
                  type: "success",
                });
                setShowForgotPassword(false);
              }}
              onBackToLogin={handleBackToLogin}
            />
          ) : (
            <LoginFormLR
              onLoginSuccess={handleLoginSuccess}
              onSwitchToRegister={() => {
                setIsLogin(false);
                setCurrentStep(1);
                setMessage({ text: "", type: "" });
                navigate("/register", { replace: true });
              }}
              onForgotPassword={handleForgotPassword}
            />
          )
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