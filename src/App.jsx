import React, { useEffect, useState } from "react";
import { Route, Routes, useNavigate, } from "react-router-dom";
import DetailsForClient from "./pages/Details/detailsForClient";
import DetailsForFinancingAds from "./pages/Details/detailsForFinaccingAds";
import DetailsForDevelopment from "./pages/Details/detailsForDevelopment";
import Layout from "./Layout/Layout";
import Home from "./componenents/Home";
import ChatAiPage from "./Homeparts/ChatAiPage";
import Footer from "./componenents/Footer";
import Favorite from "./componenents/Favorite";
import FinancingAdvExample from "./Homeparts/FinancingAdvExample";
import RealEstateDevAdvExample from "./Homeparts/RealEstateDevAdvExample";
import AddFinancingAdForm from "./services/AddFinancingAdForm";
import FinancingRequestForm from "./services/FinancingRequestForm";
import LoginRegister from "./LoginAndRegister/modulesLR/LoginRegister";
import PropertyPage from "./RealEstateDeveloperAnnouncement/PropertyPage";
import AboutUs from "./aboutUs/AboutUs";
import { SearchProvider } from "./context/searchcontext";
import SellAds from "./services/sell";
import DeveloperAdsPage from "./services/developmentAds";
import RentAds from "./services/rent";
import BuyAds from "./services/buy";
import FinancingAdsPage from "./services/finance";
import ModernRealEstateForm from "./pages/ModernRealEstateForm";
import InboxChats from "./pages/InboxChats";
import ChatBox from "./pages/privechat";
import Profile from "./componenents/profile";
import { Snackbar, Alert, Button } from '@mui/material';
import Notification from "./FireBase/MessageAndNotification/Notification";
import SearchPage from "./pages/SearchPage";
import ContactUs from "./contactUs/ContactUs";
import { Navigate } from 'react-router-dom';
import AdPackages from "../packages/packagesDev&Fin";
import AdPackagesClient from "../packages/packagesClient";
import AdminDashboard from "./Dashboard/adminDashboard";
import ClientDashboard from "./Dashboard/clientDashboard";
import OrganizationDashboard from "./Dashboard/organization/organizationDashboard";
import PrivateRoute from "./PrivateRoute";
import AuthSync from "./AuthSync";
// import RequireNotAuth from "./LoginAndRegister/RequireNotAuth";


import { onMessage, messaging, auth } from "./FireBase/firebaseConfig";
import { requestPermissionAndSaveToken } from "./FireBase/MessageAndNotification/fcmHelper";
import { onAuthStateChanged } from "firebase/auth";
import CloseIcon from '@mui/icons-material/Close';
import RegistrationSuccess from "./LoginAndRegister/componentsLR/RegistrationSuccess";
function App() {
  const [notifications, setNotifications] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [currentNotification, setCurrentNotification] = useState(null);
  const [currentUser, setCurrentUser] = useState(null); // استخدام useState
  const navigate = useNavigate();
  ////////////////////////////////////////////////
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log("Auth state changed:", user ? user.uid : "No user");
      setUser(user);
      setLoading(false);
    });

    requestPermissionAndSaveToken();

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
      }
    });

    return () => unsubscribe();
  }, []);
  ///////////////////////////////
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);
  useEffect(() => {
    if (currentUser) {
      const unsubscribe = Notification.subscribeByUser(currentUser.uid, (notifs) => {
        const newNotifs = notifs.filter(n => !n.is_read);
        if (newNotifs.length > notifications.length) {
          const latestNotif = newNotifs[newNotifs.length - 1];
          setCurrentNotification(latestNotif);
          setOpenSnackbar(true);
        }
        setNotifications(newNotifs);
      });

      return () => unsubscribe();
    }
  }, [currentUser]);
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
    if (currentNotification) {
      Notification.markAsRead(currentNotification.id);
    }
  };

  //////////////////////////////


  if (loading) return null;

  return (
    <>
      <AuthSync />
      <SearchProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
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
            <Route path="/insert-finance-data" element={<FinancingAdvExample />} />
            <Route path="/insert-dev-data" element={<RealEstateDevAdvExample />} />
            <Route path="/financing-request" element={<FinancingRequestForm />} />
            <Route path="/AddAdvertisement" element={<ModernRealEstateForm />} />
            {/* صفحات الداشبورد */}
            <Route element={<PrivateRoute />}>
              <Route path="/admin-dashboard" element={<AdminDashboard />} />
              <Route path="/client-dashboard" element={<ClientDashboard />} />
              <Route path="/organization-dashboard" element={<OrganizationDashboard />} />
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
              <Route path="clientAds/:id" element={<DetailsForClient />} />
              <Route path="developmentAds/:id" element={<DetailsForDevelopment />} />
            </Route>
          </Routes>
          {/* <Footer /> */}
        </Layout>
      </SearchProvider>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          severity="info"
          action={
            <>
              <Button color="inherit" size="small" onClick={handleOpenChat}>
                فتح
              </Button>
              <Button color="inherit" size="small" onClick={handleCloseSnackbar}>
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
    </>
  );
}

export default App;
