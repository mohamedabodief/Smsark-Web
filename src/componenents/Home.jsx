import React from 'react';
import { useNavigate } from 'react-router-dom';
import Hero from '../Homeparts/Hero';
import Needs from '../Homeparts/needs';
import Advertise from '../Homeparts/adv';
import BestFin from '../Homeparts/BestFin';
import BestDev from '../Homeparts/BestDev';
import { Fab, Box } from '@mui/material';
import { FaRobot } from 'react-icons/fa';

function Home() {
  const navigate = useNavigate();

  const goToChat = () => {
    navigate('/chat');
  };

  return (
    <>
      <Hero />
      <BestFin />
      <BestDev />
      <Needs />
      <Advertise />

      {/* زر الروبوت الثابت */}
      <Box
        position="fixed"
        bottom={20}
        right={20}
        zIndex={1000}
      >
        <Fab
          onClick={goToChat}
          sx={{
            backgroundColor: '#6a0dad',
            color: 'white',
            '&:hover': {
              backgroundColor: '#5b0ab3',
            },
          }}
        >
          <FaRobot size={32} />
        </Fab>
      </Box>
    </>
  );
}

export default Home;
