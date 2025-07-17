import React from 'react';
import DetailsForClient from './pages/Details/detailsForClient'
import DetailsForFinincingAds from './pages/Details/detailsForFinaccingAds';
// import { Route, Routes } from 'react-router-dom';
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


function App() {
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

          <Route path="/services/sell" element={<Sell />} />
          <Route path="/services/rent" element={<Rent />} />
          <Route path="/services/buy" element={<Buy />} />
          <Route path="/services/finance" element={<Finance />} />
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
          <Route path="/services/finance/financing-request" element={<FinancingRequestForm />} />

          <Route path="details">
            <Route path="financingAds/:id" element={<DetailsForFinincingAds />} />
            <Route path="clientAds/:id" element={<DetailsForClient />} />  
            <Route path='developmentAds/:id' element={<DetailsForDevelopment/>}/>
          </Route>
          <Route path="search" element={<SearchPage />} />
          <Route path="AddAdvertisement" element={<AddAdvertisement />}></Route> 
        </Routes>
      </Layout>
      <Footer />

    
    {/* <AddMultipleAdsOnce/> */}
    </>
  );
};

export default App;
