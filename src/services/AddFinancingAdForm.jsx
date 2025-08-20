// import {
//   Box,
//   TextField,
//   Button,
//   Typography,
//   Paper,
//   Grid,
//   Alert,
//   CircularProgress,
//   IconButton,
//   Chip,
//   Snackbar,
//   Dialog,
//   DialogActions,
//   DialogContent,
//   DialogTitle,
// } from "@mui/material";
// import { useState } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import FinancingAdvertisement from "../FireBase/modelsWithOperations/FinancingAdvertisement";
// import DeleteIcon from "@mui/icons-material/Delete";
// import React from "react";
// import { storage, auth } from "../FireBase/firebaseConfig";
// import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
// import AdPackages from "../../packages/packagesDevAndFin";
// import PaymentMethods from "./PaymentMethods";
// export default function AddFinancingAdForm() {
//   // التمرير إلى الأعلى عند تحميل الصفحة
//   React.useEffect(() => {
//     window.scrollTo(0, 0);
//   }, []);

//   const navigate = useNavigate();
//   const location = useLocation();

//   const urlParams = new URLSearchParams(window.location.search);
//   const editModeParam = urlParams.get("editMode");
//   const adIdParam = urlParams.get("adId");

//   const editData = location.state?.adData || null;
//   const isEditMode =
//     location.state?.editMode || editModeParam === "true" || false;

//   // --- MODIFIED: The new state to track all images (existing and new files)
//   // Initialize with existing images if in edit mode
//   const [images, setImages] = useState([]); // Only new files
//   const [imageMetadata, setImageMetadata] = useState(
//     isEditMode && editData?.images && Array.isArray(editData.images)
//       ? editData.images
//           .filter(
//             (img) =>
//               img &&
//               img.trim() !== "" &&
//               img !== "null" &&
//               img !== "undefined" &&
//               img.startsWith("http")
//           )
//           .map((url, idx) => ({ url, isNew: false, id: `existing-${idx}` }))
//       : []
//   );

//   // --- MODIFIED: Initializing form state based on editData
//   const [form, setForm] = useState({
//     title: editData?.title || "",
//     description: editData?.description || "",
//     phone: editData?.phone || "",
//     start_limit: editData?.start_limit || "",
//     end_limit: editData?.end_limit || "",
//     org_name: editData?.org_name || "",
//     userId: editData?.userId || auth.currentUser?.uid || "admin",
//     type_of_user: editData?.type_of_user || "individual",
//     ads: false,
//     adExpiryTime:
//       editData?.adExpiryTime || Date.now() + 30 * 24 * 60 * 60 * 1000,
//     interest_rate_upto_5: editData?.interest_rate_upto_5 || "",
//     interest_rate_upto_10: editData?.interest_rate_upto_10 || "",
//     interest_rate_above_10: editData?.interest_rate_above_10 || "",
//     id: editData?.id || undefined,
//   });

//   const [loading, setLoading] = useState(false);
//   const [success, setSuccess] = useState(false);
//   const [error, setError] = useState(null);

//   const [selectedPackage, setSelectedPackage] = useState(
//     editData?.adPackage || null
//   );
//   const [receiptImage, setReceiptImage] = useState(null);
//   const [receiptPreviewUrl, setReceiptPreviewUrl] = useState(null);
//   const [showReceiptWarning, setShowReceiptWarning] = useState(false);
//   const [pendingData, setPendingData] = useState(null);

//   // --- MODIFIED: useEffect to handle form and image initialization on edit mode
//   React.useEffect(() => {
//     const initializeEditData = async () => {
//       if (isEditMode) {
//         let adData = editData;

//         if (adIdParam && !editData) {
//           try {
//             adData = await FinancingAdvertisement.getById(adIdParam);
//             if (!adData) {
//               setError("الإعلان غير موجود");
//               return;
//             }
//           } catch (_error) {
//             setError("حدث خطأ أثناء تحميل بيانات الإعلان");
//             return;
//           }
//         }

//         if (adData) {
//           setForm({
//             title: adData.title || "",
//             description: adData.description || "",
//             phone: adData.phone || "",
//             start_limit: adData.start_limit || "",
//             end_limit: adData.end_limit || "",
//             org_name: adData.org_name || "",
//             userId: adData.userId || auth.currentUser?.uid || "admin",
//             type_of_user: adData.type_of_user || "individual",
//             ads: adData.ads !== undefined ? adData.ads : false,
//             adExpiryTime:
//               adData.adExpiryTime || Date.now() + 30 * 24 * 60 * 60 * 1000,
//             interest_rate_upto_5: adData.interest_rate_upto_5 || "",
//             interest_rate_upto_10: adData.interest_rate_upto_10 || "",
//             interest_rate_above_10: adData.interest_rate_above_10 || "",
//             id: adData.id || undefined,
//           });

//           // Create image metadata for existing images
//           if (adData.images && adData.images.length > 0) {
//             const validImages = adData.images.filter(
//               (img) =>
//                 img &&
//                 img.trim() !== "" &&
//                 img !== "null" &&
//                 img !== "undefined" &&
//                 img.startsWith("http")
//             );
//             const existingImageMetadata = validImages.map((url, index) => ({
//               url,
//               isNew: false,
//               id: `existing-${index}`,
//             }));
//             setImageMetadata(existingImageMetadata);
//           } else {
//             setImageMetadata([]);
//           }

