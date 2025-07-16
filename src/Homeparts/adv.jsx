import { Box, Grid, Typography, Button, Avatar } from '@mui/material';
import { SearchRounded, HomeWorkRounded, ApartmentRounded } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom'; 

export default function Advertise() {
  const navigate = useNavigate(); 

  return (
    <Box
      sx={{
        py: 10,
        px: { xs: 2, md: 10 },
        direction: 'rtl',
      }}
    >
      <Grid container spacing={4} justifyContent="center">
        <Grid item xs={12} textAlign="center">
          <Typography variant="h4" fontWeight="bold" mt={14} mb={4}>
            أعلن عن عقارك بكل سهولة
          </Typography>
        </Grid>

        {[
          {
            icon: <SearchRounded fontSize="large" sx={{ color: '#1976d2' }} />,
            title: 'مستخدم؟',
            description: 'استكشف أفضل العقارات المتاحة بسهولة ويسر.',
          },
          {
            icon: <HomeWorkRounded fontSize="large" sx={{ color: '#388e3c' }} />,
            title: 'مالك عقار؟',
            description: 'أضف عقارك الآن وابدأ في تلقي العروض بسهولة وسرعة.',
          },
          {
            icon: <ApartmentRounded fontSize="large" sx={{ color: '#f57c00' }} />,
            title: 'مطور أو ممول؟',
            description: 'قم بإدارة مشاريعك وتواصل مع المهتمين بعقاراتك.',
          },
        ].map((item, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Box
              sx={{
                borderRadius: 5,
                p: 4,
                textAlign: 'center',
                // border: 'white',
                height: '100%',
                boxShadow: '0 0 10px rgba(134, 132, 132, 0.1)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'transform 0.3s',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: 12,
                },
              }}
            >
              <Box>
                <Avatar
                  sx={{
                    width: 70,
                    height: 70,
                    mx: 'auto',
                    mb: 2,
                  }}
                >
                  {item.icon}
                </Avatar>
                <Typography variant="h6" mb={1} fontWeight="bold">
                  {item.title}
                </Typography>
                <Typography variant="body2" sx={{ color: 'gray' }}>
                  {item.description}
                </Typography>
              </Box>
              <Button
                variant="contained"
                sx={{
                  mt: 3,
                  borderRadius: '25px',
                  textTransform: 'none',
                  width: '140px',
                  mx: 'auto',
                  fontWeight: 'bold',
                }}
                onClick={
                  item.title === 'مطور أو ممول؟'
                    ? () => navigate('/add-financing-ad') 
                    : undefined
                }
              >
                أضف إعلانك
              </Button>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
