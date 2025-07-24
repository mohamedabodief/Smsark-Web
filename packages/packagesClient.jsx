import React, { useState } from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Button,
    Radio,
    FormControlLabel,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';

const packages = [
    {
        id: 1,
        name: 'باقة الأساس',
        price: 'مجانا',
        duration: 7,
        features: ['عرض الإعلان لمدة 7 أيام'],
    },
    {
        id: 2,
        name: 'باقة النخبة',
        price: 50,
        duration: 14,
        features: ['عرض الإعلان لمدة 14 يومًا'],
    },
    {
        id: 3,
        name: 'باقة التميز',
        price: 100,
        duration: 21,
        features: ['عرض الإعلان لمدة 21 يومًا'],
    },
];

const AdPackagesClient = ({ selectedPackageId, setSelectedPackageId, onReceiptImageChange }) => {
    const [receiptImages, setReceiptImages] = useState({});
    const theme = useTheme();

    const handleSelectPackage = (pkgId) => {
        if (setSelectedPackageId) setSelectedPackageId(pkgId);
        console.log('📦 تم اختيار الباقة:', pkgId);
    };

    const handleImageUpload = (e, pkgId) => {
        const file = e.target.files[0];
        setReceiptImages((prev) => ({
            ...prev,
            [pkgId]: file,
        }));
        if (onReceiptImageChange) onReceiptImageChange(file); // مرر الصورة للأب
        console.log('📤 تم رفع الريسيت للباقة:', pkgId, file);
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
                            border:
                                selectedPackageId === pkg.id ? '2px solid #1976d2' : '',
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
                                💰 السعر: {pkg.price !== 'مجانا' ? `${pkg.price} ج.م` : pkg.price}
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

                        {pkg.price !== 'مجانا' && (
                            <Box textAlign="center" mb={2}>
                                <Typography variant="subtitle2" gutterBottom>
                                    رفع صورة الريسيت
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
                                {receiptImages[pkg.id] && (
                                    <Typography variant="body2" mt={1}>
                                        ✔️ تم اختيار: <strong>{receiptImages[pkg.id].name}</strong>
                                    </Typography>
                                )}
                            </Box>
                        )}
                    </Card>
                ))}
            </Box>
        </Box>
    );
};

export default AdPackagesClient;
