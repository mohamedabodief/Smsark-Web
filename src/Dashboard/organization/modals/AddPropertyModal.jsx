// src/modals/AddPropertyModal.js
import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Box,
    FormControl,
    InputLabel,
    Select,
    MenuItem
} from '@mui/material';

function AddPropertyModal({ open, onClose, onAdd }) {
    const [formData, setFormData] = useState({
        name: '',
        address: '',
        type: '', // Will be selected from dropdown
        status: '', // Will be selected from dropdown
        price: '',
        details: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = () => {
        // Basic validation
        if (!formData.name || !formData.address || !formData.type || !formData.status || !formData.price) {
            alert('الرجاء تعبئة جميع الحقول المطلوبة (الاسم، العنوان، النوع، الحالة، السعر).');
            return;
        }
        onAdd(formData);
        onClose();
        // Reset form after submission
        setFormData({
            name: '', address: '', type: '', status: '', price: '', details: ''
        });
    };

    const textFieldSx = {
        textAlign: 'right',
        '& label': { right: 0, left: 'unset', transformOrigin: 'right' },
        '& .MuiInputLabel-shrink': { transformOrigin: 'right', transform: 'translate(14px, -9px) scale(0.75)' }
    };

    const selectSx = {
        textAlign: 'right',
        '& .MuiSelect-select': { textAlign: 'right' },
        '& .MuiInputLabel-root': { right: 0, left: 'unset', transformOrigin: 'right' },
        '& .MuiInputLabel-shrink': { transformOrigin: 'right', transform: 'translate(14px, -9px) scale(0.75)' }
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle sx={{ textAlign: 'right' }}>إضافة عقار جديد</DialogTitle>
            <DialogContent>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="اسم العقار"
                        type="text"
                        fullWidth
                        variant="outlined"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        sx={textFieldSx}
                        inputProps={{ dir: 'rtl' }}
                    />
                    <TextField
                        margin="dense"
                        id="address"
                        label="عنوان العقار"
                        type="text"
                        fullWidth
                        variant="outlined"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        required
                        sx={textFieldSx}
                        inputProps={{ dir: 'rtl' }}
                    />

                    <FormControl fullWidth margin="dense" variant="outlined" required sx={selectSx}>
                        <InputLabel id="type-label" sx={textFieldSx['& label']}>نوع العقار</InputLabel>
                        <Select
                            labelId="type-label"
                            id="type"
                            name="type"
                            value={formData.type}
                            onChange={handleChange}
                            label="نوع العقار"
                            sx={{ textAlign: 'right' }}
                        >
                            <MenuItem value=""><em>اختر</em></MenuItem>
                            <MenuItem value="فيلا">فيلا</MenuItem>
                            <MenuItem value="شقة">شقة</MenuItem>
                            <MenuItem value="محل">محل</MenuItem>
                            <MenuItem value="أرض">أرض</MenuItem>
                            <MenuItem value="مكتب">مكتب</MenuItem>
                        </Select>
                    </FormControl>

                    <FormControl fullWidth margin="dense" variant="outlined" required sx={selectSx}>
                        <InputLabel id="status-label" sx={textFieldSx['& label']}>حالة العقار</InputLabel>
                        <Select
                            labelId="status-label"
                            id="status"
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            label="حالة العقار"
                            sx={{ textAlign: 'right' }}
                        >
                            <MenuItem value=""><em>اختر</em></MenuItem>
                            <MenuItem value="للبيع">للبيع</MenuItem>
                            <MenuItem value="للإيجار">للإيجار</MenuItem>
                            <MenuItem value="تمويل">تمويل</MenuItem>
                        </Select>
                    </FormControl>

                    <TextField
                        margin="dense"
                        id="price"
                        label="السعر / الإيجار"
                        type="text" // Can be number or string depending on format needed
                        fullWidth
                        variant="outlined"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        required
                        sx={textFieldSx}
                        inputProps={{ dir: 'rtl' }}
                    />
                    <TextField
                        margin="dense"
                        id="details"
                        label="التفاصيل (اختياري)"
                        type="text"
                        fullWidth
                        variant="outlined"
                        name="details"
                        value={formData.details}
                        onChange={handleChange}
                        multiline
                        rows={3}
                        sx={textFieldSx}
                        inputProps={{ dir: 'rtl' }}
                    />
                </Box>
            </DialogContent>
            <DialogActions sx={{ justifyContent: 'flex-end', pr: 3, pb: 2 }}>
                <Button onClick={onClose} color="error" variant="outlined" sx={{ borderRadius: 2 }}>
                    إلغاء
                </Button>
                <Button onClick={handleSubmit} color="primary" variant="contained" sx={{ borderRadius: 2 }}>
                    إضافة العقار
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default AddPropertyModal;