
// import * as React from 'react';
// import { useTheme } from '@mui/material/styles';
// import {
//   Box,
//   Card,
//   CardContent,
//   CardMedia,
//   IconButton,
//   Typography,
//   Tooltip
// } from '@mui/material';
// import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

// export default function CardSearch() {
//   const theme = useTheme();

//   return (
//     <Card
//       sx={{
//         display: 'flex',
//         flexDirection: 'row-reverse', // الصورة يمين
//         alignItems: 'center',
//         maxHeight: 160,
//         borderRadius: 3,
//         boxShadow: 3,
//         overflow: 'hidden',
//         mb: 2,
//         width: '100%',
//       }}
//     >
//       {/* ✅ الصورة */}
//       <CardMedia
//         component="img"
//         image="h.jpg"
//         alt="صورة العقار"
//         sx={{
//           width: 150,
//           height: '100%',
//           objectFit: 'cover',
//         }}
//       />

//       {/* ✅ محتوى النص */}
//       <Box sx={{ flex: 1, px: 2 }}>
//         <CardContent sx={{ padding: '8px 0' }}>
//           <Typography variant="h6" fontWeight="bold">
//             عنوان العقار
//           </Typography>

//           <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
//             وصف مختصر - الموقع - الحي
//           </Typography>

//           <Typography variant="subtitle1" fontWeight="bold" sx={{ mt: 1, color: 'primary.main' }}>
//             السعر: 450,000 ج.م
//           </Typography>
//         </CardContent>
//       </Box>

//       {/* ✅ زر المفضلة */}
//       <Box sx={{ pr: 1 }}>
//         <Tooltip title="إضافة إلى المفضلة">
//           <IconButton color="error">
//             <FavoriteBorderIcon />
//           </IconButton>
//         </Tooltip>
//       </Box>
//     </Card>
//   );
// }
// src/searchComponents/CardSearch.jsx
import * as React from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  IconButton,
  Box,
  Tooltip,
} from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

export default function CardSearch({ property }) {
  return (
    <Card
      sx={{
        maxWidth: 300,
        borderRadius: 3,
        boxShadow: 3,
        overflow: 'hidden',
        mb: 2,
      }}
    >
      <CardMedia
        component="img"
        height="180"
        // image={property.images || 'placeholder.jpg'}
        image='h.jpg'
        alt={property.title}
        sx={{ objectFit: 'cover' }}
      />
      <CardContent sx={{ textAlign: 'center' }}>
        <Typography gutterBottom variant="h6" fontWeight="bold">
          {property.title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {property.description}
        </Typography>
        <Box display="flex" justifyContent="space-between" mt={2}>
          <Typography variant="subtitle2" color="text.secondary">
            السعر: {property.price}
          </Typography>
          <Typography variant="subtitle2" color="text.secondary">
            {property.address}
          </Typography>
        </Box>
      </CardContent>
      <Box
        sx={{
          px: 2,
          pb: 2,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Tooltip title="إضافة إلى المفضلة">
          <IconButton color="gray">
            <FavoriteBorderIcon />
          </IconButton>
        </Tooltip>
        <Box
          sx={{
            backgroundColor: '#6E00FE',
            padding: '5px 12px',
            borderRadius: '15px',
            color: 'white',
            fontSize: '0.8rem',
          }}
        >
          {/* <Typography>{property.ad_status}</Typography> */}
          <Typography>تحت التفاوض</Typography>
        </Box>
      </Box>
    </Card>
  );
}
