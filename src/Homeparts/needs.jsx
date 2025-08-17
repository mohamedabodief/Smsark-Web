import { Box, Grid, Typography, Button } from '@mui/material';
import { AttachMoney, HomeWork, Key, WorkOutline } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const cards = [
  {
    icon: <HomeWork fontSize="large" />,
    title: 'شراء',
    desc: 'استكشف آلاف العقارات المتاحة للشراء بسهولة.',
    path: '/services/sell',
  },
  {
    icon: <Key fontSize="large" />,
    title: 'تأجير',
    desc: 'قم بتأجير عقارك الآن للوصول للمستأجر المناسب.',
    path: '/services/rent',
  },
  {
    icon: <AttachMoney fontSize="large" />,
    title: 'تطوير',
    desc: 'احصل على حلول تطويريه مخصصة لك بسهولة.',
    path: '/services/developmentAds',
  },
  {
    icon: <AttachMoney fontSize="large" />,
    title: 'تمويل',
    desc: 'احصل على حلول تمويلية مخصصة لك بسهولة.',
    path: '/services/finance',
  },
];

export default function Needs() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        backgroundColor: '#200D3A',
        color: 'white',
        px: { xs: 2, md: 2, },
        py: 5,
        width: "100%",
        direction: 'rtl',
      }}
    >
      <Grid
        container
        alignItems="stretch"
        sx={{
          gap: { xs: 4, sm: 6, md: 10 },
          pr: { xs: '60px' }
        }}
      >
        <Grid
          item
          xs={12}
          md={6}
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Typography variant="h4" fontWeight="bold" textAlign="center" sx={{ p: 18, pr: { xs: '200px' } }} >
            ماذا تريد؟
          </Typography>
        </Grid>

        <Grid
          item
          xs={12}
          md={6}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >

          <Grid
            container
            spacing={3}
            mb={3}
            justifyContent="center"
            alignItems="stretch"
            sx={{ maxWidth: 900 }}
          >
            {cards.slice(0, 2).map((item, i) => (
              <Grid item xs={12} sm={6} key={i} sx={{ display: "flex" }}>
                <Box
                  sx={{
                    borderRadius: 3,
                    px: 3,
                    py: 5,
                    minHeight: 230,
                    height: "100%",
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    transition: '0.3s',
                    '&:hover': {
                      backgroundColor: 'rgba(255,255,255,0.1)',
                    },
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Box
                      sx={{
                        width: 50,
                        height: 50,
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'gray',
                      }}
                    >
                      {item.icon}
                    </Box>
                    <Typography variant="h6">{item.title}</Typography>
                  </Box>

                  <Typography variant="body2" mb={3} sx={{ color: '#ccc' }}>
                    {item.desc}
                  </Typography>

                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => navigate(item.path)}
                    sx={{
                      color: 'white',
                      fontSize: '0.8rem',
                      borderRadius: '30px',
                      textTransform: 'none',
                      mr: 4,
                      px: 3,
                      '&:hover': {
                        backgroundColor: 'rgba(255,255,255,0.3)',
                      },
                    }}
                  >
                    <ArrowForwardIcon />
                  </Button>
                </Box>
              </Grid>
            ))}
          </Grid>

          <Grid
            container
            spacing={3}
            justifyContent="center"
            alignItems="stretch"
            sx={{ maxWidth: 900 }}
          >
            {cards.slice(2).map((item, i) => (
              <Grid item xs={12} sm={6} key={i} sx={{ display: "flex" }}>
                <Box
                  sx={{
                    borderRadius: 3,
                    px: 4,
                    py: 5,
                    minHeight: 230,
                    height: "100%",
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    transition: '0.3s',
                    '&:hover': {
                      backgroundColor: 'rgba(255,255,255,0.1)',
                    },
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Box
                      sx={{
                        width: 50,
                        height: 50,
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'gray',
                      }}
                    >
                      {item.icon}
                    </Box>
                    <Typography variant="h6">{item.title}</Typography>
                  </Box>

                  <Typography variant="body2" mb={3} sx={{ color: '#ccc' }}>
                    {item.desc}
                  </Typography>

                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => navigate(item.path)}
                    sx={{
                      color: 'white',
                      fontSize: '0.8rem',
                      borderRadius: '30px',
                      textTransform: 'none',
                      mr: 3.6,
                      px: 3,
                      '&:hover': {
                        backgroundColor: 'rgba(255,255,255,0.3)',
                      },
                    }}
                  >
                    <ArrowForwardIcon />
                  </Button>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}
