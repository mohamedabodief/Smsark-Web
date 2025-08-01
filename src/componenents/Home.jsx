import React from 'react';
import { SearchProvider } from '../context/searchcontext'; // تأكد من المسار الصحيح
import Needs from '../Homeparts/needs';
import Advertise from '../Homeparts/adv';
import BestFin from '../Homeparts/BestFin';
import BestDev from '../Homeparts/BestDev';
import HeroWithSearch from '../Homeparts/HeroWithSearch';

function Home() {
  return (
    <SearchProvider> {/* أضف هذا */}
      <>
        <HeroWithSearch />
        <BestFin />
        <BestDev />
        <Needs />
        <Advertise />
      </>
    </SearchProvider>
  );
}

export default Home;