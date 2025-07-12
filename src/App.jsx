import React from 'react';
import DetailsForClient from './pages/Details/detailsForClient'
import DetailsForFinincingAds from './pages/Details/detailsForFinaccingAds';
import { Route, Routes } from 'react-router-dom';
import SearchPage from './pages/SearchPage';
import AddMultipleAdsOnce from './pages/addads';
import AddAdvertisement from './pages/addClientAds';
import DetailsForDevelopment from './pages/Details/detailsForDevelopment';


function App() {
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
};

export default App;
