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

const EXPIRY_OPTIONS = [
    { days: 7, label: '7 أيام - 200 جنيه', price: 200 },
    { days: 14, label: '14 يوم - 250 جنيه', price: 250 },
    { days: 21, label: '21 يوم - 300 جنيه', price: 300 },
];

export default function AddHomepageAdModal({ open, onClose, onAdd, setSnackbar, userType, userProfile }) {
    const [formData, setFormData] = useState({
        image: null,
        receipt_image: null,
        adExpiryOption: '',
    });
    const [imagePreview, setImagePreview] = useState(null);
    const [receiptPreview, setReceiptPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const isAdmin = userType === 'admin';

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

    const handleExpiryChange = (event) => {
        setFormData(prev => ({ ...prev, adExpiryOption: event.target.value }));
    };

    const handleSubmit = async () => {
        if (!formData.image) {
            setError('يرجى اختيار صورة للإعلان');
            return;
        }
        if (!isAdmin && !formData.receipt_image) {
            setError('يرجى اختيار إيصال الدفع (إجباري)');
            return;
        }
        if (!isAdmin && !formData.adExpiryOption) {
            setError('يرجى اختيار مدة الإعلان');
            return;
        }

        setLoading(true);
        setError('');

        try {
            let adExpiryTime = null;
            let price = undefined;
            if (!isAdmin) {
                const selectedOption = EXPIRY_OPTIONS.find(opt => opt.days === formData.adExpiryOption);
                adExpiryTime = Date.now() + (formData.adExpiryOption * 24 * 60 * 60 * 1000);
                price = selectedOption ? selectedOption.price : undefined;
            }
            const adData = {
                userId: userProfile?.uid,
                ads: false,
                reviewStatus: isAdmin ? 'approved' : 'pending',
                adExpiryTime,
                price,
            };

            await onAdd({
                adData,
                imageFile: formData.image,
                receiptFile: isAdmin ? null : formData.receipt_image
            });

            setFormData({ image: null, receipt_image: null, adExpiryOption: '' });
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
            setFormData({ image: null, receipt_image: null, adExpiryOption: '' });
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

                {!isAdmin && (
                    <Box sx={{ mb: 3 }}>
                        <Typography variant="subtitle1" gutterBottom>
                            إيصال الدفع *
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
                )}

                {/* Expiry options only for non-admins */}
                {!isAdmin && (
                    <Box sx={{ mb: 3 }}>
                        <FormControl fullWidth required disabled={loading}>
                            <InputLabel id="ad-expiry-label">مدة الإعلان *</InputLabel>
                            <Select
                                labelId="ad-expiry-label"
                                id="ad-expiry-select"
                                value={formData.adExpiryOption}
                                label="مدة الإعلان *"
                                onChange={handleExpiryChange}
                            >
                                {EXPIRY_OPTIONS.map(opt => (
                                    <MenuItem key={opt.days} value={opt.days}>{opt.label}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>
                )}

                {/* Only show review status info for non-admins */}
                {!isAdmin && (
                    <Typography variant="body2" color="text.secondary">
                        * سيتم مراجعة الإعلان من قبل الإدارة قبل النشر. حالة الإعلان: قيد المراجعة (pending)
                    </Typography>
                )}
            </DialogContent>

            <DialogActions sx={{ p: 2 }}>
                <Button onClick={handleClose} disabled={loading}>
                    إلغاء
                </Button>
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    disabled={loading || !formData.image || (!isAdmin && !formData.receipt_image) || (!isAdmin && !formData.adExpiryOption)}
                    startIcon={loading ? <CircularProgress size={20} /> : null}
                >
                    {loading ? 'جاري الإضافة...' : 'إضافة الإعلان'}
                </Button>
            </DialogActions>
        </Dialog>
    );
} 