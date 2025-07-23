import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import '../styles/ModernRealEstateForm.css';
import ClientAdvertisement from '../FireBase/modelsWithOperations/ClientAdvertisemen';
import { auth, storage } from '../FireBase/firebaseConfig';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import {
  Box,
  Container,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Grid,
  Card,
  CardContent,
  Switch,
  FormControlLabel,
  IconButton,
  InputAdornment,
  Divider,
  Alert,
  Snackbar,
  FormHelperText
} from '@mui/material';
import {
  LocationOn,
  Phone,
  CalendarToday,
  Image,
  Person,
  Home,
  AttachMoney,
  SquareFoot,
  Description,
  Visibility,
  Add,
  Delete,
  Map
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import MapDisplay from '../LocationComponents/MapDisplay';
import MapPicker from '../LocationComponents/MapPicker';
import { useNavigate, useLocation } from 'react-router-dom';
import AdPackagesClient from '../../packages/packagesClient';

// Custom styled components
const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: '12px',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  transition: 'all 0.3s ease',
  '&:hover': {
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15)',
  },
  marginBottom: theme.spacing(3),
}));

const StyledTextField = styled(TextField)(({ theme, hasError }) => ({
  '& .MuiInputBase-root': {
    borderRadius: '12px',
    backgroundColor: '#f8f9fa',
    '&:hover': {
      backgroundColor: '#f1f3f4',
    },
    '&.Mui-focused': {
      backgroundColor: '#ffffff',
    },
  },
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: hasError ? '#d32f2f' : '#e0e0e0',
  },
  '&:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: hasError ? '#d32f2f' : '#1976d2',
  },
  '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
    borderColor: hasError ? '#d32f2f' : '#1976d2',
  },
  '& .MuiFormHelperText-root': {
    color: '#d32f2f',
    fontSize: '0.75rem',
    textAlign: 'right',
    marginRight: '14px',
    marginTop: '4px',
  },
  '& .MuiInputLabel-root': {
    textAlign: 'right',
    right: 'auto',
    left: 'auto',
    transformOrigin: 'right',
  },
  '& .MuiInputLabel-shrink': {
    transform: 'translate(14px, -9px) scale(0.75)',
  },
}));

const StyledFormControl = styled(FormControl)(({ theme, hasError }) => ({
  '& .MuiInputBase-root': {
    borderRadius: '12px',
    backgroundColor: '#f8f9fa',
    '&:hover': {
      backgroundColor: '#f1f3f4',
    },
    '&.Mui-focused': {
      backgroundColor: '#ffffff',
    },
  },
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: hasError ? '#d32f2f' : '#e0e0e0',
  },
  '&:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: hasError ? '#d32f2f' : '#1976d2',
  },
  '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
    borderColor: hasError ? '#d32f2f' : '#1976d2',
  },
  '& .MuiFormHelperText-root': {
    color: '#d32f2f',
    fontSize: '0.75rem',
    textAlign: 'right',
    marginRight: '14px',
    marginTop: '4px',
  },
  '& .MuiInputLabel-root': {
    textAlign: 'right',
    right: 'auto',
    left: 'auto',
    transformOrigin: 'right',
  },
  '& .MuiInputLabel-shrink': {
    transform: 'translate(14px, -9px) scale(0.75)',
  },
}));

const ImagePreviewBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  gap: theme.spacing(2),
  marginTop: theme.spacing(2),
}));

const ImagePreview = styled(Box)(({ theme }) => ({
  position: 'relative',
  width: 120,
  height: 120,
  borderRadius: '8px',
  overflow: 'hidden',
  border: '2px dashed #ccc',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#f8f9fa',
  cursor: 'pointer',
  '&:hover': {
    borderColor: '#1976d2',
    backgroundColor: '#f1f3f4',
  },
}));

// Yup validation schema
const validationSchema = yup.object().shape({
  title: yup.string().required('عنوان الإعلان مطلوب'),
  propertyType: yup.string().required('نوع العقار مطلوب'),
  price: yup.number().positive('السعر يجب أن يكون رقم موجب').required('السعر مطلوب'),
  area: yup.number().positive('المساحة يجب أن تكون رقم موجب').required('المساحة مطلوبة'),
  buildingDate: yup.string().required('تاريخ البناء مطلوب'),
  address: yup.string().required('العنوان مطلوب'),
  city: yup.string().required('المدينة مطلوبة'),
  governorate: yup.string().required('المحافظة مطلوبة'),
  phone: yup.string().required('رقم الهاتف مطلوب'),
  username: yup.string().required('اسم المستخدم مطلوب'),
  adType: yup.string().required('نوع الإعلان مطلوب'),
  adStatus: yup.string().required('حالة الإعلان مطلوبة'),
  description: yup.string().required('الوصف مطلوب'),
});

