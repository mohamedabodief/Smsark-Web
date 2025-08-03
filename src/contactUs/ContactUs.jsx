import React, { useState, useEffect } from "react";
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
import { collection, getDocs, query, where } from "firebase/firestore";
import { db, auth } from "../FireBase/firebaseConfig";
import contactHeaderImage from "../assets/contact-header.png";
import Message from "../FireBase/MessageAndNotification/Message";
import Notification from "../FireBase/MessageAndNotification/Notification";

const ContactUs = () => {
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
  const [previousMessages, setPreviousMessages] = useState([]); // لحفظ الرسايل السابقة

  // دالة لجلب الرسايل السابقة
  const fetchPreviousMessages = async (senderId) => {
    try {
      const messagesQuery = query(
        collection(db, "messages"),
        where("sender_id", "==", senderId)
      );
      const messagesSnapshot = await getDocs(messagesQuery);
      const messages = messagesSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPreviousMessages(messages);
    } catch (error) {
      console.error("خطأ في جلب الرسايل السابقة:", error);
    }
  };

  useEffect(() => {
    if (auth.currentUser) {
      fetchPreviousMessages(auth.currentUser.uid);
    } else if (formData.email) {
      fetchPreviousMessages(formData.email);
    }
  }, [formData.email]);

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
      // جلب الأدمنز
      const adminsQuery = query(
        collection(db, "users"),
        where("type_of_user", "==", "admin")
      );
      const adminsSnapshot = await getDocs(adminsQuery);
      const admins = adminsSnapshot.docs.map((doc) => ({
        uid: doc.id,
        name: doc.data().adm_name || "الأدمن",
      }));

      if (admins.length === 0) {
        throw new Error("مفيش أدمنز متاحين.");
      }

      let senderName = formData.name;
      let senderId = formData.email;
      if (auth.currentUser) {
        senderName = auth.currentUser.displayName || auth.currentUser.email || formData.name;
        senderId = auth.currentUser.uid;
      }

      const messageContent = `الاسم: ${formData.name}\nالبريد: ${formData.email}\nالهاتف: ${formData.phone}\nالموضوع: ${formData.subject}`;
      for (const admin of admins) {
        const messageData = {
          sender_id: senderId,
          senderName: senderName,
          receiver_id: admin.uid,
          reciverName: admin.name,
          content: messageContent,
          message_type: "text",
          is_read: false,
          timestamp: new Date(),
        };

        const message = new Message(messageData);
        await message.send();

        const notif = new Notification({
          receiver_id: admin.uid,
          title: "رسالة جديدة من تواصل معنا",
          body: `لديك رسالة جديدة من ${senderName}`,
          type: "message",
          link: `/privateChat/${senderId}`,
        });
        await notif.send();
      }

      // تحديث الرسايل السابقة
      await fetchPreviousMessages(senderId);

      setSubmitStatus({
        open: true,
        success: true,
        message: "تم إرسال رسالتك بنجاح لكل الأدمنز! هنتواصل معاكِ قريبًا.",
      });
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
      });
    } catch (error) {
      console.error("خطأ في إرسال الرسالة:", error);
      setSubmitStatus({
        open: true,
        success: false,
        message: "حدث خطأ، حاولي مرة تانية.",
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
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: "center" }}>
              <LocationOn
                sx={{ fontSize: 40, color: theme.palette.primary.main, cursor: 'pointer' }}
                onClick={() => window.open('https://www.google.com/maps/place/Damanhour,+El+Beheira', '_blank')}
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

          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: "center" }}>
              <Phone
                sx={{ fontSize: 40, color: theme.palette.primary.main, cursor: 'pointer' }}
                onClick={() => (window.location.href = 'tel:+201119159182')}
              />

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

          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: "center" }}>
              <Email
                sx={{ fontSize: 40, color: theme.palette.primary.main, cursor: 'pointer' }}
                onClick={() => (window.location.href = 'mailto:quote@semsack.com')}
              />

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
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d110475.94748750485!2d30.390256!3d31.035047!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14f5c4f94c1d6e75%3A0x4084edcbd5e0220!2sDamanhour%2C%20El%20Beheira%20Governorate!5e0!3m2!1sen!2seg!4v1693473175197!5m2!1sen!2seg"
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