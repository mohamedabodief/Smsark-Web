// src/packages/packagesDevAndFin.jsx
// import React, { useState } from 'react';
// import {
//     Box,
//     Card,
//     CardContent,
//     Typography,
//     Button,
//     Radio,
//     FormControlLabel,
// } from '@mui/material';
// import { useTheme } from '@mui/material/styles';
// const packages = [
//     {
//         id: 1,
//         name: 'باقة الأساس',
//         price: 100,
//         duration: 7,
//         features: ['عرض الإعلان لمدة 7 أيام'],
//     },
//     {
//         id: 2,
//         name: 'باقة النخبة',
//         price: 150,
//         duration: 14,
//         features: ['عرض الإعلان لمدة 14 يومًا'],
//     },
//     {
//         id: 3,
//         name: 'باقة التميز',
//         price: 200,
//         duration: 21,
//         features: ['عرض الإعلان لمدة 21 يومًا'],
//     },
// ];
// const AdPackages = ({ selectedPackageId, setSelectedPackageId, onReceiptImageChange }) => {
//     const [receiptImages, setReceiptImages] = useState({});
//     const theme = useTheme();

//     const handleSelectPackage = (pkgId) => {
//         setSelectedPackageId(pkgId);
//         console.log('📦 تم اختيار الباقة:', pkgId);
//     };

//     const handleImageUpload = (e, pkgId) => {
//         const file = e.target.files[0];
//         setReceiptImages((prev) => ({
//             ...prev,
//             [pkgId]: file,
//         }));
//         if (onReceiptImageChange) onReceiptImageChange(file);
//         console.log('📤 تم رفع الريسيت للباقة:', pkgId, file);
//     };

//     return (
//         <Box p={3} dir="rtl">
//             <Typography
//                 variant="h5"
//                 mb={4}
//                 mt={7}
//                 align="center"
//                 sx={{ fontWeight: 'bold' }}
//             >
//                 اختر الباقة المناسبة لإعلانك
//             </Typography>

//             <Box display="flex" justifyContent="center" gap={2} flexWrap="wrap">
//                 {packages.map((pkg) => (
//                     <Card
//                         key={pkg.id}
//                         variant={selectedPackageId === pkg.id ? 'outlined' : 'elevation'}
//                         sx={{
//                             width: 300,
//                             height: 400,
//                             border:
//                                 selectedPackageId === pkg.id ? '2px solid #1976d2' : '',
//                             backgroundColor:
//                                 selectedPackageId === pkg.id
//                                     ? theme.palette.background.paper
//                                     : theme.palette.background.default,

//                             display: 'flex',
//                             flexDirection: 'column',
//                             justifyContent: 'space-between',
//                             textAlign: 'right',
//                             px: 2,
//                             pr: 2,
//                         }}
//                     >
//                         <CardContent sx={{ pt: 1 }}>
//                             <FormControlLabel
//                                 control={
//                                     <Radio
//                                         size="small"
//                                         checked={selectedPackageId === pkg.id}
//                                         onChange={() => handleSelectPackage(pkg.id)}
//                                         color="primary"
//                                     />
//                                 }
//                                 label={
//                                     <Typography variant="h6" color="primary">
//                                         {pkg.name}
//                                     </Typography>
//                                 }
//                             />
//                             <Typography sx={{ paddingBottom: 1, paddingTop: 3 }}>💰 السعر: {pkg.price} ج.م</Typography>
//                             <Typography sx={{ paddingBottom: 1 }}>⏱️ المدة: {pkg.duration} يوم</Typography>
//                             <ul style={{ paddingRight: 16 }}>
//                                 {pkg.features.map((f, index) => (
//                                     <li key={index}>{f}</li>
//                                 ))}
//                             </ul>
//                         </CardContent>

//                         <Box textAlign="center" mb={2}>
//                             <Typography variant="subtitle2" gutterBottom>
//                                 رفع صورة الريسيت
//                             </Typography>
//                             <Button variant="outlined" component="label" size="small">
//                                 اختر ملف
//                                 <input
//                                     type="file"
//                                     hidden
//                                     onChange={(e) => handleImageUpload(e, pkg.id)}
//                                     accept="image/*"
//                                 />
//                             </Button>
//                             {receiptImages[pkg.id] && (
//                                 <Typography variant="body2" mt={1}>
//                                     ✔️ تم اختيار: <strong>{receiptImages[pkg.id].name}</strong>
//                                 </Typography>
//                             )}
//                         </Box>
//                     </Card>
//                 ))}
//             </Box>
//         </Box>
//     );
// }
// export default AdPackages;


import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Radio,
  FormControlLabel,
  IconButton,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useTheme } from '@mui/material/styles';

const packages = [
  {
    id: 1,
    name: 'باقة الأساس',
    price: 100,
    duration: 7,
    features: ['عرض الإعلان لمدة 7 أيام'],
  },
  {
    id: 2,
    name: 'باقة النخبة',
    price: 150,
    duration: 14,
    features: ['عرض الإعلان لمدة 14 يومًا'],
  },
  {
    id: 3,
    name: 'باقة التميز',
    price: 200,
    duration: 21,
    features: ['عرض الإعلان لمدة 21 يومًا'],
  },
];

