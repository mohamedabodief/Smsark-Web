import React, { useState, useEffect, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import "../styles/ModernRealEstateForm.css";
import ClientAdvertisement from "../FireBase/modelsWithOperations/ClientAdvertisemen";
import RealEstateDeveloperAdvertisement from "../FireBase/modelsWithOperations/RealEstateDeveloperAdvertisement";
import { storage } from "../FireBase/firebaseConfig";
import PaymentMethods from "./PaymentMethods";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
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
  FormHelperText,
} from "@mui/material";
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
  Map,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import MapPicker from "../LocationComponents/MapPicker";
import { useNavigate, useLocation } from "react-router-dom";
import AdPackagesClient from "../../packages/packagesClient";
import { getAuth } from "firebase/auth";
import { auth } from '../FireBase/firebaseConfig';
import useReverseGeocoding from "../LocationComponents/useReverseGeocoding";

// Custom styled components
const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: "12px",
  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
  transition: "all 0.3s ease",
  "&:hover": {
    boxShadow: "0 4px 16px rgba(0, 0, 0, 0.15)",
  },
  marginBottom: theme.spacing(3),
}));

const StyledTextField = styled(TextField)(({ hasError }) => ({
  "& .MuiInputBase-root": {
    borderRadius: "12px",
    backgroundColor: "#f8f9fa",
    "&:hover": {
      backgroundColor: "#f1f3f4",
    },
    "&.Mui-focused": {
      backgroundColor: "#ffffff",
    },
  },
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: hasError ? "#d32f2f" : "#e0e0e0",
  },
  "&:hover .MuiOutlinedInput-notchedOutline": {
    borderColor: hasError ? "#d32f2f" : "#1976d2",
  },
  "& .Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: hasError ? "#d32f2f" : "#1976d2",
  },
  "& .MuiFormHelperText-root": {
    color: "#d32f2f",
    fontSize: "0.75rem",
    textAlign: "right",
    marginRight: "14px",
    marginTop: "4px",
  },
  "& .MuiInputLabel-root": {
    textAlign: "right",
    right: "auto",
    left: "auto",
    transformOrigin: "right",
  },
  "& .MuiInputLabel-shrink": {
    transform: "translate(14px, -9px) scale(0.75)",
  },
}));

const StyledFormControl = styled(FormControl)(({ hasError }) => ({
  "& .MuiInputBase-root": {
    borderRadius: "12px",
    backgroundColor: "#f8f9fa",
    "&:hover": {
      backgroundColor: "#f1f3f4",
    },
    "&.Mui-focused": {
      backgroundColor: "#ffffff",
    },
  },
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: hasError ? "#d32f2f" : "#e0e0e0",
  },
  "&:hover .MuiOutlinedInput-notchedOutline": {
    borderColor: hasError ? "#d32f2f" : "#1976d2",
  },
  "& .Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: hasError ? "#d32f2f" : "#1976d2",
  },
  "& .MuiFormHelperText-root": {
    color: "#d32f2f",
    fontSize: "0.75rem",
    textAlign: "right",
    marginRight: "14px",
    marginTop: "4px",
  },
  "& .MuiInputLabel-root": {
    textAlign: "right",
    right: "auto",
    left: "auto",
    transformOrigin: "right",
  },
  "& .MuiInputLabel-shrink": {
    transform: "translate(14px, -9px) scale(0.75)",
  },
}));

const ImagePreviewBox = styled(Box)(({ theme }) => ({
  display: "flex",
  flexWrap: "wrap",
  gap: theme.spacing(2),
  marginTop: theme.spacing(2),
}));

const ImagePreview = styled(Box)(() => ({
  position: "relative",
  width: 120,
  height: 120,
  borderRadius: "8px",
  overflow: "hidden",
  border: "2px dashed #ccc",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "#f8f9fa",
  cursor: "pointer",
  "&:hover": {
    borderColor: "#1976d2",
    backgroundColor: "#f1f3f4",
  },
}));

// Yup validation schema
const validationSchema = yup.object().shape({
  title: yup.string().required("عنوان الإعلان مطلوب"),
  propertyType: yup.string().required("نوع العقار مطلوب"),
  price: yup
    .number()
    .positive("السعر يجب أن يكون رقمًا موجباً")
    .required("السعر مطلوب"),
  area: yup
    .number()
    .positive("المساحة يجب أن تكون رقمًا موجباً")
    .required("المساحة مطلوبة"),
  buildingDate: yup.string().required("تاريخ البناء مطلوب"),
  fullAddress: yup.string().required("العنوان الكامل مطلوب"),
  city: yup.string().required("المدينة مطلوبة"),
  governorate: yup.string().required("المحافظة مطلوبة"),
  phone: yup.string().required("رقم الهاتف مطلوب"),
  username: yup.string().required("اسم المستخدم مطلوب"),
  adType: yup.string().required("نوع الإعلان مطلوب"),
  adStatus: yup.string().required("حالة الإعلان مطلوبة"),
  description: yup.string().required("الوصف مطلوب"),
  adsActivation: yup.boolean(),
  activationDays: yup.number().when("adsActivation", {
    is: true,
    then: (schema) =>
      schema
        .positive("عدد الأيام يجب أن يكون رقمًا موجباً")
        .required("عدد أيام التفعيل مطلوب عند تفعيل الإعلان"),
    otherwise: (schema) => schema.nullable(),
  }),
});

