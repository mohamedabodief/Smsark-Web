//scr/pages/Details/detailsForDevelopment.jsx

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
  Chip,
  Grid,
  Card,
  CardContent,
  Divider,
  IconButton,
  Alert,
  Paper,
} from "@mui/material";
import {
  WhatsApp as WhatsAppIcon,
  FavoriteBorder as FavoriteBorderIcon,
  BookmarkBorder as BookmarkBorderIcon,
  OutlinedFlag as OutlinedFlagIcon,
  ShareOutlined as ShareOutlinedIcon,
  Edit as EditIcon,
  LocationOn as LocationOnIcon,
  AttachMoney as AttachMoneyIcon,
  Phone as PhoneIcon,
  KingBed as KingBedIcon,
  Bathtub as BathtubIcon,
  SquareFoot as SquareFootIcon,
  Business as BusinessIcon,
  Home as HomeIcon,
  Villa as VillaIcon,
  BeachAccess as BeachAccessIcon,
} from "@mui/icons-material";
import { useParams, Link, useNavigate } from "react-router-dom";
import MapPicker from "../../LocationComponents/MapPicker";
import RealEstateDeveloperAdvertisement from "../../FireBase/modelsWithOperations/RealEstateDeveloperAdvertisement";

import { auth } from "../../FireBase/firebaseConfig";