//           if (adData.adPackage) {
//             setSelectedPackage(adData.adPackage);
//           }

//           // إضافة معاينة صورة الإيصال القديمة
//           if (adData.receipt_image) {
//             setReceiptImage(adData.receipt_image);
//             setReceiptPreviewUrl(adData.receipt_image);
//           }
//         }
//       }
//     };

//     initializeEditData();
//   }, [isEditMode, editData, adIdParam]);

//   // Clean up object URLs when the component unmounts
//   React.useEffect(() => {
//     return () => {
//       imageMetadata.forEach((img) => {
//         if (img.url && img.url.startsWith("blob:")) {
//           URL.revokeObjectURL(img.url);
//         }
//       });
//     };
//   }, [imageMetadata]);

//   // --- MODIFIED: Handle image change to correctly add new images
//   const handleImageChange = (e) => {
//     const files = Array.from(e.target.files);
//     const validTypes = ["image/jpeg", "image/png"];
//     const maxSize = 5 * 1024 * 1024; // 5 MB
//     const invalidFiles = files.filter(
//       (file) => !validTypes.includes(file.type) || file.size > maxSize
//     );
//     if (invalidFiles.length > 0) {
//       setError("يرجى رفع صور بصيغة JPEG أو PNG وبحجم أقل من 5 ميجابايت");
//       return;
//     }

//     const currentImageCount = imageMetadata.length;
//     if (files.length + currentImageCount > 4) {
//       setError("يمكنك تحميل 4 صور كحد أقصى (بما في ذلك الصور الموجودة)");
//       return;
//     }

//     setError(null);

//     const newImageMetadata = files.map((file, index) => ({
//       url: URL.createObjectURL(file),
//       isNew: true,
//       id: `new-${Date.now()}-${index}`,
//       file: file,
//     }));
//     // Append new images for preview, do not overwrite
//     setImageMetadata((prev) => [...prev, ...newImageMetadata]);
//     // Only append new files for upload
//     setImages((prev) => [...prev, ...files]);
//   };

//   // --- MODIFIED: Remove image logic to handle the new state structure
//   const removeImage = (idToRemove) => {
//     setImageMetadata((prev) => {
//       const imageToRemove = prev.find((img) => img.id === idToRemove);
//       if (!imageToRemove) return prev;

//       if (imageToRemove.url && imageToRemove.url.startsWith("blob:")) {
//         URL.revokeObjectURL(imageToRemove.url);
//       }

//       // If the image is new, remove the corresponding file from the `images` state
//       if (imageToRemove.isNew) {
//         setImages((prevFiles) =>
//           prevFiles.filter((file) => file !== imageToRemove.file)
//         );
//       }

