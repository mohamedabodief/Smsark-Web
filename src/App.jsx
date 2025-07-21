import React, { useEffect, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import DetailsForClient from "./pages/Details/detailsForClient";
import DetailsForFinincingAds from "./pages/Details/detailsForFinaccingAds";
import SearchPage from "./pages/SearchPage";
import DetailsForDevelopment from "./pages/Details/detailsForDevelopment";
import Layout from "./Layout/Layout";
import Home from "./componenents/Home";
import Footer from "./componenents/Footer";
// import Sell from "./services/sell";
import Favorite from "./componenents/Favorite";
import FinancingAdvExample from "./Homeparts/FinancingAdvExample";
import RealEstateDevAdvExample from "./Homeparts/RealEstateDevAdvExample";
import AddFinancingAdForm from "./services/AddFinancingAdForm";
import FinancingRequestForm from "./services/FinancingRequestForm";
import { onMessage } from "./FireBase/firebaseConfig";
import { messaging } from "./FireBase/firebaseConfig";
import { requestPermissionAndSaveToken } from "./FireBase/MessageAndNotification/fcmHelper";
import LoginRegister from "./LoginAndRegister/modulesLR/LoginRegister";
import { Navigate } from "react-router-dom";
import PropertyPage from "./RealEstateDeveloperAnnouncement/PropertyPage";
import AboutUs from "./aboutUs/AboutUs";
import { SearchProvider } from "./context/searchcontext";
import SellAds from "./services/sell";
import DeveloperAdsPage from "./services/developmentAds";
import RentAds from "./services/rent";
import buyAds from "./services/buy"
import FinancingAdsPage from "./services/finance";
import ModernRealEstateForm from "./pages/ModernRealEstateForm";
import InboxChats from "./pages/InboxChats";
import ChatBox from "./pages/privechat";
// import DeveloperAdsPage from "./services/developmentAds";
import Profile from "./componenents/profile";
import { Snackbar, Alert, Button } from '@mui/material';
import Notification from "./FireBase/MessageAndNotification/Notification";
import { auth } from "./FireBase/firebaseConfig";

function App() {
  const [notifications, setNotifications] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [currentNotification, setCurrentNotification] = useState(null);
  const [currentUser, setCurrentUser] = useState(null); // استخدام useState
  const navigate = useNavigate();
  ////////////////////////////////////////////////
  useEffect(() => {
    // ✅ طلب الإذن وحفظ التوكن
    requestPermissionAndSaveToken();

    // ✅ استقبال إشعار في foreground
    onMessage(messaging, (payload) => {
      console.log("📩 إشعار مستلم:", payload);

      const { title, body } = payload.notification || {};
      if (title && body && "Notification" in window) {
        new Notification(title, { body });
      }
    });
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
  }, [currentUser, notifications]);
  const handleOpenChat = () => {
    if (currentNotification?.link) {
      const userId = currentNotification.link.split('/privateChat/')[1];
      navigate(`/privateChat/${otherUser.userId}`, {
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
  return (
    <>
      {/* https://nominatim.openstreetmap.org/ui/search.html */}

      <Layout>
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/" element={<Navigate to="login" replace />} />

          {/* <Route path="/auth"> */}
          <Route path="login" element={<LoginRegister />} />
          <Route path="register" element={<LoginRegister />} />
          <Route path="/home" element={<Home />} />
          <Route path="/" element={<Navigate to="login" replace />} />

          {/* <Route path="/auth"> */}
          <Route path="login" element={<LoginRegister />} />
          <Route path="register" element={<LoginRegister />} />
          {/* 
          <Route path="/services/sell" element={<Sell />} />
          <Route path="/services/rent" element={<Rent />} />
          <Route path="/services/buy" element={<Buy />} />
          <Route path="/services/finance" element={<Finance />} />

          <Route path="/services/sell" element={<SellAds />} />
          <Route path="/services/rent" element={<RentAds />} />
          <Route path="/services/buy" element={<buyAds />} />
          <Route path="/services/finance" element={<FinancingAdsPage />} />

          {/* <Route path="/auth"> */}
          <Route path="login" element={<LoginRegister />} />
          <Route path="register" element={<LoginRegister/>} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/RealEstateDeveloperAnnouncement" element={<PropertyPage />} />
          <Route path="/services/sell" element={<SellAds />} />
          <Route path="/services/rent" element={<RentAds />} />
          <Route path="/services/buy" element={<buyAds />} />
          <Route path="/services/finance" element={<FinancingAdsPage />} />

          <Route path="/services/developmentAds" element={<DeveloperAdsPage />} />

          <Route path="/services/sell" element={<SellAds />} />
          <Route path="/services/rent" element={<RentAds />} />
          <Route path="/services/buy" element={<buyAds />} />
          <Route path="/services/finance" element={<FinancingAdsPage />} />
          <Route path="/services/developmentAds" element={<DeveloperAdsPage />} />
          <Route path="/AdddeveloperAds" element={<PropertyPage />} />
      
            <Route path="/services/sell" element={<SellAds/>} />
            <Route path="/services/rent" element={<RentAds />} />
            <Route path="/services/buy" element={<buyAds/>} />
            <Route path="/services/finance" element={<FinancingAdsPage />} />



          <Route path="/favorite" element={<Favorite />} />
          <Route
            path="/insert-finance-data"
            element={<FinancingAdvExample />}
          />
          <Route
            path="/insert-dev-data"
            element={<RealEstateDevAdvExample />}
          />
          <Route path="/add-financing-ad" element={<AddFinancingAdForm />} />
          <Route
            path="/financing-request"
            element={<FinancingRequestForm />}
          />

          <Route path="details">
            <Route
              path="financingAds/:id"
              element={<DetailsForFinincingAds />}
            />
            <Route path="clientAds/:id" element={<DetailsForClient />} />
            <Route
              path="developmentAds/:id"
              element={<DetailsForDevelopment />}
            />
          </Route>
          <Route path="search" element={<SearchPage />} />
          <Route path="AddAdvertisement" element={<ModernRealEstateForm />}></Route>
          <Route path="AddAdvertisement" element={<ModernRealEstateForm />}></Route>
          <Route path="inbox" element={<InboxChats/>}/>
          <Route path="/privateChat/:id" element={<ChatBox/>}/>
          <Route path="profile" element={<Profile />} />
          
           {/* <Route path="AddAdvertisement" element={<AddAdvertisement />}></Route>  */}

          {/* <Route path="AddAdvertisement" element={<ModernRealEstateForm/>}></Route>  */}

        </Routes>
      </Layout>
      <Footer />
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
      fontSize:'20px',
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
      {/* <AddMultipleAdsOnce/> */}
    </>
  );
}

export default App;