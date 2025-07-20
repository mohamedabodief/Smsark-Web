import React, { useState, useEffect } from 'react';
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
  DialogActions
} from '@mui/material';
import Message from '../../FireBase/MessageAndNotification/Message';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import {
  WhatsApp as WhatsAppIcon,
  FavoriteBorder as FavoriteBorderIcon,
  BookmarkBorder as BookmarkBorderIcon,
  OutlinedFlag as OutlinedFlagIcon,
  ShareOutlined as ShareOutlinedIcon
} from '@mui/icons-material';
import HomeIcon from '@mui/icons-material/Home';
import { useParams, Link, useNavigate } from 'react-router-dom';
import MapPicker from '../../LocationComponents/MapPicker';
import ClientAdvertisement from '../../FireBase/modelsWithOperations/ClientAdvertisemen';
import PhoneIcon from '@mui/icons-material/Phone';
import { db, auth } from '../../FireBase/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';

function DetailsForClient() {
  const currentUser = auth.currentUser?.uid;
  const { id } = useParams();
  const [clientAds, setClientAds] = useState(null);
  const [mainImage, setMainImage] = useState('');
  const [showFull, setShowFull] = useState(false);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // دالة لجلب اسم المستلم من مجموعة users
 const getReceiverName = async (userId) => {
  try {
    const userDoc = await getDoc(doc(db, "users", userId));
    if (userDoc.exists()) {
      const userData = userDoc.data();
      console.log(`Receiver data for ${userId}:`, userData);
      return userData.cli_name || "Unknown User"; // تغيير من name إلى cli_name
    }
    console.log(`No user document found for ${userId}`);
    return "Unknown User";
  } catch (err) {
    console.error(`Error fetching receiver name for ${userId}:`, err);
    return "Unknown User";
  }
};
  // جلب بيانات الإعلان
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

  // إرسال الرسالة
  const handleSend = async () => {
    if (!message.trim() || !currentUser || !clientAds?.userId) return;

    try {
      const receiverName = await getReceiverName(clientAds.userId);
      const newMessage = new Message({
        sender_id: currentUser,
        receiver_id: clientAds.userId,
        content: message,
        reciverName: receiverName, // استخدام الاسم الحقيقي
        timestamp: new Date(),
        is_read: false,
        message_type: 'text',
      });

      console.log('Sending message to:', { receiver_id: clientAds.userId, reciverName: receiverName });
      await newMessage.send();
      alert("تم إرسال الرسالة!");
      setMessage("");
      setOpen(false);
    } catch (error) {
      console.error("حدث خطأ أثناء الإرسال:", error);
      alert("فشل في إرسال الرسالة!");
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${clientAds.title}`,
          text: `${clientAds.description}`,
          url: window.location.href,
        });
        console.log('تمت المشاركة بنجاح');
      } catch (error) {
        console.error('حدث خطأ أثناء المشاركة:', error);
      }
    } else {
      alert('المتصفح لا يدعم خاصية المشاركة.');
    }
  };

  const pulse = keyframes`
    0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(37, 211, 102, 0.4); }
    70% { transform: scale(1.1); box-shadow: 0 0 0 10px rgba(37, 211, 102, 0); }
    100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(37, 211, 102, 0); }
  `;

  if (!clientAds) {
    return (
      <Box sx={{
        height: '100vh',
        width: '100vw',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        <CircularProgress sx={{ color: '#6E00FE' }} size={80} />
      </Box>
    );
  }

  const toggleShow = () => setShowFull((prev) => !prev);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* زر التواصل مع البائع */}
      <Box
        onClick={() => setOpen(true)}
        sx={{
          position: 'fixed',
          bottom: 20,
          right: 20,
          backgroundColor: '#1976d2',
          color: 'white',
          px: 2.5,
          py: 1,
          borderRadius: '30px',
          zIndex: 999,
          cursor: 'pointer',
          animation: `${pulse} 2s infinite`,
          transition: 'transform 0.3s',
          '&:hover': { transform: 'scale(1.05)' },
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0px 4px 12px rgba(0,0,0,0.2)',
        }}
      >
        <ChatBubbleOutlineIcon sx={{ fontSize: 22, mr: 1 }} />
        <Typography sx={{ fontWeight: 'bold', fontSize: '0.9rem' }}>
          تواصل مع البائع
        </Typography>
      </Box>
      <Dialog open={open} fullWidth dir='rtl' onClose={() => setOpen(false)}>
        <DialogTitle>تواصل مع البائع بكل سهوله</DialogTitle>
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

      {/* أزرار التفاعل + اسم الناشر */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: '100px' }}>
        <Box sx={{ mb: 5, display: 'flex', gap: 4 }}>
          <Box sx={{ display: 'flex', gap: 1, color: '#807AA6' }}>
            <Button><Typography fontWeight="bold">حفظ</Typography><FavoriteBorderIcon /></Button>
          </Box>
          <Box sx={{ display: 'flex', gap: 1, color: '#807AA6' }}>
            <Button><Typography fontWeight="bold">إبلاغ</Typography><OutlinedFlagIcon /></Button>
          </Box>
          <Box sx={{ display: 'flex', gap: 1, color: '#807AA6' }}>
            <Button onClick={handleShare}><Typography fontWeight="bold">مشاركة</Typography><ShareOutlinedIcon /></Button>
          </Box>
        </Box>
      </Box>

      {/* الصور الرئيسية والصغيرة */}
      <Box sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'column', lg: 'row' },
        gap: 2,
      }}>
        <Box sx={{ flex: 3, height: '500px' }}>
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
        }}>
          {clientAds?.images?.map((src, index) => (
            <Box
              key={index}
              onClick={() => setMainImage(src)}
              sx={{
                height: { xs: 90, md: 100, lg: 120 },
                cursor: 'pointer',
                border: mainImage === src ? '2px solid #1976d2' : 'none',
                borderRadius: '8px',
                overflow: 'hidden',
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

      <Box sx={{ height: '100%' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'row' }}>
          <Box width={'30%'} sx={{ marginRight: 'auto', textAlign: 'center', marginTop: '40px' }}>
            <Box sx={{ border: '1px solid #E7E5F4', borderRadius: '20px' }}>
              <Box sx={{ backgroundColor: '#F7F7F7', marginTop: '40px', marginBottom: '20px' }} width={'100%'} dir='rtl'>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" clipRule="evenodd" d="M3 5.5C3 4.67157 3.67157 4 4.5 4H19.5C20.3284 4 21 4.67157 21 5.5V14.5C21 15.3284 20.3284 16 19.5 16H4.5C3.67157 16 3 15.3284 3 14.5V5.5ZM4.5 5C4.22386 5 4 5.22386 4 5.5V14.5C4 14.7761 4.22386 15 4.5 15H19.5C19.7761 15 20 14.7761 20 14.5V5.5C20 5.22386 19.7761 5 19.5 5H4.5ZM6 7H6.5H8V8H7V9H6V7.5V7ZM17 8H16V7H17.5H18V7.5V9H17V8ZM9.5 10C9.5 8.61929 10.6193 7.5 12 7.5C13.3807 7.5 14.5 8.61929 14.5 10C14.5 11.3807 13.3807 12.5 12 12.5C10.6193 12.5 9.5 11.3807 9.5 10ZM12 8.5C11.1716 8.5 10.5 9.17157 10.5 10C10.5 10.8284 11.1716 11.5 12 11.5C12.8284 11.5 13.5 10.8284 13.5 10C13.5 9.17157 12.8284 8.5 12 8.5ZM6 12.5V11H7V12H8V13H6.5H6V12.5ZM18 11V12.5V13H17.5H16V12H17V11H18ZM3 17.5C3 17.2239 3.22386 17 3.5 17H20.5C20.7761 17 21 17.2239 21 17.5C21 17.7761 20.7761 18 20.5 18H3.5C3.22386 18 3 17.7761 3 17.5ZM3.5 19C3.22386 19 3 19.2239 3 19.5C3 19.7761 3.22386 20 3.5 20H20.5C20.7761 20 21 19.7761 21 19.5C21 19.2239 21 19 20.5 19H3.5Z" fill="currentColor"></path>
                </svg>
                <Typography>طريقة الدفع</Typography>
                <Typography>نقدا أو تقسيط</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: '8px', marginBottom: '20px' }} padding={"10px 10px"}>
                <Button sx={{ backgroundColor: '#DF3631', width: '50%' }} onClick={() => {
                  const phoneNumber = clientAds.phone;
                  window.open(`tel:${phoneNumber}`, '_self');
                }}>
                  <Typography sx={{ color: 'white', mx: '5px', fontSize: '18px', fontWeight: 'bold' }}>اتصل</Typography>
                  <PhoneIcon sx={{ color: 'white' }} />
                </Button>
                <Button sx={{ backgroundColor: '#4DBD43', width: '50%' }} onClick={() => {
                  const phoneNumber = clientAds.phone;
                  const message = 'مرحبًا، أريد الاستفسار عن الإعلان الخاص بك';
                  const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
                  window.open(url, '_blank');
                }}>
                  <Typography sx={{ color: 'white', mx: '5px', fontSize: '18px', fontWeight: 'bold' }}>واتساب</Typography>
                  <WhatsAppIcon sx={{ color: 'white' }} />
                </Button>
              </Box>
            </Box>
          </Box>

          {/* بيانات الإعلان */}
          <Box dir="rtl" sx={{ mt: 6, width: '50%', textAlign: 'right', marginLeft: 'auto' }}>
            <Typography variant="h4" fontWeight="bold">{clientAds.title}</Typography>
            <Typography sx={{
              mt: 3,
              fontSize: '17px',
              overflow: 'hidden',
              display: '-webkit-box',
              WebkitLineClamp: showFull ? 'none' : 3,
              WebkitBoxOrient: 'vertical',
            }}>
              {clientAds.description || 'لا يوجد وصف'}
            </Typography>
            {clientAds.description?.length > 100 && (
              <button
                className='details-button'
                onClick={toggleShow}
                style={{
                  marginTop: '10px',
                  border: '1px solid #8C84CC',
                  color: '#8C84CC',
                  borderRadius: '8px',
                  backgroundColor: 'transparent',
                  padding: '10px 20px',
                  fontWeight: 'bold',
                  fontSize: '14px',
                }}
              >
                {showFull ? 'إخفاء التفاصيل' : 'عرض المزيد'}
              </button>
            )}
          </Box>
        </Box>

        {/* العنوان بالتفاصيل */}
        <Typography sx={{ mt: 5, fontWeight: 'bold' }} variant="h5" dir='rtl'>
          العنوان
        </Typography>
        <Breadcrumbs
          aria-label="breadcrumb"
          sx={{ my: 6 }}
          dir="rtl"
          separator="›"
        >
          <Link to="/" style={{ color: 'inherit', display: 'flex', alignItems: 'center', fontWeight: 'bold', textDecoration: 'none' }}>
            <HomeIcon sx={{ ml: 1 }} /> الرئيسية
          </Link>
          {clientAds.governorate && <Typography fontWeight="bold">{clientAds.governorate}</Typography>}
          {clientAds.address && <Typography fontWeight="bold">{clientAds.address}</Typography>}
        </Breadcrumbs>

        {/* تفاصيل الموقع والخريطة */}
        <Box sx={{
          dir: 'rtl',
          mt: 4,
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          gap: 4,
          alignItems: 'stretch',
          marginLeft: 'auto'
        }}>
          <Box sx={{ width: '50%', display: 'flex' }} dir='rtl'>
            <Box sx={{ backgroundColor: '#F7F7FC', display: 'flex', gap: '30px', height: '20%', width: '100%', padding: '20px', borderRadius: '10px' }}>
              <Avatar alt={`${clientAds.user_name}`} src="/static/images/avatar/1.jpg" />
              <Typography sx={{ fontSize: '20px' }}>نشر بواسطة: {clientAds.user_name}</Typography>
            </Box>
          </Box>
          <Box
            sx={{
              flex: 1,
              minHeight: '300px',
              width: '50%',
              borderRadius: '16px',
              overflow: 'hidden',
              boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
              border: '1px solid #e0e0e0',
            }}
          >
            <MapPicker
              lat={clientAds.latitude}
              lng={clientAds.longitude}
            />
          </Box>
        </Box>
      </Box>
      <Button
        variant="contained"
        color="primary"
        sx={{ mt: 3 }}
        onClick={() => navigate('/AddAdvertisement')}
      >
        اضف اعلانك الان
      </Button>
    </Container>
  );
}

export default DetailsForClient;










