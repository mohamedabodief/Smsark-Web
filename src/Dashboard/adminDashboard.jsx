import * as React from 'react';
import { useState, useEffect, useMemo } from 'react';
import { useSelector, useDispatch ,shallowEqual } from 'react-redux';
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
import {
    Typography, Box, Paper, Tabs, Tab, CssBaseline, AppBar, Toolbar, IconButton, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider, Avatar, Button, Collapse, Grid, Dialog, DialogTitle, DialogContent, DialogActions, TextField, ListItemAvatar, Tooltip,
    Snackbar,
    DialogContentText,
    Alert,
    CircularProgress,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Menu,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import DashboardIcon from '@mui/icons-material/Dashboard';
import GroupIcon from '@mui/icons-material/Group';
import HomeIcon from '@mui/icons-material/Home';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import SupervisedUserCircleIcon from '@mui/icons-material/SupervisedUserCircle';
import BarChartIcon from '@mui/icons-material/BarChart';
import DescriptionIcon from '@mui/icons-material/Description';
import LayersIcon from '@mui/icons-material/Layers';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import DeleteIcon from '@mui/icons-material/Delete';
import BroadcastOnPersonalIcon from '@mui/icons-material/BroadcastOnPersonal';
import BroadcastOnHomeIcon from '@mui/icons-material/BroadcastOnHome';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import LogoutIcon from '@mui/icons-material/Logout';
import { logout } from '../LoginAndRegister/featuresLR/authSlice';
import { signOut } from 'firebase/auth';
import { auth } from '../FireBase/firebaseConfig';
// import { addUser, editUser, deleteUser } from '../reduxToolkit/slice/usersSlice';
// import { addOrganization, editOrganization, deleteOrganization } from '../reduxToolkit/slice/organizationsSlice';
// import { addAdmin, editAdmin, deleteAdmin } from '../reduxToolkit/slice/adminsSlice';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import rtlPlugin from 'stylis-plugin-rtl';
import { StyledEngineProvider } from '@mui/material/styles';

import { DataGrid } from '@mui/x-data-grid';
// import { useDemoData } from '@mui/x-data-grid-generator';
import { MOCK_ADVERTISEMENTS } from './mockAds';
import { Chip, Link } from '@mui/material';


import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import BlockIcon from '@mui/icons-material/Block';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';

// Import your async thunks and synchronous actions
import {
    fetchAdvertisements,
    fetchAdvertisementsByReviewStatus,
    fetchAdvertisementsByAdStatus,
    deleteAdvertisement,
    updateAdvertisementStatus,
    approveAdvertisement,
    rejectAdvertisement,
    returnAdvertisementToPending,
    activateAdvertisement,
    deactivateAdvertisement,
    clearAdvertisementsError,
    setFilter,
    clearFilters
} from '../reduxToolkit/slice/ClientAdvertismentSlice';
import AutorenewIcon from '@mui/icons-material/Autorenew';

import {
    setDeveloperAds, setFunderAds,
    setLoadingDeveloper, setLoadingFunder,
    setErrorDeveloper, setErrorFunder,
    deleteAd, toggleAdStatus
} from '../reduxToolkit/slice/paidAdsSlice';
import FinancingAdvertisement from '../FireBase/modelsWithOperations/FinancingAdvertisement';
import RealEstateDeveloperAdvertisement from '../FireBase/modelsWithOperations/RealEstateDeveloperAdvertisement';
import { useNavigate } from 'react-router-dom';

import {
    fetchClients,
    fetchOrganizations,
    fetchAdmins,
    addClient,
    editClient,
    deleteClient,
    addOrganization,
    editOrganization,
    deleteOrganization,
    addAdmin,
    editAdmin,
    deleteAdmin,
} from '../reduxToolkit/slice/adminUsersSlice';

import { fetchUserProfile, updateUserProfile, uploadAndSaveProfileImage } from "../LoginAndRegister/featuresLR/userSlice";
import sendResetPasswordEmail from "../FireBase/authService/sendResetPasswordEmail";
import { collection, getDocs } from "firebase/firestore";
import { fetchFinancialRequests, deleteFinancialRequest, updateFinancialRequest } from '../reduxToolkit/slice/financialRequestSlice';
import { 
    fetchAllHomepageAds, 
    createHomepageAd, 
    updateHomepageAd, 
    deleteHomepageAd,
    approveHomepageAd,
    rejectHomepageAd,
    returnHomepageAdToPending,
    activateHomepageAd,
    deactivateHomepageAd
} from '../feature/ads/homepageAdsSlice';
import AddHomepageAdModal from './adminDashboard/AddHomepageAdModal';
import EditHomepageAdModal from './adminDashboard/EditHomepageAdModal';

// Create RTL cache for Emotion
const cacheRtl = createCache({
    key: 'mui-rtl',
    stylisPlugins: [rtlPlugin],
});

const drawerWidth = 240;
const closedDrawerWidth = 70;

const NAVIGATION = [
    {
        kind: 'header',
        title: 'العناصر الرئيسية',
    },
    // {
    //     segment: 'dashboard',
    //     title: 'لوحة التحكم',
    //     icon: <DashboardIcon />,
    //     tooltip: 'لوحة التحكم',
    // },
    {
        segment: 'profile',
        title: 'الملف الشخصي',
        icon: <AccountBoxIcon />,
        tooltip: 'الملف الشخصي',
    },
    {
        segment: 'users',
        title: 'المستخدمين',
        icon: <GroupIcon />,
        tooltip: 'المستخدمين',
    },
    // {
    //     segment: 'properties',
    //     title: 'العقارات',
    //     icon: <HomeIcon />,
    //     tooltip: 'العقارات',
    // },
    {
        segment: 'mainadvertisment',
        title: 'إعلانات القسم الرئيسى',
        icon: <BroadcastOnHomeIcon />,
        tooltip: 'إعلانات القسم الرئيسى',
    },
    {
        segment: 'paidadvertisment',
        title: 'إعلانات ممولة',
        icon: <BroadcastOnPersonalIcon />,
        tooltip: 'إعلانات ممولة',
    },
    {
        segment: 'clientadvertisment',
        title: 'إعلانات العملاء',
        icon: <SupervisedUserCircleIcon />,
        tooltip: 'إعلانات العملاء',
    },
    {
        segment: 'orders',
        title: 'الطلبات',
        icon: <ShoppingCartIcon />,
        tooltip: 'الطلبات',
    },
    {
        kind: 'divider',
    },
    {
        kind: 'header',
        title: 'التحليلات',

    },
    {
        segment: 'reports',
        title: 'التقارير',
        icon: <BarChartIcon />,
        tooltip: 'التقارير',
        children: [
            {
                segment: 'sales',
                title: 'المبيعات',
                icon: <DescriptionIcon />,
                tooltip: 'المبيعات',
            },
            {
                segment: 'traffic',
                title: 'حركة مرور الزوار',
                icon: <DescriptionIcon />,
                tooltip: 'حركة مرور الزوار',
            },
        ],
    },
    // {
    //     segment: 'integrations',
    //     title: 'إضافات',
    //     icon: <LayersIcon />,
    //     tooltip: 'إضافات',
    // },
];

const ColorModeContext = React.createContext({ toggleColorMode: () => { } });

function AddUserModal({ open, onClose, onAdd }) {
    const [name, setName] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [nameError, setNameError] = React.useState(false);
    const [emailError, setEmailError] = React.useState(false);
    const [emailHelperText, setEmailHelperText] = React.useState('');

    React.useEffect(() => {
        if (open) {
            setName('');
            setEmail('');
            setNameError(false);
            setEmailError(false);
            setEmailHelperText('');
        }
    }, [open]);

    const handleAdd = () => {
        let hasError = false;
        if (!name.trim()) {
            setNameError(true);
            hasError = true;
        } else {
            setNameError(false);
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email.trim()) {
            setEmailError(true);
            setEmailHelperText('البريد الألكتروني مطلوب');
            hasError = true;
        } else if (!emailRegex.test(email)) {
            setEmailError(true);
            setEmailHelperText('صيغة البريد الألكتروني غير صحيحة');
            hasError = true;
        } else {
            setEmailError(false);
            setEmailHelperText('');
        }

        if (!hasError) {
            onAdd({ name, email });
            onClose();
        }
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle sx={{ textAlign: 'left' }}>إضافة عميل</DialogTitle>
            <DialogContent sx={{ textAlign: 'right' }}>
                <TextField
                    autoFocus
                    margin="dense"
                    label="الإسم"
                    type="text"
                    fullWidth
                    variant="outlined"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    error={nameError}
                    helperText={nameError ? 'Name is required' : ''}
                    sx={{ mb: 2 }}
                />
                <TextField
                    margin="dense"
                    label="البريد الألكتروني"
                    type="email"
                    fullWidth
                    variant="outlined"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    error={emailError}
                    helperText={emailHelperText}
                />
            </DialogContent>
            <DialogActions sx={{ flexDirection: 'row-reverse' }}>
                <Button onClick={handleAdd} variant="contained" sx={{ bgcolor: 'purple' }}>
                    إضافة
                </Button>
                <Button onClick={onClose}>إلغاء</Button>
            </DialogActions>
        </Dialog>
    );
}

// function EditUserModal({ open, onClose, onSave, user }) {
//     const [name, setName] = React.useState(user ? user.name : '');
//     const [email, setEmail] = React.useState(user ? user.email : '');
//     const [nameError, setNameError] = React.useState(false);
//     const [emailError, setEmailError] = React.useState(false);
//     const [emailHelperText, setEmailHelperText] = React.useState('');

//     React.useEffect(() => {
//         if (user) {
//             setName(user.name);
//             setEmail(user.email);
//             setNameError(false);
//             setEmailError(false);
//             setEmailHelperText('');
//         }
//     }, [user, open]);

//     const handleSave = () => {
//         let hasError = false;
//         if (!name.trim()) {
//             setNameError(true);
//             hasError = true;
//         } else {
//             setNameError(false);
//         }

//         const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//         if (!email.trim()) {
//             setEmailError(true);
//             setEmailHelperText('البريد الألكتروني مطلوب');
//             hasError = true;
//         } else if (!emailRegex.test(email)) {
//             setEmailError(true);
//             setEmailHelperText('صيغة البريد الألكتروني غير صحيحة');
//             hasError = true;
//         } else {
//             setEmailError(false);
//             setEmailHelperText('');
//         }

//         if (!hasError) {
//             onSave({ ...user, name, email });
//             onClose();
//         }
//     };

//     return (
//         <Dialog open={open} onClose={onClose}>
//             <DialogTitle sx={{ textAlign: 'left' }}>تعديل العميل</DialogTitle>
//             <DialogContent sx={{ textAlign: 'right' }}>
//                 <TextField
//                     autoFocus
//                     margin="dense"
//                     label="الإسم"
//                     type="text"
//                     fullWidth
//                     variant="outlined"
//                     value={name}
//                     onChange={(e) => setName(e.target.value)}
//                     error={nameError}
//                     helperText={nameError ? 'Name is required' : ''}
//                     sx={{ mb: 2 }}
//                 />
//                 <TextField
//                     margin="dense"
//                     label="البريد الألكتروني"
//                     type="email"
//                     fullWidth
//                     variant="outlined"
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                     error={emailError}
//                     helperText={emailHelperText}
//                 />
//             </DialogContent>
//             <DialogActions sx={{ flexDirection: 'row-reverse' }}>
//                 <Button onClick={handleSave} variant="contained" sx={{ bgcolor: 'purple' }}>
//                     حفظ
//                 </Button>
//                 <Button onClick={onClose}>إلغاء</Button>
//             </DialogActions>
//         </Dialog>
//     );
// }

function ConfirmDeleteModal({ open, onClose, onConfirm, itemType, itemId, itemName }) {
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle sx={{ textAlign: 'left' }}>تأكيد الحذف</DialogTitle>
            <DialogContent sx={{ textAlign: 'right' }}>
                <Typography>
                    هل أنت متأكد من حذف {itemType}: <strong>{itemName} (ID: {itemId})</strong>?
                </Typography>
                <Typography color="error">لا يمكن التراجع عن هذه الإجراء.</Typography>
            </DialogContent>
            <DialogActions sx={{ flexDirection: 'row-reverse' }}>
                <Button onClick={onConfirm} variant="contained" color="error">
                    حذف
                </Button>
                <Button onClick={onClose}>إلغاء</Button>
            </DialogActions>
        </Dialog>
    );
}

