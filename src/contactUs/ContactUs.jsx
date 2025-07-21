import React, { useState } from "react";
import {
  Grid,
  Typography,
  TextField,
  Button,
  Paper,
  Box,
  useTheme,
  Container,
  Snackbar,
  Alert,
  IconButton,
} from "@mui/material";
import { Phone, Email, LocationOn, Close } from "@mui/icons-material";
import contactHeaderImage from "../assets/contact-header.png";
import Message from "../FireBase/MessageAndNotification/Message";
import { auth } from "../FireBase/firebaseConfig";
const ContactUs = () => {
  const current=auth.currentUser.uid
  const theme = useTheme();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
  });
  const [submitStatus, setSubmitStatus] = useState({
    open: false,
    success: false,
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // إنشاء رسالة جديدة باستخدام كلاس Message
      const messageData = {
        sender_id: formData.email, 
        receiver_id: current, 
        reciverName: "الأدمن", 
        content: `الاسم: ${formData.name}\nالبريد: ${formData.email}\nالهاتف: ${formData.phone}\nالموضوع: ${formData.subject}`,
        message_type: "text",
        is_read: false,
      };

      const message = new Message(messageData);
      await message.send();

      setSubmitStatus({
        open: true,
        success: true,
        message: "تم إرسال رسالتك بنجاح! سنتواصل معك قريبًا.",
      });

      // إعادة تعيين النموذج
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
      });
    } catch (error) {
      console.error("Error submitting contact form:", error);
      setSubmitStatus({
        open: true,
        success: false,
        message: "حدث خطأ غير متوقع، يرجى المحاولة مرة أخرى.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSubmitStatus((prev) => ({ ...prev, open: false }));
  };

  return (
    <Box sx={{ backgroundColor: theme.palette.background.default }}>
      {/* Header Full Width */}
      <Box
        sx={{
          position: "relative",
          width: "100vw",
          height: 350,
          mb: 6,
          left: "50%",
          right: "50%",
          transform: "translateX(-50%)",
        }}
      >
        <img
          src={contactHeaderImage}
          alt="تواصل معنا"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            bgcolor: "rgba(32, 13, 58, 0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography variant="h2" sx={{ color: "white", fontWeight: "bold" }}>
            تواصل معنا
          </Typography>
        </Box>
      </Box>

      {/* Contact Info in 3 Columns */}
      <Box sx={{ px: 3, mb: 6 }}>
        <Grid container spacing={30} justifyContent="center">
          {/* Location */}
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: "center" }}>
              <LocationOn
                sx={{ fontSize: 40, color: theme.palette.primary.main }}
              />
              <Typography variant="h6" fontWeight="bold" sx={{ mt: 1 }}>
                الموقع
              </Typography>
              <Typography variant="body2">
                1628 Damanhour, Elbehaira
                <br />
                2001 iti branch, damanhour
              </Typography>
            </Box>
          </Grid>

          {/* Call */}
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: "center" }}>
              <Phone sx={{ fontSize: 40, color: theme.palette.primary.main }} />
              <Typography variant="h6" fontWeight="bold" sx={{ mt: 1 }}>
                اتصل بنا
              </Typography>
              <Typography variant="body2">
                Foul Doris: +20 111 915 9182
                <br />
                الإدارة: 045 263 5992
              </Typography>
            </Box>
          </Grid>

          {/* Email */}
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: "center" }}>
              <Email sx={{ fontSize: 40, color: theme.palette.primary.main }} />
              <Typography variant="h6" fontWeight="bold" sx={{ mt: 1 }}>
                اكتب لنا
              </Typography>
              <Typography variant="body2">
                quote@semsack.com
                <br />
                info@semsack.com
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>

      <Container maxWidth="lg" sx={{ my: 5 }}>
        <Paper elevation={3} sx={{ borderRadius: 4, overflow: "hidden" }}>
          <Grid container>
            {/* Left side - map in colored box */}
            <Grid size={{ xs: 12, md: 4 }}>
              <Box
                sx={{
                  backgroundColor: "#20063B",
                  height: "100%",
                  width: "250px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  p: 2,
                }}
              >
                <Box
                  sx={{
                    position: "relative",
                    left: "150px",
                    zIndex: 2,
                    height: 400,
                    bgcolor: "lightblue",
                  }}
                >
                  <iframe
                    title="Office Location"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3593.2103204779216!2d-80.1304566849789!3d25.76142618363638!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x88d9b3668a1fcee1%3A0x2f0a2a5a5a5a5a5a!2s1628%20Michigan%20Ave%2C%20Miami%20Beach%2C%20FL%2033139%2C%20USA!5e0!3m2!1sen!2seg!4v1620000000000!5m2!1sen!2seg"
                    height="100%"
                    style={{ border: 0, borderRadius: 8 }}
                    allowFullScreen=""
                    loading="lazy"
                  ></iframe>
                </Box>
              </Box>
            </Grid>

            <Grid size={{ xs: 12, md: 8 }}>
              <Box
                sx={{
                  p: 4,
                  direction: "rtl",
                  width: "75%",
                  position: "relative",
                  left: "100px",
                }}
              >
                <Typography
                  variant="h4"
                  color="primary"
                  fontWeight="bold"
                  gutterBottom
                >
                  تواصل معنا
                </Typography>
                <Typography variant="body1" sx={{ mb: 3 }}>
                  اكتب لنا للحصول على أفضل العروض
                </Typography>
                <form onSubmit={handleSubmit}>
                  <TextField
                    fullWidth
                    label="الاسم"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    sx={{ mb: 2, "& input": { textAlign: "right" } }}
                  />
                  <TextField
                    fullWidth
                    label="البريد الإلكتروني"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    sx={{ mb: 2, "& input": { textAlign: "right" } }}
                  />
                  <TextField
                    fullWidth
                    label="رقم الهاتف"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    sx={{ mb: 2, "& input": { textAlign: "right" } }}
                  />
                  <TextField
                    fullWidth
                    label="الموضوع"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    multiline
                    rows={4}
                    required
                    sx={{ mb: 3, "& textarea": { textAlign: "right" } }}
                  />
                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    disabled={isSubmitting}
                    sx={{
                      py: 1.5,
                      fontWeight: "bold",
                      backgroundColor: "#6100FF",
                      "&:disabled": {
                        backgroundColor: "#cccccc",
                      },
                    }}
                  >
                    {isSubmitting ? "جاري الإرسال..." : "إرسال"}
                  </Button>
                </form>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Container>

      <Snackbar
        open={submitStatus.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          severity={submitStatus.success ? "success" : "error"}
          action={
            <IconButton
              size="small"
              aria-label="close"
              color="inherit"
              onClick={handleCloseSnackbar}
            >
              <Close fontSize="small" />
            </IconButton>
          }
          sx={{ width: "100%" }}
        >
          {submitStatus.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ContactUs;