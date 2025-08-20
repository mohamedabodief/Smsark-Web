import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Box,
    IconButton,
    Typography,
    Avatar,
    Stack,
    useTheme,
    useMediaQuery
} from '@mui/material';
import {
    Close as CloseIcon,
    ArrowBackIos as ArrowBackIcon,
    ArrowForwardIos as ArrowForwardIcon
} from '@mui/icons-material';

const ImageViewerDialog = ({ open, onClose, images = [], adTitle = '' }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    // Filter out any invalid images
    const validImages = images.filter(img => img && typeof img === 'string' && img.trim() !== '');
    const totalImages = validImages.length;

    // Reset to first image when dialog opens
    React.useEffect(() => {
        if (open) {
            setCurrentImageIndex(0);
        }
    }, [open]);

    // Handle navigation
    const goToPrevious = () => {
        setCurrentImageIndex((prev) => (prev === 0 ? totalImages - 1 : prev - 1));
    };

    const goToNext = () => {
        setCurrentImageIndex((prev) => (prev === totalImages - 1 ? 0 : prev + 1));
    };

    const goToImage = (index) => {
        setCurrentImageIndex(index);
    };

    // Handle keyboard navigation
    React.useEffect(() => {
        const handleKeyPress = (event) => {
            if (!open) return;
            
            if (event.key === 'ArrowLeft') {
                goToNext(); // In RTL, left arrow should go to next
            } else if (event.key === 'ArrowRight') {
                goToPrevious(); // In RTL, right arrow should go to previous
            } else if (event.key === 'Escape') {
                onClose();
            }
        };

        document.addEventListener('keydown', handleKeyPress);
        return () => document.removeEventListener('keydown', handleKeyPress);
    }, [open, onClose]);

    if (!open || totalImages === 0) {
        return null;
    }

    const currentImage = validImages[currentImageIndex];

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"
            fullWidth
            fullScreen={isMobile}
            sx={{
                '& .MuiDialog-paper': {
                    borderRadius: isMobile ? 0 : 2,
                    maxHeight: '90vh',
                }
            }}
        >
            <DialogTitle
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    pb: 1,
                    direction: 'rtl'
                }}
            >
                <Typography variant="h6" component="div" sx={{ flexGrow: 1, textAlign: 'right' }}>
                    {adTitle ? `صور الإعلان: ${adTitle}` : 'صور الإعلان'}
                </Typography>
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{ color: 'grey.500' }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent sx={{ p: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                {/* Image Counter */}
                <Box sx={{ p: 2, textAlign: 'center', direction: 'rtl' }}>
                    <Typography variant="body2" color="text.secondary">
                        صورة {currentImageIndex + 1} من {totalImages}
                    </Typography>
                </Box>

                {/* Main Image Viewer */}
                <Box
                    sx={{
                        position: 'relative',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        minHeight: 400,
                        maxHeight: 500,
                        backgroundColor: 'grey.100',
                        overflow: 'hidden'
                    }}
                >
                    {/* Previous Button */}
                    {totalImages > 1 && (
                        <IconButton
                            onClick={goToPrevious}
                            sx={{
                                position: 'absolute',
                                right: 8, // In RTL, right is previous
                                top: '50%',
                                transform: 'translateY(-50%)',
                                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                                color: 'white',
                                zIndex: 1,
                                '&:hover': {
                                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                                }
                            }}
                        >
                            <ArrowForwardIcon />
                        </IconButton>
                    )}

                    {/* Main Image */}
                    <Box
                        component="img"
                        src={currentImage}
                        alt={`صورة ${currentImageIndex + 1}`}
                        sx={{
                            maxWidth: '100%',
                            maxHeight: '100%',
                            objectFit: 'contain',
                            borderRadius: 1
                        }}
                        onError={(e) => {
                            e.target.src = 'https://placehold.co/400x300/E0E0E0/FFFFFF?text=صورة+غير+متاحة';
                        }}
                    />

                    {/* Next Button */}
                    {totalImages > 1 && (
                        <IconButton
                            onClick={goToNext}
                            sx={{
                                position: 'absolute',
                                left: 8, // In RTL, left is next
                                top: '50%',
                                transform: 'translateY(-50%)',
                                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                                color: 'white',
                                zIndex: 1,
                                '&:hover': {
                                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                                }
                            }}
                        >
                            <ArrowBackIcon />
                        </IconButton>
                    )}
                </Box>

                {/* Thumbnail Strip */}
                {totalImages > 1 && (
                    <Box sx={{ p: 2, direction: 'rtl' }}>
                        <Stack
                            direction="row"
                            spacing={1}
                            sx={{
                                overflowX: 'auto',
                                pb: 1,
                                justifyContent: totalImages <= 6 ? 'center' : 'flex-start'
                            }}
                        >
                            {validImages.map((image, index) => (
                                <Avatar
                                    key={index}
                                    src={image}
                                    variant="rounded"
                                    onClick={() => goToImage(index)}
                                    sx={{
                                        width: 60,
                                        height: 60,
                                        cursor: 'pointer',
                                        border: currentImageIndex === index ? 3 : 1,
                                        borderColor: currentImageIndex === index ? 'primary.main' : 'grey.300',
                                        opacity: currentImageIndex === index ? 1 : 0.7,
                                        transition: 'all 0.2s ease',
                                        flexShrink: 0,
                                        '&:hover': {
                                            opacity: 1,
                                            transform: 'scale(1.05)'
                                        }
                                    }}
                                />
                            ))}
                        </Stack>
                    </Box>
                )}
            </DialogContent>

            <DialogActions sx={{ p: 2, justifyContent: 'center' }}>
                <Button onClick={onClose} variant="contained" color="primary">
                    إغلاق
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ImageViewerDialog;