function AddOrgModal({ open, onClose, onAdd, orgType }) {
    const [name, setName] = React.useState('');
    const [contact, setContact] = useState('');

    useEffect(() => {
        if (open) {
            setName('');
            setContact('');
        }
    }, [open, orgType]); // Reset when modal opens or type changes

    const handleSubmit = () => {
        if (name.trim() === '' || contact.trim() === '') {
            alert('الرجاء تعبئة جميع الحقول المطلوبة.'); // Please fill in all required fields.
            return;
        }
        onAdd({ name, contact }); // 'type' is added in UsersPage's handleAddOrgConfirm
        onClose();
    };

    const getTitle = () => {
        if (orgType === 'developer') {
            return 'إضافة مطور عقاري جديد';
        } else if (orgType === 'funder') {
            return 'إضافة ممول عقاري جديد';
        }
        return 'إضافة مؤسسة جديدة'; // Fallback
    };

    const getAddButtonText = () => {
        if (orgType === 'developer') {
            return 'إضافة مطور';
        } else if (orgType === 'funder') {
            return 'إضافة ممول';
        }
        return 'إضافة'; // Fallback
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle sx={{ textAlign: 'left' }}>{getTitle()}</DialogTitle>
            <DialogContent sx={{ textAlign: 'right' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="الاسم"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                    <TextField
                        margin="dense"
                        id="contact"
                        label="جهة الاتصال"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={contact}
                        onChange={(e) => setContact(e.target.value)}
                        required
                    />
                    {/* Add any conditional fields here based on orgType */}
                </Box>
            </DialogContent>
            <DialogActions sx={{ flexDirection: 'row-reverse', justifyContent: 'flex-end', pr: 3, pb: 2 }}>
                <Button onClick={handleSubmit} variant='contained' sx={{ bgcolor: 'purple' }}>
                    {getAddButtonText()}
                </Button>
                <Button onClick={onClose} >
                    إلغاء
                </Button>
            </DialogActions>
        </Dialog>
    );
}

// function EditOrgModal({ open, onClose, onSave, organization, orgType }) {
//     const [name, setName] = useState('');
//     const [contact, setContact] = useState('');

//     useEffect(() => {
//         if (open && organization) {
//             setName(organization.name || '');
//             setContact(organization.contact || '');
//         }
//     }, [open, organization]); // Repopulate when modal opens or organization changes

//     const handleSave = () => {
//         if (name.trim() === '' || contact.trim() === '') {
//             alert('الرجاء تعبئة جميع الحقول المطلوبة.'); // Please fill in all required fields.
//             return;
//         }
//         const updatedOrg = {
//             ...organization, // Keep existing ID and other properties
//             name,
//             contact,
//             // Ensure the type is preserved from the original organization
//             type: organization.type // Explicitly keep the original type
//         };
//         onSave(updatedOrg);
//         onClose();
//     };

//     const getTitle = () => {
//         if (orgType === 'developer') {
//             return `تعديل المطور العقاري: ${organization?.name}`;
//         } else if (orgType === 'funder') {
//             return `تعديل الممول العقاري: ${organization?.name}`;
//         }
//         return `تعديل المؤسسة: ${organization?.name}`; // Fallback
//     };

//     return (
//         <Dialog open={open} onClose={onClose}>
//             <DialogTitle sx={{ textAlign: 'left' }}>{getTitle()}</DialogTitle>
//             <DialogContent sx={{ textAlign: 'right' }}>
//                 <TextField
//                     autoFocus
//                     margin="dense"
//                     id="name"
//                     label="الاسم"
//                     type="text"
//                     fullWidth
//                     variant="outlined"
//                     value={name}
//                     onChange={(e) => setName(e.target.value)}
//                     required
//                 />
//                 <TextField
//                     margin="dense"
//                     id="contact"
//                     label="جهة الاتصال"
//                     type="text"
//                     fullWidth
//                     variant="outlined"
//                     value={contact}
//                     onChange={(e) => setContact(e.target.value)}
//                     required
//                 />
//                 {/* Add any conditional fields here based on orgType */}
//                 {/* </Box> */}
//             </DialogContent>
//             <DialogActions sx={{ justifyContent: 'flex-end', pr: 3, pb: 2 }}>
//                 <Button onClick={handleSave} variant="contained" sx={{ bgcolor: 'purple' }}>
//                     حفظ التغييرات
//                 </Button>
//                 <Button onClick={onClose} >
//                     إلغاء
//                 </Button>
//             </DialogActions>
//         </Dialog>
//     );
// }

function AddAdminModal({ open, onClose, setSnackbar }) {
    const dispatch = useDispatch();
    const [currentStep, setCurrentStep] = useState(1);
    const [adminData, setAdminData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        adm_name: '',
        phone: '',
        gender: '',
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    // Prevent closing on outside click
    const handleCloseModal = (event, reason) => {
        if (reason && (reason === "backdropClick" || reason === "escapeKeyDown")) {
            return;
        }
        onClose();
    };

    useEffect(() => {
        if (open) {
            setCurrentStep(1);
            setAdminData({
                email: '',
                password: '',
                confirmPassword: '',
                adm_name: '',
                phone: '',
                gender: '',
            });
            setErrors({});
            setIsLoading(false);
        }
    }, [open]);

    const validateStep1 = () => {
        let newErrors = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!adminData.email.trim()) {
            newErrors.email = 'البريد الألكتروني مطلوب';
        } else if (!emailRegex.test(adminData.email)) {
            newErrors.email = 'صيغة البريد الألكتروني غير صحيحة';
        }

        if (!adminData.password.trim()) {
            newErrors.password = 'كلمة المرور مطلوبة';
        } else if (adminData.password.length < 6) {
            newErrors.password = 'كلمة المرور يجب أن تكون 6 أحرف على الأقل';
        }

        if (!adminData.confirmPassword.trim()) {
            newErrors.confirmPassword = 'تأكيد كلمة المرور مطلوب';
        } else if (adminData.password !== adminData.confirmPassword) {
            newErrors.confirmPassword = 'كلمة المرور وتأكيدها غير متطابقين';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validateStep2 = () => {
        let newErrors = {};
        if (!adminData.adm_name.trim()) {
            newErrors.adm_name = 'اسم المدير مطلوب';
        }
        if (!adminData.phone.trim()) {
            newErrors.phone = 'رقم الجوال مطلوب';
        }
        if (!adminData.gender.trim()) {
            newErrors.gender = 'النوع مطلوب';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        if (currentStep === 1) {
            if (validateStep1()) {
                setCurrentStep(2);
            }
        }
    };

    const handleBack = () => {
        setCurrentStep(1);
        setErrors({}); // Clear errors when going back
    };

    const handleFinalAdd = async () => {
        if (validateStep2()) {
            setIsLoading(true);
            try {
                // IMPORTANT: The `addAdmin` thunk in your `adminUsersSlice` MUST be updated
                // to handle Firebase Auth user creation (e.g., using `createUserWithEmailAndPassword`)
                // with `adminData.email` and `adminData.password`.
                // After successful Firebase Auth registration, it should then save the
                // rest of the admin data (adm_name, phone, gender) to Firestore,
                // associating it with the newly created Firebase Auth UID.
                await dispatch(addAdmin({
                    email: adminData.email,
                    password: adminData.password,
                    adm_name: adminData.adm_name,
                    phone: adminData.phone,
                    gender: adminData.gender,
                    // image: adminData.image, // Include if you add image upload to modal
                }));
                setSnackbar({ open: true, message: "تم إضافة المدير بنجاح!", severity: "success" });
                onClose();
            } catch (err) {
                console.error("Error adding admin:", err);
                setSnackbar({ open: true, message: `فشل إضافة المدير: ${err.message || 'خطأ غير معروف'}`, severity: "error" });
            } finally {
                setIsLoading(false);
            }
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setAdminData((prev) => ({ ...prev, [name]: value }));
    };

    return (
        <Dialog open={open} onClose={handleCloseModal} disableEscapeKeyDown disableBackdropClick fullWidth maxWidth="sm">
            <DialogTitle sx={{ textAlign: 'left' }}>إضافة مدير جديد - الخطوة {currentStep} من 2</DialogTitle>
            <DialogContent sx={{ textAlign: 'right' }}>
                {currentStep === 1 && (
                    <Box dir="rtl" sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
                        <TextField
                            autoFocus
                            margin="dense"
                            label="البريد الألكتروني"
                            type="email"
                            fullWidth
                            variant="outlined"
                            name="email"
                            value={adminData.email}
                            onChange={handleChange}
                            error={!!errors.email}
                            helperText={errors.email}
                            disabled={isLoading}
                        />
                        <TextField
                            margin="dense"
                            label="كلمة المرور"
                            type="password"
                            fullWidth
                            variant="outlined"
                            name="password"
                            value={adminData.password}
                            onChange={handleChange}
                            error={!!errors.password}
                            helperText={errors.password}
                            disabled={isLoading}
                        />
                        <TextField
                            margin="dense"
                            label="تأكيد كلمة المرور"
                            type="password"
                            fullWidth
                            variant="outlined"
                            name="confirmPassword"
                            value={adminData.confirmPassword}
                            onChange={handleChange}
                            error={!!errors.confirmPassword}
                            helperText={errors.confirmPassword}
                            disabled={isLoading}
                        />
                    </Box>
                )}

                {currentStep === 2 && (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
                        <TextField
                            autoFocus
                            margin="dense"
                            label="الإسم"
                            type="text"
                            fullWidth
                            variant="outlined"
                            name="adm_name"
                            value={adminData.adm_name}
                            onChange={handleChange}
                            error={!!errors.adm_name}
                            helperText={errors.adm_name}
                            disabled={isLoading}
                        />
                        <TextField
                            margin="dense"
                            label="رقم الجوال"
                            type="tel"
                            fullWidth
                            variant="outlined"
                            name="phone"
                            value={adminData.phone}
                            onChange={handleChange}
                            error={!!errors.phone}
                            helperText={errors.phone}
                            disabled={isLoading}
                            InputProps={{ style: { direction: 'ltr' } }}
                        />
                        <FormControl fullWidth margin="dense" variant="outlined">
                            <InputLabel id="gender-label">النوع</InputLabel>
                            <Select
                                labelId="gender-label"
                                id="gender"
                                name="gender"
                                value={adminData.gender}
                                onChange={handleChange}
                                label="النوع"
                                sx={{ textAlign: 'right' }}
                                error={!!errors.gender}
                                disabled={isLoading}
                            >
                                {genders.map((g) => (
                                    <MenuItem key={g} value={g}>{g}</MenuItem>
                                ))}
                            </Select>
                            {errors.gender && <Typography color="error" variant="caption">{errors.gender}</Typography>}
                        </FormControl>
                    </Box>
                )}
            </DialogContent>
            <DialogActions sx={{ flexDirection: 'row-reverse' }}>
                {currentStep === 1 && (
                    <>
                        <Button onClick={handleNext} variant="contained" sx={{ bgcolor: 'purple' }} disabled={isLoading}>
                            التالي
                        </Button>
                        <Button onClick={onClose} disabled={isLoading}>إلغاء</Button>
                    </>
                )}
                {currentStep === 2 && (
                    <>
                        <Button onClick={handleFinalAdd} variant="contained" sx={{ bgcolor: 'purple' }} disabled={isLoading}>
                            {isLoading ? <CircularProgress size={24} color="inherit" /> : 'إضافة'}
                        </Button>
                        <Button onClick={handleBack} disabled={isLoading}>رجوع</Button>
                        <Button onClick={onClose} disabled={isLoading}>إلغاء</Button>
                    </>
                )}
            </DialogActions>
        </Dialog>
    );
}

function EditAdminModal({ open, onClose, admin, setSnackbar }) { // Added setSnackbar prop
    const dispatch = useDispatch(); // Initialize useDispatch
    const [name, setName] = React.useState(admin?.adm_name || ''); // Use adm_name for admin
    const [phone, setPhone] = React.useState(admin?.phone || ''); // New state for phone
    const [gender, setGender] = React.useState(admin?.gender || ''); // New state for gender

    // Removed states for email, city, governorate, address, userName as per AdminUserData
    // const [email, setEmail] = React.useState(admin?.email || '');
    // const [city, setCity] = React.useState(admin?.city || '');
    // const [governorate, setGovernorate] = React.useState(admin?.governorate || '');
    // const [address, setAddress] = React.useState(admin?.address || '');
    // const [userName, setUserName] = React.useState(admin?.user_name || '');

    const [nameError, setNameError] = React.useState(false);
    // Removed emailError and emailHelperText
    // const [emailError, setEmailError] = React.useState(false);
    // const [emailHelperText, setEmailHelperText] = React.useState('');
    const [isLoading, setIsLoading] = React.useState(false); // New loading state

    React.useEffect(() => {
        if (admin) {
            setName(admin.adm_name || '');
            setPhone(admin.phone || '');
            setGender(admin.gender || '');
            // Removed setting states for email, city, governorate, address, userName
            // setEmail(admin.email || '');
            // setCity(admin.city || '');
            // setGovernorate(admin.governorate || '');
            // setAddress(admin.address || '');
            // setUserName(admin.user_name || '');
            setNameError(false);
            // Removed resetting emailError and emailHelperText
            // setEmailError(false);
            // setEmailHelperText('');
            setIsLoading(false); // Reset loading on admin change/modal open
        }
    }, [admin, open]);

    const handleSave = async () => { // Made async
        let hasError = false;
        if (!name.trim()) {
            setNameError(true);
            hasError = true;
        } else {
            setNameError(false);
        }

        // Removed email validation
        // const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        // if (!email.trim()) {
        //     setEmailError(true);
        //     setEmailHelperText('البريد الألكتروني مطلوب');
        //     hasError = true;
        // } else if (!emailRegex.test(email)) {
        //     setEmailError(true);
        //     setEmailHelperText('صيغة البريد الألكتروني غير صحيحة');
        //     hasError = true;
        // } else {
        //     setEmailError(false);
        //     setEmailHelperText('');
        // }

        // Add validation for phone if needed
        if (!phone.trim()) {
            // You might want a specific error state for phone
            // For now, just mark as error if empty
            hasError = true;
        }
        // No validation for other removed fields

        if (!hasError) {
            setIsLoading(true); // Set loading true
            try {
                // Dispatch the editAdmin thunk with only the fields from AdminUserData
                await dispatch(editAdmin({
                    uid: admin.uid,
                    adm_name: name,
                    phone: phone,
                    gender: gender,
                    // Note: 'email' is typically required for user updates in Firebase Auth.
                    // If your editAdmin thunk or backend requires it, you will need to
                    // either add it back to AdminUserData or handle it differently.
                    // For now, it's excluded as per the provided AdminUserData class.
                })); // Removed .unwrap() here as well
                setSnackbar({ open: true, message: "تم تحديث المدير بنجاح!", severity: "success" });
                onClose(); // Close modal on success
            } catch (err) {
                console.error("Error updating admin:", err);
                setSnackbar({ open: true, message: `فشل تحديث المدير: ${err.message || 'خطأ غير معروف'}`, severity: "error" });
            } finally {
                setIsLoading(false); // Reset loading
            }
        }
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle sx={{ textAlign: 'left' }}>تعديل المدير</DialogTitle>
            <DialogContent sx={{ textAlign: 'right' }}>
                <TextField
                    autoFocus
                    margin="dense"
                    label="الإسم"
                    type="text"
                    fullWidth
                    variant="outlined"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    error={nameError}
                    helperText={nameError ? 'الإسم مطلوب' : ''}
                    sx={{ mb: 2 }}
                    disabled={isLoading} // Disable while loading
                />
                {/* Removed Email field */}
                {/* <TextField
                    margin="dense"
                    label="البريد الألكتروني"
                    type="email"
                    fullWidth
                    variant="outlined"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    error={emailError}
                    helperText={emailHelperText}
                    sx={{ mb: 2 }}
                    disabled={isLoading} // Disable while loading
                /> */}
                <TextField
                    margin="dense"
                    label="رقم الجوال"
                    type="tel"
                    fullWidth
                    variant="outlined"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    sx={{ mb: 2 }}
                    disabled={isLoading}
                    InputProps={{ style: { direction: 'ltr' } }}
                />
                <FormControl fullWidth margin="dense" variant="outlined" sx={{ mb: 2 }}>
                    <InputLabel id="gender-label">النوع</InputLabel>
                    <Select
                        labelId="gender-label"
                        id="gender"
                        name="gender"
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                        label="النوع"
                        sx={{ textAlign: 'right' }}
                        disabled={isLoading}
                    >
                        {genders.map((g) => (
                            <MenuItem key={g} value={g}>{g}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                {/* Removed City, Governorate, Address, User Name fields */}
                {/* <FormControl fullWidth margin="dense" variant="outlined" sx={{ mb: 2 }}>
                    <InputLabel id="governorate-label">المحافظة</InputLabel>
                    <Select
                        labelId="governorate-label"
                        id="governorate"
                        name="governorate"
                        value={governorate}
                        onChange={(e) => setGovernorate(e.target.value)}
                        label="المحافظة"
                        sx={{ textAlign: 'right' }}
                        disabled={isLoading}
                    >
                        {governorates.map((gov) => (
                            <MenuItem key={gov} value={gov}>{gov}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <TextField
                    margin="dense"
                    label="المدينة/القرية"
                    type="text"
                    fullWidth
                    variant="outlined"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    sx={{ mb: 2 }}
                    disabled={isLoading}
                />
                <TextField
                    margin="dense"
                    label="العنوان بالتفصيل"
                    type="text"
                    fullWidth
                    variant="outlined"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    sx={{ mb: 2 }}
                    disabled={isLoading}
                />
                <TextField
                    margin="dense"
                    label="اسم المستخدم (للمدير)"
                    type="text"
                    fullWidth
                    variant="outlined"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    sx={{ mb: 2 }}
                    disabled={isLoading}
                /> */}
            </DialogContent>
            <DialogActions sx={{ flexDirection: 'row-reverse' }}>
                <Button onClick={handleSave} variant="contained" sx={{ bgcolor: 'purple' }} disabled={isLoading}>
                    {isLoading ? <CircularProgress size={24} color="inherit" /> : 'حفظ'} {/* Show loading spinner */}
                </Button>
                <Button onClick={onClose} disabled={isLoading}>إلغاء</Button>
            </DialogActions>
        </Dialog>
    );
}


function DashboardPage() {
    return (
        <Box sx={{ p: 2, textAlign: 'right' }}>
            <Typography variant="h4" display={'flex'} flexDirection={'row-reverse'} gutterBottom>لوحة التحكم</Typography>
            <Grid container spacing={3} direction="row-reverse">
                <Grid item xs={12} sm={6} md={4}>
                    <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 140, borderRadius: 2, textAlign: 'right' }}>
                        <Typography variant="h6" color="text.secondary">Total Sales</Typography>
                        <Typography variant="h5" sx={{ mt: 1, fontWeight: 'bold', color: 'primary.main' }}>$12,345.00</Typography>
                        <Typography variant="body2" color="success.main">+15% since last month</Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 140, borderRadius: 2, textAlign: 'right' }}>
                        <Typography variant="h6" color="text.secondary">New Orders</Typography>
                        <Typography variant="h5" sx={{ mt: 1, fontWeight: 'bold', color: 'secondary.main' }}>245</Typography>
                        <Typography variant="body2" color="error.main">-5% since last month</Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 140, borderRadius: 2, textAlign: 'right' }}>
                        <Typography variant="h6" color="text.secondary">Customers</Typography>
                        <Typography variant="h5" sx={{ mt: 1, fontWeight: 'bold' }}>1,234</Typography>
                        <Typography variant="body2" color="success.main">+2% since last month</Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12}>
                    <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', borderRadius: 2, height: 300, textAlign: 'right' }}>
                        <Typography variant="h6">Sales Trend (Placeholder)</Typography>
                        <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Typography variant="body1" color="text.secondary">Chart would go here</Typography>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
}


// change pic func 
// const UploadAvatars = () => {
//     const [avatarSrc, setAvatarSrc] = React.useState(undefined); // State is now here

//     const handleAvatarChange = (event) => {
//         const file = event.target.files?.[0];
//         if (file) {
//             const reader = new FileReader();
//             reader.onload = () => {
//                 setAvatarSrc(reader.result);
//             };
//             reader.readAsDataURL(file);
//         }
//     }

//     return (
//         <Box sx={{ display: 'flex', flexDirection: 'row-reverse', position: 'relative' }}>
//             <ButtonBase
//                 component="label"
//                 role={undefined}
//                 tabIndex={-1}
//                 aria-label="Avatar image"
//                 sx={{
//                     borderRadius: '40px',
//                     '&:has(:focus-visible)': {
//                         outline: '2px solid',
//                         outlineOffset: '2px',
//                     },
//                 }}
//             >
//                 <Avatar alt="Upload new avatar" src={avatarSrc || './admin.jpg'} sx={{ width: 100, height: 100, mb: 1, boxShadow: '0px 0px 8px rgba(0,0,0,0.2)' }} />
//             </ButtonBase>
//             <div style={{ position: 'absolute', bottom: -15, right: 5 }}>
//                 <Tooltip title="تغيير الصورة">
//                     <Button
//                         variant="contained"
//                         color="primary"
//                         component="label"
//                         style={{ backgroundColor: '#6E00FE', color: 'white', border: 'none', cursor: 'pointer' }}
//                     >
//                         <input
//                     type="file"
//                     accept="image/*"
//                     style={{
//                         border: 0,
//                         clip: 'rect(0 0 0 0)',
//                         height: '1px',
//                         margin: '-1px',
//                         overflow: 'hidden',
//                         padding: 0,
//                         position: 'absolute',
//                         whiteSpace: 'nowrap',
//                         width: '1px',
//                     }}
//                     onChange={handleAvatarChange}
//                 />
//                 تغيير الصورة
//                 </Button>
//                 </Tooltip>
//             </div>
//         </Box>
//     );
// };

const genders = ["ذكر", "أنثى", "غير محدد"];
function ProfilePage() {
    const dispatch = useDispatch();

    // Select the UID from the auth slice
    const authUid = useSelector((state) => state.auth.uid);
    const authStatus = useSelector((state) => state.auth.status);

    // Select the full profile data from the user slice
    const userProfile = useSelector((state) => state.user.profile);
    const userProfileStatus = useSelector((state) => state.user.status);
    const userProfileError = useSelector((state) => state.user.error);

    // Select profile picture URL from profilePicSlice
    const currentProfilePic = useSelector((state) => state.profilePic.profilePicUrl);

    // Local state for form inputs, initialized from Redux userProfile
    const [formData, setFormData] = useState({});
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState("success");
    const [resetPasswordLoading, setResetPasswordLoading] = useState(false);

    // Determine the actual UID to use, prioritizing the string if passed as object
    const actualUid = typeof authUid === 'object' && authUid !== null
        ? authUid.uid
        : authUid;

    // Effect to fetch user profile when component mounts or UID changes
    useEffect(() => {
        const loadProfile = async () => {
            console.log("AdminProfilePage useEffect (start): actualUid =", actualUid, "Type =", typeof actualUid);

            if (typeof actualUid !== 'string' || actualUid.trim() === '') {
                console.warn("AdminProfilePage: Skipping fetchUserProfile due to invalid or empty actualUid:", actualUid);
                return;
            }

            // Only proceed if userProfile is not already loaded and status is idle
            if (userProfileStatus === "idle" && !userProfile) {
                try {
                    console.log("AdminProfilePage: Dispatching fetchUserProfile for UID:", actualUid);
                    await dispatch(fetchUserProfile(actualUid)).unwrap();
                    console.log("AdminProfilePage: fetchUserProfile fulfilled successfully.");
                } catch (error) {
                    console.error("AdminProfilePage: fetchUserProfile rejected with error:", error);
                }
            } else {
                console.log("AdminProfilePage: fetchUserProfile not dispatched (already loaded or not idle). Conditions:", {
                    actualUid: actualUid,
                    userProfileStatus: userProfileStatus,
                    userProfileExists: !!userProfile
                });
            }
        };
        loadProfile();
    }, [actualUid, userProfileStatus, userProfile, dispatch]);

    // Effect to update local form data when Redux userProfile changes
  const initialized = React.useRef(false);

useEffect(() => {
  if (userProfile && !initialized.current) {
    setFormData({
      ...userProfile,
      email: auth.currentUser?.email || userProfile.email || "",
    });
    initialized.current = true;
  } else if (!userProfile) {
    setFormData({});
    initialized.current = false;
  }
}, [userProfile]);


    // Handle changes to form fields
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    // Handle saving changes
    const handleSave = async () => {
        // Basic validation for admin fields
        if (!formData.adm_name || !formData.phone || !formData.gender) {
            setSnackbarMessage("الرجاء ملء جميع الحقول المطلوبة.");
            setSnackbarSeverity("error");
            setSnackbarOpen(true);
            return;
        }

        // Prepare updates object with admin-specific fields
        const updates = {
            adm_name: formData.adm_name,
            phone: formData.phone,
            gender: formData.gender,
            image: formData.image || null, // Allow image to be updated
            // email is typically not updated via profile page, but included if needed
            // email: formData.email,
        };

        try {
            console.log("AdminProfilePage: Dispatching updateUserProfile for UID:", actualUid, "Updates:", updates);
            await dispatch(updateUserProfile({ uid: actualUid, updates })).unwrap();
            setSnackbarMessage("تم حفظ التغييرات بنجاح!");
            setSnackbarSeverity("success");
            setSnackbarOpen(true);
            console.log("AdminProfilePage: updateUserProfile fulfilled successfully.");
        } catch (error) {
            console.error("AdminProfilePage: updateUserProfile rejected with error:", error);
            setSnackbarMessage(error || "حدث خطأ أثناء حفظ التغييرات.");
            setSnackbarSeverity("error");
            setSnackbarOpen(true);
        }
    };

    // UploadAvatars sub-component (remains the same as it's generic)
    const UploadAvatars = () => {
        const [uploading, setUploading] = useState(false);

        const handleImageChange = async (event) => {
            const file = event.target.files[0];
            if (file) {
                setUploading(true);
                try {
                    // Use the new thunk to upload and save profile image
                    await dispatch(uploadAndSaveProfileImage({ uid: actualUid, file })).unwrap();
                    setSnackbarMessage("تم تحديث صورة الملف الشخصي بنجاح!");
                    setSnackbarSeverity("success");
                    setSnackbarOpen(true);
                } catch (error) {
                    setSnackbarMessage("فشل رفع الصورة: " + (error.message || "خطأ غير معروف"));
                    setSnackbarSeverity("error");
                    setSnackbarOpen(true);
                } finally {
                    setUploading(false);
                }
            }
        };

        const handleRemoveImage = async () => {
            try {
                await dispatch(updateUserProfile({ uid: actualUid, updates: { image: null } })).unwrap();
                setSnackbarMessage("تمت إزالة صورة الملف الشخصي.");
                setSnackbarSeverity("success");
                setSnackbarOpen(true);
            } catch (error) {
                setSnackbarMessage("فشل إزالة الصورة: " + (error.message || "خطأ غير معروف"));
                setSnackbarSeverity("error");
                setSnackbarOpen(true);
            }
        };

        return (
            <Box sx={{ p: 2, borderRadius: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                <Avatar
                    src={userProfile?.image || './admin.jpg'}
                    sx={{ width: 120, height: 120, mb: 3, boxShadow: '0px 4px 10px rgba(0,0,0,0.1)' }}
                />
                <input
                    accept="image/*"
                    style={{ display: 'none' }}
                    id="profile-pic-upload"
                    type="file"
                    onChange={handleImageChange}
                    disabled={uploading}
                />
                <label htmlFor="profile-pic-upload">
                    <Button variant="contained" component="span" sx={{ mb: 1, mr: 1 }} disabled={uploading}>
                        {uploading ? <CircularProgress size={24} color="inherit" /> : "تغيير الصورة"}
                    </Button>
                </label>
                <Button
                    variant="outlined"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={handleRemoveImage}
                    disabled={uploading}
                >
                    إزالة الصورة
                </Button>
            </Box>
        );
    };

    // Handle reset password
    const handleResetPassword = async () => {
        const email = auth.currentUser?.email;
        if (!email) {
            setSnackbarMessage("لا يمكن العثور على البريد الإلكتروني.");
            setSnackbarSeverity("error");
            setSnackbarOpen(true);
            return;
        }

        setResetPasswordLoading(true);
        try {
            const result = await sendResetPasswordEmail(email);
            if (result.success) {
                setSnackbarMessage(result.message);
                setSnackbarSeverity("success");
            } else {
                setSnackbarMessage("فشل إرسال رابط إعادة التعيين: " + result.error);
                setSnackbarSeverity("error");
            }
            setSnackbarOpen(true);
        } catch (error) {
            setSnackbarMessage("حدث خطأ أثناء إرسال رابط إعادة التعيين.");
            setSnackbarSeverity("error");
            setSnackbarOpen(true);
        } finally {
            setResetPasswordLoading(false);
        }
    };

    // Loading and Error states
    if (authStatus === "loading" || userProfileStatus === "loading") {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
                <Typography sx={{ ml: 2 }}>Loading profile...</Typography>
            </Box>
        );
    }

    if (!actualUid) {
        return (
            <Box sx={{ p: 3 }}>
                <Alert severity="warning">من فضلك قم بتسجيل الدخول للوصول لهذه الصفحة</Alert>
            </Box>
        );
    }

    // Display error if fetchUserProfile was rejected
    if (userProfileStatus === "failed") {
        return (
            <Box sx={{ p: 3 }}>
                <Alert severity="error">Error loading profile: {userProfileError || "Unknown error."}</Alert>
            </Box>
        );
    }

    // If status is succeeded but profile is null, it means it was rejected with no specific error, or cleared.
    // This is the condition that leads to "Profile data not found."
    if (!userProfile) {
        return (
            <Box sx={{ p: 3 }}>
                <Alert severity="warning">بيالم يتم العثور على بيانات ملفك الشخصي. يُرجى التأكد من اكتمال ملفك الشخصي.</Alert>
            </Box>
        );
    }

    // Ensure userProfile.type_of_user is 'admin' before rendering admin fields
    if (userProfile.type_of_user !== "admin") {
        return (
            <Box sx={{ p: 3 }}>
                <Alert severity="error">Access Denied: This profile page is for administrators only.</Alert>
            </Box>
        );
    }

    return (
        <Box sx={{ p: 2, textAlign: 'right' }}>
            <Typography variant="h3" sx={{ display: 'flex', flexDirection: 'row-reverse', mb: 3 }}>حسابي</Typography>
            <Paper sx={{ p: 4, borderRadius: 2, minHeight: 400, textAlign: 'right', boxShadow: '0px 0px 8px rgba(0,0,0,0.2)' }}>
                <Grid container spacing={4} direction="row-reverse">
                    <Grid item xs={12} md={4} lg={3}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                            <UploadAvatars />
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={8} lg={9}>
                        <Box>
                            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', fontSize: '1.5rem', display: 'flex', flexDirection: 'row-reverse' }}>المعلومات الشخصية</Typography>

                            {/* Admin Name */}
                            <TextField
                                label="اسم المدير"
                                fullWidth
                                margin="normal"
                                name="adm_name"
                                value={formData.adm_name || ""}
                                onChange={handleChange}
                                InputProps={{ style: { direction: 'rtl' } }}
                            />

                            {/* Phone Number */}
                            <TextField
                                label="رقم الجوال"
                                fullWidth
                                margin="normal"
                                name="phone"
                                value={formData.phone || ""}
                                onChange={handleChange}
                                type="tel"
                                InputProps={{ style: { direction: 'ltr' } }}
                            />
                            {/* Email (usually not editable) */}
                            <TextField
                                label="البريد الإلكتروني"
                                fullWidth
                                margin="normal"
                                name="email"
                                value={formData.email || ""}
                                onChange={handleChange}
                                type="email"
                                InputProps={{ style: { direction: 'ltr' } }}
                                disabled
                            />
                            {/* Password field with reset button */}
                            <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-end' }}>
                                <TextField
                                    label="كلمة المرور"
                                    fullWidth
                                    margin="normal"
                                    type="password"
                                    placeholder="******"
                                    InputProps={{ style: { direction: 'ltr' } }}
                                    disabled
                                    sx={{ flexGrow: 1 }}
                                />
                                <Button
                                    variant="outlined"
                                    color="primary"
                                    onClick={handleResetPassword}
                                    disabled={resetPasswordLoading}
                                    sx={{ mb: 1, minWidth: 120 }}
                                >
                                    {resetPasswordLoading ? (
                                        <CircularProgress size={20} color="inherit" />
                                    ) : (
                                        "إعادة تعيين"
                                    )}
                                </Button>
                            </Box>

                            {/* Gender for Admin */}
                            <FormControl fullWidth margin="normal" variant="outlined">
                                <InputLabel id="gender-label">النوع</InputLabel>
                                <Select
                                    labelId="gender-label"
                                    id="gender"
                                    name="gender"
                                    value={formData.gender || ""}
                                    onChange={handleChange}
                                    label="النوع"
                                    sx={{ textAlign: 'right' }}
                                >
                                    {genders.map((g) => (
                                        <MenuItem key={g} value={g}>{g}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            {/* Admin-specific fields like user_name if applicable, or remove */}
                            {/* <TextField
                label="اسم المستخدم (للمدير)"
                fullWidth
                margin="normal"
                name="user_name"
                value={formData.user_name || ""}
                onChange={handleChange}
                InputProps={{ style: { direction: 'rtl' } }}
              /> */}

                            <Button variant="contained" color="primary" onClick={handleSave} sx={{ marginTop: 2, fontSize: '1.2rem' }}>
                                حفظ التغييرات
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
            </Paper>

            {/* Snackbar for messages */}
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={() => setSnackbarOpen(false)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity} sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
}

function UsersPage() {
    const dispatch = useDispatch();

    // Select data and status from the new adminUsersSlice
    const clients = useSelector((state) => state.adminUsers.clients);
    const clientsStatus = useSelector((state) => state.adminUsers.clientsStatus);
    const clientsError = useSelector((state) => state.adminUsers.clientsError);

    const organizations = useSelector((state) => state.adminUsers.organizations);
    const organizationsStatus = useSelector((state) => state.adminUsers.organizationsStatus);
    const organizationsError = useSelector((state) => state.adminUsers.organizationsError);

    const admins = useSelector((state) => state.adminUsers.admins);
    const adminsStatus = useSelector((state) => state.adminUsers.adminsStatus);
    const adminsError = useSelector((state) => state.adminUsers.adminsError);

    const [activeTab, setActiveTab] = useState('users');
    const [activeOrgSubTab, setActiveOrgSubTab] = useState('developers');

    const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
    const [isEditUserModalOpen, setIsEditUserModalOpen] = useState(false);
    const [userToEdit, setUserToEdit] = useState(null);

    const [isDeleteConfirmModalOpen, setIsDeleteConfirmModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);

    const [isAddOrgModalOpen, setIsAddOrgModalOpen] = useState(false);
    const [isEditOrgModalOpen, setIsEditOrgModalOpen] = useState(false);
    const [orgToEdit, setOrgToEdit] = useState(null);

    const [isAddAdminModalOpen, setIsAddAdminModalOpen] = useState(false);
    const [isEditAdminModalOpen, setIsEditAdminModalOpen] = useState(false);
    const [adminToEdit, setAdminToEdit] = useState(null);

    // Snackbar state for UsersPage itself
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    // --- Fetch Data on Mount and Tab Change ---
    useEffect(() => {
        // Only fetch if status is 'idle' or 'failed' to prevent continuous fetching
        if (activeTab === 'users' && (clientsStatus === 'idle' || clientsStatus === 'failed')) {
            dispatch(fetchClients());
        } else if (activeTab === 'organizations' && (organizationsStatus === 'idle' || organizationsStatus === 'failed')) {
            dispatch(fetchOrganizations());
        } else if (activeTab === 'admins' && (adminsStatus === 'idle' || adminsStatus === 'failed')) {
            dispatch(fetchAdmins());
        }
    }, [activeTab, clientsStatus, organizationsStatus, adminsStatus, dispatch]);

    // --- User Handlers (now dispatching actions from adminUsersSlice) ---
    const handleAddUser = () => {
        setIsAddUserModalOpen(true);
    };

    const handleAddUserConfirm = async ({ name, email, phone, gender }) => {
        // For clients, we need a UID (Firebase Auth UID). This usually happens during registration.
        // For simplicity in this admin panel, we'll use a placeholder UID for new *manual* additions.
        // In a real app, adding a user here would likely involve creating a Firebase Auth user first.
        // The addClient thunk should handle generating a UID if not provided, or you can generate it here.
        // For now, let's assume addClient handles the UID generation or it's not strictly required for manual adds.
        try {
            await dispatch(addClient({ cli_name: name, email, phone, gender, type_of_user: 'client' })).unwrap();
            setSnackbar({ open: true, message: "تم إضافة العميل بنجاح!", severity: "success" });
        } catch (err) {
            console.error("Error adding client:", err);
            setSnackbar({ open: true, message: `فشل إضافة العميل: ${err.message || 'خطأ غير معروف'}`, severity: "error" });
        } finally {
            setIsAddUserModalOpen(false);
        }
    };

    // const handleEditUser = (user) => {
    //     setUserToEdit(user);
    //     setIsEditUserModalOpen(true);
    // };

    // const handleEditUserSave = async (updatedUser) => {
    //     try {
    //         await dispatch(editClient(updatedUser)).unwrap(); // Assuming updatedUser contains uid
    //         setSnackbar({ open: true, message: "تم تحديث العميل بنجاح!", severity: "success" });
    //     } catch (err) {
    //         console.error("Error updating client:", err);
    //         setSnackbar({ open: true, message: `فشل تحديث العميل: ${err.message || 'خطأ غير معروف'}`, severity: "error" });
    //     } finally {
    //         setIsEditUserModalOpen(false);
    //     }
    // };

    // --- Organization (Developers and Funders) Handlers ---
    const handleAddOrg = () => {
        setIsAddOrgModalOpen(true);
    };

    const handleAddOrgConfirm = async ({ name, contact }) => { // Removed type, phone, city, governorate, address, email from here
        const orgType = activeOrgSubTab === 'developers' ? 'مطور عقاري' : 'ممول عقاري'; // Map to your OrganizationUserData types
        try {
            await dispatch(addOrganization({
                org_name: name,
                contact_info: contact, // Assuming 'contact' maps to 'contact_info' in your model
                type_of_organization: orgType,
                type_of_user: 'organization'
                // You might need to add other fields like phone, city, etc., if your AddOrgModal supports them
            })).unwrap();
            setSnackbar({ open: true, message: `تم إضافة ${orgType} بنجاح!`, severity: "success" });
        } catch (err) {
            console.error("Error adding organization:", err);
            setSnackbar({ open: true, message: `فشل إضافة ${orgType}: ${err.message || 'خطأ غير معروف'}`, severity: "error" });
        } finally {
            setIsAddOrgModalOpen(false);
        }
    };

    // const handleEditOrg = (org) => {
    //     setOrgToEdit(org);
    //     setIsEditOrgModalOpen(true);
    // };

    // const handleEditOrgSave = async (updatedOrg) => {
    //     try {
    //         await dispatch(editOrganization(updatedOrg)).unwrap(); // Assuming updatedOrg contains uid
    //         setSnackbar({ open: true, message: "تم تحديث المؤسسة بنجاح!", severity: "success" });
    //     } catch (err) {
    //         console.error("Error updating organization:", err);
    //         setSnackbar({ open: true, message: `فشل تحديث المؤسسة: ${err.message || 'خطأ غير معروف'}`, severity: "error" });
    //     } finally {
    //         setIsEditOrgModalOpen(false);
    //     }
    // };

    // Filter organizations for developers and funders based on the 'type_of_organization' property
    const realEstateDevelopers = organizations.filter(org => org.type_of_organization === 'مطور عقاري');
    const realEstateFunders = organizations.filter(org => org.type_of_organization === 'ممول عقاري');

    // --- Admin Handlers ---
    const handleAddAdmin = () => {
        setIsAddAdminModalOpen(true);
    };

    // handleAddAdminConfirm is no longer needed here as AddAdminModal dispatches directly
    // const handleAddAdminConfirm = ({ name, email, phone, gender }) => {
    //     const newUid = `manual_admin_${Date.now()}`;
    //     dispatch(addAdmin({ uid: newUid, adm_name: name, email, phone, gender, type_of_user: 'admin' }));
    //     setIsAddAdminModalOpen(false);
    // };

    const handleEditAdmin = (admin) => {
        setAdminToEdit(admin);
        setIsEditAdminModalOpen(true);
    };

    // handleEditAdminSave is no longer needed here as EditAdminModal dispatches directly
    // const handleEditAdminSave = (updatedAdmin) => {
    //     dispatch(editAdmin(updatedAdmin)); // Assuming updatedAdmin contains uid
    //     setIsEditAdminModalOpen(false);
    // };

    // --- General Delete Handler ---
    const handleDeleteItem = (uid, type, name) => {
        setItemToDelete({ uid, type, name }); // Store uid, not id
        setIsDeleteConfirmModalOpen(true);
    };

    const handleDeleteConfirm = async () => {
        try {
            if (itemToDelete.type === 'user') {
                await dispatch(deleteClient(itemToDelete.uid)).unwrap(); // Use uid for deletion
                setSnackbar({ open: true, message: "تم حذف العميل بنجاح!", severity: "success" });
            } else if (itemToDelete.type === 'organization') {
                await dispatch(deleteOrganization(itemToDelete.uid)).unwrap(); // Use uid for deletion
                setSnackbar({ open: true, message: "تم حذف المؤسسة بنجاح!", severity: "success" });
            } else if (itemToDelete.type === 'admin') {
                await dispatch(deleteAdmin(itemToDelete.uid)).unwrap(); // Use uid for deletion
                setSnackbar({ open: true, message: "تم حذف المدير بنجاح!", severity: "success" });
            }
        } catch (err) {
            console.error("Error deleting item:", err);
            setSnackbar({ open: true, message: `فشل الحذف: ${err.message || 'خطأ غير معروف'}`, severity: "error" });
        } finally {
            setIsDeleteConfirmModalOpen(false);
            setItemToDelete(null);
        }
    };

    // Handle Snackbar close
    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbar({ ...snackbar, open: false });
    };


    // Helper to render lists based on status
    const renderListContent = (data, status, error, type) => {
        if (status === 'loading') {
            return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
        }
        if (status === 'failed') {
            return <Alert severity="error" sx={{ mt: 2 }}>Error: {error}</Alert>;
        }
        if (!data || data.length === 0) {
            return <Typography sx={{ mt: 2, textAlign: 'center', color: 'text.secondary' }}>لا توجد بيانات لعرضها.</Typography>;
        }

        return (
            <List>
                {data.map((item) => (
                    <ListItem
                        key={item.uid} // Use uid as key
                        disablePadding
                        secondaryAction={
                            <Box sx={{ display: 'flex', gap: 1, flexDirection: 'row-reverse' }}>
                                <IconButton edge="start" aria-label="edit" onClick={() => {
                                    if (type === 'user') handleEditUser(item);
                                    else if (type === 'organization') handleEditOrg(item);
                                    else if (type === 'admin') handleEditAdmin(item);
                                }}>
                                    <EditIcon sx={{ color: 'purple' }} />
                                </IconButton>
                                <IconButton edge="start" aria-label="delete" onClick={() => handleDeleteItem(item.uid, type, item.cli_name || item.org_name || item.adm_name)}>
                                    <DeleteIcon sx={{ color: 'red' }} />
                                </IconButton>
                            </Box>
                        }
                    >
                        <ListItemText
                            primary={item.cli_name || item.org_name || item.adm_name} // Display appropriate name
                            secondary={`UID: ${item.uid} | ${item.email ? `Email: ${item.email} | ` : ''}Phone: ${item.phone || 'N/A'}`}
                        />
                    </ListItem>
                ))}
            </List>
        );
    };

    return (
        <Box sx={{ p: 2, textAlign: 'right' }}>
            <Typography variant="h4" display={'flex'} flexDirection={'row-reverse'} gutterBottom>المستخدمين</Typography>
            <Box sx={{ mb: 2, display: 'flex', gap: 1, flexDirection: 'row-reverse' }}>
                <Button
                    variant={activeTab === 'users' ? 'contained' : 'outlined'}
                    onClick={() => setActiveTab('users')}
                    sx={{ borderRadius: 2, fontSize: '17px' }}
                >
                    العملاء
                </Button>
                <Button
                    variant={activeTab === 'organizations' ? 'contained' : 'outlined'}
                    onClick={() => {
                        setActiveTab('organizations');
                        setActiveOrgSubTab('developers');
                    }}
                    sx={{ borderRadius: 2, fontSize: '17px' }}
                >
                    المؤسسات
                </Button>
                <Button
                    variant={activeTab === 'admins' ? 'contained' : 'outlined'}
                    onClick={() => setActiveTab('admins')}
                    sx={{ borderRadius: 2, fontSize: '17px' }}
                >
                    المدراء
                </Button>
            </Box>

            <Paper sx={{ p: 2, borderRadius: 2, minHeight: 400, textAlign: 'right' }}>
                {activeTab === 'users' && (
                    <>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexDirection: 'row-reverse' }}>
                            <Typography variant="h6" sx={{ fontWeight: 'bold' }} color="text.secondary">قائمة العملاء</Typography>
                            <Button variant="outlined" startIcon={<AddIcon />} onClick={handleAddUser}>
                                إضافة عميل
                            </Button>
                        </Box>
                        {renderListContent(clients, clientsStatus, clientsError, 'user')}
                    </>
                )}

                {activeTab === 'organizations' && (
                    <>
                        {/* Sub-tabs for Organizations */}
                        <Box sx={{ mb: 2, display: 'flex', gap: 1, flexDirection: 'row-reverse' }}>
                            <Button
                                variant={activeOrgSubTab === 'developers' ? 'contained' : 'outlined'}
                                onClick={() => setActiveOrgSubTab('developers')}
                                sx={{ borderRadius: 2, fontSize: '17px' }}
                            >
                                مطورين عقاريين
                            </Button>
                            <Button
                                variant={activeOrgSubTab === 'funders' ? 'contained' : 'outlined'}
                                onClick={() => setActiveOrgSubTab('funders')}
                                sx={{ borderRadius: 2, fontSize: '17px' }}
                            >
                                ممولين عقاريين
                            </Button>
                        </Box>

                        {activeOrgSubTab === 'developers' && (
                            <>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexDirection: 'row-reverse' }}>
                                    <Typography variant="h6" color="text.secondary">قائمة المطورين العقاريين</Typography>
                                    <Button variant="outlined" startIcon={<AddIcon />} onClick={handleAddOrg}>
                                        إضافة مطور عقاري
                                    </Button>
                                </Box>
                                {renderListContent(realEstateDevelopers, organizationsStatus, organizationsError, 'organization')}
                            </>
                        )}

                        {activeOrgSubTab === 'funders' && (
                            <Box sx={{ mt: 2 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexDirection: 'row-reverse' }}>
                                    <Typography variant="h6" color="text.secondary">قائمة الممولين العقاريين</Typography>
                                    <Button variant="outlined" startIcon={<AddIcon />} onClick={handleAddOrg}>
                                        إضافة ممول عقاري
                                    </Button>
                                </Box>
                                {renderListContent(realEstateFunders, organizationsStatus, organizationsError, 'organization')}
                            </Box>
                        )}
                    </>
                )}

                {activeTab === 'admins' && (
                    <>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexDirection: 'row-reverse' }}>
                            <Typography variant="h6" color="text.secondary">قائمة المدراء</Typography>
                            <Button variant="outlined" startIcon={<AddIcon />} onClick={handleAddAdmin}>
                                إضافة مدير
                            </Button>
                        </Box>
                        {renderListContent(admins, adminsStatus, adminsError, 'admin')}
                    </>
                )}
            </Paper>

            {/* Modals (ensure these components are correctly imported and defined) */}
            <AddUserModal
                open={isAddUserModalOpen}
                onClose={() => setIsAddUserModalOpen(false)}
                onAdd={handleAddUserConfirm}
            />
            {/* {userToEdit && (
                <EditUserModal
                    open={isEditUserModalOpen}
                    onClose={() => setIsEditUserModalOpen(false)}
                    onSave={handleEditUserSave}
                    user={userToEdit}
                />
            )} */}
            <ConfirmDeleteModal
                open={isDeleteConfirmModalOpen}
                onClose={() => setIsDeleteConfirmModalOpen(false)}
                onConfirm={handleDeleteConfirm}
                itemType={itemToDelete?.type}
                itemId={itemToDelete?.uid} // Use uid for modal
                itemName={itemToDelete?.name}
            />
            <AddOrgModal
                open={isAddOrgModalOpen}
                onClose={() => setIsAddOrgModalOpen(false)}
                onAdd={(data) => handleAddOrgConfirm({ ...data, type: activeOrgSubTab === 'developers' ? 'developer' : 'funder' })}
                orgType={activeOrgSubTab === 'developers' ? 'developer' : 'funder'}
            />
            {/* {orgToEdit && (
                <EditOrgModal
                    open={isEditOrgModalOpen}
                    onClose={() => setIsEditOrgModalOpen(false)}
                    onSave={handleEditOrgSave}
                    organization={orgToEdit}
                    orgType={orgToEdit.type_of_organization === 'مطور عقاري' ? 'developer' : 'funder'} // Pass correct type
                />
            )} */}
            <AddAdminModal
                open={isAddAdminModalOpen}
                onClose={() => setIsAddAdminModalOpen(false)}
                setSnackbar={setSnackbar} // Pass setSnackbar to AddAdminModal
            />
            {adminToEdit && (
                <EditAdminModal
                    open={isEditAdminModalOpen}
                    onClose={() => setIsEditAdminModalOpen(false)}
                    admin={adminToEdit}
                    setSnackbar={setSnackbar} // Pass setSnackbar to EditAdminModal
                />
            )}

            {/* Snackbar for UsersPage notifications */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
}




function PropertiesPage() {
    return (
        <Box sx={{ p: 2, textAlign: 'right' }} >
            <Typography variant="h4" sx={{ display: 'flex', flexDirection: 'row-reverse' }} gutterBottom>قائمة العقارات</Typography>
            <Paper sx={{ p: 2, borderRadius: 2, minHeight: 400, textAlign: 'right', direction: 'rtl' }}>
                <Typography variant="h6" color="text.secondary">On sell | Financing | Rent</Typography>
                <Box sx={{ mt: 2, p: 2, border: '1px dashed #ccc', borderRadius: 1, textAlign: 'right' }}>
                    <Typography variant="body1" color="text.secondary">
                        List of Properties
                    </Typography>
                    <ul style={{ listStyle: 'none', padding: 0, textAlign: 'right' }}>
                        <li>#ID: #12345 | Home1 | Address: Damanhour</li>
                        <li>#ID: #12346 | Villa334 | Address: Alex</li>
                        <li>#ID: #12347 | Apartment234 | Address: Cairo</li>
                    </ul>
                </Box>
            </Paper>
        </Box>
    );
}

function Mainadvertisment(props) {
    const userProfile = useSelector((state) => state.user.profile);
    const dispatch = useDispatch();

    const homepageAds = useSelector((state) => state.homepageAds?.all || [], shallowEqual);
    const homepageAdsLoading = useSelector((state) => state.homepageAds?.loading || false);

    // Debugging logs for Redux state
    useEffect(() => {
        console.log("Mainadvertisment - homepageAds state:", homepageAds);
        console.log("Mainadvertisment - homepageAdsLoading state:", homepageAdsLoading);
    }, [homepageAds, homepageAdsLoading]);


    // State for modals and operations
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedAd, setSelectedAd] = useState(null);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    // State for filtering
    const [statusFilter, setStatusFilter] = useState('all');
    const [activationFilter, setActivationFilter] = useState('all');

    // State for activation menu
    const [activationMenuAnchor, setActivationMenuAnchor] = useState(null);
    const [selectedAdForActivation, setSelectedAdForActivation] = useState(null);

    // Fetch all homepage ads when component mounts
    useEffect(() => {
        console.log("Mainadvertisment - Dispatching fetchAllHomepageAds...");
        dispatch(fetchAllHomepageAds());
    }, [dispatch]);

    // Handle add ad
    const handleAddAd = async (adData) => {
        try {
            await dispatch(createHomepageAd(adData)).unwrap();
            setSnackbar({ open: true, message: "تم إضافة الإعلان بنجاح!", severity: "success" });
        } catch (error) {
            setSnackbar({ open: true, message: "فشل إضافة الإعلان: " + (error.message || "خطأ غير معروف"), severity: "error" });
            console.error("Error adding ad:", error);
        }
    };

    // Handle edit ad
    const handleEditAd = async (editData) => {
        try {
            await dispatch(updateHomepageAd(editData)).unwrap();
            setSnackbar({ open: true, message: "تم تحديث الإعلان بنجاح!", severity: "success" });
        } catch (error) {
            setSnackbar({ open: true, message: "فشل تحديث الإعلان: " + (error.message || "خطأ غير معروف"), severity: "error" });
            console.error("Error updating ad:", error);
        }
    };

    // Handle delete ad
    const handleDeleteAd = async (adId) => {
        try {
            await dispatch(deleteHomepageAd(adId)).unwrap();
            setSnackbar({ open: true, message: "تم حذف الإعلان بنجاح!", severity: "success" });
        } catch (error) {
            setSnackbar({ open: true, message: "فشل حذف الإعلان: " + (error.message || "خطأ غير معروف"), severity: "error" });
            console.error("Error deleting ad:", error);
        }
    };

    // Handle approve ad
    const handleApproveAd = async (adId) => {
        try {
            await dispatch(approveHomepageAd(adId)).unwrap();
            setSnackbar({ open: true, message: "تمت الموافقة على الإعلان!", severity: "success" });
        } catch (error) {
            setSnackbar({ open: true, message: "فشل الموافقة على الإعلان: " + (error.message || "خطأ غير معروف"), severity: "error" });
            console.error("Error approving ad:", error);
        }
    };

    // Handle reject ad
    const handleRejectAd = async (adId, reason) => {
        try {
            await dispatch(rejectHomepageAd({ id: adId, reason })).unwrap();
            setSnackbar({ open: true, message: "تم رفض الإعلان!", severity: "warning" });
        } catch (error) {
            setSnackbar({ open: true, message: "فشل رفض الإعلان: " + (error.message || "خطأ غير معروف"), severity: "error" });
            console.error("Error rejecting ad:", error);
        }
    };

    // Handle activate ad
    const handleActivateAd = async (adId, days = 30) => {
        try {
            await dispatch(activateHomepageAd({ id: adId, days })).unwrap();
            setSnackbar({ open: true, message: "تم تفعيل الإعلان لمدة " + days + " يوم!", severity: "success" });
        } catch (error) {
            setSnackbar({ open: true, message: "فشل تفعيل الإعلان: " + (error.message || "خطأ غير معروف"), severity: "error" });
            console.error("Error activating ad:", error);
        }
    };

    // Handle deactivate ad
    const handleDeactivateAd = async (adId) => {
        try {
            await dispatch(deactivateHomepageAd(adId)).unwrap();
            setSnackbar({ open: true, message: "تم إلغاء تفعيل الإعلان!", severity: "info" });
        } catch (error) {
            setSnackbar({ open: true, message: "فشل إلغاء تفعيل الإعلان: " + (error.message || "خطأ غير معروف"), severity: "error" });
            console.error("Error deactivating ad:", error);
        }
    };

    // Handle return to pending
    const handleReturnToPending = async (adId) => {
        try {
            await dispatch(returnHomepageAdToPending(adId)).unwrap();
            setSnackbar({ open: true, message: "تم إرجاع الإعلان لحالة المراجعة!", severity: "info" });
        } catch (error) {
            setSnackbar({ open: true, message: "فشل إرجاع الإعلان: " + (error.message || "خطأ غير معروف"), severity: "error" });
            console.error("Error returning ad to pending:", error);
        }
    };

    // Handle activation menu
    const handleActivationMenuOpen = (event, ad) => {
        setActivationMenuAnchor(event.currentTarget);
        setSelectedAdForActivation(ad);
    };

    const handleActivationMenuClose = () => {
        setActivationMenuAnchor(null);
        setSelectedAdForActivation(null);
    };

    const handleActivationWithDuration = async (days) => {
        if (selectedAdForActivation) {
            await handleActivateAd(selectedAdForActivation.id, days);
            handleActivationMenuClose();
        }
    };

    // Get status color
    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return 'warning';
            case 'approved': return 'success';
            case 'rejected': return 'error';
            default: return 'default';
        }
    };

    // Get status label
    const getStatusLabel = (status) => {
        switch (status) {
            case 'pending': return 'قيد المراجعة';
            case 'approved': return 'مقبول';
            case 'rejected': return 'مرفوض';
            default: return status;
        }
    };

    // Format date
    const formatDate = (timestamp) => {
        if (!timestamp) return 'غير محدد';
        // Ensure timestamp is a number before creating a Date object
        const date = typeof timestamp === 'number' ? new Date(timestamp) : new Date(timestamp);
        return date.toLocaleDateString('ar-EG');
    };

    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbar({ ...snackbar, open: false });
    };

    // Memoize filteredAds to avoid selector warning
    const filteredAds = useMemo(() => {
        console.log("Mainadvertisment - Filtering ads. Current homepageAds:", homepageAds);
        const filtered = homepageAds.filter(ad => {
            const statusMatch = statusFilter === 'all' || ad.reviewStatus === statusFilter;
            const activationMatch = activationFilter === 'all' ||
                (activationFilter === 'active' && ad.ads) ||
                (activationFilter === 'inactive' && !ad.ads);
            return statusMatch && activationMatch;
        });
        console.log("Mainadvertisment - Filtered ads result:", filtered);
        return filtered;
    }, [homepageAds, statusFilter, activationFilter]);

    // Memoize stats to avoid selector warning
    const stats = useMemo(() => ({
        total: homepageAds.length,
        pending: homepageAds.filter(ad => ad.reviewStatus === 'pending').length,
        approved: homepageAds.filter(ad => ad.reviewStatus === 'approved').length,
        rejected: homepageAds.filter(ad => ad.reviewStatus === 'rejected').length,
        active: homepageAds.filter(ad => ad.ads).length,
        inactive: homepageAds.filter(ad => !ad.ads).length,
    }), [homepageAds]);

    return (
        <Box sx={{ p: 2, textAlign: 'right' }}>
            <Typography variant="h4" sx={{ display: 'flex', flexDirection: 'row-reverse', mb: 3 }}>
                إدارة إعلانات الصفحة الرئيسية
            </Typography>

            <Paper sx={{ p: 3, borderRadius: 2, minHeight: 400, textAlign: 'right' }}>
                {/* Statistics */}
                <Box sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
                    <Chip label={`الكل: ${stats.total}`} color="primary" />
                    <Chip label={`قيد المراجعة: ${stats.pending}`} color="warning" />
                    <Chip label={`مقبول: ${stats.approved}`} color="success" />
                    <Chip label={`مرفوض: ${stats.rejected}`} color="error" />
                    <Chip label={`مفعل: ${stats.active}`} color="info" />
                    <Chip label={`غير مفعل: ${stats.inactive}`} color="default" />
                </Box>

                {/* Filters */}
                <Box sx={{ mb: 3, display: 'flex', gap: 2, flexDirection: 'row-reverse' }}>
                    <FormControl size="small" sx={{ minWidth: 150 }}>
                        <InputLabel>حالة المراجعة</InputLabel>
                        <Select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            label="حالة المراجعة"
                        >
                            <MenuItem value="all">الكل</MenuItem>
                            <MenuItem value="pending">قيد المراجعة</MenuItem>
                            <MenuItem value="approved">مقبول</MenuItem>
                            <MenuItem value="rejected">مرفوض</MenuItem>
                        </Select>
                    </FormControl>

                    <FormControl size="small" sx={{ minWidth: 150 }}>
                        <InputLabel>حالة التفعيل</InputLabel>
                        <Select
                            value={activationFilter}
                            onChange={(e) => setActivationFilter(e.target.value)}
                            label="حالة التفعيل"
                        >
                            <MenuItem value="all">الكل</MenuItem>
                            <MenuItem value="active">مفعل</MenuItem>
                            <MenuItem value="inactive">غير مفعل</MenuItem>
                        </Select>
                    </FormControl>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexDirection: 'row-reverse' }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', fontSize: 18 }} color="text.secondary">
                        إعلانات الصفحة الرئيسية ({filteredAds.length})
                    </Typography>
                    <Tooltip title="إضافة إعلان جديد">
                        <Button
                            sx={{ fontWeight: 'bold', fontSize: 16 }}
                            variant="contained"
                            startIcon={<AddIcon sx={{ ml: 1 }} />}
                            onClick={() => setIsAddModalOpen(true)}
                        >
                            إضافة إعلان
                        </Button>
                    </Tooltip>
                </Box>

                {homepageAdsLoading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
                        <CircularProgress />
                        <Typography sx={{ ml: 2 }}>جاري تحميل الإعلانات...</Typography>
                    </Box>
                ) : filteredAds.length === 0 ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200, flexDirection: 'column' }}>
                        <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
                            لا توجد إعلانات
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            ابدا بإضافة إعلان جديد للصفحة الرئيسية
                        </Typography>
                    </Box>
                ) : (
                    <List>
                        {filteredAds.map((ad) => (
                            <ListItem
                                key={ad.id}
                                sx={{
                                    mb: 2,
                                    p: 2,
                                    border: '1px solid',
                                    borderColor: 'divider',
                                    borderRadius: 2,
                                    backgroundColor: 'background.paper'
                                }}
                            >
                                <Box sx={{ display: 'flex', width: '100%', alignItems: 'center', gap: 2 }}>
                                    {/* Ad Image */}
                                    <Box sx={{ minWidth: 80, height: 80, borderRadius: 1, overflow: 'hidden' }}>
                                        <img
                                            src={ad.image || './home.jpg'}
                                            alt="Ad"
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        />
                                    </Box>

                                    {/* Ad Info */}
                                    <Box sx={{ flexGrow: 1 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                            <Chip
                                                label={getStatusLabel(ad.reviewStatus)}
                                                color={getStatusColor(ad.reviewStatus)}
                                                size="small"
                                            />
                                            <Chip
                                                label={ad.ads ? 'مفعل' : 'غير مفعل'}
                                                color={ad.ads ? 'success' : 'default'}
                                                size="small"
                                            />
                                        </Box>

                                        <Typography variant="body2" color="text.secondary">
                                            تاريخ الإنشاء: {formatDate(ad.id ? new Date(parseInt(ad.id.substring(0, 8), 16) * 1000) : null)}
                                        </Typography>

                                        {ad.adExpiryTime && (
                                            <Typography variant="body2" color="text.secondary">
                                                ينتهي في: {formatDate(ad.adExpiryTime)}
                                            </Typography>
                                        )}

                                        {ad.review_note && (
                                            <Typography variant="body2" color="error">
                                                ملاحظة: {ad.review_note}
                                            </Typography>
                                        )}
                                    </Box>

                                    {/* Admin Actions */}
                                    <Box sx={{ display: 'flex', gap: 1, flexDirection: 'row-reverse' }}>
                                        {/* Approve/Reject buttons for pending ads */}
                                        {ad.reviewStatus === 'pending' && (
                                            <>
                                                <Tooltip title="موافقة">
                                                    <IconButton
                                                        onClick={() => handleApproveAd(ad.id)}
                                                        sx={{ color: 'success.main' }}
                                                    >
                                                        <CheckCircleIcon />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="رفض">
                                                    <IconButton
                                                        onClick={() => handleRejectAd(ad.id, 'تم الرفض من قبل الإدارة')}
                                                        sx={{ color: 'error.main' }}
                                                    >
                                                        <CancelIcon />
                                                    </IconButton>
                                                </Tooltip>
                                            </>
                                        )}

                                        {/* Activate/Deactivate buttons for approved ads */}
                                        {ad.reviewStatus === 'approved' && (
                                            <>
                                                {!ad.ads ? (
                                                    <Tooltip title="تفعيل">
                                                        <IconButton
                                                            onClick={(e) => handleActivationMenuOpen(e, ad)}
                                                            sx={{ color: 'success.main' }}
                                                        >
                                                            <PlayArrowIcon />
                                                        </IconButton>
                                                    </Tooltip>
                                                ) : (
                                                    <Tooltip title="إلغاء التفعيل">
                                                        <IconButton
                                                            onClick={() => handleDeactivateAd(ad.id)}
                                                            sx={{ color: 'warning.main' }}
                                                        >
                                                            <PauseIcon />
                                                        </IconButton>
                                                    </Tooltip>
                                                )}
                                            </>
                                        )}

                                        {/* Return to pending button for rejected ads */}
                                        {ad.reviewStatus === 'rejected' && (
                                            <Tooltip title="إرجاع للمراجعة">
                                                <IconButton
                                                    onClick={() => handleReturnToPending(ad.id)}
                                                    sx={{ color: 'info.main' }}
                                                >
                                                    <AutorenewIcon />
                                                </IconButton>
                                            </Tooltip>
                                        )}

                                        {/* Edit button */}
                                        <Tooltip title="تعديل">
                                            <IconButton
                                                onClick={() => {
                                                    setSelectedAd(ad);
                                                    setIsEditModalOpen(true);
                                                }}
                                                sx={{ color: 'primary.main' }}
                                            >
                                                <EditIcon />
                                            </IconButton>
                                        </Tooltip>

                                        {/* Delete button */}
                                        <Tooltip title="حذف">
                                            <IconButton
                                                onClick={() => {
                                                    setSelectedAd(ad);
                                                    setIsDeleteModalOpen(true);
                                                }}
                                                sx={{ color: 'error.main' }}
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </Tooltip>
                                    </Box>
                                </Box>
                            </ListItem>
                        ))}
                    </List>
                )}
            </Paper>

            {/* Add Modal */}
            <AddHomepageAdModal
                open={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onAdd={handleAddAd}
                userProfile={userProfile}
                userType={userProfile?.type_of_user}
            />

            {/* Edit Modal */}
            <EditHomepageAdModal
                open={isEditModalOpen}
                onClose={() => {
                    setIsEditModalOpen(false);
                    setSelectedAd(null);
                }}
                onSave={handleEditAd}
                ad={selectedAd}
            />

            {/* Delete Confirmation Modal */}
            <ConfirmDeleteModal
                open={isDeleteModalOpen}
                onClose={() => {
                    setIsDeleteModalOpen(false);
                    setSelectedAd(null);
                }}
                onConfirm={() => {
                    if (selectedAd) {
                        handleDeleteAd(selectedAd.id);
                        setIsDeleteModalOpen(false);
                        setSelectedAd(null);
                    }
                }}
                itemType="إعلان"
                itemId={selectedAd?.id}
                itemName="إعلان الصفحة الرئيسية"
            />

            {/* Activation Duration Menu */}
            <Menu
                anchorEl={activationMenuAnchor}
                open={Boolean(activationMenuAnchor)}
                onClose={handleActivationMenuClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
            >
                <MenuItem onClick={() => handleActivationWithDuration(7)}>
                    تفعيل لمدة أسبوع (7 أيام)
                </MenuItem>
                <MenuItem onClick={() => handleActivationWithDuration(15)}>
                    تفعيل لمدة أسبوعين (15 يوم)
                </MenuItem>
                <MenuItem onClick={() => handleActivationWithDuration(30)}>
                    تفعيل لمدة شهر (30 يوم)
                </MenuItem>
                <MenuItem onClick={() => handleActivationWithDuration(60)}>
                    تفعيل لمدة شهرين (60 يوم)
                </MenuItem>
                <MenuItem onClick={() => handleActivationWithDuration(90)}>
                    تفعيل لمدة 3 أشهر (90 يوم)
                </MenuItem>
            </Menu>

            {/* Snackbar */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
}

function PaidAdvertismentPage() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [activeTab, setActiveTab] = useState('developerAds');
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [adToDelete, setAdToDelete] = useState(null);
    const [adToDeleteType, setAdToDeleteType] = useState(null);

    const { developerAds, funderAds, loading, error } = useSelector((state) => state.paidAds);


    // Effect to subscribe to Developer Ads in real-time
    useEffect(() => {
        dispatch(setLoadingDeveloper(true));
        const unsubscribe = RealEstateDeveloperAdvertisement.subscribeActiveAds(
            (ads) => {
                dispatch(setDeveloperAds(ads.map(ad => ({ 
                    ...ad, 
                    id: ad.id || `temp-${Math.random()}` 
                }))));
            },
            (err) => {
                console.error("Error subscribing to developer ads:", err);
                dispatch(setErrorDeveloper(err.message || "فشل تحميل إعلانات المطورين النشطة."));
                setSnackbar({ open: true, message: `فشل تحميل إعلانات المطورين النشطة: ${err.message}`, severity: 'error' });
            }
        );

        return () => unsubscribe();
    }, [dispatch]);

    // Effect to subscribe to Funder Ads in real-time
    useEffect(() => {
        dispatch(setLoadingFunder(true));
        const unsubscribe = FinancingAdvertisement.subscribeActiveAds(
            (ads) => {
                dispatch(setFunderAds(ads.map(ad => ({ 
                    ...ad, 
                    id: ad.id || `temp-${Math.random()}` 
                }))));
            },
            (err) => {
                console.error("Error subscribing to funder ads:", err);
                dispatch(setErrorFunder(err.message || "فشل تحميل إعلانات الممولين النشطة."));
                setSnackbar({ open: true, message: `فشل تحميل إعلانات الممولين النشطة: ${err.message}`, severity: 'error' });
            }
        );

        return () => unsubscribe();
    }, [dispatch]);


    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbar({ ...snackbar, open: false });
    };

    // --- Delete Logic ---
    const handleDeleteClick = (ad, type) => {
        setAdToDelete(ad);
        setAdToDeleteType(type);
        setOpenDeleteDialog(true);
    };

    const handleConfirmDelete = async () => {
        if (!adToDelete || !adToDeleteType) return;

        try {
            await dispatch(deleteAd({ id: adToDelete.id, type: adToDeleteType })).unwrap();
            setSnackbar({ open: true, message: "الإعلان تم حذفه بنجاح!", severity: "success" });
        } catch (err) {
            console.error(`Error deleting ${adToDeleteType} ad:`, err);
            const errorMessage = `فشل حذف الإعلان: ${err || 'خطأ غير معروف'}`;
            setSnackbar({ open: true, message: errorMessage, severity: "error" });
        } finally {
            setOpenDeleteDialog(false);
            setAdToDelete(null);
            setAdToDeleteType(null);
        }
    };

    // --- Edit Logic ---
    const handleEditClick = (ad, type) => {
        console.log(`Edit ${type} advertisement:`, ad);
        setSnackbar({ open: true, message: `تعديل إعلان: ${ad.developer_name || ad.org_name || ad.title}`, severity: "info" });
        navigate(`/admin/paid-advertisements/edit/${type}/${ad.id}`, { state: { adData: ad } });
    };

    // --- Toggle Ad Status (adsActivation / removeAds) Logic ---
    const handleToggleAdStatus = async (ad, type) => {
        try {
            await dispatch(toggleAdStatus({ ad, type })).unwrap();
            const message = ad.ads ? "تم إنهاء عرض الإعلان بنجاح!" : "تم إعادة عرض الإعلان بنجاح!";
            setSnackbar({ open: true, message: message, severity: "success" });
        } catch (err) {
            console.error(`Error toggling ${type} ad status:`, err);
            const message = `فشل تغيير حالة الإعلان: ${err || 'خطأ غير معروف'}`;
            setSnackbar({ open: true, message: message, severity: "error" });
        }
    };


    // Columns for Developer Ads
    const developerColumns = [
        { field: 'developer_name', headerName: 'اسم المطور', width: 200 },
        { field: 'description', headerName: 'الوصف', width: 300 },
        {
            field: 'image',
            headerName: 'الصورة',
            width: 100,
            renderCell: (params) => (
                <Avatar
                    src={params.value || ''}
                    variant="rounded"
                    sx={{ width: 50, height: 50 }}
                />
            ),
            sortable: false,
            filterable: false,
        },
        { field: 'phone', headerName: 'رقم الهاتف', width: 150 },
        {
            field: 'project_types',
            headerName: 'أنواع المشاريع',
            width: 200,
            renderCell: (params) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {params.value && Array.isArray(params.value) && params.value.map((type, index) => (
                        <Chip key={index} label={type} size="small" />
                    ))}
                </Box>
            ),
        },
        {
            field: 'website_url',
            headerName: 'الموقع الإلكتروني',
            width: 180,
            renderCell: (params) => (
                params.value ? (
                    <Link href={params.value} target="_blank" rel="noopener">
                        زيارة الموقع
                    </Link>
                ) : 'لا يوجد'
            ),
        },
        { field: 'price_start_from', headerName: 'السعر يبدأ من', width: 150, type: 'number' },
        { field: 'price_end_to', headerName: 'السعر ينتهي عند', width: 150, type: 'number' },
        { field: 'userId', headerName: 'معرف المستخدم', width: 180 },
        {
            field: 'ad_status',
            headerName: 'الحالة (Active?)',
            width: 120,
            editable: false,
            renderCell: (params) => {
                const statusLabel = params.row.ads ? 'تحت العرض' : 'منتهي';
                const statusColor = params.row.ads ? 'primary' : 'default';
                return (
                    <Chip
                        label={statusLabel}
                        color={statusColor}
                        size="small"
                    />
                );
            },
        },
        {
            field: 'actions',
            headerName: 'الإجراءات',
            width: 150,
            sortable: false,
            filterable: false,
            renderCell: (params) => (
                <Box sx={{ display: 'flex', gap: 0.5 }}>
                    <Tooltip title="تعديل إعلان المطور">
                        <IconButton
                            aria-label="edit"
                            size="small"
                            onClick={() => handleEditClick(params.row, 'developer')}
                            disabled={loading.developer}
                        >
                            <EditIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title={params.row.ads ? "إنهاء العرض" : "تفعيل العرض"}>
                        <IconButton
                            aria-label="toggle status"
                            size="small"
                            onClick={() => handleToggleAdStatus(params.row, 'developer')}
                            color={params.row.ads ? 'warning' : 'success'}
                            disabled={loading.developer}
                        >
                            {params.row.ads ? <BlockIcon fontSize="small" /> : <CheckCircleOutlineIcon fontSize="small" />}
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="حذف إعلان المطور">
                        <IconButton
                            aria-label="delete"
                            size="small"
                            onClick={() => handleDeleteClick(params.row, 'developer')}
                            color="error"
                            disabled={loading.developer}
                        >
                            <DeleteIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                </Box>
            ),
        },
    ];

    // Columns for Funder Ads
    const funderColumns = [
        { field: 'org_name', headerName: 'اسم المؤسسة', width: 200 },
        { field: 'title', headerName: 'العنوان', width: 250 },
        { field: 'description', headerName: 'الوصف', width: 300 },
        { field: 'financing_model', headerName: 'نموذج التمويل', width: 150 },
        {
            field: 'image',
            headerName: 'الصورة',
            width: 100,
            renderCell: (params) => (
                <Avatar
                    src={params.value || ''}
                    variant="rounded"
                    sx={{ width: 50, height: 50 }}
                />
            ),
            sortable: false,
            filterable: false,
        },
        { field: 'phone', headerName: 'رقم الهاتف', width: 150 },
        { field: 'start_limit', headerName: 'حد البدء', width: 120, type: 'number' },
        { field: 'end_limit', headerName: 'حد الانتهاء', width: 120, type: 'number' },
        { field: 'interest_rate_upto_5', headerName: 'فائدة حتى 5 سنوات', width: 180, type: 'number' },
        { field: 'interest_rate_upto_10', headerName: 'فائدة حتى 10 سنوات', width: 180, type: 'number' },
        { field: 'interest_rate_above_10', headerName: 'فائدة أكثر من 10 سنوات', width: 200, type: 'number' },
        { field: 'userId', headerName: 'معرف المستخدم', width: 180 },
        {
            field: 'ad_status',
            headerName: 'الحالة (Active?)',
            width: 120,
            editable: false,
            renderCell: (params) => {
                const statusLabel = params.row.ads ? 'تحت العرض' : 'منتهي';
                const statusColor = params.row.ads ? 'primary' : 'default';
                return (
                    <Chip
                        label={statusLabel}
                        color={statusColor}
                        size="small"
                    />
                );
            },
        },
        {
            field: 'actions',
            headerName: 'الإجراءات',
            width: 150,
            sortable: false,
            filterable: false,
            renderCell: (params) => (
                <Box sx={{ display: 'flex', gap: 0.5 }}>
                    <Tooltip title="تعديل إعلان الممول">
                        <IconButton
                            aria-label="edit"
                            size="small"
                            onClick={() => handleEditClick(params.row, 'funder')}
                            disabled={loading.funder}
                        >
                            <EditIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title={params.row.ads ? "إنهاء العرض" : "تفعيل العرض"}>
                        <IconButton
                            aria-label="toggle status"
                            size="small"
                            onClick={() => handleToggleAdStatus(params.row, 'funder')}
                            color={params.row.ads ? 'warning' : 'success'}
                            disabled={loading.funder}
                        >
                            {params.row.ads ? <BlockIcon fontSize="small" /> : <CheckCircleOutlineIcon fontSize="small" />}
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="حذف إعلان الممول">
                        <IconButton
                            aria-label="delete"
                            size="small"
                            onClick={() => handleDeleteClick(params.row, 'funder')}
                            color="error"
                            disabled={loading.funder}
                        >
                            <DeleteIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                </Box>
            ),
        },
    ];


    // Function to get the DataGrid content based on the active tab
    const renderDataGrid = () => {
        if (activeTab === 'developerAds') {
            return (
                <>
                    {loading.developer ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                            <CircularProgress />
                            <Typography variant="body1" sx={{ ml: 2 }}>جارٍ تحميل إعلانات المطورين...</Typography>
                        </Box>
                    ) : error.developer ? (
                        <Alert severity="error" sx={{ width: '100%' }}>{error.developer}</Alert>
                    ) : (
                        <DataGrid
                            rows={developerAds.filter(ad => ad.id !== null && ad.id !== undefined)}
                            columns={developerColumns}
                            pageSizeOptions={[5, 10, 20]}
                            initialState={{
                                pagination: {
                                    paginationModel: { pageSize: 10 },
                                },
                            }}
                            getRowId={(row) => row.id || `temp-${Math.random()}`}
                            disableRowSelectionOnClick
                            localeText={{
                                MuiTablePagination: {
                                    labelRowsPerPage: 'صفوف لكل صفحة:',
                                    labelDisplayedRows: ({ from, to, count }) =>
                                        `${from}-${to} من ${count !== -1 ? count : `أكثر من ${to}`}`,
                                },
                                columnMenuUnsort: "إلغاء الفرز",
                                columnMenuSortAsc: "الفرز تصاعديا",
                                columnMenuSortDesc: "الفرز تنازليا",
                                columnMenuFilter: "تصفية",
                                columnMenuHideColumn: "إخفاء العمود",
                                columnMenuShowColumns: "إظهار الأعمدة",
                                filterPanelOperators: "العوامل",
                                filterPanelColumns: "الأعمدة",
                                filterPanelInputLabel: "القيمة",
                                filterPanelLogicOperator: "المنطق",
                                filterPanelOperatorAnd: "و",
                                filterPanelOperatorOr: "أو",
                                filterPanelOperatorContains: "يحتوي على",
                                filterPanelOperatorEquals: "يساوي",
                                filterPanelOperatorStartsWith: "يبدأ بـ",
                                filterPanelOperatorEndsWith: "ينتهي بـ",
                                filterPanelOperatorIsEmpty: "فارغ",
                                filterPanelOperatorIsNotEmpty: "ليس فارغا",
                                filterPanelOperatorIsAnyOf: "أي من",
                                noRowsLabel: "لا توجد إعلانات مطورين لعرضها.",
                                noResultsOverlayLabel: "لم يتم العثور على نتائج.",
                            }}
                            showToolbar
                        />
                    )}
                </>
            );
        } else if (activeTab === 'funderAds') {
            return (
                <>
                    {loading.funder ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                            <CircularProgress />
                            <Typography variant="body1" sx={{ ml: 2 }}>جارٍ تحميل إعلانات الممولين...</Typography>
                        </Box>
                    ) : error.funder ? (
                        <Alert severity="error" sx={{ width: '100%' }}>{error.funder}</Alert>
                    ) : (
                        <DataGrid
                            rows={funderAds.filter(ad => ad.id !== null && ad.id !== undefined)}
                            columns={funderColumns}
                            pageSizeOptions={[5, 10, 20]}
                            initialState={{
                                pagination: {
                                    paginationModel: { pageSize: 10 },
                                },
                            }}
                            getRowId={(row) => row.id || `temp-${Math.random()}`}
                            disableRowSelectionOnClick
                            localeText={{
                                MuiTablePagination: {
                                    labelRowsPerPage: 'صفوف لكل صفحة:',
                                    labelDisplayedRows: ({ from, to, count }) =>
                                        `${from}-${to} من ${count !== -1 ? count : `أكثر من ${to}`}`,
                                },
                                columnMenuUnsort: "إلغاء الفرز",
                                columnMenuSortAsc: "الفرز تصاعديا",
                                columnMenuSortDesc: "الفرز تنازليا",
                                columnMenuFilter: "تصفية",
                                columnMenuHideColumn: "إخفاء العمود",
                                columnMenuShowColumns: "إظهار الأعمدة",
                                filterPanelOperators: "العوامل",
                                filterPanelColumns: "الأعمدة",
                                filterPanelInputLabel: "القيمة",
                                filterPanelLogicOperator: "المنطق",
                                filterPanelOperatorAnd: "و",
                                filterPanelOperatorOr: "أو",
                                filterPanelOperatorContains: "يحتوي على",
                                filterPanelOperatorEquals: "يساوي",
                                filterPanelOperatorStartsWith: "يبدأ بـ",
                                filterPanelOperatorEndsWith: "ينتهي بـ",
                                filterPanelOperatorIsEmpty: "فارغ",
                                filterPanelOperatorIsNotEmpty: "ليس فارغا",
                                filterPanelOperatorIsAnyOf: "أي من",
                                noRowsLabel: "لا توجد إعلانات ممولين لعرضها.",
                                noResultsOverlayLabel: "لم يتم العثور على نتائج.",
                            }}
                            showToolbar
                        />
                    )}
                </>
            );
        }
        return null;
    };

    return (
        <Box dir={'rtl'} sx={{ p: 2, textAlign: 'right', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>

            <Typography sx={{ display: 'flex', flexDirection: 'row' }} variant="h4" gutterBottom>
                الإعلانات المدفوعة
            </Typography>
            <Paper dir={'rtl'} sx={{ p: 2, borderRadius: 2, minHeight: 400, textAlign: 'right', flexGrow: 1 }}>
                {/* Tabs for switching */}
                <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
                    <Tabs
                        variant='scrollable'
                        value={activeTab}
                        onChange={handleTabChange}
                        aria-label="advertisement tabs"
                        // centered
                        textColor="primary"
                        indicatorColor="primary"
                    >
                        <Tab value="developerAds" label="إعلانات مطورين عقاريين" />
                        <Tab value="funderAds" label="إعلانات ممولين عقاريين" />
                    </Tabs>
                </Box>

                {/* DataGrid Container */}
                <Box sx={{ height: 'auto', width: '100%', padding: '1rem', flexGrow: 1 }}>
                    {renderDataGrid()}
                </Box>
            </Paper>

            {/* Delete Confirmation Dialog */}
            <Dialog
                open={openDeleteDialog}
                onClose={() => setOpenDeleteDialog(false)}
                aria-labelledby="delete-dialog-title"
                aria-describedby="delete-dialog-description"
                dir="rtl"
            >
                <DialogTitle id="delete-dialog-title">{"تأكيد الحذف"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="delete-dialog-description">
                        هل أنت متأكد أنك تريد حذف الإعلان: "{adToDelete?.developer_name || adToDelete?.org_name || adToDelete?.title}"؟
                        هذا الإجراء لا يمكن التراجع عنه.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDeleteDialog(false)} color="primary" disabled={loading.developer || loading.funder}>
                        إلغاء
                    </Button>
                    <Button onClick={handleConfirmDelete} color="error" autoFocus disabled={loading.developer || loading.funder}>
                        حذف
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar for Notifications */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
}



function ClientAdvertismentPage() {
    const dispatch = useDispatch();
    const advertisements = useSelector((state) => state.advertisements.list);
    const loading = useSelector((state) => state.advertisements.loading);
    const error = useSelector((state) => state.advertisements.error);
    const filters = useSelector((state) => state.advertisements.filters);

    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [adToDelete, setAdToDelete] = useState(null);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    
    // Review actions dialogs
    const [openApproveDialog, setOpenApproveDialog] = useState(false);
    const [openRejectDialog, setOpenRejectDialog] = useState(false);
    const [openReturnDialog, setOpenReturnDialog] = useState(false);
    const [adToReview, setAdToReview] = useState(null);
    const [rejectReason, setRejectReason] = useState('');
    
    // Activation dialog
    const [openActivateDialog, setOpenActivateDialog] = useState(false);
    const [activationDays, setActivationDays] = useState(30);

    useEffect(() => {
        dispatch(fetchAdvertisements());
    }, [dispatch]);


    // --- Operations ---
    const handleDeleteClick = (ad) => {
        setAdToDelete(ad);
        setOpenDeleteDialog(true);
    };

    const handleConfirmDelete = async () => {
        if (adToDelete) {
            try {
                await dispatch(deleteAdvertisement(adToDelete.id)).unwrap();
                setSnackbar({ open: true, message: "الإعلان تم حذفه بنجاح!", severity: "success" });
            } catch (err) {
                console.error("Error deleting advertisement:", err);
                setSnackbar({ open: true, message: `فشل حذف الإعلان: ${err.message || 'خطأ غير معروف'}`, severity: "error" });
            } finally {
                setOpenDeleteDialog(false);
                setAdToDelete(null);
            }
        }
    };

    const handleToggleAdStatus = async (ad) => {
        try {
            let newStatus;
            if (ad.status === 'تحت العرض') {
                newStatus = 'منتهي';
            } else if (ad.status === 'منتهي') {
                newStatus = 'تحت العرض';
            } else if (ad.status === 'تحت التفاوض') {
                newStatus = 'تحت العرض';
            } else {
                newStatus = 'تحت العرض';
            }
            await dispatch(updateAdvertisementStatus({ adId: ad.id, newStatus })).unwrap();
            setSnackbar({ open: true, message: `تم تغيير حالة الإعلان إلى: ${newStatus}`, severity: "success" });
        } catch (err) {
            console.error("Error updating ad status:", err);
            setSnackbar({ open: true, message: `فشل تغيير حالة الإعلان: ${err.message || 'خطأ غير معروف'}`, severity: "error" });
        }
    };

    // Review Operations
    const handleApproveClick = (ad) => {
        setAdToReview(ad);
        setOpenApproveDialog(true);
    };

    const handleConfirmApprove = async () => {
        if (adToReview) {
            try {
                await dispatch(approveAdvertisement(adToReview.id)).unwrap();
                setSnackbar({ open: true, message: "تمت الموافقة على الإعلان بنجاح!", severity: "success" });
            } catch (err) {
                console.error("Error approving advertisement:", err);
                setSnackbar({ open: true, message: `فشل الموافقة على الإعلان: ${err.message || 'خطأ غير معروف'}`, severity: "error" });
            } finally {
                setOpenApproveDialog(false);
                setAdToReview(null);
            }
        }
    };

    const handleRejectClick = (ad) => {
        setAdToReview(ad);
        setRejectReason('');
        setOpenRejectDialog(true);
    };

    const handleConfirmReject = async () => {
        if (adToReview) {
            try {
                await dispatch(rejectAdvertisement({ adId: adToReview.id, reason: rejectReason })).unwrap();
                setSnackbar({ open: true, message: "تم رفض الإعلان بنجاح!", severity: "success" });
            } catch (err) {
                console.error("Error rejecting advertisement:", err);
                setSnackbar({ open: true, message: `فشل رفض الإعلان: ${err.message || 'خطأ غير معروف'}`, severity: "error" });
            } finally {
                setOpenRejectDialog(false);
                setAdToReview(null);
                setRejectReason('');
            }
        }
    };

    const handleReturnClick = (ad) => {
        setAdToReview(ad);
        setOpenReturnDialog(true);
    };

    const handleConfirmReturn = async () => {
        if (adToReview) {
            try {
                await dispatch(returnAdvertisementToPending(adToReview.id)).unwrap();
                setSnackbar({ open: true, message: "تم إعادة الإعلان إلى المراجعة بنجاح!", severity: "success" });
            } catch (err) {
                console.error("Error returning advertisement:", err);
                setSnackbar({ open: true, message: `فشل إعادة الإعلان: ${err.message || 'خطأ غير معروف'}`, severity: "error" });
            } finally {
                setOpenReturnDialog(false);
                setAdToReview(null);
            }
        }
    };

    // Activation Operations
    const handleActivateClick = (ad) => {
        setAdToReview(ad);
        setActivationDays(30);
        setOpenActivateDialog(true);
    };

    const handleConfirmActivate = async () => {
        if (adToReview) {
            try {
                await dispatch(activateAdvertisement({ adId: adToReview.id, days: activationDays })).unwrap();
                setSnackbar({ open: true, message: `تم تفعيل الإعلان لمدة ${activationDays} يوم بنجاح!`, severity: "success" });
            } catch (err) {
                console.error("Error activating advertisement:", err);
                setSnackbar({ open: true, message: `فشل تفعيل الإعلان: ${err.message || 'خطأ غير معروف'}`, severity: "error" });
            } finally {
                setOpenActivateDialog(false);
                setAdToReview(null);
            }
        }
    };

    const handleDeactivateClick = async (ad) => {
        try {
            await dispatch(deactivateAdvertisement(ad.id)).unwrap();
            setSnackbar({ open: true, message: "تم إيقاف تفعيل الإعلان بنجاح!", severity: "success" });
        } catch (err) {
            console.error("Error deactivating advertisement:", err);
            setSnackbar({ open: true, message: `فشل إيقاف تفعيل الإعلان: ${err.message || 'خطأ غير معروف'}`, severity: "error" });
        }
    };

    // Filter Operations
    const handleFilterByReviewStatus = (status) => {
        if (status === 'all') {
            dispatch(clearFilters());
            dispatch(fetchAdvertisements());
        } else {
            dispatch(setFilter({ type: 'reviewStatus', value: status }));
            dispatch(fetchAdvertisementsByReviewStatus(status));
        }
    };

    const handleFilterByAdStatus = (status) => {
        if (status === 'all') {
            dispatch(clearFilters());
            dispatch(fetchAdvertisements());
        } else {
            dispatch(setFilter({ type: 'adStatus', value: status }));
            dispatch(fetchAdvertisementsByAdStatus(status));
        }
    };

    const handleEditClick = (ad) => {
        console.log("Edit advertisement:", ad);
        setSnackbar({ open: true, message: `تحرير الإعلان: ${ad.title}`, severity: "info" });
    };

    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbar({ ...snackbar, open: false });
        dispatch(clearAdvertisementsError());
    };
    // --- End Operations ---

    const columns = [
        { field: 'title', headerName: 'العنوان', width: 250, editable: false },
        {
            field: 'images',
            headerName: 'الصورة',
            width: 100,
            renderCell: (params) => (
                <Avatar
                    src={params.value && params.value.length > 0 ? params.value[0] : undefined}
                    variant="rounded"
                    sx={{ width: 50, height: 50 }}
                >
                    {(!params.value || params.value.length === 0) && '🏠'}
                </Avatar>
            ),
            editable: false,
            sortable: false,
            filterable: false,
        },
        { field: 'type', headerName: 'النوع', width: 120, editable: false },
        { field: 'price', headerName: 'السعر (ج.م)', width: 150, type: 'number', editable: false },
        { field: 'area', headerName: 'المساحة (م²)', width: 120, type: 'number', editable: false },
        { field: 'city', headerName: 'المدينة', width: 150, editable: false },
        { field: 'governorate', headerName: 'المحافظة', width: 150, editable: false },
        {
            field: 'phone',
            headerName: 'رقم الهاتف',
            width: 150,
            editable: false,
            renderCell: (params) => (
                <Link href={`tel:${params.value}`} target="_blank" rel="noopener">
                    {params.value}
                </Link>
            ),
        },
        { field: 'user_name', headerName: 'اسم المعلن', width: 150, editable: false },
        {
            field: 'ad_type',
            headerName: 'نوع الإعلان',
            width: 120,
            editable: false,
            renderCell: (params) => (
                <Chip
                    label={params.value}
                    color={params.value === 'بيع' ? 'success' : 'info'}
                    size="small"
                />
            ),
        },
        {
            field: 'reviewStatus',
            headerName: 'حالة المراجعة',
            width: 140,
            editable: false,
            renderCell: (params) => {
                const status = params.value;
                const colors = {
                    pending: 'warning',
                    approved: 'success',
                    rejected: 'error'
                };
                const labels = {
                    pending: 'قيد المراجعة',
                    approved: 'تمت الموافقة',
                    rejected: 'مرفوض'
                };
                return (
                    <Chip
                        label={labels[status] || status}
                        color={colors[status] || 'default'}
                        size="small"
                    />
                );
            },
        },
        {
            field: 'status',
            headerName: 'حالة العرض',
            width: 120,
            editable: false,
            renderCell: (params) => (
                <Chip
                    label={params.value}
                    color={
                        params.value === 'تحت العرض'
                            ? 'primary'
                            : params.value === 'تحت التفاوض'
                                ? 'warning'
                                : 'default'
                    }
                    size="small"
                />
            ),
        },
        {
            field: 'ads',
            headerName: 'التفعيل',
            width: 100,
            editable: false,
            renderCell: (params) => (
                <Chip
                    label={params.value ? 'مفعل' : 'غير مفعل'}
                    color={params.value ? 'success' : 'default'}
                    size="small"
                />
            ),
        },
        { field: 'address', headerName: 'العنوان التفصيلي', width: 300, editable: false },
        { field: 'date_of_building', headerName: 'تاريخ الإنشاء', width: 150, editable: false },
        {
            field: 'actions',
            headerName: 'الإجراءات',
            width: 300,
            sortable: false,
            filterable: false,
            renderCell: (params) => {
                const ad = params.row;
                return (
                    <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                        {/* Review Actions */}
                        {ad.reviewStatus === 'pending' && (
                            <>
                                <Tooltip title="الموافقة على الإعلان">
                                    <IconButton
                                        aria-label="approve"
                                        size="small"
                                        onClick={() => handleApproveClick(ad)}
                                        color="success"
                                        disabled={loading === 'pending'}
                                    >
                                        <CheckCircleOutlineIcon fontSize="small" />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="رفض الإعلان">
                                    <IconButton
                                        aria-label="reject"
                                        size="small"
                                        onClick={() => handleRejectClick(ad)}
                                        color="error"
                                        disabled={loading === 'pending'}
                                    >
                                        <BlockIcon fontSize="small" />
                                    </IconButton>
                                </Tooltip>
                            </>
                        )}
                        
                        {(ad.reviewStatus === 'approved' || ad.reviewStatus === 'rejected') && (
                            <Tooltip title="إعادة إلى المراجعة">
                                <IconButton
                                    aria-label="return to pending"
                                    size="small"
                                    onClick={() => handleReturnClick(ad)}
                                    color="info"
                                    disabled={loading === 'pending'}
                                >
                                    <AutorenewIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>
                        )}

                        {/* Activation Actions */}
                        {ad.reviewStatus === 'approved' && (
                            <>
                                {!ad.ads ? (
                                    <Tooltip title="تفعيل الإعلان">
                                        <IconButton
                                            aria-label="activate"
                                            size="small"
                                            onClick={() => handleActivateClick(ad)}
                                            color="success"
                                            disabled={loading === 'pending'}
                                        >
                                            <CheckCircleOutlineIcon fontSize="small" />
                                        </IconButton>
                                    </Tooltip>
                                ) : (
                                    <Tooltip title="إيقاف التفعيل">
                                        <IconButton
                                            aria-label="deactivate"
                                            size="small"
                                            onClick={() => handleDeactivateClick(ad)}
                                            color="warning"
                                            disabled={loading === 'pending'}
                                        >
                                            <BlockIcon fontSize="small" />
                                        </IconButton>
                                    </Tooltip>
                                )}
                            </>
                        )}

                        {/* Status Toggle */}
                        <Tooltip
                            title={
                                ad.status === 'تحت العرض'
                                    ? "إنهاء العرض"
                                    : ad.status === 'منتهي'
                                        ? "إعادة العرض"
                                        : "تغيير الحالة"
                            }
                        >
                            <IconButton
                                aria-label="toggle status"
                                size="small"
                                onClick={() => handleToggleAdStatus(ad)}
                                color={
                                    ad.status === 'تحت العرض'
                                        ? 'warning'
                                        : ad.status === 'منتهي'
                                            ? 'success'
                                            : 'info'
                                }
                                disabled={loading === 'pending'}
                            >
                                {ad.status === 'تحت العرض' ? (
                                    <BlockIcon fontSize="small" />
                                ) : ad.status === 'منتهي' ? (
                                    <CheckCircleOutlineIcon fontSize="small" />
                                ) : (
                                    <AutorenewIcon fontSize="small" />
                                )}
                            </IconButton>
                        </Tooltip>

                        {/* Edit */}
                        <Tooltip title="تعديل الإعلان">
                            <IconButton
                                aria-label="edit"
                                size="small"
                                onClick={() => handleEditClick(ad)}
                                disabled={loading === 'pending'}
                            >
                                <EditIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>

                        {/* Delete */}
                        <Tooltip title="حذف الإعلان">
                            <IconButton
                                aria-label="delete"
                                size="small"
                                onClick={() => handleDeleteClick(ad)}
                                color="error"
                                disabled={loading === 'pending'}
                            >
                                <DeleteIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                    </Box>
                );
            },
        },
    ];

    return (
        <Box
            dir={'rtl'}
            sx={{
                p: 2,
                textAlign: 'right',
                display: 'flex',
                flexDirection: 'column',
                flexGrow: 1,
                minHeight: 'calc(100vh - 64px - 48px)',
            }}
        >
            <Typography sx={{ display: 'flex', flexDirection: 'row' }} variant="h4" gutterBottom>
                إعلانات العملاء
            </Typography>

            <Paper
                dir={'rtl'}
                sx={{
                    p: 2,
                    borderRadius: 2,
                    textAlign: 'left',
                    display: 'flex',
                    flexDirection: 'column',
                    flexGrow: 1,
                    minHeight: 'calc(100vh - 64px - 48px - 70px)',
                }}
            >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6" color="text.secondary">
                        قائمة الإعلانات الحالية
                    </Typography>
                    
                    {/* Filter Controls */}
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <FormControl size="small" sx={{ minWidth: 150 }}>
                            <InputLabel>حالة المراجعة</InputLabel>
                            <Select
                                value={filters.reviewStatus || 'all'}
                                onChange={(e) => handleFilterByReviewStatus(e.target.value)}
                                label="حالة المراجعة"
                            >
                                <MenuItem value="all">جميع الحالات</MenuItem>
                                <MenuItem value="pending">قيد المراجعة</MenuItem>
                                <MenuItem value="approved">تمت الموافقة</MenuItem>
                                <MenuItem value="rejected">مرفوض</MenuItem>
                            </Select>
                        </FormControl>
                        
                        <FormControl size="small" sx={{ minWidth: 150 }}>
                            <InputLabel>حالة العرض</InputLabel>
                            <Select
                                value={filters.adStatus || 'all'}
                                onChange={(e) => handleFilterByAdStatus(e.target.value)}
                                label="حالة العرض"
                            >
                                <MenuItem value="all">جميع الحالات</MenuItem>
                                <MenuItem value="تحت العرض">تحت العرض</MenuItem>
                                <MenuItem value="تحت التفاوض">تحت التفاوض</MenuItem>
                                <MenuItem value="منتهي">منتهي</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                </Box>

                {loading === 'pending' ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexGrow: 1 }}>
                        <CircularProgress />
                        <Typography variant="body1" sx={{ ml: 2 }}>جارٍ تحميل الإعلانات...</Typography>
                    </Box>
                ) : loading === 'failed' ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexGrow: 1, color: 'error.main' }}>
                        <Typography variant="body1">خطأ: {error}</Typography>
                    </Box>
                ) : (
                    <Box
                        sx={{
                            flexGrow: 1,
                            height: 'auto',
                            width: '100%',
                            minHeight: 0,
                            overflow: 'auto',
                            '& .MuiDataGrid-columnHeaders': {
                                backgroundColor: '#f0f0f0',
                                color: 'rgba(0, 0, 0, 0.87)',
                            },
                            '& .MuiDataGrid-row:nth-of-type(odd)': {
                                backgroundColor: 'rgba(0, 0, 0, 0.02)',
                            },
                        }}
                    >
                        <DataGrid
                            rows={advertisements.filter(ad => ad.id != null).map(ad => ({
                                ...ad,
                                id: ad.id || `temp-${Math.random().toString(36).substr(2, 9)}`
                            }))}
                            columns={columns}
                            pageSizeOptions={[5, 10, 20, 30, 50]}
                            initialState={{
                                pagination: {
                                    paginationModel: { pageSize: 10, page: 0 },
                                },
                            }}
                            getRowId={(row) => row.id} // Explicitly tell DataGrid to use 'id' as the row identifier
                            disableRowSelectionOnClick
                            localeText={{
                                MuiTablePagination: {
                                    labelRowsPerPage: 'صفوف لكل صفحة:',
                                    labelDisplayedRows: ({ from, to, count }) =>
                                        `${from}-${to} من ${count !== -1 ? count : `أكثر من ${to}`}`,
                                },
                                columnMenuUnsort: "إلغاء الفرز",
                                columnMenuSortAsc: "الفرز تصاعديا",
                                columnMenuSortDesc: "الفرز تنازليا",
                                columnMenuFilter: "تصفية",
                                columnMenuHideColumn: "إخفاء العمود",
                                columnMenuShowColumns: "إظهار الأعمدة",
                                filterPanelOperators: "العوامل",
                                filterPanelColumns: "الأعمدة",
                                filterPanelInputLabel: "القيمة",
                                filterPanelLogicOperator: "المنطق",
                                filterPanelOperatorAnd: "و",
                                filterPanelOperatorOr: "أو",
                                filterPanelOperatorContains: "يحتوي على",
                                filterPanelOperatorEquals: "يساوي",
                                filterPanelOperatorStartsWith: "يبدأ بـ",
                                filterPanelOperatorEndsWith: "ينتهي بـ",
                                filterPanelOperatorIsEmpty: "فارغ",
                                filterPanelOperatorIsNotEmpty: "ليس فارغا",
                                filterPanelOperatorIsAnyOf: "أي من",
                                noRowsLabel: "لا توجد إعلانات لعرضها.",
                                noResultsOverlayLabel: "لم يتم العثور على نتائج.",
                            }}
                            showToolbar
                        />
                    </Box>
                )}
            </Paper>

            {/* Delete Confirmation Dialog */}
            <Dialog
                open={openDeleteDialog}
                onClose={() => setOpenDeleteDialog(false)}
                aria-labelledby="delete-dialog-title"
                aria-describedby="delete-dialog-description"
                dir="rtl"
            >
                <DialogTitle id="delete-dialog-title">{"تأكيد الحذف"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="delete-dialog-description">
                        هل أنت متأكد أنك تريد حذف الإعلان: "{adToDelete?.title}"؟
                        هذا الإجراء لا يمكن التراجع عنه.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDeleteDialog(false)} color="primary" disabled={loading === 'pending'}>
                        إلغاء
                    </Button>
                    <Button onClick={handleConfirmDelete} color="error" autoFocus disabled={loading === 'pending'}>
                        حذف
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Approve Confirmation Dialog */}
            <Dialog
                open={openApproveDialog}
                onClose={() => setOpenApproveDialog(false)}
                aria-labelledby="approve-dialog-title"
                aria-describedby="approve-dialog-description"
                dir="rtl"
            >
                <DialogTitle id="approve-dialog-title">{"تأكيد الموافقة"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="approve-dialog-description">
                        هل أنت متأكد أنك تريد الموافقة على الإعلان: "{adToReview?.title}"؟
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenApproveDialog(false)} color="primary" disabled={loading === 'pending'}>
                        إلغاء
                    </Button>
                    <Button onClick={handleConfirmApprove} color="success" autoFocus disabled={loading === 'pending'}>
                        موافقة
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Reject Confirmation Dialog */}
            <Dialog
                open={openRejectDialog}
                onClose={() => setOpenRejectDialog(false)}
                aria-labelledby="reject-dialog-title"
                aria-describedby="reject-dialog-description"
                dir="rtl"
            >
                <DialogTitle id="reject-dialog-title">{"رفض الإعلان"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="reject-dialog-description" sx={{ mb: 2 }}>
                        هل أنت متأكد أنك تريد رفض الإعلان: "{adToReview?.title}"؟
                    </DialogContentText>
                    <TextField
                        fullWidth
                        label="سبب الرفض (اختياري)"
                        value={rejectReason}
                        onChange={(e) => setRejectReason(e.target.value)}
                        multiline
                        maxRows={4}
                        minRows={2}
                        placeholder="اكتب سبب الرفض هنا..."
                        variant="outlined"
                        size="medium"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenRejectDialog(false)} color="primary" disabled={loading === 'pending'}>
                        إلغاء
                    </Button>
                    <Button onClick={handleConfirmReject} color="error" autoFocus disabled={loading === 'pending'}>
                        رفض
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Return to Pending Confirmation Dialog */}
            <Dialog
                open={openReturnDialog}
                onClose={() => setOpenReturnDialog(false)}
                aria-labelledby="return-dialog-title"
                aria-describedby="return-dialog-description"
                dir="rtl"
            >
                <DialogTitle id="return-dialog-title">{"إعادة إلى المراجعة"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="return-dialog-description">
                        هل أنت متأكد أنك تريد إعادة الإعلان: "{adToReview?.title}" إلى حالة المراجعة؟
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenReturnDialog(false)} color="primary" disabled={loading === 'pending'}>
                        إلغاء
                    </Button>
                    <Button onClick={handleConfirmReturn} color="info" autoFocus disabled={loading === 'pending'}>
                        إعادة
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Activation Dialog */}
            <Dialog
                open={openActivateDialog}
                onClose={() => setOpenActivateDialog(false)}
                aria-labelledby="activate-dialog-title"
                aria-describedby="activate-dialog-description"
                dir="rtl"
            >
                <DialogTitle id="activate-dialog-title">{"تفعيل الإعلان"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="activate-dialog-description" sx={{ mb: 2 }}>
                        تفعيل الإعلان: "{adToReview?.title}"
                    </DialogContentText>
                    <TextField
                        fullWidth
                        label="عدد أيام التفعيل"
                        type="number"
                        value={activationDays}
                        onChange={(e) => setActivationDays(parseInt(e.target.value) || 30)}
                        inputProps={{ min: 1, max: 365 }}
                        helperText="اختر عدد أيام تفعيل الإعلان (1-365 يوم)"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenActivateDialog(false)} color="primary" disabled={loading === 'pending'}>
                        إلغاء
                    </Button>
                    <Button onClick={handleConfirmActivate} color="success" autoFocus disabled={loading === 'pending'}>
                        تفعيل
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar for Notifications */}
            <Snackbar
                open={snackbar.open || (loading === 'failed' && !!error)} // Show error Snackbar if fetch failed
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={handleSnackbarClose} severity={snackbar.severity || 'error'} sx={{ width: '100%' }}>
                    {snackbar.message || error}
                </Alert>
            </Snackbar>
        </Box>
    );
}


