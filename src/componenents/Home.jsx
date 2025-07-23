import React from 'react';
import { useNavigate } from 'react-router-dom';
import Hero from '../Homeparts/Hero';
import Needs from '../Homeparts/needs';
import Advertise from '../Homeparts/adv';
import BestFin from '../Homeparts/BestFin';
import BestDev from '../Homeparts/BestDev';

function Home() {
  // const navigate = useNavigate();

  

  return (
    <>
      <Hero />
      <BestFin />
      <BestDev />
      <Needs />
      <Advertise />
      
    </>
  );
}

export default Home;
