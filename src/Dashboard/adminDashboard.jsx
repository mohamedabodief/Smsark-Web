import * as React from 'react';
import { useState, useEffect, useMemo , useRef } from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { createTheme, ThemeProvider, styled, useTheme as useMuiTheme } from '@mui/material/styles';
import { db } from '../FireBase/firebaseConfig';
import { getStorage, ref, listAll, getDownloadURL } from 'firebase/storage';

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
    Chip,
    Stack,
    Card,
    CardContent,
    Popover,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    useMediaQuery
} from '@mui/material';
import PeopleIcon from '@mui/icons-material/People'; // Icon for Users
import BusinessIcon from '@mui/icons-material/Business'; // Icon for Organizations
import CampaignIcon from '@mui/icons-material/Campaign'; // Icon for Ads
import RequestQuoteIcon from '@mui/icons-material/RequestQuote'; // Icon for Financial Requests
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'; // Icon for Revenue
import LocationOnIcon from '@mui/icons-material/LocationOn'; // Icon for Geographic
import MenuIcon from '@mui/icons-material/Menu';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import DashboardIcon from '@mui/icons-material/Dashboard';
import GroupIcon from '@mui/icons-material/Group';
import HomeIcon from '@mui/icons-material/Home';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import SupervisedUserCircleIcon from '@mui/icons-material/SupervisedUserCircle';
import BarChartIcon from '@mui/icons-material/BarChart';
import AnalyticsIcon from '@mui/icons-material/Analytics';
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
import { performLogout } from '../utils/logoutUtils';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ApprovalIcon from '@mui/icons-material/Approval';
import DoNotDisturbOnIcon from '@mui/icons-material/DoNotDisturbOn';
import PendingIcon from '@mui/icons-material/Pending';
import CloseIcon from '@mui/icons-material/Close';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import rtlPlugin from 'stylis-plugin-rtl';
import { StyledEngineProvider } from '@mui/material/styles';

import { DataGrid } from '@mui/x-data-grid';
import { Link } from '@mui/material';
import { PieChart } from '@mui/x-charts/PieChart';

import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import BlockIcon from '@mui/icons-material/Block';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

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
import ClientAdvertisement from '../FireBase/modelsWithOperations/ClientAdvertisemen';
import NotificationList from '../pages/notificationList';
import Notification from '../FireBase/MessageAndNotification/Notification';
import NotificationsIcon from '@mui/icons-material/Notifications';
import Badge from '@mui/material/Badge';

import {
    setDeveloperAds, setFunderAds,
    setLoadingDeveloper, setLoadingFunder,
    setErrorDeveloper, setErrorFunder,
    deleteAd, toggleAdStatus,
    approveAd, rejectAd, returnAdToPending
} from '../reduxToolkit/slice/paidAdsSlice';
import FinancingAdvertisement from '../FireBase/modelsWithOperations/FinancingAdvertisement';
import RealEstateDeveloperAdvertisement from '../FireBase/modelsWithOperations/RealEstateDeveloperAdvertisement';
import { useNavigate } from 'react-router-dom';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import InputAdornment from '@mui/material/InputAdornment';
import PageHeader from '../componenents/PageHeader';
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
    deleteClientAsync,
    deleteOrganizationAsync,
} from '../reduxToolkit/slice/adminUsersSlice';

import { fetchUserProfile, updateUserProfile, uploadAndSaveProfileImage, clearProfile } from "../LoginAndRegister/featuresLR/userSlice";
import sendResetPasswordEmail from "../FireBase/authService/sendResetPasswordEmail";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { fetchFinancialRequests, deleteFinancialRequest, updateFinancialRequest } from '../reduxToolkit/slice/financialRequestSlice';
import FinancingRequest from '../FireBase/modelsWithOperations/FinancingRequest';
import User from '../FireBase/modelsWithOperations/User';
import {
    fetchAllHomepageAds,
    subscribeToAllHomepageAds,
    createHomepageAd,
    updateHomepageAd,
    deleteHomepageAd,
    approveHomepageAd,
    rejectHomepageAd,
    returnHomepageAdToPending,
    activateHomepageAd,
    deactivateHomepageAd
} from '../feature/ads/homepageAdsSlice';
import subscriptionManager from '../utils/subscriptionManager';
import AddHomepageAdModal from './adminDashboard/AddHomepageAdModal';
import EditHomepageAdModal from './adminDashboard/EditHomepageAdModal';
import RejectionReasonModal from './organization/modals/RejectionReasonModal';
import Analytics from '../pages/Analytics';
import { useTheme } from '../context/ThemeContext';
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
        segment: 'analytics',
        title: 'التحليلات',
        icon: <AnalyticsIcon />,
        tooltip: 'التحليلات',
    },
    // {
    //     segment: 'reports',
    //     title: 'التقارير',
    //     icon: <BarChartIcon />,
    //     tooltip: 'التقارير',
    //     children: [
    //         {
    //             segment: 'reports',
    //             title: 'التقارير',
    //             icon: <DescriptionIcon />,
    //             tooltip: 'التقارير',
    //         },
    //         {
    //             segment: 'analytics',
    //             title: 'التحليلات والتقارير',
    //             icon: <AnalyticsIcon />,
    //             tooltip: 'التحليلات والتقارير',
    //         },
    //     ],
    // },
];

// Removed ThemeContext import

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