function OrdersPage() {
    const dispatch = useDispatch();
    const { list: financingRequests, loading, error } = useSelector((state) => state.financialRequests);

    // Edit dialog state
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [editRow, setEditRow] = useState(null);
    const [editAmount, setEditAmount] = useState("");
    const [editStatus, setEditStatus] = useState("");
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [rowToDelete, setRowToDelete] = useState(null);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    useEffect(() => {
        dispatch(fetchFinancialRequests());
    }, [dispatch]);

    const handleEditClick = (row) => {
        setEditRow(row);
        setEditAmount(row.financing_amount || "");
        setEditStatus(row.status || "");
        setEditDialogOpen(true);
    };

    const handleEditSave = () => {
        if (editRow) {
            dispatch(updateFinancialRequest({ id: editRow.id, updates: { financing_amount: editAmount, status: editStatus } }));
        }
        setEditDialogOpen(false);
        setEditRow(null);
    };

    const handleEditCancel = () => {
        setEditDialogOpen(false);
        setEditRow(null);
    };
    const handleDeleteClick = (row) => {
        setRowToDelete(row);
        setOpenDeleteDialog(true);
    };

    const handleConfirmDelete = async () => {
        if (rowToDelete) {
            try {
                await dispatch(deleteFinancialRequest(rowToDelete.id)).unwrap();
                setSnackbar({ open: true, message: "تم حذف الطلب بنجاح!", severity: "success" });
            } catch (err) {
                setSnackbar({ open: true, message: `فشل حذف الطلب: ${err.message || 'خطأ غير معروف'}`, severity: "error" });
            } finally {
                setOpenDeleteDialog(false);
                setRowToDelete(null);
            }
        }
    };

    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') return;
        setSnackbar({ ...snackbar, open: false });
    };
    // Define columns for DataGrid
    const columns = [
        { field: 'id', headerName: 'ID', width: 120 },
        { field: 'user_id', headerName: 'معرّف المستخدم', width: 180 },
        { field: 'status', headerName: 'الحالة', width: 120 },
        { field: 'financing_amount', headerName: 'المبلغ المطلوب', width: 150 },
        { field: 'job_title', headerName: 'الوظيفة', width: 150 },
        { field: 'monthly_income', headerName: 'الدخل الشهري', width: 150 },
        { field: 'age', headerName: 'العمر', width: 100 },
        { field: 'marital_status', headerName: 'الحالة الاجتماعية', width: 150 },
        { field: 'dependents', headerName: 'المعالون', width: 100 },
        { field: 'repayment_years', headerName: 'سنوات السداد', width: 120 },
        {
            field: 'submitted_at',
            headerName: 'تاريخ التقديم',
            width: 160,
            valueGetter: (params) =>
                params.value && params.value.toDate ? params.value.toDate().toLocaleDateString() : '',
        },
        {
            field: 'actions',
            headerName: 'إجراءات',
            width: 150,
            renderCell: (params) => (
                <Box sx={{ display: 'flex', gap: 0.5 }}>
                    <Tooltip title="تعديل الطلب">
                        <IconButton
                            aria-label="edit"
                            size="small"
                            onClick={() => handleEditClick(params.row)}
                        >
                            <EditIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="حذف الطلب">
                        <IconButton
                            aria-label="delete"
                            size="small"
                            onClick={() => dispatch(deleteFinancialRequest(params.row.id))}
                            color="error"
                        >
                            <DeleteIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                </Box>
            ),
            sortable: false,
            filterable: false,
        },
    ];

    return (
        <Box sx={{ p: 2, textAlign: "left" }}>
            <Typography variant="h4" gutterBottom>
                طلبات التمويل
            </Typography>
            <Paper dir="rtl" sx={{ p: 2, borderRadius: 2, minHeight: 400, textAlign: "right" }}>
                {error && <Alert severity="error">{error}</Alert>}
                <div style={{ height: 500, width: '100%' }}>
                    <DataGrid
                        rows={financingRequests.filter(request => request.id !== null && request.id !== undefined)}
                        columns={columns}
                        loading={loading}
                        pageSizeOptions={[5, 10, 20]}
                        getRowId={(row) => row.id || `temp-${Math.random()}`}
                        disableRowSelectionOnClick
                        localeText={{
                            MuiTablePagination: {
                                labelRowsPerPage: 'صفوف لكل صفحة:',
                                labelDisplayedRows: ({ from, to, count }) =>
                                    `${from}-${to} من ${count !== -1 ? count : `أكثر من ${to}`}`,
                            },
                            columnMenuUnsort: "إلغاء الفرز",
                            columnMenuSortAsc: "الفرز تصاعديا",
                            columnMenuSortDesc: "الفرز تنازليا",
                            columnMenuFilter: "تصفية",
                            columnMenuHideColumn: "إخفاء العمود",
                            columnMenuShowColumns: "إظهار الأعمدة",
                            filterPanelOperators: "العوامل",
                            filterPanelColumns: "الأعمدة",
                            filterPanelInputLabel: "القيمة",
                            filterPanelLogicOperator: "المنطق",
                            filterPanelOperatorAnd: "و",
                            filterPanelOperatorOr: "أو",
                            filterPanelOperatorContains: "يحتوي على",
                            filterPanelOperatorEquals: "يساوي",
                            filterPanelOperatorStartsWith: "يبدأ بـ",
                            filterPanelOperatorEndsWith: "ينتهي بـ",
                            filterPanelOperatorIsEmpty: "فارغ",
                            filterPanelOperatorIsNotEmpty: "ليس فارغا",
                            filterPanelOperatorIsAnyOf: "أي من",
                            noRowsLabel: "لا توجد طلبات تمويل.",
                            noResultsOverlayLabel: "لم يتم العثور على نتائج.",
                        }}
                        showToolbar
                    />
                </div>
                {/* Edit Dialog */}
                <Dialog open={editDialogOpen} onClose={handleEditCancel}>
                    <DialogTitle>تعديل الطلب</DialogTitle>
                    <DialogContent>
                        <TextField
                            label="المبلغ المطلوب"
                            fullWidth
                            margin="normal"
                            value={editAmount}
                            onChange={(e) => setEditAmount(e.target.value)}
                        />
                        <TextField
                            label="الحالة"
                            fullWidth
                            margin="normal"
                            value={editStatus}
                            onChange={(e) => setEditStatus(e.target.value)}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleEditCancel}>إلغاء</Button>
                        <Button onClick={handleEditSave} variant="contained" color="primary">حفظ</Button>
                    </DialogActions>
                </Dialog>
                {/* Delete Confirmation Dialog */}
                <Dialog
                    open={openDeleteDialog}
                    onClose={() => setOpenDeleteDialog(false)}
                    aria-labelledby="delete-dialog-title"
                    aria-describedby="delete-dialog-description"
                    dir="rtl"
                >
                    <DialogTitle id="delete-dialog-title">{"تأكيد الحذف"}</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="delete-dialog-description">
                            هل أنت متأكد أنك تريد حذف الطلب: "{rowToDelete?.id}"؟
                            هذا الإجراء لا يمكن التراجع عنه.
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenDeleteDialog(false)} color="primary">
                            إلغاء
                        </Button>
                        <Button onClick={handleConfirmDelete} color="error" autoFocus>
                            حذف
                        </Button>
                    </DialogActions>
                </Dialog>
                {/* Snackbar for Notifications */}
                <Snackbar
                    open={snackbar.open || (loading === 'failed' && !!error)} // Show error Snackbar if fetch failed
                    autoHideDuration={6000}
                    onClose={handleSnackbarClose}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                >
                    <Alert onClose={handleSnackbarClose} severity={snackbar.severity || 'error'} sx={{ width: '100%' }}>
                        {snackbar.message || error}
                    </Alert>
                </Snackbar>
            </Paper>
        </Box>
    );
}

