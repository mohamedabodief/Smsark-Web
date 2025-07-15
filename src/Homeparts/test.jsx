import { Box, Typography, Card, CardMedia, CardContent, IconButton } from '@mui/material';
import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';
import { useRef, useEffect, useState } from 'react';
import { db } from '../firebase'; 
import { collection, getDocs } from 'firebase/firestore';

export default function BestFin() {
  const sliderRef = useRef();
  const [offers, setOffers] = useState([]);

  const scroll = (direction) => {
    const cardWidth = 344;
    if (sliderRef.current) {
      sliderRef.current.scrollBy({
        left: direction === 'left' ? -cardWidth : cardWidth,
        behavior: 'smooth',
      });
    }
  };

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'offers'));
        const data = querySnapshot.docs.map(doc => doc.data());
        setOffers(data);
      } catch (error) {
        console.error('Error fetching offers:', error);
      }
    };

    fetchOffers();
  }, []);

  return (
    <Box sx={{ direction: 'rtl', paddingTop: 8, px: 5 }}>
      <Typography variant="h4" fontWeight="bold" textAlign="center" mb={4}>
        أفضل عروض التمويل
      </Typography>

      <Box sx={{ position: 'relative' }}>
        <IconButton
          onClick={() => scroll('left')}
          sx={{
            position: 'absolute',
            top: '50%',
            left: -10,
            transform: 'translateY(-50%)',
            zIndex: 1,
            backgroundColor: 'white',
            boxShadow: 2,
          }}
        >
          <ArrowBackIos sx={{ color: 'grey' }} />
        </IconButton>

        <IconButton
          onClick={() => scroll('right')}
          sx={{
            position: 'absolute',
            top: '50%',
            right: -10,
            transform: 'translateY(-50%)',
            zIndex: 1,
            backgroundColor: 'white',
            boxShadow: 2,
          }}
        >
          <ArrowForwardIos sx={{ color: 'grey' }} />
        </IconButton>

        <Box
          ref={sliderRef}
          sx={{
            display: 'flex',
            justifyContent: 'center',
            overflowX: 'auto',
            gap: 3,
            scrollSnapType: 'x mandatory',
            scrollPaddingRight: '60px',
            pb: 2,
            pl: 5,
            '&::-webkit-scrollbar': { display: 'none' },
          }}
        >
          {offers.map((item, index) => (
            <Card
              key={index}
              sx={{
                minWidth: 320,
                scrollSnapAlign: 'start',
                flexShrink: 0,
                borderRadius: 3,
              }}
            >
              <CardMedia component="img" height="160" image={item.image} />
              <CardContent>
                <Typography color="primary" fontWeight="bold">
                  {item.price}
                </Typography>
                <Typography variant="subtitle1">{item.company}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {item.location}
                </Typography>
                <Typography variant="body2" mt={1}>
                  {item.desc}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