function DetailsForDevelopment() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [clientAds, setClientAds] = useState(null);
  const [mainImage, setMainImage] = useState("");
  const [showFull, setShowFull] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const toggleShow = () => setShowFull((prev) => !prev);

  useEffect(() => {
    const fetchAd = async () => {
      try {
        setError(null);
        console.log("Fetching ad with ID:", id);
        const ad = await RealEstateDeveloperAdvertisement.getById(id);
        if (ad) {
          console.log("Ad data:", ad);
          console.log("Ad ID:", ad.id);
          setClientAds({ ...ad, id: ad.id });
          if (Array.isArray(ad.images) && ad.images.length > 0) {
            console.log("Images found:", ad.images);
            // التحقق من أن الصور صالحة - استبعاد القيم الفارغة والروابط غير الصحيحة
            const validImages = ad.images.filter(
              (img) =>
                typeof img === "string" &&
                img.trim() !== "" &&
                img !== "null" &&
                img !== "undefined" &&
                (img.startsWith("http") || img.startsWith("https"))
            );
            if (validImages.length > 0) {
              console.log("Valid images found:", validImages);
              setMainImage(validImages[0]);
            } else {
              console.log("No valid images found - all images are invalid");
              setMainImage("/no-image.svg");
            }
          } else {
            console.log("No images array found in ad");
            setMainImage("/no-image.svg");
          }
        } else {
          setError("العقار غير موجود");
          console.error("Ad not found for ID:", id);
        }
      } catch (error) {
        setError("حدث خطأ في تحميل بيانات العقار");
        console.error("Error fetching ad:", error);
      }
    };
    if (id) fetchAd();
  }, [id]);

  const handleEdit = () => {
    // التحقق من وجود ID صالح
    if (!clientAds?.id) {
      console.error("No valid ID found for the advertisement");
      console.error("Client ads data:", clientAds);
      alert("لا يمكن تعديل هذا الإعلان - لا يوجد معرف صالح");
      return;
    }

    console.log("Editing advertisement with ID:", clientAds.id);
    console.log("Full client ads data:", clientAds);

    // الانتقال لصفحة إضافة الإعلان مع البيانات الحالية
    navigate("/RealEstateDeveloperAnnouncement", {
      state: {
        editMode: true,
        adData: clientAds,
        adId: clientAds.id,
      },
    });
  };

  const pulse = keyframes`
    0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(37, 211, 102, 0.4); }
    70% { transform: scale(1.1); box-shadow: 0 0 0 10px rgba(37, 211, 102, 0); }
    100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(37, 211, 102, 0); }
  `;

  // التحقق من أن المستخدم هو صاحب الإعلان
  const isOwner = auth.currentUser?.uid === clientAds?.userId;

  // إضافة console.log للتحقق من البيانات
  console.log("Current user ID:", auth.currentUser?.uid);
  console.log("Ad user ID:", clientAds?.userId);
  console.log("Is owner:", isOwner);

  // دالة للحصول على أيقونة نوع العقار
  const getPropertyTypeIcon = (type) => {
    switch (type) {
      case "شقق للبيع":
      case "شقق للإيجار":
        return <HomeIcon />;
      case "فلل للبيع":
      case "فلل للإيجار":
        return <VillaIcon />;
      case "عقارات مصايف للبيع":
      case "عقارات مصايف للإيجار":
        return <BeachAccessIcon />;
      default:
        return <BusinessIcon />;
    }
  };

  if (error) {
    return (
      <Box
        sx={{
          height: "100vh",
          width: "100vw",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: 2,
        }}
      >
        <Typography variant="h5" color="error" gutterBottom>
          {error}
        </Typography>
        <Button
          variant="contained"
          onClick={() => navigate("/RealEstateDeveloperAnnouncement")}
          sx={{ backgroundColor: "#6E00FE" }}
        >
          العودة للصفحة الرئيسية
        </Button>
      </Box>
    );
  }

  if (!clientAds) {
    return (
      <Box
        sx={{
          height: "100vh",
          width: "100vw",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: 2,
        }}
      >
        <CircularProgress sx={{ color: "#6E00FE" }} size={80} />
        <Typography variant="h6" color="text.secondary">
          جاري تحميل بيانات العقار...
        </Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4, position: "relative" }} dir="rtl">
      {/* نوع العقار */}
      <Paper
        elevation={3}
        sx={{
          position: "fixed",
          top: 20,
          left: 20,
          backgroundColor: "#1976d2",
          color: "white",
          px: 3,
          py: 1,
          borderRadius: "25px",
          fontWeight: "bold",
          zIndex: 10,
          display: "flex",
          alignItems: "center",
          gap: 1,
        }}
      >
        {getPropertyTypeIcon(clientAds.project_types?.[0])}
        <Typography>
          {clientAds.project_types?.join(" - ") || "عقار"}
        </Typography>
      </Paper>

      {/* واتساب */}
      <Box
        sx={{
          position: "fixed",
          bottom: 20,
          right: 20,
          backgroundColor: "#25D366",
          color: "white",
          px: 2,
          py: 1,
          borderRadius: "50%",
          zIndex: 999,
          cursor: "pointer",
          animation: `${pulse} 2s infinite`,
          transition: "transform 0.3s",
          "&:hover": { transform: "scale(1.2)" },
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0px 4px 12px rgba(0,0,0,0.2)",
          width: 60,
          height: 60,
        }}
      >
        <WhatsAppIcon sx={{ fontSize: 30 }} />
      </Box>

      {/* أزرار التفاعل */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 4 }}>
        <Box sx={{ display: "flex", gap: 2, flexDirection: "row-reverse" }}>
          <Button
            variant="outlined"
            startIcon={<FavoriteBorderIcon />}
            sx={{
              borderRadius: "25px",
              color: "#807AA6",
              borderColor: "#807AA6",
              flexDirection: "row-reverse",
              gap: 1.5,
              "& .MuiButton-startIcon": {
                marginLeft: "12px",
                marginRight: 0,
              },
            }}
          >
            مفضلة
          </Button>
          <Button
            variant="outlined"
            startIcon={<OutlinedFlagIcon />}
            sx={{
              borderRadius: "25px",
              color: "#807AA6",
              borderColor: "#807AA6",
              flexDirection: "row-reverse",
              gap: 1.5,
              "& .MuiButton-startIcon": {
                marginLeft: "12px",
                marginRight: 0,
              },
            }}
          >
            إبلاغ
          </Button>
          <Button
            variant="outlined"
            startIcon={<ShareOutlinedIcon />}
            sx={{
              borderRadius: "25px",
              color: "#807AA6",
              borderColor: "#807AA6",
              flexDirection: "row-reverse",
              gap: 1.5,
              "& .MuiButton-startIcon": {
                marginLeft: "12px",
                marginRight: 0,
              },
            }}
          >
            مشاركة
          </Button>
        </Box>
      </Box>

      {/* الصور الرئيسية والصغيرة */}
      <Paper elevation={3} sx={{ mb: 4, borderRadius: 3, overflow: "hidden" }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "column", lg: "row" },
            gap: 2,
          }}
        >
          <Box sx={{ flex: 3, height: "500px" }}>
            <img
              src={mainImage}
              alt="صورة العقار الرئيسية"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                borderTopLeftRadius: "12px",
                borderTopRightRadius: "12px",
              }}
              onError={(e) => {
                console.log("Image failed to load:", mainImage);
                e.target.src = "/no-image.svg";
              }}
              onLoad={() => {
                console.log("Image loaded successfully:", mainImage);
              }}
            />
          </Box>

          {clientAds?.images &&
          clientAds.images.filter(
            (img) =>
              typeof img === "string" &&
              img.trim() !== "" &&
              img !== "null" &&
              img !== "undefined" &&
              (img.startsWith("http") || img.startsWith("https"))
          ).length > 1 ? (
            <Box
              sx={{
                flex: 1,
                display: "flex",
                flexDirection: { xs: "row", md: "row", lg: "column" },
                gap: 1,
                p: 2,
              }}
            >
              {clientAds.images
                .filter(
                  (img) =>
                    typeof img === "string" &&
                    img.trim() !== "" &&
                    img !== "null" &&
                    img !== "undefined" &&
                    (img.startsWith("http") || img.startsWith("https"))
                )
                .slice(0, 4)
                .map((src, index) => (
                  <Box
                    key={index}
                    onClick={() => setMainImage(src)}
                    sx={{
                      height: { xs: 80, md: 90, lg: 100 },
                      cursor: "pointer",
                      border:
                        mainImage === src
                          ? "3px solid #1976d2"
                          : "2px solid #e0e0e0",
                      borderRadius: "8px",
                      overflow: "hidden",
                      transition: "all 0.3s",
                      "&:hover": { transform: "scale(1.05)" },
                    }}
                  >
                    <img
                      src={src}
                      alt={`صورة ${index + 1}`}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                      onError={(e) => {
                        console.log("Thumbnail failed to load:", src);
                        e.target.src = "/no-image-thumbnail.svg";
                      }}
                      onLoad={() => {
                        console.log("Thumbnail loaded successfully:", src);
                      }}
                    />
                  </Box>
                ))}
            </Box>
          ) : null}
        </Box>
      </Paper>

      {/* معلومات العقار والمطور */}
      <Grid container spacing={4}>
        {/* معلومات العقار - على اليمين */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Paper elevation={3} sx={{ borderRadius: 3 }}>
            <CardContent sx={{ p: 4 }}>
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

              {/* تفاصيل العقار */}
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      mb: 2,
                    }}
                  >
                    <LocationOnIcon color="primary" sx={{ fontSize: 28 }} />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        الموقع
                      </Typography>
                      <Typography variant="body1" fontWeight="bold">
                        {clientAds.location?.governorate} -{" "}
                        {clientAds.location?.city}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      mb: 2,
                    }}
                  >
                    <AttachMoneyIcon color="primary" sx={{ fontSize: 28 }} />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        السعر
                      </Typography>
                      <Typography variant="body1" fontWeight="bold">
                        {clientAds.price_start_from?.toLocaleString()} -{" "}
                        {clientAds.price_end_to?.toLocaleString()} ج.م
                      </Typography>
                    </Box>
                  </Box>
                </Grid>

                {clientAds.rooms && (
                  <Grid item xs={12} sm={6}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        mb: 2,
                      }}
                    >
                      <KingBedIcon color="primary" sx={{ fontSize: 28 }} />
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          عدد الغرف
                        </Typography>
                        <Typography variant="body1" fontWeight="bold">
                          {clientAds.rooms} غرفة
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                )}

                {clientAds.bathrooms && (
                  <Grid item xs={12} sm={6}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        mb: 2,
                      }}
                    >
                      <BathtubIcon color="primary" sx={{ fontSize: 28 }} />
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          عدد الحمامات
                        </Typography>
                        <Typography variant="body1" fontWeight="bold">
                          {clientAds.bathrooms} حمام
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                )}

                {clientAds.area && (
                  <Grid item xs={12} sm={6}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        mb: 2,
                      }}
                    >
                      <SquareFootIcon color="primary" sx={{ fontSize: 28 }} />
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          المساحة
                        </Typography>
                        <Typography variant="body1" fontWeight="bold">
                          {clientAds.area} م²
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                )}

                {clientAds.floor && (
                  <Grid item xs={12} sm={6}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        mb: 2,
                      }}
                    >
                      <BusinessIcon color="primary" sx={{ fontSize: 28 }} />
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          الطابق
                        </Typography>
                        <Typography variant="body1" fontWeight="bold">
                          {clientAds.floor}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                )}

                <Grid item xs={12} sm={6}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      mb: 2,
                    }}
                  >
                    <PhoneIcon color="primary" sx={{ fontSize: 28 }} />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        رقم الهاتف
                      </Typography>
                      <Typography variant="body1" fontWeight="bold">
                        {clientAds.phone}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      mb: 2,
                    }}
                  >
                    <HomeIcon color="primary" sx={{ fontSize: 28 }} />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        الحالة
                      </Typography>
                      <Typography variant="body1" fontWeight="bold">
                        {clientAds.status || "جاهز"}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      mb: 2,
                    }}
                  >
                    <VillaIcon color="primary" sx={{ fontSize: 28 }} />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        مفروش
                      </Typography>
                      <Typography variant="body1" fontWeight="bold">
                        {clientAds.furnished ? "نعم" : "لا"}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      mb: 2,
                    }}
                  >
                    <BusinessIcon color="primary" sx={{ fontSize: 28 }} />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        قابل للتفاوض
                      </Typography>
                      <Typography variant="body1" fontWeight="bold">
                        {clientAds.negotiable ? "نعم" : "لا"}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>

                {clientAds.paymentMethod && (
                  <Grid item xs={12} sm={6}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        mb: 2,
                      }}
                    >
                      <AttachMoneyIcon color="primary" sx={{ fontSize: 28 }} />
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          طريقة الدفع
                        </Typography>
                        <Typography variant="body1" fontWeight="bold">
                          {clientAds.paymentMethod}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                )}

                {clientAds.deliveryTerms && (
                  <Grid item xs={12}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        mb: 2,
                      }}
                    >
                      <HomeIcon color="primary" sx={{ fontSize: 28 }} />
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          شروط التسليم
                        </Typography>
                        <Typography variant="body1" fontWeight="bold">
                          {clientAds.deliveryTerms}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                )}
              </Grid>

              {/* مميزات العقار */}
              {clientAds.features && clientAds.features.length > 0 && (
                <>
                  <Divider sx={{ my: 4 }} />
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ color: "#6E00FE", mb: 3 }}
                  >
                    مميزات العقار
                  </Typography>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                    {clientAds.features.map((feature, index) => (
                      <Chip
                        key={index}
                        label={feature}
                        color="primary"
                        variant="outlined"
                        size="medium"
                        sx={{ borderRadius: "20px", fontSize: "14px" }}
                      />
                    ))}
                  </Box>
                </>
              )}
            </CardContent>
          </Paper>
        </Grid>
        {/* معلومات المطور - على اليسار */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper
            elevation={3}
            sx={{
              borderRadius: 3,
              height: "auto",
              position: "sticky",
              top: 100,
            }}
          >
            <CardContent sx={{ p: 4 }}>
              <Typography
                variant="h5"
                gutterBottom
                sx={{ color: "#6E00FE", mb: 3 }}
              >
                معلومات المطور
              </Typography>

              <Box
                sx={{ display: "flex", alignItems: "center", gap: 3, mb: 3 }}
              >
                <Avatar
                  alt={clientAds.developer_name}
                  src="/static/images/avatar/1.jpg"
                  sx={{ width: 60, height: 60 }}
                />
                <Box>
                  <Typography variant="h6" fontWeight="bold">
                    {clientAds.developer_name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    مطور عقاري معتمد
                  </Typography>
                </Box>
              </Box>

              <Divider sx={{ my: 3 }} />

              {/* أزرار التواصل */}
              <Box
                sx={{ display: "flex", flexDirection: "column", gap: 2, mb: 3 }}
              >
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
                  }}
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
                >
                  واتساب
                </Button>
              </Box>

              <Divider sx={{ my: 3 }} />

              <Box sx={{ textAlign: "center" }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  نوع العقار
                </Typography>
                <Typography
                  variant="body1"
                  fontWeight="bold"
                  sx={{ color: "#6E00FE" }}
                >
                  {clientAds.project_types?.join(" - ")}
                </Typography>
              </Box>
            </CardContent>
          </Paper>
        </Grid>
        {/* زر التعديل للمالك */}
        {isOwner && (
          <Box
            sx={{
              // position: 'fixed',
              top: 100,
              right: 20,
              zIndex: 1000,
            }}
          >
            <Button
              variant="contained"
              startIcon={<EditIcon />}
              onClick={handleEdit}
              sx={{
                backgroundColor: "#6E00FE",
                "&:hover": { backgroundColor: "#200D3A" },
                borderRadius: "25px",
                px: 3,
                boxShadow: "0px 4px 12px rgba(0,0,0,0.2)",
                flexDirection: "row-reverse",
                gap: 1.5,
                "& .MuiButton-startIcon": {
                  marginLeft: "12px",
                  marginRight: 0,
                },
              }}
            >
              تعديل الإعلان
            </Button>
          </Box>
        )}
      </Grid>
    </Container>
  );
}

export default DetailsForDevelopment;