function SalesPage() {
    return (
        <Box sx={{ p: 2, textAlign: 'left' }}>
            <Typography variant="h4" gutterBottom>Sales Reports</Typography>
            <Paper dir="rtl" sx={{ p: 2, borderRadius: 2, minHeight: 300, textAlign: 'right' }}>
                <Typography variant="h6" color="text.secondary">Sales data visualization (placeholder)</Typography>
                <Box sx={{ mt: 2, p: 2, border: '1px dashed #ccc', borderRadius: 1, textAlign: 'right' }}>
                    <Typography variant="body1" color="text.secondary">
                        This section could feature various charts (line, bar, pie) showing sales trends,
                        revenue by product, or regional sales performance.
                    </Typography>
                </Box>
            </Paper>
        </Box>
    );
}

function TrafficPage() {
    return (
        <Box sx={{ p: 2, textAlign: 'right' }}>
            <Typography variant="h4" gutterBottom>Traffic Reports</Typography>
            <Paper sx={{ p: 2, borderRadius: 2, minHeight: 300, textAlign: 'right' }}>
                <Typography variant="h6" color="text.secondary">Website traffic analytics (placeholder)</Typography>
                <Box sx={{ mt: 2, p: 2, border: '1px dashed #ccc', borderRadius: 1, textAlign: 'right' }}>
                    <Typography variant="body1" color="text.secondary">
                        This section might display data on website visits, unique users, page views,
                        bounce rate, and traffic sources using charts and metrics.
                    </Typography>
                </Box>
            </Paper>
        </Box>
    );
}

