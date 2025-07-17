import React, { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
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
import buyAds from "./services/buy";
import FinancingAdsPage from "./services/finance";




function App() {
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

          <Route path="/services/sell" element={<SellAds />} />
          <Route path="/services/rent" element={<RentAds />} />
          <Route path="/services/buy" element={<buyAds />} />
          <Route path="/services/finance" element={<FinancingAdsPage />} />

            
          {/* <Route path="/auth"> */}
          <Route path="login" element={<LoginRegister />} />
          <Route path="register" element={<LoginRegister />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/RealEstateDeveloperAnnouncement" element={<PropertyPage />} />

{/*       
            <Route path="/services/sell" element={<SellAds/>} />
            <Route path="/services/rent" element={<RentAds />} /> */}
            {/* <Route path="/services/buy" element={<Buy />} /> */}
            {/* <Route path="/services/finance" element={<FinancingAdsPage />} /> */}
           <Route path="/services/developmentAds" element={<DeveloperAdsPage/>}/>

             
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
            path="/services/finance/financing-request"
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

            {/* <Route path="AddAdvertisement" element={<AddAdvertisement />}></Route>  */}

{/* <Route path="AddAdvertisement" element={<ModernRealEstateForm/>}></Route>  */}

</Routes>
      </Layout>
      <Footer />

      {/* <AddMultipleAdsOnce/> */}
    </>
  );
}

export default App;