// Function to upload images to Firebase Storage
const uploadImagesAndGetUrls = async (imageFiles, userId) => {
  const urls = [];
  for (let i = 0; i < imageFiles.length; i++) {
    const file = imageFiles[i];
    const storageRef = ref(
      storage,
      `property_images/${userId}/${Date.now()}_${file.name}`
    );
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);
    urls.push(url);
  }
  return urls;
};

// Function to upload receipt to Firebase Storage
const uploadReceiptAndGetUrl = async (receiptImage, userId, adId) => {
  const storageRef = ref(
    storage,
    `property_images/${userId}/${adId}_receipt.jpg`
  );
  console.log(
    "[DEBUG] Uploading receipt to:",
    `property_images/${userId}/${adId}_receipt.jpg`
  );
  await uploadBytes(storageRef, receiptImage);
  const url = await getDownloadURL(storageRef);
  console.log("[DEBUG] Receipt uploaded to:", url);
  return url;
};

const ModernRealEstateForm = () => {
  const [images, setImages] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [imageError, setImageError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [coordinates, setCoordinates] = useState(null);
  const [enableMapPick, setEnableMapPick] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [receiptImage, setReceiptImage] = useState(null);
  const [isGeocodingLoading, setIsGeocodingLoading] = useState(false);
  const [geocodingError, setGeocodingError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  
  // Debug the location state
  console.log('[DEBUG] Location state received:', location.state);
  console.log('[DEBUG] Location state adData:', location.state?.adData);
  console.log('[DEBUG] Location state editMode:', location.state?.editMode);
  
  // Extract data with proper destructuring
  const { adData, editMode } = location.state || {};
  const editData = adData || null;
  const isEditMode = editMode || false;
  
  // Extract and store the advertisement ID separately
  const adId = adData?.id || editData?.id;
  
  // Debug the extracted data
  console.log('[DEBUG] Extracted editData:', editData);
  console.log('[DEBUG] Extracted isEditMode:', isEditMode);
  console.log('[DEBUG] Extracted adId:', adId);
  console.log('[DEBUG] EditData ID:', editData?.id);
  console.log('[DEBUG] adData ID:', adData?.id);
  
  const prevAddressFromMap = useRef(null);
  const userId = auth.currentUser?.uid;

  // Use reverse geocoding to get address
  const addressFromMap = useReverseGeocoding(coordinates);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    watch,
    setValue,
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      title: '',
      propertyType: '',
      price: '',
      area: '',
      buildingDate: '',
      fullAddress: '',
      city: '',
      governorate: '',
      phone: '',
      username: '',
      adType: '',
      adStatus: '',
      description: '',
      adsActivation: false,
      activationDays: 7,
    }
  });

  // Reset form when editData changes (for edit mode)
  useEffect(() => {
    console.log('[DEBUG] useEffect triggered - isEditMode:', isEditMode, 'editData:', editData);
    console.log('[DEBUG] adId in useEffect:', adId);
    
    if (isEditMode && editData) {
      console.log('[DEBUG] Resetting form with edit data');
      console.log('[DEBUG] EditData ID in reset:', editData.id);
      console.log('[DEBUG] adId in reset:', adId);
      console.log('[DEBUG] EditData title:', editData.title);
      
      // Validate that we have a valid ID
      if (!adId) {
        console.error('[DEBUG] No valid ID found for edit mode');
        console.error('[DEBUG] adData:', adData);
        console.error('[DEBUG] editData:', editData);
        return;
      }
      
      reset({
        title: editData.title || '',
        propertyType: editData.type || '',
        price: editData.price || '',
        area: editData.area || '',
        buildingDate: editData.date_of_building || '',
        fullAddress: editData.address || '',
        city: editData.city || '',
        governorate: editData.governorate || '',
        phone: editData.phone || '',
        username: editData.user_name || '',
        adType: editData.ad_type || '',
        adStatus: editData.ad_status || '',
        description: editData.description || '',
        adsActivation: editData.ads || false,
        activationDays: editData.adExpiryTime ? Math.round((editData.adExpiryTime - Date.now()) / (24 * 60 * 60 * 1000)) : 7,
      });
    }
  }, [isEditMode, editData, adId, reset]);

  // عند التعديل، عرّض الصور القديمة للمعاينة
  useEffect(() => {
    if (isEditMode && editData && Array.isArray(editData.images)) {
      setImages([]);
      setImageError("");
      console.log('[DEBUG] Initializing edit mode with data:', editData);
      console.log('[DEBUG] Advertisement ID:', editData.id);
      
      // Set coordinates if available
      if (editData.location?.lat && editData.location?.lng) {
        setCoordinates({
          lat: editData.location.lat,
          lng: editData.location.lng,
        });
      }
      
      // Clear any existing image errors
      setImageError('');
      
      // Note: We don't set images here as they are handled by the form's default values
      // and the user can add new images if needed
    }
  }, [isEditMode, editData]);

  // Set selected package for edit mode
  useEffect(() => {
    if (isEditMode && editData && editData.adPackage) {
      setSelectedPackage(editData.adPackage);
    }
  }, [isEditMode, editData]);



  // تحديث حقول العنوان بناءً على addressFromMap
  // Update address fields based on map selection
  useEffect(() => {
    console.log(
      "[DEBUG] addressFromMap in ModernRealEstateForm:",
      addressFromMap
    );
    if (!enableMapPick || !addressFromMap || !coordinates) return;
    if (
      prevAddressFromMap.current &&
      prevAddressFromMap.current.full === addressFromMap.full &&
      prevAddressFromMap.current.city === addressFromMap.city &&
      prevAddressFromMap.current.governorate === addressFromMap.governorate
    )
      return;

    setIsGeocodingLoading(true);
    const timer = setTimeout(() => {
      if (
        addressFromMap.full &&
        addressFromMap.city &&
        addressFromMap.governorate
      ) {
        setValue("fullAddress", addressFromMap.full, { shouldValidate: true });
        setValue("city", addressFromMap.city, { shouldValidate: true });
        setValue("governorate", addressFromMap.governorate, {
          shouldValidate: true,
        });
        setGeocodingError("");
      } else {
        setGeocodingError("فشل جلب العنوان من الخريطة. حاولي مرة أخرى.");
      }
      setIsGeocodingLoading(false);
      prevAddressFromMap.current = addressFromMap;
    }, 500);
    return () => clearTimeout(timer);
  }, [addressFromMap, enableMapPick, coordinates, setValue]);

  const addressValue = watch("fullAddress");
  const cityValue = watch("city");
  const governorateValue = watch("governorate");
  const adsActivation = watch("adsActivation");

  // Handle location selection from MapPicker
  const handleLocationSelect = (location) => {
    console.log("[DEBUG] إحداثيات الموقع المختار:", location);
    if (location && location.lat && location.lng) {
      setCoordinates(location);
    }
  };

  // Fetch coordinates using Nominatim
  useEffect(() => {
    const fetchCoordinates = async () => {
      if (!addressValue && !cityValue && !governorateValue) return;
      if (enableMapPick) return;
      const fullAddress = `${addressValue || ""}, ${cityValue || ""}, ${
        governorateValue || ""
      }`;
      const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
        fullAddress
      )}&format=json&addressdetails=1`;
      try {
        const res = await fetch(url, {
          headers: {
            "User-Agent": "MyRealEstateApp/1.0 (your.email@example.com)",
          },
        });
        const data = await res.json();
        console.log("[DEBUG] استجابة Nominatim للإحداثيات:", data);
        if (data.length > 0) {
          const { lat, lon } = data[0];
          const newCoordinates = { lat: parseFloat(lat), lng: parseFloat(lon) };
          if (
            !coordinates ||
            coordinates.lat !== newCoordinates.lat ||
            coordinates.lng !== newCoordinates.lng
          ) {
            setCoordinates(newCoordinates);
          }
        } else {
          console.error("[DEBUG] فشل جلب الإحداثيات: لا توجد نتائج");
        }
      } catch (err) {
        console.error("[DEBUG] فشل جلب الإحداثيات:", err);
      }
    };
    fetchCoordinates();
  }, [addressValue, cityValue, governorateValue, enableMapPick, coordinates]);

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    
    // For edit mode, allow up to 4 total images (existing + new)
    // For new mode, allow up to 4 new images
    const maxImages = 4;
    const currentImageCount = isEditMode ? 
      (editData?.images?.length || 0) + images.length : 
      images.length;
    
    if (currentImageCount + files.length > maxImages) {
      setImageError(`يمكنك إضافة ${maxImages} صور كحد أقصى`);
      return;
    }

    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    const invalidFiles = files.filter(
      (file) => !validTypes.includes(file.type)
    );
    if (invalidFiles.length > 0) {
      setImageError("يرجى إضافة صور بصيغة JPG, PNG, أو WebP فقط");
      return;
    }

    setImages((prev) => [...prev, ...files]);
    setImageError("");
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImageError("");
  };

  const onSubmit = async (data) => {
    console.log('[DEBUG] onSubmit called');
    console.log('[DEBUG] isEditMode:', isEditMode);
    console.log('[DEBUG] adId:', adId);
    console.log('[DEBUG] editData:', editData);
    console.log('[DEBUG] form data:', data);
    
    
    // Validate images for new advertisements
    setSubmitError("");
    if (!isEditMode && images.length === 0) {
      setImageError("الصور مطلوبة، أضف 4 صور على الأكثر");
      return;
    }

    const auth = getAuth();
    if (!auth.currentUser) {
      setSubmitError("يجب تسجيل الدخول لإضافة إعلان.");
      return;
    }

    console.log("[DEBUG] Current user UID:", auth.currentUser?.uid);
    console.log("[DEBUG] Selected package:", selectedPackage);
    console.log("[DEBUG] Receipt image before save:", receiptImage);
    if (isEditMode) {
      if (!editData) {
        setSubmitError('بيانات الإعلان غير متوفرة للتعديل.');
        return;
      }
      
      if (!adId) {
        console.error('[DEBUG] adId is missing:', adId);
        setSubmitError('معرف الإعلان غير صالح للتعديل.');
        return;
      }
    }
    if (
      isEditMode &&
      (!adId || adId === undefined || adId === null)
    ) {
      console.error('[DEBUG] Missing advertisement ID for edit mode');
      console.error('[DEBUG] adId value:', adId);
      setSubmitError("لا يمكن تعديل إعلان بدون معرف (ID).");
      return;
    }
    try  {
      // Upload property images if any
      let imageUrls = [];
      if (images.length > 0) {
        try {
          imageUrls = await uploadImagesAndGetUrls(
            images,
            auth.currentUser.uid
          );
          console.log("[DEBUG] Image URLs after upload:", imageUrls);
        } catch (error) {
          console.error("[DEBUG] Error uploading property images:", error);
          setSubmitError("فشل رفع الصور. تأكد من صلاحيات التخزين.");
          return;
        }
      }      

      let adId;
      if (isEditMode && editData) {
        adId = editData.id; // Set adId from editData
        console.log('[DEBUG] Starting advertisement update with ID:', adId);
        console.log('[DEBUG] Using adId:', adId);
        
        const adObject = { ...editData, id: adId };
        console.log('[DEBUG] Ad object being passed to RealEstateDeveloperAdvertisement constructor:', JSON.stringify(adObject, null, 2));
        console.log('[DEBUG] adId value in adObject:', adObject.id);
        
        const ad = new ClientAdvertisement(adObject);
        console.log('[DEBUG] RealEstateDeveloperAdvertisement instance created with ID:', ad.id);
        
        // Validate that the advertisement has a valid ID
        if (!ad.id) {
          console.error('[DEBUG] Advertisement instance has no ID:', ad);
          setSubmitError('معرف الإعلان غير صالح للتعديل.');
          return;
        }
        
        const oldImages = Array.isArray(editData.images) ? editData.images : [];
        // const newImageFiles = images;
        // let filesToUpload = null;
        
        // if (newImageFiles.length > 0) {
        //   filesToUpload = newImageFiles;
        // }
        const updatedImages = [...oldImages, ...imageUrls];

        // Prepare update data
        const updateData = {
          title: data.title,
          type: data.propertyType,
          price: data.price,
          area: data.area,
          date_of_building: data.buildingDate,
          location: {
            lat: coordinates?.lat || editData.location?.lat || 0,
            lng: coordinates?.lng || editData.location?.lng || 0,
          },
          address: data.fullAddress,
          city: data.city,
          governorate: data.governorate,
          images:updatedImages,
          phone: data.phone,
          user_name: data.username,
          ad_type: data.adType,
          ad_status: data.adStatus,
          description: data.description,
          ads: data.adsActivation,
          adExpiryTime: data.adsActivation
            ? Date.now() + data.activationDays * 24 * 60 * 60 * 1000
            : null,
          adPackage: selectedPackage ? Number(selectedPackage) : null,
          // Reset status to pending after edit
          reviewStatus: 'pending',
          reviewed_by: null,
          review_note: null,
        };
        
         // Upload receipt if provided
        let receiptUrl = editData.receipt_image;
        if (receiptImage) {
          try {
            receiptUrl = await uploadReceiptAndGetUrl(
              receiptImage,
              auth.currentUser.uid,
              editData.id
            );
          } catch (error) {
            console.error("[DEBUG] Error uploading receipt image:", error);
            if (error.code === "storage/unauthorized") {
              setSubmitError(
                "ليس لديك إذن لرفع صورة الإيصال. تحقق من إعدادات التخزين في Firebase."
              );
            } else {
              setSubmitError("فشل رفع صورة الإيصال: " + error.message);
            }
            return;
          }
        }

        console.log('[DEBUG] Update data:', updateData);
        console.log('[DEBUG] Files to upload:', updatedImages);
        console.log('[DEBUG] Ad instance ID:', ad.id);
        console.log('[DEBUG] Receipt URL:', receiptUrl);

        await ad.update(updateData, receiptUrl);
        console.log('[DEBUG] Advertisement updated successfully:', adId);
        
        await ad.returnToPending();
        setShowSuccess(true);
        handleReset();
        // Navigate to details page or back to dashboard
        setTimeout(() => {
          navigate(`/detailsForClient/${adId}`);
        }, 1500);
      
} else {
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
          address: data.fullAddress,
          city: data.city,
          governorate: data.governorate,
          phone: data.phone,
          user_name: data.username,
          userId: auth.currentUser.uid,
          ad_type: data.adType,
          ad_status: data.adStatus,
          type_of_user: "client",
          ads: data.adsActivation,
          adExpiryTime: data.adsActivation
            ? Date.now() + data.activationDays * 24 * 60 * 60 * 1000
            : null,
          description: data.description,
          images: imageUrls,
          adPackage: selectedPackage ? Number(selectedPackage) : null,
        };
        console.log("[DEBUG] بيانات الإعلان الجديد:", adData);
        const ad = new ClientAdvertisement(adData);
        adId = await ad.save(imageUrls, null); // Save without receipt initially
        console.log("[DEBUG] Ad saved with ID:", adId);

        // Upload receipt if provided
        let receiptUrl = null;
        if (receiptImage) {
          try {
            receiptUrl = await uploadReceiptAndGetUrl(
              receiptImage,
              auth.currentUser.uid,
              adId
            );
            await ad.update({ receipt_image: receiptUrl });
            console.log(
              "[DEBUG] Receipt URL updated in Firestore:",
              receiptUrl
            );
          } catch (error) {
            console.error("[DEBUG] Error uploading receipt image:", error);
            if (error.code === "storage/unauthorized") {
              setSubmitError(
                "ليس لديك إذن لرفع صورة الإيصال. تحقق من إعدادات التخزين في Firebase."
              );
            } else {
              setSubmitError("فشل رفع صورة الإيصال: " + error.message);
            }
            return;
          }
        }
      }

      setShowSuccess(true);
      handleReset();
      setTimeout(() => {
        navigate(`/detailsForClient/${adId}`);
      }, 1500);
    } catch (error) {
      setSubmitError(error.message || "حدث خطأ أثناء إضافة الإعلان.");
      console.error("[DEBUG] خطأ أثناء إضافة/تعديل الإعلان:", error);
    }
  };

  const handleReset = () => {
    reset();
    setImages([]);
    setImageError("");
    setCoordinates(null);
    setGeocodingError("");
    setSelectedPackage(null);
    setReceiptImage(null);
  };

  const propertyTypes = ["شقة", "فيلا", "استوديو", "دوبلكس", "محل تجاري"];
  const adTypes = ["بيع", "إيجار", "شراء"];
  const adStatuses = ["تحت العرض", "تحت التفاوض", "منتهي"];

  return (
    <>
      <Box
        className="modern-form-container"
        sx={{
          minHeight: "100vh",
          backgroundColor: "#f5f5f5",
          py: -2,
          direction: "rtl",
        }}
      >
        <Container maxWidth="lg" sx={{ direction: "rtl" }}>
          <Typography
            variant="h3"
            component="h1"
            sx={{
              mb: 1,
              mt: "100px",
              fontWeight: 700,
              color: "#6E00FE",
              textAlign: "center",
              fontFamily: "Cairo, Noto Kufi Arabic, sans-serif",
            }}
          >
            {isEditMode ? "تعديل إعلان عقاري" : "إضافة إعلان عقاري"}
          </Typography>

          <Typography
            variant="h6"
            sx={{
              mb: 4,
              color: "#666",
              textAlign: "center",
              fontFamily: "Cairo, Noto Kufi Arabic, sans-serif",
              marginTop: "20px",
            }}
          >
            أضف تفاصيل عقارك وابدأ في التواصل مع العملاء المحتملين
          </Typography>

          <Box
            component="form"
            onSubmit={(e) => {
              handleSubmit(onSubmit)(e);
            }} 
            width={"100%"}
            sx={{ direction: "rtl" }}
          >
            <StyledCard>
              <CardContent>
                <Container
                  maxWidth="lg"
                  sx={{ display: "flex", flexDirection: "column" }}
                >
                  {/* Basic Information */}
                  <Grid item width={"100%"}>
                    <Typography
                      variant="h6"
                      sx={{ mb: 3, color: "#6E00FE", fontWeight: 600 }}
                    >
                      <Home
                        sx={{
                          mr: 1,
                          verticalAlign: "middle",
                          ml: "6px",
                          mt: "-6px",
                        }}
                      />
                      المعلومات الأساسية
                    </Typography>

                    <Typography
                      sx={{
                        mb: 1,
                        color: "#666",
                        fontWeight: 500,
                        fontSize: "20px",
                      }}
                    >
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

                    <Typography
                      variant="body2"
                      sx={{
                        mb: 1,
                        color: "#666",
                        fontWeight: 500,
                        fontSize: "20px",
                      }}
                    >
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
                                return (
                                  <span style={{ color: "#999" }}>
                                    اختر نوع العقار
                                  </span>
                                );
                              }
                              return selected;
                            }}
                          >
                            {propertyTypes.map((type) => (
                              <MenuItem key={type} value={type}>
                                {type}
                              </MenuItem>
                            ))}
                          </Select>
                          {errors.propertyType && (
                            <FormHelperText>
                              {errors.propertyType.message}
                            </FormHelperText>
                          )}
                        </StyledFormControl>
                      )}
                    />

                    <Typography
                      variant="body2"
                      sx={{
                        mb: 1,
                        color: "#666",
                        fontWeight: 500,
                        fontSize: "20px",
                      }}
                    >
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
                            endAdornment: (
                              <InputAdornment position="end">
                                جنيه
                              </InputAdornment>
                            ),
                          }}
                          sx={{ mb: 2 }}
                        />
                      )}
                    />

                    <Typography
                      variant="body2"
                      sx={{
                        mb: 1,
                        color: "#666",
                        fontWeight: 500,
                        fontSize: "20px",
                      }}
                    >
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
                            endAdornment: (
                              <InputAdornment position="end">م²</InputAdornment>
                            ),
                          }}
                          sx={{ mb: 2 }}
                        />
                      )}
                    />

                    <Typography
                      variant="body2"
                      sx={{
                        mb: 1,
                        color: "#666",
                        fontWeight: 500,
                        fontSize: "20px",
                      }}
                    >
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

                  <Divider sx={{ my: 3, borderColor: "#e0e0e0" }} />

                  {/* Images and Location */}
                  <Grid item xs={12} md={12} lg={12} width={"100%"}>
                    <Typography
                      variant="h6"
                      sx={{ mb: 3, color: "#6E00FE", fontWeight: 600 }}
                    >
                      <Image
                        sx={{
                          mr: 1,
                          verticalAlign: "middle",
                          ml: "6px",
                          mt: "-6px",
                        }}
                      />
                      الصور والموقع
                    </Typography>

                    <Typography
                      variant="body2"
                      sx={{ color: "#666", fontSize: "20px", mt: "40px" }}
                    >
                      الصور مطلوبة (1-4 صور) *
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        gap: "10px",
                        marginBottom: "30px",
                        flexDirection: "column",
                      }}
                    >
                      <Button
                        variant="outlined"
                        component="label"
                        startIcon={<Add sx={{ marginLeft: "10px" }} />}
                        fullWidth
                        sx={{
                          height: "49px",
                          marginTop: "2px",
                          borderRadius: "12px",
                          py: 1.5,
                          borderColor: imageError ? "#d32f2f" : "#c6c9c9ff",
                          color: imageError ? "#d32f2f" : "#6E00FE",
                          "&:hover": {
                            borderColor: imageError ? "#d32f2f" : "#5a00d4",
                            backgroundColor: imageError
                              ? "rgba(211, 47, 47, 0.04)"
                              : "rgba(110, 0, 254, 0.04)",
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
                            color: "#d32f2f",
                            fontSize: "0.75rem",
                            mb: 2,
                            textAlign: "right",
                          }}
                        >
                          {imageError}
                        </Typography>
                      )}

                      <ImagePreviewBox>
                          {/* Show existing images in edit mode */}
                      {isEditMode && editData?.images && editData.images.map((imageUrl, index) => (
                        <ImagePreview key={`existing-${index}`}>
                          <img
                            src={imageUrl}
                            alt={`صورة موجودة ${index + 1}`}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                          <Box
                            sx={{
                              position: 'absolute',
                              top: 4,
                              right: 4,
                              backgroundColor: 'rgba(0, 0, 0, 0.7)',
                              color: 'white',
                              padding: '2px 6px',
                              borderRadius: '4px',
                              fontSize: '0.7rem',
                            }}
                          >
                            موجودة
                          </Box>
                        </ImagePreview>
                      ))}
                        {images.map((image, index) => (
                          <ImagePreview key={index}>
                            <img
                              src={URL.createObjectURL(image)}
                              alt={`صورة جديدة ${index + 1}`}
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                              }}
                            />
                            <IconButton
                              size="small"
                              onClick={() => removeImage(index)}
                              sx={{
                                position: "absolute",
                                top: 4,
                                right: 4,
                                backgroundColor: "rgba(255, 255, 255, 0.8)",
                                "&:hover": {
                                  backgroundColor: "rgba(255, 255, 255, 0.9)",
                                },
                              }}
                            >
                              <Delete fontSize="small" />
                            </IconButton>
                            <Box
                            sx={{
                              position: 'absolute',
                              top: 4,
                              left: 4,
                              backgroundColor: 'rgba(76, 175, 80, 0.9)',
                              color: 'white',
                              padding: '2px 6px',
                              borderRadius: '4px',
                              fontSize: '0.7rem',
                            }}
                          >
                            جديدة
                          </Box>
                          </ImagePreview>
                        ))}
                      </ImagePreviewBox>

                      {(images.length > 0 || (isEditMode && editData?.images?.length > 0)) && (
                        <Typography
                          variant="body2"
                          sx={{
                            mt: 1,
                            color: images.length >= 1 ? "#2e7d32" : "#d32f2f",
                            fontSize: "0.75rem",
                            textAlign: "right",
                          }}
                        >{isEditMode ? (
                          <>
                            الصور الموجودة: {editData?.images?.length || 0} | 
                            الصور الجديدة: {images.length} | 
                            المجموع: {(editData?.images?.length || 0) + images.length} من 4
                          </>
                        ) : (
                          `تم رفع ${images.length} من 4 صور`
                        )}</Typography>
                      )}

                      <Divider sx={{ my: 3 }} />
   <Typography
                      variant="body2"
                      sx={{
                        mb: 1,
                        color: "#666",
                        fontWeight: 500,
                        fontSize: "20px",
                      }}
                    >
                      العنوان التفصيلي
                    </Typography>

                    <Controller
                      name="fullAddress"
                      control={control}
                      render={({ field }) => (
                        <StyledTextField
                          {...field}
                          fullWidth
                          placeholder="اكتب العنوان الكامل"
                          error={!!errors.fullAddress}
                          helperText={errors.fullAddress?.message}
                          sx={{ mb: 2 }}
                        />
                      )}
                    />
                      <Button
                        variant="outlined"
                        startIcon={<Map sx={{ marginLeft: "10px" }} />}
                        fullWidth
                        sx={{ borderRadius: "12px", py: 1.5 }}
                        onClick={() => setEnableMapPick((prev) => !prev)}
                        type="button"
                      >
                        {enableMapPick
                          ? "إلغاء اختيار الموقع من الخريطة"
                          : "تفعيل اختيار الموقع على الخريطة"}
                      </Button>

                      {enableMapPick && (
                        <Box
                          sx={{
                            height: "400px",
                            width: "60%",
                            borderRadius: "12px",
                            overflow: "hidden",
                            boxShadow: 3,
                            border: "none",
                            display: "flex",
                            justifyContent: "center",
                            textAlign: "center",
                            margin: "auto",
                            mt: 4,
                          }}
                        >
                          <MapPicker onLocationSelect={handleLocationSelect} />
                        </Box>
                      )}

                      {isGeocodingLoading && (
                        <Typography
                          variant="body2"
                          sx={{
                            color: "#666",
                            fontSize: "0.75rem",
                            mt: 1,
                            textAlign: "right",
                          }}
                        >
                          جارٍ جلب العنوان...
                        </Typography>
                      )}
                      {geocodingError && (
                        <Typography
                          variant="body2"
                          sx={{
                            color: "#d32f2f",
                            fontSize: "0.75rem",
                            mt: 1,
                            textAlign: "right",
                          }}
                        >
                          {geocodingError}
                        </Typography>
                      )}
                    </Box>

                 
                  </Grid>

                  <Divider sx={{ my: 3, borderColor: "#e0e0e0" }} />

                  {/* Location Details */}
                  <Grid item xs={12} md={12} lg={12} width={"100%"} mt={"20px"}>
                    <Typography
                      variant="h6"
                      sx={{ mb: 3, color: "#6E00FE", fontWeight: 600 }}
                    >
                      <LocationOn
                        sx={{
                          mr: 1,
                          verticalAlign: "middle",
                          ml: "6px",
                          mt: "-6px",
                        }}
                      />
                      تفاصيل الموقع
                    </Typography>

                    <Typography
                      variant="body2"
                      sx={{
                        mb: 1,
                        color: "#666",
                        fontWeight: 500,
                        fontSize: "20px",
                      }}
                    >
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

                    <Typography
                      variant="body2"
                      sx={{
                        mb: 1,
                        color: "#666",
                        fontWeight: 500,
                        fontSize: "20px",
                      }}
                    >
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

                  <Divider sx={{ my: 3, borderColor: "#e0e0e0" }} />

                  {/* Contact Information */}
                  <Grid item xs={12} md={6} width={"100%"}>
                    <Typography
                      variant="h6"
                      sx={{ mb: 3, color: "#6E00FE", fontWeight: 600 }}
                    >
                      <Person
                        sx={{
                          mr: 1,
                          verticalAlign: "middle",
                          ml: "6px",
                          mt: "-6px",
                        }}
                      />
                      معلومات التواصل
                    </Typography>
                    <Box sx={{ display: "flex", gap: "10px" }}>
                      <Box width={"100%"}>
                        <Typography
                          variant="body2"
                          sx={{
                            mb: 1,
                            color: "#666",
                            fontWeight: 500,
                            fontSize: "20px",
                          }}
                        >
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
                      <Box width={"100%"}>
                        <Typography
                          variant="body2"
                          sx={{
                            mb: 1,
                            color: "#666",
                            fontWeight: 500,
                            fontSize: "20px",
                          }}
                        >
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

                  <Divider sx={{ my: 3, borderColor: "#e0e0e0" }} />

                  {/* Ad Details */}
                  <Grid item xs={12} md={6} width={"100%"}>
                    <Typography
                      variant="h6"
                      sx={{ mb: 3, color: "#6E00FE", fontWeight: 600 }}
                    >
                      <Visibility
                        sx={{
                          mr: 1,
                          verticalAlign: "middle",
                          ml: "6px",
                          mt: "-6px",
                        }}
                      />
                      تفاصيل الإعلان
                    </Typography>

                    <Typography
                      variant="body2"
                      sx={{
                        mb: 1,
                        color: "#666",
                        fontWeight: 500,
                        fontSize: "20px",
                      }}
                    >
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
                                return (
                                  <span style={{ color: "#999" }}>
                                    اختر نوع الإعلان
                                  </span>
                                );
                              }
                              return selected;
                            }}
                          >
                            {adTypes.map((type) => (
                              <MenuItem key={type} value={type}>
                                {type}
                              </MenuItem>
                            ))}
                          </Select>
                          {errors.adType && (
                            <FormHelperText>
                              {errors.adType.message}
                            </FormHelperText>
                          )}
                        </StyledFormControl>
                      )}
                    />

                    <Typography
                      variant="body2"
                      sx={{
                        mb: 1,
                        color: "#666",
                        fontWeight: 500,
                        fontSize: "20px",
                      }}
                    >
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
                                return (
                                  <span style={{ color: "#999" }}>
                                    اختر حالة الإعلان
                                  </span>
                                );
                              }
                              return selected;
                            }}
                          >
                            {adStatuses.map((status) => (
                              <MenuItem key={status} value={status}>
                                {status}
                              </MenuItem>
                            ))}
                          </Select>
                          {errors.adStatus && (
                            <FormHelperText>
                              {errors.adStatus.message}
                            </FormHelperText>
                          )}
                        </StyledFormControl>
                      )}
                    />

                    <Typography
                      variant="body2"
                      sx={{
                        mb: 1,
                        color: "#666",
                        fontWeight: 500,
                        fontSize: "20px",
                      }}
                    >
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

                  <Divider sx={{ my: 3, borderColor: "#e0e0e0" }} />

                </Container>
              </CardContent>
            </StyledCard>
          </Box>

          <Snackbar
            open={showSuccess}
            autoHideDuration={6000}
            onClose={() => setShowSuccess(false)}
          >
            <Alert
              onClose={() => setShowSuccess(false)}
              severity="success"
              sx={{ width: "100%" }}
            >
              تم {isEditMode ? "تحديث" : "إضافة"} الإعلان بنجاح!
            </Alert>
          </Snackbar>
        </Container>
      </Box>

      <AdPackagesClient
        selectedPackageId={selectedPackage}
        setSelectedPackageId={setSelectedPackage}
        onReceiptImageChange={setReceiptImage}
      />
      <PaymentMethods />

      <Box
        sx={{
          mt: 4,
          display: "flex",
          gap: 2,
          justifyContent: "center",
          mb: "16px",
        }}
      >
        <Button
          type="submit"
          variant="contained"
          size="large"
          onClick={handleSubmit(onSubmit)}
          sx={{
            borderRadius: "12px",
            px: 4,
            py: 1.5,
            fontSize: "1.1rem",
            fontWeight: 600,
            backgroundColor: "#6E00FE",
            "&:hover": {
              backgroundColor: "#5a00d4",
            },
          }}
        >
          {isEditMode ? "تحديث الإعلان" : "أضف الإعلان"}
        </Button>

        <Button
          type="button"
          variant="outlined"
          size="large"
          onClick={handleReset}
          sx={{
            borderRadius: "12px",
            px: 4,
            py: 1.5,
            fontSize: "1.1rem",
            fontWeight: 600,
            borderColor: "#6E00FE",
            color: "#6E00FE",
            "&:hover": {
              borderColor: "#5a00d4",
              backgroundColor: "rgba(110, 0, 254, 0.04)",
            },
          }}
        >
          إعادة تعيين
        </Button>
      </Box>
      {submitError && (
        <Alert severity="error" sx={{ mt: 2, mx: "auto", maxWidth: "lg" }}>
          {submitError}
        </Alert>
      )}
    </>
  );
};

export default ModernRealEstateForm;


