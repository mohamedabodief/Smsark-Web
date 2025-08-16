import React, { useState } from "react";
import {
  TextField,
  Button,
  Paper,
  Typography,
  Grid,
  InputAdornment,
  MenuItem,
  styled,
  Box,
  FormControl,
  InputLabel,
  Select,
  Divider,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormLabel,
  Chip,
  IconButton,
  CircularProgress,
  Alert,
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import PhoneIcon from "@mui/icons-material/Phone";
import BathtubIcon from "@mui/icons-material/Bathtub";
import KingBedIcon from "@mui/icons-material/KingBed";
import SquareFootIcon from "@mui/icons-material/SquareFoot";
import DeleteIcon from "@mui/icons-material/Delete";
import MapIcon from "@mui/icons-material/Map";
import { useDispatch, useSelector } from "react-redux";
import { setFormData, resetForm } from "./propertySlice";
import { propertyFeatures } from "./constants";
import { storage, auth } from "../FireBase/firebaseConfig";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import AdPackages from "../../packages/packagesDevAndFin";
import MapPicker from "../LocationComponents/MapPicker";
import useReverseGeocoding from "../LocationComponents/useReverseGeocoding";
import PaymentMethods from "./PaymentMethods";

const StyledButton = styled(Button)({
  backgroundColor: "#6E00FE",
  color: "white",
  "&:hover": {
    backgroundColor: "#200D3A",
  },
  "&:disabled": {
    backgroundColor: "#cccccc",
  },
});

const StyledRadio = styled(Radio)({
  color: "#6E00FE",
  "&.Mui-checked": {
    color: "#6E00FE",
  },
  "&:hover": {
    color: "#200D3A",
  },
});

const PropertyForm = ({
  onSubmit,
  loading,
  initialData = null,
  isEditMode = false,
  loadingEditData = false,
}) => {
  const dispatch = useDispatch();
  const formData = useSelector((state) => state.property.formData);
  const [errors, setErrors] = useState({});
  const [images, setImages] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [selectedPackage, setSelectedPackage] = useState(
    initialData?.adPackage || null
  );
  const [receiptImage, setReceiptImage] = useState(null);
  const [coordinates, setCoordinates] = useState(null);
  const [enableMapPick, setEnableMapPick] = useState(false);
  const [isGeocodingLoading, setIsGeocodingLoading] = useState(false);
  const [geocodingError, setGeocodingError] = useState("");
  const prevAddressFromMap = React.useRef(null);
  const [receiptPreviewUrl, setReceiptPreviewUrl] = useState(null);

  // التمرير إلى الأعلى عند تحميل الصفحة
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // استخدام useReverseGeocoding للحصول على العنوان
  const addressFromMap = useReverseGeocoding(coordinates);

  // التحقق من حالة تسجيل الدخول عند تحميل المكون
  React.useEffect(() => {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      setUploadError("يجب تسجيل الدخول أولاً قبل إضافة عقار");
      console.log("No user logged in on component mount");
    } else {
      console.log("User logged in:", currentUser.uid);
      setUploadError(null);
    }
  }, []);

  // تهيئة البيانات الأولية في وضع التعديل
  React.useEffect(() => {
    if (isEditMode && initialData) {
      console.log("Initializing form with data:", initialData);
      dispatch(
        setFormData({
          developer_name: initialData.developer_name || "",
          phone: initialData.phone || "",
          location: { ...formData.location, ...initialData.location },
          description: initialData.description || "",
          price_start_from: initialData.price_start_from?.toString() || "",
          price_end_to: initialData.price_end_to?.toString() || "",
          rooms: initialData.rooms?.toString() || "",
          bathrooms: initialData.bathrooms?.toString() || "",
          floor: initialData.floor?.toString() || "",
          area: initialData.area?.toString() || "",
          furnished: initialData.furnished ? "نعم" : "لا",
          status: initialData.status || "جاهز",
          paymentMethod: initialData.paymentMethod || "كاش",
          negotiable: initialData.negotiable ? "نعم" : "لا",
          deliveryTerms: initialData.deliveryTerms || "",
          features: initialData.features || [],
        })
      );

      // عرض الصور الموجودة - استبعاد القيم الفارغة والروابط غير الصحيحة
      if (initialData.images && initialData.images.length > 0) {
        console.log("Setting existing images:", initialData.images);
        const validImages = initialData.images.filter(
          (img) =>
            img &&
            img.trim() !== "" &&
            img !== "null" &&
            img !== "undefined" &&
            img.startsWith("http")
        );
        console.log("Valid existing images:", validImages);
        setPreviewUrls(validImages);
      }

      // إضافة معاينة صورة الإيصال القديمة
      if (initialData.receipt_image) {
        setReceiptImage(initialData.receipt_image); // هذا الرابط
        setReceiptPreviewUrl(initialData.receipt_image);
      }
    }
  }, [isEditMode, initialData, dispatch]);

  // تنظيف object URLs عند إلغاء تحميل المكون
  React.useEffect(() => {
    return () => {
      previewUrls.forEach((url) => {
        if (url.startsWith("blob:")) {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, [previewUrls]);

  // أضف مكون الباقات أسفل الفورم
  React.useEffect(() => {
    if (isEditMode && initialData && initialData.adPackage) {
      setSelectedPackage(initialData.adPackage);
    }
  }, [isEditMode, initialData]);

  // دالة للتعامل مع تغيير الصور
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const validTypes = ["image/jpeg", "image/png"];
    const maxSize = 5 * 1024 * 1024; // 5 ميجابايت
    const invalidFiles = files.filter(
      (file) => !validTypes.includes(file.type) || file.size > maxSize
    );

    if (invalidFiles.length > 0) {
      setErrors({
        ...errors,
        images: "يرجى رفع صور بصيغة JPEG أو PNG وبحجم أقل من 5 ميجابايت",
      });
      return;
    }

    if (files.length + images.length > 4) {
      setErrors({ ...errors, images: "يمكنك تحميل 4 صور كحد أقصى" });
      return;
    }

    setImages((prev) => [...prev, ...files]);
    setErrors({ ...errors, images: "" });
    setUploadError(null); // مسح أي أخطاء سابقة

    const newPreviewUrls = files.map((file) => URL.createObjectURL(file));
    setPreviewUrls((prev) => [...prev, ...newPreviewUrls]);
  };

  // دالة لإزالة صورة
  const removeImage = (index) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);

    const newPreviews = [...previewUrls];
    // تحقق من أن الصورة هي blob URL قبل حذفها
    if (newPreviews[index] && newPreviews[index].startsWith("blob:")) {
      URL.revokeObjectURL(newPreviews[index]);
    }
    newPreviews.splice(index, 1);
    setPreviewUrls(newPreviews);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    dispatch(setFormData({ ...formData, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleLocationChange = (e) => {
    const { name, value } = e.target;
    dispatch(
      setFormData({
        ...formData,
        location: { ...formData.location, [name]: value },
      })
    );
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // التعامل مع اختيار الموقع من MapPicker
  const handleLocationSelect = (location) => {
    console.log("[DEBUG] إحداثيات الموقع المختار:", location);
    if (location && location.lat && location.lng) {
      setCoordinates(location);
    }
  };

  // تحديث حقول العنوان بناءً على addressFromMap
  React.useEffect(() => {
    console.log("[DEBUG] addressFromMap in PropertyForm:", addressFromMap);
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
        dispatch(
          setFormData({
            ...formData,
            location: {
              ...formData.location,
              city: addressFromMap.city,
              governorate: addressFromMap.governorate,
              detailedAddress: addressFromMap.full,
            },
          })
        );
        setGeocodingError("");
      } else {
        setGeocodingError("فشل جلب العنوان من الخريطة. حاولي مرة أخرى.");
      }
      setIsGeocodingLoading(false);
      prevAddressFromMap.current = addressFromMap;
    }, 500);
    return () => clearTimeout(timer);
  }, [addressFromMap, enableMapPick, coordinates, dispatch, formData]);

  const validateForm = () => {
    const newErrors = {};
    if (
      !formData.developer_name ||
      !formData.developer_name.trim() ||
      !/^[a-zA-Z\u0600-\u06FF\s]+$/.test(formData.developer_name)
    ) {
      newErrors.developer_name = "يجب إدخال اسم المطور (حروف فقط)";
    }
    if (!formData.phone || !/^01[0-2,5]{1}[0-9]{8}$/.test(formData.phone)) {
      newErrors.phone =
        "يجب إدخال رقم هاتف صحيح (11 رقم يبدأ بـ 010/011/012/015)";
    }
    if (!formData.location.governorate) {
      newErrors.governorate = "يجب اختيار المحافظة";
    }
    if (!formData.location.city || !formData.location.city.trim()) {
      newErrors.city = "يجب إدخال المدينة";
    }
    if (!formData.description || !formData.description.trim()) {
      newErrors.description = "يجب إدخال الوصف";
    }
    if (
      !formData.price_start_from ||
      !/^[0-9]+$/.test(formData.price_start_from)
    ) {
      newErrors.price_start_from = "يجب إدخال السعر الأدنى (أرقام فقط)";
    }
    if (!formData.price_end_to || !/^[0-9]+$/.test(formData.price_end_to)) {
      newErrors.price_end_to = "يجب إدخال السعر الأعلى (أرقام فقط)";
    }
    if (formData.price_start_from && formData.price_end_to) {
      const startPrice = Number(formData.price_start_from);
      const endPrice = Number(formData.price_end_to);
      if (endPrice < startPrice) {
        newErrors.price_end_to =
          "السعر الأعلى يجب أن يكون أكبر من أو يساوي السعر الأدنى";
      }
    }
    if (formData.rooms && !/^[0-9]+$/.test(formData.rooms)) {
      newErrors.rooms = "عدد الغرف يجب أن يكون رقمًا صحيحًا";
    }
    if (formData.bathrooms && !/^[0-9]+$/.test(formData.bathrooms)) {
      newErrors.bathrooms = "عدد الحمامات يجب أن يكون رقمًا صحيحًا";
    }
    if (formData.area && !/^[0-9]+$/.test(formData.area)) {
      newErrors.area = "المساحة يجب أن تكون رقمًا صحيحًا";
    }
    if (formData.floor && !/^[0-9]+$/.test(formData.floor)) {
      newErrors.floor = "رقم الطابق يجب أن يكون رقمًا صحيحًا";
    }
    if (
      !formData.status ||
      !["جاهز", "قيد الإنشاء"].includes(formData.status)
    ) {
      newErrors.status =
        "❌ الحالة غير صالحة. اختر إما 'جاهز' أو 'قيد الإنشاء'";
    }
    if (!formData.furnished || !["نعم", "لا"].includes(formData.furnished)) {
      newErrors.furnished = "يرجى اختيار هل العقار مفروش أم لا";
    }
    if (!formData.negotiable || !["نعم", "لا"].includes(formData.negotiable)) {
      newErrors.negotiable = "يرجى تحديد هل السعر قابل للتفاوض أم لا";
    }
    if (!formData.paymentMethod || formData.paymentMethod.trim() === "") {
      newErrors.paymentMethod = "يرجى تحديد طريقة الدفع";
    }
    // تحقق من الصور
    if (!isEditMode && images.length === 0) {
      newErrors.images = "يجب إضافة صورة واحدة على الأقل";
    }
    if (isEditMode && images.length === 0 && previewUrls.length === 0) {
      newErrors.images = "يجب إضافة صورة واحدة على الأقل";
    }
    // تحقق من اختيار الباقة
    if (!selectedPackage) {
      newErrors.selectedPackage = "يجب اختيار باقة إعلانية";
    }
    // تحقق من صورة الإيصال
    if (!receiptImage) {
      newErrors.receiptImage = "يجب رفع صورة الإيصال";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // دالة لرفع الصور إلى Firebase Storage
  const uploadImagesToFirebase = async (files) => {
    // التحقق من وجود مستخدم مسجل الدخول
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error("يجب تسجيل الدخول أولاً. يرجى تسجيل الدخول من جديد.");
    }

    console.log("Uploading images for user:", currentUser.uid);

    const uploadPromises = files.map(async (file, index) => {
      const timestamp = Date.now();
      const fileName = `property_${timestamp}_${index}.jpg`;
      // استخدام userId في مسار الملف للأمان
      const storageRef = ref(
        storage,
        `property_images/${currentUser.uid}/${fileName}`
      );

      try {
        await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(storageRef);
        return downloadURL;
      } catch (error) {
        console.error("Error uploading image:", error);
        if (error.code === "storage/unauthorized") {
          throw new Error("ليس لديك صلاحية لرفع الصور. تأكد من تسجيل الدخول.");
        } else {
          throw new Error(`فشل في رفع الصورة ${index + 1}: ${error.message}`);
        }
      }
    });

    return Promise.all(uploadPromises);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // التحقق من تسجيل الدخول أولاً
    const currentUser = auth.currentUser;
    if (!currentUser) {
      setUploadError(
        "يجب تسجيل الدخول أولاً قبل إضافة عقار. يرجى تسجيل الدخول من جديد."
      );
      console.log("No user logged in");

      // إعادة توجيه إلى صفحة تسجيل الدخول بعد ثانيتين
      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);

      return;
    }

    console.log("Current user:", currentUser.uid);

    if (validateForm()) {
      setUploading(true);
      setUploadError(null);

      try {
        let imageUrls = [];

        // في وضع التعديل، استخدم الصور الموجودة + الصور الجديدة
        if (isEditMode) {
          // الصور الموجودة (URLs)
          const existingImages = previewUrls.filter(
            (url) => !url.startsWith("blob:")
          );
          // الصور الجديدة (Files)
          if (images.length > 0) {
            const newImageUrls = await uploadImagesToFirebase(images);
            imageUrls = [...existingImages, ...newImageUrls];
          } else {
            imageUrls = existingImages;
          }
        } else {
          // وضع الإضافة الجديدة
          if (images.length > 0) {
            imageUrls = await uploadImagesToFirebase(images);
          }
        }

        // إرسال البيانات مع روابط الصور
        console.log("Submitting form with receiptImage:", receiptImage);
        await onSubmit({
          ...formData,
          price_start_from: Number(formData.price_start_from),
          price_end_to: Number(formData.price_end_to),
          rooms: Number(formData.rooms) || null,
          bathrooms: Number(formData.bathrooms) || null,
          area: Number(formData.area) || null,
          floor: Number(formData.floor) || null,
          furnished: formData.furnished === "نعم",
          negotiable: formData.negotiable === "نعم",
          adPackage: selectedPackage,
          images: imageUrls,
          receiptImage: receiptImage,
        });

        if (!isEditMode) {
          dispatch(resetForm());
          setImages([]);
          setPreviewUrls([]);
        }
      } catch (error) {
        setUploadError(error.message || "حدث خطأ أثناء رفع الصور");
        console.error("Form submission error:", error);
      } finally {
        setUploading(false);
      }
    }
  };

  const removeReceiptImage = () => {
    setReceiptImage(null);
    setReceiptPreviewUrl(null);
  };

  return (
    <Paper
      elevation={3}
      sx={{ p: 3, borderRadius: 2, mt: 0, maxWidth: 1200, mx: "auto" }}
    >
      <Typography
        variant="h4"
        gutterBottom
        sx={{ color: "#6E00FE", mb: 3, textAlign: "center" }}
      >
        <Box component="span" sx={{ borderBottom: "3px solid #6E00FE", px: 2 }}>
          {isEditMode ? "تعديل العقار" : "إضافة عقار جديد"}
        </Box>
      </Typography>

      {isEditMode && (
        <Alert dir="rtl" severity="info" sx={{ mb: 0 }}>
          أنت في وضع التعديل. يمكنك تعديل البيانات واضغط "حفظ التعديلات" لتطبيق
          التغييرات.
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <Grid container spacing={2} dir="rtl">
          {/* معلومات المطور */}
          <Grid size={{ xs: 6, md: 8, lg: 12 }}>
            <Typography
              variant="h5"
              sx={{
                color: "#6E00FE",
                mb: 2,
                mt: 2,
                position: "relative",
                textAlign: "right",
              }}
            >
              معلومات المطور
            </Typography>
          </Grid>

          <Grid size={{ xs: 6, md: 6, lg: 6 }}>
            <TextField
              fullWidth
              label="اسم المطور"
              name="developer_name"
              value={formData.developer_name}
              onChange={handleChange}
              error={!!errors.developer_name}
              helperText={errors.developer_name}
              disabled={loading || loadingEditData}
            />
          </Grid>

          <Grid size={{ xs: 6, md: 6, lg: 6 }}>
            <TextField
              fullWidth
              label="رقم الهاتف"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              error={!!errors.phone}
              helperText={errors.phone}
              disabled={loading || loadingEditData}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PhoneIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6, lg: 6 }}>
            <TextField
              fullWidth
              label="المحافظة"
              name="governorate"
              value={formData.location.governorate}
              onChange={handleLocationChange}
              error={!!errors.governorate}
              helperText={errors.governorate}
              disabled={loading}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LocationOnIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6, lg: 6 }}>
            <TextField
              fullWidth
              label="المدينة"
              name="city"
              value={formData.location.city}
              onChange={handleLocationChange}
              error={!!errors.city}
              helperText={errors.city}
              disabled={loading || loadingEditData}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LocationOnIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 12, lg: 12 }}>
            <TextField
              fullWidth
              label="العنوان بالتفصيل"
              name="detailedAddress"
              value={
                formData.location.detailedAddress || addressFromMap.full || ""
              }
              InputProps={{
                readOnly: true,
                startAdornment: (
                  <InputAdornment position="start">
                    <LocationOnIcon />
                  </InputAdornment>
                ),
              }}
              disabled={loading || !enableMapPick}
              helperText={enableMapPick ? "تم جلب العنوان من الخريطة" : ""}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6, lg: 12 }}>
            <Button
              variant="outlined"
              startIcon={<MapIcon sx={{ marginLeft: "10px" }} />}
              fullWidth
              sx={{ borderRadius: "12px", py: 1.5, mb: 2 }}
              onClick={() => setEnableMapPick((prev) => !prev)}
              type="button"
              disabled={loading}
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
                  mb: 4,
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
          </Grid>

          <Divider sx={{ mb: 2, mt: 2 }} />

          {/* معلومات العقار */}
          <Grid size={{ xs: 6, md: 6, lg: 12 }}>
            <Typography
              variant="h5"
              sx={{ color: "#6E00FE", mb: 2, mt: 2, textAlign: "right" }}
            >
              معلومات العقار
            </Typography>
          </Grid>

          <Grid size={{ xs: 6, md: 6, lg: 4 }}>
            <TextField
              fullWidth
              label="عدد الغرف"
              name="rooms"
              value={formData.rooms}
              onChange={handleChange}
              type="number"
              error={!!errors.rooms}
              helperText={errors.rooms}
              disabled={loading || loadingEditData}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <KingBedIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid size={{ xs: 6, md: 6, lg: 4 }}>
            <TextField
              fullWidth
              label="عدد الحمامات"
              name="bathrooms"
              value={formData.bathrooms}
              onChange={handleChange}
              type="number"
              error={!!errors.bathrooms}
              helperText={errors.bathrooms}
              disabled={loading || loadingEditData}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <BathtubIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid size={{ xs: 6, md: 6, lg: 4 }}>
            <TextField
              fullWidth
              label="رقم الطابق"
              name="floor"
              value={formData.floor}
              onChange={handleChange}
              type="number"
              error={!!errors.floor}
              helperText={errors.floor}
              disabled={loading || loadingEditData}
            />
          </Grid>

          <Grid size={{ xs: 6, md: 6, lg: 4 }}>
            <TextField
              fullWidth
              label="المساحة (م²)"
              name="area"
              value={formData.area}
              onChange={handleChange}
              type="number"
              error={!!errors.area}
              helperText={errors.area}
              disabled={loading || loadingEditData}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SquareFootIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid size={{ xs: 6, md: 6, lg: 4 }}>
            <TextField
              fullWidth
              label="شروط التسليم"
              name="deliveryTerms"
              value={formData.deliveryTerms}
              onChange={handleChange}
              disabled={loading || loadingEditData}
            />
          </Grid>

          <Grid size={{ xs: 6, md: 6, lg: 12 }}>
            <FormControl component="fieldset">
              <FormLabel
                component="legend"
                sx={{ color: "#6E00FE", textAlign: "right" }}
              >
                مفروش
              </FormLabel>
              <RadioGroup
                row
                name="furnished"
                value={formData.furnished}
                onChange={handleChange}
                sx={{ justifyContent: "flex-end" }}
              >
                <FormControlLabel
                  value="نعم"
                  control={<StyledRadio />}
                  label="نعم"
                />
                <FormControlLabel
                  value="لا"
                  control={<StyledRadio />}
                  label="لا"
                />
              </RadioGroup>
            </FormControl>
          </Grid>

          <Grid size={{ xs: 12, md: 6, lg: 4 }}>
            <FormControl component="fieldset">
              <FormLabel
                component="legend"
                sx={{ color: "#6E00FE", textAlign: "right" }}
              >
                حالة العقار
              </FormLabel>
              <RadioGroup
                row
                name="status"
                value={formData.status}
                onChange={handleChange}
                sx={{ justifyContent: "flex-end" }}
              >
                <FormControlLabel
                  value="جاهز"
                  control={<StyledRadio />}
                  label="جاهز"
                />
                <FormControlLabel
                  value="قيد الإنشاء"
                  control={<StyledRadio />}
                  label="قيد الإنشاء"
                />
              </RadioGroup>
            </FormControl>
          </Grid>

          <Grid size={{ xs: 12, md: 6, lg: 12 }}>
            <Typography
              variant="h6"
              sx={{ color: "#6E00FE", mb: 2, textAlign: "right" }}
            >
              ميزات العقار (اختياري)
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              {propertyFeatures.map((feature) => (
                <Chip
                  key={feature}
                  label={feature}
                  onClick={() => {
                    dispatch(
                      setFormData({
                        ...formData,
                        features: formData.features.includes(feature)
                          ? formData.features.filter((f) => f !== feature)
                          : [...formData.features, feature],
                      })
                    );
                  }}
                  color={
                    formData.features.includes(feature) ? "primary" : "default"
                  }
                  variant={
                    formData.features.includes(feature) ? "filled" : "outlined"
                  }
                  disabled={loading || loadingEditData}
                />
              ))}
            </Box>
          </Grid>

          <Grid size={{ xs: 12, md: 6, lg: 12 }}>
            <Typography
              variant="h6"
              sx={{ color: "#6E00FE", mb: 2, textAlign: "right" }}
            >
              وصف العقار
            </Typography>
            <TextField
              fullWidth
              label="وصف العقار"
              name="description"
              value={formData.description}
              onChange={handleChange}
              error={!!errors.description}
              helperText={errors.description}
              multiline
              rows={4}
              disabled={loading || loadingEditData}
            />
          </Grid>

          {/* إضافة الصور */}
          <Grid size={{ xs: 12, md: 6, lg: 12 }}>
            <Typography
              variant="h6"
              sx={{ color: "#6E00FE", mb: 2, mt: 2, textAlign: "right" }}
            >
              صور العقار (حد أقصى 4 صور)
            </Typography>
            <input
              accept="image/jpeg,image/png"
              type="file"
              multiple
              onChange={handleImageChange}
              disabled={loading || loadingEditData || uploading}
              style={{ marginBottom: "16px" }}
            />
            {errors.images && (
              <Typography variant="caption" color="error">
                {errors.images}
              </Typography>
            )}
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
              {previewUrls
                .filter(
                  (url) =>
                    url &&
                    url.trim() !== "" &&
                    url !== "null" &&
                    url !== "undefined"
                )
                .map((url, index) => (
                  <Box key={index} sx={{ position: "relative" }}>
                    <img
                      src={url}
                      alt={`معاينة ${index + 1}`}
                      style={{
                        width: "100px",
                        height: "100px",
                        objectFit: "cover",
                        borderRadius: "8px",
                      }}
                      onError={(e) => {
                        console.log("Preview image failed to load:", url);
                        e.target.src = "/no-image-thumbnail.svg";
                      }}
                      onLoad={() => {
                        console.log("Preview image loaded successfully:", url);
                      }}
                    />
                    <IconButton
                      sx={{
                        position: "absolute",
                        top: 0,
                        right: 0,
                        bgcolor: "white",
                        "&:hover": { bgcolor: "grey.200" },
                      }}
                      onClick={() => removeImage(index)}
                      disabled={loading || loadingEditData || uploading}
                    >
                      <DeleteIcon color="error" />
                    </IconButton>
                  </Box>
                ))}
              {previewUrls.filter(
                (url) =>
                  url &&
                  url.trim() !== "" &&
                  url !== "null" &&
                  url !== "undefined"
              ).length === 0 &&
                !uploading && (
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "100px",
                      height: "100px",
                      border: "2px dashed #ccc",
                      borderRadius: "8px",
                      color: "text.secondary",
                      backgroundColor: "#f5f5f5",
                    }}
                  >
                    <Typography variant="caption" color="primary" textAlign="center">
                      لا توجد صور
                    </Typography>
                  </Box>
                )}
              {uploading && (
                <Box
                  sx={{
                    width: "100px",
                    height: "100px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "2px dashed #ccc",
                    borderRadius: "8px",
                  }}
                >
                  <CircularProgress size={30} />
                </Box>
              )}
            </Box>
          </Grid>

          <Divider sx={{ mb: 2, mt: 2 }} />

          {/* السعر */}
          <Grid size={{ xs: 12, md: 6, lg: 12 }}>
            <Typography
              variant="h6"
              sx={{ color: "#6E00FE", mb: 2, mt: 2, textAlign: "right" }}
            >
              السعر
            </Typography>
          </Grid>

          <Grid size={{ xs: 12, md: 6, lg: 4 }}>
            <TextField
              fullWidth
              label="السعر يبدأ من (جنيه)"
              name="price_start_from"
              value={formData.price_start_from}
              onChange={handleChange}
              error={!!errors.price_start_from}
              helperText={errors.price_start_from}
              disabled={loading}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AttachMoneyIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6, lg: 4 }}>
            <TextField
              fullWidth
              label="السعر ينتهي عند (جنيه)"
              name="price_end_to"
              value={formData.price_end_to}
              onChange={handleChange}
              error={!!errors.price_end_to}
              helperText={errors.price_end_to}
              disabled={loading}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AttachMoneyIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6, lg: 12, mb: 2 }}>
            <FormControl component="fieldset">
              <FormLabel
                component="legend"
                sx={{ color: "#6E00FE", textAlign: "right" }}
              >
                طريقة الدفع
              </FormLabel>
              <RadioGroup
                row
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleChange}
                sx={{ justifyContent: "flex-end" }}
              >
                <FormControlLabel
                  value="كاش"
                  control={<StyledRadio />}
                  label="كاش"
                />
                <FormControlLabel
                  value="تقسيط"
                  control={<StyledRadio />}
                  label="تقسيط"
                />
                <FormControlLabel
                  value="كاش أو تقسيط"
                  control={<StyledRadio />}
                  label="كاش أو تقسيط"
                />
              </RadioGroup>
            </FormControl>
          </Grid>

          <Grid size={{ xs: 12, md: 6, lg: 12 }}>
            <FormControl component="fieldset">
              <FormLabel
                component="legend"
                sx={{ color: "#6E00FE", textAlign: "right" }}
              >
                قابل للتفاوض
              </FormLabel>
              <RadioGroup
                row
                name="negotiable"
                value={formData.negotiable}
                onChange={handleChange}
                sx={{ justifyContent: "flex-end" }}
              >
                <FormControlLabel
                  value="نعم"
                  control={<StyledRadio />}
                  label="نعم"
                />
                <FormControlLabel
                  value="لا"
                  control={<StyledRadio />}
                  label="لا"
                />
              </RadioGroup>
            </FormControl>
          </Grid>

          {/* عرض رسائل الخطأ في الرفع */}
          {uploadError && (
            <Grid size={{ xs: 12 }}>
              <Alert severity="error" sx={{ mb: 2 }}>
                {uploadError}
                {uploadError.includes("تسجيل الدخول") && (
                  <Box sx={{ mt: 1 }}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => (window.location.href = "/login")}
                      sx={{ mr: 1 }}
                    >
                      تسجيل الدخول
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={() => setUploadError(null)}
                    >
                      إلغاء
                    </Button>
                  </Box>
                )}
              </Alert>
            </Grid>
          )}

          {/* أضف مكون الباقات وإيصال الدفع */}
          <Grid size={{ xs: 12, md: 6, lg: 12 }}>
            <Typography
              variant="h6"
              sx={{ color: "#6E00FE", mb: 2, mt: 2, textAlign: "right" }}
            >
              اختيار الباقة وإيصال الدفع
            </Typography>
            <Box
              sx={{ display: "flex", justifyContent: "center", width: "100%" }}
            >
              <AdPackages
                selectedPackageId={selectedPackage}
                setSelectedPackageId={setSelectedPackage}
                onReceiptImageChange={(fileOrUrl) => {
                  setReceiptImage(fileOrUrl);
                  if (fileOrUrl instanceof File) {
                    setReceiptPreviewUrl(URL.createObjectURL(fileOrUrl));
                  } else {
                    setReceiptPreviewUrl(fileOrUrl);
                  }
                }}
                receiptImage={receiptImage}
                receiptPreviewUrl={receiptPreviewUrl}
                removeReceiptImage={removeReceiptImage}
              />
            </Box>
            {errors.selectedPackage && (
              <Typography
                variant="caption"
                color="error"
                sx={{ mt: 1, textAlign: "right" }}
              >
                {errors.selectedPackage}
              </Typography>
            )}
            {errors.receiptImage && (
              <Typography
                variant="caption"
                color="error"
                sx={{ mt: 1, textAlign: "right" }}
              >
                {errors.receiptImage}
              </Typography>
            )}
          </Grid>



          <PaymentMethods />




          <Box
            sx={{
              mt: 4,
              display: "flex",
              gap: 2,
              justifyContent: "center",
              mb: "16px",
            }}
          ></Box>
        </Grid>
        <Box sx={{ width: "100%", display: "flex", justifyContent: "center" }}>
          <Grid size={{ xs: 12, md: 6 }}>
            <StyledButton
              type="submit"
              variant="contained"
              size="large"
              disabled={loading || uploading}
              sx={{
                py: 2,
                fontSize: "1.3rem",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: "15px",
              }}
            >
              {uploading ? (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <CircularProgress size={20} color="inherit" />
                  جاري إضافة العقار ...
                </Box>
              ) : loading ? (
                isEditMode ? (
                  "جاري حفظ التعديلات..."
                ) : (
                  "جاري حفظ العقار..."
                )
              ) : isEditMode ? (
                "حفظ التعديلات"
              ) : (
                "إضافة العقار"
              )}
            </StyledButton>
          </Grid>
        </Box>
      </form>
    </Paper>
  );
};

export default PropertyForm;