function IntegrationsPage() {
    return (
        <Box sx={{ p: 2, textAlign: 'right' }}>
            <Typography variant="h4" gutterBottom>Integrations</Typography>
            <Paper sx={{ p: 2, borderRadius: 2, minHeight: 200, textAlign: 'right' }}>
                <Typography variant="h6" color="text.secondary">Manage external service integrations (placeholder)</Typography>
                <Box sx={{ mt: 2, p: 2, border: '1px dashed #ccc', borderRadius: 1, textAlign: 'right' }}>
                    <Typography variant="body1" color="text.secondary">
                        This page could list various integrations (e.g., payment gateways, CRM, marketing tools)
                        with options to connect or configure them.
                    </Typography>
                </Box>
            </Paper>
        </Box>
    );
}

function useDemoRouter(initialPath) {
    const [pathname, setPathname] = React.useState(initialPath);

    const router = React.useMemo(() => {
        return {
            pathname,
            searchParams: new URLSearchParams(),
            navigate: (path) => setPathname(String(path)),
        };
    }, [pathname]);

    return router;
}

export default function AdminDashboard(props) {
    const { window } = props;
    const [open, setOpen] = React.useState(true);
    const [openReports, setOpenReports] = React.useState(false);
    const [mode, setMode] = React.useState('light');
    const userProfile = useSelector((state) => state.user.profile);
    const authUid = useSelector((state) => state.auth.uid);
    const userProfileStatus = useSelector((state) => state.user.status);

    const theme = React.useMemo(
        () =>
            createTheme({
                direction: 'rtl',
                palette: {
                    mode,
                    primary: {
                        main: '#6E00FE',
                    },
                    secondary: {
                        main: '#dc004e',
                    },
                    background: {
                        default: mode === 'light' ? '#f4f6f8' : '#121212',
                        paper: mode === 'light' ? '#ffffff' : '#1e1e1e',
                    },
                },
                typography: {
                    fontFamily: 'Inter, Arial, sans-serif',
                },
                shape: {
                    borderRadius: 8,
                },
                components: {
                    MuiPaper: {
                        styleOverrides: {
                            root: {
                                boxShadow: mode === 'light' ? '0px 2px 10px rgba(0, 0, 0, 0.05)' : '0px 2px 10px rgba(0, 0, 0, 0.4)',
                            },
                        },
                    },
                    MuiButton: {
                        styleOverrides: {
                            root: {
                                borderRadius: 8,
                            },
                        },
                    },
                },
                breakpoints: {
                    values: {
                        xs: 0,
                        sm: 600,
                        md: 900,
                        lg: 1200,
                        xl: 1536,
                    },
                },
            }),
        [mode]
    );

    const colorMode = React.useMemo(
        () => ({
            toggleColorMode: () => {
                setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
            },
        }),
        []
    );

    const router = useDemoRouter('/profile');
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Effect to fetch user profile when component mounts or authUid changes
    useEffect(() => {
        const loadUserProfile = async () => {
            // Ensure authUid is a valid string before fetching
            const actualUid = typeof authUid === 'object' && authUid !== null
                ? authUid.uid
                : authUid;

            console.log("AdminDashboard: useEffect triggered. actualUid:", actualUid, "userProfileStatus:", userProfileStatus, "userProfile:", userProfile);

            // Fetch if UID is available AND (not already loading AND (profile is missing OR admin name is missing))
            if (
                typeof actualUid === 'string' && actualUid.trim() !== '' &&
                userProfileStatus !== 'loading' &&
                (!userProfile || !userProfile.adm_name)
            ) {
                try {
                    console.log("AdminDashboard: Dispatching fetchUserProfile for UID:", actualUid);
                    await dispatch(fetchUserProfile(actualUid));
                    console.log("AdminDashboard: fetchUserProfile dispatched successfully.");
                } catch (error) {
                    console.error("AdminDashboard: Failed to fetch user profile (caught error):", error);
                    // Handle error, e.g., show a snackbar
                }
            } else if (userProfileStatus === 'succeeded' && userProfile && userProfile.adm_name) {
                console.log("AdminDashboard: User profile succeeded and admin name is present:", userProfile.adm_name);
            } else if (userProfileStatus === 'loading') {
                console.log("AdminDashboard: User profile is currently loading...");
            }
        };
        loadUserProfile();
    }, [authUid, userProfile, userProfileStatus, dispatch]);
    const handleDrawerToggle = () => {
        setOpen(!open);
    };

    const handleReportsClick = () => {
        setOpenReports(!openReports);
    };

    const handleLogout = async () => {
        console.log('جارى تسجيل الخروج');
        try {
            await signOut(auth); // Sign out from Firebase
            dispatch(logout()); // Dispatch Redux logout action to clear state
            setTimeout(() => {
                navigate('/login'); // Redirect to login page
            }, 2000);
            console.log('تم تسجيل الخروج بنجاح.');
        } catch (error) {
            console.error('خطأ في تسجيل الخروج:', error);
            // You might want to show a Snackbar or Alert here for the user
        }
    };

    const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
        ({ theme, open }) => ({
            flexGrow: 1,
            overflow: 'auto',
            padding: theme.spacing(2),
            transition: theme.transitions.create('margin', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
            }),
            marginRight: open ? theme.spacing(2) + drawerWidth : closedDrawerWidth,
            [theme.breakpoints.down('sm')]: {
                marginRight: 0,
                paddingRight: theme.spacing(2),
                paddingLeft: theme.spacing(2),
            },
        })
    );

    const AppBarStyled = styled(AppBar, { shouldForwardProp: (prop) => prop !== 'open' })(
        ({ theme, open }) => ({
            transition: theme.transitions.create(['margin', 'width'], {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
            }),
            width: `calc(100% - ${open ? theme.spacing(2) + drawerWidth : closedDrawerWidth}px)`,
            marginLeft: open ? theme.spacing(2) + drawerWidth : closedDrawerWidth,
            [theme.breakpoints.down('sm')]: {
                width: '100%',
                marginLeft: 0,
            },
        })
    );

    const DrawerHeader = styled('div')(({ theme }) => ({
        display: 'flex',
        alignItems: 'center',
        padding: theme.spacing(0, 1),
        ...theme.mixins.toolbar,
        justifyContent: 'flex-start',
    }));

    let currentPageContent;
    switch (router.pathname) {
        case '/dashboard':
            currentPageContent = <DashboardPage />;
            break;
        case '/profile':
            currentPageContent = <ProfilePage />;
            break;
        case '/users':
            currentPageContent = <UsersPage />;
            break;
        case '/properties':
            currentPageContent = <PropertiesPage />;
            break;
        case '/mainadvertisment':
            currentPageContent = <Mainadvertisment />;
            break;
        case '/paidadvertisment':
            currentPageContent = <PaidAdvertismentPage />;
            break;
        case '/clientadvertisment':
            currentPageContent = <ClientAdvertismentPage />;
            break;
        case '/orders':
            currentPageContent = <OrdersPage />;
            break;
        case '/reports/sales':
            currentPageContent = <SalesPage />;
            break;
        case '/reports/traffic':
            currentPageContent = <TrafficPage />;
            break;
        case '/integrations':
            currentPageContent = <IntegrationsPage />;
            break;
        default:
            currentPageContent = (
                <Box sx={{ p: 2, textAlign: 'right' }}>
                    <Typography variant="h5" color="error">لا يوجد صفحة للعرض</Typography>
                    <Typography variant="body1">الصفحة المطلوبة  "{router.pathname}" غير موجودة</Typography>
                </Box>
            );
            break;
    }
    const userName = userProfile?.adm_name || userProfile?.cli_name || userProfile?.org_name || 'Admin';
    console.log("AdminDashboard: userProfile in render:", userProfile);
    console.log("AdminDashboard: displayName in render:", userName);
    return (
        <StyledEngineProvider injectFirst>
            <CacheProvider value={cacheRtl}>
                <ColorModeContext.Provider value={colorMode}>
                    <ThemeProvider theme={theme}>
                        <Box sx={{ display: 'flex', flexDirection: 'row-reverse' }}>
                            <CssBaseline />
                            <AppBarStyled position="fixed" open={open}>
                                <Toolbar sx={{ flexDirection: 'row-reverse' }}>
                                    {!open && (
                                        <img
                                            src="./logo.png"
                                            alt="App Logo"
                                            style={{ height: 60, marginRight: 8, scale: 3 }}
                                        />
                                    )}
                                    <Box sx={{ flexGrow: 1 }} />
                                    <IconButton sx={{ mr: 1 }} onClick={colorMode.toggleColorMode} color="inherit">
                                        {theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
                                    </IconButton>
                                    <Button
                                        variant="outlined"
                                        color="inherit"
                                        onClick={handleLogout}
                                        endIcon={<LogoutIcon />}
                                        sx={{ mr: 2, borderRadius: 2, direction: 'ltr' }}
                                    >
                                        تسجيل الخروج
                                    </Button>
                                </Toolbar>
                            </AppBarStyled>

                            <Drawer
                                variant="permanent"
                                sx={{
                                    width: open ? drawerWidth : closedDrawerWidth,
                                    flexShrink: 0,
                                    whiteSpace: 'nowrap',
                                    boxSizing: 'border-box',
                                    transition: theme.transitions.create('width', {
                                        easing: theme.transitions.easing.sharp,
                                        duration: theme.transitions.duration.enteringScreen,
                                    }),
                                    '& .MuiDrawer-paper': {
                                        width: open ? drawerWidth : closedDrawerWidth,
                                        boxSizing: 'border-box',
                                        borderRadius: '8px 0 0 8px',
                                        overflowX: 'hidden',
                                        transition: theme.transitions.create('width', {
                                            easing: theme.transitions.easing.sharp,
                                            duration: theme.transitions.duration.enteringScreen,
                                        }),
                                    },
                                }}
                                anchor="left"
                                open={open}
                            >
                                <DrawerHeader>
                                    {open && (
                                        <Box sx={{ flexGrow: 1, textAlign: 'center' }}>
                                            <img
                                                src="./logo.png"
                                                alt="App Logo"
                                                style={{ height: 60, scale: 2 }}
                                            />
                                        </Box>
                                    )}
                                    <IconButton onClick={handleDrawerToggle}>
                                        {open ? <ChevronRightIcon /> : <MenuIcon />}
                                    </IconButton>
                                </DrawerHeader>
                                <Divider />
                                {open && (
                                    <Box sx={{ my: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', p: 2 }}>
                                        <Avatar
                                            alt="Admin User"
                                            src={userProfile?.image || './admin.jpg'}
                                            sx={{ width: 80, height: 80, mb: 1, boxShadow: '0px 0px 8px rgba(0,0,0,0.2)' }}
                                        />
                                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                            Hello, {userName}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            مرحباً بك في لوحة التحكم
                                        </Typography>
                                    </Box>
                                )}
                                {open && <Divider sx={{ mb: 2 }} />}
                                <List>
                                    {NAVIGATION.map((item) => {
                                        if (item.kind === 'header') {
                                            return open ? (
                                                <List key={item.title} component="nav" sx={{ px: 2, pt: 2, display: 'flex', flexDirection: 'row-reverse' }}>
                                                    <Typography variant="overline" color="text.secondary" sx={{ textTransform: 'uppercase', fontWeight: 'bold', fontSize: 18, textAlign: 'right' }} >
                                                        {item.title}
                                                    </Typography>
                                                </List>
                                            ) : null;
                                        }
                                        if (item.kind === 'divider') {
                                            return <Divider key={`divider-${item.kind}`} sx={{ my: 1 }} />;
                                        }
                                        if (item.children) {
                                            const isOpen = item.segment === 'reports' ? openReports : false;
                                            return (
                                                <React.Fragment key={item.segment}>
                                                    <Tooltip title={item.tooltip} placment='top'>
                                                        <ListItemButton
                                                            dir='rtl'
                                                            onClick={open ? handleReportsClick : () => setOpen(true)}
                                                            sx={{
                                                                borderRadius: 2,
                                                                mx: 1,
                                                                justifyContent: open ? 'initial' : 'center',
                                                                px: 2.5,
                                                                '&.Mui-selected': { backgroundColor: 'action.selected' },
                                                            }}
                                                        >
                                                            <ListItemIcon sx={{ minWidth: 0, ml: open ? 3 : 'auto', justifyContent: 'center' }}>
                                                                {item.icon}
                                                            </ListItemIcon>
                                                            {open && <ListItemText primary={item.title} sx={{ opacity: open ? 1 : 0, textAlign: 'left', pl: 2 }} />}
                                                            {open && (isOpen ? <ExpandLess /> : <ExpandMore />)}
                                                        </ListItemButton>
                                                    </Tooltip>
                                                    <Collapse in={isOpen && open} timeout="auto" unmountOnExit>
                                                        <List component="div" disablePadding >
                                                            {item.children.map((child) => (
                                                                <Tooltip title={child.tooltip} key={child.segment}>
                                                                    <ListItem key={child.segment} disablePadding>
                                                                        <ListItemButton
                                                                            selected={router.pathname === `/reports/${child.segment}`}
                                                                            onClick={() => router.navigate(`/reports/${child.segment}`)}
                                                                            sx={{
                                                                                pr: open ? 4 : 2.5,
                                                                                borderRadius: 2,
                                                                                mx: 1,
                                                                                justifyContent: open ? 'initial' : 'center',
                                                                            }}
                                                                        >
                                                                            <ListItemIcon sx={{ minWidth: 0, ml: open ? 3 : 'auto', justifyContent: 'center' }}>
                                                                                {child.icon}
                                                                            </ListItemIcon>
                                                                            {open && <ListItemText primary={child.title} sx={{ opacity: open ? 1 : 0, textAlign: 'right' }} />}
                                                                        </ListItemButton>
                                                                    </ListItem>
                                                                </Tooltip>
                                                            ))}
                                                        </List>
                                                    </Collapse>
                                                </React.Fragment>
                                            );
                                        }
                                        return (
                                            <Tooltip title={item.tooltip} placement='right-end'>
                                                <ListItem key={item.segment} disablePadding dir='rtl'>
                                                    <ListItemButton
                                                        selected={router.pathname === `/${item.segment}`}
                                                        onClick={() => router.navigate(`/${item.segment}`)}
                                                        sx={{
                                                            borderRadius: 2,
                                                            mx: 1,
                                                            justifyContent: open ? 'initial' : 'center',
                                                            px: 2.5,
                                                            '&.Mui-selected': { backgroundColor: 'action.selected' },
                                                        }}
                                                    >
                                                        <ListItemIcon sx={{ minWidth: 0, ml: open ? 3 : 'auto', justifyContent: 'center', }}>
                                                            {item.icon}
                                                        </ListItemIcon>
                                                        {open && <ListItemText primary={item.title} sx={{ opacity: open ? 1 : 0, textAlign: 'left', pl: 2 }} />}
                                                    </ListItemButton>
                                                </ListItem>
                                            </Tooltip>
                                        );
                                    })}
                                </List>
                            </Drawer>
                            <Main open={open}>
                                <DrawerHeader />
                                {currentPageContent}
                            </Main>
                        </Box>
                    </ThemeProvider>
                </ColorModeContext.Provider>
            </CacheProvider>
        </StyledEngineProvider>
    );
}