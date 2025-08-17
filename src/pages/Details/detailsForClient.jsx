import React, { useState, useEffect } from "react";
import {
  Container,
  Box,
  Typography,
  keyframes,
  CircularProgress,
  Breadcrumbs,
  Button,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Divider,
  Grid,
} from "@mui/material";
import Message from "../../FireBase/MessageAndNotification/Message";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import {
  WhatsApp as WhatsAppIcon,
  FavoriteBorder as FavoriteBorderIcon,
  OutlinedFlag as OutlinedFlagIcon,
  ShareOutlined as ShareOutlinedIcon,
} from "@mui/icons-material";
import HomeIcon from "@mui/icons-material/Home";
import { useParams, Link, useNavigate } from "react-router-dom";
import MapPicker from "../../LocationComponents/MapPicker";
import ClientAdvertisement from "../../FireBase/modelsWithOperations/ClientAdvertisemen";
import PhoneIcon from "@mui/icons-material/Phone";
import { db, auth } from "../../FireBase/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import Notification from "../../FireBase/MessageAndNotification/Notification";

// أضف هذا الكائن الثابت في أعلى الملف بعد الاستيرادات
const PACKAGE_INFO = {
  1: { name: "باقة الأساس", price: "مجانا", duration: 7 },
  2: { name: "باقة النخبة", price: 50, duration: 14 },
  3: { name: "باقة التميز", price: 100, duration: 21 },
};

