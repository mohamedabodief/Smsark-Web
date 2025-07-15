import React, { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import DetailsForClient from './pages/Details/detailsForClient';
import DetailsForFinincingAds from './pages/Details/detailsForFinaccingAds';
import { Route, Routes } from 'react-router-dom';
import SearchPage from './pages/SearchPage';
import AddMultipleAdsOnce from './pages/addads';
import AddAdvertisement from './pages/addClientAds';
import DetailsForDevelopment from './pages/Details/detailsForDevelopment';
import Layout from "./Layout/Layout";
import Home from "./componenents/Home";
import Footer from "./componenents/Footer";
import { Routes, Route } from 'react-router-dom';
import Sell from './services/sell';
import Rent from './services/Rent';
import Buy from './services/Buy';
import Finance from './services/Finance';
import Favorite from './componenents/Favorite'
import FinancingAdvExample from "./Homeparts/FinancingAdvExample";
import RealEstateDevAdvExample from "./Homeparts/RealEstateDevAdvExample";
import AddFinancingAdForm from "./services/AddFinancingAdForm";
import FinancingRequestForm from "./services/FinancingRequestForm";

import { onMessage } from './firebaseConfig';
import { messaging } from './firebaseConfig';
import { requestPermissionAndSaveToken } from './utils/fcmHelper';

function App() {
  useEffect(() => {
    // ✅ طلب الإذن وحفظ التوكن
    requestPermissionAndSaveToken();

    // ✅ استقبال إشعار في foreground
    onMessage(messaging, (payload) => {
      console.log('📩 إشعار مستلم:', payload);

      const { title, body } = payload.notification || {};
      if (title && body && 'Notification' in window) {
        new Notification(title, { body });
      }
    });
  }, []);

  return (
    <>
     {/* https://nominatim.openstreetmap.org/ui/search.html */}
 <Routes>
      <Route path="details">
        <Route path="financingAds/:id" element={<DetailsForFinincingAds />} />
        <Route path="clientAds/:id" element={<DetailsForClient />} />  
        <Route path='developmentAds/:id' element={<DetailsForDevelopment/>}/>
      </Route>
      <Route path='search' element={<SearchPage/>}/>
     <Route path="AddAdvertisement" element={<AddAdvertisement/>}></Route>
    </Routes>
    {/* <AddMultipleAdsOnce/> */}
    </>
  );
}

export default App;