const uploadImagesAndGetUrls = async (imageFiles) => {
  const urls = [];
  for (let i = 0; i < imageFiles.length; i++) {
    const file = imageFiles[i];
    const storageRef = ref(storage, `property_images/${auth.currentUser.uid}/${Date.now()}_${file.name}`); // تعديل: property_images/{userId}
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);
    urls.push(url);
  }
  return urls;
};

const ModernRealEstateForm = () => {
  const [images, setImages] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [imageError, setImageError] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [coordinates, setCoordinates] = useState(null);
  const [enableMapPick, setEnableMapPick] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const editData = location.state?.adData || null;
  const isEditMode = location.state?.editMode || false;
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      title: editData?.title || '',
      propertyType: editData?.type || '',
      price: editData?.price || '',
      area: editData?.area || '',
      buildingDate: editData?.date_of_building || '',
      address: editData?.address || '',
      city: editData?.city || '',
      governorate: editData?.governorate || '',
      phone: editData?.phone || '',
      username: editData?.user_name || '',
      adType: editData?.ad_type || '',
      adStatus: editData?.ad_status || '',
      description: editData?.description || '',
      adsActivation: editData?.ads || false,
      activationDays: editData?.adExpiryTime ? Math.round((editData.adExpiryTime - Date.now()) / (24 * 60 * 60 * 1000)) : 7,
    }
  });

  // عند التعديل، عرّض الصور القديمة للمعاينة
  useEffect(() => {
    if (isEditMode && editData && Array.isArray(editData.images)) {
      setImages([]); // الصور الجديدة فقط
      setImageError('');
    }
  }, [isEditMode, editData]);

  // عند التعديل، مرر adPackage من editData إلى selectedPackage
  useEffect(() => {
    if (isEditMode && editData && editData.adPackage) {
      setSelectedPackage(editData.adPackage);
    }
  }, [isEditMode, editData]);

  const adsActivation = watch('adsActivation');
  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);

    // Validate number of images
    if (!isEditMode && (images.length + files.length > 4)) {
      setImageError('يمكنك إضافة 4 صور كحد أقصى');
      return;
    }

    // Validate file types
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const invalidFiles = files.filter(file => !validTypes.includes(file.type));

    if (invalidFiles.length > 0) {
      setImageError('يرجى إضافة صور بصيغة JPG, PNG, أو WebP فقط');
      return;
    }

    setImages(prev => [...prev, ...files]);
    setImageError('');
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setImageError('');
  };

  const onSubmit = async (data) => {
    setSubmitError('');
    if (!isEditMode && images.length === 0) {
      setImageError('الصور مطلوبة، أضف 4 صور على الأكثر');
      return;
    }
    if (!auth.currentUser) {
      setSubmitError('يجب تسجيل الدخول لإضافة إعلان. من فضلك، قم بتسجيل الدخول أولاً.');
      return;
    }

    try {
      if (isEditMode && (!editData.id || editData.id === undefined || editData.id === null)) {
        setSubmitError('لا يمكن تعديل إعلان بدون معرف (ID).');
        return;
      }
      console.log('Current User:', auth.currentUser); // سجل للتحقق من المستخدم
      if (isEditMode && editData) {
        // تحديث إعلان موجود
        const ad = new ClientAdvertisement({ ...editData, id: editData.id });
        // الصور القديمة (روابط فقط)
        const oldImages = Array.isArray(editData.images) ? editData.images : [];
        // الصور الجديدة (ملفات فقط)
        const newImageFiles = images;
        let finalImageUrls = oldImages;
        let filesToUpload = null;
        if (newImageFiles.length > 0) {
          filesToUpload = newImageFiles;
          // سيتم رفع الصور الجديدة ودمجها في update
        }
        // مرر الصور القديمة في updates.images، ومرر newImageFiles فقط إذا كانت موجودة
        await ad.update({
          ...editData,
          ...data,
          type: data.propertyType,
          user_name: data.username,
          ad_type: data.adType,
          ad_status: data.adStatus,
          images: oldImages,
          adPackage: selectedPackage,
        }, filesToUpload);
        setShowSuccess(true);
        handleReset();
        setTimeout(() => {
          navigate(`/detailsForClient/${ad.id}`);
        }, 1500);
      } else {
        // إضافة إعلان جديد
        const adData = {
          title: data.title,
          type: data.propertyType,
          price: data.price,
          area: data.area,
          date_of_building: data.buildingDate,
          location: {
            lat: coordinates?.lat || 0,
            lng: coordinates?.lng || 0,
          },
          address: data.address,
          city: data.city,
          governorate: data.governorate,
          phone: data.phone,
          user_name: data.username,
          userId: auth.currentUser.uid,
          ad_type: data.adType,
          ad_status: data.adStatus,
          type_of_user: 'client',
          ads: data.adsActivation,
          adExpiryTime: data.adsActivation
            ? Date.now() + data.activationDays * 24 * 60 * 60 * 1000
            : null,
          description: data.description,
          adPackage: selectedPackage,
        };
        const ad = new ClientAdvertisement(adData);
        await ad.save(images);
        setShowSuccess(true);
        handleReset();
        setTimeout(() => {
          navigate(`/detailsForClient/${ad.id}`);
        }, 1500);
      }
    } catch (error) {
      setSubmitError(error.message || 'حدث خطأ أثناء إضافة الإعلان. تأكد من أن الصور يتم رفعها إلى المسار الصحيح (property_images).');
      console.error('Error during submission:', error);
    }
  };

  const handleReset = () => {
    reset();
    setImages([]);
    setImageError('');
  };

  const propertyTypes = ['شقة', 'فيلا', 'استوديو', 'دوبلكس', 'محل تجاري'];
  const adTypes = ['بيع', 'إيجار', 'شراء'];
  const adStatuses = ['تحت العرض', 'تحت التفاوض', 'منتهي'];
  const addressValue = watch('address');
  const cityValue = watch('city');
  const governorateValue = watch('governorate');

  useEffect(() => {
    const fetchCoordinates = async () => {
      if (!addressValue && !cityValue && !governorateValue) return;
      const fullAddress = `${addressValue || ''}, ${cityValue || ''}, ${governorateValue || ''}`;
      const apiKey = 'YOUR_GOOGLE_MAPS_API_KEY';
      const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(fullAddress)}&key=${apiKey}`;
      try {
        const res = await fetch(url);
        const data = await res.json();
        if (data.status === 'OK' && data.results.length > 0) {
          const { lat, lng } = data.results[0].geometry.location;
          setCoordinates({ lat, lng });
        }
      } catch (err) {
        console.error('Failed to fetch coordinates:', err);
      }
    };
    if (!enableMapPick) fetchCoordinates();
  }, [addressValue, cityValue, governorateValue, enableMapPick]);

  return (
    <Box
      className="modern-form-container"
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f5f5f5',
        py: 4,
        direction: 'rtl'
      }}
    >
      <Container maxWidth="lg" sx={{ direction: 'rtl' }}>
        <Typography
          variant="h3"
          component="h1"
          sx={{
            mb: 1,
            mt: '100px',
            fontWeight: 700,
            color: '#6E00FE',
            textAlign: 'center',
            fontFamily: 'Cairo, Noto Kufi Arabic, sans-serif'
          }}
        >
          إضافة إعلان عقاري
        </Typography>

        <Typography
          variant="h6"
          sx={{
            mb: 4,
            color: '#666',
            textAlign: 'center',
            fontFamily: 'Cairo, Noto Kufi Arabic, sans-serif',
            marginTop: '20px'
          }}
        >
          أضف تفاصيل عقارك وابدأ في التواصل مع العملاء المحتملين
        </Typography>

        <Box component="form" onSubmit={handleSubmit(onSubmit)} width={'100%'} sx={{ direction: 'rtl' }}>
          <StyledCard>
            <CardContent>
              <Container maxWidth='lg' sx={{ display: 'flex', flexDirection: 'coloumn' }}>
                {/* Basic Information - Full Width */}
                <Grid item width={'100%'}>
                  <Typography variant="h6" sx={{ mb: 3, color: '#6E00FE', fontWeight: 600 }}>
                    <Home sx={{ mr: 1, verticalAlign: 'middle', ml: '6px', mt: '-6px', }} />
                    المعلومات الأساسية
                  </Typography>

                  <Typography sx={{ mb: 1, color: '#666', fontWeight: 500, fontSize: '20px' }}>
                    عنوان الإعلان
                  </Typography>
                  <Controller
                    name="title"
                    control={control}
                    render={({ field }) => (
                      <StyledTextField
                        {...field}
                        fullWidth
                        placeholder="اكتب عنوان الإعلان هنا"
                        error={!!errors.title}
                        helperText={errors.title?.message}
                        sx={{ mb: 2 }}
                      />
                    )}
                  />

                  <Typography variant="body2" sx={{ mb: 1, color: '#666', fontWeight: 500, fontSize: '20px' }}>
                    نوع العقار
                  </Typography>
                  <Controller
                    name="propertyType"
                    control={control}
                    render={({ field }) => (
                      <StyledFormControl fullWidth sx={{ mb: 2 }}>
                        <Select
                          {...field}
                          displayEmpty
                          error={!!errors.propertyType}
                          renderValue={(selected) => {
                            if (!selected) {
                              return <span style={{ color: '#999' }}>اختر نوع العقار</span>;
                            }
                            return selected;
                          }}
                        >
                          {propertyTypes.map((type) => (
                            <MenuItem key={type} value={type}>{type}</MenuItem>
                          ))}
                        </Select>
                        {errors.propertyType && (
                          <FormHelperText>{errors.propertyType.message}</FormHelperText>
                        )}
                      </StyledFormControl>
                    )}
                  />

                  <Typography variant="body2" sx={{ mb: 1, color: '#666', fontWeight: 500, fontSize: '20px' }}>
                    السعر
                  </Typography>
                  <Controller
                    name="price"
                    control={control}
                    render={({ field }) => (
                      <StyledTextField
                        {...field}
                        fullWidth
                        placeholder="أدخل السعر"
                        type="number"
                        error={!!errors.price}
                        helperText={errors.price?.message}
                        InputProps={{
                          endAdornment: <InputAdornment position="end">جنيه</InputAdornment>,
                        }}
                        sx={{ mb: 2 }}
                      />
                    )}
                  />

                  <Typography variant="body2" sx={{ mb: 1, color: '#666', fontWeight: 500, fontSize: '20px' }}>
                    المساحة
                  </Typography>
                  <Controller
                    name="area"
                    control={control}
                    render={({ field }) => (
                      <StyledTextField
                        {...field}
                        fullWidth
                        placeholder="أدخل المساحة"
                        type="number"
                        error={!!errors.area}
                        helperText={errors.area?.message}
                        InputProps={{
                          endAdornment: <InputAdornment position="end">م²</InputAdornment>,
                        }}
                        sx={{ mb: 2 }}
                      />
                    )}
                  />

                  <Typography variant="body2" sx={{ mb: 1, color: '#666', fontWeight: 500, fontSize: '20px' }}>
                    تاريخ البناء
                  </Typography>
                  <Controller
                    name="buildingDate"
                    control={control}
                    render={({ field }) => (
                      <StyledTextField
                        {...field}
                        fullWidth
                        type="date"
                        error={!!errors.buildingDate}
                        helperText={errors.buildingDate?.message}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <CalendarToday />
                            </InputAdornment>
                          ),
                        }}
                      />
                    )}
                  />
                </Grid>

                {/* Divider */}
                <Grid item xs={12} md={12} lg={12}>
                  <Divider sx={{ my: 3, borderColor: '#e0e0e0' }} />
                </Grid>

                {/* Images and Location */}
                <Grid item xs={12} md={12} lg={12} width={'100%'}>
                  <Typography variant="h6" sx={{ mb: 3, color: '#6E00FE', fontWeight: 600 }}>
                    <Image sx={{ mr: 1, verticalAlign: 'middle', ml: '6px', mt: '-6px' }} />
                    الصور والموقع
                  </Typography>

                  <Typography variant="body2" sx={{ color: '#666', fontSize: '20px', mt: '40px' }}>
                    الصور مطلوبة (1-4 صور) *
                  </Typography>
                  <Box sx={{ display: 'flex', gap: '10px', marginBottom: '30px', flexDirection: 'column' }}>
                    <Button
                      variant="outlined"
                      component="label"
                      startIcon={<Add sx={{ marginLeft: '10px' }} />}
                      fullWidth
                      sx={{
                        height: '49px',
                        marginTop: '2px',
                        borderRadius: '12px',
                        py: 1.5,
                        borderColor: imageError ? '#d32f2f' : '#c6c9c9ff',
                        color: imageError ? '#d32f2f' : '#6E00FE',
                        '&:hover': {
                          borderColor: imageError ? '#d32f2f' : '#5a00d4',
                          backgroundColor: imageError ? 'rgba(211, 47, 47, 0.04)' : 'rgba(110, 0, 254, 0.04)',
                        },
                      }}
                    >
                      رفع الصور
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        hidden
                        onChange={handleImageUpload}
                      />
                    </Button>

                    {imageError && (
                      <Typography
                        variant="body2"
                        sx={{
                          color: '#d32f2f',
                          fontSize: '0.75rem',
                          mb: 2,
                          textAlign: 'right'
                        }}
                      >
                        {imageError}
                      </Typography>
                    )}

                    <ImagePreviewBox>
                      {images.map((image, index) => (
                        <ImagePreview key={index}>
                          <img
                            src={URL.createObjectURL(image)}
                            alt={`صورة ${index + 1}`}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                          <IconButton
                            size="small"
                            onClick={() => removeImage(index)}
                            sx={{
                              position: 'absolute',
                              top: 4,
                              right: 4,
                              backgroundColor: 'rgba(255, 255, 255, 0.8)',
                              '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.9)' },
                            }}
                          >
                            <Delete fontSize="small" />
                          </IconButton>
                        </ImagePreview>
                      ))}
                    </ImagePreviewBox>

                    {images.length > 0 && (
                      <Typography
                        variant="body2"
                        sx={{
                          mt: 1,
                          color: images.length >= 1 ? '#2e7d32' : '#d32f2f',
                          fontSize: '0.75rem',
                          textAlign: 'right'
                        }}
                      >
                        تم رفع {images.length} من 4 صور
                      </Typography>
                    )}

                    <Divider sx={{ my: 3 }} />

                    {/* زر تفعيل الخريطة */}
                    <Button
                      variant="outlined"
                      startIcon={<Map sx={{ marginLeft: '10px' }} />}
                      fullWidth
                      sx={{ borderRadius: '12px', py: 1.5 }}
                      onClick={() => setEnableMapPick((prev) => !prev)}
                      type="button"
                    >
                      {enableMapPick ? 'إلغاء اختيار الموقع من الخريطة' : 'تفعيل اختيار الموقع على الخريطة'}
                    </Button>

                    {/* عرض الخريطة عند التفعيل */}
                    {enableMapPick && (
                      <Box
                        sx={{
                          height: '400px',
                          width: '50%',
                          borderRadius: '12px',
                          overflow: 'hidden',
                          mt: 2,
                          boxShadow: 3,
                          border: 'none'
                        }}
                      >
                        <MapPicker onLocationSelect={(location) => setCoordinates(location)} />
                      </Box>
                    )}
                  </Box>

                  <Typography variant="body2" sx={{ mb: 1, color: '#666', fontWeight: 500, fontSize: '20px' }}>
                    العنوان التفصيلي
                  </Typography>
                  <Controller
                    name="address"
                    control={control}
                    render={({ field }) => (
                      <StyledTextField
                        {...field}
                        fullWidth
                        placeholder="اكتب العنوان التفصيلي"
                        error={!!errors.address}
                        helperText={errors.address?.message}
                        sx={{ mb: 2 }}
                      />
                    )}
                  />
                </Grid>

                {/* Divider */}
                <Grid item xs={12}>
                  <Divider sx={{ borderColor: '#000000ff' }} />
                </Grid>

                {/* Location Details */}
                <Grid item xs={12} md={6} width={'100%'} mt={'20px'}>
                  <Typography variant="h6" sx={{ mb: 3, color: '#6E00FE', fontWeight: 600 }}>
                    <LocationOn sx={{ mr: 1, verticalAlign: 'middle', ml: '6px', mt: '-6px' }} />
                    تفاصيل الموقع
                  </Typography>

                  <Typography variant="body2" sx={{ mb: 1, color: '#666', fontWeight: 500, fontSize: '20px' }}>
                    المحافظة
                  </Typography>
                  <Controller
                    name="governorate"
                    control={control}
                    render={({ field }) => (
                      <StyledTextField
                        {...field}
                        fullWidth
                        placeholder="اكتب اسم المحافظة"
                        error={!!errors.governorate}
                        helperText={errors.governorate?.message}
                        sx={{ mb: 2 }}
                      />
                    )}
                  />

                  <Typography variant="body2" sx={{ mb: 1, color: '#666', fontWeight: 500, fontSize: '20px' }}>
                    المدينة
                  </Typography>
                  <Controller
                    name="city"
                    control={control}
                    render={({ field }) => (
                      <StyledTextField
                        {...field}
                        fullWidth
                        placeholder="اكتب اسم المدينة"
                        error={!!errors.city}
                        helperText={errors.city?.message}
                        sx={{ mb: 2 }}
                      />
                    )}
                  />
                </Grid>

                {/* Divider */}
                <Grid item xs={12}>
                  <Divider sx={{ my: 3, borderColor: '#e0e0e0' }} />
                </Grid>

                {/* Contact Information */}
                <Grid item xs={12} md={6} width={'100%'}>
                  <Typography variant="h6" sx={{ mb: 3, color: '#6E00FE', fontWeight: 600 }}>
                    <Person sx={{ mr: 1, verticalAlign: 'middle', ml: '6px', mt: '-6px' }} />
                    معلومات التواصل
                  </Typography>
                  <Box sx={{ display: 'flex', gap: '10px' }}>

                    <Box width={'100%'}>
                      <Typography variant="body2" sx={{ mb: 1, color: '#666', fontWeight: 500, fontSize: '20px' }}>
                        رقم الهاتف
                      </Typography>
                      <Controller
                        name="phone"
                        control={control}
                        render={({ field }) => (
                          <StyledTextField
                            {...field}
                            fullWidth
                            placeholder="أدخل رقم الهاتف"
                            error={!!errors.phone}
                            helperText={errors.phone?.message}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <Phone />
                                </InputAdornment>
                              ),
                            }}
                            sx={{ mb: 2 }}
                          />
                        )}
                      />
                    </Box>
                    <Box width={'100%'}>
                      <Typography variant="body2" sx={{ mb: 1, color: '#666', fontWeight: 500, fontSize: '20px' }}>
                        اسم المستخدم
                      </Typography>
                      <Controller
                        name="username"
                        control={control}
                        render={({ field }) => (
                          <StyledTextField
                            {...field}
                            fullWidth
                            placeholder="أدخل اسم المستخدم"
                            error={!!errors.username}
                            helperText={errors.username?.message}
                            sx={{ mb: 2 }}
                          />
                        )}
                      />
                    </Box>
                  </Box>
                </Grid>

                {/* Divider */}
                <Grid item xs={12}>
                  <Divider sx={{ my: 3, borderColor: '#e0e0e0' }} />
                </Grid>

                {/* Ad Details */}
                <Grid item xs={12} md={6} width={'100%'}>
                  <Typography variant="h6" sx={{ mb: 3, color: '#6E00FE', fontWeight: 600 }}>
                    <Visibility sx={{ mr: 1, verticalAlign: 'middle', ml: '6px', mt: '-6px' }} />
                    تفاصيل الإعلان
                  </Typography>

                  <Typography variant="body2" sx={{ mb: 1, color: '#666', fontWeight: 500, fontSize: '20px' }}>
                    نوع الإعلان
                  </Typography>
                  <Controller
                    name="adType"
                    control={control}
                    render={({ field }) => (
                      <StyledFormControl fullWidth sx={{ mb: 2 }}>
                        <Select
                          {...field}
                          displayEmpty
                          error={!!errors.adType}
                          renderValue={(selected) => {
                            if (!selected) {
                              return <span style={{ color: '#999' }}>اختر نوع الإعلان</span>;
                            }
                            return selected;
                          }}
                        >
                          {adTypes.map((type) => (
                            <MenuItem key={type} value={type}>{type}</MenuItem>
                          ))}
                        </Select>
                        {errors.adType && (
                          <FormHelperText>{errors.adType.message}</FormHelperText>
                        )}
                      </StyledFormControl>
                    )}
                  />

                  <Typography variant="body2" sx={{ mb: 1, color: '#666', fontWeight: 500, fontSize: '20px' }}>
                    حالة الإعلان
                  </Typography>
                  <Controller
                    name="adStatus"
                    control={control}
                    render={({ field }) => (
                      <StyledFormControl fullWidth sx={{ mb: 2 }}>
                        <Select
                          {...field}
                          displayEmpty
                          error={!!errors.adStatus}
                          renderValue={(selected) => {
                            if (!selected) {
                              return <span style={{ color: '#999' }}>اختر حالة الإعلان</span>;
                            }
                            return selected;
                          }}
                        >
                          {adStatuses.map((status) => (
                            <MenuItem key={status} value={status}>{status}</MenuItem>
                          ))}
                        </Select>
                        {errors.adStatus && (
                          <FormHelperText>{errors.adStatus.message}</FormHelperText>
                        )}
                      </StyledFormControl>
                    )}
                  />

                  <Typography variant="body2" sx={{ mb: 1, color: '#666', fontWeight: 500, fontSize: '20px' }}>
                    الوصف
                  </Typography>
                  <Controller
                    name="description"
                    control={control}
                    render={({ field }) => (
                      <StyledTextField
                        {...field}
                        fullWidth
                        placeholder="اكتب وصف مفصل للعقار"
                        multiline
                        rows={4}
                        error={!!errors.description}
                        helperText={errors.description?.message}
                        sx={{ mb: 2 }}
                      />
                    )}
                  />
                </Grid>

                {/* Divider */}
                <Grid item xs={12}>
                  <Divider sx={{ my: 3, borderColor: '#e0e0e0' }} />
                </Grid>

                {/* Activation Settings */}
                <Grid item xs={12} md={6} width={'100%'}>
                  <Typography variant="h6" sx={{ mb: 3, color: '#6E00FE', fontWeight: 600, fontSize: '20px' }}>
                    <AttachMoney sx={{ mr: 1, verticalAlign: 'middle', ml: '6px', mt: '-6px' }} />
                    إعدادات التفعيل
                  </Typography>

                  <Controller
                    name="adsActivation"
                    control={control}
                    render={({ field }) => (
                      <FormControlLabel
                        control={
                          <Switch
                            checked={field.value}
                            onChange={field.onChange}
                            color="primary"
                          />
                        }
                        label="تفعيل الإعلان"
                        sx={{ mb: 2 }}
                      />
                    )}
                  />

                  {adsActivation && (
                    <Controller
                      name="activationDays"
                      control={control}
                      render={({ field }) => (
                        <StyledTextField
                          {...field}
                          fullWidth
                          label="عدد أيام التفعيل"
                          type="number"
                          InputProps={{
                            endAdornment: <InputAdornment position="end">أيام</InputAdornment>,
                          }}
                        />
                      )}
                    />
                  )}
                </Grid>
              </Container>
            </CardContent>
          </StyledCard>

          {/* إضافة مكون الباقات */}
          <AdPackagesClient selectedPackageId={selectedPackage} setSelectedPackageId={setSelectedPackage} />

          {/* خريطة عرض الموقع */}
          {coordinates && (
            <Box sx={{ my: 3 }}>
              <Typography variant="body2" sx={{ mb: 1, color: '#666', fontWeight: 500, fontSize: '20px' }}>
                الموقع على الخريطة
              </Typography>
              <MapDisplay location={coordinates} setLocation={enableMapPick ? setCoordinates : () => { }} />
            </Box>
          )}

          {/* Action Buttons */}
          <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'center' }}>
            <Button
              type="submit"
              variant="contained"
              size="large"
              sx={{
                borderRadius: '12px',
                px: 4,
                py: 1.5,
                fontSize: '1.1rem',
                fontWeight: 600,
                backgroundColor: '#6E00FE',
                '&:hover': {
                  backgroundColor: '#5a00d4',
                },
              }}
            >
              أضف الإعلان
            </Button>

            <Button
              type="button"
              variant="outlined"
              size="large"
              onClick={handleReset}
              sx={{
                borderRadius: '12px',
                px: 4,
                py: 1.5,
                fontSize: '1.1rem',
                fontWeight: 600,
                borderColor: '#6E00FE',
                color: '#6E00FE',
                '&:hover': {
                  borderColor: '#5a00d4',
                  backgroundColor: 'rgba(110, 0, 254, 0.04)',
                },
              }}
            >
              إعادة تعيين
            </Button>
          </Box>
          {submitError && (
            <Alert severity="error" sx={{ mb: 2 }}>{submitError}</Alert>
          )}
        </Box>

        <Snackbar
          open={showSuccess}
          autoHideDuration={6000}
          onClose={() => setShowSuccess(false)}
        >
          <Alert onClose={() => setShowSuccess(false)} severity="success" sx={{ width: '100%' }}>
            تم إضافة الإعلان بنجاح!
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
};

export default ModernRealEstateForm;