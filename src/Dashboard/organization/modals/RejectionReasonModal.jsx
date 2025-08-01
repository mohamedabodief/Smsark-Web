import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Box,
    Typography,
    IconButton,
    TextField,
    Alert
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import WarningIcon from '@mui/icons-material/Warning';

export default function RejectionReasonModal({ open, onClose, onConfirm, adTitle }) {
    const [reason, setReason] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = () => {
        if (!reason.trim()) {
            setError('يرجى إدخال سبب الرفض');
            return;
        }
        
        setError('');
        onConfirm(reason.trim());
        handleClose();
    };

    const handleClose = () => {
        setReason('');
        setError('');
        onClose();
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
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <WarningIcon color="error" />
                    <Typography>رفض الإعلان</Typography>
                </Box>
                <IconButton onClick={handleClose}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent>
                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                <Box sx={{ mb: 2 }}>
                    <Typography variant="body1" gutterBottom>
                        إعلان: <strong>{adTitle || 'إعلان الصفحة الرئيسية'}</strong>
                    </Typography>
                </Box>

                <TextField
                    label="سبب الرفض"
                    multiline
                    rows={4}
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    fullWidth
                    variant="outlined"
                    placeholder="اكتب سبب رفض الإعلان هنا..."
                    error={!!error}
                    helperText={error}
                    sx={{ mb: 2 }}
                />

                <Alert severity="info">
                    سيتم إرسال سبب الرفض إلى المؤسسة مع الإعلان المرفوض.
                </Alert>
            </DialogContent>

            <DialogActions sx={{ p: 2 }}>
                <Button onClick={handleClose} color="inherit">
                    إلغاء
                </Button>
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    color="error"
                    disabled={!reason.trim()}
                >
                    رفض الإعلان
                </Button>
            </DialogActions>
        </Dialog>
    );
} 