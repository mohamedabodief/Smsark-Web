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
    Chip,
    FormControl,
    InputLabel,
    Select,
    MenuItem
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

export default function EditHomepageAdModal({ open, onClose, onSave, ad, setSnackbar }) {
    const [formData, setFormData] = useState({
        newImage: null,
        newReceipt: null,
        reviewStatus: 'pending'
    });
    const [imagePreview, setImagePreview] = useState(null);
    const [receiptPreview, setReceiptPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (ad) {
            setImagePreview(ad.image);
            setReceiptPreview(ad.receipt_image);
            setFormData(prev => ({ ...prev, reviewStatus: ad.reviewStatus }));
        }
    }, [ad]);

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setFormData(prev => ({ ...prev, newImage: file }));
            const reader = new FileReader();
            reader.onload = (e) => setImagePreview(e.target.result);
            reader.readAsDataURL(file);
        }
    };

    const handleReceiptChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setFormData(prev => ({ ...prev, newReceipt: file }));
            const reader = new FileReader();
            reader.onload = (e) => setReceiptPreview(e.target.result);
            reader.readAsDataURL(file);
        }
    };

    const handleReviewStatusChange = (event) => {
        setFormData(prev => ({ ...prev, reviewStatus: event.target.value }));
    };

    const handleSubmit = async () => {
        setLoading(true);
        setError('');

        try {
            const updates = {
                reviewStatus: formData.reviewStatus
            };

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
            setFormData({ newImage: null, newReceipt: null, reviewStatus: 'pending' });
            setError('');
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
                        معرف المستخدم
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {ad.userId}
                    </Typography>
                </Box>

                <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle1" gutterBottom>
                        حالة المراجعة
                    </Typography>
                    <FormControl fullWidth sx={{ mb: 2 }}>
                        <InputLabel>حالة المراجعة</InputLabel>
                        <Select
                            value={formData.reviewStatus}
                            onChange={handleReviewStatusChange}
                            label="حالة المراجعة"
                        >
                            <MenuItem value="pending">قيد المراجعة</MenuItem>
                            <MenuItem value="approved">مقبول</MenuItem>
                            <MenuItem value="rejected">مرفوض</MenuItem>
                        </Select>
                    </FormControl>
                </Box>

                <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle1" gutterBottom>
                        صورة الإعلان الحالية
                    </Typography>
                    {ad.image && (
                        <Box sx={{ textAlign: 'center', mb: 2 }}>
                            <img
                                src={ad.image}
                                alt="Current Ad"
                                style={{ maxWidth: '100%', maxHeight: 200, borderRadius: 8 }}
                            />
                        </Box>
                    )}
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
                            fullWidth
                            sx={{ mb: 2 }}
                        >
                            تغيير صورة الإعلان
                        </Button>
                    </label>
                </Box>

                <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle1" gutterBottom>
                        إيصال الدفع الحالي
                    </Typography>
                    {ad.receipt_image && (
                        <Box sx={{ textAlign: 'center', mb: 2 }}>
                            <img
                                src={ad.receipt_image}
                                alt="Current Receipt"
                                style={{ maxWidth: '100%', maxHeight: 200, borderRadius: 8 }}
                            />
                        </Box>
                    )}
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
                            fullWidth
                            sx={{ mb: 2 }}
                        >
                            تغيير إيصال الدفع
                        </Button>
                    </label>
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

                {ad.review_note && (
                    <Box sx={{ mb: 3 }}>
                        <Typography variant="subtitle1" gutterBottom>
                            ملاحظات المراجعة
                        </Typography>
                        <Typography variant="body2" color="error">
                            {ad.review_note}
                        </Typography>
                    </Box>
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