//       return prev.filter((img) => img.id !== idToRemove);
//     });
//   };

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const isFormValid = () => {
//     const requiredFields = [
//       "title",
//       "description",
//       "phone",
//       "org_name",
//       "start_limit",
//       "end_limit",
//       "interest_rate_upto_5",
//       "interest_rate_upto_10",
//       "interest_rate_above_10",
//     ];
//     for (let key of requiredFields) {
//       if (!form[key] || form[key].toString().trim() === "") {
//         setError(`من فضلك أدخل ${key}`);
//         return false;
//       }
//     }
//     const above10 = Number(form.interest_rate_above_10);
//     if (isNaN(above10) || above10 <= 0) {
//       setError("الفائدة لأكثر من 10 سنوات يجب أن تكون رقمًا أكبر من صفر");
//       return false;
//     }
//     // تحقق من اختيار الباقة
//     if (!selectedPackage) {
//       setError("يجب اختيار باقة إعلانية");
//       return false;
//     }
//     setError(null);
//     return true;
//   };

//   const uploadImagesToFirebase = async (files) => {
//     const currentUser = auth.currentUser;
//     if (!currentUser) {
//       throw new Error("يجب tsجيل الدخول أولاً. يرجى تسجيل الدخول من جديد.");
//     }
//     const uploadPromises = files.map(async (file, index) => {
//       const timestamp = Date.now();
//       const fileName = `financing_${timestamp}_${index}.jpg`;
//       const storageRef = ref(
//         storage,
//         `financing_images/${currentUser.uid}/${fileName}`
//       );
//       await uploadBytes(storageRef, file);
//       const downloadURL = await getDownloadURL(storageRef);
//       return downloadURL;
//     });
//     return Promise.all(uploadPromises);
//   };

//   // دالة لرفع صورة الإيصال إلى Firebase Storage (نفس مسار صور العقارات)
//   const uploadReceiptToFirebase = async (receiptFile) => {
//     console.log("uploadReceiptToFirebase - Starting upload...");
//     console.log("uploadReceiptToFirebase - File:", receiptFile);

//     const currentUser = auth.currentUser;
//     if (!currentUser) {
//       console.error("uploadReceiptToFirebase - No current user");
//       throw new Error("يجب تسجيل الدخول أولاً");
//     }

//     console.log("uploadReceiptToFirebase - Current user:", currentUser.uid);

//     const timestamp = Date.now();
//     const fileName = `receipt_${timestamp}.jpg`;
//     const storagePath = `property_images/${currentUser.uid}/${fileName}`;
//     const storageRef = ref(storage, storagePath);

//     console.log("uploadReceiptToFirebase - Storage path:", storagePath);

//     try {
//       console.log("uploadReceiptToFirebase - Starting uploadBytes...");
//       await uploadBytes(storageRef, receiptFile);
//       console.log("uploadReceiptToFirebase - uploadBytes completed");

//       console.log("uploadReceiptToFirebase - Getting download URL...");
//       const downloadURL = await getDownloadURL(storageRef);
//       console.log(
//         "uploadReceiptToFirebase - Receipt uploaded successfully to:",
//         downloadURL
//       );
//       return downloadURL;
//     } catch (error) {
//       console.error(
//         "uploadReceiptToFirebase - Error uploading receipt:",
//         error
//       );
//       console.error("uploadReceiptToFirebase - Error code:", error.code);
//       console.error("uploadReceiptToFirebase - Error message:", error.message);
//       throw new Error(`فشل في رفع صورة الإيصال: ${error.message}`);
//     }
//   };

//   const performSubmit = async () => {
//     setLoading(true);
//     setError(null);

//     console.log("=== performSubmit started ===");
//     console.log("isEditMode:", isEditMode);
//     console.log("form.id:", form.id);
//     console.log("editData:", editData);
//     console.log(
//       "editData keys:",
//       editData ? Object.keys(editData) : "editData is null/undefined"
//     );

//     try {
//       const newImageFiles = images;
//       const newImageUrls =
//         newImageFiles.length > 0
//           ? await uploadImagesToFirebase(newImageFiles)
//           : [];

//       // Robust merge: combine all old image URLs with all new uploaded image URLs
//       const oldImageUrls = imageMetadata
//         .filter((img) => !img.isNew && img.url && img.url.startsWith("http"))
//         .map((img) => img.url);
//       const finalImageUrls = [...oldImageUrls, ...newImageUrls];
//       console.log("Final image list before update:", finalImageUrls);

//       // التعامل مع صورة الإيصال
//       let receiptUrl = null;

//       console.log("Receipt handling - receiptImage:", receiptImage);
//       console.log("Receipt handling - receiptImage type:", typeof receiptImage);
//       console.log(
//         "Receipt handling - receiptImage instanceof File:",
//         receiptImage instanceof File
//       );
//       console.log("Receipt handling - isEditMode:", isEditMode);
//       console.log(
//         "Receipt handling - editData?.receipt_image:",
//         editData?.receipt_image
//       );

//       if (receiptImage) {
//         if (receiptImage instanceof File) {
//           // صورة جديدة - ارفعها يدوياً
//           console.log("Receipt handling - New file detected, uploading...");
//           console.log("Receipt handling - File name:", receiptImage.name);
//           console.log("Receipt handling - File size:", receiptImage.size);
//           try {
//             receiptUrl = await uploadReceiptToFirebase(receiptImage);
//             console.log("Receipt handling - Upload completed:", receiptUrl);
//           } catch (uploadError) {
//             console.error("Receipt handling - Upload failed:", uploadError);
//             throw uploadError;
//           }
//         } else {
//           // صورة موجودة - استخدم الرابط الموجود
//           receiptUrl = receiptImage;
//           console.log("Receipt handling - Existing URL detected:", receiptUrl);
//         }
//       } else if (isEditMode && editData?.receipt_image) {
//         // في وضع التعديل، احتفظ بالصورة الأصلية إذا لم يتم رفع صورة جديدة
//         receiptUrl = editData.receipt_image;
//         console.log("Receipt handling - Keeping original receipt:", receiptUrl);
//       } else {
//         console.log("Receipt handling - No receipt image found");
//       }

//       let ad;
//       // البحث عن الـ ID في مفاتيح مختلفة محتملة
//       const possibleIds = {
//         "form.id": form.id,
//         "editData?.id": editData?.id,
//         "editData?._id": editData?._id,
//         "editData?.docId": editData?.docId,
//         "editData?.adId": editData?.adId,
//         "editData?.advertisementId": editData?.advertisementId,
//       };

//       console.log("Checking all possible IDs:", possibleIds);

//       const adId =
//         form.id ||
//         editData?.id ||
//         editData?._id ||
//         editData?.docId ||
//         editData?.adId ||
//         editData?.advertisementId;
//       console.log("Checking edit mode - isEditMode:", isEditMode);
//       console.log("Checking edit mode - final adId:", adId);

//       if (isEditMode && adId) {
//         console.log("Edit mode - getting existing ad with ID:", adId);

//         // جلب الإعلان الموجود من قاعدة البيانات
//         ad = await FinancingAdvertisement.getById(adId);
//         if (!ad) {
//           setError("الإعلان غير موجود أو تم حذفه.");
//           return;
//         }

//         console.log("Existing ad found:", ad);

//         // تحضير البيانات للتحديث
//         const updateData = {
//           ...form,
//           images: finalImageUrls,
//           adPackage: selectedPackage ? Number(selectedPackage) : null,
//         };

//         // إضافة رابط الإيصال إذا كان موجود
//         if (receiptUrl) {
//           updateData.receipt_image = receiptUrl;
//         }

//         console.log("Updating ad with data:", updateData);
//         console.log("New image files:", newImageFiles);
//         console.log("Receipt URL:", receiptUrl);

//         // لا نمرر ملف الإيصال لأننا رفعناه يدوياً
//         await ad.update(updateData, newImageFiles, null);

//         await ad.returnToPending();
//       } else {
//         const currentUser = auth.currentUser;
//         if (!currentUser) throw new Error("يجب تسجيل الدخول أولاً.");

//         console.log("Creating new ad with receipt URL:", receiptUrl);

//         ad = new FinancingAdvertisement({
//           ...form,
//           userId: currentUser.uid,
//           adPackage: selectedPackage ? Number(selectedPackage) : null,
//           images: finalImageUrls,
//           receipt_image: receiptUrl, // إضافة رابط الإيصال إذا كان موجود
//         });

//         // في الإضافة الجديدة، لا نمرر ملف الإيصال لأننا رفعناه يدوياً
//         await ad.save(newImageFiles, null);
//         console.log("New ad saved with ID:", ad.id);
//         form.id = ad.id;
//       }

//       console.log("Operation completed successfully");
//       const finalId = adId || ad.id;
//       console.log("Final ad ID:", finalId);
//       console.log("Is edit mode:", isEditMode);

//       setSuccess(true);
//       setTimeout(() => {
//         console.log("Navigating to:", `/details/financingAds/${finalId}`);
//         navigate(`/details/financingAds/${finalId}`);
//       }, 1500);
//     } catch (error) {
//       console.error("Error submitting form:", error);
//       setError(error.message || "حدث خطأ أثناء حفظ الإعلان");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // --- MODIFIED: The handleSubmit function to correctly save old and new images
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!isFormValid()) return;
//     if (!auth.currentUser) {
//       setError("يجب تسجيل الدخول أولاً.");
//       return;
//     }

