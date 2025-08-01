import {
  Box, TextField, Button, Typography, Paper, Grid, Alert, CircularProgress, IconButton
} from '@mui/material';
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import FinancingAdvertisement from '../FireBase/modelsWithOperations/FinancingAdvertisement';
import DeleteIcon from '@mui/icons-material/Delete';
import React from 'react';
import { storage, auth } from '../FireBase/firebaseConfig';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import AdPackages from '../../packages/packagesDevAndFin';
import PaymentMethods from './PaymentMethods';


export default function AddFinancingAdForm() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get URL parameters for edit mode
  const urlParams = new URLSearchParams(window.location.search);
  const editModeParam = urlParams.get('editMode');
  const adIdParam = urlParams.get('adId');
  
  const editData = location.state?.adData || null;
  const isEditMode = location.state?.editMode || editModeParam === 'true' || false;

  // --- تعديل: تهيئة الحقول والصور في وضع التعديل مثل PropertyForm.jsx ---
  React.useEffect(() => {
    const initializeEditData = async () => {
      if (isEditMode) {
        let adData = editData;
        
        // If we have adId from URL but no editData, fetch the ad
        if (adIdParam && !editData) {
          try {
            console.log('Fetching ad data for ID:', adIdParam);
            adData = await FinancingAdvertisement.getById(adIdParam);
            if (!adData) {
              setError('الإعلان غير موجود');
              return;
            }
          } catch (error) {
            console.error('Error fetching ad data:', error);
            setError('حدث خطأ أثناء تحميل بيانات الإعلان');
            return;
          }
        }
        
        if (adData) {
          console.log('[DEBUG] Setting form data with adData:', adData);
          console.log('[DEBUG] adData.userId:', adData.userId);
          
          setForm({
            title: adData.title || '',
            description: adData.description || '',
            phone: adData.phone || '',
            start_limit: adData.start_limit || '',
            end_limit: adData.end_limit || '',
            org_name: adData.org_name || '',
            userId: adData.userId || auth.currentUser?.uid || 'admin',
            type_of_user: adData.type_of_user || 'individual',
            ads: adData.ads !== undefined ? adData.ads : false,
            adExpiryTime: adData.adExpiryTime || Date.now() + 30 * 24 * 60 * 60 * 1000,
            interest_rate_upto_5: adData.interest_rate_upto_5 || '',
            interest_rate_upto_10: adData.interest_rate_upto_10 || '',
            interest_rate_above_10: adData.interest_rate_above_10 || '',
            id: adData.id || undefined,
          });
          
          // الصور القديمة فقط (روابط صحيحة)
          if (adData.images && adData.images.length > 0) {
            const validImages = adData.images.filter(
              (img) => img && img.trim() !== '' && img !== 'null' && img !== 'undefined' && img.startsWith('http')
            );
            setPreviewUrls(validImages);
            setImages([]); // الصور الجديدة فقط من input
          }
          
          // Set package if available
          if (adData.adPackage) {
            setSelectedPackage(adData.adPackage);
          }
        }
      }
    };
    
    initializeEditData();
  }, [isEditMode, editData, adIdParam]);

  const [form, setForm] = useState({
    title: editData?.title || '',
    description: editData?.description || '',
    phone: editData?.phone || '',
    start_limit: editData?.start_limit || '',
    end_limit: editData?.end_limit || '',
    org_name: editData?.org_name || '',
    userId: editData?.userId || auth.currentUser?.uid || 'admin',
    type_of_user: editData?.type_of_user || 'individual',
    ads: false,
    adExpiryTime: editData?.adExpiryTime || Date.now() + 30 * 24 * 60 * 60 * 1000,
    interest_rate_upto_5: editData?.interest_rate_upto_5 || '',
    interest_rate_upto_10: editData?.interest_rate_upto_10 || '',
    interest_rate_above_10: editData?.interest_rate_above_10 || '',
    id: editData?.id || undefined,
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  // تعريفات فارغة لتعطيل الصور مؤقتًا بدون أخطاء
  const [images, setImages] = useState([]); // ملفات الصور الجديدة
  const [previewUrls, setPreviewUrls] = useState(editData?.images || []); // روابط الصور للمعاينة (قديمة وجديدة)
  const [selectedPackage, setSelectedPackage] = useState(editData?.adPackage || null);
  const [receiptImage, setReceiptImage] = useState(null);

  // / --- START: صور الإعلان ---
  // const [images, setImages] = useState([]); // ملفات الصور الجديدة
  // const [previewUrls, setPreviewUrls] = useState(editData?.images || []); // روابط الصور للمعاينة (قديمة وجديدة)
  // // --- END: صور الإعلان ---/


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

  // دالة للتعامل مع تغيير الصور
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const validTypes = ["image/jpeg", "image/png"];
    const maxSize = 5 * 1024 * 1024; // 5 ميجابايت
    const invalidFiles = files.filter(
      (file) => !validTypes.includes(file.type) || file.size > maxSize
    );
    if (invalidFiles.length > 0) {
      setError("يرجى رفع صور بصيغة JPEG أو PNG وبحجم أقل من 5 ميجابايت");
      return;
    }
    if (files.length + previewUrls.length > 4) {
      setError("يمكنك تحميل 4 صور كحد أقصى");
      return;
    }
    setImages((prev) => [...prev, ...files]);
    setError(null);
    const newPreviewUrls = files.map((file) => URL.createObjectURL(file));
    setPreviewUrls((prev) => [...prev, ...newPreviewUrls]);
  };

  // دالة لإزالة صورة
  const removeImage = (index) => {
    if (previewUrls[index] && previewUrls[index].startsWith("blob:")) {
      URL.revokeObjectURL(previewUrls[index]);
      setImages((prev) => {
        const newImgs = [...prev];
        newImgs.splice(index - (previewUrls.length - images.length), 1);
        return newImgs;
      });
    }
    const newPreviews = [...previewUrls];
    newPreviews.splice(index, 1);
    setPreviewUrls(newPreviews);
  };

  // دالة لرفع الصور إلى Firebase Storage
  const uploadImagesToFirebase = async (files) => {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error("يجب تسجيل الدخول أولاً. يرجى تسجيل الدخول من جديد.");
    }
    const uploadPromises = files.map(async (file, index) => {
      const timestamp = Date.now();
      const fileName = `financing_${timestamp}_${index}.jpg`;
      const storageRef = ref(
        storage,
        `financing_images/${currentUser.uid}/${fileName}`
      );
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      return downloadURL;
    });
    return Promise.all(uploadPromises);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const isFormValid = () => {
    const requiredFields = [
      'title', 'description', 'phone', 'org_name',
      'start_limit', 'end_limit',
      'interest_rate_upto_5', 'interest_rate_upto_10', 'interest_rate_above_10'
    ];
    for (let key of requiredFields) {
      if (!form[key] || form[key].toString().trim() === '') {
        setError(`من فضلك أدخل ${key}`);
        return false;
      }
    }
    const above10 = Number(form.interest_rate_above_10);
    if (isNaN(above10) || above10 <= 0) {
      setError("الفائدة لأكثر من 10 سنوات يجب أن تكون رقمًا أكبر من صفر");
      return false;
    }
    setError(null);
    return true;
  };

  // --- تعديل: handleSubmit مطابق لمنطق PropertyForm.jsx ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid()) return;
    
    // Validate authentication
    if (!auth.currentUser) {
      setError('يجب تسجيل الدخول أولاً.');
      return;
    }
    
    setLoading(true);
    setError(null);
    try {
      let ad;
      if (isEditMode && form.id) {
        // Validate that we have a valid userId
        const userId = editData?.userId || form.userId || auth.currentUser?.uid;
        if (!userId) {
          setError('معرف المستخدم غير صالح للتعديل.');
          return;
        }
        
        // الصور القديمة (روابط فقط)
        const existingImageUrls = previewUrls.filter(url => !url.startsWith('blob:'));
        let finalImageUrls = existingImageUrls;
        let updateImages = undefined;
        if (images.length > 0) {
          // إذا تم اختيار صور جديدة، سيتم رفعها ودمجها مع القديمة (حتى 4 صور)
          const newImageUrls = await uploadImagesToFirebase(images);
          finalImageUrls = [...existingImageUrls, ...newImageUrls].slice(0, 4);
          updateImages = finalImageUrls;
        }
        // مرر userId وid من editData دائماً
        console.log('[DEBUG] Creating FinancingAdvertisement with userId:', userId);
        console.log('[DEBUG] Form data:', form);
        console.log('[DEBUG] EditData:', editData);
        
        ad = new FinancingAdvertisement({ ...form, adPackage: selectedPackage ? Number(selectedPackage) : null, images: finalImageUrls, id: form.id, userId: userId });
        await ad.update({ ...form, adPackage: selectedPackage ? Number(selectedPackage) : null, ...(updateImages ? { images: updateImages } : {}), id: form.id, userId: userId }, images.length > 0 ? images : null, receiptImage);
        
        // Update status to pending for admin review
        try {
          await ad.returnToPending();
          console.log('Status updated to pending successfully');
        } catch (statusError) {
          console.error('Error updating status to pending:', statusError);
          // Don't fail the entire operation if status update fails
        }
      } else {
        // في حالة إضافة إعلان جديد
        const currentUser = auth.currentUser;
        if (!currentUser) throw new Error("يجب تسجيل الدخول أولاً.");
        ad = new FinancingAdvertisement({
          ...form,
          userId: currentUser.uid,
          adPackage: selectedPackage ? Number(selectedPackage) : null,
        });
        await ad.save(images, receiptImage);
        form.id = ad.id;
      }
      setSuccess(true);
      setTimeout(() => {
        navigate(`/details/financingAds/${form.id || ad.id}`);
      }, 1500);
    } catch (err) {
      setError("حدث خطأ أثناء حفظ الإعلان أو رفع الصور");
      console.error("Error during save/update:", err);
    } finally {
      setLoading(false);
    }
  };



  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 2, mt: 5, maxWidth: 1100, mx: "auto" ,mb:10}} >
      <Typography
        variant="h4"
        gutterBottom
        sx={{ color: "#6E00FE", mb: 3, textAlign: "center" }}
      >
        <Box component="span" sx={{ borderBottom: "3px solid #6E00FE", px: 2 }}>
          {isEditMode ? "تعديل إعلان تمويل" : "إضافة إعلان تمويل جديد"}
        </Box>
      </Typography>
      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {isEditMode ? "تم تحديث الإعلان بنجاح! وحالة الإعلان الآن قيد المراجعة" : "تم حفظ الإعلان بنجاح!"}
        </Alert>
      )}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
      )}
      <form onSubmit={handleSubmit}>
        <Grid spacing={2} dir="rtl">
          <Grid item xs={12} md={6} mt={2} mb={2} lg={4}>
            <TextField
              fullWidth
              label="عنوان الإعلان"
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </Grid>
          {/* <Grid item xs={12} md={6} mt={2} mb={2} lg={4}>
            <TextField
              fullWidth
              label="نموذج التمويل"
              name="financing_model"
              value={form.financing_model}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </Grid> */}
          <Grid item xs={12} md={6} mt={2} mb={2} lg={4}>
            <TextField
              fullWidth
              label="الوصف"
              name="description"
              value={form.description}
              onChange={handleChange}
              required
              multiline
              rows={3}
              disabled={loading}
            />
          </Grid>
          <Grid item xs={12} md={6} mt={2} mb={2} lg={4}>
            <TextField
              fullWidth
              label="اسم الجهة"
              name="org_name"
              value={form.org_name}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </Grid>
          <Grid item xs={12} md={6} mt={2} mb={2} lg={4}>
            <TextField
              fullWidth
              label="رقم الهاتف"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </Grid>
          <Grid item xs={12} md={6} mt={2} mb={2} lg={4}>
            <TextField
              fullWidth
              label="الحد الأدنى (جنيه)"
              name="start_limit"
              type="number"
              value={form.start_limit}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </Grid>
          <Grid item xs={12} md={6} mt={2} mb={2} lg={4}>
            <TextField
              fullWidth
              label="الحد الأقصى (جنيه)"
              name="end_limit"
              type="number"
              value={form.end_limit}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </Grid>
          <Grid item xs={12} md={4} mt={2} mb={2} lg={4}>
            <TextField
              fullWidth
              label="فائدة حتى 5 سنوات (%)"
              name="interest_rate_upto_5"
              type="number"
              value={form.interest_rate_upto_5}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </Grid>
          <Grid item xs={12} md={4} mt={2} mb={2} lg={4}>
            <TextField
              fullWidth
              label="فائدة حتى 10 سنوات (%)"
              name="interest_rate_upto_10"
              type="number"
              value={form.interest_rate_upto_10}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </Grid>
          <Grid item xs={12} md={4} mt={2} mb={2} lg={4}>
            <TextField
              fullWidth
              label="فائدة أكثر من 10 سنوات (%)"
              name="interest_rate_above_10"
              type="number"
              value={form.interest_rate_above_10}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </Grid>
          <Grid item xs={12} mt={2}>
            <Typography variant="h6" sx={{ color: "#6E00FE", mb: 2, mt: 2, textAlign: "right" }}>
              صور الإعلان (حد أقصى 4 صور)
            </Typography>
            <input
              accept="image/jpeg,image/png"
              type="file"
              multiple
              onChange={handleImageChange}
              disabled={loading || previewUrls.length >= 4}
              style={{ marginBottom: "16px" }}
            />
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
              {previewUrls.map((url, index) => (
                <Box key={index} sx={{ position: "relative" }}>
                  <img
                    src={url}
                    alt={`معاينة ${index + 1}`}
                    style={{ width: "100px", height: "100px", objectFit: "cover", borderRadius: "8px" }}
                  />
                  <IconButton
                    sx={{ position: "absolute", top: 0, right: 0, bgcolor: "white", '&:hover': { bgcolor: "grey.200" } }}
                    onClick={() => removeImage(index)}
                    disabled={loading}
                  >
                    <DeleteIcon color="error" />
                  </IconButton>
                </Box>
              ))}
              {previewUrls.length === 0 && !loading && (
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", width: "100px", height: "100px", border: "2px dashed #ccc", borderRadius: "8px", color: "text.secondary", backgroundColor: "#f5f5f5" }}>
                  <Typography variant="caption" textAlign="center">لا توجد صور</Typography>
                </Box>
              )}
            </Box>
          </Grid>
          <AdPackages selectedPackageId={selectedPackage} setSelectedPackageId={setSelectedPackage} onReceiptImageChange={setReceiptImage} />
          <PaymentMethods />

          <Grid item xs={12} sx={{ textAlign: 'center', mt: 2 }}>
            <Button
              type="submit"
              variant="contained"
              size="large"
              sx={{ px: 5, py: 2, fontWeight: 'bold', borderRadius: 3, minWidth: 200 }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : isEditMode ? "حفظ التعديلات" : "حفظ الإعلان"}
            </Button>
          </Grid>

        </Grid>
      </form>
      
    </Paper>
  );
}
