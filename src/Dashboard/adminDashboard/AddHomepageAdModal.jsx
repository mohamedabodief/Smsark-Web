import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Box,
    Typography,
    IconButton,
    Alert,
    CircularProgress,
    FormControl,
    InputLabel,
    Select,
    MenuItem
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

export default function AddHomepageAdModal({ open, onClose, onAdd, setSnackbar }) {
    const [formData, setFormData] = useState({
        image: null,
        receipt_image: null,
        userId: '',
        reviewStatus: 'pending'
    });
    const [imagePreview, setImagePreview] = useState(null);
    const [receiptPreview, setReceiptPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setFormData(prev => ({ ...prev, image: file }));
            const reader = new FileReader();
            reader.onload = (e) => setImagePreview(e.target.result);
            reader.readAsDataURL(file);
        }
    };

    const handleReceiptChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setFormData(prev => ({ ...prev, receipt_image: file }));
            const reader = new FileReader();
            reader.onload = (e) => setReceiptPreview(e.target.result);
            reader.readAsDataURL(file);
        }
    };

    const handleUserIdChange = (event) => {
        setFormData(prev => ({ ...prev, userId: event.target.value }));
    };

    const handleReviewStatusChange = (event) => {
        setFormData(prev => ({ ...prev, reviewStatus: event.target.value }));
    };

    const handleSubmit = async () => {
        if (!formData.image) {
            setError('يرجى اختيار صورة للإعلان');
            return;
        }

        if (!formData.userId) {
            setError('يرجى إدخال معرف المستخدم');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const adData = {
                userId: formData.userId,
                ads: false,
                reviewStatus: formData.reviewStatus
            };

            await onAdd({
                adData,
                imageFile: formData.image,
                receiptFile: formData.receipt_image
            });

            // Reset form
            setFormData({ image: null, receipt_image: null, userId: '', reviewStatus: 'pending' });
            setImagePreview(null);
            setReceiptPreview(null);
            onClose();
        } catch (error) {
            setError(error.message || 'حدث خطأ أثناء إضافة الإعلان');
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        if (!loading) {
            setFormData({ image: null, receipt_image: null, userId: '', reviewStatus: 'pending' });
            setImagePreview(null);
            setReceiptPreview(null);
            setError('');
            onClose();
        }
    };

    return (
        <Dialog 
            open={open} 
            onClose={handleClose}
            maxWidth="sm"
            fullWidth
            dir="rtl"
        >
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                إضافة إعلان للصفحة الرئيسية
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
                    <TextField
                        fullWidth
                        label="معرف المستخدم"
                        value={formData.userId}
                        onChange={handleUserIdChange}
                        required
                        sx={{ mb: 2 }}
                    />
                </Box>

                <Box sx={{ mb: 3 }}>
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
                        صورة الإعلان *
                    </Typography>
                    <input
                        accept="image/*"
                        style={{ display: 'none' }}
                        id="ad-image-upload"
                        type="file"
                        onChange={handleImageChange}
                        disabled={loading}
                    />
                    <label htmlFor="ad-image-upload">
                        <Button
                            variant="outlined"
                            component="span"
                            startIcon={<CloudUploadIcon />}
                            disabled={loading}
                            fullWidth
                            sx={{ mb: 2 }}
                        >
                            اختيار صورة الإعلان
                        </Button>
                    </label>
                    {imagePreview && (
                        <Box sx={{ textAlign: 'center', mb: 2 }}>
                            <img
                                src={imagePreview}
                                alt="Preview"
                                style={{ maxWidth: '100%', maxHeight: 200, borderRadius: 8 }}
                            />
                        </Box>
                    )}
                </Box>

                <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle1" gutterBottom>
                        إيصال الدفع (اختياري)
                    </Typography>
                    <input
                        accept="image/*"
                        style={{ display: 'none' }}
                        id="receipt-upload"
                        type="file"
                        onChange={handleReceiptChange}
                        disabled={loading}
                    />
                    <label htmlFor="receipt-upload">
                        <Button
                            variant="outlined"
                            component="span"
                            startIcon={<CloudUploadIcon />}
                            disabled={loading}
                            fullWidth
                            sx={{ mb: 2 }}
                        >
                            اختيار إيصال الدفع
                        </Button>
                    </label>
                    {receiptPreview && (
                        <Box sx={{ textAlign: 'center', mb: 2 }}>
                            <img
                                src={receiptPreview}
                                alt="Receipt Preview"
                                style={{ maxWidth: '100%', maxHeight: 200, borderRadius: 8 }}
                            />
                        </Box>
                    )}
                </Box>
            </DialogContent>

            <DialogActions sx={{ p: 2 }}>
                <Button onClick={handleClose} disabled={loading}>
                    إلغاء
                </Button>
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    disabled={loading || !formData.image || !formData.userId}
                    startIcon={loading ? <CircularProgress size={20} /> : null}
                >
                    {loading ? 'جاري الإضافة...' : 'إضافة الإعلان'}
                </Button>
            </DialogActions>
        </Dialog>
    );
} 