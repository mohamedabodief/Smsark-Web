import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Box,
    Typography,
    IconButton,
    Alert,
    CircularProgress,
    Chip
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { getStorage, ref, deleteObject } from 'firebase/storage';

export default function EnhancedEditHomepageAdModal({ open, onClose, onSave, ad }) {
    const [formData, setFormData] = useState({
        newImage: null,
        newReceipt: null
    });
    const [imagePreview, setImagePreview] = useState(null);
    const [receiptPreview, setReceiptPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [imagesToDelete, setImagesToDelete] = useState([]);

    useEffect(() => {
        if (ad) {
            setImagePreview(ad.image);
            setReceiptPreview(ad.receipt_image);
            setImagesToDelete([]); // Reset images to delete
        }
    }, [ad]);

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            // Mark old image for deletion if it exists
            if (ad.image && !imagesToDelete.includes(ad.image)) {
                setImagesToDelete(prev => [...prev, ad.image]);
            }
            
            setFormData(prev => ({ ...prev, newImage: file }));
            const reader = new FileReader();
            reader.onload = (e) => setImagePreview(e.target.result);
            reader.readAsDataURL(file);
        }
    };

    const handleReceiptChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            // Mark old receipt for deletion if it exists
            if (ad.receipt_image && !imagesToDelete.includes(ad.receipt_image)) {
                setImagesToDelete(prev => [...prev, ad.receipt_image]);
            }
            
            setFormData(prev => ({ ...prev, newReceipt: file }));
            const reader = new FileReader();
            reader.onload = (e) => setReceiptPreview(e.target.result);
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveImage = () => {
        if (ad.image && !imagesToDelete.includes(ad.image)) {
            setImagesToDelete(prev => [...prev, ad.image]);
        }
        setFormData(prev => ({ ...prev, newImage: null }));
        setImagePreview(null);
    };

    const handleRemoveReceipt = () => {
        if (ad.receipt_image && !imagesToDelete.includes(ad.receipt_image)) {
            setImagesToDelete(prev => [...prev, ad.receipt_image]);
        }
        setFormData(prev => ({ ...prev, newReceipt: null }));
        setReceiptPreview(null);
    };

    // Function to delete images from Firebase Storage
    const deleteImagesFromStorage = async (imageUrls) => {
        const storage = getStorage();
        const deletePromises = imageUrls.map(async (imageUrl) => {
            try {
                // Extract the path from the Firebase Storage URL
                const url = new URL(imageUrl);
                const pathMatch = url.pathname.match(/\/o\/(.+)\?/);
                if (pathMatch) {
                    const imagePath = decodeURIComponent(pathMatch[1]);
                    const imageRef = ref(storage, imagePath);
                    await deleteObject(imageRef);
                    console.log('Successfully deleted image:', imagePath);
                }
            } catch (error) {
                console.warn('Failed to delete image:', imageUrl, error);
                // Don't throw error, just log it as some images might not exist
            }
        });

        await Promise.allSettled(deletePromises);
    };

    const handleSubmit = async () => {
        setLoading(true);
        setError('');

        try {
            // First, delete old images from Firebase Storage
            if (imagesToDelete.length > 0) {
                await deleteImagesFromStorage(imagesToDelete);
            }

            const updates = {};
            
            // If images are being removed, set them to null
            if (imagesToDelete.includes(ad.image)) {
                updates.image = null;
            }
            if (imagesToDelete.includes(ad.receipt_image)) {
                updates.receipt_image = null;
            }

            await onSave({
                id: ad.id,
                updates,
                newImageFile: formData.newImage,
                newReceiptFile: formData.newReceipt
            });

            onClose();
        } catch (error) {
            setError(error.message || 'حدث خطأ أثناء تحديث الإعلان');
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        if (!loading) {
            setFormData({ newImage: null, newReceipt: null });
            setError('');
            setImagesToDelete([]);
            onClose();
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return 'warning';
            case 'approved': return 'success';
            case 'rejected': return 'error';
            default: return 'default';
        }
    };

    const getStatusLabel = (status) => {
        switch (status) {
            case 'pending': return 'قيد المراجعة';
            case 'approved': return 'مقبول';
            case 'rejected': return 'مرفوض';
            default: return status;
        }
    };

    if (!ad) return null;

    return (
        <Dialog 
            open={open} 
            onClose={handleClose}
            maxWidth="md"
            fullWidth
            dir="rtl"
        >
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                تعديل إعلان الصفحة الرئيسية
                <IconButton onClick={handleClose} disabled={loading}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent>
                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle1" gutterBottom>
                        حالة المراجعة
                    </Typography>
                    <Chip
                        label={getStatusLabel(ad.reviewStatus)}
                        color={getStatusColor(ad.reviewStatus)}
                        sx={{ mb: 1 }}
                    />
                    {ad.review_note && (
                        <Typography variant="body2" color="text.secondary">
                            ملاحظة: {ad.review_note}
                        </Typography>
                    )}
                </Box>

                <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle1" gutterBottom>
                        صورة الإعلان
                    </Typography>
                    {imagePreview && (
                        <Box sx={{ textAlign: 'center', mb: 2 }}>
                            <img
                                src={imagePreview}
                                alt="Ad Preview"
                                style={{ maxWidth: '100%', maxHeight: 200, borderRadius: 8 }}
                            />
                        </Box>
                    )}
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <input
                            accept="image/*"
                            style={{ display: 'none' }}
                            id="edit-ad-image-upload"
                            type="file"
                            onChange={handleImageChange}
                            disabled={loading}
                        />
                        <label htmlFor="edit-ad-image-upload">
                            <Button
                                variant="outlined"
                                component="span"
                                startIcon={<CloudUploadIcon />}
                                disabled={loading}
                                sx={{ mb: 2 }}
                            >
                                {imagePreview ? 'تغيير الصورة' : 'إضافة صورة'}
                            </Button>
                        </label>
                        {imagePreview && (
                            <Button
                                variant="outlined"
                                color="error"
                                onClick={handleRemoveImage}
                                disabled={loading}
                                sx={{ mb: 2 }}
                            >
                                حذف الصورة
                            </Button>
                        )}
                    </Box>
                </Box>

                <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle1" gutterBottom>
                        إيصال الدفع
                    </Typography>
                    {receiptPreview && (
                        <Box sx={{ textAlign: 'center', mb: 2 }}>
                            <img
                                src={receiptPreview}
                                alt="Receipt Preview"
                                style={{ maxWidth: '100%', maxHeight: 200, borderRadius: 8 }}
                            />
                        </Box>
                    )}
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <input
                            accept="image/*"
                            style={{ display: 'none' }}
                            id="edit-receipt-upload"
                            type="file"
                            onChange={handleReceiptChange}
                            disabled={loading}
                        />
                        <label htmlFor="edit-receipt-upload">
                            <Button
                                variant="outlined"
                                component="span"
                                startIcon={<CloudUploadIcon />}
                                disabled={loading}
                                sx={{ mb: 2 }}
                            >
                                {receiptPreview ? 'تغيير الإيصال' : 'إضافة إيصال'}
                            </Button>
                        </label>
                        {receiptPreview && (
                            <Button
                                variant="outlined"
                                color="error"
                                onClick={handleRemoveReceipt}
                                disabled={loading}
                                sx={{ mb: 2 }}
                            >
                                حذف الإيصال
                            </Button>
                        )}
                    </Box>
                </Box>

                <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle1" gutterBottom>
                        حالة التفعيل
                    </Typography>
                    <Chip
                        label={ad.ads ? 'مفعل' : 'غير مفعل'}
                        color={ad.ads ? 'success' : 'default'}
                    />
                    {ad.adExpiryTime && (
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                            ينتهي في: {new Date(ad.adExpiryTime).toLocaleDateString('ar-EG')}
                        </Typography>
                    )}
                </Box>

                {imagesToDelete.length > 0 && (
                    <Alert severity="info" sx={{ mb: 2 }}>
                        سيتم حذف {imagesToDelete.length} صورة من التخزين عند الحفظ
                    </Alert>
                )}
            </DialogContent>

            <DialogActions sx={{ p: 2 }}>
                <Button onClick={handleClose} disabled={loading}>
                    إلغاء
                </Button>
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    disabled={loading}
                    startIcon={loading ? <CircularProgress size={20} /> : null}
                >
                    {loading ? 'جاري التحديث...' : 'تحديث الإعلان'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}