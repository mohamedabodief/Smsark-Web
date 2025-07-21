import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button,
    Typography
} from '@mui/material';

function ConfirmDeleteModal({ open, onClose, onConfirm, itemType, itemId, itemName }) {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            aria-labelledby="confirm-dialog-title"
            aria-describedby="confirm-dialog-description"
            maxWidth="xs"
            fullWidth
        >
            <DialogTitle id="confirm-dialog-title" sx={{ textAlign: 'right' }}>
                تأكيد الحذف
            </DialogTitle>
            <DialogContent sx={{ textAlign: 'right' }}>
                <DialogContentText id="confirm-dialog-description">
                    <Typography variant="body1" sx={{ mb: 1 }}>
                        هل أنت متأكد أنك تريد حذف هذا ال{itemType}؟
                    </Typography>
                    {itemName && (
                        <Typography variant="body2" color="text.secondary">
                            ( {itemName} )
                        </Typography>
                    )}
                    {itemId && (
                        <Typography variant="caption" color="text.disabled">
                            المعرف: {itemId}
                        </Typography>
                    )}
                    <Typography variant="body2" color="error" sx={{ mt: 2, fontWeight: 'bold' }}>
                        لا يمكن التراجع عن هذا الإجراء.
                    </Typography>
                </DialogContentText>
            </DialogContent>
            <DialogActions sx={{ justifyContent: 'flex-end', pr: 3, pb: 2 }}>
                <Button onClick={onClose} color="primary" variant="outlined" sx={{ borderRadius: 2 }}>
                    إلغاء
                </Button>
                <Button onClick={onConfirm} color="error" variant="contained" sx={{ borderRadius: 2 }} autoFocus>
                    حذف
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default ConfirmDeleteModal;