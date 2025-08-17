import React, { useEffect, useState, useMemo } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import DetailsForClient from "./pages/Details/detailsForClient";
import DetailsForFinancingAds from "./pages/Details/detailsForFinaccingAds";
import DetailsForDevelopment from "./pages/Details/detailsForDevelopment";
import Layout from "./Layout/Layout";
import Home from "./componenents/Home";
import ChatAiPage from "./Homeparts/ChatAiPage";
import Footer from "./componenents/Footer";
import Favorite from "./componenents/Favorite";
// import FinancingAdvExample from "./Homeparts/FinancingAdvExample";
// import RealEstateDevAdvExample from "./Homeparts/RealEstateDevAdvExample";
import AddFinancingAdForm from "./services/AddFinancingAdForm";
import FinancingRequestForm from "./services/FinancingRequestForm";
import LoginRegister from "./LoginAndRegister/modulesLR/LoginRegister";
import PropertyPage from "./RealEstateDeveloperAnnouncement/PropertyPage";
import AboutUs from "./aboutUs/AboutUs";
import SellAds from "./services/sell";
import DeveloperAdsPage from "./services/developmentAds";
import RentAds from "./services/rent";
import BuyAds from "./services/buy";
import FinancingAdsPage from "./services/finance";
import ModernRealEstateForm from "./pages/ModernRealEstateForm";
import InboxChats from "./pages/InboxChats";
import ChatBox from "./pages/privechat";
import Profile from "./componenents/profile";
import { Snackbar, Alert, Button, Dialog, DialogTitle, DialogContent, DialogActions, CircularProgress, Box, Typography } from '@mui/material';
import NotificationService from "./FireBase/MessageAndNotification/Notification";
import SearchPage from "./pages/SearchPage";
import ContactUs from "./contactUs/ContactUs";
import { Navigate } from 'react-router-dom';
import AdPackages from "../packages/packagesDevAndFin";
import AdPackagesClient from "../packages/packagesClient";
import AdminDashboard from "./Dashboard/adminDashboard";
import ClientDashboard from "./Dashboard/clientDashboard";
import OrganizationDashboard from "./Dashboard/organization/organizationDashboard";
import Analytics from "./pages/Analytics";
import PrivateRoute from "./PrivateRoute";
import AuthSync from "./AuthSync";
import DashboardGuard from "./Dashboard/DashboardGuard";
// import RequireNotAuth from "./LoginAndRegister/RequireNotAuth";
import { Fab } from '@mui/material';
import { FaRobot } from 'react-icons/fa';
import { useLocation } from 'react-router-dom';
import { onMessage, messaging, auth } from "./FireBase/firebaseConfig";

import { requestPermissionAndSaveToken } from "./FireBase/MessageAndNotification/fcmHelper";
import { onAuthStateChanged } from "firebase/auth";
import CloseIcon from '@mui/icons-material/Close';
import RegistrationSuccess from "./LoginAndRegister/componentsLR/RegistrationSuccess";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { SearchProvider } from "./context/searchcontext";
import { useSelector } from 'react-redux';
import { ThemeProvider } from "./context/ThemeContext";

// Dashboard Router Component - Only for admin users
function DashboardRouter() {
  const authUid = useSelector((state) => state.auth.uid);
  const authUserType = useSelector((state) => state.auth.type_of_user);
  const userProfile = useSelector((state) => state.user.profile);
  const userProfileStatus = useSelector((state) => state.user.status);
  const navigate = useNavigate();

  // Show loading while profile is being fetched
  if (userProfileStatus === 'loading') {
    return (
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        gap: 2
      }}>
        <CircularProgress size={60} />
        <Typography variant="h6" color="text.secondary">
          جاري تحميل لوحة التحكم...
        </Typography>
      </Box>
    );
  }

  // Only admin users should access dashboard routes
  if (userProfile?.type_of_user === 'admin' || authUserType === 'admin') {
    return <Navigate to="/admin-dashboard" replace />;
  }
  
  // For non-admin users, redirect to home page
  return <Navigate to="/home" replace />;
}

