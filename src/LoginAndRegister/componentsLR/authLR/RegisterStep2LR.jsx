// src/LoginAndRegister/componentsLR/authLR/RegisterStep2LR.jsx
import React, { useState } from "react";
import { Box, Typography, Button, Grid, Alert } from "@mui/material";
import { Person, Business } from "@mui/icons-material";

export default function RegisterStep2LR({ onNext, onBack }) {
  const [userType, setUserType] = useState(null);
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!userType) {
      setError("الرجاء اختيار نوع المستخدم");
      return;
    }
    onNext(userType);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} 
     sx={{
      // mb:3,
              backgroundColor: "white",
              borderRadius: "12px",
              maxWidth: 500,
              minHeight: 305,
              // display: "flex",
              justifyContent: "center",
              alignItems: "center",
              p: 4,
              boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)", // إضافة ظل خفيف للـ card
            }}
            >
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Grid
        container
        spacing={5}
        sx={{ mt: 2 }}
        justifyContent="center"
        alignItems="center"
      >
        <Grid item xs={12} sm={6}>
          <Button
            fullWidth
            variant={userType === "client" ? "contained" : "outlined"}
            sx={{
              py: 4,
              borderRadius: "12px",
              backgroundColor:
                userType === "client" ? "#6E00FE" : "transparent",
              borderColor: userType === "client" ? "#6E00FE" : "#ddd",
              "&:hover": {
                backgroundColor: userType === "client" ? "#5A00D6" : "#f5f5f5",
                borderColor: "#6E00FE",
              },
            }}
            onClick={() => setUserType("client")}
          >
            <Box textAlign="center">
              <Person fontSize="large" />
              <Typography variant="h6">عميل</Typography>
              <Typography variant="body2">للأفراد الباحثين عن خدمات</Typography>
            </Box>
          </Button>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Button
            fullWidth
            variant={userType === "organization" ? "contained" : "outlined"}
            sx={{
              py: 4,
              borderRadius: "12px",
              backgroundColor:
                userType === "organization" ? "#6E00FE" : "transparent",
              borderColor: userType === "organization" ? "#6E00FE" : "#ddd",
              "&:hover": {
                backgroundColor:
                  userType === "organization" ? "#5A00D6" : "#f5f5f5",
                borderColor: "#6E00FE",
              },
            }}
            onClick={() => setUserType("organization")}
          >
            <Box textAlign="center">
              <Business fontSize="large" />
              <Typography variant="h6">منظمة</Typography>
              <Typography variant="body2">للمنظمات المقدمة للخدمات</Typography>
            </Box>
          </Button>
        </Grid>
      </Grid>

      <Box sx={{ display: "flex", gap: 2, mt: 3, ml: 7, mr: 7 }}>
        <Button
          fullWidth
          variant="outlined"
          onClick={onBack}
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
          disabled={!userType}
          sx={{
            borderRadius: "12px",
            backgroundColor: "#6E00FE",
            "&:hover": { backgroundColor: "#5A00D6" },
            "&:disabled": { backgroundColor: "#cccccc" },
          }}
        >
          التالي
        </Button>
      </Box>
    </Box>
  );
}
