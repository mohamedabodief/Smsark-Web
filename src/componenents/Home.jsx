import React from 'react'
import Hero from '../Homeparts/Hero'
import Needs from '../Homeparts/needs'
import Advertise from '../Homeparts/adv'
import BestFin from '../Homeparts/BestFin'
import BestDev from '../Homeparts/BestDev'
import { Margin, Padding } from '@mui/icons-material'


function Home() {
  return (
    <>
      <Hero />
      <BestFin />
      <BestDev />
      <Needs />
      <Advertise />


    </>
  )
}

export default Home