//     // إذا لم يتم رفع صورة الإيصال وليس في وضع التعديل، أظهر التنبيه
//     if (!receiptImage && !isEditMode) {
//       setPendingData(form);
//       setShowReceiptWarning(true);
//       return;
//     }

//     await performSubmit();
//   };

//   const handleWarningConfirm = () => {
//     setShowReceiptWarning(false);
//     if (pendingData) {
//       performSubmit();
//       setPendingData(null);
//     }
//   };

//   const handleCloseSnackbar = () => {
//     setSuccess(false);
//   };

//   const removeReceiptImage = () => {
//     setReceiptImage(null);
//     setReceiptPreviewUrl(null);
//     // تنظيف أي object URL إذا كان موجوداً
//     if (receiptPreviewUrl && receiptPreviewUrl.startsWith("blob:")) {
//       URL.revokeObjectURL(receiptPreviewUrl);
//     }
//   };

//   return (
//     <Paper
//       elevation={3}
//       sx={{ p: 3, borderRadius: 2, mt: 5, maxWidth: 1100, mx: "auto", mb: 10 }}
//     >
//       <Typography
//         variant="h4"
//         gutterBottom
//         sx={{ color: "#6E00FE", mb: 3, textAlign: "center" }}
//       >
//         <Box component="span" sx={{ borderBottom: "3px solid #6E00FE", px: 2 }}>
//           {isEditMode ? "تعديل إعلان تمويل" : "إضافة إعلان تمويل جديد"}
//         </Box>
//       </Typography>
//       {error && (
//         <Alert severity="error" sx={{ mb: 2 }}>
//           {error}
//         </Alert>
//       )}

//       <Snackbar
//         open={success}
//         autoHideDuration={6000}
//         onClose={handleCloseSnackbar}
//         anchorOrigin={{ vertical: "top", horizontal: "center" }}
//       >
//         <Alert
//           severity="success"
//           sx={{ width: "100%", mt: 3 }}
//           onClose={handleCloseSnackbar}
//         >
//           {isEditMode
//             ? "تم تحديث إعلان التمويل بنجاح! سيتم إعادة مراجعته من قبل الإدارة. سيتم الانتقال لصفحة التفاصيل خلال ثانيتين..."
//             : "تم حفظ إعلان التمويل بنجاح! سيتم الانتقال لصفحة التفاصيل خلال ثانيتين..."}
//         </Alert>
//       </Snackbar>
      
