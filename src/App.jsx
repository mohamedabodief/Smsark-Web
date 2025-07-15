import React, { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import DetailsForClient from './pages/Details/detailsForClient';
import DetailsForFinincingAds from './pages/Details/detailsForFinaccingAds';
import SearchPage from './pages/SearchPage';
import AddMultipleAdsOnce from './pages/addads';
import AddAdvertisement from './pages/addClientAds';
import DetailsForDevelopment from './pages/Details/detailsForDevelopment';

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
      <Routes>
        <Route path="details">
          <Route path="financingAds/:id" element={<DetailsForFinincingAds />} />
          <Route path="clientAds/:id" element={<DetailsForClient />} />
          <Route path="developmentAds/:id" element={<DetailsForDevelopment />} />
        </Route>
        <Route path="search" element={<SearchPage />} />
        <Route path="AddAdvertisement" element={<AddAdvertisement />} />
      </Routes>
      {/* <AddMultipleAdsOnce /> */}
    </>
  );
}

export default App;
