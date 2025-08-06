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

const AdPackagesClient = ({
    selectedPackageId,
    setSelectedPackageId,
    onReceiptImageChange,
    receiptImage,
    receiptPreviewUrl,
    removeReceiptImage,
}) => {
    const [receiptImages, setReceiptImages] = useState({});
    const [pendingReceiptImage, setPendingReceiptImage] = useState(null);
    const theme = useTheme();

    // Store receipt image when it comes in, regardless of selectedPackageId
    useEffect(() => {
        if (receiptImage && typeof receiptImage === 'string') {
            setPendingReceiptImage(receiptImage);
        }
    }, [receiptImage]);

    // When selectedPackageId becomes available, associate the pending receipt image
    useEffect(() => {
        if (selectedPackageId && pendingReceiptImage) {
            setReceiptImages((prev) => ({
                ...prev,
                [selectedPackageId]: pendingReceiptImage,
            }));
            setPendingReceiptImage(null); // Clear pending image
        }
    }, [selectedPackageId, pendingReceiptImage]);

    const handleSelectPackage = (pkgId) => {
        setSelectedPackageId(pkgId);
        console.log('📦 تم اختيار الباقة:', pkgId);
        
        // If we have a pending receipt image, associate it with the newly selected package
        if (pendingReceiptImage) {
            setReceiptImages((prev) => ({
                ...prev,
                [pkgId]: pendingReceiptImage,
            }));
            setPendingReceiptImage(null);
        }
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

    // Helper function to check if a package has a receipt image
    const hasReceiptImage = (pkgId) => {
        return receiptImages[pkgId] || (receiptPreviewUrl && selectedPackageId === pkgId);
    };

    // Helper function to get receipt image for a package
    const getReceiptImage = (pkgId) => {
        if (receiptImages[pkgId]) {
            return receiptImages[pkgId];
        }
        if (receiptPreviewUrl && selectedPackageId === pkgId) {
            return receiptPreviewUrl;
        }
        return null;
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
                            {hasReceiptImage(pkg.id) ? (
                                <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Typography variant="body2">
                                        ✔️ تم اختيار:{' '}
                                        <strong>
                                            {typeof getReceiptImage(pkg.id) === 'string' && !getReceiptImage(pkg.id).startsWith('blob:')
                                                ? 'صورة الإيصال'
                                                : getReceiptImage(pkg.id)?.name || 'صورة الإيصال'}
                                        </strong>
                                    </Typography>
                                    <IconButton
                                        onClick={() => handleRemoveReceipt(pkg.id)}
                                        sx={{ bgcolor: 'white', '&:hover': { bgcolor: 'grey.200' } }}
                                    >
                                        <DeleteIcon color="error" />
                                    </IconButton>
                                    {typeof getReceiptImage(pkg.id) === 'string' && !getReceiptImage(pkg.id).startsWith('blob:') && (
                                        <img
                                            src={getReceiptImage(pkg.id)}
                                            alt="معاينة الإيصال"
                                            style={{
                                                width: '50px',
                                                height: '50px',
                                                objectFit: 'cover',
                                                borderRadius: '4px',
                                            }}
                                            onError={(e) => {
                                                console.log('Receipt image failed to load:', getReceiptImage(pkg.id));
                                                e.target.src = '/no-image-thumbnail.svg';
                                            }}
                                        />
                                    )}
                                </Box>
                            ) : null}
                        </Box>
                    </Card>
                ))}
            </Box>
        </Box>
    );
};

export default AdPackagesClient;