const AdPackages = ({
  selectedPackageId,
  setSelectedPackageId,
  onReceiptImageChange,
  receiptImage,
  receiptPreviewUrl,
  removeReceiptImage,
}) => {
  const [receiptImages, setReceiptImages] = useState({});
  const theme = useTheme();

  // تهيئة صورة الإيصال في وضع التعديل
  useEffect(() => {
    if (receiptImage && typeof receiptImage === 'string') {
      setReceiptImages((prev) => ({
        ...prev,
        [selectedPackageId]: receiptImage,
      }));
    }
  }, [receiptImage, selectedPackageId]);

  const handleSelectPackage = (pkgId) => {
    setSelectedPackageId(pkgId);
    console.log('📦 تم اختيار الباقة:', pkgId);
  };

  const handleImageUpload = (e, pkgId) => {
    const file = e.target.files[0];
    if (file) {
      setReceiptImages((prev) => ({
        ...prev,
        [pkgId]: file,
      }));
      if (onReceiptImageChange) onReceiptImageChange(file);
      console.log('📤 تم رفع الريسيت للباقة:', pkgId, file);
    }
  };

  const handleRemoveReceipt = (pkgId) => {
    setReceiptImages((prev) => {
      const newImages = { ...prev };
      delete newImages[pkgId];
      return newImages;
    });
    if (removeReceiptImage) removeReceiptImage();
    console.log('🗑️ تم إزالة الريسيت للباقة:', pkgId);
  };

  return (
    <Box p={3} dir="rtl">
      <Typography
        variant="h5"
        mb={4}
        mt={7}
        align="center"
        sx={{ fontWeight: 'bold' }}
      >
        اختر الباقة المناسبة لإعلانك
      </Typography>

      <Box display="flex" justifyContent="center" gap={2} flexWrap="wrap">
        {packages.map((pkg) => (
          <Card
            key={pkg.id}
            variant={selectedPackageId === pkg.id ? 'outlined' : 'elevation'}
            sx={{
              width: 300,
              height: 400,
              border: selectedPackageId === pkg.id ? '2px solid #1976d2' : '',
              backgroundColor:
                selectedPackageId === pkg.id
                  ? theme.palette.background.paper
                  : theme.palette.background.default,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              textAlign: 'right',
              px: 2,
              pr: 2,
            }}
          >
            <CardContent sx={{ pt: 1 }}>
              <FormControlLabel
                control={
                  <Radio
                    size="small"
                    checked={selectedPackageId === pkg.id}
                    onChange={() => handleSelectPackage(pkg.id)}
                    color="primary"
                  />
                }
                label={
                  <Typography variant="h6" color="primary">
                    {pkg.name}
                  </Typography>
                }
              />
              <Typography sx={{ paddingBottom: 1, paddingTop: 3 }}>
                💰 السعر: {pkg.price} ج.م
              </Typography>
              <Typography sx={{ paddingBottom: 1 }}>
                ⏱️ المدة: {pkg.duration} يوم
              </Typography>
              <ul style={{ paddingRight: 16 }}>
                {pkg.features.map((f, index) => (
                  <li key={index}>{f}</li>
                ))}
              </ul>
            </CardContent>

            <Box textAlign="center" mb={2}>
              <Typography variant="subtitle2" gutterBottom>
                رفع صورة الإيصال
              </Typography>
              <Button variant="outlined" component="label" size="small">
                اختر ملف
                <input
                  type="file"
                  hidden
                  onChange={(e) => handleImageUpload(e, pkg.id)}
                  accept="image/*"
                />
              </Button>
              {receiptImages[pkg.id] ? (
                <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="body2">
                    ✔️ تم اختيار:{' '}
                    <strong>
                      {typeof receiptImages[pkg.id] === 'string'
                        ? 'صورة الإيصال'
                        : receiptImages[pkg.id].name}
                    </strong>
                  </Typography>
                  <IconButton
                    onClick={() => handleRemoveReceipt(pkg.id)}
                    sx={{ bgcolor: 'white', '&:hover': { bgcolor: 'grey.200' } }}
                  >
                    <DeleteIcon color="error" />
                  </IconButton>
                </Box>
              ) : receiptPreviewUrl && selectedPackageId === pkg.id ? (
                <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <img
                    src={receiptPreviewUrl}
                    alt="معاينة الإيصال"
                    style={{
                      width: '50px',
                      height: '50px',
                      objectFit: 'cover',
                      borderRadius: '4px',
                    }}
                    onError={(e) => {
                      console.log('Receipt image failed to load:', receiptPreviewUrl);
                      e.target.src = '/no-image-thumbnail.svg';
                    }}
                  />
                  <IconButton
                    onClick={() => handleRemoveReceipt(pkg.id)}
                    sx={{ bgcolor: 'white', '&:hover': { bgcolor: 'grey.200' } }}
                  >
                    <DeleteIcon color="error" />
                  </IconButton>
                </Box>
              ) : null}
            </Box>
          </Card>
        ))}
      </Box>
    </Box>
  );
};

export default AdPackages;