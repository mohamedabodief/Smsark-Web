import React, { useEffect, useState } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import DetailsForClient from "./pages/Details/detailsForClient";
import DetailsForFinancingAds from "./pages/Details/detailsForFinaccingAds";
import DetailsForDevelopment from "./pages/Details/detailsForDevelopment";
import Layout from "./Layout/Layout";
import Home from "./componenents/Home";
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
import AdPackages from "../packages/packagesDev&Fin";
import AdPackagesClient from "../packages/packagesClient";
import SearchPage from "./pages/SearchPage";
import ContactUs from "./contactUs/ContactUs";
import AdminDashboard from "./Dashboard/adminDashboard";
import ClientDashboard from "./Dashboard/clientDashboard";
import OrganizationDashboard from "./Dashboard/organization/organizationDashboard";
import PrivateRoute from "./PrivateRoute";
import AuthSync from "./AuthSync";
import RequireNotAuth from "./LoginAndRegister/RequireNotAuth";


import { onMessage, messaging, auth } from "./FireBase/firebaseConfig";
import { requestPermissionAndSaveToken } from "./FireBase/MessageAndNotification/fcmHelper";
import { onAuthStateChanged } from "firebase/auth";

function App() {
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


  if (loading) return null;

  return (
    <>
    <AuthSync />
    <SearchProvider>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/home" element={<Home />} />
          <Route path="/" element={<Navigate to="login" replace />} />

          {/* <Route path="/auth"> */}
          {/* <Route path="login" element={<LoginRegister />} />
          <Route path="register" element={<LoginRegister />} /> */}
          {/* 
          <Route path="/services/sell" element={<Sell />} />
          <Route path="/services/rent" element={<Rent />} />
          <Route path="/services/buy" element={<Buy />} />
          <Route path="/services/finance" element={<Finance />} />

          <Route path="/services/sell" element={<SellAds />} />
          <Route path="/services/rent" element={<RentAds />} />
          <Route path="/services/buy" element={<buyAds />} />
          <Route path="/services/finance" element={<FinancingAdsPage />} />


             */}
          {/* <Route path="/auth"> */}
          <Route path="login" element={<RequireNotAuth><LoginRegister /></RequireNotAuth>} />
          <Route path="register" element={<RequireNotAuth><LoginRegister /></RequireNotAuth>} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/RealEstateDeveloperAnnouncement" element={<PropertyPage />} />

          <Route element={<PrivateRoute />}>
            {/* Admin Dashboard */}
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            {/* Client Dashboard */}
            <Route path="/client-dashboard" element={<ClientDashboard />} />
            {/* Organization Dashboard */}
            <Route path="/organization-dashboard" element={<OrganizationDashboard />} />
          </Route>

          {/* <Route path="/services/sell" element={<SellAds />} />
          <Route path="/login" element={<LoginRegister />} />
          <Route path="/register" element={<LoginRegister />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/favorite" element={<Favorite />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/inbox" element={<InboxChats />} />
          <Route path="/privateChat/:id" element={<ChatBox />} />

          {/* Services */}
          <Route path="/services/sell" element={<SellAds />} />
          <Route path="/services/rent" element={<RentAds />} />
          <Route path="/services/buy" element={<BuyAds />} />
          <Route path="/services/finance" element={<FinancingAdsPage />} />
          <Route path="/services/developmentAds" element={<DeveloperAdsPage />} />
          <Route path="/AdddeveloperAds" element={<PropertyPage />} />

          <Route path="/services/sell" element={<SellAds />} />
          <Route path="/services/rent" element={<RentAds />} />
          <Route path="/services/buy" element={<buyAds />} />
          <Route path="/services/finance" element={<FinancingAdsPage />} />

          <Route path="/services/developmentAds" element={<DeveloperAdsPage />} />


          <Route path="/favorite" element={<Favorite />} />
          <Route
            path="/insert-finance-data"
            element={<FinancingAdvExample />}
          />
          <Route
            path="/insert-dev-data"
            element={<RealEstateDevAdvExample />}
          />

          {/* Forms & Insert */}
          <Route path="/add-financing-ad" element={<AddFinancingAdForm />} />
          <Route path="/insert-finance-data" element={<FinancingAdvExample />} />
          <Route path="/insert-dev-data" element={<RealEstateDevAdvExample />} />
          <Route path="/financing-request" element={<FinancingRequestForm />} />
          <Route path="/AddAdvertisement" element={<ModernRealEstateForm />} />
          <Route path="/AdddeveloperAds" element={<PropertyPage />} />

          <Route path="details">
            <Route
              path="financingAds/:id"
              element={<DetailsForFinancingAds />}
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
          <Route path="/packages" element={<AdPackages />} />
          <Route path="/Client-packages" element={<AdPackagesClient />} />
          
           {/* <Route path="AddAdvertisement" element={<AddAdvertisement />}></Route>  */}

          {/* <Route path="AddAdvertisement" element={<AddAdvertisement />}></Route> 

          {/* <Route path="AddAdvertisement" element={<ModernRealEstateForm/>}></Route>  */}
          {/* Real estate announcements */}
          <Route path="/RealEstateDeveloperAnnouncement" element={<PropertyPage />} />

          {/* Details */}
          <Route path="/detailsForDevelopment/:id" element={<DetailsForDevelopment />} />
          <Route path="/detailsForDevelopment" element={<Navigate to="/RealEstateDeveloperAnnouncement" replace />} />
          <Route path="/details/financingAds/:id" element={<DetailsForFinancingAds />} />
          <Route path="/details/clientAds/:id" element={<DetailsForClient />} />
          <Route path="/details/developmentAds/:id" element={<DetailsForDevelopment />} />
        </Routes>
      </Layout>
      <Footer />
    </SearchProvider>
    </>
  );
}

export default App;