//       <form onSubmit={handleSubmit}>
//         <Grid spacing={2} dir="rtl">
//           <Grid item xs={12} md={6} mt={2} mb={2} lg={4}>
//             <TextField
//               fullWidth
//               label="عنوان الإعلان"
//               name="title"
//               value={form.title}
//               onChange={handleChange}
//               required
//               disabled={loading}
//             />
//           </Grid>
//           <Grid item xs={12} md={6} mt={2} mb={2} lg={4}>
//             <TextField
//               fullWidth
//               label="الوصف"
//               name="description"
//               value={form.description}
//               onChange={handleChange}
//               required
//               multiline
//               rows={3}
//               disabled={loading}
//             />
//           </Grid>
//           <Grid item xs={12} md={6} mt={2} mb={2} lg={4}>
//             <TextField
//               fullWidth
//               label="اسم الجهة"
//               name="org_name"
//               value={form.org_name}
//               onChange={handleChange}
//               required
//               disabled={loading}
//             />
//           </Grid>
//           <Grid item xs={12} md={6} mt={2} mb={2} lg={4}>
//             <TextField
//               fullWidth
//               label="رقم الهاتف"
//               name="phone"
//               value={form.phone}
//               onChange={handleChange}
//               required
//               disabled={loading}
//             />
//           </Grid>
//           <Grid item xs={12} md={6} mt={2} mb={2} lg={4}>
//             <TextField
//               fullWidth
//               label="الحد الأدنى (جنيه)"
//               name="start_limit"
//               type="number"
//               value={form.start_limit}
//               onChange={handleChange}
//               required
//               disabled={loading}
//             />
//           </Grid>
//           <Grid item xs={12} md={6} mt={2} mb={2} lg={4}>
//             <TextField
//               fullWidth
//               label="الحد الأقصى (جنيه)"
//               name="end_limit"
//               type="number"
//               value={form.end_limit}
//               onChange={handleChange}
//               required
//               disabled={loading}
//             />
//           </Grid>
//           <Grid item xs={12} md={4} mt={2} mb={2} lg={4}>
//             <TextField
//               fullWidth
//               label="فائدة حتى 5 سنوات (%)"
//               name="interest_rate_upto_5"
//               type="number"
//               value={form.interest_rate_upto_5}
//               onChange={handleChange}
//               required
//               disabled={loading}
//             />
//           </Grid>
//           <Grid item xs={12} md={4} mt={2} mb={2} lg={4}>
//             <TextField
//               fullWidth
//               label="فائدة حتى 10 سنوات (%)"
//               name="interest_rate_upto_10"
//               type="number"
//               value={form.interest_rate_upto_10}
//               onChange={handleChange}
//               required
//               disabled={loading}
//             />
//           </Grid>
//           <Grid item xs={12} md={4} mt={2} mb={2} lg={4}>
//             <TextField
//               fullWidth
//               label="فائدة أكثر من 10 سنوات (%)"
//               name="interest_rate_above_10"
//               type="number"
//               value={form.interest_rate_above_10}
//               onChange={handleChange}
//               required
//               disabled={loading}
//             />
//           </Grid>
//           <Grid item xs={12} mt={2}>
//             <Typography
//               variant="h6"
//               sx={{ color: "#6E00FE", mb: 2, mt: 2, textAlign: "right" }}
//             >
//               صور الإعلان (حد أقصى 4 صور)
//             </Typography>
//             <input
//               accept="image/jpeg,image/png"
//               type="file"
//               multiple
//               onChange={handleImageChange}
//               disabled={loading || imageMetadata.length >= 4}
//               style={{ marginBottom: "16px" }}
//             />
//             <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
//               {imageMetadata.map((img) => (
//                 <Box key={img.id} sx={{ position: "relative" }}>
//                   <img
//                     src={img.url}
//                     alt={`معاينة ${img.id + 1}`}
//                     style={{
//                       width: "100px",
//                       height: "100px",
//                       objectFit: "cover",
//                       borderRadius: "8px",
//                     }}
//                   />
//                   <Chip
//                     label={img.isNew ? "جديد" : "موجود"}
//                     size="small"
//                     color={img.isNew ? "primary" : "default"}
//                     sx={{
//                       position: "absolute",
//                       top: 4,
//                       right: 4,
//                       fontSize: "0.7rem",
//                       height: "20px",
//                       backgroundColor: img.isNew ? "primary.main" : "grey.500",
//                       color: "white",
//                       "& .MuiChip-label": {
//                         padding: "0 6px",
//                       },
//                     }}
//                   />
//                   <IconButton
//                     sx={{
//                       position: "absolute",
//                       top: 0,
//                       left: 0,
//                       bgcolor: "white",
//                       "&:hover": { bgcolor: "grey.200" },
//                     }}
//                     onClick={() => removeImage(img.id)}
//                     disabled={loading}
//                   >
//                     <DeleteIcon color="error" />
//                   </IconButton>
//                 </Box>
//               ))}
//               {imageMetadata.length === 0 && !loading && (
//                 <Box
//                   sx={{
//                     display: "flex",
//                     alignItems: "center",
//                     justifyContent: "center",
//                     width: "100px",
//                     height: "100px",
//                     border: "2px dashed #ccc",
//                     borderRadius: "8px",
//                     color: "text.secondary",
//                     backgroundColor: "#f5f5f5",
//                   }}
//                 >
//                   <Typography variant="caption" textAlign="center">
//                     لا توجد صور
//                   </Typography>
//                 </Box>
//               )}
//             </Box>
//           </Grid>
//           <PaymentMethods />
//           <Grid item xs={12}>
//             <Typography
//               variant="h6"
//               sx={{ color: "#6E00FE", mb: 2, mt: 2, textAlign: "right" }}
//             >
//               اختيار الباقة وإيصال الدفع
//             </Typography>
//             <AdPackages
//               selectedPackageId={selectedPackage}
//               setSelectedPackageId={setSelectedPackage}
//               onReceiptImageChange={(fileOrUrl) => {
//                 setReceiptImage(fileOrUrl);
//                 if (fileOrUrl instanceof File) {
//                   setReceiptPreviewUrl(URL.createObjectURL(fileOrUrl));
//                 } else {
//                   setReceiptPreviewUrl(fileOrUrl);
//                 }
//               }}
//               receiptImage={receiptImage}
//               receiptPreviewUrl={receiptPreviewUrl}
//               removeReceiptImage={removeReceiptImage}
//             />
//             {error && error.includes("باقة إعلانية") && (
//               <Typography
//                 variant="caption"
//                 color="error"
//                 sx={{ mt: 1, textAlign: "right" }}
//               >
//                 {error}
//               </Typography>
//             )}
//           </Grid>
//           <Grid item xs={12} sx={{ textAlign: "center", mt: 2 }}>
//             <Button
//               type="submit"
//               variant="contained"
//               size="large"
//               sx={{
//                 px: 5,
//                 py: 2,
//                 fontWeight: "bold",
//                 borderRadius: 3,
//                 minWidth: 200,
//               }}
//               disabled={loading}
//             >
//               {loading ? (
//                 <CircularProgress size={24} color="inherit" />
//               ) : isEditMode ? (
//                 "حفظ التعديلات"
//               ) : (
//                 "حفظ الإعلان"
//               )}
//             </Button>
//           </Grid>
//         </Grid>
//       </form>

