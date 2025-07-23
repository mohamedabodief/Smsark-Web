import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  keyframes,
  CircularProgress,
  Button,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Paper,
  CardContent,
  Grid,
  Divider,
  Alert
} from '@mui/material';
import {
  WhatsApp as WhatsAppIcon,
  FavoriteBorder as FavoriteBorderIcon,
  BookmarkBorder as BookmarkBorderIcon,
  OutlinedFlag as OutlinedFlagIcon,
  ShareOutlined as ShareOutlinedIcon,
  Edit as EditIcon,
  Phone as PhoneIcon
} from '@mui/icons-material';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import { useParams, Link, useNavigate } from 'react-router-dom';
import FinancingAdvertisement from '../../FireBase/modelsWithOperations/FinancingAdvertisement';
import { auth } from '../../FireBase/firebaseConfig';

function DetailsForFinaccingAds() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const { id } = useParams();
  const [clientAds, setClientAds] = useState(null);
  const [mainImage, setMainImage] = useState('');
  const [showFull, setShowFull] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const currentUser = auth.currentUser?.uid;

  useEffect(() => {
    const fetchAd = async () => {
      try {
        setError(null);
        const ad = await FinancingAdvertisement.getById(id);
        if (ad) {
          setClientAds(ad);
          if (Array.isArray(ad.images) && ad.images.length > 0) {
            setMainImage(ad.images[0]);
          }
        } else {
          setError("الإعلان غير موجود");
        }
      } catch (err) {
        setError("حدث خطأ في تحميل بيانات الإعلان");
      }
    };
    if (id) fetchAd();
  }, [id]);

  const isOwner = auth.currentUser?.uid && clientAds?.userId && auth.currentUser.uid === clientAds.userId;
  // Debug
  console.log('auth.currentUser?.uid:', auth.currentUser?.uid);
  console.log('clientAds?.userId:', clientAds?.userId);
  console.log('isOwner:', isOwner);
  const toggleShow = () => setShowFull((prev) => !prev);

  if (error) {
    return (
      <Box sx={{ height: '100vh', width: '100vw', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 2 }}>
        <Typography variant="h5" color="error" gutterBottom>{error}</Typography>
        <Button variant="contained" onClick={() => navigate('/services/finance')} sx={{ backgroundColor: "#6E00FE" }}>العودة للصفحة الرئيسية</Button>
      </Box>
    );
  }

  if (!clientAds) {
    return (
      <Box sx={{ height: '100vh', width: '100vw', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <CircularProgress sx={{ color: '#6E00FE' }} size={80} />
      </Box>
    );
  }

  // --- عرض صورة الإعلان الرئيسية وصور المعاينة ---
  const validImages = Array.isArray(clientAds?.images) ? clientAds.images.filter(img => typeof img === 'string' && (img.startsWith('http') || img.startsWith('https'))) : [];
  const mainImg = mainImage || validImages[0] || '/no-image.svg';

  return (
    <Container maxWidth="lg" dir="rtl">
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


      <Paper elevation={3} sx={{ mb: 4, borderRadius: 3, overflow: "hidden" }}>
        <CardContent>
          <Grid spacing={4}>



            {/* صورة الإعلان */}
            <Box sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'column', lg: 'row' },
              gap: 2,
              mb: 4,
            }}>
              <Box sx={{ flex: 3, height: '500px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f7f7f7', borderRadius: 3 }}>
                <img
                  src={mainImage || 'https://via.placeholder.com/800x500'}
                  alt="Main"
                  style={{ width: '100%', height: '100%', borderRadius: '8px', objectFit: 'cover' }}
                />
              </Box>
              <Box sx={{
                flex: 1,
                display: 'flex',
                flexDirection: { xs: 'row', md: 'row', lg: 'column' },
                gap: 1,
                mt: { xs: 2, md: 2, lg: 0 },
                height: { lg: '100%' },
                justifyContent: 'center',
              }}>
                {clientAds?.images?.map((src, index) => (
                  <Box
                    key={index}
                    onClick={() => setMainImage(src)}
                    sx={{
                      height: { xs: 90, md: 100, lg: 120 },
                      width: { xs: 90, md: 100, lg: 120 },
                      cursor: 'pointer',
                      border: mainImage === src ? '2px solid #1976d2' : '1px solid #e0e0e0',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      transition: 'all 0.3s',
                      '&:hover': { transform: 'scale(1.05)' },
                    }}
                  >
                    <img
                      src={src}
                      alt={`img-${index}`}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </Box>
                ))}
              </Box>
            </Box>









            <Grid container spacing={4}>

              {/* بيانات الإعلان */}
              <Grid size={{ xs: 12, md: 8 }}>
                <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ color: "#6E00FE", mb: 3 }}>{clientAds.title}</Typography>
                <Typography sx={{ fontSize: '18px', lineHeight: 1.8, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: showFull ? 'none' : 4, WebkitBoxOrient: 'vertical', mb: 3, color: '#333' }}>{clientAds.description || 'لا يوجد وصف متاح'}</Typography>
                {clientAds.description && clientAds.description.length > 200 && (
                  <Button onClick={toggleShow} sx={{ border: '2px solid #6E00FE', color: '#6E00FE', borderRadius: '25px', backgroundColor: 'transparent', '&:hover': { backgroundColor: '#f0f0f0' }, px: 3, mb: 3 }}>{showFull ? 'إخفاء التفاصيل' : 'عرض المزيد'}</Button>
                )}
                <Divider sx={{ my: 3 }} />
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">الجهة</Typography>
                      <Typography variant="body1" fontWeight="bold">{clientAds.org_name}</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <PhoneIcon color="primary" sx={{ fontSize: 22 }} />
                      <Typography variant="body2" color="text.secondary">رقم الهاتف</Typography>
                      <Typography variant="body1" fontWeight="bold">{clientAds.phone}</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">السعر من</Typography>
                      <Typography variant="body1" fontWeight="bold">{clientAds.start_limit} ج.م</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">السعر إلى</Typography>
                      <Typography variant="body1" fontWeight="bold">{clientAds.end_limit} ج.م</Typography>
                    </Box>
                  </Grid>
                  {clientAds.adPackage && (
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">الباقة المختارة</Typography>
                      <Typography variant="body1" fontWeight="bold" color="primary">
                        {String(clientAds.adPackage) === "1" ? 'باقة الأساس' : String(clientAds.adPackage) === "2" ? 'باقة النخبة' : String(clientAds.adPackage) === "3" ? 'باقة التميز' : clientAds.adPackage}
                      </Typography>
                    </Grid>
                  )}
                  <Grid item xs={12} sm={12}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">نسب الفائدة:</Typography>
                      <Typography variant="body1" fontWeight="bold">حتى 5 سنوات: {clientAds.interest_rate_upto_5}% | حتى 10 سنوات: {clientAds.interest_rate_upto_10}% | أكثر من 10 سنوات: {clientAds.interest_rate_above_10}%</Typography>
                    </Box>
                  </Grid>
                </Grid>
                <Divider sx={{ my: 3 }} />
                <Box sx={{ width: '50%', display: 'flex', marginTop: '30px', marginLeft: 'auto' }} dir='rtl'>
                  <Box sx={{ backgroundColor: '#F7F7FC', display: 'flex', gap: '30px', height: '20%', width: '100%', padding: '20px', borderRadius: '10px' }}>
                    <Avatar alt={`${clientAds.org_name}`} src="/static/images/avatar/1.jpg" />
                    <Typography sx={{ fontSize: '20px', }}>نشر بواسطة: {clientAds.org_name}</Typography>
                  </Box>
                </Box>

              </Grid>
              {/* معلومات الممول - على اليسار */}
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
                      معلومات الممول
                    </Typography>

                    <Box
                      sx={{ display: "flex", alignItems: "center", gap: 3, mb: 3 }}
                    >
                      <Avatar
                        alt={clientAds.org_name}
                        src="/static/images/avatar/1.jpg"
                        sx={{ width: 60, height: 60 }}
                      />
                      <Box>
                        <Typography variant="h6" fontWeight="bold">
                          {clientAds.org_name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          ممول عقاري معتمد
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

                    {/* <Box sx={{ textAlign: "center" }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  نوع العقار
                </Typography>
                <Typography
                  variant="body1"
                  fontWeight="bold"
                  sx={{ color: "#6E00FE" }}
                >
                  {clientAds.financing_model?.join(" - ")}
                </Typography>
              </Box> */}
                  </CardContent>
                </Paper>
              </Grid>
            </Grid>
          </Grid>
        </CardContent>
      </Paper>
      {/* أزرار التفاعل */}
      {isOwner && (
        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-start' }}>
          <Button
            variant="contained"
            startIcon={<EditIcon />}
            onClick={() => navigate('/add-financing-ad', { state: { editMode: true, adData: clientAds } })}
            sx={{
              backgroundColor: "#6E00FE",
              "&:hover": { backgroundColor: "#200D3A" },
              boxShadow: "0px 4px 12px rgba(0,0,0,0.2)",
              flexDirection: "row-reverse",
              gap: 1.5,
              "& .MuiButton-startIcon": {
                marginLeft: "12px",
                marginRight: 0,
              },
              borderRadius: '15px',
              fontWeight: 'bold',
              py: 1.5,
              mr: 2,
              mb: 0.5,
              width: '20%',
              justifyContent: 'center'

            }}
          >
            تعديل الإعلان
          </Button>
        </Box>
      )}
      {/* زر انشاء طلب تمويل */}
      <Button
        variant="contained"
        color="primary"
        sx={{
          borderRadius: '15px', fontWeight: 'bold', px: 5, py: 1.5, mr: 2, mb: 2, width: '20%', justifyContent: 'center', backgroundColor: "#6E00FE",
          "&:hover": { backgroundColor: "#200D3A" },
        }}
        onClick={() => navigate('/financing-request', { state: { advertisementId: id, adData: clientAds } })}
      >
        انشاء طلب تمويل
      </Button>
    </Container>
  );
}

export default DetailsForFinaccingAds;