function App() {
  const [notifications, setNotifications] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [currentNotification, setCurrentNotification] = useState(null);
  const [currentUser, setCurrentUser] = useState(null); // استخدام useState
  const navigate = useNavigate();
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [openPermissionDialog, setOpenPermissionDialog] = useState(false);
  const [permissionChecked, setPermissionChecked] = useState(false);

  ////////////////////////////////////////////////
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
 ////////////////////////////////////////////////////
  const notificationSound = new Audio('/sounds/not.mp3');
  const goToChat = () => {
    navigate('/chat');
  };
  const location = useLocation();
  const hiddenFabRoutes = [
    '/chat',
    '/login',
    '/register',
  ];

  const isFabHidden = hiddenFabRoutes.includes(location.pathname) || location.pathname.startsWith('/details') ||
  location.pathname.startsWith('/privateChat');

  // First useEffect: Check notification permission and auth state
  useEffect(() => {
    const checkNotificationPermission = () => {
      if (!permissionChecked && "Notification" in window) {
        if (Notification.permission === "granted") {
          setSoundEnabled(true);
          setPermissionChecked(true);
          console.log("الإشعارات مفعلة مسبقًا، تم تفعيل الصوت");
        } else if (Notification.permission !== "granted") {
          setOpenPermissionDialog(true);
          setPermissionChecked(true);
        }
      } else if (!("Notification" in window)) {
        console.warn("الإشعارات غير مدعومة في هذا المتصفح");
        setSoundEnabled(true);
        setPermissionChecked(true);
      }
    };
    checkNotificationPermission();
    requestPermissionAndSaveToken();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log("Auth state changed:", user ? user.uid : "No user");
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);
  useEffect(() => {
    onMessage(messaging, (payload) => {
      console.log("📩 إشعار مستلم:", payload);
      const { title, body } = payload.notification || {};
      if (
        title &&
        body &&
        "Notification" in window &&
        Notification.permission === "granted"
      ) {
        new Notification(title, { body });
        if (soundEnabled) {
          notificationSound.play().catch((error) => {
            console.error("خطأ في تشغيل صوت الإشعار:", error);
          });
        }
      }
    });
  }, [soundEnabled]);
  useEffect(() => {
    if (currentUser) {
      const unsubscribe = NotificationService.subscribeByUser(currentUser.uid, (notifs) => {
        const newNotifs = notifs.filter(n => !n.is_read);
        if (newNotifs.length > notifications.length) {
          const latestNotif = newNotifs[newNotifs.length - 1];
          setCurrentNotification(latestNotif);
          setOpenSnackbar(true);
          if (soundEnabled) {
            notificationSound.play().catch((error) => {
              console.error("خطأ في تشغيل صوت الإشعار:", error);
            });
          }
        }
        setNotifications(newNotifs);
      });
      return () => unsubscribe();
    }
  }, [currentUser, soundEnabled]);
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);
  ///////////
  const handleEnableNotifications = async () => {
    if ("Notification" in window && Notification.permission !== "granted") {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        setSoundEnabled(true);
        toast.dismiss();
        notificationSound.play().catch((error) => {
          console.error("خطأ في تشغيل صوت الإشعار:", error);
        });
      }
    } else {
      setSoundEnabled(true);
      toast.dismiss();
      notificationSound.play().catch((error) => {
        console.error("خطأ في تشغيل صوت الإشعار:", error);
      });
    }
  };

  const handleOpenChat = () => {
    if (currentNotification?.link) {
      const userId = currentNotification.link.split('/privateChat/')[1];
      navigate(`/privateChat/${userId}`, {
        state: { otherUser: { userId, userName: currentNotification.title.split('من ')[1] || 'مستخدم غير معروف' } }
      });
      handleCloseSnackbar();
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const handleMarkAsRead = async () => {
    setOpenSnackbar(false);
    if (currentNotification) {
      NotificationService.markAsRead(currentNotification.id);
    }
  };

  if (loading) return null;

  return (
    <>
      <AuthSync />
      <ThemeProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Navigate to="/home" replace />} />
            <Route path="/home" element={<Home />} />
             {/* <Route path="/" element={<Navigate to="/login" replace />} /> */}
             <Route path="/home" element={<Home />} />
               {/* صفحات الدخول والتسجيل */}
            <Route path="login" element={<LoginRegister />} />
            <Route path="register" element={<LoginRegister />} />
            <Route path="/registration-success" element={<RegistrationSuccess />} />
             {/* صفحات عامة */}
            <Route path="/about" element={<AboutUs />} />
            <Route path="/contact" element={<ContactUs />} />
            <Route path="/favorite" element={<Favorite />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/inbox" element={<InboxChats />} />
            <Route path="/privateChat/:id" element={<ChatBox />} />
              {/* خدمات الإعلانات */}
            <Route path="/services/sell" element={<SellAds />} />
            <Route path="/services/rent" element={<RentAds />} />
            <Route path="/services/buy" element={<BuyAds />} />
            <Route path="/services/finance" element={<FinancingAdsPage />} />

            <Route path="/chat" element={<ChatAiPage />} />
                    {/* <AddMultipleAdsOnce/> */}
            <Route path="/services/developmentAds" element={<DeveloperAdsPage />} />
              {/* صفحات الإعلانات العقارية */}
            <Route path="/RealEstateDeveloperAnnouncement" element={<PropertyPage />} />
            <Route path="/AdddeveloperAds" element={<PropertyPage />} />
               {/* صفحات الباقات */}
            <Route path="/packages" element={<AdPackages />} />
            <Route path="/Client-packages" element={<AdPackagesClient />} />
             {/* صفحات الإدخال والنماذج */}
            <Route path="/add-financing-ad" element={<AddFinancingAdForm />} />
             {/* <Route path="/insert-finance-data" element={<FinancingAdvExample />} /> */}
            {/* <Route path="/insert-dev-data" element={<RealEstateDevAdvExample />} /> */}
            <Route path="/financing-request" element={<FinancingRequestForm />} />
            <Route path="/AddAdvertisement" element={<ModernRealEstateForm />} />
            {/* صفحات الداشبورد */}
            <Route element={<PrivateRoute />}>
              <Route path="/dashboard" element={<DashboardRouter />} />
              <Route path="/admin-dashboard" element={<DashboardGuard><AdminDashboard /></DashboardGuard>} />
              <Route path="/client-dashboard" element={<ClientDashboard />} />
              <Route path="/organization-dashboard" element={<OrganizationDashboard />} />
              <Route path="/analytics" element={<Analytics />} />
            </Route>
                {/* صفحات التفاصيل */}
            <Route path="/detailsForDevelopment/:id" element={<DetailsForDevelopment />} />
            <Route path="/detailsForDevelopment" element={<Navigate to="/RealEstateDeveloperAnnouncement" replace />} />
            <Route path="/details/financingAds/:id" element={<DetailsForFinancingAds />} />
            <Route path="/details/clientAds/:id" element={<DetailsForClient />} />
            <Route path="/details/developmentAds/:id" element={<DetailsForDevelopment />} />
            <Route path="/detailsForClient/:id" element={<DetailsForClient />} />
                {/* صفحات التفاصيل القديمة (للتوافق) */}
            <Route path="details">
              <Route path="financingAds/:id" element={<DetailsForFinancingAds />} />
                {/* <Route path="clientAds/:id" element={<DetailsForClient />} /> */}
              <Route path="developmentAds/:id" element={<DetailsForDevelopment />} />
            </Route>
          </Routes>
          {/* <Footer /> */}
        </Layout>
        <Snackbar
          autoHideDuration={10000}
          open={openSnackbar}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert
            severity="info"
            action={
              <>
                <Button color="inherit" size="small" sx={{ fontWeight: 'bold', fontSize: '18px' }} onClick={handleMarkAsRead}>
                  تحديد كمقروء
                </Button>
                <Button color="inherit" size="small" sx={{ fontWeight: 'bold', fontSize: '18px' }} onClick={handleCloseSnackbar}>
                  إغلاق
                </Button>
              </>
            }
            sx={{
              width: '100%',
              maxWidth: '400px',
              textAlign: 'right',
              backgroundColor: '#ffffff',
              borderRadius: '8px',
              padding: '16px',
              fontSize: '20px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              '& .MuiAlert-icon': {
                marginRight: '12px',
              },
              '& .MuiAlert-message': {
                padding: '8px 0',
              },
            }}
          >
            <strong>{currentNotification?.title}</strong>
            <br />
            {currentNotification?.body}
          </Alert>
        </Snackbar>
        <Dialog open={openPermissionDialog} onClose={() => setOpenPermissionDialog(false)}>
          <DialogTitle>🔔 تفعيل إشعارات الصوت</DialogTitle>
          <DialogContent>
            هل ترغب في تفعيل  صوت الإشعارات حتى يتم إعلامك بالتحديثات؟
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenPermissionDialog(false)} color="error">
              لا، شكرًا
            </Button>
            <Button
              onClick={async () => {
                try {
                  if ("Notification" in window) {
                    const permission = await Notification.requestPermission();
                    console.log("حالة إذن الإشعارات:", permission);
                    if (permission === "granted") {
                      setSoundEnabled(true);
                      await notificationSound.play();
                      console.log("تم تشغيل الصوت بنجاح بعد منح الإذن");
                    } else {
                      console.log("تم رفض إذن الإشعارات أو إغلاق النافذة");
                      setSoundEnabled(true);
                      await notificationSound.play().catch(err => {
                        console.error("فشل تشغيل الصوت بعد الرفض:", err);
                      });
                    }
                  } else {
                    console.warn("الإشعارات غير مدعومة في هذا المتصفح");
                    setSoundEnabled(true);
                    await notificationSound.play().catch(err => {
                      console.error("فشل تشغيل الصوت:", err);
                    });
                  }
                } catch (err) {
                  console.error("خطأ في طلب إذن الإشعارات أو تشغيل الصوت:", err);
                } finally {
                  setOpenPermissionDialog(false);
                }
              }}
              color="primary"
              autoFocus
            >
              نعم، فعّل الإشعارات
            </Button>
          </DialogActions>
        </Dialog>
        {!isFabHidden && (
          <Box
            sx={{
              position: 'fixed',
              bottom: 16,
              right: 16,
              zIndex: 9999
            }}
          >
            <Fab
              color="primary"
              onClick={goToChat}
              aria-label="Chat"
              sx={{ backgroundColor: '#6E00FE', color: '#fff' }}
            >
              <FaRobot size={24} />
            </Fab>
          </Box>
        )}
      </ThemeProvider>
    </>
  );
}

export default App;