//       {/* Dialog للتنبيه عند عدم رفع صورة الإيصال */}
//       <Dialog open={showReceiptWarning} onClose={() => {}}>
//         <DialogTitle>تنبيه هام</DialogTitle>
//         <DialogContent dir="rtl">
//           لن يتم تفعيل الاعلان الا في حالة رفع صورة ايصال الدفع , و يمكنك رفع
//           صورة الايصال من لوحة التحكم الخاصة بحسابك .
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleWarningConfirm}>حسناً</Button>
//         </DialogActions>
//       </Dialog>
//     </Paper>
//   );
// }



import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Grid,
  Alert,
  CircularProgress,
  IconButton,
  Chip,
  Snackbar,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import FinancingAdvertisement from "../FireBase/modelsWithOperations/FinancingAdvertisement";
import DeleteIcon from "@mui/icons-material/Delete";
import React from "react";
import { auth } from "../FireBase/firebaseConfig";
import AdPackages from "../../packages/packagesDevAndFin";
import PaymentMethods from "./PaymentMethods";

export default function AddFinancingAdForm() {
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const navigate = useNavigate();
  const location = useLocation();

  const urlParams = new URLSearchParams(window.location.search);
  const editModeParam = urlParams.get("editMode");
  const adIdParam = urlParams.get("adId");

  const editData = location.state?.adData || null;
  const isEditMode =
    location.state?.editMode || editModeParam === "true" || false;

  const [images, setImages] = useState([]); // new files فقط
  const [imageMetadata, setImageMetadata] = useState(
    isEditMode && editData?.images && Array.isArray(editData.images)
      ? editData.images
          .filter(
            (img) =>
              img &&
              img.trim() !== "" &&
              img !== "null" &&
              img !== "undefined" &&
              img.startsWith("http")
          )
          .map((url, idx) => ({ url, isNew: false, id: `existing-${idx}` }))
      : []
  );

  const [form, setForm] = useState({
    title: editData?.title || "",
    description: editData?.description || "",
    phone: editData?.phone || "",
    start_limit: editData?.start_limit || "",
    end_limit: editData?.end_limit || "",
    org_name: editData?.org_name || "",
    userId: editData?.userId || auth.currentUser?.uid || "admin",
    type_of_user: editData?.type_of_user || "individual",
    ads: false,
    adExpiryTime:
      editData?.adExpiryTime || Date.now() + 30 * 24 * 60 * 60 * 1000,
    interest_rate_upto_5: editData?.interest_rate_upto_5 || "",
    interest_rate_upto_10: editData?.interest_rate_upto_10 || "",
    interest_rate_above_10: editData?.interest_rate_above_10 || "",
    id: editData?.id || undefined,
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const [selectedPackage, setSelectedPackage] = useState(
    editData?.adPackage || null
  );
  const [receiptImage, setReceiptImage] = useState(null);
  const [receiptPreviewUrl, setReceiptPreviewUrl] = useState(null);
  const [showReceiptWarning, setShowReceiptWarning] = useState(false);
  const [pendingData, setPendingData] = useState(null);

  React.useEffect(() => {
    const initializeEditData = async () => {
      if (isEditMode) {
        let adData = editData;

        if (adIdParam && !editData) {
          try {
            adData = await FinancingAdvertisement.getById(adIdParam);
            if (!adData) {
              setError("الإعلان غير موجود");
              return;
            }
          } catch (_error) {
            setError("حدث خطأ أثناء تحميل بيانات الإعلان");
            return;
          }
        }

        if (adData) {
          setForm({
            title: adData.title || "",
            description: adData.description || "",
            phone: adData.phone || "",
            start_limit: adData.start_limit || "",
            end_limit: adData.end_limit || "",
            org_name: adData.org_name || "",
            userId: adData.userId || auth.currentUser?.uid || "admin",
            type_of_user: adData.type_of_user || "individual",
            ads: adData.ads !== undefined ? adData.ads : false,
            adExpiryTime:
              adData.adExpiryTime || Date.now() + 30 * 24 * 60 * 60 * 1000,
            interest_rate_upto_5: adData.interest_rate_upto_5 || "",
            interest_rate_upto_10: adData.interest_rate_upto_10 || "",
            interest_rate_above_10: adData.interest_rate_above_10 || "",
            id: adData.id || undefined,
          });

          if (adData.images && adData.images.length > 0) {
            const validImages = adData.images.filter(
              (img) =>
                img &&
                img.trim() !== "" &&
                img !== "null" &&
                img !== "undefined" &&
                img.startsWith("http")
            );
            const existingImageMetadata = validImages.map((url, index) => ({
              url,
              isNew: false,
              id: `existing-${index}`,
            }));
            setImageMetadata(existingImageMetadata);
          } else {
            setImageMetadata([]);
          }

          if (adData.adPackage) {
            setSelectedPackage(adData.adPackage);
          }

          if (adData.receipt_image) {
            setReceiptImage(adData.receipt_image);
            setReceiptPreviewUrl(adData.receipt_image);
          }
        }
      }
    };

    initializeEditData();
  }, [isEditMode, editData, adIdParam]);

  React.useEffect(() => {
    return () => {
      imageMetadata.forEach((img) => {
        if (img.url && img.url.startsWith("blob:")) {
          URL.revokeObjectURL(img.url);
        }
      });
    };
  }, [imageMetadata]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const validTypes = ["image/jpeg", "image/png"];
    const maxSize = 5 * 1024 * 1024;
    const invalidFiles = files.filter(
      (file) => !validTypes.includes(file.type) || file.size > maxSize
    );
    if (invalidFiles.length > 0) {
      setError("يرجى رفع صور بصيغة JPEG أو PNG وبحجم أقل من 5 ميجابايت");
      return;
    }

    const currentImageCount = imageMetadata.length;
    if (files.length + currentImageCount > 4) {
      setError("يمكنك تحميل 4 صور كحد أقصى (بما في ذلك الصور الموجودة)");
      return;
    }

    setError(null);

    const newImageMetadata = files.map((file, index) => ({
      url: URL.createObjectURL(file),
      isNew: true,
      id: `new-${Date.now()}-${index}`,
      file: file,
    }));
    setImageMetadata((prev) => [...prev, ...newImageMetadata]);
    setImages((prev) => [...prev, ...files]);
  };

  const removeImage = (idToRemove) => {
    setImageMetadata((prev) => {
      const imageToRemove = prev.find((img) => img.id === idToRemove);
      if (!imageToRemove) return prev;

      if (imageToRemove.url && imageToRemove.url.startsWith("blob:")) {
        URL.revokeObjectURL(imageToRemove.url);
      }

      if (imageToRemove.isNew) {
        setImages((prevFiles) =>
          prevFiles.filter((file) => file !== imageToRemove.file)
        );
      }

      return prev.filter((img) => img.id !== idToRemove);
    });
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const isFormValid = () => {
    const requiredFields = [
      "title",
      "description",
      "phone",
      "org_name",
      "start_limit",
      "end_limit",
      "interest_rate_upto_5",
      "interest_rate_upto_10",
      "interest_rate_above_10",
    ];
    for (let key of requiredFields) {
      if (!form[key] || form[key].toString().trim() === "") {
        setError(`من فضلك أدخل ${key}`);
        return false;
      }
    }
    const above10 = Number(form.interest_rate_above_10);
    if (isNaN(above10) || above10 <= 0) {
      setError("الفائدة لأكثر من 10 سنوات يجب أن تكون رقمًا أكبر من صفر");
      return false;
    }
    if (!selectedPackage) {
      setError("يجب اختيار باقة إعلانية");
      return false;
    }
    setError(null);
    return true;
  };

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

  // Note: Receipt upload is now handled by the FinancingAdvertisement model

  const performSubmit = async () => {
    setLoading(true);
    setError(null);

    try {
      const oldImageUrls = imageMetadata
        .filter((img) => !img.isNew && img.url && img.url.startsWith("http"))
        .map((img) => img.url);

      let receiptFileToPass = null;
      if (receiptImage && receiptImage instanceof File) {
        receiptFileToPass = receiptImage;
      }

      const editId = form.id || editData?.id || adIdParam;

      let ad;
      if (isEditMode && editId) {
        const userId = editData?.userId || form.userId || auth.currentUser?.uid;
        if (!userId) {
          setError("معرف المستخدم غير صالح للتعديل.");
          return;
        }

        ad = new FinancingAdvertisement({
          ...form,
          id: editId,
          userId: userId,
          images: oldImageUrls,
        });

        await ad.update(
          {
            ...form,
            images: oldImageUrls,
            adPackage: selectedPackage ? Number(selectedPackage) : null,
          },
          images,
          receiptFileToPass
        );

        await ad.returnToPending();
      } else {
        const currentUser = auth.currentUser;
        if (!currentUser) throw new Error("يجب تسجيل الدخول أولاً.");

        ad = new FinancingAdvertisement({
          ...form,
          userId: currentUser.uid,
          adPackage: selectedPackage ? Number(selectedPackage) : null,
          images: oldImageUrls,
        });
        await ad.save(images, receiptFileToPass);
        form.id = ad.id;
      }

      setSuccess(true);
      setTimeout(() => {
        const finalId = editId || form.id || ad.id;
        navigate(`/details/financingAds/${finalId}`);
      }, 1500);
    } catch (error) {
      console.error("Error submitting form:", error);
      setError(error.message || "حدث خطأ أثناء حفظ الإعلان");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid()) return;
    if (!auth.currentUser) {
      setError("يجب تسجيل الدخول أولاً.");
      return;
    }
    if (!receiptImage && !isEditMode) {
      setPendingData(form);
      setShowReceiptWarning(true);
      return;
    }
    await performSubmit();
  };

  const handleWarningConfirm = () => {
    setShowReceiptWarning(false);
    if (pendingData) {
      performSubmit();
      setPendingData(null);
    }
  };

  const handleCloseSnackbar = () => {
    setSuccess(false);
  };

  const removeReceiptImage = () => {
    setReceiptImage(null);
    setReceiptPreviewUrl(null);
    if (receiptPreviewUrl && receiptPreviewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(receiptPreviewUrl);
    }
  };

  return (
    <Paper
      elevation={3}
      sx={{ p: 3, borderRadius: 2, mt: 5, maxWidth: 1100, mx: "auto", mb: 10 }}
    >
      <Typography
        variant="h4"
        gutterBottom
        sx={{ color: "#6E00FE", mb: 3, textAlign: "center" }}
      >
        <Box component="span" sx={{ borderBottom: "3px solid #6E00FE", px: 2 }}>
          {isEditMode ? "تعديل إعلان تمويل" : "إضافة إعلان تمويل جديد"}
        </Box>
      </Typography>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Snackbar
        open={success}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          severity="success"
          sx={{ width: "100%", mt: 3 }}
          onClose={handleCloseSnackbar}
        >
          {isEditMode
            ? "تم تحديث إعلان التمويل بنجاح! سيتم إعادة مراجعته من قبل الإدارة. سيتم الانتقال لصفحة التفاصيل خلال ثانيتين..."
            : "تم حفظ إعلان التمويل بنجاح! سيتم الانتقال لصفحة التفاصيل خلال ثانيتين..."}
        </Alert>
      </Snackbar>

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
            <Typography
              variant="h6"
              sx={{ color: "#6E00FE", mb: 2, mt: 2, textAlign: "right" }}
            >
              صور الإعلان (حد أقصى 4 صور)
            </Typography>
            <input
              accept="image/jpeg,image/png"
              type="file"
              multiple
              onChange={handleImageChange}
              disabled={loading || imageMetadata.length >= 4}
              style={{ marginBottom: "16px" }}
            />
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
              {imageMetadata.map((img) => (
                <Box key={img.id} sx={{ position: "relative" }}>
                  <img
                    src={img.url}
                    alt={`معاينة ${img.id + 1}`}
                    style={{
                      width: "100px",
                      height: "100px",
                      objectFit: "cover",
                      borderRadius: "8px",
                    }}
                  />
                  <Chip
                    label={img.isNew ? "جديد" : "موجود"}
                    size="small"
                    color={img.isNew ? "primary" : "default"}
                    sx={{
                      position: "absolute",
                      top: 4,
                      right: 4,
                      fontSize: "0.7rem",
                      height: "20px",
                      backgroundColor: img.isNew ? "primary.main" : "grey.500",
                      color: "white",
                      "& .MuiChip-label": {
                        padding: "0 6px",
                      },
                    }}
                  />
                  <IconButton
                    sx={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      bgcolor: "white",
                      "&:hover": { bgcolor: "grey.200" },
                    }}
                    onClick={() => removeImage(img.id)}
                    disabled={loading}
                  >
                    <DeleteIcon color="error" />
                  </IconButton>
                </Box>
              ))}
              {imageMetadata.length === 0 && !loading && (
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
                  <Typography variant="caption" textAlign="center">
                    لا توجد صور
                  </Typography>
                </Box>
              )}
            </Box>
          </Grid>
          <PaymentMethods />
          <Grid item xs={12}>
            <Typography
              variant="h6"
              sx={{ color: "#6E00FE", mb: 2, mt: 2, textAlign: "right" }}
            >
              اختيار الباقة وإيصال الدفع
            </Typography>
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
            {error && error.includes("باقة إعلانية") && (
              <Typography
                variant="caption"
                color="error"
                sx={{ mt: 1, textAlign: "right" }}
              >
                {error}
              </Typography>
            )}
          </Grid>
          <Grid item xs={12} sx={{ textAlign: "center", mt: 2 }}>
            <Button
              type="submit"
              variant="contained"
              size="large"
              sx={{
                px: 5,
                py: 2,
                fontWeight: "bold",
                borderRadius: 3,
                minWidth: 200,
              }}
              disabled={loading}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : isEditMode ? (
                "حفظ التعديلات"
              ) : (
                "حفظ الإعلان"
              )}
            </Button>
          </Grid>
        </Grid>
      </form>

      {/* Dialog للتنبيه عند عدم رفع صورة الإيصال */}
      <Dialog open={showReceiptWarning} onClose={() => {}}>
        <DialogTitle>تنبيه هام</DialogTitle>
        <DialogContent dir="rtl">
          لن يتم تفعيل الاعلان الا في حالة رفع صورة ايصال الدفع , و يمكنك رفع
          صورة الايصال من لوحة التحكم الخاصة بحسابك .
        </DialogContent>
        <DialogActions>
          <Button onClick={handleWarningConfirm}>حسناً</Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}