function DetailsForClient() {
  // التمرير إلى أعلى الصفحة عند تحميل الكومبوننت مع حماية باستخدام try-catch
  useEffect(() => {
    try {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
    }
  }, []);

  const currentUser = auth.currentUser?.uid;
  const { id } = useParams();
  const [clientAds, setClientAds] = useState(null);
  const [mainImage, setMainImage] = useState("");
  const [showFull, setShowFull] = useState(false);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const getReceiverName = async (userId) => {
    try {
      const userDoc = await getDoc(doc(db, "users", userId));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        return userData.cli_name || "Unknown User";
      }
      return "Unknown User";
    } catch (err) {
      return "Unknown User";
    }
  };

  useEffect(() => {
    const fetchAd = async () => {
      const ad = await ClientAdvertisement.getById(id);
      if (ad) {
        setClientAds(ad);
        if (Array.isArray(ad.images) && ad.images.length > 0) {
          setMainImage(ad.images[0]);
        }
      }
    };
    if (id) fetchAd();
  }, [id]);

  const handleSend = async () => {
    if (!message.trim() || !currentUser || !clientAds?.userId) return;

    try {
      const receiverName = await getReceiverName(clientAds.userId);
      const newMessage = new Message({
        sender_id: currentUser,
        receiver_id: clientAds.userId,
        content: message,
        reciverName: receiverName,
        timestamp: new Date(),
        is_read: false,
        message_type: "text",
      });
      await newMessage.send();

      const notification = new Notification({
        receiver_id: clientAds.userId,
        title: `رسالة جديدة من ${auth.currentUser.email || "مستخدم"}`,
        body: message || "لقد تلقيت رسالة جديدة!",
        type: "message",
        link: `/privateChat/${clientAds.userId}`,
      });
      await notification.send();

      alert("تم إرسال الرسالة!");
      setMessage("");
      setOpen(false);
    } catch (error) {
      alert("فشل في إرسال الرسالة!");
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: clientAds?.title || "إعلان عقاري",
          text: clientAds?.description || "تحقق من هذا الإعلان العقاري!",
          url: window.location.href,
        });
      } catch (error) {
      }
    } else {
      alert("المتصفح لا يدعم خاصية المشاركة.");
    }
  };

  const pulse = keyframes`
    0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(37, 211, 102, 0.4); }
    70% { transform: scale(1.1); box-shadow: 0 0 0 10px rgba(37, 211, 102, 0); }
    100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(37, 211, 102, 0); }
  `;

  const isOwner = auth.currentUser?.uid === clientAds?.userId;

  if (!clientAds) {
    return (
      <Box
        sx={{
          height: "100vh",
          width: "100vw",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress sx={{ color: "#6E00FE" }} size={80} />
      </Box>
    );
  }

  const toggleShow = () => setShowFull((prev) => !prev);

  return (
    <Container maxWidth="lg" dir="rtl">
      <Box
        onClick={() => setOpen(true)}
        sx={{
          position: "fixed",
          bottom: 20,
          right: 20,
          backgroundColor: "#1976d2",
          color: "white",
          px: 2.5,
          py: 1,
          borderRadius: "30px",
          zIndex: 999,
          cursor: "pointer",
          animation: `${pulse} 2s infinite`,
          transition: "transform 0.3s",
          "&:hover": { transform: "scale(1.05)" },
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0px 4px 12px rgba(0,0,0,0.2)",
        }}
      >
        <ChatBubbleOutlineIcon sx={{ fontSize: 22, mr: 1 }} />
        <Typography sx={{ fontWeight: "bold", fontSize: "0.9rem" }}>
          تواصل مع البائع
        </Typography>
      </Box>
      <Dialog open={open} fullWidth dir="rtl" onClose={() => setOpen(false)}>
        <DialogTitle>تواصل مع البائع بكل سهولة</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="اكتب رسالتك هنا"
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>إلغاء</Button>
          <Button onClick={handleSend} variant="contained">
            إرسال
          </Button>
        </DialogActions>
      </Dialog>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          mt: "10px",
          flexDirection: "row-reverse",
        }}
      >
        <Box sx={{ mb: 5, display: "flex", gap: 4 }}>
          <Box sx={{ display: "flex", gap: 1, color: "#807AA6" }}>
            <Button>
              <Typography fontWeight="bold">حفظ</Typography>
              <FavoriteBorderIcon />
            </Button>
          </Box>
          {/* <Box sx={{ display: "flex", gap: 1, color: "#807AA6" }}>
            <Button>
              <Typography fontWeight="bold">إبلاغ</Typography>
              <OutlinedFlagIcon />
            </Button>
          </Box> */}
          <Box sx={{ display: "flex", gap: 1, color: "#807AA6" }}>
            <Button onClick={handleShare}>
              <Typography fontWeight="bold">مشاركة</Typography>
              <ShareOutlinedIcon />
            </Button>
          </Box>
        </Box>
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "column", lg: "row" },
          gap: 2,
          mb: 4,
        }}
      >
        <Box
          sx={{
            flex: 3,
            height: "500px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#f7f7f7",
            borderRadius: 3,
          }}
        >
          <img
            src={mainImage || "/no-image.svg"}
            alt="Main"
            style={{
              width: "100%",
              height: "100%",
              borderRadius: "8px",
              objectFit: "cover",
            }}
          />
        </Box>
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: { xs: "row", md: "row", lg: "column" },
            gap: 1,
            mt: { xs: 2, md: 2, lg: 0 },
            height: { lg: "100%" },
            justifyContent: "center",
          }}
        >
          {clientAds?.images?.map((src, index) => (
            <Box
              key={index}
              onClick={() => setMainImage(src)}
              sx={{
                height: { xs: 90, md: 100, lg: 120 },
                width: { xs: 90, md: 100, lg: 120 },
                cursor: "pointer",
                border:
                  mainImage === src ? "2px solid #1976d2" : "1px solid #e0e0e0",
                borderRadius: "8px",
                overflow: "hidden",
                transition: "all 0.3s",
                "&:hover": { transform: "scale(1.05)" },
              }}
            >
              <img
                src={src}
                alt={`img-${index}`}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </Box>
          ))}
        </Box>
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 4,
          alignItems: "flex-start",
          mb: 4,
        }}
      >
        <Box
          width={{ xs: "100%", md: "70%" }}
          sx={{ textAlign: "right", mt: 2 }}
        >
          <Typography
            variant="h4"
            fontWeight="bold"
            gutterBottom
            sx={{ color: "#6E00FE", mb: 3 }}
          >
            {clientAds.project_types?.join(" - ") || "عقار للبيع"}
          </Typography>

          <Typography
            sx={{
              fontSize: "18px",
              lineHeight: 1.8,
              overflow: "hidden",
              display: "-webkit-box",
              WebkitLineClamp: showFull ? "none" : 4,
              WebkitBoxOrient: "vertical",
              mb: 3,
              color: "#333",
            }}
          >
            {clientAds.description || "لا يوجد وصف متاح"}
          </Typography>

          {clientAds.description && clientAds.description.length > 200 && (
            <Button
              onClick={toggleShow}
              sx={{
                border: "2px solid #6E00FE",
                color: "#6E00FE",
                borderRadius: "25px",
                backgroundColor: "transparent",
                "&:hover": { backgroundColor: "#f0f0f0" },
                px: 3,
                mb: 3,
              }}
            >
              {showFull ? "إخفاء التفاصيل" : "عرض المزيد"}
            </Button>
          )}

          <Divider sx={{ my: 3 }} />

          <Grid container spacing={4}>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary">
                المحافظة
              </Typography>
              <Typography variant="body1" fontWeight="bold">
                {clientAds.governorate || "غير محدد"}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary">
                المدينة
              </Typography>
              <Typography variant="body1" fontWeight="bold">
                {clientAds.city || "غير محدد"}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary">
                العنوان
              </Typography>
              <Typography variant="body1" fontWeight="bold">
                {clientAds.address || "غير محدد"}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary">
                المساحة
              </Typography>
              <Typography variant="body1" fontWeight="bold">
                {clientAds.area ? `${clientAds.area} م²` : "غير محدد"}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary">
                السعر
              </Typography>
              <Typography variant="body1" fontWeight="bold">
                {clientAds.price ? `${clientAds.price} ج.م` : "غير محدد"}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary">
                تاريخ البناء
              </Typography>
              <Typography variant="body1" fontWeight="bold">
                {clientAds.date_of_building || "غير محدد"}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary">
                نوع الإعلان
              </Typography>
              <Typography variant="body1" fontWeight="bold">
                {clientAds.ad_type || "غير محدد"}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary">
                حالة الإعلان
              </Typography>
              <Typography variant="body1" fontWeight="bold">
                {clientAds.ad_status || "غير محدد"}
              </Typography>
            </Grid>

            {isOwner && clientAds.adPackage && (
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">
                  الباقة المختارة
                </Typography>
                <Typography variant="body1" fontWeight="bold" color="primary">
                  {clientAds.adPackage === 1
                    ? "باقة الأساس"
                    : clientAds.adPackage === 2
                    ? "باقة النخبة"
                    : clientAds.adPackage === 3
                    ? "باقة التميز"
                    : clientAds.adPackage}
                </Typography>
              </Grid>
            )}
          </Grid>
        </Box>

        <Box
          width={{ xs: "100%", md: "30%" }}
          sx={{ textAlign: "center", mt: 2 }}
        >
          <Box
            sx={{
              border: "1px solid #E7E5F4",
              borderRadius: "20px",
              backgroundColor: (theme) => 
                theme.palette.mode === 'light' 
                  ? theme.palette.grey[50] 
                  : theme.palette.grey[900],
              p: 3,
            }}
          >
            <Avatar
              alt={`${clientAds.user_name}`}
              src="/static/images/avatar/1.jpg"
              sx={{ width: 60, height: 60, mx: "auto", mb: 2 }}
            />
            <Typography sx={{ fontSize: "20px", fontWeight: "bold" }}>
              نشر بواسطة: {clientAds.user_name}
            </Typography>

            <Divider sx={{ my: 2 }} />
            <Typography variant="body2" color="text.secondary">
              رقم الهاتف
            </Typography>
            <Typography variant="body1" fontWeight="bold" sx={{ mb: 2 }}>
              {clientAds.phone || "غير محدد"}
            </Typography>
            <Button
              variant="contained"
              startIcon={<PhoneIcon />}
              fullWidth
              sx={{
                backgroundColor: "#DF3631",
                "&:hover": { backgroundColor: "#c62828" },
                borderRadius: "25px",
                py: 1.5,
                fontSize: "16px",
                "& .MuiButton-startIcon": {
                  marginLeft: "6px",
                  marginRight: 0,
                },
                fontWeight: "bold",
                mb: 2,
              }}
              onClick={() => window.open(`tel:${clientAds.phone}`, "_self")}
            >
              اتصل الآن
            </Button>
            <Button
              variant="contained"
              startIcon={<WhatsAppIcon />}
              fullWidth
              sx={{
                backgroundColor: "#4DBD43",
                "&:hover": { backgroundColor: "#388e3c" },
                "& .MuiButton-startIcon": {
                  marginLeft: "6px",
                  marginRight: 0,
                },
                borderRadius: "25px",
                py: 1.5,
                fontSize: "16px",
                fontWeight: "bold",
              }}
              onClick={() => {
                const message = "مرحبًا، أريد الاستفسار عن الإعلان الخاص بك";
                const url = `https://wa.me/${
                  clientAds.phone
                }?text=${encodeURIComponent(message)}`;
                window.open(url, "_blank");
              }}
            >
              واتساب
            </Button>
          </Box>
        </Box>
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 4,
          alignItems: "flex-start",
          mb: 4,
        }}
      >
        <Box
          width={{ xs: "100%", md: "60%" }}
          sx={{ textAlign: "right", mt: 2 }}
        >
          <Typography
            sx={{ fontWeight: "bold", width: "50%" }}
            variant="h5"
            dir="rtl"
          >
            العنوان
          </Typography>
          <Breadcrumbs
            aria-label="breadcrumb"
            sx={{ my: 6 }}
            dir="rtl"
            separator="›"
          >
            <Link
              to="/"
              style={{
                color: "inherit",
                display: "flex",
                alignItems: "center",
                fontWeight: "bold",
                textDecoration: "none",
              }}
            >
              <HomeIcon sx={{ ml: 1 }} /> الرئيسية
            </Link>
            {clientAds.governorate && (
              <Typography fontWeight="bold">{clientAds.governorate}</Typography>
            )}
            {clientAds.address && (
              <Typography fontWeight="bold">{clientAds.address}</Typography>
            )}
          </Breadcrumbs>
          <Box
            sx={{
              backgroundColor: (theme) => 
                theme.palette.mode === 'light' 
                  ? theme.palette.grey[50] 
                  : theme.palette.grey[900],
              display: "flex",
              gap: "30px",
              height: "20%",
              width: "100%",
              padding: "20px",
              borderRadius: "10px",
            }}
          >
            <Avatar
              alt={clientAds.user_name}
              src="/static/images/avatar/1.jpg"
            />
            <Typography sx={{ fontSize: "20px" }}>
              نشر بواسطة: {clientAds.user_name || "غير محدد"}
            </Typography>
          </Box>
        </Box>

        <Box
          width={{ xs: "100%", md: "40%" }}
          sx={{ textAlign: "right", mt: 2 }}
        >
          <Box
            sx={{
              flex: 1,
              width: "100%",
              height: "250px",
              borderRadius: "16px",
              overflow: "hidden",
              boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
              border: "1px solid #e0e0e0",
            }}
          >
            <MapPicker
              lat={clientAds.latitude}
              lng={clientAds.longitude}
              onLocationSelect={(location) => {
              }}
            />
          </Box>
        </Box>
      </Box>

      {/* زر التعديل للمالك */}
      <Box sx={{ textAlign: "right", mt: 4 }}>
        {isOwner && (
          <Button
            variant="contained"
            color="primary"
            sx={{
              borderRadius: "15px",
              fontWeight: "bold",
              px: 5,
              py: 1.5,
              mr: 2,
              mt: 2,
              mb: 2,
              width: "20%",
              justifyContent: "center",
            }}
            onClick={() =>
              navigate("/AddAdvertisement", {
                state: {
                  editMode: true,
                  adData: { ...clientAds, id: clientAds.id },
                },
              })
            }
          >
            تعديل الإعلان
          </Button>
        )}
        <Button
          variant="contained"
          color="primary"
          sx={{
            borderRadius: "15px",
            fontWeight: "bold",
            px: 5,
            py: 1.5,
            mr: 2,
            mt: 2,
            mb: 2,
            width: "20%",
            justifyContent: "center",
          }}
          onClick={() => navigate("/AddAdvertisement")}
        >
          إضافة إعلان جديد
        </Button>
      </Box>
    </Container>
  );
}

export default DetailsForClient;