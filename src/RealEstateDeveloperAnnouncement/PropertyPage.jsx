import React, { useState } from "react";
import {
  Box,
  Typography,
  Snackbar,
  Alert,
  CircularProgress,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import PropertySidebar from "./PropertySidebar";
import PropertyForm from "./PropertyForm";
import RealEstateDeveloperData from "../FireBase/models/Advertisements/RealEstateDeveloperData";
import RealEstateDeveloperAdvertisement from "../FireBase/modelsWithOperations/RealEstateDeveloperAdvertisement";

const PropertyPage = () => {
  const [selectedItem, setSelectedItem] = useState("شقق للبيع");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (formData) => {
    setLoading(true);
    setError(null);
    try {
      const realEstateData = new RealEstateDeveloperData({
        ...formData,
        project_types: [selectedItem], // نوع العقار من الـ Sidebar
        userId: "USER_ID_HERE", // هنا لازم تضيف userId بناءً على نظام الـ auth بتاعك
        type_of_user: "developer",
      });
      const advertisement = new RealEstateDeveloperAdvertisement(
        realEstateData
      );
      await advertisement.save();
      setSuccess(true);
      setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 500);
    } catch (err) {
      setError(err.message || "حدث خطأ غير متوقع");
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSuccess(false);
    setError(null);
  };

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        backgroundColor: "#f9f9f9",
        flexDirection: isMobile ? "column" : "row-reverse",
      }}
    >
      <Box
        sx={{
          width: isMobile ? "100%" : 280,
          bgcolor: "background.paper",
          borderLeft: isMobile ? "none" : "1px solid #e0e0e0",
          borderBottom: isMobile ? "1px solid #e0e0e0" : "none",
        }}
      >
        <PropertySidebar
          selectedItem={selectedItem}
          setSelectedItem={setSelectedItem}
          isMobile={isMobile}
        />
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, md: 3 },
          maxWidth: isMobile ? "100%" : "calc(100% - 280px)",
        }}
      >
        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={handleCloseSnackbar}>
            خطأ في الحفظ: {error}
          </Alert>
        )}

        <Snackbar
          open={success}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert
            severity="success"
            sx={{ width: "100%" }}
            onClose={handleCloseSnackbar}
          >
            تم حفظ العقار بنجاح! سيتم مراجعته من قبل الإدارة
          </Alert>
        </Snackbar>

        {loading && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              my: 4,
            }}
          >
            <CircularProgress color="secondary" />
          </Box>
        )}

        <PropertyForm onSubmit={handleSubmit} loading={loading} />
      </Box>
    </Box>
  );
};

export default PropertyPage;