function ConfirmDeleteModal({ open, onClose, onConfirm, itemType, itemId, itemName }) {
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle sx={{ textAlign: 'left' }}>تأكيد الحذف</DialogTitle>
            <DialogContent sx={{ textAlign: 'right' }}>
                <Typography dir="rtl">
                    هل أنت متأكد من حذف {itemType}: <strong>{itemName || 'null'} (ID: {itemId})</strong> ؟
                </Typography>
                <Typography dir="rtl" color="error">لا يمكن التراجع عن هذه الإجراء.</Typography>
            </DialogContent>
            <DialogActions sx={{ flexDirection: 'row-reverse' }}>
                <Button onClick={onConfirm} variant="contained" color="error">
                    حذف
                </Button>
                <Button variant="contained" onClick={onClose}>إلغاء</Button>
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
                await dispatch(addAdmin({
                    email: adminData.email,
                    password: adminData.password,
                    adm_name: adminData.adm_name,
                    phone: adminData.phone,
                    gender: adminData.gender,
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

    const [nameError, setNameError] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(false); // New loading state

    React.useEffect(() => {
        if (admin) {
            setName(admin.adm_name || '');
            setPhone(admin.phone || '');
            setGender(admin.gender || '');
            setNameError(false);
            setIsLoading(false);
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



        // Add validation for phone if needed
        if (!phone.trim()) {
            hasError = true;
        }
        if (!hasError) {
            setIsLoading(true); // Set loading true
            try {
                // Dispatch the editAdmin thunk with only the fields from AdminUserData
                await dispatch(editAdmin({
                    uid: admin.uid,
                    adm_name: name,
                    phone: phone,
                    gender: gender,
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


// function DashboardPage() {
//     return (
//         <Box sx={{ p: 2, textAlign: 'right' }}>
//             <PageHeader
//                 title="لوحة التحكم"
//                 icon={DashboardIcon}
//                 showCount={false}
//             />
//             <Grid container spacing={3} direction="row-reverse">
//                 <Grid size={{ xs: 12, sm: 6, md: 4 }}>
//                     <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 140, borderRadius: 2, textAlign: 'right' }}>
//                         <Typography variant="h6" color="text.secondary">Total Sales</Typography>
//                         <Typography variant="h5" sx={{ mt: 1, fontWeight: 'bold', color: 'primary.main' }}>$12,345.00</Typography>
//                         <Typography variant="body2" color="success.main">+15% since last month</Typography>
//                     </Paper>
//                 </Grid>
//                 <Grid size={{ xs: 12, sm: 6, md: 4 }}>
//                     <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 140, borderRadius: 2, textAlign: 'right' }}>
//                         <Typography variant="h6" color="text.secondary">New Orders</Typography>
//                         <Typography variant="h5" sx={{ mt: 1, fontWeight: 'bold', color: 'secondary.main' }}>245</Typography>
//                         <Typography variant="body2" color="error.main">-5% since last month</Typography>
//                     </Paper>
//                 </Grid>
//                 <Grid size={{ xs: 12, sm: 6, md: 4 }}>
//                     <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 140, borderRadius: 2, textAlign: 'right' }}>
//                         <Typography variant="h6" color="text.secondary">Customers</Typography>
//                         <Typography variant="h5" sx={{ mt: 1, fontWeight: 'bold' }}>1,234</Typography>
//                         <Typography variant="body2" color="success.main">+2% since last month</Typography>
//                     </Paper>
//                 </Grid>
//                 <Grid size={{ xs: 12 }}>
//                     <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', borderRadius: 2, height: 300, textAlign: 'right' }}>
//                         <Typography variant="h6">Sales Trend (Placeholder)</Typography>
//                         <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
//                             <Typography variant="body1" color="text.secondary">Chart would go here</Typography>
//                         </Box>
//                     </Paper>
//                 </Grid>
//             </Grid>
//         </Box>
//     );
// }


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
    const [saving, setSaving] = useState(false);


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
        if (saving) return; // guard against double clicks
        setSaving(true);
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
        finally {
            setSaving(false);
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

    // Only show full-screen loader on the very first profile fetch, not during updates
    const profileInitialLoadDoneRef = React.useRef(false);
    React.useEffect(() => {
        if (userProfileStatus === "succeeded" && userProfile) {
            profileInitialLoadDoneRef.current = true;
        }
    }, [userProfileStatus, userProfile]);
    const isInitialProfileLoading = userProfileStatus === "loading" && !profileInitialLoadDoneRef.current;

    // Loading and Error states
    if (isInitialProfileLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
                <Typography sx={{ ml: 2 }}>جارٍ تحميل الملف الشخصي...</Typography>
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
                <Alert severity="error">خطأ في تحميل الملف الشخصي: {userProfileError || "Unknown error."}</Alert>
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
        <Box dir='rtl' sx={{ p: 2, textAlign: 'left' }}>
            <PageHeader
                title={"حسابي"}
                icon={AccountBoxIcon}
            />
            <Paper sx={{ p: 4, borderRadius: 2, minHeight: 400, boxShadow: '0px 0px 8px rgba(0,0,0,0.2)' }}>
                <Grid container spacing={4} >
                    <Grid size={{ xs: 12, md: 4, lg: 3 }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                            <UploadAvatars />
                        </Box>
                    </Grid>
                    <Grid size={{ xs: 12, md: 8, lg: 9 }}>
                        <Box >
                            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', fontSize: '1.5rem', display: 'flex', flexDirection: 'row' }}>المعلومات الشخصية</Typography>

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

                            {/* Phone Number and Email in separate rows */}
                            <Grid container spacing={2}>
                                <Grid size={{ xs: 12 }}>
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
                                </Grid>
                                <Grid size={{ xs: 12 }}>
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
                                </Grid>
                            </Grid>
                            {/* Password field with reset button */}
                            <Box dir='rtl' sx={{ display: 'flex', gap: 2, alignItems: 'flex-end' }}>
                            {/* <TextField
                                label="كلمة المرور"
                                fullWidth
                                margin="normal"
                                type="password"
                                placeholder="******"
                                InputProps={{ style: { direction: 'ltr' } }}
                                disabled
                                    sx={{ flexGrow: 1 }}
                                /> */}
                                <Button
                                    variant="outlined"
                                    color="primary"
                                    onClick={handleResetPassword}
                                    disabled={resetPasswordLoading}
                                    sx={{ m: 1, minWidth: 120 }}

                                >
                                    {resetPasswordLoading ? (
                                        <CircularProgress size={20} color="inherit" />
                                    ) : (
                                        "إعادة تعيين كلمة المرور"
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

                            <Button variant="contained" color="primary" onClick={handleSave} disabled={saving} sx={{ marginTop: 2, fontSize: '1.2rem', minWidth: 160, position: 'relative' }}>
                                حفظ التغييرات
                                {saving && (
                                    <CircularProgress size={20} color="inherit" sx={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)' }} />
                                )}

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

// Tax Card Thumbnail Component
function TaxCardThumbnail({ userId, onTaxCardClick }) {
    const [thumbnailUrl, setThumbnailUrl] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const fetchThumbnail = async () => {
            try {
                setLoading(true);
                setError(false);

                const storage = getStorage();
                const folderRef = ref(storage, `tax_card_images/${userId}`);
                const listRes = await listAll(folderRef);

                if (listRes.items.length > 0) {
                    // Get the first image as thumbnail
                    const firstImageUrl = await getDownloadURL(listRes.items[0]);
                    setThumbnailUrl(firstImageUrl);
                } else {
                    setThumbnailUrl(null);
                }
            } catch (err) {
                console.error('Error fetching tax card thumbnail:', err);
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        if (userId) {
            fetchThumbnail();
        }
    }, [userId]);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 40 }}>
                <CircularProgress size={20} />
            </Box>
        );
    }

    if (error || !thumbnailUrl) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <Tooltip title='لا توجد صور للسجل الضريبي'>
                    <Box sx={{
                        width: 40,
                        height: 40,
                        borderRadius: 1,
                        border: '2px dashed #ccc',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'text.disabled'
                    }}>
                        <Typography variant="caption">لا يوجد</Typography>
                    </Box>
                </Tooltip>
            </Box>
        );
    }

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Tooltip title='انقر لعرض السجل الضريبي'>
                <Box
                    onClick={() => onTaxCardClick(userId)}
                    sx={{
                        width: 40,
                        height: 40,
                        borderRadius: 1,
                        overflow: 'hidden',
                        cursor: 'pointer',
                        border: '1px solid #ddd',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                            transform: 'scale(1.05)',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                        }
                    }}
                >
                    <img
                        src={thumbnailUrl}
                        alt="Tax card thumbnail"
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                        }}
                        onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.parentElement.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100%;color:#999;font-size:10px;">خطأ</div>';
                        }}
                    />
                </Box>
            </Tooltip>
        </Box>
    );
}

function UsersPage() {
    const dispatch = useDispatch();

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
    const [searchTerm, setSearchTerm] = useState('');

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

    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    // Tax card dialog state
    const [taxCardDialogOpen, setTaxCardDialogOpen] = useState(false);
    const [taxCardImages, setTaxCardImages] = useState([]);
    const [currentTaxImageIndex, setCurrentTaxImageIndex] = useState(0);
    const [taxImagesCache, setTaxImagesCache] = useState({}); // Cache for tax images from storage

    // Responsiveness hook
    const theme = useMuiTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    useEffect(() => {
        if (activeTab === 'users' && (clientsStatus === 'idle' || clientsStatus === 'failed')) {
            dispatch(fetchClients());
        } else if (activeTab === 'organizations' && (organizationsStatus === 'idle' || organizationsStatus === 'failed')) {
            dispatch(fetchOrganizations());
        } else if (activeTab === 'admins' && (adminsStatus === 'idle' || adminsStatus === 'failed')) {
            dispatch(fetchAdmins());
        }
    }, [activeTab, clientsStatus, organizationsStatus, adminsStatus, dispatch]);

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    // --- User Handlers ---
    const handleAddUser = () => {
        setIsAddUserModalOpen(true);
    };

    const handleAddUserConfirm = async ({ name, email, phone, gender }) => {
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


    // --- Organization (Developers and Funders) Handlers ---
    const handleAddOrg = () => {
        setIsAddOrgModalOpen(true);
    };

    const handleAddOrgConfirm = async ({ name, contact }) => {
        const orgType = activeOrgSubTab === 'developers' ? 'مطور عقاري' : 'ممول عقاري';
        try {
            await dispatch(addOrganization({
                org_name: name,
                contact_info: contact,
                type_of_organization: orgType,
                type_of_user: 'organization'
            })).unwrap();
            setSnackbar({ open: true, message: `تم إضافة ${orgType} بنجاح!`, severity: "success" });
        } catch (err) {
            console.error("Error adding organization:", err);
            setSnackbar({ open: true, message: `فشل إضافة ${orgType}: ${err.message || 'خطأ غير معروف'}`, severity: "error" });
        } finally {
            setIsAddOrgModalOpen(false);
        }
    };

    const realEstateDevelopers = organizations.filter(org => org.type_of_organization === 'مطور عقاري');
    const realEstateFunders = organizations.filter(org => org.type_of_organization === 'ممول عقاري');

    // --- Admin Handlers ---
    const handleAddAdmin = () => {
        setIsAddAdminModalOpen(true);
    };

    const handleEditAdmin = (admin) => {
        setAdminToEdit(admin);
        setIsEditAdminModalOpen(true);
    };

    // --- General Delete Handler ---
    const handleDeleteItem = (uid, type, name) => {
        setItemToDelete({ uid, type, name });
        setIsDeleteConfirmModalOpen(true);
    };

    const handleDeleteConfirm = async () => {
        try {
            if (itemToDelete.type === 'user') {
                await dispatch(deleteClientAsync(itemToDelete.uid)).unwrap();
                setSnackbar({ open: true, message: "تم حذف العميل بنجاح!", severity: "success" });
            } else if (itemToDelete.type === 'organization') {
                await dispatch(deleteOrganizationAsync(itemToDelete.uid)).unwrap();
                setSnackbar({ open: true, message: "تم حذف المؤسسة بنجاح!", severity: "success" });
            } else if (itemToDelete.type === 'admin') {
                await dispatch(deleteAdmin(itemToDelete.uid)).unwrap();
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

    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbar({ ...snackbar, open: false });
    };

    // Tax card handling functions
    const fetchTaxImagesFromStorage = async (userId) => {
        try {
            const storage = getStorage();
            const folderRef = ref(storage, `tax_card_images/${userId}`);
            const listRes = await listAll(folderRef);

            if (listRes.items.length === 0) {
                return [];
            }

            const urls = await Promise.all(
                listRes.items.map(item => getDownloadURL(item))
            );

            return urls;
        } catch (error) {
            console.error('Error fetching tax images from storage:', error);
            return [];
        }
    };

    const handleTaxCardClick = async (userId) => {
        try {
            // Check cache first
            if (taxImagesCache[userId]) {
                setTaxCardImages(taxImagesCache[userId]);
                setCurrentTaxImageIndex(0);
                setTaxCardDialogOpen(true);
                return;
            }

            // Fetch from storage
            const images = await fetchTaxImagesFromStorage(userId);

            // Update cache
            setTaxImagesCache(prev => ({
                ...prev,
                [userId]: images
            }));

            setTaxCardImages(images);
            setCurrentTaxImageIndex(0);
            setTaxCardDialogOpen(true);
        } catch (error) {
            console.error('Error handling tax card click:', error);
            setSnackbar({
                open: true,
                message: 'فشل في تحميل صور السجل الضريبي',
                severity: 'error'
            });
        }
    };

    const handleCloseTaxCardDialog = () => {
        setTaxCardDialogOpen(false);
        setTaxCardImages([]);
        setCurrentTaxImageIndex(0);
    };

    const handleNextTaxImage = () => {
        setCurrentTaxImageIndex((prev) =>
            prev < taxCardImages.length - 1 ? prev + 1 : 0
        );
    };

    const handlePrevTaxImage = () => {
        setCurrentTaxImageIndex((prev) =>
            prev > 0 ? prev - 1 : taxCardImages.length - 1
        );
    };

    // Helper to render lists based on status and search term
    const renderListContent = (data, status, error, type) => {
        if (status === 'loading') {
            return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
        }
        if (status === 'failed') {
            return <Alert severity="error" sx={{ mt: 2 }}>Error: {error}</Alert>;
        }
        if (!data) {
            return null;
        }

        const filteredData = data.filter(item => {
            const name = item.cli_name || item.org_name || item.adm_name;
            const email = item.email || '';
            return name?.toLowerCase().includes(searchTerm.toLowerCase()) || email?.toLowerCase().includes(searchTerm.toLowerCase());
        });

        if (filteredData.length === 0) {
            return <Typography sx={{ mt: 2, textAlign: 'center', color: 'text.secondary' }}>لا توجد نتائج مطابقة لبحثك.</Typography>;
        }

        const columns = type === 'organization' ? [
            { id: 'id', label: 'ID' },
            { id: 'name', label: 'الاسم' },
            { id: 'contact', label: 'معلومات التواصل' },
            { id: 'tax', label: 'السجل الضريبي' },
            { id: 'actions', label: 'الإجراءات' },
        ] : [
            { id: 'id', label: 'ID' },
            { id: 'name', label: 'الاسم' },
            { id: 'contact', label: 'معلومات التواصل' },
            { id: 'actions', label: 'الإجراءات' },
        ];

        return (
            <TableContainer sx={{
                overflowX: 'auto',
                border: '1px solid #ccc',
                borderRadius: '15px',
                '& .MuiTableCell-root': {
                    textAlign: 'center',
                    padding: '12px 16px',
                },
                '& .MuiTableHead-root .MuiTableCell-root': {
                    fontWeight: 'bold',
                    backgroundColor: (theme) => theme.palette.mode === 'light' ? '#f5f5f5' : '#1e1e1e',
                },
                '& .MuiTableRow-hover:hover': {
                    backgroundColor: (theme) => theme.palette.action.hover,
                }
            }}>
                <Table sx={{ tableLayout: 'fixed' }}>
                    <TableHead>
                        <TableRow>
                            {columns.map((column) => (
                                <TableCell
                                    key={column.id}
                                    sx={{ width: type === 'organization' ? '20%' : '33.33%' }}
                                >
                                    {column.label}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredData.map((item) => (
                            <TableRow
                                key={item.uid}
                                hover
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell sx={{ width: type === 'organization' ? '20%' : '25%' }}>
                                    <Typography variant="body1" noWrap>
                                        {item.uid}
                                    </Typography>
                                </TableCell>
                                <TableCell sx={{ width: type === 'organization' ? '20%' : '25%' }}>
                                    <Typography variant="body1" noWrap>
                                        {item.cli_name || item.org_name || item.adm_name}
                                    </Typography>
                                </TableCell>
                                <TableCell sx={{ width: type === 'organization' ? '20%' : '25%' }}>
                                    <Box sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'flex-start',
                                        gap: 0.5,
                                        minHeight: 48
                                    }}>
                                        {item.phone && (
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                <Typography variant="caption" color="text.disabled" sx={{ minWidth: 'fit-content', fontSize:"1rem" }}>
                                                    جوال:
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary" noWrap>
                                                    {item.phone}
                                                </Typography>
                                            </Box>
                                        )}
                                        {item.email && (
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                <Typography variant="caption" color="text.disabled" sx={{ minWidth: 'fit-content', fontSize:"1rem" }}>
                                                    إيميل:
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary" noWrap>
                                                    {item.email}
                                                </Typography>
                                            </Box>
                                        )}
                                        {!item.phone && !item.email && (
                                            <Typography variant="body2" color="text.disabled" sx={{ fontStyle: 'italic' }}>
                                                لا توجد معلومات اتصال
                                            </Typography>
                                        )}
                                    </Box>
                                </TableCell>
                                {type === 'organization' && (
                                    <TableCell sx={{ width: '20%' }}>
                                        <TaxCardThumbnail userId={item.uid} onTaxCardClick={handleTaxCardClick} />
                                    </TableCell>
                                )}
                                <TableCell sx={{ width: type === 'organization' ? '20%' : '25%' }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                        <Tooltip title='حذف'>
                                            <IconButton
                                                edge="start"
                                                aria-label="delete"
                                                onClick={() => handleDeleteItem(item.uid, type, item.cli_name || item.org_name || item.adm_name)}
                                                sx={{ color: 'error.main' }}
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </Tooltip>
                                    </Box>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        );
    };


    return (
        <Box dir={'rtl'} sx={{ p: 3, textAlign: 'right' }}>
            <PageHeader
                title="المستخدمين"
                icon={GroupIcon}
                showCount={false}
            />

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} sx={{ mb: 2 }}>
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
            </Stack>

            <Paper sx={{ p: { xs: 1, sm: 2 }, borderRadius: 2, minHeight: 400, textAlign: 'right' }}>
                {activeTab === 'users' && (
                    <>
                        <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems="center" mb={2} spacing={2}>
                            <Typography variant="h6" sx={{ fontWeight: 'bold' }} color="text.secondary">قائمة العملاء</Typography>
                            <Box sx={{ display: 'flex', gap: 1, width: { xs: '100%', sm: 'auto' } }}>
                                <TextField
                                    label="بحث بالاسم"
                                    variant="outlined"
                                    size="small"
                                    value={searchTerm}
                                    onChange={handleSearchChange}
                                    sx={{ width: { xs: '100%', sm: 300 } }}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <SearchIcon />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                                <Button variant="outlined" startIcon={<AddIcon />} onClick={handleAddUser}>
                                    إضافة عميل
                                </Button>
                            </Box>
                        </Stack>
                        {renderListContent(clients, clientsStatus, clientsError, 'user')}
                    </>
                )}

                {activeTab === 'organizations' && (
                    <>
                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} sx={{ mb: 2 }}>
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
                        </Stack>

                        {activeOrgSubTab === 'developers' && (
                            <>
                                <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems="center" mb={2} spacing={2}>
                                    <Typography variant="h6" color="text.secondary">قائمة المطورين العقاريين</Typography>
                                    <Box sx={{ display: 'flex', gap: 1, width: { xs: '100%', sm: 'auto' } }}>
                                        <TextField
                                            label="بحث بالاسم"
                                            variant="outlined"
                                            size="small"
                                            value={searchTerm}
                                            onChange={handleSearchChange}
                                            sx={{ width: { xs: '100%', sm: 300 } }}
                                            InputProps={{
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <SearchIcon />
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                        <Button variant="outlined" startIcon={<AddIcon />} onClick={handleAddOrg}>
                                            إضافة مطور عقاري
                                        </Button>
                                    </Box>
                                </Stack>
                                {renderListContent(realEstateDevelopers, organizationsStatus, organizationsError, 'organization')}
                            </>
                        )}

                        {activeOrgSubTab === 'funders' && (
                            <Box sx={{ mt: 2 }}>
                                <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems="center" mb={2} spacing={2}>
                                    <Typography variant="h6" color="text.secondary">قائمة الممولين العقاريين</Typography>
                                    <Box sx={{ display: 'flex', gap: 1, width: { xs: '100%', sm: 'auto' } }}>
                                        <TextField
                                            label="بحث بالاسم"
                                            variant="outlined"
                                            size="small"
                                            value={searchTerm}
                                            onChange={handleSearchChange}
                                            sx={{ width: { xs: '100%', sm: 300 } }}
                                            InputProps={{
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <SearchIcon />
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                        <Button variant="outlined" startIcon={<AddIcon />} onClick={handleAddOrg}>
                                            إضافة ممول عقاري
                                        </Button>
                                    </Box>
                                </Stack>
                                {renderListContent(realEstateFunders, organizationsStatus, organizationsError, 'organization')}
                            </Box>
                        )}
                    </>
                )}

                {activeTab === 'admins' && (
                    <>
                        <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems="center" mb={2} spacing={2}>
                            <Typography variant="h6" color="text.secondary">قائمة المدراء</Typography>
                            <Box sx={{ display: 'flex', gap: 1, width: { xs: '100%', sm: 'auto' } }}>
                                <TextField
                                    label="بحث بالاسم"
                                    variant="outlined"
                                    size="small"
                                    value={searchTerm}
                                    onChange={handleSearchChange}
                                    sx={{ width: { xs: '100%', sm: 300 } }}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <SearchIcon />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                                <Button variant="outlined" startIcon={<AddIcon />} onClick={handleAddAdmin}>
                                    إضافة مدير
                                </Button>
                            </Box>
                        </Stack>
                        {renderListContent(admins, adminsStatus, adminsError, 'admin')}
                    </>
                )}
            </Paper>

            {/* Modals */}
            <AddUserModal
                open={isAddUserModalOpen}
                onClose={() => setIsAddUserModalOpen(false)}
                onAdd={handleAddUserConfirm}
            />
            <ConfirmDeleteModal
                open={isDeleteConfirmModalOpen}
                onClose={() => setIsDeleteConfirmModalOpen(false)}
                onConfirm={handleDeleteConfirm}
                itemType={itemToDelete?.type}
                itemId={itemToDelete?.uid}
                itemName={itemToDelete?.name}
            />
            <AddOrgModal
                open={isAddOrgModalOpen}
                onClose={() => setIsAddOrgModalOpen(false)}
                onAdd={(data) => handleAddOrgConfirm({ ...data, type: activeOrgSubTab === 'developers' ? 'developer' : 'funder' })}
                orgType={activeOrgSubTab === 'developers' ? 'developer' : 'funder'}
            />
            <AddAdminModal
                open={isAddAdminModalOpen}
                onClose={() => setIsAddAdminModalOpen(false)}
                setSnackbar={setSnackbar}
            />
            {adminToEdit && (
                <EditAdminModal
                    open={isEditAdminModalOpen}
                    onClose={() => setIsEditAdminModalOpen(false)}
                    admin={adminToEdit}
                    setSnackbar={setSnackbar}
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

            {/* Tax Card Dialog */}
            <Dialog
                open={taxCardDialogOpen}
                onClose={handleCloseTaxCardDialog}
                maxWidth="md"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: 2,
                        maxHeight: '90vh'
                    }
                }}
            >
                <DialogTitle sx={{
                    textAlign: 'center',
                    borderBottom: '1px solid #e0e0e0',
                    pb: 2
                }}>
                    <Typography variant="h6" component="div">
                        السجل الضريبي
                    </Typography>
                </DialogTitle>
                <DialogContent sx={{ p: 3 }}>
                    {taxCardImages.length === 0 ? (
                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            minHeight: 200,
                            color: 'text.secondary'
                        }}>
                            <Typography variant="h6" sx={{ mb: 1 }}>
                                لا توجد صور للسجل الضريبي
                            </Typography>
                            <Typography variant="body2">
                                لم يتم رفع أي صور للسجل الضريبي لهذه المؤسسة
                            </Typography>
                        </Box>
                    ) : (
                        <Box>
                            {/* Main Image Display */}
                            <Box sx={{
                                width: '100%',
                                height: 400,
                                borderRadius: 2,
                                overflow: 'hidden',
                                border: '1px solid #e0e0e0',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: '#f5f5f5',
                                mb: 2
                            }}>
                                <img
                                    src={taxCardImages[currentTaxImageIndex]}
                                    alt={`Tax card ${currentTaxImageIndex + 1}`}
                                    style={{
                                        maxWidth: '100%',
                                        maxHeight: '100%',
                                        objectFit: 'contain'
                                    }}
                                    onError={(e) => {
                                        e.currentTarget.src = 'https://placehold.co/400x300/E0E0E0/7D7D7D?text=Image+Not+Available';
                                    }}
                                />
                            </Box>

                            {/* Navigation Controls */}
                            {taxCardImages.length > 1 && (
                                <Box sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    mb: 2
                                }}>
                                    <Button
                                        variant="outlined"
                                        onClick={handlePrevTaxImage}
                                        disabled={taxCardImages.length <= 1}
                                    >
                                        السابق
                                    </Button>
                                    <Typography variant="body2" color="text.secondary">
                                        {currentTaxImageIndex + 1} من {taxCardImages.length}
                                    </Typography>
                                    <Button
                                        variant="outlined"
                                        onClick={handleNextTaxImage}
                                        disabled={taxCardImages.length <= 1}
                                    >
                                        التالي
                                    </Button>
                                </Box>
                            )}

                            {/* Thumbnail Strip */}
                            {taxCardImages.length > 1 && (
                                <Box sx={{
                                    display: 'flex',
                                    gap: 1,
                                    overflowX: 'auto',
                                    pb: 1
                                }}>
                                    {taxCardImages.map((url, index) => (
                                        <Box
                                            key={index}
                                            onClick={() => setCurrentTaxImageIndex(index)}
                                            sx={{
                                                width: 60,
                                                height: 60,
                                                borderRadius: 1,
                                                overflow: 'hidden',
                                                cursor: 'pointer',
                                                border: currentTaxImageIndex === index ? '2px solid #1976d2' : '1px solid #e0e0e0',
                                                flex: '0 0 auto',
                                                transition: 'all 0.2s ease',
                                                '&:hover': {
                                                    transform: 'scale(1.05)'
                                                }
                                            }}
                                        >
                                            <img
                                                src={url}
                                                alt={`Thumbnail ${index + 1}`}
                                                style={{
                                                    width: '100%',
                                                    height: '100%',
                                                    objectFit: 'cover'
                                                }}
                                            />
                                        </Box>
                                    ))}
                                </Box>
                            )}
                        </Box>
                    )}
                </DialogContent>
                <DialogActions sx={{ p: 2, borderTop: '1px solid #e0e0e0' }}>
                    <Button onClick={handleCloseTaxCardDialog} variant="contained">
                        إغلاق
                    </Button>
                </DialogActions>
            </Dialog>
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
    // State for rejection reason modal
    const [isRejectionModalOpen, setIsRejectionModalOpen] = useState(false);
    const [selectedAdForRejection, setSelectedAdForRejection] = useState(null);

    // Subscribe to real-time updates for all homepage ads
    useEffect(() => {
        console.log("Mainadvertisment - Setting up real-time subscription...");

        const setupSubscription = async () => {
            try {
                const result = await dispatch(subscribeToAllHomepageAds()).unwrap();
                if (typeof result === 'function') {
                    subscriptionManager.add('admin-homepage-ads-all', result);
                }
            } catch (error) {
                console.error("Error setting up homepage ads subscription:", error);
            }
        };

        setupSubscription();

        // Cleanup subscription on unmount
        return () => {
            console.log("Mainadvertisment - Cleaning up subscription...");
            subscriptionManager.remove('admin-homepage-ads-all');
        };
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
    // Handle open rejection reason modal
    const handleOpenRejectionModal = (ad) => {
        setSelectedAdForRejection(ad);
        setIsRejectionModalOpen(true);
    };

    // Handle confirm rejection with reason
    const handleConfirmRejection = async (reason) => {
        if (selectedAdForRejection) {
            await handleRejectAd(selectedAdForRejection.id, reason);
            setSelectedAdForRejection(null);
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
    // Calculate remaining days from expiry time
    const calculateRemainingDays = (expiryTime) => {
        if (!expiryTime) return null;
        const now = Date.now();
        const expiry = typeof expiryTime === 'number' ? expiryTime : new Date(expiryTime).getTime();
        const remainingMs = expiry - now;
        if (remainingMs <= 0) return 0;
        return Math.ceil(remainingMs / (24 * 60 * 60 * 1000));
    };

    // Get activation days display text
    const getActivationDaysText = (ad) => {
        if (!ad.adExpiryTime) return null;

        const remainingDays = calculateRemainingDays(ad.adExpiryTime);
        if (remainingDays === null) return null;

        if (remainingDays === 0) {
            return 'منتهي الصلاحية';
        } else if (remainingDays === 1) {
            return 'ينتهي غداً';
        } else if (remainingDays <= 7) {
            return `متبقي ${remainingDays} أيام`;
        } else {
            return `متبقي ${remainingDays} يوم`;
        }
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
            // An ad is considered "active" only if it's both ads=true AND reviewStatus='approved'
            const isActuallyActive = ad.ads && ad.reviewStatus === 'approved';
            const activationMatch = activationFilter === 'all' ||
                (activationFilter === 'active' && isActuallyActive) ||
                (activationFilter === 'inactive' && !isActuallyActive);
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
        // An ad is considered "active" only if it's both ads=true AND reviewStatus='approved'
        active: homepageAds.filter(ad => ad.ads && ad.reviewStatus === 'approved').length,
        inactive: homepageAds.filter(ad => !ad.ads || ad.reviewStatus !== 'approved').length,
    }), [homepageAds]);
    const [receiptImage, setReceiptImage] = useState(null);
    return (
        <Box dir='rtl' sx={{ p: 3, textAlign: 'right' }}>
            <PageHeader
                title="إدارة إعلانات الصفحة الرئيسية"
                icon={BroadcastOnHomeIcon}
                count={stats.total}
                countLabel="إجمالي الإعلانات"
            />

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

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexDirection: 'row' }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', fontSize: 18 }} color="text.secondary">
                        قائمة الإعلانات ({filteredAds.length})
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
                                <Box sx={{
                                    display: 'flex',
                                    width: '100%',
                                    flexDirection: { xs: 'column', sm: 'row', md: 'row', lg: 'row' },
                                    alignItems: { xs: 'flex-start', sm: 'center' },
                                    gap: 2
                                }}>
                                    {/* Ad Image */}
                                    <Box sx={{
                                        minWidth: 80,
                                        width: '100%',
                                        maxWidth: 120,
                                        height: 80,
                                        borderRadius: 1,
                                        overflow: 'hidden',
                                        alignSelf: { xs: 'center', sm: 'flex-start' }
                                    }}>
                                        <img
                                            src={ad.image || './home.jpg'}
                                            alt="Ad"
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        />
                                    </Box>

                                    {/* Ad Info */}
                                    <Box sx={{
                                        flexGrow: 1,
                                        width: '100%',
                                        textAlign: { xs: 'center', sm: 'left' }
                                    }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                            <Chip
                                                label={getStatusLabel(ad.reviewStatus)}
                                                color={getStatusColor(ad.reviewStatus)}
                                                size="small"
                                            />
                                            <Chip
                                                label={(ad.ads && ad.reviewStatus === 'approved') ? 'مفعل' : 'غير مفعل'}
                                                color={(ad.ads && ad.reviewStatus === 'approved') ? 'success' : 'default'}
                                                size="small"
                                            />
                                        </Box>
                                        {/*
                                            <Typography variant="body2" color="text.secondary">
                                            تاريخ الإنشاء: {ad.createdAt ? formatDate(ad.createdAt) : 'غير محدد'}
                                        </Typography>
                                       */ }
                                        

                                        {ad.adExpiryTime && (
                                            <Typography variant="body2" color="text.secondary">
                                                ينتهي في: {formatDate(ad.adExpiryTime)}
                                            </Typography>
                                        )}
                                         {/* Activation Days Display */}
                                        {getActivationDaysText(ad) && (
                                            <Chip
                                                label={getActivationDaysText(ad)}
                                                color={calculateRemainingDays(ad.adExpiryTime) <= 7 ? 'warning' : 'info'}
                                                size="small"
                                                sx={{ mt: 0.5 }}
                                            />
                                        )}
                                        {ad.review_note && (
                                            <Typography variant="body2" color="error">
                                                ملاحظة: {ad.review_note}
                                            </Typography>
                                        )}
                                    </Box>
                                    {/* Receipt and Package Info */}
                                    <Box sx={{
                                        display: 'flex',
                                        flexWrap: 'wrap',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        gap: 1,
                                        mt: { xs: 1, sm: 0 },
                                        width: { xs: '100%', sm: 'auto' }
                                    }}>
                                        {/* Receipt Icon */}
                                        {ad.receipt_image && (
                                            <Tooltip title="عرض إيصال الدفع">
                                                <IconButton onClick={() => setReceiptImage(ad.receipt_image)}>
                                                    <VisibilityIcon />
                                                </IconButton>
                                            </Tooltip>
                                        )}
                                        {/* Show package info */}
                                        {ad.packageDays && ad.packagePrice && (
                                            <Chip
                                                label={`باقة: ${ad.packageDays} يوم - ${ad.packagePrice} جنيه`}
                                                color="info"
                                                sx={{ fontWeight: 'bold' }}
                                            />
                                        )}
                                    </Box>

                                    {/* Admin Actions */}
                                <Box sx={{
                                    display: 'flex',
                                    flexWrap: { xs: 'wrap', md: 'nowrap' },
                                    gap: { xs: 1, md: 0.5 },
                                    justifyContent: { xs: 'center', sm: 'flex-start' },
                                    mt: { xs: 2, sm: 0 },
                                    width: { xs: '100%', sm: 'auto' },
                                    minWidth: { md: 'fit-content' }
                                }}>
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
                                                        onClick={() => handleOpenRejectionModal(ad, 'تم الرفض من قبل الإدارة')}
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
                                                {/* Reject button for approved ads */}
                                                <Tooltip title="رفض الإعلان">
                                                    <IconButton
                                                        onClick={() => handleOpenRejectionModal(ad)}
                                                        sx={{ color: 'error.main' }}
                                                    >
                                                        <CancelIcon />
                                                    </IconButton>
                                                </Tooltip>
                                            </>
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
            {/* Rejection Reason Modal */}
            <RejectionReasonModal
                open={isRejectionModalOpen}
                onClose={() => {
                    setIsRejectionModalOpen(false);
                    setSelectedAdForRejection(null);
                }}
                onConfirm={handleConfirmRejection}
                adTitle={selectedAdForRejection?.title || selectedAdForRejection?.id}
            />

            {/* Receipt Dialog */}
            <Dialog open={!!receiptImage} onClose={() => setReceiptImage(null)} maxWidth="sm" fullWidth>
              <DialogTitle>إيصال الدفع</DialogTitle>
              <DialogContent>
                <img src={receiptImage} alt="إيصال الدفع" style={{ maxWidth: '100%' }} />
              </DialogContent>
            </Dialog>
        </Box>
    );
}


const statusChipColor = {
    pending: 'warning',
    approved: 'success',
    rejected: 'error',
    active: 'primary',
    inactive: 'default',
};

function PaidAdvertismentPage() {
    const dispatch = useDispatch();
    const { developerAds, funderAds, loading, error } = useSelector((state) => state.paidAds);

    const [activeTab, setActiveTab] = useState('developerAds');
    const [reviewStatusFilter, setReviewStatusFilter] = useState('all');
    const [userFilter, setUserFilter] = useState('all');
    const [availableUsers, setAvailableUsers] = useState([]);

    // State for delete dialog
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [adToDelete, setAdToDelete] = useState(null);
    const [adToDeleteType, setAdToDeleteType] = useState(null);

    // State for rejection dialog
    const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
    const [adToReject, setAdToReject] = useState(null);
    const [adToRejectType, setAdToRejectType] = useState(null);
    const [rejectReason, setRejectReason] = useState('');

    // State for activation menu dropdown
    const [activationMenuAnchorEl, setActivationMenuAnchorEl] = useState(null);
    const [adToActivate, setAdToActivate] = useState(null);
    const [adToActivateType, setAdToActivateType] = useState(null);

    // Snackbar state for notifications
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success',
    });

    // Add at the top of PaidAdvertismentPage (after snackbar state):
    const [receiptDialogOpen, setReceiptDialogOpen] = useState(false);
    const [receiptDialogImage, setReceiptDialogImage] = useState(null);
    const [receiptDialogAd, setReceiptDialogAd] = useState(null);
    const [receiptDialogType, setReceiptDialogType] = useState(null);
    const [receiptDialogDays, setReceiptDialogDays] = useState(7);

    // State for tax card images dialog
    const [taxCardDialogOpen, setTaxCardDialogOpen] = useState(false);
    const [taxCardImages, setTaxCardImages] = useState([]);
    const [currentTaxImageIndex, setCurrentTaxImageIndex] = useState(0);
    const [usersData, setUsersData] = useState({}); // Cache for user data
    const [taxImagesCache, setTaxImagesCache] = useState({}); // Cache for tax images from storage

    // Function to fetch tax card images directly from Firebase Storage
    const fetchTaxImagesFromStorage = async (userId) => {
        if (!userId) {
            console.warn('fetchTaxImagesFromStorage: No userId provided');
            return [];
        }

        // Check cache first
        if (taxImagesCache[userId]) {
            console.log('fetchTaxImagesFromStorage: Using cached tax images for userId:', userId);
            return taxImagesCache[userId];
        }

        try {
            console.log('fetchTaxImagesFromStorage: Fetching tax images for userId:', userId);
            const storage = getStorage();
            // استخدام مسار البطاقة الضريبية المخصص
            const storageRef = ref(storage, `tax_card_images/${userId}`);

            const listResult = await listAll(storageRef);
            const taxImageUrls = [];

            // Get download URLs for all tax card images in the dedicated folder
            console.log('fetchTaxImagesFromStorage: Found tax card files:', listResult.items.map(f => f.name));

            // Get download URLs for tax card images
            for (const fileRef of listResult.items) {
                try {
                    const downloadURL = await getDownloadURL(fileRef);
                    taxImageUrls.push(downloadURL);
                    console.log('fetchTaxImagesFromStorage: Got URL for:', fileRef.name, downloadURL);
                } catch (error) {
                    console.error('fetchTaxImagesFromStorage: Error getting URL for:', fileRef.name, error);
                }
            }

            // Cache the results
            setTaxImagesCache(prev => ({
                ...prev,
                [userId]: taxImageUrls
            }));

            console.log('fetchTaxImagesFromStorage: Total tax images found for userId:', userId, taxImageUrls.length);
            return taxImageUrls;

        } catch (error) {
            console.error('fetchTaxImagesFromStorage: Error fetching tax images for userId:', userId, error);
            return [];
        }
    };

    // Function to fetch user data by userId
    const fetchUserData = async (userId) => {
        if (!userId) {
            console.warn('fetchUserData: No userId provided');
            return null;
        }

        if (usersData[userId]) {
            console.log('fetchUserData: Using cached data for userId:', userId);
            return usersData[userId];
        }

        try {
            console.log('fetchUserData: Fetching data for userId:', userId);
            const userData = await User.getByUid(userId);
            if (userData) {
                console.log('fetchUserData: User data fetched successfully:', {
                    uid: userData.uid,
                    name: userData.cli_name || userData.org_name || userData.adm_name,
                    type: userData.type_of_user,
                    hasTaxImages: userData.tax_card_images?.length > 0
                });
                setUsersData(prev => ({
                    ...prev,
                    [userId]: userData
                }));
                return userData;
            } else {
                console.warn('fetchUserData: No user data found for userId:', userId);
            }
        } catch (error) {
            console.error('fetchUserData: Error fetching user data for userId:', userId, error);
        }
        return null;
    };

    // Function to handle tax card images click
    const handleTaxCardClick = async (userId) => {
        console.log('handleTaxCardClick: Called with userId:', userId);

        if (!userId) {
            console.error('handleTaxCardClick: No userId provided');
            setSnackbar({
                open: true,
                message: 'لا يمكن العثور على معرف المستخدم',
                severity: 'error'
            });
            return;
        }

        // Fetch tax images directly from storage
        const taxImages = await fetchTaxImagesFromStorage(userId);
        console.log('handleTaxCardClick: Tax images from storage:', taxImages);

        if (taxImages && taxImages.length > 0) {
            console.log('handleTaxCardClick: Opening tax card dialog with images from storage:', taxImages);
            setTaxCardImages(taxImages);
            setCurrentTaxImageIndex(0);
            setTaxCardDialogOpen(true);
        } else {
            console.warn('handleTaxCardClick: No tax card images found in storage for userId:', userId);
            setSnackbar({
                open: true,
                message: 'لا توجد صور للسجل الضريبي لهذا المستخدم',
                severity: 'info'
            });
        }
    };

    // Function to extract unique users from ads and fetch their data
    const extractAndFetchUsers = async (ads) => {
        const uniqueUserIds = [...new Set(ads.map(ad => ad.userId).filter(Boolean))];
        const users = [];

        // Fetch all user data in parallel for better performance
        const userDataPromises = uniqueUserIds.map(userId => fetchUserData(userId));
        const userDataResults = await Promise.allSettled(userDataPromises);

        userDataResults.forEach((result, index) => {
            if (result.status === 'fulfilled' && result.value) {
                const userData = result.value;
                users.push({
                    uid: userData.uid,
                    name: userData.cli_name || userData.org_name || userData.adm_name || 'مستخدم غير معروف',
                    type: userData.type_of_user
                });
            } else {
                console.warn(`Failed to fetch user data for userId: ${uniqueUserIds[index]}`);
            }
        });

        setAvailableUsers(users);
    };

    // --- Data Fetching Effect ---
    useEffect(() => {
        let unsubscribeDeveloper;
        let unsubscribeFunder;

        const fetchData = async () => {
            dispatch(setLoadingDeveloper(true));
            dispatch(setLoadingFunder(true));
            try {
                // Subscribe to real-time updates for developer ads
                unsubscribeDeveloper = RealEstateDeveloperAdvertisement.subscribeAllAds((ads) => {
                    dispatch(setDeveloperAds(ads));
                });

                // Subscribe to real-time updates for funder ads
                unsubscribeFunder = FinancingAdvertisement.subscribeAllAds((ads) => {
                    dispatch(setFunderAds(ads));
                });
            } catch (err) {
                console.error("Failed to fetch ads:", err);
                dispatch(setErrorDeveloper(err.message));
                dispatch(setErrorFunder(err.message));
                setSnackbar({
                    open: true,
                    message: `فشل تحميل الإعلانات: ${err.message}`,
                    severity: 'error',
                });
            }
        };

        fetchData();

        // Cleanup function for unsubscriptions
        return () => {
            if (unsubscribeDeveloper) unsubscribeDeveloper();
            if (unsubscribeFunder) unsubscribeFunder();
        };
    }, [dispatch]);

    // Extract users when ads are loaded
    useEffect(() => {
        const allAds = [...(developerAds || []), ...(funderAds || [])];
        if (allAds.length > 0) {
            extractAndFetchUsers(allAds);
            // Also preload tax images for all users
            const uniqueUserIds = [...new Set(allAds.map(ad => ad.userId).filter(Boolean))];
            uniqueUserIds.forEach(userId => {
                if (!taxImagesCache[userId]) {
                    fetchTaxImagesFromStorage(userId);
                }
            });
        }
    }, [developerAds, funderAds]); // Depend on dispatch

    // --- Filtering Logic ---
    const filteredDeveloperAds = developerAds.filter((ad) => {
        // Filter by review status
        if (reviewStatusFilter !== 'all' && ad.reviewStatus !== reviewStatusFilter) {
            return false;
        }
        // Filter by user
        if (userFilter !== 'all' && ad.userId !== userFilter) {
            return false;
        }
        return true;
    });

    const filteredFunderAds = funderAds.filter((ad) => {
        // Filter by review status
        if (reviewStatusFilter !== 'all' && ad.reviewStatus !== reviewStatusFilter) {
            return false;
        }
        // Filter by user
        if (userFilter !== 'all' && ad.userId !== userFilter) {
            return false;
        }
        return true;
    });

    // --- Handlers for Actions ---

    const handleStatusChipClick = (status) => {
        setReviewStatusFilter(status);
    };

    const handleEditClick = (ad, type) => {
        // Implement navigation or open an edit dialog
        console.log(`Edit ${type} ad:`, ad);
        setSnackbar({
            open: true,
            message: `وظيفة التعديل للإعلان ${ad.title || ad.developer_name} قيد التنفيذ.`,
            severity: 'info',
        });
    };

    const handleDeleteClick = (ad, type) => {
        setAdToDelete(ad);
        setAdToDeleteType(type);
        setOpenDeleteDialog(true);
    };

    const handleConfirmDelete = async () => {
        setOpenDeleteDialog(false);
        if (!adToDelete || !adToDeleteType) return;

        const adTypeLoadingKey = adToDeleteType; // 'developer' or 'funder'
        dispatch(adTypeLoadingKey === 'developer' ? setLoadingDeveloper(true) : setLoadingFunder(true));

        try {
            await dispatch(deleteAd({ id: adToDelete.id, type: adToDeleteType })).unwrap(); // Use .unwrap() to propagate errors
            setSnackbar({
                open: true,
                message: `تم حذف الإعلان "${adToDelete.developer_name || adToDelete.title}" بنجاح!`,
                severity: 'success',
            });
        } catch (err) {
            console.error(`Failed to delete ${adToDeleteType} ad for ID ${adToDelete.id}:`, err);
            setSnackbar({
                open: true,
                message: `فشل حذف الإعلان: ${err.message || 'حدث خطأ غير معروف.'}`,
                severity: 'error',
            });
        } finally {
            dispatch(adTypeLoadingKey === 'developer' ? setLoadingDeveloper(false) : setLoadingFunder(false));
            setAdToDelete(null);
            setAdToDeleteType(null);
        }
    };

    const handleApprove = async (ad) => {
        const adType = activeTab === 'developerAds' ? 'developer' : 'funder';
        dispatch(adType === 'developer' ? setLoadingDeveloper(true) : setLoadingFunder(true));
        try {
            await dispatch(approveAd({ id: ad.id, type: adType })).unwrap();
            setSnackbar({
                open: true,
                message: `تمت الموافقة على الإعلان "${ad.developer_name || ad.title}" بنجاح!`,
                severity: 'success',
            });
        } catch (err) {
            setSnackbar({
                open: true,
                message: `فشل الموافقة على الإعلان: ${err.message || 'حدث خطأ غير معروف.'}`,
                severity: 'error',
            });
        } finally {
            dispatch(adType === 'developer' ? setLoadingDeveloper(false) : setLoadingFunder(false));
        }
    };

    const handleReject = (ad) => {
        const adType = activeTab === 'developerAds' ? 'developer' : 'funder';
        setAdToReject(ad);
        setAdToRejectType(adType);
        setRejectDialogOpen(true);
    };

    const handleConfirmReject = async () => {
        if (!adToReject || !adToRejectType || rejectReason.trim() === '') return;
        dispatch(adToRejectType === 'developer' ? setLoadingDeveloper(true) : setLoadingFunder(true));
        setRejectDialogOpen(false);
        try {
            await dispatch(rejectAd({ id: adToReject.id, type: adToRejectType, reason: rejectReason.trim() })).unwrap();
            setSnackbar({
                open: true,
                message: `تم رفض الإعلان "${adToReject.developer_name || adToReject.title}" بنجاح!`,
                severity: 'success',
            });
            setRejectReason('');
        } catch (err) {
            setSnackbar({
                open: true,
                message: `فشل رفض الإعلان: ${err.message || 'حدث خطأ غير معروف.'}`,
                severity: 'error',
            });
        } finally {
            dispatch(adToRejectType === 'developer' ? setLoadingDeveloper(false) : setLoadingFunder(false));
            setAdToReject(null);
            setAdToRejectType(null);
        }
    };



    const handleReturnToPending = async (ad) => {
        const adType = activeTab === 'developerAds' ? 'developer' : 'funder';
        dispatch(adType === 'developer' ? setLoadingDeveloper(true) : setLoadingFunder(true));
        try {
            await dispatch(returnAdToPending({ id: ad.id, type: adType })).unwrap();
            setSnackbar({
                open: true,
                message: `تمت إعادة الإعلان "${ad.developer_name || ad.title}" إلى قيد المراجعة بنجاح!`,
                severity: 'success',
            });
        } catch (err) {
            setSnackbar({
                open: true,
                message: `فشل إعادة الإعلان للمراجعة: ${err.message || 'حدث خطأ غير معروف.'}`,
                severity: 'error',
            });
        } finally {
            dispatch(adType === 'developer' ? setLoadingDeveloper(false) : setLoadingFunder(false));
        }
    };

    // New: Handle opening the activation menu
    const handleActivationMenuOpen = (event, ad, type) => {
        setActivationMenuAnchorEl(event.currentTarget);
        setAdToActivate(ad);
        setAdToActivateType(type);
    };

    // New: Handle closing the activation menu
    const handleActivationMenuClose = () => {
        setActivationMenuAnchorEl(null);
        setAdToActivate(null);
        setAdToActivateType(null);
    };

    // New: Handle activation with a specific number of days
    const handleActivateWithDays = async (days, ad = adToActivate, type = adToActivateType) => {
        if (!ad || !type) return;
        handleActivationMenuClose();
        setReceiptDialogOpen(false);
        dispatch(type === 'developer' ? setLoadingDeveloper(true) : setLoadingFunder(true));
        try {
          await dispatch(toggleAdStatus({ adId: ad.id, type, days })).unwrap();
          setSnackbar({
            open: true,
            message: `تم تفعيل الإعلان بنجاح لمدة ${days} يوم.`,
            severity: 'success',
          });
        } catch (error) {
          setSnackbar({
            open: true,
            message: `فشل تفعيل الإعلان: ${error.message || 'حدث خطأ غير معروف.'}`,
            severity: 'error',
          });
        } finally {
          dispatch(type === 'developer' ? setLoadingDeveloper(false) : setLoadingFunder(false));
        }
      };

      const handleDeactivate = async (ad) => {
        const adType = activeTab === 'developerAds' ? 'developer' : 'funder';
        console.log('Deactivating ad:', { id: ad.id, type: adType });
        dispatch(adType === 'developer' ? setLoadingDeveloper(true) : setLoadingFunder(true));
        try {
          await dispatch(toggleAdStatus({ adId: ad.id, type: adType })).unwrap();
          setSnackbar({
            open: true,
            message: `تم إلغاء تفعيل الإعلان "${ad.developer_name || ad.title}" بنجاح!`,
            severity: 'success',
          });
        } catch (err) {
          setSnackbar({
            open: true,
            message: `فشل إلغاء تفعيل الإعلان: ${err.message || 'حدث خطأ غير معروف.'}`,
            severity: 'error',
          });
        } finally {
          dispatch(adType === 'developer' ? setLoadingDeveloper(false) : setLoadingFunder(false));
        }
      };


    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbar({ ...snackbar, open: false });
    };

    // DataGrid columns for developer ads
    const developerColumns = [
        { field: 'developer_name', headerName: 'اسم المطور', width: 200 },
        { field: 'description', headerName: 'الوصف', width: 300 },
        {
            field: 'images',
            headerName: 'الصور',
            width: 100,
            renderCell: (params) => (
                <Avatar
                    src={(params.value && params.value[0]) || 'https://placehold.co/50x50/E0E0E0/FFFFFF?text=No+Image'}
                    variant="rounded"
                    sx={{ width: 60, height: 50 }}
                />
            ),
            sortable: false,
            filterable: false,
        },
        { field: 'phone', headerName: 'رقم الهاتف', width: 150 },
        { field: 'location', headerName: 'الموقع', width: 150, renderCell: (params) => {
            const loc = params.value;
            if (!loc) return 'غير محدد';
            if (typeof loc === 'object') {
              return `${loc.governorate || ''}${loc.governorate && loc.city ? ' - ' : ''}${loc.city || ''}`;
            }
            return loc;
        } },
        { field: 'price_start_from', headerName: 'السعر من', width: 120, type: 'number' },
        { field: 'price_end_to', headerName: 'السعر إلى', width: 120, type: 'number' },
        {
            field: 'reviewStatus',
            headerName: 'حالة المراجعة',
            width: 140,
            renderCell: (params) => (
                <Chip
                    label={params.value === 'pending' ? 'قيد المراجعة' : params.value === 'approved' ? 'مقبول' : 'مرفوض'}
                    color={statusChipColor[params.value] || 'default'}
                    size="small"
                />
            ),
        },
        {
            field: 'ads',
            headerName: 'التفعيل',
            width: 100,
            renderCell: (params) => {
                const isActuallyActive = params.value && params.row.reviewStatus === 'approved';
                return (
                    <Chip
                        label={isActuallyActive ? 'مفعل' : 'غير مفعل'}
                        color={isActuallyActive ? 'success' : 'default'}
                        size="small"
                    />
                );
            },
        },
        {
            field: 'adPackageName',
            headerName: 'الباقة المختارة',
            width: 120,
            renderCell: (params) => (
                params.value ? (
                    <Chip
                        label={params.value}
                        color="primary"
                        size="small"
                        variant="outlined"
                    />
                ) : '—'
            ),
        },
        {
            field: 'tax_record',
            headerName: 'السجل الضريبي',
            width: 100,
            renderCell: (params) => {
                const userId = params.row.userId;
                const cachedTaxImages = taxImagesCache[userId] || [];
                const firstTaxImage = cachedTaxImages.length > 0 ? cachedTaxImages[0] : null;

                // Debug logging
                console.log('Tax record renderCell:', {
                    userId: userId,
                    cachedTaxImages: cachedTaxImages,
                    firstTaxImage: firstTaxImage
                });

                // If no cached images, try to fetch them
                React.useEffect(() => {
                    if (userId && !taxImagesCache[userId]) {
                        fetchTaxImagesFromStorage(userId);
                    }
                }, [userId]);

                return (
                    <Avatar
                        src={firstTaxImage || 'https://placehold.co/50x50/E0E0E0/FFFFFF?text=No+Tax'}
                        variant="rounded"
                        sx={{
                            width: 60,
                            height: 50,
                            cursor: 'pointer',
                            '&:hover': { opacity: 0.8 }
                        }}
                        onClick={() => handleTaxCardClick(userId)}
                    />
                );
            },
            sortable: false,
            filterable: false,
        },
        {
            field: 'receipt_image',
            headerName: 'إيصال الدفع',
            width: 100,
            renderCell: (params) => {
                // Debug logging for receipt images
                console.log('Developer receipt image debug:', {
                    adId: params.row.id,
                    userId: params.row.userId,
                    receiptImage: params.value,
                    hasReceiptImage: !!params.value
                });

                if (params.value) {
                    return (
                        <Avatar
                            src={params.value}
                            variant="rounded"
                            sx={{
                                width: 60,
                                height: 50,
                                cursor: 'pointer',
                                '&:hover': {
                                    opacity: 0.8,
                                    transform: 'scale(1.05)'
                                }
                            }}
                            onClick={() => handleReceiptClick(params.row, 'developer')}
                            onError={(e) => {
                                console.error('Receipt image failed to load:', params.value);
                                e.target.src = "https://placehold.co/50x50/FF6B6B/FFFFFF?text=Error";
                            }}
                        />
                    );
                }
                return (
                    <Avatar
                        src="https://placehold.co/50x50/E0E0E0/FFFFFF?text=No+Receipt"
                        variant="rounded"
                        sx={{ width: 60, height: 50 }}
                    />
                );
            },
            sortable: false,
            filterable: false,
        },
        // { field: 'address', headerName: 'العنوان التفصيلي', width: 300 },
        {
            field: 'actions',
            headerName: 'الإجراءات',
            width: 320,
            sortable: false,
            filterable: false,
            renderCell: (params) => (
                <Box sx={{ display: 'flex', gap: 0.5, flexWrap: { xs: 'wrap', md: 'nowrap' } }}>
                    <Tooltip title="موافقة">
                        <span>
                            <IconButton
                                aria-label="approve"
                                size="small"
                                onClick={() => handleApprove(params.row)}
                                color="success"
                                disabled={params.row.reviewStatus === 'approved' || loading.developer}
                            >
                                <ApprovalIcon fontSize="small" />
                            </IconButton>
                        </span>
                    </Tooltip>
                    <Tooltip title="رفض">
                        <span>
                            <IconButton
                                aria-label="reject"
                                size="small"
                                onClick={() => handleReject(params.row)}
                                color="error"
                                disabled={params.row.reviewStatus === 'rejected' || loading.developer}
                            >
                                <DoNotDisturbOnIcon fontSize="small" />
                            </IconButton>
                        </span>
                    </Tooltip>
                    {/* <Tooltip title="إعادة للمراجعة">
                        <span>
                            <IconButton
                                aria-label="return to pending"
                                size="small"
                                onClick={() => handleReturnToPending(params.row)}
                                color="warning"
                                disabled={params.row.reviewStatus === 'pending' || loading.developer}
                            >
                                <PendingIcon fontSize="small" />
                            </IconButton>
                        </span>
                    </Tooltip> */}
                    <Tooltip title="تفعيل">
                        <span>
                            <IconButton
                                aria-label="activate"
                                size="small"
                                onClick={(e) => handleActivationMenuOpen(e, params.row, 'developer')} // UPDATED for dropdown
                                color="primary"
                                disabled={params.row.ads || params.row.reviewStatus !== 'approved' || loading.developer}
                            >
                                <CheckCircleOutlineIcon fontSize="small" />
                            </IconButton>
                        </span>
                    </Tooltip>
                    <Tooltip title="إلغاء تفعيل">
                        <span>
                            <IconButton
                                aria-label="deactivate"
                                size="small"
                                onClick={() => handleDeactivate(params.row)}
                                color="secondary"
                                disabled={!params.row.ads || params.row.reviewStatus !== 'approved' || loading.developer}
                            >
                                <BlockIcon fontSize="small" />
                            </IconButton>
                        </span>
                    </Tooltip>
                    {/* <Tooltip title="تعديل">
                        <span>
                            <IconButton
                                aria-label="edit"
                                size="small"
                                onClick={() => handleEditClick(params.row, 'developer')}
                                color="info"
                                disabled={loading.developer}
                            >
                                <EditIcon fontSize="small" />
                            </IconButton>
                        </span>
                    </Tooltip> */}
                    <Tooltip title="حذف">
                        <span>
                            <IconButton
                                aria-label="delete"
                                size="small"
                                onClick={() => handleDeleteClick(params.row, 'developer')}
                                color="error"
                                disabled={loading.developer}
                            >
                                <DeleteIcon fontSize="small" />
                            </IconButton>
                        </span>
                    </Tooltip>
                    {/* Add a new column to developerColumns for receipt image */}
                    {/* {params.row.receipt_image && (
                        <Tooltip title="إيصال الدفع">
                            <span>
                                <IconButton
                                    aria-label="receipt"
                                    size="small"
                                    onClick={() => handleReceiptClick(params.row, 'developer')}
                                    color="info"
                                    disabled={loading.developer}
                                >
                                    <VisibilityIcon fontSize="small" />
                                </IconButton>
                            </span>
                        </Tooltip>
                    )} */}
                </Box>
            ),
        },
        { field: 'adExpiryTime', headerName: 'تاريخ الانتهاء', width: 150, renderCell: (params) => params.value ? new Date(params.value).toLocaleDateString('ar-EG') : '—' },
    ];

    // DataGrid columns for funder ads
    const funderColumns = [
        { field: 'org_name', headerName: 'المؤسسة', width: 200 },
        { field: 'title', headerName: 'العنوان', width: 200 },
        {
            field: 'images',
            headerName: 'الصورة',
            width: 100,
            renderCell: (params) => {
                // Handle the case where images is an array
                const imageUrl = Array.isArray(params.value) && params.value.length > 0
                    ? params.value[0]
                    : params.value || 'https://placehold.co/50x50/E0E0E0/FFFFFF?text=No+Image';
                return (
                    <Avatar
                        src={imageUrl}
                        variant="rounded"
                        sx={{ width: 50, height: 50 }}
                    />
                );
            },
            sortable: false,
            filterable: false,
        },
        { field: 'description', headerName: 'الوصف', width: 300 },
        { field: 'phone', headerName: 'رقم الهاتف', width: 150 },
        // { field: 'financing_model', headerName: 'نموذج التمويل', width: 150 },
        { field: 'start_limit', headerName: 'حدود التمويل من', width: 120, type: 'number' },
        { field: 'end_limit', headerName: 'حدود التمويل إلى', width: 120, type: 'number' },
        {
            field: 'reviewStatus',
            headerName: 'حالة المراجعة',
            width: 140,
            renderCell: (params) => (
                <Chip
                    label={params.value === 'pending' ? 'قيد المراجعة' : params.value === 'approved' ? 'مقبول' : 'مرفوض'}
                    color={statusChipColor[params.value] || 'default'}
                    size="small"
                />
            ),
        },
        {
            field: 'ads',
            headerName: 'التفعيل',
            width: 100,
            renderCell: (params) => {
                const isActuallyActive = params.value && params.row.reviewStatus === 'approved';
                return (
                    <Chip
                        label={isActuallyActive ? 'مفعل' : 'غير مفعل'}
                        color={isActuallyActive ? 'success' : 'default'}
                        size="small"
                    />
                );
            },
        },
                {
            field: 'adPackageName',
            headerName: 'الباقة المختارة',
            width: 150,
            renderCell: (params) => {
                if (params.value) {
                    return (
                        <Chip
                            label={params.value}
                            color="primary"
                            size="small"
                            variant="outlined"
                        />
                    );
                }
                return '—';
            }
        },
        {
            field: 'tax_record',
            headerName: 'السجل الضريبي',
            width: 100,
            renderCell: (params) => {
                const userId = params.row.userId;
                const cachedTaxImages = taxImagesCache[userId] || [];
                const firstTaxImage = cachedTaxImages.length > 0 ? cachedTaxImages[0] : null;

                // Debug logging for funder ads
                console.log('Funder tax record renderCell:', {
                    userId: userId,
                    cachedTaxImages: cachedTaxImages,
                    firstTaxImage: firstTaxImage
                });

                // If no cached images, try to fetch them
                React.useEffect(() => {
                    if (userId && !taxImagesCache[userId]) {
                        fetchTaxImagesFromStorage(userId);
                    }
                }, [userId]);

                return (
                    <Avatar
                        src={firstTaxImage || 'https://placehold.co/50x50/E0E0E0/FFFFFF?text=No+Tax'}
                        variant="rounded"
                        sx={{
                            width: 60,
                            height: 50,
                            cursor: 'pointer',
                            '&:hover': { opacity: 0.8 }
                        }}
                        onClick={() => handleTaxCardClick(userId)}
                    />
                );
            },
            sortable: false,
            filterable: false,
        },
        {
            field: 'receipt_image',
            headerName: 'إيصال الدفع',
            width: 100,
            renderCell: (params) => {
                // Debug logging for receipt images
                console.log('Funder receipt image debug:', {
                    adId: params.row.id,
                    userId: params.row.userId,
                    receiptImage: params.value,
                    hasReceiptImage: !!params.value
                });

                if (params.value) {
                    return (
                        <Avatar
                            src={params.value}
                            variant="rounded"
                            sx={{
                                width: 60,
                                height: 50,
                                cursor: 'pointer',
                                '&:hover': {
                                    opacity: 0.8,
                                    transform: 'scale(1.05)'
                                }
                            }}
                            onClick={() => handleReceiptClick(params.row, 'funder')}
                            onError={(e) => {
                                console.error('Receipt image failed to load:', params.value);
                                e.target.src = "https://placehold.co/50x50/FF6B6B/FFFFFF?text=Error";
                            }}
                        />
                    );
                }
                return (
                    <Avatar
                        src="https://placehold.co/50x50/E0E0E0/FFFFFF?text=No+Receipt"
                        variant="rounded"
                        sx={{ width: 60, height: 50 }}
                    />
                );
            },
            sortable: false,
            filterable: false,
        },
        {
            field: 'actions',
            headerName: 'الإجراءات',
            width: 320,
            sortable: false,
            filterable: false,
            renderCell: (params) => (
                <Box sx={{ display: 'flex', gap: 0.5, flexWrap: { xs: 'wrap', md: 'nowrap' } }}>
                    <Tooltip title="موافقة">
                        <span>
                            <IconButton
                                aria-label="approve"
                                size="small"
                                onClick={() => handleApprove(params.row)}
                                color="success"
                                disabled={params.row.reviewStatus === 'approved' || loading.funder}
                            >
                                <ApprovalIcon fontSize="small" />
                            </IconButton>
                        </span>
                    </Tooltip>
                    <Tooltip title="رفض">
                        <span>
                            <IconButton
                                aria-label="reject"
                                size="small"
                                onClick={() => handleReject(params.row)}
                                color="error"
                                disabled={params.row.reviewStatus === 'rejected' || loading.funder}
                            >
                                <DoNotDisturbOnIcon fontSize="small" />
                            </IconButton>
                        </span>
                    </Tooltip>
                    {/* <Tooltip title="إعادة للمراجعة">
                        <span>
                            <IconButton
                                aria-label="return to pending"
                                size="small"
                                onClick={() => handleReturnToPending(params.row)}
                                color="warning"
                                disabled={params.row.reviewStatus === 'pending' || loading.funder}
                            >
                                <PendingIcon fontSize="small" />
                            </IconButton>
                        </span>
                    </Tooltip> */}
                    <Tooltip title="تفعيل">
                        <span>
                            <IconButton
                                aria-label="activate"
                                size="small"
                                onClick={(e) => handleActivationMenuOpen(e, params.row, 'funder')} // UPDATED for dropdown
                                color="primary"
                                disabled={params.row.ads || params.row.reviewStatus !== 'approved' || loading.funder}
                            >
                                <CheckCircleOutlineIcon fontSize="small" />
                            </IconButton>
                        </span>
                    </Tooltip>
                    <Tooltip title="إلغاء تفعيل">
                        <span>
                            <IconButton
                                aria-label="deactivate"
                                size="small"
                                onClick={() => handleDeactivate(params.row)}
                                color="secondary"
                                disabled={!params.row.ads || params.row.reviewStatus !== 'approved' || loading.funder}
                            >
                                <BlockIcon fontSize="small" />
                            </IconButton>
                        </span>
                    </Tooltip>
                   {/* <Tooltip title="تعديل">
                        <span>
                            <IconButton
                                aria-label="edit"
                                size="small"
                                onClick={() => handleEditClick(params.row, 'funder')}
                                color="info"
                                disabled={loading.funder}
                            >
                                <EditIcon fontSize="small" />
                            </IconButton>
                        </span>
                    </Tooltip> */}
                    <Tooltip title="حذف">
                        <span>
                            <IconButton
                                aria-label="delete"
                                size="small"
                                onClick={() => handleDeleteClick(params.row, 'funder')}
                                color="error"
                                disabled={loading.funder}
                            >
                                <DeleteIcon fontSize="small" />
                            </IconButton>
                        </span>
                    </Tooltip>
                    {/* Add a new column to funderColumns for receipt image */}
                    {/* {params.row.receipt_image && (
                        <Tooltip title="إيصال الدفع">
                            <span>
                                <IconButton
                                    aria-label="receipt"
                                    size="small"
                                    onClick={() => handleReceiptClick(params.row, 'funder')}
                                    color="info"
                                    disabled={loading.funder}
                                >
                                    <VisibilityIcon fontSize="small" />
                                </IconButton>
                            </span>
                        </Tooltip>
                    )} */}
                </Box>
            ),
        },
        { field: 'adExpiryTime', headerName: 'تاريخ الانتهاء', width: 150, renderCell: (params) => params.value ? new Date(params.value).toLocaleDateString('ar-EG') : '—' },
    ];

    // Function to get the DataGrid content based on the active tab
    const renderDataGrid = () => {
        if (activeTab === 'developerAds') {
            return (
                <DataGrid
                    rows={filteredDeveloperAds.filter(ad => ad.id !== null && ad.id !== undefined)}
                    columns={developerColumns}
                    pageSizeOptions={[5, 10, 20,25, 30,50]}
                    initialState={{
                        pagination: {
                            paginationModel: { pageSize: 10 },
                        },
                    }}
                    autoHeight
                    disableRowSelectionOnClick
                    sx={{ background: 'background.default', borderRadius: 2, mb: 2 }}
                    showToolbar
                />
            );
        } else {
            return (
                <DataGrid
                    rows={filteredFunderAds.filter(ad => ad.id !== null && ad.id !== undefined)}
                    columns={funderColumns}
                    pageSizeOptions={[5, 10, 20 , 25, 30 , 50]}
                    initialState={{
                        pagination: {
                            paginationModel: { pageSize: 10 },
                        },
                    }}
                    autoHeight
                    disableRowSelectionOnClick
                    sx={{ background: 'background.default', borderRadius: 2, mb: 2 }}
                    showToolbar
                />
            );
        }
    };

    // Handler to open dialog
    const handleReceiptClick = (ad, type) => {
      let days = 7;
      if (ad.adPackage === 1) days = 7;
      else if (ad.adPackage === 2) days = 14;
      else if (ad.adPackage === 3) days = 21;
      setReceiptDialogImage(ad.receipt_image);
      setReceiptDialogAd(ad);
      setReceiptDialogType(type);
      setReceiptDialogDays(days);
      setReceiptDialogOpen(true);
    };

    // Handler to activate with days from dialog
    const handleReceiptDialogActivate = async () => {
      if (receiptDialogAd && receiptDialogType) {
        await handleActivateWithDays(receiptDialogDays, receiptDialogAd, receiptDialogType);
        setReceiptDialogOpen(false);
      }
    };



    return (
        <Box dir={'rtl'} sx={{ p: { xs: 1, md: 3 }, textAlign: 'right', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
            <PageHeader
                title="الإعلانات المدفوعة"
                icon={BroadcastOnPersonalIcon}
                showCount={false}
            />
            <Paper dir={'rtl'} sx={{ p: { xs: 1, md: 3 }, borderRadius: 2, minHeight: 400, textAlign: 'right', flexGrow: 1 }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
                    <Tabs
                        variant='scrollable'
                        value={activeTab}
                        onChange={(e, v) => setActiveTab(v)}
                        aria-label="advertisement tabs"
                        textColor="primary"
                        indicatorColor="primary"
                    >
                        <Tab value="developerAds" label="إعلانات مطورين عقاريين" />
                        <Tab value="funderAds" label="إعلانات ممولين عقاريين" />
                    </Tabs>
                </Box>

                {/* User Filter */}
                <Box sx={{ mb: 2 }}>
                    <FormControl size="small" sx={{ minWidth: 200 }}>
                        <InputLabel>تصفية حسب المستخدم</InputLabel>
                        <Select
                            value={userFilter}
                            onChange={(e) => setUserFilter(e.target.value)}
                            label="تصفية حسب المستخدم"
                        >
                            <MenuItem value="all">جميع المستخدمين</MenuItem>
                            {availableUsers.map((user) => (
                                <MenuItem key={user.uid} value={user.uid}>
                                    {user.name} ({user.type})
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>

                {/* Filter Chips */}
                <Stack direction="row" spacing={1} mb={3} flexWrap="wrap">
                    <Chip
                        label="الكل"
                        color={reviewStatusFilter === 'all' ? 'primary' : 'default'}
                        onClick={() => handleStatusChipClick('all')}
                        sx={{ borderRadius: 1.5 }}
                    />
                    <Chip
                        label="قيد المراجعة"
                        color={reviewStatusFilter === 'pending' ? statusChipColor['pending'] : 'default'}
                        onClick={() => handleStatusChipClick('pending')}
                        sx={{ borderRadius: 1.5 }}
                    />
                    <Chip
                        label="مقبول"
                        color={reviewStatusFilter === 'approved' ? statusChipColor['approved'] : 'default'}
                        onClick={() => handleStatusChipClick('approved')}
                        sx={{ borderRadius: 1.5 }}
                    />
                    <Chip
                        label="مرفوض"
                        color={reviewStatusFilter === 'rejected' ? statusChipColor['rejected'] : 'default'}
                        onClick={() => handleStatusChipClick('rejected')}
                        sx={{ borderRadius: 1.5 }}
                    />
                </Stack>
                {/* DataGrid Table */}
                <Box sx={{ width: '100%', flexGrow: 1 }}>
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
                    <Button onClick={() => setOpenDeleteDialog(false)} variant="contained" color="primary" disabled={loading.developer || loading.funder}>
                        إلغاء
                    </Button>
                    <Button onClick={handleConfirmDelete}  color="error" autoFocus disabled={loading.developer || loading.funder}>
                        حذف
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog open={rejectDialogOpen} onClose={() => setRejectDialogOpen(false)} dir="rtl">
  <DialogTitle>سبب الرفض</DialogTitle>
  <DialogContent>
    <TextField
      autoFocus
      margin="dense"
      label="سبب الرفض"
      type="text"
      fullWidth
      value={rejectReason}
      onChange={e => setRejectReason(e.target.value)}
      helperText={rejectReason.trim() === '' ? 'الرجاء إدخال سبب لرفض الإعلان.' : ''}
      error={rejectReason.trim() === ''}
    />
  </DialogContent>
  <DialogActions>
    <Button onClick={() => setRejectDialogOpen(false)}>إلغاء</Button>
    <Button
      onClick={handleConfirmReject} // Use handleConfirmReject for both tabs
      color="error"
      disabled={rejectReason.trim() === ''}
    >
      رفض
    </Button>
  </DialogActions>
</Dialog>

            <Menu
                anchorEl={activationMenuAnchorEl}
                open={Boolean(activationMenuAnchorEl)}
                onClose={handleActivationMenuClose}
                dir="rtl" // For right-to-left display
            >
                <MenuItem onClick={() => handleActivateWithDays(7)}>7 أيام</MenuItem>
                <MenuItem onClick={() => handleActivateWithDays(14)}>14 يومًا</MenuItem>
                <MenuItem onClick={() => handleActivateWithDays(21)}>21 يومًا</MenuItem>
                <MenuItem onClick={() => handleActivateWithDays(28)}>28 يومًا</MenuItem>
            </Menu>

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

            {/* Receipt Dialog */}
            <Dialog open={receiptDialogOpen} onClose={() => setReceiptDialogOpen(false)} maxWidth="sm" fullWidth dir="rtl">
              <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>إيصال الدفع</span>
                <IconButton onClick={() => setReceiptDialogOpen(false)}><CloseIcon /></IconButton>
              </DialogTitle>
              <DialogContent sx={{ textAlign: 'center' }}>
                {receiptDialogImage ? (
                  <img src={receiptDialogImage} alt="إيصال الدفع" style={{ maxWidth: '100%', maxHeight: 400, borderRadius: 8, marginBottom: 16 }} />
                ) : (
                  <Typography color="text.secondary">لا يوجد إيصال دفع</Typography>
                )}
                <FormControl fullWidth sx={{ mt: 3 }}>
                  <InputLabel id="receipt-dialog-days-label">مدة التفعيل (بالأيام)</InputLabel>
                  <Select
                    labelId="receipt-dialog-days-label"
                    value={receiptDialogDays}
                    label="مدة التفعيل (بالأيام)"
                    onChange={e => setReceiptDialogDays(Number(e.target.value))}
                  >
                    <MenuItem value={7}>7 أيام</MenuItem>
                    <MenuItem value={14}>14 يوم</MenuItem>
                    <MenuItem value={21}>21 يوم</MenuItem>
                    <MenuItem value={28}>28 يوم</MenuItem>
                  </Select>
                  {/* Helper text for package */}
                  {receiptDialogAd?.adPackage && (
                    <Typography variant="caption" color="primary" sx={{ mt: 1, display: 'block' }}>
                      {receiptDialogAd.adPackage === 1 && 'باقة الأساس (7 أيام)'}
                      {receiptDialogAd.adPackage === 2 && 'باقة النخبة (14 يوم)'}
                      {receiptDialogAd.adPackage === 3 && 'باقة التميز (21 يوم)'}
                    </Typography>
                  )}
                </FormControl>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setReceiptDialogOpen(false)}>إلغاء</Button>
                <Button onClick={handleReceiptDialogActivate} variant="contained" color="primary">تفعيل</Button>
              </DialogActions>
            </Dialog>

            {/* Tax Card Images Dialog */}
            <Dialog
                open={taxCardDialogOpen}
                onClose={() => setTaxCardDialogOpen(false)}
                maxWidth="md"
                fullWidth
                PaperProps={{
                    sx: { borderRadius: 2 }
                }}
                onClick={(e) => {
                    // Close dialog when clicking on backdrop
                    if (e.target === e.currentTarget) {
                        setTaxCardDialogOpen(false);
                    }
                }}
            >
                <DialogTitle sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    textAlign: 'right'
                }}>
                    <Typography variant="h6">صور السجل الضريبي</Typography>
                    <IconButton
                        onClick={() => setTaxCardDialogOpen(false)}
                        sx={{ color: 'text.secondary' }}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent sx={{ textAlign: 'center', p: 3 }}>
                    {taxCardImages.length > 0 ? (
                        <Box>
                            {/* Current Image Display */}
                            <Box sx={{ mb: 2 }}>
                                <img
                                    src={taxCardImages[currentTaxImageIndex]}
                                    alt={`صورة السجل الضريبي ${currentTaxImageIndex + 1}`}
                                    style={{
                                        maxWidth: '100%',
                                        maxHeight: '500px',
                                        borderRadius: 8,
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                                    }}
                                />
                            </Box>

                            {/* Image Navigation */}
                            {taxCardImages.length > 1 && (
                                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2, mb: 2 }}>
                                    <IconButton
                                        onClick={() => setCurrentTaxImageIndex(prev =>
                                            prev > 0 ? prev - 1 : taxCardImages.length - 1
                                        )}
                                        disabled={taxCardImages.length <= 1}
                                    >
                                        <ArrowBackIcon />
                                    </IconButton>

                                    <Typography variant="body2" color="text.secondary">
                                        {currentTaxImageIndex + 1} من {taxCardImages.length}
                                    </Typography>

                                    <IconButton
                                        onClick={() => setCurrentTaxImageIndex(prev =>
                                            prev < taxCardImages.length - 1 ? prev + 1 : 0
                                        )}
                                        disabled={taxCardImages.length <= 1}
                                    >
                                        <ArrowForwardIcon />
                                    </IconButton>
                                </Box>
                            )}

                            {/* Thumbnail Navigation */}
                            {taxCardImages.length > 1 && (
                                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, flexWrap: 'wrap' }}>
                                    {taxCardImages.map((image, index) => (
                                        <Box
                                            key={index}
                                            onClick={() => setCurrentTaxImageIndex(index)}
                                            sx={{
                                                width: 60,
                                                height: 60,
                                                borderRadius: 1,
                                                overflow: 'hidden',
                                                cursor: 'pointer',
                                                border: currentTaxImageIndex === index ? '2px solid' : '1px solid',
                                                borderColor: currentTaxImageIndex === index ? 'primary.main' : 'divider',
                                                opacity: currentTaxImageIndex === index ? 1 : 0.7,
                                                transition: 'all 0.2s ease'
                                            }}
                                        >
                                            <img
                                                src={image}
                                                alt={`صورة مصغرة ${index + 1}`}
                                                style={{
                                                    width: '100%',
                                                    height: '100%',
                                                    objectFit: 'cover'
                                                }}
                                            />
                                        </Box>
                                    ))}
                                </Box>
                            )}
                        </Box>
                    ) : (
                        <Typography color="text.secondary" sx={{ py: 4 }}>
                            لا توجد صور للسجل الضريبي
                        </Typography>
                    )}
                </DialogContent>
                <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
                    <Button
                        onClick={() => setTaxCardDialogOpen(false)}
                        variant="contained"
                        sx={{ minWidth: 120 }}
                    >
                        إغلاق
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
function ClientAdvertismentPage() {
    // Redux dispatch hook
    const dispatch = useDispatch();

    // Local state for real-time data
    const [advertisements, setAdvertisements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({ reviewStatus: 'all', adStatus: 'all' });
    const [userFilter, setUserFilter] = useState('all');
    const [availableUsers, setAvailableUsers] = useState([]);
    const [usersData, setUsersData] = useState({}); // Cache for user data

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
    const [adToActivate, setAdToActivate] = useState(null);
    const [adToActivateType, setAdToActivateType] = useState(null);

    // Activation dropdown state
    const [activationMenuAnchorEl, setActivationMenuAnchorEl] = useState(null);

    // Receipt dialog state
    const [openReceiptDialog, setOpenReceiptDialog] = useState(false);
    const [receiptDialogImage, setReceiptDialogImage] = useState(null);
    const receiptButtonRef = useRef(null);

    // Function to fetch user data by userId
    const fetchUserData = async (userId) => {
        if (!userId || usersData[userId]) return usersData[userId];

        try {
            const userData = await User.getByUid(userId);
            if (userData) {
                setUsersData(prev => ({
                    ...prev,
                    [userId]: userData
                }));
                return userData;
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
        return null;
    };

    // Function to extract unique users from ads and fetch their data
    const extractAndFetchUsers = async (ads) => {
        const uniqueUserIds = [...new Set(ads.map(ad => ad.userId).filter(Boolean))];
        const users = [];

        // Fetch all user data in parallel for better performance
        const userDataPromises = uniqueUserIds.map(userId => fetchUserData(userId));
        const userDataResults = await Promise.allSettled(userDataPromises);

        userDataResults.forEach((result, index) => {
            if (result.status === 'fulfilled' && result.value) {
                const userData = result.value;
                users.push({
                    uid: userData.uid,
                    name: userData.cli_name || userData.org_name || userData.adm_name || 'مستخدم غير معروف',
                    type: userData.type_of_user
                });
            } else {
                console.warn(`Failed to fetch user data for userId: ${uniqueUserIds[index]}`);
            }
        });

        setAvailableUsers(users);
    };

    // Handler to close the receipt dialog
    const handleCloseReceiptDialog = () => {
        setOpenReceiptDialog(false);
        setReceiptDialogImage(null);
        // Restore focus to the receipt icon button
        if (receiptButtonRef.current) {
            receiptButtonRef.current.focus();
        }
    };

    // Handler to view the receipt image
    const handleViewReceipt = (ad, event) => {
        if (event && event.currentTarget) {
            receiptButtonRef.current = event.currentTarget;
        }
        setReceiptDialogImage(ad.receipt_image || null);
        setOpenReceiptDialog(!!ad.receipt_image);
    };

    // Real-time subscription to all client advertisements
    useEffect(() => {
        setLoading(true);
        setError(null);

        const unsubscribe = ClientAdvertisement.subscribeAll((adsData) => {
            console.log('[DEBUG] Client ads loaded:', adsData.length, 'ads');
            // Debug: Check if adPackageName is present
            adsData.forEach((ad, index) => {
                if (index < 3) { // Log first 3 ads for debugging
                    console.log(`[DEBUG] Ad ${index + 1}:`, {
                        id: ad.id,
                        title: ad.title,
                        adPackage: ad.adPackage,
                        adPackageName: ad.adPackageName,
                        adPackagePrice: ad.adPackagePrice,
                        adPackageDuration: ad.adPackageDuration
                    });
                }
            });
            setAdvertisements(adsData);
            setLoading(false);
            // Extract users from ads
            if (adsData.length > 0) {
                extractAndFetchUsers(adsData);
            }
        });

        return () => {
            unsubscribe();
        };
    }, []);


    // --- Operations ---
    const handleDeleteClick = (ad) => {
        setAdToDelete(ad);
        setOpenDeleteDialog(true);
    };

    const handleConfirmDelete = async () => {
        if (adToDelete) {
            try {
                console.log('[DEBUG] Deleting ad from admin dashboard:', adToDelete);
                // Use Redux action for consistent state management and proper file deletion
                await dispatch(deleteAdvertisement(adToDelete)).unwrap();
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
            const adInstance = await ClientAdvertisement.getById(ad.id);
            await adInstance.updateStatus(newStatus);
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
                const adInstance = await ClientAdvertisement.getById(adToReview.id);
                await adInstance.approveAd();
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
                const adInstance = await ClientAdvertisement.getById(adToReview.id);
                await adInstance.rejectAd(rejectReason);
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
                const adInstance = await ClientAdvertisement.getById(adToReview.id);
                await adInstance.returnToPending();
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
        setAdToActivate(ad);
        setAdToActivateType('client');
        setActivationDays(30);
        setOpenActivateDialog(true);
    };

    const handleConfirmActivate = async () => {
        if (adToActivate) {
            try {
                const adInstance = await ClientAdvertisement.getById(adToActivate.id);
                await adInstance.adsActivation(activationDays);
                setSnackbar({ open: true, message: `تم تفعيل الإعلان لمدة ${activationDays} يوم بنجاح!`, severity: "success" });
            } catch (err) {
                console.error("Error activating advertisement:", err);
                setSnackbar({ open: true, message: `فشل تفعيل الإعلان: ${err.message || 'خطأ غير معروف'}`, severity: "error" });
            } finally {
                setOpenActivateDialog(false);
                setAdToActivate(null);
                setAdToActivateType(null);
            }
        }
    };

    const handleDeactivateClick = async (ad) => {
        try {
            const adInstance = await ClientAdvertisement.getById(ad.id);
            await adInstance.removeAds();
            setSnackbar({ open: true, message: "تم إيقاف تفعيل الإعلان بنجاح!", severity: "success" });
        } catch (err) {
            console.error("Error deactivating advertisement:", err);
            setSnackbar({ open: true, message: `فشل إيقاف تفعيل الإعلان: ${err.message || 'خطأ غير معروف'}`, severity: "error" });
        }
    };

    // Filter Operations - using local state since we have all data from onSnapshot
    const handleFilterByReviewStatus = (status) => {
        setFilters(prev => ({ ...prev, reviewStatus: status }));
    };

    const handleFilterByAdStatus = (status) => {
        setFilters(prev => ({ ...prev, adStatus: status }));
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
        setError(null);
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
        { field: 'price', headerName: 'السعر (ج.م)', width: 120, type: 'number', editable: false },
        { field: 'area', headerName: 'المساحة (م²)', width: 100, type: 'number', editable: false },
        { field: 'city', headerName: 'المدينة', width: 100, editable: false },
        { field: 'governorate', headerName: 'المحافظة', width: 100, editable: false },
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
        { field: 'user_name', headerName: 'اسم المعلن', width: 100, editable: false },
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
            renderCell: (params) => {
                const isActuallyActive = params.value && params.row.reviewStatus === 'approved';
                return (
                    <Chip
                        label={isActuallyActive ? 'مفعل' : 'غير مفعل'}
                        color={isActuallyActive ? 'success' : 'default'}
                        size="small"
                    />
                );
            },
        },
        {
            field: 'adPackageName',
            headerName: 'الباقة المختارة',
            width: 120,
            renderCell: (params) => (
                params.value ? (
                    <Chip
                        label={params.value}
                        color="primary"
                        size="small"
                        variant="outlined"
                    />
                ) : '—'
            ),
        },
        {
            field: 'actions',
            headerName: 'الإجراءات',
            width: 350,
            sortable: false,
            filterable: false,
            renderCell: (params) => {
                const ad = params.row;
                return (
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                        {/* Approve */}
                        <Tooltip title="موافقة الإعلان">
                            <span>
                                <IconButton
                                    aria-label="approve"
                                    size="small"
                                    onClick={() => handleApproveClick(ad)}
                                    color="success"
                                    disabled={ad.reviewStatus === 'approved' || ad.loading}
                                >
                                    <ApprovalIcon fontSize="small" />
                                </IconButton>
                            </span>
                        </Tooltip>
                        {/* Reject */}
                        <Tooltip title="رفض الإعلان">
                            <span>
                                <IconButton
                                    aria-label="reject"
                                    size="small"
                                    onClick={() => handleRejectClick(ad)}
                                    color="error"
                                    disabled={ad.reviewStatus === 'rejected' || ad.loading}
                                >
                                    <DoNotDisturbOnIcon fontSize="small" />
                                </IconButton>
                            </span>
                        </Tooltip>
                        {/* Return to Pending */}
                        {/* <Tooltip title="إعادة للمراجعة">
                            <span>
                                <IconButton
                                    aria-label="return to pending"
                                    size="small"
                                    onClick={() => handleReturnClick(ad)}
                                    color="warning"
                                    disabled={ad.reviewStatus === 'pending' || ad.loading}
                                >
                                    <PendingIcon fontSize="small" />
                                </IconButton>
                            </span>
                        </Tooltip> */}
                        {/* Activate */}
                        <Tooltip title="تفعيل الإعلان">
                            <span>
                                <>
                                    <IconButton
                                        aria-label="activate"
                                        size="small"
                                        onClick={(event) => {
                                            setActivationMenuAnchorEl(event.currentTarget);
                                            setAdToActivate(ad);
                                        }}
                                        color="success"
                                        disabled={ad.ads || ad.reviewStatus !== 'approved' || ad.loading}
                                    >
                                        <CheckCircleOutlineIcon fontSize="small" />
                                    </IconButton>
                                    <Menu
                                        anchorEl={activationMenuAnchorEl}
                                        open={Boolean(activationMenuAnchorEl) && adToActivate && adToActivate.id === ad.id}
                                        onClose={() => { setActivationMenuAnchorEl(null); setAdToActivate(null); }}
                                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                                    >
                                        {[7, 15, 30, 60, 90].map((days) => (
                                            <MenuItem
                                                key={days}
                                                onClick={async () => {
                                                    setActivationMenuAnchorEl(null);
                                                    setAdToActivate(null);
                                                    try {
                                                        const adInstance = await ClientAdvertisement.getById(ad.id);
                                                        await adInstance.adsActivation(days);
                                                        setSnackbar({ open: true, message: `تم تفعيل الإعلان لمدة ${days} يومًا بنجاح!`, severity: "success" });
                                                    } catch (err) {
                                                        setSnackbar({ open: true, message: `فشل تفعيل الإعلان: ${err.message || 'خطأ غير معروف'}`, severity: "error" });
                                                    }
                                                }}
                                                disabled={ad.ads || ad.reviewStatus !== 'approved' || ad.loading}
                                            >
                                                {`تفعيل لمدة ${days} يوم`}
                                            </MenuItem>
                                        ))}
                                    </Menu>
                                </>
                            </span>
                        </Tooltip>
                        {/* Deactivate (no confirmation) */}
                        <Tooltip title="إيقاف التفعيل">
                            <span>
                                <IconButton
                                    aria-label="deactivate"
                                    size="small"
                                    onClick={() => handleDeactivateClick(ad)}
                                    color="warning"
                                    disabled={!ad.ads || ad.reviewStatus !== 'approved' || ad.loading}
                                >
                                    <BlockIcon fontSize="small" />
                                </IconButton>
                            </span>
                        </Tooltip>
                        {/* Edit */}
                        {/*
                        <Tooltip title="تعديل الإعلان">
                            <span>
                                <IconButton
                                    aria-label="edit"
                                    size="small"
                                    onClick={() => handleEditClick(ad)}
                                    color="info"
                                    disabled={ad.loading}
                                >
                                    <EditIcon fontSize="small" />
                                </IconButton>
                            </span>
                        </Tooltip> */}
                        {/* Delete */}
                        <Tooltip title="حذف الإعلان">
                            <span>
                                <IconButton
                                    aria-label="delete"
                                    size="small"
                                    onClick={() => handleDeleteClick(ad)}
                                    color="error"
                                    disabled={ad.loading}
                                >
                                    <DeleteIcon fontSize="small" />
                                </IconButton>
                            </span>
                        </Tooltip>
                        {/* View Receipt */}
                        {ad.receipt_image && (
                            <Tooltip title="عرض الإيصال">
                                <span>
                                    <IconButton
                                        aria-label="view receipt"
                                        size="small"
                                        onClick={event => handleViewReceipt(ad, event)}
                                        color="info"
                                        disabled={ad.loading}
                                    >
                                        <VisibilityIcon fontSize="small" />
                                    </IconButton>
                                </span>
                            </Tooltip>
                        )}
                    </Box>
                );
            },
        },
    ];

    const theme = useMuiTheme();

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
            <PageHeader
                title="إعلانات العملاء"
                icon={SupervisedUserCircleIcon}
                showCount={false}
            />

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
                        <FormControl size="small" sx={{ minWidth: 200 }}>
                            <InputLabel>تصفية حسب المستخدم</InputLabel>
                            <Select
                                value={userFilter}
                                onChange={(e) => setUserFilter(e.target.value)}
                                label="تصفية حسب المستخدم"
                            >
                                <MenuItem value="all">جميع المستخدمين</MenuItem>
                                {availableUsers.map((user) => (
                                    <MenuItem key={user.uid} value={user.uid}>
                                        {user.name} ({user.type})
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

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

                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexGrow: 1 }}>
                        <CircularProgress />
                        <Typography variant="body1" sx={{ ml: 2 }}>جارٍ تحميل الإعلانات...</Typography>
                    </Box>
                ) : error ? (
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
                                backgroundColor: theme.palette.mode === 'dark' ? theme.palette.background.paper : '#f0f0f0',
                                color: theme.palette.text.primary,
                            },
                            '& .MuiDataGrid-cell': {
                                color: theme.palette.text.primary,
                            },
                            '& .MuiDataGrid-row:nth-of-type(odd)': {
                                backgroundColor: 'rgba(0, 0, 0, 0.02)',
                            },
                        }}
                    >
                        <DataGrid
                            rows={advertisements
                                .filter(ad => ad.id != null)
                                .filter(ad => filters.reviewStatus === 'all' || ad.reviewStatus === filters.reviewStatus)
                                .filter(ad => filters.adStatus === 'all' || ad.status === filters.adStatus)
                                .filter(ad => userFilter === 'all' || ad.userId === userFilter)
                                .map(ad => ({
                                    ...ad,
                                    id: ad.id || `temp-${Math.random().toString(36).substr(2, 9)}`
                                }))}
                            columns={columns}
                            pageSizeOptions={[5, 10, 20,25,  30, 50]}
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
                    <Button onClick={() => setOpenDeleteDialog(false)} color="primary" disabled={loading}>
                        إلغاء
                    </Button>
                    <Button onClick={handleConfirmDelete} color="error" autoFocus disabled={loading}>
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
                    <Button onClick={() => setOpenApproveDialog(false)} color="primary" disabled={loading}>
                        إلغاء
                    </Button>
                    <Button onClick={handleConfirmApprove} color="success" autoFocus disabled={loading}>
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
                    <Button onClick={() => setOpenRejectDialog(false)} variant="contained" color="primary" disabled={loading}>
                        إلغاء
                    </Button>
                    <Button onClick={handleConfirmReject}  color="error" autoFocus disabled={loading}>
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
                    <Button onClick={() => setOpenReturnDialog(false)} color="primary" disabled={loading}>
                        إلغاء
                    </Button>
                    <Button onClick={handleConfirmReturn} color="info" autoFocus disabled={loading}>
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
                        تفعيل الإعلان: "{adToActivate?.title}"
                    </DialogContentText>
                    <FormControl fullWidth sx={{ mt: 2 }}>
                        <InputLabel id="activation-days-label">مدة التفعيل (بالأيام)</InputLabel>
                        <Select
                            labelId="activation-days-label"
                            value={activationDays}
                            label="مدة التفعيل (بالأيام)"
                            onChange={e => setActivationDays(Number(e.target.value))}
                        >
                            <MenuItem value={7}>7 أيام</MenuItem>
                            <MenuItem value={14}>14 يوم</MenuItem>
                            <MenuItem value={21}>21 يوم</MenuItem>
                            <MenuItem value={28}>28 يوم</MenuItem>
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenActivateDialog(false)} color="primary" disabled={loading}>
                        إلغاء
                    </Button>
                    <Button
                        onClick={handleConfirmActivate}
                        color="success"
                        variant="contained"
                    >
                        تفعيل
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar for Notifications */}
            <Snackbar
                open={snackbar.open || !!error} // Show error Snackbar if there's an error
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={handleSnackbarClose} severity={snackbar.severity || 'error'} sx={{ width: '100%' }}>
                    {snackbar.message || error}
                </Alert>
            </Snackbar>

            {/* Receipt Image Dialog */}
            <Dialog open={openReceiptDialog} onClose={handleCloseReceiptDialog} maxWidth="md">
                <DialogTitle>إيصال الدفع</DialogTitle>
                <DialogContent dividers sx={{ textAlign: 'center' }}>
                    {receiptDialogImage ? (
                        <img
                            src={receiptDialogImage}
                            alt="إيصال الدفع"
                            style={{ maxWidth: '100%', maxHeight: 500, borderRadius: 8 }}
                        />
                    ) : (
                        <Typography color="text.secondary">لا يوجد إيصال دفع متاح</Typography>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseReceiptDialog} color="primary">إغلاق</Button>
                </DialogActions>
            </Dialog>

        </Box>
    );
}

function OrdersPage() {
    const dispatch = useDispatch();
    const { list: financingRequests, loading, error } = useSelector((state) => state.financialRequests);

    // Add CSS animation for pulse effect
    const pulseAnimation = `
        @keyframes pulse {
            0% { opacity: 1; }
            50% { opacity: 0.5; }
            100% { opacity: 1; }
        }
    `;

    // Inject the CSS animation
    React.useEffect(() => {
        const style = document.createElement('style');
        style.textContent = pulseAnimation;
        document.head.appendChild(style);
        return () => document.head.removeChild(style);
    }, []);

    // Edit dialog state
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [editRow, setEditRow] = useState(null);
    const [editAmount, setEditAmount] = useState("");
    const [editStatus, setEditStatus] = useState("");
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [rowToDelete, setRowToDelete] = useState(null);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    // State for filters
    const [statusFilter, setStatusFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (financingRequests.length === 0 && !loading) {
            dispatch(fetchFinancialRequests());
        }
    }, [dispatch, financingRequests.length, loading]);

    // Add real-time subscription to financial requests for automatic updates
    useEffect(() => {
        const subscriptionKey = 'admin-financial-requests';

        try {
            // Create Firebase subscription directly
            const unsubscribe = FinancingRequest.subscribeAllRequests((requests) => {
                try {
                    // Map class instances to plain serializable objects
                    const plainRequests = requests.map(r => ({
                        id: r.id,
                        user_id: r.user_id,
                        advertisement_id: r.advertisement_id,
                        monthly_income: r.monthly_income,
                        job_title: r.job_title,
                        employer: r.employer,
                        age: r.age,
                        marital_status: r.marital_status,
                        dependents: r.dependents,
                        financing_amount: r.financing_amount,
                        repayment_years: r.repayment_years,
                        phone_number: r.phone_number,
                        status: r.status,
                        reviewStatus: r.reviewStatus,
                        // Convert Firestore Timestamp to millis (number) for serializability
                        submitted_at: r.submitted_at && typeof r.submitted_at.toMillis === 'function'
                            ? r.submitted_at.toMillis()
                            : r.submitted_at || null,
                    }));

                    // Update the Redux store with real-time data
                    dispatch({
                        type: 'financialRequests/setList',
                        payload: plainRequests
                    });
                    console.log('Financial requests updated:', plainRequests.length);
                } catch (error) {
                    console.error('Error updating financial requests state:', error);
                    setSnackbar({
                        open: true,
                        message: 'خطأ في تحديث طلبات التمويل',
                        severity: 'error'
                    });
                }
            });

            // Track the subscription
            subscriptionManager.add(subscriptionKey, unsubscribe);
        } catch (error) {
            console.error('Error setting up financial requests subscription:', error);
            setSnackbar({
                open: true,
                message: 'خطأ في إعداد تحديثات طلبات التمويل',
                severity: 'error'
            });
        }

        return () => {
            subscriptionManager.remove(subscriptionKey);
        };
    }, [dispatch]);

    // Helper functions for status
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

    // Filter requests based on status and search term
    const filteredRequests = financingRequests.filter(request => {
        let statusMatch = false;

        if (statusFilter === 'all') {
            statusMatch = true;
        } else if (statusFilter === 'orgApproved') {
            // Show only requests approved by organizations
            statusMatch = request.status === 'approved' && request.reviewStatus === 'approved';
        } else {
            statusMatch = request.status === statusFilter;
        }

        const searchMatch = !searchTerm ||
            request.id?.toString().includes(searchTerm) ||
            request.user_id?.toString().includes(searchTerm) ||
            request.job_title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            request.financing_amount?.toString().includes(searchTerm);
        return statusMatch && searchMatch;
    });

    // Calculate stats
    const stats = {
        total: financingRequests.length,
        pending: financingRequests.filter(req => req.status === 'pending').length,
        approved: financingRequests.filter(req => req.status === 'approved').length,
        rejected: financingRequests.filter(req => req.status === 'rejected').length,
        orgApproved: financingRequests.filter(req => req.status === 'approved' && req.reviewStatus === 'approved').length,
    };

    const handleEditClick = (row) => {
        setEditRow(row);
        setEditAmount(row.financing_amount || "");
        setEditStatus(row.status || "");
        setEditDialogOpen(true);
    };

    const handleEditSave = async () => {
        if (editRow) {
            try {
                await dispatch(updateFinancialRequest({
                    id: editRow.id,
                    updates: {
                        financing_amount: editAmount,
                        status: editStatus
                    }
                })).unwrap();
                setSnackbar({ open: true, message: "تم تحديث الطلب بنجاح!", severity: "success" });
        setEditDialogOpen(false);
        setEditRow(null);
            } catch (err) {
                setSnackbar({ open: true, message: `فشل تحديث الطلب: ${err.message || 'خطأ غير معروف'}`, severity: "error" });
            }
        }
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
        // {
        //     field: 'id',
        //     headerName: 'معرف الطلب',
        //     width: 170,
        //     renderCell: (params) => (
        //         <Chip
        //             label={params.value}
        //             size="small"
        //             variant="outlined"
        //             sx={{ fontWeight: 'bold' }}
        //         />
        //     )
        // },
        // {
        //     field: 'user_id',
        //     headerName: 'معرّف المستخدم',
        //     width: 180,
        //     renderCell: (params) => (
        //         <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
        //             {params.value}
        //         </Typography>
        //     )
        // },
        {
            field: 'status',
            headerName: 'الحالة',
            width: 160,
            renderCell: (params) => {
                const isApprovedByOrg = params.value === 'approved' && params.row.reviewStatus === 'approved';
                return (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Chip
                            label={getStatusLabel(params.value)}
                            color={getStatusColor(params.value)}
                            size="small"
                            sx={{ fontWeight: 'bold' }}
                        />
                        {isApprovedByOrg && (
                            <Tooltip title="تمت الموافقة من قبل المؤسسة التمويلية">
                                <CheckCircleIcon
                                    sx={{
                                        color: 'success.main',
                                        fontSize: 16,
                                        animation: 'pulse 2s infinite'
                                    }}
                                />
                            </Tooltip>
                        )}
                    </Box>
                );
            }
        },
        {
            field: 'financing_amount',
            headerName: 'المبلغ المطلوب',
            width: 160,
            renderCell: (params) => (
                <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                    {params.value?.toLocaleString()} ج.م
                </Typography>
            )
        },
        {
            field: 'job_title',
            headerName: 'الوظيفة',
            width: 150,
            renderCell: (params) => (
                <Typography variant="body2">
                    {params.value || 'غير محدد'}
                </Typography>
            )
        },
        {
            field: 'monthly_income',
            headerName: 'الدخل الشهري',
            width: 160,
            renderCell: (params) => (
                <Typography variant="body2" sx={{ color: 'success.main', fontWeight: 'medium' }}>
                    {params.value?.toLocaleString()} ج.م
                </Typography>
            )
        },
        {
            field: 'age',
            headerName: 'العمر',
            width: 100,
            renderCell: (params) => (
                <Typography variant="body2">
                    {params.value} سنة
                </Typography>
            )
        },
        // {
        //     field: 'marital_status',
        //     headerName: 'الحالة الاجتماعية',
        //     width: 150,
        //     renderCell: (params) => (
        //         <Chip
        //             label={params.value || 'غير محدد'}
        //             size="small"
        //             variant="outlined"
        //             color="info"
        //         />
        //     )
        // },
        {
            field: 'dependents',
            headerName: 'المعالون',
            width: 120,
            renderCell: (params) => (
                <Typography variant="body2">
                    {params.value} شخص
                </Typography>
            )
        },
        {
            field: 'repayment_years',
            headerName: 'سنوات السداد',
            width: 140,
            renderCell: (params) => (
                <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                    {params.value} سنة
                </Typography>
            )
        },
        // {
        //     field: 'submitted_at',
        //     headerName: 'تاريخ التقديم',
        //     width: 160,
        //     valueGetter: (params) =>
        //         params.value && params.value.toDate ? params.value.toDate().toLocaleDateString('ar-EG') : '',
        //     renderCell: (params) => (
        //         <Typography variant="body2" sx={{ color: 'text.secondary' }}>
        //             {params.value}
        //         </Typography>
        //     )
        // },
        {
            field: 'actions',
            headerName: 'الإجراءات',
            width: 180,
            renderCell: (params) => (
                <Box sx={{ display: 'flex', gap: 1 }}>
                    {/* <Tooltip title="تعديل الطلب" arrow>
                        <IconButton
                            aria-label="edit"
                            size="small"
                            onClick={() => handleEditClick(params.row)}
                            sx={{
                                color: 'primary.main',
                                '&:hover': {
                                    backgroundColor: 'primary.light',
                                    color: 'white'
                                }
                            }}
                        >
                            <EditIcon fontSize="small" />
                        </IconButton>
                    </Tooltip> */}
                    <Tooltip title="حذف الطلب" arrow>
                        <IconButton
                            aria-label="delete"
                            size="small"
                            onClick={() => handleDeleteClick(params.row)}
                            sx={{
                                color: 'error.main',
                                '&:hover': {
                                    backgroundColor: 'error.light',
                                    color: 'white'
                                }
                            }}
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
        <Box dir="rtl" sx={{ p: 3 }}>
            {/* Page Header */}
            <PageHeader
                title="إدارة طلبات التمويل"
                icon={AccountBalanceWalletIcon}
                count={stats.total}
                countLabel="إجمالي الطلبات"
            />

            {/* Stats Cards */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid size={{ xs: 6, sm: 3 }}>
                    <Chip
                        label={
                            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                {stats.pending} - قيد المراجعة
            </Typography>
                        }
                        sx={{
                            bgcolor: 'warning.light',
                            color: 'warning.contrastText',
                            px: 2,
                            py: 1,
                            borderRadius: 2,
                            width: '100%',
                            justifyContent: 'center'
                        }}
                    />
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                    <Chip
                        label={
                            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                {stats.approved} - مقبول
                            </Typography>
                        }
                        sx={{
                            bgcolor: 'success.light',
                            color: 'success.contrastText',
                            px: 2,
                            py: 1,
                            borderRadius: 2,
                            width: '100%',
                            justifyContent: 'center'
                        }}
                    />
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                    <Chip
                        label={
                            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                {stats.rejected} - مرفوض
                            </Typography>
                        }
                        sx={{
                            bgcolor: 'error.light',
                            color: 'error.contrastText',
                            px: 2,
                            py: 1,
                            borderRadius: 2,
                            width: '100%',
                            justifyContent: 'center'
                        }}
                    />
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                    <Chip
                        label={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <CheckCircleIcon sx={{ fontSize: 16 }} />
                                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                    {stats.orgApproved} - موافقة المؤسسات
                                </Typography>
                            </Box>
                        }
                        sx={{
                            bgcolor: 'success.light',
                            color: 'success.contrastText',
                            px: 2,
                            py: 1,
                            borderRadius: 2,
                            width: '100%',
                            justifyContent: 'center'
                        }}
                    />
                </Grid>
            </Grid>

            {/* Filters Section */}
            <Paper sx={{ p: 3, mb: 3, borderRadius: 2, boxShadow: 2 }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                    فلاتر البحث
                </Typography>
                <Grid container spacing={2} alignItems="center">
                    <Grid size={{ xs: 12, md: 4 }}>
                        <FormControl fullWidth size="small">
                            <InputLabel>حالة الطلب</InputLabel>
                            <Select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                label="حالة الطلب"
                            >
                                <MenuItem value="all">جميع الحالات</MenuItem>
                                <MenuItem value="pending">قيد المراجعة</MenuItem>
                                <MenuItem value="approved">مقبول</MenuItem>
                                <MenuItem value="rejected">مرفوض</MenuItem>
                                <MenuItem value="orgApproved">موافقة المؤسسات</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid size={{ xs: 12, md: 2 }}>
                        <Button
                            fullWidth
                            variant="outlined"
                            onClick={() => {
                                setStatusFilter('all');
                                setSearchTerm('');
                            }}
                            startIcon={<ClearIcon />}
                        >
                            مسح الفلاتر
                        </Button>
                    </Grid>
                </Grid>
            </Paper>

            {/* Data Grid */}
            <Paper dir="rtl" sx={{ p: 3, borderRadius: 3, boxShadow: 3, minHeight: 500 }}>
                {error && (
                    <Alert
                        severity="error"
                        sx={{ mb: 2, borderRadius: 2 }}
                        action={
                            <Button color="inherit" size="small" onClick={() => window.location.reload()}>
                                إعادة المحاولة
                            </Button>
                        }
                    >
                        {error}
                    </Alert>
                )}

                {loading ? (
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        py: 8,
                        gap: 2
                    }}>
                        <CircularProgress size={60} thickness={4} />
                        <Typography variant="h6" color="text.secondary">
                            جاري تحميل طلبات التمويل...
                        </Typography>
                        <Typography variant="body2" color="text.disabled">
                            يرجى الانتظار قليلاً
                        </Typography>
                    </Box>
                ) : filteredRequests.length === 0 ? (
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        py: 8,
                        gap: 2
                    }}>
                        <AccountBalanceWalletIcon sx={{ fontSize: 80, color: 'grey.400' }} />
                        <Typography variant="h5" color="text.secondary" sx={{ fontWeight: 'bold' }}>
                            لا توجد طلبات تمويل
                        </Typography>
                        <Typography variant="body1" color="text.disabled" sx={{ textAlign: 'center' }}>
                            {searchTerm || statusFilter !== 'all'
                                ? 'لا توجد نتائج تطابق معايير البحث المحددة'
                                : 'لم يتم تقديم أي طلبات تمويل حتى الآن.'
                            }
                        </Typography>
                    </Box>
                ) : (
                    <div style={{ height: 600, width: '100%' }}>
                    <DataGrid
                            rows={filteredRequests.filter(request => request.id !== null && request.id !== undefined)}
                        columns={columns}
                        loading={loading}
                            pageSizeOptions={[10, 20,25,30, 50]}
                            initialState={{
                                pagination: {
                                    paginationModel: { pageSize: 25 },
                                },
                            }}
                        getRowId={(row) => row.id || `temp-${Math.random()}`}
                        disableRowSelectionOnClick
                            sx={{
                                '& .MuiDataGrid-cell': {
                                    borderBottom: '1px solid #e0e0e0',
                                },
                                '& .MuiDataGrid-columnHeaders': {
                                    backgroundColor: 'primary.main',
                                    color: 'blsck',
                                    fontWeight: 'bold',
                                },
                                '& .MuiDataGrid-row:hover': {
                                    backgroundColor: 'action.hover',
                                },
                            }}
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
                )}
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
function ReportsPage() {
    const dispatch = useDispatch();
    const theme = useMuiTheme();

    // Get data from Redux store
    const clients = useSelector((state) => state.adminUsers.clients);
    const organizations = useSelector((state) => state.adminUsers.organizations);
    const admins = useSelector((state) => state.adminUsers.admins);

    // Get loading states
    const clientsStatus = useSelector((state) => state.adminUsers.clientsStatus);
    const organizationsStatus = useSelector((state) => state.adminUsers.organizationsStatus);
    const adminsStatus = useSelector((state) => state.adminUsers.adminsStatus);
    const homepageAds = useSelector((state) => state.homepageAds?.all || []);
    const clientAds = useSelector((state) => state.advertisements.list);
    const developerAds = useSelector((state) => state.paidAds.developerAds);
    const funderAds = useSelector((state) => state.paidAds.funderAds);
    const financialRequests = useSelector((state) => state.financialRequests.list);
    const inquiries = useSelector((state) => state.inquiries.list);
    const properties = useSelector((state) => state.properties.list);

    // Load data on component mount
    useEffect(() => {
        // Fetch all user data when ReportsPage loads
        if (clientsStatus === 'idle' || clientsStatus === 'failed') {
            dispatch(fetchClients());
        }
        if (organizationsStatus === 'idle' || organizationsStatus === 'failed') {
            dispatch(fetchOrganizations());
        }
        if (adminsStatus === 'idle' || adminsStatus === 'failed') {
            dispatch(fetchAdmins());
        }
    }, [dispatch, clientsStatus, organizationsStatus, adminsStatus]);

    // Calculate comprehensive analytics
    const analytics = useMemo(() => {
        // Debug logging
        console.log('ReportsPage - Data loaded:', {
            clients: clients.length,
            organizations: organizations.length,
            admins: admins.length,
            clientsStatus,
            organizationsStatus,
            adminsStatus
        });

        // User Analytics
        const totalUsers = clients.length + organizations.length + admins.length;
        const userGrowth = {
            clients: clients.length,
            organizations: organizations.length,
            admins: admins.length,
            total: totalUsers
        };

        // Advertisement Analytics
        const totalAds = homepageAds.length + clientAds.length + developerAds.length + funderAds.length;
        const adStatusBreakdown = {
            homepage: {
                total: homepageAds.length,
                pending: homepageAds.filter(ad => ad.reviewStatus === 'pending').length,
                approved: homepageAds.filter(ad => ad.reviewStatus === 'approved').length,
                rejected: homepageAds.filter(ad => ad.reviewStatus === 'rejected').length,
                // An ad is considered "active" only if it's both ads=true AND reviewStatus='approved'
                active: homepageAds.filter(ad => ad.ads && ad.reviewStatus === 'approved').length,
                inactive: homepageAds.filter(ad => !ad.ads || ad.reviewStatus !== 'approved').length
            },
            client: {
                total: clientAds.length,
                pending: clientAds.filter(ad => ad.reviewStatus === 'pending').length,
                approved: clientAds.filter(ad => ad.reviewStatus === 'approved').length,
                rejected: clientAds.filter(ad => ad.reviewStatus === 'rejected').length,
                // An ad is considered "active" only if it's both ads=true AND reviewStatus='approved'
                active: clientAds.filter(ad => ad.ads && ad.reviewStatus === 'approved').length,
                inactive: clientAds.filter(ad => !ad.ads || ad.reviewStatus !== 'approved').length
            },
            developer: {
                total: developerAds.length,
                pending: developerAds.filter(ad => ad.reviewStatus === 'pending').length,
                approved: developerAds.filter(ad => ad.reviewStatus === 'approved').length,
                rejected: developerAds.filter(ad => ad.reviewStatus === 'rejected').length,
                // An ad is considered "active" only if it's both ads=true AND reviewStatus='approved'
                active: developerAds.filter(ad => ad.ads && ad.reviewStatus === 'approved').length,
                inactive: developerAds.filter(ad => !ad.ads || ad.reviewStatus !== 'approved').length
            },
            funder: {
                total: funderAds.length,
                pending: funderAds.filter(ad => ad.reviewStatus === 'pending').length,
                approved: funderAds.filter(ad => ad.reviewStatus === 'approved').length,
                rejected: funderAds.filter(ad => ad.reviewStatus === 'rejected').length,
                // An ad is considered "active" only if it's both ads=true AND reviewStatus='approved'
                active: funderAds.filter(ad => ad.ads && ad.reviewStatus === 'approved').length,
                inactive: funderAds.filter(ad => !ad.ads || ad.reviewStatus !== 'approved').length
            }
        };

        // Financial Analytics
        const totalFinancialRequests = financialRequests.length;
        const financialRequestStatus = {
            pending: financialRequests.filter(req => req.status === 'pending').length,
            approved: financialRequests.filter(req => req.status === 'approved').length,
            rejected: financialRequests.filter(req => req.status === 'rejected').length
        };

        // Property Analytics
        const propertyStatus = {
            forSale: properties.filter(p => p.status === 'للبيع').length,
            forRent: properties.filter(p => p.status === 'للإيجار').length,
            sold: properties.filter(p => p.status === 'تم البيع').length,
            pending: properties.filter(p => p.status === 'قيد المراجعة').length
        };

        // Inquiry Analytics
        const inquiryStatus = {
            pending: inquiries.filter(inq => inq.status === 'pending').length,
            contacted: inquiries.filter(inq => inq.status === 'contacted').length,
            closed: inquiries.filter(inq => inq.status === 'closed').length
        };

        // Revenue Analytics (Mock data - replace with actual revenue tracking)
        const revenueData = {
            total: 125000, // Mock total revenue
            monthly: [15000, 18000, 22000, 19000, 25000, 28000, 32000, 29000, 35000, 31000, 38000, 42000],
            byType: {
                homepageAds: 45000,
                developerAds: 35000,
                funderAds: 25000,
                clientAds: 20000
            }
        };

        // Geographic Analytics
        const geographicData = {
            governorates: properties.reduce((acc, prop) => {
                const gov = prop.governorate || 'غير محدد';
                acc[gov] = (acc[gov] || 0) + 1;
                return acc;
            }, {}),
            cities: properties.reduce((acc, prop) => {
                const city = prop.city || 'غير محدد';
                acc[city] = (acc[city] || 0) + 1;
                return acc;
            }, {})
        };

        // Time-based Analytics
        const now = new Date();
        const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
        const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

        const recentActivity = {
            newUsers: clients.filter(client => new Date(client.createdAt) > lastMonth).length +
                organizations.filter(org => new Date(org.createdAt) > lastMonth).length,
            newAds: homepageAds.filter(ad => new Date(ad.createdAt) > lastWeek).length +
                clientAds.filter(ad => new Date(ad.createdAt) > lastWeek).length,
            newRequests: financialRequests.filter(req => new Date(req.submitted_at) > lastWeek).length
        };

        return {
            userGrowth,
            adStatusBreakdown,
            financialRequestStatus,
            propertyStatus,
            inquiryStatus,
            revenueData,
            geographicData,
            recentActivity,
            totalAds,
            totalFinancialRequests
        };
    }, [clients, organizations, admins, homepageAds, clientAds, developerAds, funderAds, financialRequests, properties, inquiries]);

    // Chart data preparation
    const userChartData = [
        { label: 'العملاء', value: analytics.userGrowth.clients, color: theme.palette.primary.main },
        { label: 'المنظمات', value: analytics.userGrowth.organizations, color: theme.palette.success.main },
        { label: 'المدراء', value: analytics.userGrowth.admins, color: theme.palette.warning.main }
    ];

    const adChartData = [
        { label: 'إعلانات الصفحة الرئيسية', value: analytics.adStatusBreakdown.homepage.total, color: theme.palette.info.main },
        { label: 'إعلانات العملاء', value: analytics.adStatusBreakdown.client.total, color: theme.palette.secondary.main },
        { label: 'إعلانات المطورين', value: analytics.adStatusBreakdown.developer.total, color: theme.palette.error.main },
        { label: 'إعلانات الممولين', value: analytics.adStatusBreakdown.funder.total, color: theme.palette.primary.dark }
    ];

    const statusChartData = [
        { label: 'قيد المراجعة', value: analytics.adStatusBreakdown.homepage.pending + analytics.adStatusBreakdown.client.pending + analytics.adStatusBreakdown.developer.pending + analytics.adStatusBreakdown.funder.pending, color: theme.palette.warning.main },
        { label: 'مقبول', value: analytics.adStatusBreakdown.homepage.approved + analytics.adStatusBreakdown.client.approved + analytics.adStatusBreakdown.developer.approved + analytics.adStatusBreakdown.funder.approved, color: theme.palette.success.main },
        { label: 'مرفوض', value: analytics.adStatusBreakdown.homepage.rejected + analytics.adStatusBreakdown.client.rejected + analytics.adStatusBreakdown.developer.rejected + analytics.adStatusBreakdown.funder.rejected, color: theme.palette.error.main }
    ];

    // Check if any data is still loading
    const isLoading = clientsStatus === 'loading' || organizationsStatus === 'loading' || adminsStatus === 'loading';

    return (
        <Box dir='rtl' sx={{ p: 3, textAlign: 'right' }}>
            <PageHeader
                title="التقارير والتحليلات الشاملة"
                icon={DescriptionIcon}
                showCount={false}
            />

            {/* Loading indicator */}
            {isLoading && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                    <CircularProgress />
                    <Typography variant="body1" sx={{ ml: 2, mt: 1 }}>
                        جاري تحميل البيانات...
                    </Typography>
                </Box>
            )}

            {/* Key Metrics Cards */}
            <Grid dir='rtl' container spacing={3} sx={{ mb: 4 }}>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Paper elevation={3} sx={{ p: 3, textAlign: 'center', borderRadius: 2, bgcolor: theme.palette.primary.main, color: 'white', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-5px)' } }}>
                        <PeopleIcon sx={{ fontSize: 40, mb: 1 }} />
                        <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                            {analytics.userGrowth.total}
                        </Typography>
                        <Typography variant="body1">إجمالي المستخدمين</Typography>
                        <Typography variant="caption" sx={{ opacity: 0.8 }}>
                            +{analytics.recentActivity.newUsers} هذا الشهر
                        </Typography>
                    </Paper>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Paper elevation={3} sx={{ p: 3, textAlign: 'center', borderRadius: 2, bgcolor: theme.palette.secondary.main, color: 'white', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-5px)' } }}>
                        <CampaignIcon sx={{ fontSize: 40, mb: 1 }} />
                        <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                            {analytics.totalAds}
                        </Typography>
                        <Typography variant="body1">إجمالي الإعلانات</Typography>
                        <Typography variant="caption" sx={{ opacity: 0.8 }}>
                            +{analytics.recentActivity.newAds} هذا الأسبوع
                        </Typography>
                    </Paper>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Paper elevation={3} sx={{ p: 3, textAlign: 'center', borderRadius: 2, bgcolor: theme.palette.success.main, color: 'white', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-5px)' } }}>
                        <RequestQuoteIcon sx={{ fontSize: 40, mb: 1 }} />
                        <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                            {analytics.totalFinancialRequests}
                        </Typography>
                        <Typography variant="body1">طلبات التمويل</Typography>
                        <Typography variant="caption" sx={{ opacity: 0.8 }}>
                            +{analytics.recentActivity.newRequests} هذا الأسبوع
                        </Typography>
                    </Paper>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Paper elevation={3} sx={{ p: 3, textAlign: 'center', borderRadius: 2, bgcolor: theme.palette.warning.main, color: 'white', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-5px)' } }}>
                        <AttachMoneyIcon sx={{ fontSize: 40, mb: 1 }} />
                        <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                            {analytics.revenueData.total.toLocaleString()} ج.م
                        </Typography>
                        <Typography variant="body1">إجمالي الإيرادات</Typography>
                        <Typography variant="caption" sx={{ opacity: 0.8 }}>
                            +15% عن الشهر الماضي
                        </Typography>
                    </Paper>
                </Grid>
            </Grid>

            {/* Charts Section */}
            <Grid dir='rtl' container spacing={3}>
                {/* User Distribution Chart */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
                        <Typography variant="h6" sx={{ mb: 2, textAlign: 'left' }}>
                            توزيع المستخدمين
                        </Typography>
                        <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <PieChart
                                series={[
                                    {
                                        data: userChartData,
                                        highlightScope: { faded: 'global', highlighted: 'item' },
                                        faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
                                        outerRadius: 120, // Slightly larger pie
                                        innerRadius: 60, // Donut effect
                                    },
                                ]}
                                height={300}
                                width={400}
                                slotProps={{ legend: { direction: 'rtl', position: { vertical: 'middle', horizontal: 'left' } } }} // RTL legend
                            />
                        </Box>
                    </Paper>
                </Grid>

                {/* Advertisement Types Chart */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
                        <Typography variant="h6" sx={{ mb: 2, textAlign: 'left' }}>
                            أنواع الإعلانات
                        </Typography>
                        <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <PieChart
                                series={[
                                    {
                                        data: adChartData,
                                        highlightScope: { faded: 'global', highlighted: 'item' },
                                        faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
                                        outerRadius: 120,
                                        innerRadius: 60,
                                    },
                                ]}
                                height={300}
                                width={400}
                                slotProps={{ legend: { direction: 'rtl', position: { vertical: 'middle', horizontal: 'left' } } }}
                            />
                        </Box>
                    </Paper>
                </Grid>

                {/* Status Distribution Chart */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
                        <Typography variant="h6" sx={{ mb: 2, textAlign: 'left' }}>
                            حالة الإعلانات
                        </Typography>
                        <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <PieChart
                                series={[
                                    {
                                        data: statusChartData,
                                        highlightScope: { faded: 'global', highlighted: 'item' },
                                        faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
                                        outerRadius: 120,
                                        innerRadius: 60,
                                    },
                                ]}
                                height={300}
                                width={400}
                                slotProps={{ legend: { direction: 'rtl', position: { vertical: 'middle', horizontal: 'left' } } }}
                            />
                        </Box>
                    </Paper>
                </Grid>

                {/* Geographic Distribution */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
                        <Typography variant="h6" sx={{ mb: 2, textAlign: 'left' }}>
                            <LocationOnIcon sx={{ verticalAlign: 'middle', ml: 1 }} /> {/* Icon for geographic */}
                            التوزيع الجغرافي للمعاملات
                        </Typography>
                        <Box sx={{ maxHeight: 300, overflow: 'auto' }}>
                            {Object.entries(analytics.geographicData.governorates)
                                .sort(([, a], [, b]) => b - a)
                                .slice(0, 10)
                                .map(([governorate, count]) => (
                                    <Box key={governorate} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1, borderBottom: '1px solid #eee' }}>
                                        <Typography variant="body2">{governorate}</Typography>
                                        <Chip label={count} size="small" color="primary" sx={{ bgcolor: theme.palette.info.light, color: 'white' }} />
                                    </Box>
                                ))}
                        </Box>
                    </Paper>
                </Grid>
            </Grid>

            {/* Detailed Statistics Tables */}
            <Grid dir='rtl' container spacing={3} sx={{ mt: 2 }}>
                {/* Advertisement Status Details */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
                        <Typography variant="h6" sx={{ mb: 2, textAlign: 'left' }}>
                            تفاصيل حالة الإعلانات
                        </Typography>
                        <TableContainer>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={{ textAlign: 'right', fontWeight: 'bold' }}>النوع</TableCell>
                                        <TableCell sx={{ textAlign: 'center', fontWeight: 'bold' }}>قيد المراجعة</TableCell>
                                        <TableCell sx={{ textAlign: 'center', fontWeight: 'bold' }}>مقبول</TableCell>
                                        <TableCell sx={{ textAlign: 'center', fontWeight: 'bold' }}>مرفوض</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    <TableRow>
                                        <TableCell sx={{ textAlign: 'right' }}>الصفحة الرئيسية</TableCell>
                                        <TableCell sx={{ textAlign: 'center' }}>
                                            <Chip label={analytics.adStatusBreakdown.homepage.pending} size="small" color="warning" />
                                        </TableCell>
                                        <TableCell sx={{ textAlign: 'center' }}>
                                            <Chip label={analytics.adStatusBreakdown.homepage.approved} size="small" color="success" />
                                        </TableCell>
                                        <TableCell sx={{ textAlign: 'center' }}>
                                            <Chip label={analytics.adStatusBreakdown.homepage.rejected} size="small" color="error" />
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell sx={{ textAlign: 'right' }}>العملاء</TableCell>
                                        <TableCell sx={{ textAlign: 'center' }}>
                                            <Chip label={analytics.adStatusBreakdown.client.pending} size="small" color="warning" />
                                        </TableCell>
                                        <TableCell sx={{ textAlign: 'center' }}>
                                            <Chip label={analytics.adStatusBreakdown.client.approved} size="small" color="success" />
                                        </TableCell>
                                        <TableCell sx={{ textAlign: 'center' }}>
                                            <Chip label={analytics.adStatusBreakdown.client.rejected} size="small" color="error" />
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell sx={{ textAlign: 'right' }}>المطورين</TableCell>
                                        <TableCell sx={{ textAlign: 'center' }}>
                                            <Chip label={analytics.adStatusBreakdown.developer.pending} size="small" color="warning" />
                                        </TableCell>
                                        <TableCell sx={{ textAlign: 'center' }}>
                                            <Chip label={analytics.adStatusBreakdown.developer.approved} size="small" color="success" />
                                        </TableCell>
                                        <TableCell sx={{ textAlign: 'center' }}>
                                            <Chip label={analytics.adStatusBreakdown.developer.rejected} size="small" color="error" />
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell sx={{ textAlign: 'right' }}>الممولين</TableCell>
                                        <TableCell sx={{ textAlign: 'center' }}>
                                            <Chip label={analytics.adStatusBreakdown.funder.pending} size="small" color="warning" />
                                        </TableCell>
                                        <TableCell sx={{ textAlign: 'center' }}>
                                            <Chip label={analytics.adStatusBreakdown.funder.approved} size="small" color="success" />
                                        </TableCell>
                                        <TableCell sx={{ textAlign: 'center' }}>
                                            <Chip label={analytics.adStatusBreakdown.funder.rejected} size="small" color="error" />
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                </Grid>

                {/* Financial Requests Status */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
                        <Typography variant="h6" sx={{ mb: 2, textAlign: 'left' }}>
                            حالة طلبات التمويل
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography variant="body2">قيد المراجعة</Typography>
                                <Chip label={analytics.financialRequestStatus.pending} color="warning" />
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography variant="body2">مقبول</Typography>
                                <Chip label={analytics.financialRequestStatus.approved} color="success" />
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography variant="body2">مرفوض</Typography>
                                <Chip label={analytics.financialRequestStatus.rejected} color="error" />
                            </Box>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>

            {/* Revenue Breakdown */}
            <Paper dir='rtl' elevation={3} sx={{ p: 3, borderRadius: 2, mt: 3 }}>
                <Typography variant="h6" sx={{ mb: 2, textAlign: 'left' }}>
                    تفصيل الإيرادات حسب النوع
                </Typography>
                <Grid container spacing={2}>
                    <Grid size={{ xs: 6, sm: 3 }}>
                        <Box sx={{ textAlign: 'center', p: 2, bgcolor: theme.palette.primary.light, borderRadius: 1, color: 'white' }}>
                            <Typography variant="h6">{analytics.revenueData.byType.homepageAds.toLocaleString()} ج.م</Typography>
                            <Typography variant="body2">إعلانات الصفحة الرئيسية</Typography>
                        </Box>
                    </Grid>
                    <Grid size={{ xs: 6, sm: 3 }}>
                        <Box sx={{ textAlign: 'center', p: 2, bgcolor: theme.palette.secondary.light, borderRadius: 1, color: 'white' }}>
                            <Typography variant="h6">{analytics.revenueData.byType.developerAds.toLocaleString()} ج.م</Typography>
                            <Typography variant="body2">إعلانات المطورين</Typography>
                        </Box>
                    </Grid>
                    <Grid size={{ xs: 6, sm: 3 }}>
                        <Box sx={{ textAlign: 'center', p: 2, bgcolor: theme.palette.success.light, borderRadius: 1, color: 'white' }}>
                            <Typography variant="h6">{analytics.revenueData.byType.funderAds.toLocaleString()} ج.م</Typography>
                            <Typography variant="body2">إعلانات الممولين</Typography>
                        </Box>
                    </Grid>
                    <Grid size={{ xs: 6, sm: 3 }}>
                        <Box sx={{ textAlign: 'center', p: 2, bgcolor: theme.palette.warning.light, borderRadius: 1, color: 'white' }}>
                            <Typography variant="h6">{analytics.revenueData.byType.clientAds.toLocaleString()} ج.م</Typography>
                            <Typography variant="body2">إعلانات العملاء</Typography>
                        </Box>
                    </Grid>
                </Grid>
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
    const { window: windowProp } = props;
    const [mobileOpen, setMobileOpen] = React.useState(false);
    const [open, setOpen] = React.useState(true);
    const [openReports, setOpenReports] = React.useState(false);
    const { mode, toggleMode } = useTheme();
    const [isMobile, setIsMobile] = React.useState(false);

    // Set initial mobile state after component mounts (client-side only)
    React.useEffect(() => {
        const checkIfMobile = () => window.innerWidth < 750;
        setIsMobile(checkIfMobile());
    }, []);

    // Handle reports menu toggle
    const handleReportsClick = () => {
        setOpenReports(!openReports);
    };

    // Handle window resize
    React.useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth < 750;
            setIsMobile(mobile);
            // Close drawer on mobile when resizing to larger screens
            if (!mobile && mobileOpen) {
                setMobileOpen(false);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [mobileOpen]);

    // Close drawer when route changes on mobile
    const handleDrawerToggle = () => {
        if (isMobile) {
            setMobileOpen(!mobileOpen);
        } else {
            setOpen(!open);
        }
    };

    // Close drawer when clicking on a menu item on mobile
    const handleMenuItemClick = () => {
        if (isMobile) {
            setMobileOpen(false);
        }
    };
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



    const router = useDemoRouter('/profile');
    const dispatch = useDispatch();
    const navigate = useNavigate();
    // const { unreadCount } = useNotifications();

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
    const handleLogout = async () => {
        await performLogout(dispatch, signOut, auth, navigate);
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
            marginRight: open && !isMobile ? theme.spacing(2) + drawerWidth : closedDrawerWidth,
            [theme.breakpoints.down('md')]: {
                marginRight: 0,
                paddingRight: theme.spacing(2),
                paddingLeft: theme.spacing(2),
                paddingTop: '50px',
                marginTop:0,
            },
            [theme.breakpoints.up('md')]: {
                padding: theme.spacing(3),
                paddingTop:'0px',
            },
        })
    );

    const AppBarStyled = styled(AppBar, { shouldForwardProp: (prop) => prop !== 'open' })(
        ({ theme, open }) => ({
            transition: theme.transitions.create(['margin', 'width'], {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
            }),
            width: `calc(100% - ${open && !isMobile ? theme.spacing(2) + drawerWidth : closedDrawerWidth}px)`,
            marginLeft: open && !isMobile ? theme.spacing(2) + drawerWidth : closedDrawerWidth,
            [theme.breakpoints.down('md')]: {
                width: '100%',
                marginLeft: 0,
                // paddingRight: theme.spacing(1),
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
        // case '/reports/reports':
        //     currentPageContent = <ReportsPage />;
        //     break;
        // case '/reports/traffic':
        //     currentPageContent = <TrafficPage />;
        //     break;
        case '/analytics':
            currentPageContent = <Analytics />;
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

    // Notification state
    const [notificationAnchorEl, setNotificationAnchorEl] = React.useState(null);
    const [unreadCount, setUnreadCount] = React.useState(0);
    const [snackbarOpen, setSnackbarOpen] = React.useState(false);
    const [snackbarMessage, setSnackbarMessage] = React.useState('');
    const [snackbarSeverity, setSnackbarSeverity] = React.useState('success');

    // Real-time notification subscription
    React.useEffect(() => {
        if (authUid) {
            const unsubscribe = Notification.subscribeUnreadCount(authUid, (count) => {
                setUnreadCount(count);
            });
            return () => unsubscribe();
        }
    }, [authUid]);

    // Notification handlers - memoized to prevent unnecessary re-renders
    const handleNotificationClick = React.useCallback((event) => {
        event.preventDefault();
        event.stopPropagation();
        setNotificationAnchorEl(event.currentTarget);
    }, []);

    const handleNotificationClose = React.useCallback(() => {
        setNotificationAnchorEl(null);
    }, []);

    return (
        <StyledEngineProvider injectFirst>
            <CacheProvider value={cacheRtl}>
                    <ThemeProvider theme={theme}>
                        <Box sx={{ display: 'flex', flexDirection: 'row-reverse' }}>
                            <CssBaseline />
                            <AppBarStyled position="fixed" open={open}>
                                <Toolbar sx={{ flexDirection: 'row-reverse' }}>
                                    <IconButton
                                        color="inherit"
                                        aria-label="open drawer"
                                        edge="start"
                                        onClick={handleDrawerToggle}
                                        sx={{ ml: 2, display: { md: 'none' } }}
                                    >
                                        <MenuIcon />
                                    </IconButton>
                                    {!open && !isMobile && (
                                        <img
                                            src="./logo.png"
                                            alt="App Logo"
                                            style={{ height: 60, marginRight: 8, scale: 3 }}
                                        />
                                    )}
                                    <Box sx={{ flexGrow: 1 }} />
                                    {/* Notification Bell Icon */}
                                    <IconButton
                                        sx={{ mr: -1 }}
                                        onClick={handleNotificationClick}
                                        color="inherit"
                                    >
                                        <Badge
                                            badgeContent={unreadCount}
                                            color="error"
                                            sx={{
                                                "& .MuiBadge-badge": {
                                                    top: "0px",
                                                    right: "0px",
                                                    backgroundColor: "#d1d1d1ff",
                                                    color: "black",
                                                    fontWeight: "bold",
                                                    minWidth: "20px",
                                                    height: "20px",
                                                    borderRadius: "50%",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    fontSize: "14px",
                                                    zIndex: "10000",
                                                },
                                            }}
                                        >
                                            <NotificationsIcon />
                                        </Badge>
                                    </IconButton>
                                    {/* Notification Popover */}
                                    <Popover
                                        open={Boolean(notificationAnchorEl)}
                                        anchorEl={notificationAnchorEl}
                                        onClose={handleNotificationClose}
                                        anchorOrigin={{
                                            vertical: 'bottom',
                                            horizontal: 'left',
                                        }}
                                        transformOrigin={{
                                            vertical: 'top',
                                            horizontal: 'right',
                                        }}
                                    >
                                        <NotificationList userId={authUid} />
                                    </Popover>
                                    <IconButton
                                        sx={{ ml: 1 }}
                                        color="inherit"
                                        onClick={() => navigate('/home')}
                                        title="العودة للصفحة الرئيسية"
                                    >
                                        <HomeIcon />
                                    </IconButton>
                                    <IconButton sx={{ mr: 1 }} onClick={toggleMode} color="inherit">
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
                                variant={isMobile ? 'temporary' : 'permanent'}
                                sx={{
                                    display: { xs: 'block' },
                                    width: open ? drawerWidth : closedDrawerWidth,
                                    flexShrink: 0,
                                    whiteSpace: 'nowrap',
                                    boxSizing: 'border-box',
                                    transition: theme.transitions.create('width', {
                                        easing: theme.transitions.easing.sharp,
                                        duration: theme.transitions.duration.enteringScreen,
                                    }),
                                    '& .MuiDrawer-paper': {
                                        boxSizing: 'border-box',
                                        width: isMobile ? '80%' : (open ? drawerWidth : closedDrawerWidth),
                                        borderRadius: isMobile ? 0 : '8px 0 0 8px',
                                        overflowX: 'hidden',
                                        transition: theme.transitions.create('width', {
                                            easing: theme.transitions.easing.sharp,
                                            duration: theme.transitions.duration.enteringScreen,
                                        }),
                                    },
                                }}
                                anchor="left"
                                open={isMobile ? mobileOpen : open}
                                onClose={handleDrawerToggle}
                                ModalProps={{
                                    keepMounted: true,
                                }}
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
                                            sx={{ width: 80, height: 80, mb: 1, boxShadow: '0px 0px 8px rgba(0,0,0,0.2)',border: '3px solid',
                                                borderColor: 'primary.main' }}
                                        />
                                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                            مرحباً، {userName}
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
                                                                    <ListItem disablePadding>
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
                                            <Tooltip title={item.tooltip} placement='right-end' key={item.segment}>
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
            </CacheProvider>
        </StyledEngineProvider>
    );
}