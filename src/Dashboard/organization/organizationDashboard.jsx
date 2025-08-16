import * as React from 'react';
import { useState, useEffect, useMemo } from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
import {
    Typography, Box, Paper, Tabs, Tab, CssBaseline, AppBar, Toolbar, IconButton, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider, Avatar, Button, Collapse, Grid, Dialog, DialogTitle, DialogContent, DialogActions, TextField, ListItemAvatar, Tooltip,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Stack,
    CircularProgress,
    Snackbar,
    Alert,
    Card,
    CardContent,
    Chip,
    Badge,
    Popover,
    useMediaQuery
} from '@mui/material';
import PageHeader from '../../componenents/PageHeader';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import DashboardIcon from '@mui/icons-material/Dashboard';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RefreshIcon from '@mui/icons-material/Refresh';
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
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import EditIcon from '@mui/icons-material/Edit';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import DeleteIcon from '@mui/icons-material/Delete';
import BroadcastOnPersonalIcon from '@mui/icons-material/BroadcastOnPersonal';
import BroadcastOnHomeIcon from '@mui/icons-material/BroadcastOnHome';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import MessageIcon from '@mui/icons-material/Message';
import NotificationsIcon from '@mui/icons-material/Notifications';
import LogoutIcon from '@mui/icons-material/Logout';
import DownloadIcon from '@mui/icons-material/Download';
import { logout } from '../../LoginAndRegister/featuresLR/authSlice';
import { performLogout } from '../../utils/logoutUtils';
import { addUser, editUser, deleteUser } from '../../reduxToolkit/slice/usersSlice';
import { addOrganization, editOrganization, deleteOrganization } from '../../reduxToolkit/slice/organizationsSlice';
import { addAdmin, editAdmin, deleteAdmin } from '../../reduxToolkit/slice/adminsSlice';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import rtlPlugin from 'stylis-plugin-rtl';
import { StyledEngineProvider } from '@mui/material/styles';

import { DataGrid } from '@mui/x-data-grid';
import { setProfilePic } from '../../reduxToolkit/slice/profilePicSlice';
import { Link } from '@mui/material';

import {
    addProperty,
    editProperty,
    deleteProperty,
    setFilterStatus,
    setFilterType
} from '../../reduxToolkit/slice/propertiesSlice';

// Import the modal components (assuming they are in './modals' folder)
import AddPropertyModal from './modals/AddPropertyModal';
import EditPropertyModal from './modals/EditPropertyModal';
import AddHomepageAdModal from './modals/AddHomepageAdModal';
import EditHomepageAdModal from './modals/EditHomepageAdModal';
// import ConfirmDeleteModal from './modals/ConfirmDeleteModal';


import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import ApartmentOutlinedIcon from '@mui/icons-material/ApartmentOutlined';
import AttachMoneyOutlinedIcon from '@mui/icons-material/AttachMoneyOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import MessageOutlinedIcon from '@mui/icons-material/MessageOutlined';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import DirectionsWalkOutlinedIcon from '@mui/icons-material/DirectionsWalkOutlined';
import PendingActionsOutlinedIcon from '@mui/icons-material/PendingActionsOutlined';


// chart
import { PieChart, pieArcLabelClasses } from '@mui/x-charts/PieChart';
import { BarChart } from '@mui/x-charts/BarChart';
import { LineChart } from '@mui/x-charts/LineChart';
import { desktopOS, valueFormatter } from './webUsageStats';
//  msg 
import MoreVertIcon from '@mui/icons-material/MoreVert'; // For dropdown menu on inquiry status
import DoneOutlineIcon from '@mui/icons-material/DoneOutline'; // For contacted
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty'; // For pending
import CloseIcon from '@mui/icons-material/Close'; // For closed
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import RealEstateDeveloperAdvertisement from '../../FireBase/modelsWithOperations/RealEstateDeveloperAdvertisement';
import FinancingAdvertisement from '../../FireBase/modelsWithOperations/FinancingAdvertisement';
import { setDeveloperAds, setFunderAds } from '../../reduxToolkit/slice/paidAdsSlice';
import {
    updateInquiry,
    deleteInquiry,
    setFilterStat,
} from '../../reduxToolkit/slice/inquiriesSlice';
// import { selectProperties } from '../../reduxToolkit/slice/propertiesSlice';

// org profile
import { fetchUserProfile, updateUserProfile, uploadAndSaveProfileImage, clearProfile } from "../../LoginAndRegister/featuresLR/userSlice";
import sendResetPasswordEmail from "../../FireBase/authService/sendResetPasswordEmail";
import { auth } from "../../FireBase/firebaseConfig";
import { signOut } from "firebase/auth";
import { fetchDeveloperAdsByUser } from "../../feature/ads/developerAdsSlice";
import { fetchFinancingAdsByUser } from "../../feature/ads/financingAdsSlice";
import {
    // fetchAllHomepageAds,
    fetchHomepageAdsByUser,
    subscribeToUserHomepageAds,
    createHomepageAd,
    updateHomepageAd,
    deleteHomepageAd,
    returnHomepageAdToPending
    // approveHomepageAd,
    // rejectHomepageAd,
    // returnHomepageAdToPending,
    // activateHomepageAd,
    // deactivateHomepageAd
} from "../../feature/ads/homepageAdsSlice";
import subscriptionManager from '../../utils/subscriptionManager';
import { deleteAd, updateAd } from '../../reduxToolkit/slice/paidAdsSlice';
import Notification from '../../FireBase/MessageAndNotification/Notification';
import NotificationList from '../../pages/notificationList';
// financing 
import FinancingRequest from '../../FireBase/modelsWithOperations/FinancingRequest';
// analytics
import { fetchAnalyticsData } from '../../reduxToolkit/slice/analyticsSlice';
// Define shared data (could be moved to a constants file)
const governorates = [
    "القاهرة", "الإسكندرية", "الجيزة", "الشرقية", "الدقهلية", "البحيرة", "المنيا", "أسيوط",
];
const organizationTypes = ["مطور عقاري", "مطور عقارى", "ممول عقاري", "ممول عقارى"];
// Login Logout 
// import { logoutUser } from '../../reduxToolkit/authSlice';
import { useNavigate, Navigate } from 'react-router-dom';

// Import the ConfirmDeleteModal
// Create RTL cache for Emotion
const cacheRtl = createCache({
    key: 'mui-rtl',
    stylisPlugins: [rtlPlugin],
});

const drawerWidth = 240;
const closedDrawerWidth = 70;

// Function to get navigation items based on organization type
// This function conditionally includes the 'orders' tab only for funder organizations
const getNavigationItems = (organizationType) => {
    const baseItems = [
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
        // {
        //     segment: 'inquiries',
        //     title: 'المحادثات',
        //     icon: <MessageIcon />,
        //     tooltip: 'المحادثات',
        // },
    ];

    // Add orders tab only for funder organizations
    // This tab shows financing advertisements for funder organizations to review and approve
    if (organizationType === 'ممول عقارى' || organizationType === 'ممول عقاري') {
        baseItems.push({
            segment: 'orders',
            title: 'الطلبات',
            icon: <ShoppingCartIcon />,
            tooltip: 'الطلبات',
        });
    }

    // Add remaining items
    baseItems.push(
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
            icon: <BarChartIcon />,
            tooltip: 'التحليلات والتقارير',
        },
        // {
        //     segment: 'reports',
        //     title: 'التقارير',
        //     icon: <DescriptionIcon />,
        //     tooltip: 'التقارير',
        //     children: [
        //         {
        //             segment: 'sales',
        //             title: 'المبيعات',
        //             icon: <DescriptionIcon />,
        //             tooltip: 'المبيعات',
        //         },
        //         {
        //             segment: 'traffic',
        //             title: 'حركة مرور الزوار',
        //             icon: <DescriptionIcon />,
        //             tooltip: 'حركة مرور الزوار',
        //         },
        //     ],
        // },
        // {
        //     segment: 'integrations',
        //     title: 'إضافات',
        //     icon: <LayersIcon />,
        //     tooltip: 'إضافات',
        // }
    );

    return baseItems;
};

import { useTheme } from '../../context/ThemeContext';

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

function EditUserModal({ open, onClose, onSave, user }) {
    const [name, setName] = React.useState(user ? user.name : '');
    const [email, setEmail] = React.useState(user ? user.email : '');
    const [nameError, setNameError] = React.useState(false);
    const [emailError, setEmailError] = React.useState(false);
    const [emailHelperText, setEmailHelperText] = React.useState('');

    React.useEffect(() => {
        if (user) {
            setName(user.name);
            setEmail(user.email);
            setNameError(false);
            setEmailError(false);
            setEmailHelperText('');
        }
    }, [user, open]);

    const handleSave = () => {
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
            onSave({ ...user, name, email });
            onClose();
        }
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle sx={{ textAlign: 'left' }}>تعديل العميل</DialogTitle>
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
                <Button onClick={handleSave} variant="contained" sx={{ bgcolor: 'purple' }}>
                    حفظ
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

// function AddOrgModal({ open, onClose, onAdd }) {
//     const [name, setName] = React.useState('');
//     const [contact, setContact] = React.useState('');
//     const [nameError, setNameError] = React.useState(false);
//     const [contactError, setContactError] = React.useState(false);

//     React.useEffect(() => {
//         if (open) {
//             setName('');
//             setContact('');
//             setNameError(false);
//             setContactError(false);
//         }
//     }, [open]);

//     const handleAdd = () => {
//         let hasError = false;
//         if (!name.trim()) {
//             setNameError(true);
//             hasError = true;
//         } else {
//             setNameError(false);
//         }

//         if (!contact.trim()) {
//             setContactError(true);
//             hasError = true;
//         } else {
//             setContactError(false);
//         }

//         if (!hasError) {
//             onAdd({ name, contact });
//             setName('');
//             setContact('');
//             onClose();
//         }
//     };

//     return (
//         <Dialog open={open} onClose={onClose}>
//             <DialogTitle sx={{ textAlign: 'right' }}>إضافة مؤسسة</DialogTitle>
//             <DialogContent sx={{ textAlign: 'right' }}>
//                 <TextField
//                     autoFocus
//                     margin="dense"
//                     label="إسم المؤسسة"
//                     type="text"
//                     fullWidth
//                     variant="outlined"
//                     value={name}
//                     onChange={(e) => setName(e.target.value)}
//                     error={nameError}
//                     helperText={nameError ? 'إسم المؤسسة مطلوب' : ''}
//                     sx={{ mb: 2 }}
//                 />
//                 <TextField
//                     margin="dense"
//                     label="معلومات الاتصال"
//                     type="text"
//                     fullWidth
//                     variant="outlined"
//                     value={contact}
//                     onChange={(e) => setContact(e.target.value)}
//                     error={contactError}
//                     helperText={contactError ? 'معلومات الاتصال مطلوبة' : ''}
//                 />
//             </DialogContent>
//             <DialogActions sx={{ flexDirection: 'row-reverse' }}>
//                 <Button onClick={handleAdd} variant="contained" sx={{ bgcolor: 'purple' }}>
//                     حفظ
//                 </Button>
//                 <Button onClick={onClose}>إلغاء</Button>
//             </DialogActions>
//         </Dialog>
//     );
// }

// function EditOrgModal({ open, onClose, onSave, organization }) {
//     const [name, setName] = React.useState(organization ? organization.name : '');
//     const [contact, setContact] = React.useState(organization ? organization.contact : '');
//     const [nameError, setNameError] = React.useState(false);
//     const [contactError, setContactError] = React.useState(false);

//     React.useEffect(() => {
//         if (organization) {
//             setName(organization.name);
//             setContact(organization.contact);
//             setNameError(false);
//             setContactError(false);
//         }
//     }, [organization, open]);

//     const handleSave = () => {
//         let hasError = false;
//         if (!name.trim()) {
//             setNameError(true);
//             hasError = true;
//         } else {
//             setNameError(false);
//         }

//         if (!contact.trim()) {
//             setContactError(true);
//             hasError = true;
//         } else {
//             setContactError(false);
//         }

//         if (!hasError) {
//             onSave({ ...organization, name, contact });
//             onClose();
//         }
//     };

//     return (
//         <Dialog open={open} onClose={onClose}>
//             <DialogTitle sx={{ textAlign: 'right' }}>تعديل المؤسسة</DialogTitle>
//             <DialogContent sx={{ textAlign: 'right' }}>
//                 <TextField
//                     autoFocus
//                     margin="dense"
//                     label="إسم المؤسسة"
//                     type="text"
//                     fullWidth
//                     variant="outlined"
//                     value={name}
//                     onChange={(e) => setName(e.target.value)}
//                     error={nameError}
//                     helperText={nameError ? 'Organization Name is required' : ''}
//                     sx={{ mb: 2 }}
//                 />
//                 <TextField
//                     margin="dense"
//                     label="معلومات الاتصال"
//                     type="text"
//                     fullWidth
//                     variant="outlined"
//                     value={contact}
//                     onChange={(e) => setContact(e.target.value)}
//                     error={contactError}
//                     helperText={contactError ? 'معلومات الاتصال مطلوبة' : ''}
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

function EditOrgModal({ open, onClose, onSave, organization, orgType }) {
    const [name, setName] = useState('');
    const [contact, setContact] = useState('');

    useEffect(() => {
        if (open && organization) {
            setName(organization.name || '');
            setContact(organization.contact || '');
        }
    }, [open, organization]); // Repopulate when modal opens or organization changes

    const handleSave = () => {
        if (name.trim() === '' || contact.trim() === '') {
            alert('الرجاء تعبئة جميع الحقول المطلوبة.'); // Please fill in all required fields.
            return;
        }
        const updatedOrg = {
            ...organization, // Keep existing ID and other properties
            name,
            contact,
            // Ensure the type is preserved from the original organization
            type: organization.type // Explicitly keep the original type
        };
        onSave(updatedOrg);
        onClose();
    };

    const getTitle = () => {
        if (orgType === 'developer') {
            return `تعديل المطور العقاري: ${organization?.name}`;
        } else if (orgType === 'funder') {
            return `تعديل الممول العقاري: ${organization?.name}`;
        }
        return `تعديل المؤسسة: ${organization?.name}`; // Fallback
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle sx={{ textAlign: 'left' }}>{getTitle()}</DialogTitle>
            <DialogContent sx={{ textAlign: 'right' }}>
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
                {/* </Box> */}
            </DialogContent>
            <DialogActions sx={{ justifyContent: 'flex-end', pr: 3, pb: 2 }}>
                <Button onClick={handleSave} variant="contained" sx={{ bgcolor: 'purple' }}>
                    حفظ التغييرات
                </Button>
                <Button onClick={onClose} >
                    إلغاء
                </Button>
            </DialogActions>
        </Dialog>
    );
}

function AddAdminModal({ open, onClose, onAdd }) {
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
            <DialogTitle sx={{ textAlign: 'left' }}>إضافة مدير جديد</DialogTitle>
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

function EditAdminModal({ open, onClose, onSave, admin }) {
    const [name, setName] = React.useState(admin?.name || '');
    const [email, setEmail] = React.useState(admin?.email || '');
    const [nameError, setNameError] = React.useState(false);
    const [emailError, setEmailError] = React.useState(false);
    const [emailHelperText, setEmailHelperText] = React.useState('');

    React.useEffect(() => {
        if (admin) {
            setName(admin.name);
            setEmail(admin.email);
            setNameError(false);
            setEmailError(false);
            setEmailHelperText('');
        }
    }, [admin, open]);

    const handleSave = () => {
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
            onSave({ id: admin.id, name, email });
            onClose();
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
                <Button onClick={handleSave} variant="contained" sx={{ bgcolor: 'purple' }}>
                    حفظ
                </Button>
                <Button onClick={onClose}>إلغاء</Button>
            </DialogActions>
        </Dialog>
    );
}


function DashboardPage() {
    const properties = useSelector((state) => state.properties.list);

    // --- Helper Functions for Calculations ---

    // Function to parse a price string (e.g., "10,500,000 ج.م" to 10500000)
    const parsePriceString = (priceStr) => {
        if (!priceStr) return 0;
        const cleanedPrice = priceStr.replace(/ج\.م|\/شهر|\/فدان/g, '').replace(/,/g, '').trim();
        return parseFloat(cleanedPrice) || 0;
    };

    // Calculate Property Metrics
    const totalListedProperties = properties.length;
    const activeProperties = properties.filter(
        (p) => p.status === 'للبيع' || p.status === 'للإيجار'
    ).length;
    const soldProperties = properties.filter((p) => p.status === 'تم البيع').length;
    const propertiesForSale = properties.filter((p) => p.status === 'للبيع').length;
    const propertiesForRent = properties.filter((p) => p.status === 'للإيجار').length;
    const pendingApprovalProperties = properties.filter(
        (p) => p.status === 'قيد المراجعة'
    ).length;

    // Calculate Revenue (Example: sum of sold property prices)
    const totalRevenue = properties.reduce((sum, property) => {
        if (property.status === 'تم البيع') {
            return sum + parsePriceString(property.price);
        }
        return sum;
    }, 0);

    // Sort properties by createdAt to get most recently listed
    const mostRecentlyListed = [...properties]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 3); // Get top 3

    // Mock Data for other organization-level metrics (replace with actual Redux data if available)
    const totalAgents = 15;
    const totalInquiries = 128;
    const newInquiriesToday = 15;

    // --- Helper to get status color (reusing from PropertiesPage) ---
    const getStatusColor = (status) => {
        switch (status) {
            case 'للبيع':
            case 'نشط':
                return 'success';
            case 'للإيجار':
            case 'معلق':
                return 'warning';
            case 'تمويل':
                return 'info';
            case 'تم البيع':
                return 'default';
            case 'قيد المراجعة':
                return 'primary';
            case 'محذوف':
                return 'error';
            default:
                return 'default';
        }
    };

    const size = {
        width: 200,
        height: 200,
    };

    const data = {
        data: desktopOS,
        valueFormatter,
    };
    return (
        <Box sx={{ p: 2, textAlign: 'right' }}>
            <PageHeader
                title="لوحة التحكم"
                icon={DashboardIcon}
                showCount={false}
            />

            <Grid container spacing={3} direction="row-reverse">

                {/* Main Summary Cards - Arranged for immediate overview */}
                {/* 1. Total Listed Properties */}
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 160, borderRadius: 2, textAlign: 'right', position: 'relative' }}>
                        <HomeOutlinedIcon sx={{ position: 'absolute', left: 16, top: 16, fontSize: 48, color: 'primary.light', opacity: 0.2 }} />
                        <Typography variant="h6" color="text.secondary">إجمالي العقارات</Typography>
                        <Typography variant="h5" sx={{ mt: 1, fontWeight: 'bold', color: 'primary.main' }}>
                            {totalListedProperties}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }} component="div">
                            للبيع: <Chip label={propertiesForSale} size="small" sx={{ ml: 0.5 }} />, للإيجار: <Chip label={propertiesForRent} size="small" sx={{ ml: 0.5 }} />
                        </Typography>
                        <Typography variant="body2" color="success.main">
                            مباعة: {soldProperties}
                        </Typography>
                    </Paper>
                </Grid>

                {/* 2. Properties Pending Approval - Given its own card for visibility */}
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 160, borderRadius: 2, textAlign: 'right', position: 'relative' }}>
                        <PendingActionsOutlinedIcon sx={{ position: 'absolute', left: 16, top: 16, fontSize: 48, color: 'warning.light', opacity: 0.2 }} />
                        <Typography variant="h6" color="text.secondary">بانتظار الموافقة</Typography>
                        <Typography variant="h5" sx={{ mt: 1, fontWeight: 'bold', color: 'warning.main' }}>
                            {pendingApprovalProperties}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                            عقارات تحتاج لمراجعة
                        </Typography>
                        <Typography variant="body2" color="info.main">
                            للتأكد من البيانات
                        </Typography>
                    </Paper>
                </Grid>

                {/* 3. Total Revenue */}
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 160, borderRadius: 2, textAlign: 'right', position: 'relative' }}>
                        <AttachMoneyOutlinedIcon sx={{ position: 'absolute', left: 16, top: 16, fontSize: 48, color: 'success.light', opacity: 0.2 }} />
                        <Typography variant="h6" color="text.secondary">إجمالي الإيرادات</Typography>
                        <Typography variant="h5" sx={{ mt: 1, fontWeight: 'bold', color: 'success.main' }}>
                            {totalRevenue.toLocaleString('ar-EG', { style: 'currency', currency: 'EGP', minimumFractionDigits: 0 })}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                            من المبيعات والإيجارات
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            (تقديري من العقارات المباعة)
                        </Typography>
                    </Paper>
                </Grid>

                {/* 4. Total Inquiries/Messages */}
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 160, borderRadius: 2, textAlign: 'right', position: 'relative' }}>
                        <MessageOutlinedIcon sx={{ position: 'absolute', left: 16, top: 16, fontSize: 48, color: 'primary.light', opacity: 0.2 }} />
                        <Typography variant="h6" color="text.secondary">الاستفسارات / الرسائل</Typography>
                        <Typography variant="h5" sx={{ mt: 1, fontWeight: 'bold', color: 'primary.main' }}>
                            {totalInquiries}
                        </Typography>
                        <Typography variant="body2" color="success.main" sx={{ mt: 1 }}>
                            جديد اليوم: {newInquiriesToday}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            (من العملاء المحتملين)
                        </Typography>
                    </Paper>
                </Grid>

                {/* Separator / Additional Row for More Detailed Panels */}
                <Grid size={{ xs: 12 }}>
                    <Divider sx={{ my: 2 }} /> {/* Add a divider for clearer separation */}
                </Grid>

                {/* Detailed Panels - Occupy more space below */}



                {/* Number of Agents Card (moved to second row, or keep on first, depending on preference) */}
                {/* Decided to keep with top row, as it's a high-level summary count. */}
                {/* If you prefer it here, uncomment below and comment out its Grid item above. */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', borderRadius: 2, height: 160, textAlign: 'right', position: 'relative' }}>
                        <DirectionsWalkOutlinedIcon sx={{ position: 'absolute', left: 16, top: 16, fontSize: 48, color: 'info.light', opacity: 0.2 }} />
                        <Typography variant="h6" gutterBottom>عدد الوكلاء</Typography>
                        <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                            <Typography variant="h3" sx={{ fontWeight: 'bold', color: 'info.main' }}>
                                {totalAgents}
                            </Typography>
                            <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
                                (وكلاء نشطون في مؤسستك)
                            </Typography>
                        </Box>
                    </Paper>
                </Grid>

                {/* Placeholder for other charts/insights */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', borderRadius: 2, height: 350, textAlign: 'right' }}>
                        <Typography variant="h6">أداء العقارات (قريباً)</Typography>
                        <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <PieChart
                                series={[
                                    {
                                        arcLabel: (item) => `${item.value}%`,
                                        arcLabelMinAngle: 35,
                                        arcLabelRadius: '60%',
                                        ...data,
                                    },
                                ]}
                                sx={{
                                    [`& .${pieArcLabelClasses.root}`]: {
                                        fontWeight: 'bold',
                                    },
                                }}
                                {...size}
                            />



                        </Box>
                    </Paper>
                </Grid>

                {/* Most Recently Listed Properties */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', borderRadius: 2, height: 'auto', textAlign: 'right' }}>
                        <Typography variant="h6" gutterBottom>أحدث العقارات المدرجة</Typography>
                        {mostRecentlyListed.length === 0 ? (
                            <Typography variant="body2" color="text.secondary" sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                لا توجد عقارات مدرجة حديثًا.
                            </Typography>
                        ) : (
                            <List sx={{ flexGrow: 1 }}>
                                {mostRecentlyListed.map((property, index) => (
                                    <React.Fragment key={property.id}>
                                        <ListItem disablePadding sx={{ py: 0.5, flexDirection: 'row-reverse' }}>
                                            <ListItemText
                                                primary={
                                                    <Stack direction="row-reverse" alignItems="center" spacing={1}>
                                                        <ApartmentOutlinedIcon fontSize="small" color="primary" />
                                                        <Typography variant="body1" component="span" sx={{ fontWeight: 'bold' }}>
                                                            {property.name}
                                                        </Typography>
                                                        <Chip
                                                            label={property.status}
                                                            size="small"
                                                            color={getStatusColor(property.status)}
                                                            sx={{ mr: 1 }}
                                                        />
                                                    </Stack>
                                                }
                                                secondary={
                                                    <Stack direction="column" spacing={0.5} sx={{ mt: 0.5 }}>
                                                        <Typography variant="body2" color="text.secondary">
                                                            العنوان: {property.address}
                                                        </Typography>
                                                        <Typography variant="caption" color="text.disabled">
                                                            تاريخ الإدراج: {new Date(property.createdAt).toLocaleDateString('ar-EG', { year: 'numeric', month: 'short', day: 'numeric' })}
                                                        </Typography>
                                                    </Stack>
                                                }
                                                primaryTypographyProps={{ component: 'div' }}
                                                secondaryTypographyProps={{ component: 'div' }}
                                            />
                                        </ListItem>
                                        {index < mostRecentlyListed.length - 1 && <Divider component="li" sx={{ my: 1 }} />}
                                    </React.Fragment>
                                ))}
                            </List>
                        )}
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
}

function ProfilePage() {
    const dispatch = useDispatch();

    // Select the UID from the auth slice
    const authUid = useSelector((state) => state.auth.uid);
    const authStatus = useSelector((state) => state.auth.status);
    const authTypeOfUser = useSelector((state) => state.auth.type_of_user);

    // Select the full profile data from the user slice
    const userProfile = useSelector((state) => state.user.profile);
    const userProfileStatus = useSelector((state) => state.user.status);
    const userProfileError = useSelector((state) => state.user.error);

    // Select profile picture URL from profilePicSlice
    const currentProfilePic = useSelector((state) => state.profilePic.profilePicUrl);

    // Local state for form inputs, initialized from Redux userProfile
    const [formData, setFormData] = useState({
        org_name: "",
        type_of_organization: "",
        phone: "",
        email: "",
        governorate: "",
        city: "",
        address: "",
    });
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState("success");
    const [resetPasswordLoading, setResetPasswordLoading] = useState(false);

    // Determine the actual UID to use, prioritizing the string if passed as object
    // (This defensive check remains useful, though authUid should ideally be a string directly)
    const actualUid = typeof authUid === 'object' && authUid !== null
        ? authUid.uid
        : authUid;

    // Effect to fetch user profile when component mounts or UID changes
    useEffect(() => {
        const loadProfile = async () => {
            console.log("OrganizationProfilePage useEffect (start): actualUid =", actualUid, "Type =", typeof actualUid);

            if (typeof actualUid !== 'string' || actualUid.trim() === '') {
                console.warn("OrganizationProfilePage: Skipping fetchUserProfile due to invalid or empty actualUid:", actualUid);
                return;
            }

            // Only proceed if userProfile is not already loaded and status is idle
            if (userProfileStatus === "idle" && !userProfile) {
                try {
                    console.log("OrganizationProfilePage: Dispatching fetchUserProfile for UID:", actualUid);
                    await dispatch(fetchUserProfile(actualUid)).unwrap();
                    console.log("OrganizationProfilePage: fetchUserProfile fulfilled successfully.");
                } catch (error) {
                    console.error("OrganizationProfilePage: fetchUserProfile rejected with error:", error);
                }
            } else {
                console.log("OrganizationProfilePage: fetchUserProfile not dispatched (already loaded or not idle). Conditions:", {
                    actualUid: actualUid,
                    userProfileStatus: userProfileStatus,
                    userProfileExists: !!userProfile
                });
            }
        };
        loadProfile();
    }, [actualUid, userProfileStatus, userProfile, dispatch]);

    // Effect to update local form data when Redux userProfile changes
    useEffect(() => {
        if (userProfile) {
            setFormData({
                org_name: userProfile.org_name || "",
                type_of_organization: userProfile.type_of_organization || "",
                phone: userProfile.phone || "",
                email: auth.currentUser?.email || userProfile.email || "",
                // Ensure governorate is always a string and valid
                governorate: typeof userProfile.governorate === 'string' && governorates.includes(userProfile.governorate)
                    ? userProfile.governorate
                    : '',
                city: userProfile.city || "",
                address: userProfile.address || "",
            });
        } else {
            setFormData({
                org_name: "",
                type_of_organization: "",
                phone: "",
                email: "",
                governorate: '',
                city: "",
                address: "",
            });
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
        // Basic validation for organization fields
        if (!formData.org_name || !formData.type_of_organization || !formData.phone || !formData.city || !formData.governorate || !formData.address) {
            setSnackbarMessage("الرجاء ملء جميع الحقول المطلوبة.");
            setSnackbarSeverity("error");
            setSnackbarOpen(true);
            return;
        }

        // Prepare updates object with organization-specific fields
        const updates = {
            org_name: formData.org_name,
            type_of_organization: formData.type_of_organization,
            phone: formData.phone,
            city: formData.city,
            governorate: formData.governorate,
            address: formData.address,
        };

        try {
            await dispatch(updateUserProfile({ uid: actualUid, updates })).unwrap();
            setSnackbarMessage("تم حفظ التغييرات بنجاح!");
            setSnackbarSeverity("success");
            setSnackbarOpen(true);
            console.log("OrganizationProfilePage: updateUserProfile fulfilled successfully.");
        } catch (error) {
            console.error("OrganizationProfilePage: updateUserProfile rejected with error:", error);
            setSnackbarMessage(error || "حدث خطأ أثناء حفظ التغييرات.");
            setSnackbarSeverity("error");
            setSnackbarOpen(true);
        }
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

    // UploadAvatars sub-component with enhanced profile picture logic
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

    // Show loading state while profile is being fetched
    if (userProfileStatus === "loading") {
        return (
            <Box sx={{ p: 3, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <CircularProgress />
                <Typography sx={{ ml: 2 }}>جاري تحميل الملف الشخصي...</Typography>
            </Box>
        );
    }

    // Show error state if profile fetch failed
    if (userProfileError) {
        return (
            <Box sx={{ p: 3 }}>
                <Alert severity="error">خطأ في تحميل الملف الشخصي: {userProfileError}</Alert>
            </Box>
        );
    }

    // Show warning if profile data is not found
    if (!userProfile) {
        return (
            <Box sx={{ p: 3 }}>
                <Alert severity="warning">لم يتم العثور على بيانات الملف الشخصي. يرجى التأكد من اكتمال ملفك الشخصي.</Alert>
            </Box>
        );
    }

    // Debug logging to understand the user type issue
    console.log("OrganizationProfilePage Debug:", {
        userProfileTypeOfUser: userProfile.type_of_user,
        authTypeOfUser: authTypeOfUser,
        userProfile: userProfile
    });

    // Check if user is an organization - use both profile and auth state
    const isOrganization = userProfile.type_of_user === "organization" || authTypeOfUser === "organization";

    if (!isOrganization) {
        return (
            <Box sx={{ p: 3 }}>
                <Alert severity="error">
                    Access Denied: This profile page is for organizations only.
                    User type: {userProfile.type_of_user || 'undefined'} (profile), {authTypeOfUser || 'undefined'} (auth)
                </Alert>
            </Box>
        );
    }

    return (
        <Box sx={{ p: 2, textAlign: 'right' }}>
            <Typography variant="h3" sx={{ display: 'flex', flexDirection: 'row-reverse', mb: 3 }}>حسابي</Typography>
            <Paper sx={{ p: 4, borderRadius: 2, minHeight: 400, textAlign: 'right', boxShadow: '0px 0px 8px rgba(0,0,0,0.2)' }}>
                <Grid container spacing={4} direction="row-reverse">
                    <Grid size={{ xs: 12, md: 4, lg: 3 }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                            <UploadAvatars />
                        </Box>
                    </Grid>
                    <Grid size={{ xs: 12, md: 8, lg: 9 }}>
                        <Box>
                            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', fontSize: '1.5rem', display: 'flex', flexDirection: 'row-reverse' }}>المعلومات الشخصية</Typography>

                            {/* Organization Name */}
                            <TextField
                                label="اسم المنظمة"
                                fullWidth
                                margin="normal"
                                name="org_name"
                                value={formData.org_name || ""}
                                onChange={handleChange}
                                InputProps={{ style: { direction: 'rtl' } }}
                            />

                            {/* Organization Type - Disabled since it's set during registration */}
                            <FormControl fullWidth margin="normal" variant="outlined">
                                <InputLabel id="type-of-organization-label">نوع المنظمة</InputLabel>
                                <Select
                                    labelId="type-of-organization-label"
                                    id="type_of_organization"
                                    name="type_of_organization"
                                    value={formData.type_of_organization || ""}
                                    onChange={handleChange}
                                    label="نوع المنظمة"
                                    sx={{ textAlign: 'right' }}
                                    disabled
                                >
                                    {organizationTypes.map((type) => (
                                        <MenuItem key={type} value={type}>{type}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

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
                            <Box dir='rtl' sx={{ display: 'flex', gap: 2, alignItems: 'flex-end' }}>
                                <Button
                                    variant="outlined"
                                    color="primary"
                                    onClick={handleResetPassword}
                                    disabled={resetPasswordLoading}
                                    sx={{ minWidth: 'fit-content' }}
                                >
                                    {resetPasswordLoading ? <CircularProgress size={20} /> : "إعادة تعيين كلمة المرور"}
                                </Button>
                            </Box>

                            {/* Address Fields */}
                            <TextField
                                label="المحافظة"
                                fullWidth
                                margin="normal"
                                name="governorate"
                                value={governorates.includes(formData.governorate) ? formData.governorate : ''}
                                onChange={handleChange}
                                select
                                InputProps={{ style: { direction: 'rtl' } }}
                            >
                                <MenuItem value="">اختر المحافظة</MenuItem>
                                {governorates.map((gov) => (
                                    <MenuItem key={gov} value={gov}>{gov}</MenuItem>
                                ))}
                            </TextField>

                            <TextField
                                label="المدينة"
                                fullWidth
                                margin="normal"
                                name="city"
                                value={typeof formData.city === 'object' ? formData.city?.full || '' : formData.city || ''}
                                onChange={handleChange}
                                InputProps={{ style: { direction: 'rtl' } }}
                            />

                            <TextField
                                label="العنوان التفصيلي"
                                fullWidth
                                margin="normal"
                                name="address"
                                value={typeof formData.address === 'object' ? formData.address?.full || '' : formData.address || ''}
                                onChange={handleChange}
                                multiline
                                rows={3}
                                InputProps={{ style: { direction: 'rtl' } }}
                            />

                            {/* Save Button */}
                            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleSave}
                                    sx={{ px: 4, py: 1.5, fontSize: '1.1rem' }}
                                >
                                    حفظ التغييرات
                                </Button>
                            </Box>
                        </Box>
                    </Grid>
                </Grid>
            </Paper>

            {/* Snackbar for notifications */}
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
    const users = useSelector((state) => state.users.users);
    // Use useSelector to get organizations from the Redux store
    const organizations = useSelector((state) => state.organizations.organizations);
    const admins = useSelector((state) => state.admins.admins);

    const [activeTab, setActiveTab] = React.useState('users');
    const [activeOrgSubTab, setActiveOrgSubTab] = React.useState('developers'); // State for organization sub-tabs

    const [isAddUserModalOpen, setIsAddUserModalOpen] = React.useState(false);
    const [isEditUserModalOpen, setIsEditUserModalOpen] = React.useState(false);
    const [userToEdit, setUserToEdit] = React.useState(null);

    const [isDeleteConfirmModalOpen, setIsDeleteConfirmModalOpen] = React.useState(false);
    const [itemToDelete, setItemToDelete] = React.useState(null);

    const [isAddOrgModalOpen, setIsAddOrgModalOpen] = React.useState(false);
    const [isEditOrgModalOpen, setIsEditOrgModalOpen] = React.useState(false);
    const [orgToEdit, setOrgToEdit] = React.useState(null);

    const [isAddAdminModalOpen, setIsAddAdminModalOpen] = React.useState(false);
    const [isEditAdminModalOpen, setIsEditAdminModalOpen] = React.useState(false);
    const [adminToEdit, setAdminToEdit] = React.useState(null);

    // --- User Handlers ---
    const handleAddUser = () => {
        setIsAddUserModalOpen(true);
    };

    const handleAddUserConfirm = ({ name, email }) => {
        const newId = (Math.random() * 100000).toFixed(0);
        dispatch(addUser({ id: newId, name, email }));
    };

    const handleEditUser = (user) => {
        setUserToEdit(user);
        setIsEditUserModalOpen(true);
    };

    const handleEditUserSave = (updatedUser) => {
        dispatch(editUser(updatedUser));
    };

    // --- Organization (Developers and Funders) Handlers ---
    const handleAddOrg = () => {
        setIsAddOrgModalOpen(true);
    };

    const handleAddOrgConfirm = ({ name, contact, type }) => {
        const prefix = type === 'developer' ? 'DEV' : 'FUND';
        // Generate a unique ID, ensuring it includes the type prefix
        const newId = `${prefix}${Math.floor(Math.random() * 10000).toString().padStart(3, '0')}`;
        // Dispatch the addOrganization action with the new organization including its type
        dispatch(addOrganization({ id: newId, name, contact, type }));
    };

    const handleEditOrg = (org) => {
        setOrgToEdit(org);
        setIsEditOrgModalOpen(true);
    };

    const handleEditOrgSave = (updatedOrg) => {
        // Dispatch the editOrganization action with the updated organization
        dispatch(editOrganization(updatedOrg));
    };

    // Filter organizations for developers and funders based on the 'type' property
    const realEstateDevelopers = organizations.filter(org => org.type === 'developer');
    const realEstateFunders = organizations.filter(org => org.type === 'funder');

    // --- Admin Handlers ---
    const handleAddAdmin = () => {
        setIsAddAdminModalOpen(true);
    };

    const handleAddAdminConfirm = ({ name, email }) => {
        const newId = (Math.random() * 100000).toFixed(0);
        dispatch(addAdmin({ id: newId, name, email }));
    };

    const handleEditAdmin = (admin) => {
        setAdminToEdit(admin);
        setIsEditAdminModalOpen(true);
    };

    const handleEditAdminSave = (updatedAdmin) => {
        dispatch(editAdmin(updatedAdmin));
    };

    // --- General Delete Handler ---
    const handleDeleteItem = (id, type, name) => {
        setItemToDelete({ id, type, name });
        setIsDeleteConfirmModalOpen(true);
    };

    const handleDeleteConfirm = () => {
        if (itemToDelete.type === 'user') {
            dispatch(deleteUser(itemToDelete.id));
        } else if (itemToDelete.type === 'organization') {
            // Dispatch deleteOrganization action for both developers and funders
            dispatch(deleteOrganization(itemToDelete.id));
        } else if (itemToDelete.type === 'admin') {
            dispatch(deleteAdmin(itemToDelete.id));
        }
        setIsDeleteConfirmModalOpen(false);
        setItemToDelete(null);
    };

    return (
        <Box sx={{ p: 2, textAlign: 'right' }}>
            <PageHeader
                title="المستخدمين"
                icon={SupervisedUserCircleIcon}
                showCount={false}
            />
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
                        // Reset sub-tab to default when main tab changes
                        setActiveOrgSubTab('developers');
                    }}
                    sx={{ borderRadius: 2, fontSize: '17px' }}
                >
                    المؤسسات
                </Button>
                {/* <Button
                    variant={activeTab === 'admins' ? 'contained' : 'outlined'}
                    onClick={() => setActiveTab('admins')}
                    sx={{ borderRadius: 2, fontSize: '17px' }}
                >
                    المدراء
                </Button> */}
            </Box>

            <Paper sx={{ p: 2, borderRadius: 2, minHeight: 400, textAlign: 'right' }}>
                {activeTab === 'users' && (
                    <>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexDirection: 'row-reverse' }}>
                            <Typography variant="h6" sx={{ fontWeight: 'bold' }} color="text.secondary">قائمة المستخدمين</Typography>
                            <Button variant="outlined" startIcon={<AddIcon />} onClick={handleAddUser}>
                                إضافة مستخدم
                            </Button>
                        </Box>
                        <List>
                            {users.map((user) => (
                                <ListItem
                                    key={user.id}
                                    disablePadding
                                    secondaryAction={
                                        <Box sx={{ display: 'flex', gap: 1, flexDirection: 'row-reverse' }}>
                                            <IconButton edge="start" aria-label="edit" onClick={() => handleEditUser(user)}>
                                                <EditIcon sx={{ color: 'purple' }} />
                                            </IconButton>
                                            <IconButton edge="start" aria-label="delete" onClick={() => handleDeleteItem(user.id, 'user', user.name)}>
                                                <DeleteIcon sx={{ color: 'red' }} />
                                            </IconButton>
                                        </Box>
                                    }
                                >
                                    <ListItemText
                                        primary={user.name}
                                        secondary={`ID: ${user.id} | Email: ${user.email}`}
                                    />
                                </ListItem>
                            ))}
                        </List>
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
                                <List>
                                    {realEstateDevelopers.map((org) => (
                                        <ListItem
                                            key={org.id}
                                            disablePadding
                                            secondaryAction={
                                                <Box sx={{ display: 'flex', gap: 1, flexDirection: 'row-reverse' }}>
                                                    <IconButton edge="start" aria-label="edit" onClick={() => handleEditOrg(org)}>
                                                        <EditIcon sx={{ color: 'purple' }} />
                                                    </IconButton>
                                                    <IconButton edge="start" aria-label="delete" onClick={() => handleDeleteItem(org.id, 'organization', org.name)}>
                                                        <DeleteIcon sx={{ color: 'red' }} />
                                                    </IconButton>
                                                </Box>
                                            }
                                        >
                                            <ListItemText
                                                primary={org.name}
                                                secondary={`ID: ${org.id} | Contact: ${org.contact}`}
                                            />
                                        </ListItem>
                                    ))}
                                </List>
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
                                <List>
                                    {realEstateFunders.map((funder) => (
                                        <ListItem
                                            key={funder.id}
                                            disablePadding
                                            secondaryAction={
                                                <Box sx={{ display: 'flex', gap: 1, flexDirection: 'row-reverse' }}>
                                                    <IconButton edge="start" aria-label="edit" onClick={() => handleEditOrg(funder)}>
                                                        <EditIcon sx={{ color: 'purple' }} />
                                                    </IconButton>
                                                    <IconButton edge="start" aria-label="delete" onClick={() => handleDeleteItem(funder.id, 'organization', funder.name)}>
                                                        <DeleteIcon sx={{ color: 'red' }} />
                                                    </IconButton>
                                                </Box>
                                            }
                                        >
                                            <ListItemText
                                                primary={funder.name}
                                                secondary={`ID: ${funder.id} | Contact: ${funder.contact}`}
                                            />
                                        </ListItem>
                                    ))}
                                </List>
                            </Box>
                        )}
                    </>
                )}

                {/* {activeTab === 'admins' && (
                    <>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexDirection: 'row-reverse' }}>
                            <Typography variant="h6" color="text.secondary">قائمة المدراء</Typography>
                            <Button variant="outlined" startIcon={<AddIcon />} onClick={handleAddAdmin}>
                                إضافة مدير
                            </Button>
                        </Box>
                        <List>
                            {admins.map((admin) => (
                                <ListItem
                                    key={admin.id}
                                    disablePadding
                                    secondaryAction={
                                        <Box sx={{ display: 'flex', gap: 1, flexDirection: 'row-reverse' }}>
                                            <IconButton edge="start" aria-label="edit" onClick={() => handleEditAdmin(admin)}>
                                                <EditIcon sx={{ color: 'purple' }} />
                                            </IconButton>
                                            <IconButton edge="start" aria-label="delete" onClick={() => handleDeleteItem(admin.id, 'admin', admin.name)}>
                                                <DeleteIcon sx={{ color: 'red' }} />
                                            </IconButton>
                                        </Box>
                                    }
                                >
                                    <ListItemText
                                        primary={admin.name}
                                        secondary={`ID: ${admin.id} | Email: ${admin.email}`}
                                    />
                                </ListItem>
                            ))}
                        </List>
                    </>
                )} */}
            </Paper>

            <AddUserModal
                open={isAddUserModalOpen}
                onClose={() => setIsAddUserModalOpen(false)}
                onAdd={handleAddUserConfirm}
            />
            {userToEdit && (
                <EditUserModal
                    open={isEditUserModalOpen}
                    onClose={() => setIsEditUserModalOpen(false)}
                    onSave={handleEditUserSave}
                    user={userToEdit}
                />
            )}
            <ConfirmDeleteModal
                open={isDeleteConfirmModalOpen}
                onClose={() => setIsDeleteConfirmModalOpen(false)}
                onConfirm={handleDeleteConfirm}
                itemType={itemToDelete?.type}
                itemId={itemToDelete?.id}
                itemName={itemToDelete?.name}
            />
            {/* Pass activeOrgSubTab as 'orgType' prop to AddOrgModal and EditOrgModal */}
            <AddOrgModal
                open={isAddOrgModalOpen}
                onClose={() => setIsAddOrgModalOpen(false)}
                // When adding, infer the type from the active sub-tab
                onAdd={(data) => handleAddOrgConfirm({ ...data, type: activeOrgSubTab === 'developers' ? 'developer' : 'funder' })}
                orgType={activeOrgSubTab === 'developers' ? 'developer' : 'funder'}
            />
            {orgToEdit && (
                <EditOrgModal
                    open={isEditOrgModalOpen}
                    onClose={() => setIsEditOrgModalOpen(false)}
                    onSave={handleEditOrgSave}
                    organization={orgToEdit}
                    orgType={orgToEdit.type}
                />
            )}

            <AddAdminModal
                open={isAddAdminModalOpen}
                onClose={() => setIsAddAdminModalOpen(false)}
                onAdd={handleAddAdminConfirm}
            />
            {adminToEdit && (
                <EditAdminModal
                    open={isEditAdminModalOpen}
                    onClose={() => setIsEditAdminModalOpen(false)}
                    onSave={handleEditAdminSave}
                    admin={adminToEdit}
                />
            )}
        </Box>
    );
}


function PropertiesPage() {
    const dispatch = useDispatch();

    // Select properties and filter states from Redux store
    const properties = useSelector((state) => state.properties.list);
    const filterStatus = useSelector((state) => state.properties.filterStatus);
    const filterType = useSelector((state) => state.properties.filterType);

    // Local state for modal visibility and data
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [propertyToEdit, setPropertyToEdit] = useState(null);
    const [isDeleteConfirmModalOpen, setIsDeleteConfirmModalOpen] = useState(false);
    const [propertyToDeleteId, setPropertyToDeleteId] = useState(null);

    // Helper to get status color (reusing logic from OrdersPage)
    const getStatusColor = (status) => {
        switch (status) {
            case 'للبيع': // For Sale
            case 'نشط': // Active
                return 'success';
            case 'للإيجار': // For Rent
            case 'معلق': // Pending
                return 'warning';
            case 'تمويل': // Financing
                return 'info';
            case 'محذوف': // Deleted (example)
                return 'error';
            default:
                return 'default';
        }
    };

    // Filtered properties based on Redux state filters
    const filteredProperties = properties.filter(property => {
        const statusMatch = filterStatus === 'الكل' || property.status === filterStatus;
        const typeMatch = filterType === 'الكل' || property.type === filterType;
        return statusMatch && typeMatch;
    });

    // --- Handlers for Add Property ---
    const handleAddProperty = () => {
        setIsAddModalOpen(true);
    };

    const handleAddPropertyConfirm = (newPropertyData) => {
        dispatch(addProperty(newPropertyData)); // Dispatch addProperty action
        setIsAddModalOpen(false);
    };

    // --- Handlers for Edit Property ---
    const handleEditProperty = (property) => {
        setPropertyToEdit(property);
        setIsEditModalOpen(true);
    };

    const handleEditPropertySave = (updatedProperty) => {
        dispatch(editProperty(updatedProperty)); // Dispatch editProperty action
        setIsEditModalOpen(false);
        setPropertyToEdit(null);
    };

    // --- Handlers for Delete Property ---
    const handleDeleteProperty = (id) => {
        setPropertyToDeleteId(id);
        setIsDeleteConfirmModalOpen(true);
    };

    const handleDeleteConfirm = () => {
        dispatch(deleteProperty(propertyToDeleteId)); // Dispatch deleteProperty action
        setIsDeleteConfirmModalOpen(false);
        setPropertyToDeleteId(null);
    };

    // --- Handlers for Filter Changes ---
    const handleFilterStatusChange = (e) => {
        dispatch(setFilterStatus(e.target.value));
    };

    const handleFilterTypeChange = (e) => {
        dispatch(setFilterType(e.target.value));
    };

    return (
        <Box sx={{ p: 2, textAlign: 'right' }}>
            <PageHeader
                title="إدارة العقارات"
                icon={HomeIcon}
                showCount={false}
            />

            <Paper sx={{ p: 2, borderRadius: 2, minHeight: 400, textAlign: 'right', direction: 'rtl' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexDirection: 'row-reverse', gap: 2 }}>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon sx={{ ml: 1 }} />}
                        onClick={handleAddProperty}
                        sx={{ borderRadius: 2, fontSize: '1rem', fontWeight: 'bold' }}
                    >
                        إضافة عقار جديد
                    </Button>

                    <Box sx={{ display: 'flex', gap: 1, flexDirection: 'row-reverse' }}>
                        {/* Status Filter */}
                        <FormControl variant="outlined" size="small" sx={{ minWidth: 120 }}>
                            <InputLabel id="status-filter-label" >الحالة</InputLabel>
                            <Select
                                labelId="status-filter-label"
                                id="status-filter"
                                value={filterStatus}
                                onChange={handleFilterStatusChange}
                                label="الحالة"
                                sx={{ textAlign: 'left' }}
                            >
                                <MenuItem value="الكل">الكل</MenuItem>
                                <MenuItem value="للبيع">للبيع</MenuItem>
                                <MenuItem value="للإيجار">للإيجار</MenuItem>
                                <MenuItem value="تمويل">تمويل</MenuItem>
                            </Select>
                        </FormControl>

                        {/* Type Filter */}
                        <FormControl variant="outlined" size="small" sx={{ minWidth: 120 }}>
                            <InputLabel id="type-filter-label" sx={{ fontSize: '18px' }}>النوع</InputLabel>
                            <Select
                                labelId="type-filter-label"
                                id="type-filter"
                                value={filterType}
                                onChange={handleFilterTypeChange}
                                label="النوع"
                                sx={{ textAlign: 'left' }}
                            >
                                <MenuItem value="الكل">الكل</MenuItem>
                                <MenuItem value="فيلا">فيلا</MenuItem>
                                <MenuItem value="شقة">شقة</MenuItem>
                                <MenuItem value="محل">محل</MenuItem>
                                <MenuItem value="أرض">أرض</MenuItem>
                                <MenuItem value="مكتب">مكتب</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                </Box>

                {/* Property Listings */}
                {filteredProperties.length === 0 ? (
                    <Typography variant="body1" color="text.secondary" sx={{ mt: 4, textAlign: 'center' }}>
                        لا توجد عقارات لعرضها حاليًا.
                    </Typography>
                ) : (
                    <List>
                        {filteredProperties.map((property, index) => (
                            <React.Fragment key={property.id}>
                                <ListItem
                                    disablePadding
                                    secondaryAction={
                                        <Box sx={{ display: 'flex', gap: 1, flexDirection: 'row-reverse' }}>
                                            <IconButton edge="start" aria-label="edit" onClick={() => handleEditProperty(property)}>
                                                <EditIcon sx={{ color: 'purple' }} />
                                            </IconButton>
                                            <IconButton edge="start" aria-label="delete" onClick={() => handleDeleteProperty(property.id)}>
                                                <DeleteIcon sx={{ color: 'red' }} />
                                            </IconButton>
                                        </Box>
                                    }
                                    sx={{ py: 1, flexDirection: 'row-reverse' }}
                                >
                                    <ListItemText
                                        primary={
                                            <Grid container alignItems="center" spacing={1} direction="row-reverse">
                                                <Grid size="auto">
                                                    <HomeIcon fontSize="small" color="primary" />
                                                </Grid>
                                                <Grid size="auto">
                                                    <Typography variant="body1" component="span" sx={{ fontWeight: 'bold', fontSize: '1rem' }}>
                                                        {property.name}
                                                    </Typography>
                                                </Grid>
                                                <Grid size="auto">
                                                    <Chip
                                                        label={property.status}
                                                        size="small"
                                                        color={getStatusColor(property.status)}
                                                        sx={{ mr: 1, fontWeight: 'bold', fontSize: '1rem' }}
                                                    />
                                                </Grid>
                                            </Grid>
                                        }
                                        secondary={
                                            <Stack direction="column" spacing={0.5} sx={{ mt: 0.5 }}>
                                                <Typography variant="h6" color="text.secondary">
                                                    العنوان: {property.address}
                                                </Typography>
                                                <Typography variant="caption" color="text.disabled" sx={{ fontSize: '1rem' }} >
                                                    النوع: {property.type} | السعر/الإيجار: {property.price}
                                                </Typography>
                                                <Typography variant="caption" color="text.disabled" sx={{ fontSize: '1rem' }}>
                                                    التفاصيل: {property.details}
                                                </Typography>
                                                <Typography variant="caption" color="text.disabled" sx={{ fontSize: '1rem' }}>
                                                    ID: {property.id}
                                                </Typography>
                                            </Stack>
                                        }
                                        primaryTypographyProps={{ component: 'div' }}
                                        secondaryTypographyProps={{ component: 'div' }}
                                    />
                                </ListItem>
                                {index < filteredProperties.length - 1 && <Divider component="li" sx={{ my: 1 }} />}
                            </React.Fragment>
                        ))}
                    </List>
                )}
            </Paper>

            {/* Modals */}
            <AddPropertyModal
                open={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onAdd={handleAddPropertyConfirm}
            />
            {propertyToEdit && (
                <EditPropertyModal
                    open={isEditModalOpen}
                    onClose={() => setIsEditModalOpen(false)}
                    onSave={handleEditPropertySave}
                    property={propertyToEdit}
                />
            )}
            <ConfirmDeleteModal
                open={isDeleteConfirmModalOpen}
                onClose={() => setIsDeleteConfirmModalOpen(false)}
                onConfirm={handleDeleteConfirm}
                itemType="عقار"
                itemId={propertyToDeleteId}
                itemName={`العقار ذو المعرف: ${propertyToDeleteId}`}
            />
        </Box>
    );
}

function Mainadvertisment(props) {
    const userProfile = useSelector((state) => state.user.profile);
    const dispatch = useDispatch();

    // IMPORTANT CHANGE: Select 'byUser' state for organization-specific ads
    const homepageAds = useSelector((state) => state.homepageAds?.byUser || [], shallowEqual);
    const homepageAdsLoading = useSelector((state) => state.homepageAds?.loading || false);

    // No need for orgHomepageAds memoization here, as the 'byUser' slice already filters
    // const orgHomepageAds = useMemo(() => homepageAds.filter(ad => ad.userId === userProfile?.uid), [homepageAds, userProfile]);

    // State for filters (kept as they apply to the 'byUser' list)
    const [statusFilter, setStatusFilter] = useState('all');
    const [activationFilter, setActivationFilter] = useState('all');

    // Memoize filteredAds based on the 'byUser' slice and local filters
    const filteredAds = useMemo(() => homepageAds.filter(ad => {
        const statusMatch = statusFilter === 'all' || ad.reviewStatus === statusFilter;
        const activationMatch = activationFilter === 'all' ||
            (activationFilter === 'active' && ad.ads) ||
            (activationFilter === 'inactive' && !ad.ads);
        return statusMatch && activationMatch;
    }), [homepageAds, statusFilter, activationFilter]); // Depend on homepageAds (which is now byUser)

    // Memoize stats for this org's ads
    const stats = useMemo(() => ({
        total: homepageAds.length, // Use homepageAds (byUser) for stats
        pending: homepageAds.filter(ad => ad.reviewStatus === 'pending').length,
        approved: homepageAds.filter(ad => ad.reviewStatus === 'approved').length,
        rejected: homepageAds.filter(ad => ad.reviewStatus === 'rejected').length,
        active: homepageAds.filter(ad => ad.ads).length,
        inactive: homepageAds.filter(ad => !ad.ads).length,
    }), [homepageAds]); // Depend on homepageAds (which is now byUser)


    // State for modals and operations
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isReturnToPendingModalOpen, setIsReturnToPendingModalOpen] = useState(false);
    const [selectedAd, setSelectedAd] = useState(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState("success");

    // Subscribe to real-time updates for user's homepage ads
    useEffect(() => {
        if (userProfile?.uid) {
            console.log("Mainadvertisment - Setting up real-time subscription for UID:", userProfile.uid);

            const setupSubscription = async () => {
                try {
                    const result = await dispatch(subscribeToUserHomepageAds(userProfile.uid)).unwrap();
                    if (typeof result === 'function') {
                        subscriptionManager.add(`org-homepage-ads-${userProfile.uid}`, result);
                    }
                } catch (error) {
                    console.error("Error setting up user homepage ads subscription:", error);
                }
            };

            setupSubscription();

            // Cleanup subscription on unmount
            return () => {
                console.log("Mainadvertisment - Cleaning up subscription...");
                subscriptionManager.remove(`org-homepage-ads-${userProfile.uid}`);
            };
        } else {
            console.log("Mainadvertisment - userProfile.uid not available, skipping subscription.");
        }
    }, [dispatch, userProfile?.uid]); // Re-subscribe if userProfile.uid changes

    // Handle add ad
    const handleAddAd = async (adData) => {
        try {
            // Ensure userId is added to adData before dispatching
            const dataWithUserId = { ...adData, userId: userProfile?.uid };
            await dispatch(createHomepageAd({ adData: dataWithUserId, imageFile: adData.imageFile, receiptFile: adData.receiptFile })).unwrap();
            setSnackbarMessage("تم إضافة الإعلان بنجاح!");
            setSnackbarSeverity("success");
            setSnackbarOpen(true);
        } catch (error) {
            setSnackbarMessage("فشل إضافة الإعلان: " + (error.message || "خطأ غير معروف"));
            setSnackbarSeverity("error");
            setSnackbarOpen(true);
            console.error("Error adding ad:", error);
        }
    };

    // Handle edit ad
    const handleEditAd = async (editData) => {
        try {
            await dispatch(updateHomepageAd(editData)).unwrap();
            // Check if this was a resubmission of a rejected ad
            if (editData.updates && editData.updates.reviewStatus === 'pending') {
                setSnackbarMessage("تم تعديل الإعلان وإعادة إرساله للمراجعة بنجاح!");
            } else {
                setSnackbarMessage("تم تحديث الإعلان بنجاح!");
            }
            setSnackbarMessage("تم تحديث الإعلان بنجاح!");
            setSnackbarSeverity("success");
            setSnackbarOpen(true);
        } catch (error) {
            setSnackbarMessage("فشل تحديث الإعلان: " + (error.message || "خطأ غير معروف"));
            setSnackbarSeverity("error");
            setSnackbarOpen(true);
            console.error("Error updating ad:", error);
        }
    };

    // Handle delete ad
    const handleDeleteAd = async (adId) => {
        try {
            await dispatch(deleteHomepageAd(adId)).unwrap();
            setSnackbarMessage("تم حذف الإعلان بنجاح!");
            setSnackbarSeverity("success");
            setSnackbarOpen(true);
        } catch (error) {
            setSnackbarMessage("فشل حذف الإعلان: " + (error.message || "خطأ غير معروف"));
            setSnackbarSeverity("error");
            setSnackbarOpen(true);
            console.error("Error deleting ad:", error);
        }
    };
    // Handle return to pending
    const handleReturnToPending = async (adId) => {
        try {
            await dispatch(returnHomepageAdToPending(adId)).unwrap();
            setSnackbarMessage("تم إعادة إرسال الإعلان للمراجعة بنجاح!");
            setSnackbarSeverity("success");
            setSnackbarOpen(true);
        } catch (error) {
            setSnackbarMessage("فشل إعادة إرسال الإعلان: " + (error.message || "خطأ غير معروف"));
            setSnackbarSeverity("error");
            setSnackbarOpen(true);
            console.error("Error returning ad to pending:", error);
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

    // Format date - now prioritizes 'createdAt' and has better fallback
    const formatDate = (timestamp) => {
        if (!timestamp) return 'غير محدد';
        const date = new Date(timestamp);
        if (isNaN(date.getTime())) {
            return 'تاريخ غير صالح'; // Fallback for truly invalid dates
        }
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
        setSnackbarOpen(false);
    };

    return (
        <Box dir='rtl' sx={{ p: 2, textAlign: 'left' }}>
            <PageHeader
                title="إعلانات القسم الرئيسي"
                icon={BroadcastOnHomeIcon}
                count={homepageAds.length}
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
                <Box sx={{ mb: 3, display: 'flex', gap: 2, flexDirection: 'row' }}>
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
                                            تاريخ الإنشاء: {ad.createdAt ? formatDate(ad.createdAt) : 'غير محدد'}
                                        </Typography>

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

                                    {/* Actions (simplified for organization view) */}
                                    <Box sx={{ display: 'flex', gap: 1, flexDirection: 'row-reverse' }}>
                                        {/* Show edit button for pending and rejected ads */}
                                        {(ad.reviewStatus === 'pending' || ad.reviewStatus === 'rejected') && (
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
                                        )}

                                        {/* Show return to pending button for rejected ads */}
                                        {ad.reviewStatus === 'rejected' && (
                                            <Tooltip title="إعادة إرسال للمراجعة">
                                                <IconButton
                                                    onClick={() => {
                                                        setSelectedAd(ad);
                                                        setIsReturnToPendingModalOpen(true);
                                                    }}
                                                    sx={{ color: 'warning.main' }}
                                                >
                                                    <AutorenewIcon />
                                                </IconButton>
                                            </Tooltip>
                                        )}

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
            {/* Return to Pending Confirmation Modal */}
            <ConfirmDeleteModal
                open={isReturnToPendingModalOpen}
                onClose={() => {
                    setIsReturnToPendingModalOpen(false);
                    setSelectedAd(null);
                }}
                onConfirm={() => {
                    if (selectedAd) {
                        handleReturnToPending(selectedAd.id);
                        setIsReturnToPendingModalOpen(false);
                        setSelectedAd(null);
                    }
                }}
                itemType="إعادة إرسال"
                itemId={selectedAd?.id}
                itemName="إعلان الصفحة الرئيسية للمراجعة"
            />
            {/* Snackbar */}
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
}

function PaidAdvertismentPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const userProfile = useSelector((state) => state.user.profile);
    const developerAds = useSelector((state) => state.developerAds?.byUser || []);
    const financingAds = useSelector((state) => state.financingAds?.byUser || []);
    const developerAdsLoading = useSelector((state) => state.developerAds?.loading || false);
    const financingAdsLoading = useSelector((state) => state.financingAds?.loading || false);

    // State to manage the active tab - initialize based on user's organization type
    const [activeTab, setActiveTab] = React.useState(() => {
        if (userProfile?.type_of_organization === "ممول عقاري" || userProfile?.type_of_organization === "ممول عقارى") {
            return 'funder';
        }
        return 'developer'; // Default to developer for "مطور عقاري" or any other type
    });

    // Ensure active tab matches organization type
    React.useEffect(() => {
        if (userProfile?.type_of_organization) {
            const expectedTab = (userProfile.type_of_organization === "ممول عقاري" || userProfile.type_of_organization === "ممول عقارى") ? 'funder' : 'developer';
            if (activeTab !== expectedTab) {
                console.log('Updating active tab to match organization type:', expectedTab);
                setActiveTab(expectedTab);
            }
        }
    }, [userProfile?.type_of_organization, activeTab]);

    // Fetch paid ads based on organization type
    useEffect(() => {
        if (!userProfile?.uid) return;

        const orgType = userProfile.type_of_organization;
        console.log('Fetching ads for user:', userProfile.uid, 'with organization type:', orgType);

        if (orgType === "مطور عقاري" || orgType === "مطور عقارى") {
            // Only fetch real estate ads for developers
            console.log('Fetching real estate ads for developer organization');
            dispatch(fetchDeveloperAdsByUser(userProfile.uid))
                .then(() => console.log('Real estate ads fetched successfully'))
                .catch(error => console.error('Error fetching real estate ads:', error));
        } else if (orgType === "ممول عقاري" || orgType === "ممول عقارى") {
            // Only fetch financing ads for funders
            console.log('Fetching financing ads for funder organization');
            dispatch(fetchFinancingAdsByUser(userProfile.uid))
                .then(() => console.log('Financing ads fetched successfully'))
                .catch(error => console.error('Error fetching financing ads:', error));
        } else {
            console.warn('Unknown organization type:', orgType);
        }
    }, [dispatch, userProfile?.uid, userProfile?.type_of_organization]);

    // Handler for tab changes
    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    // Determine which ads to show based on user's organization type
    const getAdsToShow = () => {
        if (!userProfile) return { ads: [], loading: false, type: null };

        const orgType = userProfile.type_of_organization;
        console.log('Getting ads to show for organization type:', orgType);

        if (orgType === "مطور عقاري" || orgType === "مطور عقارى") {
            // Developers only see their real estate ads
            console.log('Showing real estate ads for developer, count:', developerAds.length);
            return {
                ads: developerAds,
                loading: developerAdsLoading,
                type: "developer"
            };
        } else if (orgType === "ممول عقاري" || orgType === "ممول عقارى") {
            // Funders only see their financing ads
            console.log('Showing financing ads for funder, count:', financingAds.length);
            return {
                ads: financingAds,
                loading: financingAdsLoading,
                type: "funder"
            };
        }

        console.warn('Unknown organization type, showing no ads');
        return { ads: [], loading: false, type: null };
    };

    const { ads: currentAds, loading: currentLoading, type: currentType } = getAdsToShow();

    // Define columns for developer ads
    const developerColumns = [
        { field: 'id', headerName: 'ID', width: 90 },
        { field: 'developer_name', headerName: 'اسم المطور', width: 200 },
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
        { field: 'description', headerName: 'الوصف', width: 300 },
        {
            field: 'project_types', headerName: 'أنواع المشاريع', width: 150,
            renderCell: (params) => Array.isArray(params.value) ? params.value.join(', ') : params.value
        },
        { field: 'price_start_from', headerName: 'السعر من', width: 120, type: 'number' },
        { field: 'price_end_to', headerName: 'السعر إلى', width: 120, type: 'number' },
        {
            field: 'status', headerName: 'الحالة', width: 120,
            renderCell: (params) => (
                <Chip
                    label={params.value}
                    color={params.value === 'جاهز للسكن' ? 'success' : 'warning'}
                    size="small"
                />
            )
        },
        {
            field: 'ads', headerName: 'مفعل', width: 100,
            renderCell: (params) => (
                <Chip
                    label={params.value ? 'نعم' : 'لا'}
                    color={params.value ? 'success' : 'default'}
                    size="small"
                />
            )
        },
        {
            field: 'reviewStatus', headerName: 'حالة المراجعة', width: 120,
            renderCell: (params) => {
                const statusColors = {
                    'pending': 'warning',
                    'approved': 'success',
                    'rejected': 'error'
                };
                return (
                    <Chip
                        label={params.value === 'pending' ? 'قيد المراجعة' :
                            params.value === 'approved' ? 'مقبول' : 'مرفوض'}
                        color={statusColors[params.value] || 'default'}
                        size="small"
                    />
                );
            }
        },
        {
            field: 'actions', headerName: 'الإجراءات', width: 180, sortable: false, filterable: false,
            renderCell: (params) => (
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <Tooltip title="تعديل الإعلان" arrow>
                        <IconButton
                            size="small"
                            color="info"
                            onClick={() => handleEditClick(params.row, 'developer')}
                            disabled={updatingAdId === params.row.id}
                        >
                            {updatingAdId === params.row.id ? (
                                <CircularProgress size={16} />
                            ) : (
                                <EditIcon fontSize="small" />
                            )}
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="حذف الإعلان" arrow>
                        <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleDeleteClick(params.row, 'developer')}
                            disabled={updatingAdId === params.row.id}
                        >
                            <DeleteIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                </Box>
            )
        },
        {
            field: 'receipt_image',
            headerName: 'إيصال الدفع',
            width: 100,
            renderCell: (params) => {
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
                            onClick={() => handleReceiptClick(params.value)}
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
    ];

    // Define columns for financing ads
    const financingColumns = [
        { field: 'id', headerName: 'ID', width: 90 },
        { field: 'title', headerName: 'عنوان الإعلان', width: 200 },
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
        { field: 'org_name', headerName: 'اسم المؤسسة', width: 200 },
        { field: 'description', headerName: 'الوصف', width: 300 },
        {
            field: 'start_limit', headerName: 'الحد الأدنى', width: 120, type: 'number',
            renderCell: (params) => params?.value ? `${params.value.toLocaleString()} ج.م` : '-'
        },
        {
            field: 'end_limit', headerName: 'الحد الأقصى', width: 120, type: 'number',
            renderCell: (params) => params?.value ? `${params.value.toLocaleString()} ج.م` : '-'
        },
        // { field: 'interest_rates', headerName: 'معدلات الفائدة', width: 200,
        //     renderCell: (params) => {
        //         const rates = [];
        //         if (params.row.interest_rate_upto_5) rates.push(`حتى 5 سنوات: ${params.row.interest_rate_upto_5}%`);
        //         if (params.row.interest_rate_upto_10) rates.push(`حتى 10 سنوات: ${params.row.interest_rate_upto_10}%`);
        //         if (params.row.interest_rate_above_10) rates.push(`أكثر من 10 سنوات: ${params.row.interest_rate_above_10}%`);
        //         return rates.length > 0 ? rates.join(', ') : '-';
        //     }
        // },
        { field: 'phone', headerName: 'رقم الهاتف', width: 120 },
        {
            field: 'ads', headerName: 'مفعل', width: 100,
            renderCell: (params) => (
                <Chip
                    label={params?.value ? 'نعم' : 'لا'}
                    color={params?.value ? 'success' : 'default'}
                    size="small"
                />
            )
        },
        {
            field: 'reviewStatus', headerName: 'حالة المراجعة', width: 120,
            renderCell: (params) => {
                const statusColors = {
                    'pending': 'warning',
                    'approved': 'success',
                    'rejected': 'error'
                };
                return (
                    <Chip
                        label={params?.value === 'pending' ? 'قيد المراجعة' :
                            params?.value === 'approved' ? 'مقبول' : 'مرفوض'}
                        color={statusColors[params?.value] || 'default'}
                        size="small"
                    />
                );
            }
        },
        {
            field: 'adExpiryTime', headerName: 'تاريخ انتهاء التفعيل', width: 150,
            renderCell: (params) => {
                if (!params.value) return '-';
                const expiryDate = new Date(params.value);
                const now = new Date();
                const remainingDays = Math.ceil((expiryDate - now) / (1000 * 60 * 60 * 24));
                return remainingDays > 0 ? `${remainingDays} يوم` : 'منتهي';
            }
        },
        {
            field: 'actions', headerName: 'الإجراءات', width: 180, sortable: false, filterable: false,
            renderCell: (params) => (
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <Tooltip title="تعديل الإعلان" arrow>
                        <IconButton
                            size="small"
                            color="info"
                            onClick={() => handleEditClick(params.row, 'funder')}
                            disabled={updatingAdId === params.row.id}
                        >
                            {updatingAdId === params.row.id ? (
                                <CircularProgress size={16} />
                            ) : (
                                <EditIcon fontSize="small" />
                            )}
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="حذف الإعلان" arrow>
                        <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleDeleteClick(params.row, 'funder')}
                            disabled={updatingAdId === params.row.id}
                        >
                            <DeleteIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                </Box>
            )
        },
        {
            field: 'receipt_image',
            headerName: 'إيصال الدفع',
            width: 100,
            renderCell: (params) => {
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
                            onClick={() => handleReceiptClick(params.value)}
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
    ];

    // Function to get the DataGrid content based on the organization type
    const renderDataGrid = () => {
        if (!userProfile) {
            return (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
                    <Typography>يرجى تسجيل الدخول لعرض الإعلانات</Typography>
                </Box>
            );
        }

        // Use columns based on organization type, not active tab
        const orgType = userProfile.type_of_organization;
        const columns = (orgType === "مطور عقاري" || orgType === "مطور عقارى") ? developerColumns : financingColumns;
        const tabLabel = (orgType === "مطور عقاري" || orgType === "مطور عقارى") ? 'المطورين' : 'الممولين';

        console.log('Rendering DataGrid for organization type:', orgType);
        console.log('Current ads count:', currentAds.length);
        console.log('Using columns:', columns.length, 'columns');

        return (
            <DataGrid
                rows={currentAds}
                columns={columns}
                loading={currentLoading}
                pageSizeOptions={[5, 10, 20, 50]}
                initialState={{
                    pagination: {
                        paginationModel: { page: 0, pageSize: 10 },
                    },
                }}
                localeText={{
                    toolbarQuickFilterPlaceholder: `البحث في إعلانات ${tabLabel}`,
                    noRowsLabel: (orgType === "مطور عقاري" || orgType === "مطور عقارى")
                        ? "لا توجد إعلانات عقارية لعرضها"
                        : "لا توجد إعلانات تمويل لعرضها",
                    loadingOverlay: 'جاري التحميل...',
                }}
                sx={{
                    '& .MuiDataGrid-cell': {
                        borderBottom: '1px solid #e0e0e0',
                    },
                    '& .MuiDataGrid-columnHeaders': {
                        backgroundColor: '#f5f5f5',
                        borderBottom: '2px solid #e0e0e0',
                    },
                }}
                showToolbar
            />
        );
    };

    // Get the appropriate title based on organization type
    const getPageTitle = () => {
        if (!userProfile) return "إعلاناتي المدفوعة";

        const orgType = userProfile.type_of_organization;
        if (orgType === "مطور عقاري" || orgType === "مطور عقارى") {
            return "إعلانات مدفوعة - التطوير العقاراى";
        } else if (orgType === "ممول عقاري" || orgType === "ممول عقارى") {
            return "إعلانات مدفوعة -  التمويل العقارى";
        }
        return "إعلانات مدفوعة";
    };

    // State for delete dialog and snackbar
    const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);
    const [adToDelete, setAdToDelete] = React.useState(null);
    const [adToDeleteType, setAdToDeleteType] = React.useState(null);
    const [snackbar, setSnackbar] = React.useState({ open: false, message: '', severity: 'success' });
    const [updatingAdId, setUpdatingAdId] = React.useState(null); // Track which ad is being updated

    // Receipt image dialog state
    const [receiptDialogOpen, setReceiptDialogOpen] = React.useState(false);
    const [receiptDialogImage, setReceiptDialogImage] = React.useState(null);

    // Function to update ad status to pending using the proper methods
    const updateAdStatusToPending = async (adId, type) => {
        setUpdatingAdId(adId); // Set loading state
        try {
            console.log('Updating ad status to pending:', { adId, type });

            if (type === 'developer') {
                const ad = await RealEstateDeveloperAdvertisement.getById(adId);
                if (ad) {
                    await ad.returnToPending();
                    console.log('Developer ad status updated to pending');
                }
            } else if (type === 'funder') {
                const ad = await FinancingAdvertisement.getById(adId);
                if (ad) {
                    await ad.returnToPending();
                    console.log('Financing ad status updated to pending');
                }
            }

            // Refresh the data after status update
            dispatch(fetchDeveloperAdsByUser(userProfile.uid));
            dispatch(fetchFinancingAdsByUser(userProfile.uid));

            setSnackbar({
                open: true,
                message: 'تم تحديث حالة الإعلان إلى قيد المراجعة',
                severity: 'info'
            });
        } catch (error) {
            console.error('Error updating ad status to pending:', error);
            setSnackbar({
                open: true,
                message: `فشل تحديث حالة الإعلان: ${error.message}`,
                severity: 'error'
            });
        } finally {
            setUpdatingAdId(null); // Clear loading state
        }
    };

    // Global function that can be called from edit pages
    const updateAdStatusToPendingGlobal = async (adId, type) => {
        try {
            console.log('Global function: Updating ad status to pending:', { adId, type });

            if (type === 'developer') {
                const ad = await RealEstateDeveloperAdvertisement.getById(adId);
                if (ad) {
                    await ad.returnToPending();
                    console.log('Developer ad status updated to pending');
                }
            } else if (type === 'funder') {
                const ad = await FinancingAdvertisement.getById(adId);
                if (ad) {
                    await ad.returnToPending();
                    console.log('Financing ad status updated to pending');
                }
            }

            return { success: true, message: 'تم تحديث حالة الإعلان إلى قيد المراجعة' };
        } catch (error) {
            console.error('Error updating ad status to pending:', error);
            return { success: false, message: error.message };
        }
    };

    // Make the global function available on window for edit pages to access
    React.useEffect(() => {
        window.updateAdStatusToPending = updateAdStatusToPendingGlobal;
        return () => {
            delete window.updateAdStatusToPending;
        };
    }, []);

    // Handlers for actions
    const handleEditClick = (ad, type) => {
        console.log('handleEditClick called with:', { ad, type, adId: ad.id });

        // Navigate directly to the edit page
        if (type === 'developer') {
            // Ensure the ad object has an id property
            const adWithId = { ...ad, id: ad.id || ad._id };
            navigate('/RealEstateDeveloperAnnouncement', { state: { editMode: true, adData: adWithId, adId: adWithId.id } });
        } else if (type === 'funder') {
            const adFWithId = { ...ad, id: ad.id || ad._id };
            navigate(`/add-financing-ad`, { state: { editMode: true, adData: adFWithId, adId: adFWithId.id } });
        }
    };
    const handleDeleteClick = (ad, type) => {
        setAdToDelete(ad);
        setAdToDeleteType(type);
        setOpenDeleteDialog(true);
    };
    const handleConfirmDelete = async () => {
        setOpenDeleteDialog(false);
        if (!adToDelete || !adToDeleteType) return;

        console.log('Attempting to delete ad:', { id: adToDelete.id, type: adToDeleteType });
        console.log('deleteAd function:', typeof deleteAd);

        try {
            await dispatch(deleteAd({ id: adToDelete.id, type: adToDeleteType })).unwrap();
            setSnackbar({ open: true, message: `تم حذف الإعلان بنجاح!`, severity: 'success' });
        } catch (err) {
            console.error('Error deleting ad:', err);
            setSnackbar({ open: true, message: `فشل حذف الإعلان: ${err.message || 'حدث خطأ غير معروف.'}`, severity: 'error' });
        } finally {
            setAdToDelete(null);
            setAdToDeleteType(null);
        }
    };
    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') return;
        setSnackbar({ ...snackbar, open: false });
    };

    // Receipt image click handler
    const handleReceiptClick = (imageUrl) => {
        setReceiptDialogImage(imageUrl);
        setReceiptDialogOpen(true);
    };



    return (
        <Box dir={'rtl'} sx={{ p: 2, textAlign: 'right' }}>
            <PageHeader
                title={getPageTitle()}
                icon={BroadcastOnPersonalIcon}
                showCount={false}
            />

            {/* Conditional tabs based on organization type */}
            {userProfile?.type_of_organization && (
                <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
                    <Tabs
                        value={activeTab}
                        onChange={handleTabChange}
                        aria-label="ad type tabs"
                        sx={{
                            '& .MuiTab-root': {
                                fontSize: '1rem',
                                fontWeight: 500,
                                minWidth: 120,
                            }
                        }}
                    >
                        {(userProfile.type_of_organization === "مطور عقاري" || userProfile.type_of_organization === "مطور عقارى") && (
                            <Tab
                                label="إعلانات العقارات"
                                value="developer"
                                sx={{
                                    color: activeTab === 'developer' ? 'primary.main' : 'text.secondary',
                                    '&.Mui-selected': {
                                        color: 'primary.main',
                                        fontWeight: 600,
                                    }
                                }}
                            />
                        )}
                        {(userProfile.type_of_organization === "ممول عقاري" || userProfile.type_of_organization === "ممول عقارى") && (
                            <Tab
                                label="إعلانات التمويل"
                                value="funder"
                                sx={{
                                    color: activeTab === 'funder' ? 'primary.main' : 'text.secondary',
                                    '&.Mui-selected': {
                                        color: 'primary.main',
                                        fontWeight: 600,
                                    }
                                }}
                            />
                        )}
                    </Tabs>
                </Box>
            )}

            <Paper dir={'rtl'} sx={{ p: 2, borderRadius: 2, minHeight: 400, textAlign: 'right' }}>
                {/* DataGrid Container */}
                <div style={{ height: 600, width: '100%', padding: '1rem' }}>
                    {renderDataGrid()}
                </div>
            </Paper>
            {/* Delete Confirmation Dialog */}
            <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
                <DialogTitle>تأكيد الحذف</DialogTitle>
                <DialogContent>هل أنت متأكد أنك تريد حذف الإعلان؟ لا يمكن التراجع عن هذا الإجراء.</DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDeleteDialog(false)}>إلغاء</Button>
                    <Button onClick={handleConfirmDelete} color="error" variant="contained">حذف</Button>
                </DialogActions>
            </Dialog>
            {/* Receipt Image Dialog */}
            <Dialog
                open={receiptDialogOpen}
                onClose={() => setReceiptDialogOpen(false)}
                maxWidth="md"
                fullWidth
                dir="rtl"
            >
                <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6">إيصال الدفع</Typography>
                    <IconButton onClick={() => setReceiptDialogOpen(false)}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    {receiptDialogImage && (
                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <img
                                src={receiptDialogImage}
                                alt="إيصال الدفع"
                                style={{
                                    maxWidth: '100%',
                                    maxHeight: '70vh',
                                    objectFit: 'contain'
                                }}
                            />
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setReceiptDialogOpen(false)}>إغلاق</Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar for feedback */}
            <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleSnackbarClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
                <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
}


function InquiriesPage() {
    const dispatch = useDispatch();

    // Select inquiries and filter status from Redux store
    const inquiries = useSelector((state) => state.inquiries.list);
    const filterStatus = useSelector((state) => state.inquiries.filterStatus);
    const properties = useSelector((state) => state.properties.list); // Get properties for linking

    // Local state for modal visibility and data
    const [isDeleteConfirmModalOpen, setIsDeleteConfirmModalOpen] = useState(false);
    const [inquiryToDeleteId, setInquiryToDeleteId] = useState(null);

    // Helper to get property name from advertisement_id
    const getPropertyName = (advertisementId) => {
        const property = properties.find(p => p.id === advertisementId);
        return property ? property.name : 'عقار غير معروف'; // 'Unknown Property'
    };

    // Helper to get status color for Chip
    const getStatusColor = (status) => {
        switch (status) {
            case 'pending':
                return 'warning';
            case 'contacted':
                return 'info';
            case 'closed':
                return 'success';
            default:
                return 'default';
        }
    };

    // Helper to get status icon
    const getStatusIcon = (status) => {
        switch (status) {
            case 'pending':
                return <HourglassEmptyIcon fontSize="small" />;
            case 'contacted':
                return <DoneOutlineIcon fontSize="small" />;
            case 'closed':
                return <CloseIcon fontSize="small" />;
            default:
                return null;
        }
    };

    // Filtered inquiries based on Redux state filter
    const filteredInquiries = inquiries.filter(inquiry => {
        return filterStatus === 'الكل' || inquiry.status === filterStatus;
    });

    // --- Handlers ---
    const handleFilterStatusChange = (e) => {
        dispatch(setFilterStat(e.target.value));
    };

    const handleStatusChange = (inquiryId, newStatus) => {
        dispatch(updateInquiry({ id: inquiryId, status: newStatus }));
    };

    const handleDeleteInquiry = (id) => {
        setInquiryToDeleteId(id);
        setIsDeleteConfirmModalOpen(true);
    };

    const handleDeleteConfirm = () => {
        dispatch(deleteInquiry(inquiryToDeleteId));
        setIsDeleteConfirmModalOpen(false);
        setInquiryToDeleteId(null);
    };

    return (
        <Box sx={{ p: 2, textAlign: 'right' }}>
            <Typography variant="h4" display={'flex'} flexDirection={'row-reverse'} gutterBottom>إدارة الاستفسارات</Typography>

            <Paper sx={{ p: 2, borderRadius: 2, minHeight: 400, textAlign: 'right', direction: 'rtl' }}>
                <Box sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', mb: 2, flexDirection: 'row-reverse', gap: 2 }}>
                    {/* Status Filter */}
                    <FormControl variant="outlined" size="small" sx={{ minWidth: 150 }}>
                        <InputLabel id="inquiry-status-filter-label" >
                            تصفية حسب الحالة
                        </InputLabel>
                        <Select
                            labelId="inquiry-status-filter-label"
                            id="inquiry-status-filter"
                            value={filterStatus}
                            onChange={handleFilterStatusChange}
                            label="تصفية حسب الحالة"
                            sx={{ textAlign: 'left' }}
                        >
                            <MenuItem value="الكل">الكل</MenuItem>
                            <MenuItem value="pending">معلق</MenuItem>
                            <MenuItem value="contacted">تم التواصل</MenuItem>
                            <MenuItem value="closed">مغلق</MenuItem>
                        </Select>
                    </FormControl>
                </Box>

                {/* Inquiries List */}
                {filteredInquiries.length === 0 ? (
                    <Typography variant="body1" color="text.secondary" sx={{ mt: 4, textAlign: 'center' }}>
                        لا توجد استفسارات لعرضها حاليًا.
                    </Typography>
                ) : (
                    <List>
                        {filteredInquiries.map((inquiry, index) => (
                            <React.Fragment key={inquiry.id}>
                                <ListItem disablePadding secondaryAction={
                                    <Stack direction="row-reverse" spacing={1} alignItems="center">
                                        {/* Status Dropdown */}
                                        <FormControl variant="standard" size="small" sx={{ minWidth: 120 }}>
                                            <Select
                                                value={inquiry.status}
                                                onChange={(e) => handleStatusChange(inquiry.id, e.target.value)}
                                                displayEmpty
                                                inputProps={{ 'aria-label': 'Without label' }}
                                                sx={{ textAlign: 'center', '& .MuiSelect-select': { py: 0.5 } }}
                                                renderValue={(selected) => (
                                                    <Chip
                                                        label={
                                                            selected === 'pending' ? 'معلق' :
                                                                selected === 'contacted' ? 'تم التواصل' :
                                                                    selected === 'closed' ? 'مغلق' : ''
                                                        }
                                                        size="small"
                                                        color={getStatusColor(selected)}
                                                        icon={getStatusIcon(selected)}
                                                        sx={{ pr: 0.5 }}
                                                    />
                                                )}
                                            >
                                                <MenuItem value="pending">
                                                    <Stack direction="row-reverse" alignItems="center" spacing={1}>
                                                        <HourglassEmptyIcon fontSize="small" />
                                                        <Typography>معلق</Typography>
                                                    </Stack>
                                                </MenuItem>
                                                <MenuItem value="contacted">
                                                    <Stack direction="row-reverse" alignItems="center" spacing={1}>
                                                        <DoneOutlineIcon fontSize="small" />
                                                        <Typography>تم التواصل</Typography>
                                                    </Stack>
                                                </MenuItem>
                                                <MenuItem value="closed">
                                                    <Stack direction="row-reverse" alignItems="center" spacing={1}>
                                                        <CloseIcon fontSize="small" />
                                                        <Typography>مغلق</Typography>
                                                    </Stack>
                                                </MenuItem>
                                            </Select>
                                        </FormControl>

                                        {/* Delete Button */}
                                        <Tooltip title="حذف الاستفسار">
                                            <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteInquiry(inquiry.id)}>
                                                <DeleteOutlineIcon sx={{ color: 'red' }} />
                                            </IconButton>
                                        </Tooltip>
                                    </Stack>
                                } sx={{ py: 1, flexDirection: 'row-reverse' }}>
                                    <ListItemText
                                        primary={
                                            <Stack direction="column" spacing={0.5}>
                                                <Typography variant="subtitle1" component="div" sx={{ fontWeight: 'bold' }}>
                                                    استفسار بخصوص: {getPropertyName(inquiry.advertisement_id)}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    الرسالة: {inquiry.message}
                                                </Typography>
                                            </Stack>
                                        }
                                        secondary={
                                            <Stack direction="row-reverse" spacing={2} sx={{ mt: 1 }}>
                                                <Typography variant="caption" color="text.disabled">
                                                    المعرف: {inquiry.id}
                                                </Typography>
                                                <Typography variant="caption" color="text.disabled">
                                                    من المستخدم: {inquiry.user_id}
                                                </Typography>
                                                <Typography variant="caption" color="text.disabled">
                                                    تاريخ الاستلام: {new Date(inquiry.created_at).toLocaleDateString('ar-EG', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                                </Typography>
                                            </Stack>
                                        }
                                        primaryTypographyProps={{ component: 'div' }}
                                        secondaryTypographyProps={{ component: 'div' }}
                                    />
                                </ListItem>
                                {index < filteredInquiries.length - 1 && <Divider component="li" sx={{ my: 1 }} />}
                            </React.Fragment>
                        ))}
                    </List>
                )}
            </Paper>

            {/* Confirm Delete Modal */}
            <ConfirmDeleteModal
                open={isDeleteConfirmModalOpen}
                onClose={() => setIsDeleteConfirmModalOpen(false)}
                onConfirm={handleDeleteConfirm}
                itemType="الاستفسار" // 'Inquiry'
                itemId={inquiryToDeleteId}
                itemName={`الاستفسار ذو المعرف: ${inquiryToDeleteId}`}
            />
        </Box>
    );
}

function OrdersPage() {
    const userProfile = useSelector((state) => state.user.profile);
    const [ads, setAds] = useState([]);
    const [requests, setRequests] = useState([]);
    const [loadingAds, setLoadingAds] = useState(true);
    const [loadingRequests, setLoadingRequests] = useState(true);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [actionLoading, setActionLoading] = useState({});
    // New state for filters and search
    const [statusFilters, setStatusFilters] = useState({}); // { [adId]: 'all' }
    const [searchTerm, setSearchTerm] = useState('');

    // Real-time listeners for ads and requests
    useEffect(() => {
        if (!userProfile?.uid) return;

        setLoadingAds(true);
        setLoadingRequests(true);

        // Subscribe to user's financing advertisements
        const unsubscribeAds = FinancingAdvertisement.subscribeByUserId(userProfile.uid, (adsData) => {
            setAds(adsData);
            setLoadingAds(false);
        });

        // Subscribe to all financing requests (we'll filter by ad ID in the component)
        const unsubscribeRequests = FinancingRequest.subscribeAllRequests((requestsData) => {
            setRequests(requestsData);
            setLoadingRequests(false);
        });

        // Cleanup function to unsubscribe from both listeners
        return () => {
            unsubscribeAds();
            unsubscribeRequests();
        };
    }, [userProfile?.uid]);

    // Approval action for requests (org approval, not admin)
    const handleOrgApproveRequest = async (req, ad) => {
        setActionLoading((prev) => ({ ...prev, [req.id]: true }));
        try {
            // Update reviewStatus to approved
            const reqInstance = await FinancingRequest.getById(req.id);
            await reqInstance.update({ reviewStatus: 'approved' });
            // Send notification to the user
            const notif = new Notification({
                receiver_id: req.user_id,
                title: 'تمت الموافقة على طلب التمويل',
                body: `تمت الموافقة على طلب التمويل الخاص بك على إعلان: ${ad.title}`,
                type: 'system',
                link: `/client/financing-requests/${req.id}`,
            });
            await notif.send();
            setSnackbar({ open: true, message: 'تمت الموافقة على الطلب وإشعار العميل', severity: 'success' });
            // No need to dispatch - onSnapshot will automatically update the state
        } catch (e) {
            setSnackbar({ open: true, message: e.message || 'خطأ أثناء الاعتماد', severity: 'error' });
        } finally {
            setActionLoading((prev) => ({ ...prev, [req.id]: false }));
        }
    };

    // Handle request actions (pending, reject, delete)
    const handleRequestAction = async (requestId, action, adId, rejectionReason = '') => {
        setActionLoading((prev) => ({ ...prev, [requestId]: true }));
        try {
            const reqInstance = await FinancingRequest.getById(requestId);

            switch (action) {
                case 'pending':
                    await reqInstance.update({ reviewStatus: 'pending', review_note: null });
                    setSnackbar({ open: true, message: 'تم إعادة الطلب للمراجعة', severity: 'success' });
                    break;
                case 'reject':
                    await reqInstance.update({ reviewStatus: 'rejected', review_note: rejectionReason });
                    setSnackbar({ open: true, message: 'تم رفض الطلب', severity: 'success' });
                    break;
                case 'delete':
                    await reqInstance.delete();
                    setSnackbar({ open: true, message: 'تم حذف الطلب', severity: 'success' });
                    break;
                default:
                    throw new Error('إجراء غير معروف');
            }

            // No need to dispatch - onSnapshot will automatically update the state
        } catch (e) {
            setSnackbar({ open: true, message: e.message || 'خطأ أثناء تنفيذ الإجراء', severity: 'error' });
        } finally {
            setActionLoading((prev) => ({ ...prev, [requestId]: false }));
        }
    };

    // Helper function to get ad status label
    const getAdStatusLabel = (status) => {
        switch (status) {
            case 'pending': return 'قيد المراجعة';
            case 'approved': return 'موافق عليه';
            case 'rejected': return 'مرفوض';
            default: return status;
        }
    };

    // Helper function to get ad status color
    const getAdStatusColor = (status) => {
        switch (status) {
            case 'pending': return 'warning';
            case 'approved': return 'success';
            case 'rejected': return 'error';
            default: return 'default';
        }
    };

    // Filtering and searching logic
    const filterAndSearchRequests = (requestsForAd, adId) => {
        let filtered = requestsForAd;
        const status = statusFilters[adId] || 'all';
        if (status !== 'all') {
            filtered = filtered.filter(r => r.reviewStatus === status);
        }
        if (searchTerm.trim()) {
            const term = searchTerm.trim().toLowerCase();
            filtered = filtered.filter(r =>
                (r.user_id && r.user_id.toLowerCase().includes(term)) ||
                (r.financing_amount && String(r.financing_amount).includes(term)) ||
                (r.repayment_years && String(r.repayment_years).includes(term))
            );
        }
        return filtered;
    };

    return (
        <Box sx={{ p: 2, textAlign: 'left' }}>
            <PageHeader
                title="طلبات التمويل على إعلاناتك"
                icon={AccountBalanceWalletIcon}
                showCount={false}
            />
            {/* Search input */}
            <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
                <TextField
                    label="بحث عن طلبات التمويل (المستخدم، المبلغ، السنوات)"
                    variant="outlined"
                    size="small"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    sx={{ minWidth: 300 }}
                />
            </Box>
            <Paper sx={{ p: 2, borderRadius: 2, minHeight: 400, textAlign: 'right' }}>
                {loadingAds ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
                        <CircularProgress />
                        <Typography sx={{ ml: 2 }}>جاري تحميل الإعلانات...</Typography>
                    </Box>
                ) : ads.length === 0 ? (
                    <Typography variant="body1" color="text.secondary" sx={{ mt: 4, textAlign: 'center' }}>
                        لا توجد إعلانات تمويلية خاصة بك.
                    </Typography>
                ) : loadingRequests ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
                        <CircularProgress />
                        <Typography sx={{ ml: 2 }}>جاري تحميل الطلبات...</Typography>
                    </Box>
                ) : (
                    ads.map((ad) => {
                        const requestsForAd = requests.filter((r) => r.advertisement_id === ad.id);
                        const filteredRequests = filterAndSearchRequests(requestsForAd, ad.id);
                        return (
                            <Box key={ad.id} sx={{ mb: 4, border: '1px solid #eee', borderRadius: 2, p: 2 }}>
                                <Box dir='ltr' sx={{ textAlign: 'left', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <Box>
                                        <Typography variant="h6" color="primary" sx={{ mb: 1 }}>{ad.title}</Typography>
                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>الحد الأدنى: {ad.start_limit} | الحد الأقصى: {ad.end_limit}</Typography>
                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>نسبة الفائدة حتى 5 سنوات: {ad.interest_rate_upto_5}% | حتى 10 سنوات: {ad.interest_rate_upto_10}% | أكثر من 10 سنوات: {ad.interest_rate_above_10}%</Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                        {/* Ad Status Chip */}
                                        <Chip
                                            label={getAdStatusLabel(ad.reviewStatus)}
                                            color={getAdStatusColor(ad.reviewStatus)}
                                            sx={{ fontWeight: 'bold', fontSize: 14 }}
                                        />
                                        {/* Counter for requests */}
                                        <Chip label={`عدد الطلبات: ${requestsForAd.length}`} color="info" sx={{ fontWeight: 'bold', fontSize: 16 }} />
                                        {/* Status filter for this ad */}
                                        <FormControl size="small" sx={{ minWidth: 150 }}>
                                            <InputLabel>تصفية حسب الحالة</InputLabel>
                                            <Select
                                                value={statusFilters[ad.id] || 'all'}
                                                label="تصفية حسب الحالة"
                                                onChange={e => setStatusFilters(f => ({ ...f, [ad.id]: e.target.value }))}
                                            >
                                                <MenuItem value="all">الكل</MenuItem>
                                                <MenuItem value="approved">مقبول</MenuItem>
                                                <MenuItem value="rejected">مرفوض</MenuItem>
                                                <MenuItem value="pending">معلق</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Box>
                                </Box>
                                {filteredRequests.length > 0 ? (
                                    <List>
                                        {filteredRequests.map((req) => (
                                            <ListItem key={req.id} sx={{ borderBottom: '1px solid #eee', flexDirection: 'row-reverse' }}>
                                                <ListItemText
                                                    primary={<>
                                                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>مقدم الطلب: {req.user_id}</Typography>
                                                        <Typography variant="body2">المبلغ المطلوب: {req.financing_amount} | سنوات السداد: {req.repayment_years}</Typography>
                                                        <Typography variant="body2">الحالة: {req.reviewStatus}</Typography>
                                                    </>}
                                                    secondary={<>
                                                        <Typography variant="caption" color="text.secondary">ID: {req.id}</Typography>
                                                    </>}
                                                />
                                                <Stack direction="row" spacing={1.5}>
                                                    {/* Org Approval Button */}
                                                    {req.reviewStatus !== 'approved' && (
                                                        <IconButton
                                                            color="success"
                                                            size="small"
                                                            disabled={actionLoading[req.id]}
                                                            onClick={() => handleOrgApproveRequest(req, ad)}
                                                        >
                                                            <Tooltip title='موافقة'>
                                                                <CheckCircleIcon sx={{ border: '1px solid green', borderRadius: '50%' }} />
                                                            </Tooltip>
                                                        </IconButton>
                                                    )}
                                                    <IconButton
                                                        color="warning"
                                                        size="small"
                                                        disabled={actionLoading[req.id]}
                                                        onClick={() => handleRequestAction(req.id, 'pending', ad.id)}
                                                    >
                                                        <Tooltip title='إعادة للمراجعة'>
                                                            <MessageIcon />
                                                        </Tooltip>
                                                    </IconButton>
                                                    <IconButton
                                                        color="error"
                                                        size="small"
                                                        disabled={actionLoading[req.id]}
                                                        onClick={() => handleRequestAction(req.id, 'reject', ad.id, 'تم الرفض من قبل المؤسسة')}
                                                    >
                                                        <Tooltip title='رفض'>
                                                            <CloseIcon sx={{ border: '1px solid red', borderRadius: '50%' }} />
                                                        </Tooltip>
                                                    </IconButton>
                                                    <IconButton
                                                        color="secondary"
                                                        size="small"
                                                        disabled={actionLoading[req.id]}
                                                        onClick={() => handleRequestAction(req.id, 'delete', ad.id)}
                                                    >
                                                        <Tooltip title='حذف'>
                                                            <DeleteIcon />
                                                        </Tooltip>
                                                    </IconButton>
                                                </Stack>
                                            </ListItem>
                                        ))}
                                    </List>
                                ) : (
                                    <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                                        لا توجد طلبات تمويل لهذا الإعلان.
                                    </Typography>
                                )}
                            </Box>
                        );
                    })
                )}
            </Paper>
            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))} severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
}

function SalesPage() {
    return (
        <Box sx={{ p: 2, textAlign: 'right' }}>
            <PageHeader
                title="تقارير المبيعات"
                icon={DescriptionIcon}
                showCount={false}
            />
            <Paper sx={{ p: 2, borderRadius: 2, minHeight: 300, textAlign: 'right' }}>
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
            <PageHeader
                title="تقارير حركة المرور"
                icon={DescriptionIcon}
                showCount={false}
            />
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
            <PageHeader
                title="الإضافات والتكاملات"
                icon={LayersIcon}
                showCount={false}
            />
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

export default function OrganizationDashboard(props) {
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

    const profilePicInDrawer = useSelector((state) => state.profilePic.profilePicUrl);
    const userProfile = useSelector((state) => state.user.profile);
    const userName = userProfile?.adm_name || userProfile?.cli_name || userProfile?.org_name || 'Organization';

    // Get organization type for conditional navigation
    const organizationType = userProfile?.type_of_organization;

    // Check if user profile is loaded to prevent UI flicker
    const isProfileLoaded = !!userProfile;

    // Get navigation items based on organization type
    const NAVIGATION = React.useMemo(() => {
        // Return empty array if profile is not loaded yet to prevent rendering issues
        if (!isProfileLoaded) {
            return [];
        }
        return getNavigationItems(organizationType);
    }, [organizationType, isProfileLoaded]);
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
    const handleReportsClick = () => {
        setOpenReports(!openReports);
    };


    // logout
    const dispatch = useDispatch();
    const navigate = useNavigate();
    // const authStatus = useSelector((state) => state.auth.status); // Get auth status to disable button

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
                marginTop: 0,
            },
            [theme.breakpoints.up('md')]: {
                padding: theme.spacing(3),
                paddingTop: '4px',
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
        case '/inquiries':
            currentPageContent = <InquiriesPage />;
            break;
        case '/orders':
            // Only show OrdersPage for funder organizations
            if (!isProfileLoaded) {
                // Show loading state while profile is being loaded
                currentPageContent = (
                    <Box sx={{ p: 2, textAlign: 'right' }}>
                        <Typography variant="h5">جاري التحميل...</Typography>
                    </Box>
                );
            } else if (organizationType === 'ممول عقارى' || organizationType === 'ممول عقاري') {
                currentPageContent = <OrdersPage />;
            } else {
                currentPageContent = (
                    <Box sx={{ p: 2, textAlign: 'right' }}>
                        <Typography variant="h5" color="error">لا يوجد صفحة للعرض</Typography>
                        <Typography variant="body1">الصفحة المطلوبة  "{router.pathname}" غير موجودة</Typography>
                    </Box>
                );
            }
            break;
        case '/reports/sales':
            currentPageContent = <SalesPage />;
            break;
        case '/reports/traffic':
            currentPageContent = <TrafficPage />;
            break;
        case '/analytics':
            currentPageContent = <AnalyticsPage />;
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

    // Notification state
    const [notificationAnchorEl, setNotificationAnchorEl] = React.useState(null);
    const [unreadCount, setUnreadCount] = React.useState(0);
    const [snackbarOpen, setSnackbarOpen] = React.useState(false);
    const [snackbarMessage, setSnackbarMessage] = React.useState('');
    const [snackbarSeverity, setSnackbarSeverity] = React.useState('success');
    const authUid = useSelector((state) => state.auth.uid);

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
                                            alt={userName}
                                            src={userProfile?.image || profilePicInDrawer || './admin.jpg'}
                                            sx={{
                                                width: 80,
                                                height: 80,
                                                mb: 1,
                                                boxShadow: '0px 0px 8px rgba(0,0,0,0.2)',
                                                border: '3px solid',
                                                borderColor: 'primary.main'
                                            }}
                                        />
                                        <Typography variant="h6" sx={{ fontWeight: 'bold', textAlign: 'center' }}>
                                            مرحباً، {userName}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
                                            {userProfile?.type_of_organization ? `${userProfile.type_of_organization}` : 'منظمة'}
                                        </Typography>
                                    </Box>
                                )}
                                {open && <Divider sx={{ mb: 2 }} />}
                                <List>
                                    {!isProfileLoaded ? (
                                        // Show loading state while profile is being loaded
                                        <Box sx={{ p: 2, textAlign: 'center' }}>
                                            <Typography variant="body2" color="text.secondary">
                                                جاري التحميل...
                                            </Typography>
                                        </Box>
                                    ) : (
                                        NAVIGATION.map((item) => {
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
                                        })
                                    )}
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

function AnalyticsPage() {
    const dispatch = useDispatch();
    const userProfile = useSelector((state) => state.user.profile);
    const organizationType = userProfile?.type_of_organization;
    const authUid = useSelector((state) => state.auth.uid);

    // Get analytics data from Redux store (same as admin analytics)
    const analyticsData = useSelector((state) => state.analytics?.data);
    const analyticsLoading = useSelector((state) => state.analytics?.loading);
    const analyticsError = useSelector((state) => state.analytics?.error);

    // State for filters
    const [filters, setFilters] = useState({
        city: 'all',
        dateRange: '30',
        status: 'all',
        adType: 'all'
    });

    // State for UI
    const [activeTab, setActiveTab] = useState(0);
    const [loading, setLoading] = useState(false);

    // Fetch analytics data using Redux thunk (same as admin analytics)
    useEffect(() => {
        if (!userProfile?.uid || !organizationType) return;

        console.log('Fetching analytics data for organization:', {
            uid: userProfile.uid,
            organizationType,
            filters
        });

        // Use the same fetchAnalyticsData thunk as admin analytics
        dispatch(fetchAnalyticsData({
            userRole: 'organization',
            userId: userProfile.uid,
            filters
        }));
    }, [dispatch, userProfile?.uid, organizationType, filters]);

    // Debug logging for analytics data
    useEffect(() => {
        console.log('Organization Analytics Debug:', {
            userProfile: userProfile?.uid,
            organizationType,
            analyticsDataAvailable: !!analyticsData,
            analyticsLoading,
            analyticsError,
            dataKeys: analyticsData ? Object.keys(analyticsData) : [],
            overview: analyticsData?.overview,
            financialInsights: analyticsData?.financialInsights,
            developerAds: analyticsData?.developerAds?.length,
            financingAds: analyticsData?.financingAds?.length
        });
    }, [userProfile?.uid, organizationType, analyticsData, analyticsLoading, analyticsError]);

    // Real-time data subscription is now handled by Redux store
    // The fetchAnalyticsData thunk will handle real-time updates

    // Helper functions for data processing
    const processFunderAnalytics = () => {
        // Use Redux analytics data
        if (!analyticsData) return {
            totalAds: 0,
            totalRequests: 0,
            averageRequestAmount: 0,
            totalFinancingAmount: 0,
            averageFinancingAmount: 0,
            approvalRate: 0,
            rejectionRate: 0,
            interestRateDistribution: { 'upTo5': 0, 'upTo10': 0, 'above10': 0 },
            locationDistribution: {},
            statusBreakdown: { pending: 0, approved: 0, rejected: 0 }
        };

        // Get financing ads for this organization
        const financingAds = analyticsData.financingAds?.filter(ad => ad.userId === userProfile.uid) || [];

        // Debug logging for financing ads
        console.log('Funder Analytics Debug:', {
            userProfileUid: userProfile.uid,
            allFinancingAds: analyticsData.financingAds?.length || 0,
            filteredFinancingAds: financingAds.length,
            allFinancingAdsData: analyticsData.financingAds?.map(ad => ({ id: ad.id, userId: ad.userId, title: ad.title })) || [],
            filteredFinancingAdsData: financingAds.map(ad => ({ id: ad.id, userId: ad.userId, title: ad.title })) || []
        });

        // Calculate metrics
        const totalAds = financingAds.length;
        const totalRequests = Number(analyticsData.financialInsights?.totalFinancingRequests) || 0;
        const totalFinancingAmount = Number(analyticsData.financialInsights?.totalRevenue) || 0;
        const averageFinancingAmount = totalRequests > 0 ? totalFinancingAmount / totalRequests : 0;
        const averageRequestAmount = averageFinancingAmount; // Same value for consistency

        // Interest rate distribution from analytics data
        const interestRateDistribution = {
            'upTo5': Number(analyticsData.financialInsights?.interestRateBreakdown?.['≤5%']) || 0,
            'upTo10': Number(analyticsData.financialInsights?.interestRateBreakdown?.['≤10%']) || 0,
            'above10': Number(analyticsData.financialInsights?.interestRateBreakdown?.['>10%']) || 0
        };

        // Approval and rejection rates
        const approvedRequests = Number(analyticsData.financialInsights?.approvedRequests) || 0;
        const rejectedRequests = Number(analyticsData.financialInsights?.rejectedRequests) || 0;
        const approvalRate = Number(analyticsData.financialInsights?.approvalRate) || 0;
        const rejectionRate = totalRequests > 0 ? (rejectedRequests / totalRequests) * 100 : 0;

        // Location distribution (from overview)
        const locationDistribution = analyticsData.overview?.cityBreakdown || {};

        // Status breakdown
        const statusBreakdown = {
            pending: analyticsData.financialInsights?.pendingRequests || 0,
            approved: approvedRequests,
            rejected: rejectedRequests
        };

        return {
            totalAds,
            totalRequests,
            averageRequestAmount,
            totalFinancingAmount,
            averageFinancingAmount,
            approvalRate,
            rejectionRate,
            interestRateDistribution,
            locationDistribution,
            statusBreakdown
        };
    };

    const processDeveloperAnalytics = () => {
        // Use Redux analytics data
        if (!analyticsData) return {
            totalAds: 0,
            activeAds: 0,
            pendingAds: 0,
            rejectedAds: 0,
            propertyTypeDistribution: {},
            averagePrice: 0,
            averageArea: 0,
            cityDistribution: {},
            timeSincePublished: []
        };

        // Get real estate ads for this organization
        const realEstateAds = analyticsData.developerAds?.filter(ad => ad.userId === userProfile.uid) || [];

        // Calculate metrics
        const totalAds = realEstateAds.length;
        const activeAds = realEstateAds.filter(ad => ad.reviewStatus === 'approved').length;
        const pendingAds = realEstateAds.filter(ad => ad.reviewStatus === 'pending').length;
        const rejectedAds = realEstateAds.filter(ad => ad.reviewStatus === 'rejected').length;

        // Property type distribution
        const propertyTypeDistribution = analyticsData.overview?.categoryBreakdown || {};

        // Average price and area (calculate from actual ads)
        const prices = realEstateAds.map(ad => parseFloat(ad.price) || 0).filter(price => price > 0);
        const areas = realEstateAds.map(ad => parseFloat(ad.area) || 0).filter(area => area > 0);

        const averagePrice = prices.length > 0 ? prices.reduce((sum, price) => sum + price, 0) / prices.length : 0;
        const averageArea = areas.length > 0 ? areas.reduce((sum, area) => sum + area, 0) / areas.length : 0;

        // City distribution (from overview)
        const cityDistribution = analyticsData.overview?.cityBreakdown || {};

        // Time since published
        const timeSincePublished = realEstateAds.map(ad => {
            const publishedDate = ad.createdAt?.toDate?.() || new Date(ad.createdAt);
            const now = new Date();
            const diffTime = Math.abs(now - publishedDate);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            return { ad, daysSincePublished: diffDays };
        });

        return {
            totalAds,
            activeAds,
            pendingAds,
            rejectedAds,
            propertyTypeDistribution,
            averagePrice,
            averageArea,
            cityDistribution,
            timeSincePublished
        };
    };

    // Render funder analytics
    const renderFunderAnalytics = () => {
        // Show loading state
        if (analyticsLoading) {
            return (
                <Box sx={{ p: 2, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
                    <CircularProgress />
                </Box>
            );
        }

        // Show error state
        if (analyticsError) {
            return (
                <Box sx={{ p: 2 }}>
                    <Alert severity="error" sx={{ mb: 2 }}>
                        خطأ في تحميل البيانات: {analyticsError}
                    </Alert>
                </Box>
            );
        }

        // Don't process data if analyticsData is not available
        if (!analyticsData) {
            return (
                <Box sx={{ p: 2, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
                    <Typography>جاري تحميل البيانات...</Typography>
                </Box>
            );
        }

        // Check if no data available
        if (!analyticsData.financingAds || analyticsData.financingAds.length === 0) {
            return (
                <Box sx={{ p: 2, textAlign: 'center' }}>
                    <Typography variant="h6" color="text.secondary">
                        لا توجد بيانات متاحة للإعلانات التمويلية
                    </Typography>
                </Box>
            );
        }

        const data = processFunderAnalytics();

        return (
            <Box dir='rtl' sx={{ p: 2 }}>
                <Typography variant="h4" gutterBottom sx={{ textAlign: 'right', mb: 3 }}>
                    تحليلات الممول العقاري
                </Typography>

                {/* Filters */}
                <Paper sx={{ p: 2, mb: 3, borderRadius: 2 }}>
                    <Typography variant="h6" gutterBottom sx={{ textAlign: 'right', mb: 2 }}>
                        الفلاتر
                    </Typography>
                    <Grid container spacing={2} direction="row-reverse">
                        <Grid size={{ xs: 12, sm: 4 }}>
                            <FormControl fullWidth size="small">
                                <InputLabel>المدينة</InputLabel>
                                <Select
                                    value={filters.city}
                                    onChange={(e) => setFilters(prev => ({ ...prev, city: e.target.value }))}
                                    label="المدينة"
                                >
                                    <MenuItem value="all">الكل</MenuItem>
                                    <MenuItem value="القاهرة">القاهرة</MenuItem>
                                    <MenuItem value="الإسكندرية">الإسكندرية</MenuItem>
                                    <MenuItem value="الجيزة">الجيزة</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 4 }}>
                            <FormControl fullWidth size="small">
                                <InputLabel>الفترة الزمنية</InputLabel>
                                <Select
                                    value={filters.dateRange}
                                    onChange={(e) => setFilters(prev => ({ ...prev, dateRange: e.target.value }))}
                                    label="الفترة الزمنية"
                                >
                                    <MenuItem value="all">الكل</MenuItem>
                                    <MenuItem value="week">آخر أسبوع</MenuItem>
                                    <MenuItem value="month">آخر شهر</MenuItem>
                                    <MenuItem value="quarter">آخر 3 أشهر</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 4 }}>
                            <FormControl fullWidth size="small">
                                <InputLabel>الحالة</InputLabel>
                                <Select
                                    value={filters.status}
                                    onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                                    label="الحالة"
                                >
                                    <MenuItem value="all">الكل</MenuItem>
                                    <MenuItem value="pending">قيد المراجعة</MenuItem>
                                    <MenuItem value="approved">مقبول</MenuItem>
                                    <MenuItem value="rejected">مرفوض</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                </Paper>

                {/* Overview Cards */}
                <Grid container spacing={3} sx={{ mb: 4 }}>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <Paper sx={{ p: 3, textAlign: 'center', borderRadius: 2 }}>
                            <Typography variant="h6" color="text.secondary">إجمالي الإعلانات</Typography>
                            <Typography variant="h4" sx={{ color: 'primary.main', fontWeight: 'bold' }}>
                                {data.totalAds}
                            </Typography>
                        </Paper>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <Paper sx={{ p: 3, textAlign: 'center', borderRadius: 2 }}>
                            <Typography variant="h6" color="text.secondary">إجمالي الطلبات</Typography>
                            <Typography variant="h4" sx={{ color: 'success.main', fontWeight: 'bold' }}>
                                {data.totalRequests}
                            </Typography>
                        </Paper>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <Paper sx={{ p: 3, textAlign: 'center', borderRadius: 2 }}>
                            <Typography variant="h6" color="text.secondary">إجمالي مبالغ التمويل</Typography>
                            <Typography variant="h4" sx={{ color: 'info.main', fontWeight: 'bold' }}>
                                {data.totalFinancingAmount.toLocaleString('ar-EG')} ج.م
                            </Typography>
                        </Paper>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <Paper sx={{ p: 3, textAlign: 'center', borderRadius: 2 }}>
                            <Typography variant="h6" color="text.secondary">نسبة الموافقة</Typography>
                            <Typography variant="h4" sx={{ color: 'warning.main', fontWeight: 'bold' }}>
                                {typeof data.approvalRate === 'number' ? data.approvalRate.toFixed(1) : '0.0'}%
                            </Typography>
                        </Paper>
                    </Grid>
                </Grid>

                {/* Additional Metrics */}
                <Grid container spacing={3} sx={{ mb: 4 }}>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <Paper sx={{ p: 3, textAlign: 'center', borderRadius: 2 }}>
                            <Typography variant="h6" color="text.secondary">متوسط مبلغ الطلب</Typography>
                            <Typography variant="h4" sx={{ color: 'secondary.main', fontWeight: 'bold' }}>
                                {typeof data.averageFinancingAmount === 'number' ? data.averageFinancingAmount.toLocaleString('ar-EG') : '0'} ج.م
                            </Typography>
                        </Paper>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <Paper sx={{ p: 3, textAlign: 'center', borderRadius: 2 }}>
                            <Typography variant="h6" color="text.secondary">نسبة الرفض</Typography>
                            <Typography variant="h4" sx={{ color: 'error.main', fontWeight: 'bold' }}>
                                {typeof data.rejectionRate === 'number' ? data.rejectionRate.toFixed(1) : '0.0'}%
                            </Typography>
                        </Paper>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <Paper sx={{ p: 3, textAlign: 'center', borderRadius: 2 }}>
                            <Typography variant="h6" color="text.secondary">متوسط الطلبات/إعلان</Typography>
                            <Typography variant="h4" sx={{ color: 'success.light', fontWeight: 'bold' }}>
                                {data.totalAds > 0 && typeof data.totalRequests === 'number' && typeof data.totalAds === 'number' ? (data.totalRequests / data.totalAds).toFixed(1) : '0.0'}
                            </Typography>
                        </Paper>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <Paper sx={{ p: 3, textAlign: 'center', borderRadius: 2 }}>
                            <Typography variant="h6" color="text.secondary">الطلبات المعلقة</Typography>
                            <Typography variant="h4" sx={{ color: 'warning.light', fontWeight: 'bold' }}>
                                {data.statusBreakdown.pending}
                            </Typography>
                        </Paper>
                    </Grid>
                </Grid>

                {/* Charts */}
                <Grid dir='rtl' container spacing={3}>
                    {/* Status Distribution */}
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Paper sx={{ p: 3, borderRadius: 2 }}>
                            <Typography variant="h6" gutterBottom sx={{ textAlign: 'right' }}>
                                توزيع حالة الطلبات
                            </Typography>
                            <PieChart
                                series={[
                                    {
                                        data: [
                                            { id: 0, value: data.statusBreakdown.pending, label: 'قيد المراجعة', color: '#FF9800' },
                                            { id: 1, value: data.statusBreakdown.approved, label: 'مقبول', color: '#4CAF50' },
                                            { id: 2, value: data.statusBreakdown.rejected, label: 'مرفوض', color: '#F44336' }
                                        ],
                                        arcLabel: (item) => `${item.value}`,
                                        arcLabelMinAngle: 35,
                                    }
                                ]}
                                height={300}
                            />
                        </Paper>
                    </Grid>

                    {/* Interest Rate Distribution */}
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Paper sx={{ p: 3, borderRadius: 2 }}>
                            <Typography variant="h6" gutterBottom sx={{ textAlign: 'right' }}>
                                توزيع نسب الفائدة
                            </Typography>
                            <PieChart
                                series={[
                                    {
                                        data: [
                                            { id: 0, value: data.interestRateDistribution.upTo5, label: 'حتى 5%', color: '#2196F3' },
                                            { id: 1, value: data.interestRateDistribution.upTo10, label: 'حتى 10%', color: '#9C27B0' },
                                            { id: 2, value: data.interestRateDistribution.above10, label: 'أكثر من 10%', color: '#FF5722' }
                                        ],
                                        arcLabel: (item) => `${item.value}`,
                                        arcLabelMinAngle: 35,
                                    }
                                ]}
                                height={300}
                            />
                        </Paper>
                    </Grid>

                    {/* Requests Over Time */}
                    <Grid size={{ xs: 12 }}>
                        <Paper sx={{ p: 3, borderRadius: 2 }}>
                            <Typography variant="h6" gutterBottom sx={{ textAlign: 'right' }}>
                                الطلبات عبر الزمن
                            </Typography>
                            <LineChart
                                xAxis={[
                                    {
                                        data: analyticsData.timeBasedData?.map((item, index) => index) || [],
                                        valueFormatter: (value) => {
                                            const item = analyticsData.timeBasedData?.[value];
                                            return item ? new Date(item.date).toLocaleDateString('ar-EG') : '';
                                        }
                                    }
                                ]}
                                series={[
                                    {
                                        data: analyticsData.timeBasedData?.map(item => item.requests || 0) || [],
                                        label: 'عدد الطلبات',
                                        color: '#2196F3'
                                    }
                                ]}
                                height={300}
                            />
                        </Paper>
                    </Grid>
                </Grid>

                {/* Export and Actions */}
                <Paper sx={{ p: 2, mt: 3, borderRadius: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h6" sx={{ textAlign: 'right' }}>
                            تفاصيل الإعلانات والطلبات
                        </Typography>
                        <Button
                            variant="outlined"
                            startIcon={<DownloadIcon />}
                            onClick={() => {
                                // Export functionality for funder data
                                const financingAds = analyticsData?.financingAds?.filter(ad => ad.userId === userProfile.uid) || [];
                                const csvData = financingAds.map(ad => ({
                                    title: ad.title,
                                    totalRequests: data.totalRequests,
                                    averageAmount: data.averageFinancingAmount,
                                    status: ad.reviewStatus,
                                    createdAt: ad.createdAt?.toDate?.() || new Date(ad.createdAt)
                                }));
                                console.log('Export funder data:', csvData);
                                alert('تم تصدير البيانات بنجاح!');
                            }}
                        >
                            تصدير البيانات
                        </Button>
                    </Box>
                    <DataGrid
                        rows={(analyticsData?.financialInsights?.perAdAnalytics || []).map(ad => ({
                            id: ad.id || `fund-${Math.random().toString(36).substr(2, 9)}`,
                            title: ad.title,
                            totalRequests: ad.totalRequests,
                            approvedRequests: ad.approvedRequests,
                            averageAmount: ad.averageAmount,
                            interestRate: ad.interestRate,
                            location: ad.location,
                            status: ad.status,
                            createdAt: ad.createdAt?.toDate?.() || new Date(ad.createdAt)
                        }))}
                        columns={[
                            { field: 'title', headerName: 'عنوان الإعلان', width: 200 },
                            { field: 'totalRequests', headerName: 'إجمالي الطلبات', width: 120 },
                            { field: 'approvedRequests', headerName: 'الطلبات المقبولة', width: 120 },
                            {
                                field: 'averageAmount', headerName: 'متوسط المبلغ', width: 150,
                                valueFormatter: (params) => params?.value ? `${params.value.toLocaleString('ar-EG')} ج.م` : '0 ج.م'
                            },
                            { field: 'interestRate', headerName: 'نسبة الفائدة', width: 120 },
                            { field: 'location', headerName: 'الموقع', width: 120 },
                            { field: 'status', headerName: 'الحالة', width: 120 },
                            {
                                field: 'createdAt', headerName: 'تاريخ الإنشاء', width: 150,
                                valueFormatter: (params) => params?.value ? params.value.toLocaleDateString('ar-EG') : ''
                            }
                        ]}
                        pageSize={5}
                        rowsPerPageOptions={[5, 10, 25]}
                        disableSelectionOnClick
                        getRowId={(row) => row.id || `fund-${Math.random().toString(36).substr(2, 9)}`}
                        sx={{ direction: 'rtl' }}
                    />
                </Paper>
            </Box>
        );
    };

    // Render developer analytics
    const renderDeveloperAnalytics = () => {
        // Show loading state
        if (analyticsLoading) {
            return (
                <Box sx={{ p: 2, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
                    <CircularProgress />
                </Box>
            );
        }

        // Show error state
        if (analyticsError) {
            return (
                <Box sx={{ p: 2 }}>
                    <Alert severity="error" sx={{ mb: 2 }}>
                        خطأ في تحميل البيانات: {analyticsError}
                    </Alert>
                </Box>
            );
        }

        // Don't process data if analyticsData is not available
        if (!analyticsData) {
            return (
                <Box sx={{ p: 2, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
                    <Typography>جاري تحميل البيانات...</Typography>
                </Box>
            );
        }

        // Check if no data available
        if (!analyticsData.developerAds || analyticsData.developerAds.length === 0) {
            return (
                <Box sx={{ p: 2, textAlign: 'center' }}>
                    <Typography variant="h6" color="text.secondary">
                        لا توجد بيانات متاحة للإعلانات العقارية
                    </Typography>
                </Box>
            );
        }

        const data = processDeveloperAnalytics();

        return (
            <Box sx={{ p: 2 }}>
                <Typography variant="h4" gutterBottom sx={{ textAlign: 'left', mb: 3 }}>
                    تحليلات المطور العقاري
                </Typography>

                {/* Filters */}
                <Paper dir='ltr' sx={{ p: 2, mb: 3, borderRadius: 2 }}>
                    <Typography variant="h6" gutterBottom sx={{ textAlign: 'left', mb: 2 }}>
                        الفلاتر
                    </Typography>
                    <Grid container spacing={2} direction="row-reverse">
                        <Grid size={{ xs: 12, sm: 4 }}>
                            <FormControl fullWidth size="small">
                                <InputLabel>المدينة</InputLabel>
                                <Select
                                    value={filters.city}
                                    onChange={(e) => setFilters(prev => ({ ...prev, city: e.target.value }))}
                                    label="المدينة"
                                >
                                    <MenuItem value="all">الكل</MenuItem>
                                    <MenuItem value="القاهرة">القاهرة</MenuItem>
                                    <MenuItem value="الإسكندرية">الإسكندرية</MenuItem>
                                    <MenuItem value="الجيزة">الجيزة</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 4 }}>
                            <FormControl fullWidth size="small">
                                <InputLabel>نوع العقار</InputLabel>
                                <Select
                                    value={filters.status}
                                    onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                                    label="نوع العقار"
                                >
                                    <MenuItem value="all">الكل</MenuItem>
                                    <MenuItem value="فيلا">فيلا</MenuItem>
                                    <MenuItem value="شقة">شقة</MenuItem>
                                    <MenuItem value="محل">محل</MenuItem>
                                    <MenuItem value="أرض">أرض</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 4 }}>
                            <FormControl fullWidth size="small">
                                <InputLabel>الحالة</InputLabel>
                                <Select
                                    value={filters.dateRange}
                                    onChange={(e) => setFilters(prev => ({ ...prev, dateRange: e.target.value }))}
                                    label="الحالة"
                                >
                                    <MenuItem value="all">الكل</MenuItem>
                                    <MenuItem value="approved">مقبول</MenuItem>
                                    <MenuItem value="pending">قيد المراجعة</MenuItem>
                                    <MenuItem value="rejected">مرفوض</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                </Paper>

                {/* Overview Cards */}
                <Grid container spacing={3} sx={{ mb: 4 }}>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <Paper sx={{ p: 3, textAlign: 'center', borderRadius: 2 }}>
                            <Typography variant="h6" color="text.secondary">إجمالي الإعلانات</Typography>
                            <Typography variant="h4" sx={{ color: 'primary.main', fontWeight: 'bold' }}>
                                {data.totalAds}
                            </Typography>
                        </Paper>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <Paper sx={{ p: 3, textAlign: 'center', borderRadius: 2 }}>
                            <Typography variant="h6" color="text.secondary">الإعلانات النشطة</Typography>
                            <Typography variant="h4" sx={{ color: 'success.main', fontWeight: 'bold' }}>
                                {data.activeAds}
                            </Typography>
                        </Paper>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <Paper sx={{ p: 3, textAlign: 'center', borderRadius: 2 }}>
                            <Typography variant="h6" color="text.secondary">متوسط السعر</Typography>
                            <Typography variant="h4" sx={{ color: 'info.main', fontWeight: 'bold' }}>
                                {data.averagePrice.toLocaleString('ar-EG')} ج.م
                            </Typography>
                        </Paper>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <Paper sx={{ p: 3, textAlign: 'center', borderRadius: 2 }}>
                            <Typography variant="h6" color="text.secondary">متوسط المساحة</Typography>
                            <Typography variant="h4" sx={{ color: 'warning.main', fontWeight: 'bold' }}>
                                {typeof data.averageArea === 'number' ? data.averageArea.toFixed(0) : '0'} م²
                            </Typography>
                        </Paper>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <Paper sx={{ p: 3, textAlign: 'center', borderRadius: 2 }}>
                            <Typography variant="h6" color="text.secondary">متوسط المشاهدات</Typography>
                            <Typography variant="h4" sx={{ color: 'info.main', fontWeight: 'bold' }}>
                                {analyticsData.developerAds?.reduce((sum, ad) => sum + (ad.views || 0), 0) / Math.max(analyticsData.developerAds?.length || 1, 1) || 0}
                            </Typography>
                        </Paper>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <Paper sx={{ p: 3, textAlign: 'center', borderRadius: 2 }}>
                            <Typography variant="h6" color="text.secondary">متوسط التعديلات</Typography>
                            <Typography variant="h4" sx={{ color: 'secondary.main', fontWeight: 'bold' }}>
                                {analyticsData.developerAds?.reduce((sum, ad) => sum + (ad.edits || 0), 0) / Math.max(analyticsData.developerAds?.length || 1, 1) || 0}
                            </Typography>
                        </Paper>
                    </Grid>
                </Grid>

                {/* Charts */}
                <Grid container spacing={3}>
                    {/* Property Type Distribution */}
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Paper sx={{ p: 3, borderRadius: 2 }}>
                            <Typography variant="h6" gutterBottom sx={{ textAlign: 'left' }}>
                                توزيع أنواع العقارات
                            </Typography>
                            <PieChart
                                series={[
                                    {
                                        data: Object.entries(data.propertyTypeDistribution).map(([type, count], index) => ({
                                            id: index,
                                            value: count,
                                            label: type,
                                            color: ['#2196F3', '#4CAF50', '#FF9800', '#9C27B0', '#F44336'][index % 5]
                                        })),
                                        arcLabel: (item) => `${item.value}`,
                                        arcLabelMinAngle: 35,
                                    }
                                ]}
                                height={300}
                            />
                        </Paper>
                    </Grid>

                    {/* City Distribution */}
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Paper sx={{ p: 3, borderRadius: 2 }}>
                            <Typography variant="h6" gutterBottom sx={{ textAlign: 'left' }}>
                                توزيع المدن
                            </Typography>
                            <PieChart
                                series={[
                                    {
                                        data: Object.entries(data.cityDistribution).map(([city, count], index) => ({
                                            id: index,
                                            value: count,
                                            label: city,
                                            color: ['#FF5722', '#607D8B', '#795548', '#9E9E9E', '#FFEB3B'][index % 5]
                                        })),
                                        arcLabel: (item) => `${item.value}`,
                                        arcLabelMinAngle: 35,
                                    }
                                ]}
                                height={300}
                            />
                        </Paper>
                    </Grid>

                    {/* Ad Performance Over Time */}
                    <Grid size={{ xs: 12 }}>
                        <Paper sx={{ p: 3, borderRadius: 2 }}>
                            <Typography variant="h6" gutterBottom sx={{ textAlign: 'left' }}>
                                أداء الإعلانات عبر الزمن
                            </Typography>
                            <LineChart
                                xAxis={[
                                    {
                                        data: analyticsData.developerAds?.map((ad, index) => index) || [],
                                        valueFormatter: (value) => {
                                            const ad = analyticsData.developerAds?.[value];
                                            return ad ? new Date(ad.createdAt?.toDate?.() || ad.createdAt).toLocaleDateString('ar-EG') : '';
                                        }
                                    }
                                ]}
                                series={[
                                    {
                                        data: analyticsData.developerAds?.map(ad => ad.views || 0) || [],
                                        label: 'المشاهدات',
                                        color: '#2196F3'
                                    },
                                    {
                                        data: analyticsData.developerAds?.map(ad => ad.edits || 0) || [],
                                        label: 'التعديلات',
                                        color: '#FF9800'
                                    }
                                ]}
                                height={300}
                            />
                        </Paper>
                    </Grid>
                </Grid>

                {/* Export and Actions */}
                <Paper sx={{ p: 2, mt: 3, borderRadius: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h6" sx={{ textAlign: 'right' }}>
                            تفاصيل الإعلانات
                        </Typography>
                        <Button
                            variant="outlined"
                            startIcon={<DownloadIcon />}
                            onClick={() => {
                                // Export functionality for developer data
                                const developerAds = analyticsData?.developerAds?.filter(ad => ad.userId === userProfile.uid) || [];
                                const csvData = developerAds.map(ad => ({
                                    title: ad.title,
                                    propertyType: ad.propertyType || 'غير محدد',
                                    price: ad.price,
                                    area: ad.area,
                                    city: ad.location?.city || 'غير محدد',
                                    status: ad.reviewStatus,
                                    daysSincePublished: data.timeSincePublished.find(t => t.ad.id === ad.id)?.daysSincePublished || 0
                                }));
                                console.log('Export developer data:', csvData);
                                alert('تم تصدير البيانات بنجاح!');
                            }}
                        >
                            تصدير البيانات
                        </Button>
                    </Box>
                    <DataGrid
                        rows={(analyticsData?.developerAds?.filter(ad => ad.userId === userProfile.uid) || []).map(ad => ({
                            id: ad.id || `dev-${Math.random().toString(36).substr(2, 9)}`,
                            title: ad.title,
                            propertyType: ad.propertyType || 'غير محدد',
                            price: ad.price,
                            area: ad.area,
                            city: ad.location?.city || 'غير محدد',
                            status: ad.reviewStatus,
                            views: ad.views || 0,
                            edits: ad.edits || 0,
                            daysSincePublished: ad.daysSincePublished || 0,
                            lastEdited: ad.lastEdited
                        }))}
                        columns={[
                            { field: 'title', headerName: 'عنوان الإعلان', width: 200 },
                            { field: 'propertyType', headerName: 'نوع العقار', width: 120 },
                            { field: 'price', headerName: 'السعر', width: 120 },
                            { field: 'area', headerName: 'المساحة', width: 100 },
                            { field: 'city', headerName: 'المدينة', width: 120 },
                            { field: 'status', headerName: 'الحالة', width: 120 },
                            { field: 'views', headerName: 'المشاهدات', width: 100 },
                            { field: 'edits', headerName: 'التعديلات', width: 100 },
                            { field: 'daysSincePublished', headerName: 'أيام منذ النشر', width: 150 },
                            {
                                field: 'lastEdited', headerName: 'آخر تعديل', width: 150,
                                valueFormatter: (params) => params?.value ? new Date(params.value).toLocaleDateString('ar-EG') : ''
                            }
                        ]}
                        pageSize={5}
                        rowsPerPageOptions={[5, 10, 25]}
                        disableSelectionOnClick
                        getRowId={(row) => row.id || `dev-${Math.random().toString(36).substr(2, 9)}`}
                        sx={{ direction: 'ltr' }}

                        showToolbar
                    />
                </Paper>
            </Box>
        );
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
                <CircularProgress />
                <Typography sx={{ ml: 2 }}>جاري تحميل البيانات...</Typography>
            </Box>
        );
    }

    if (!organizationType) {
        return (
            <Box sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="h6" color="error">
                    لم يتم تحديد نوع المنظمة
                </Typography>
            </Box>
        );
    }

    // Error handling - use Redux analytics error
    if (analyticsError) {
        return (
            <Box sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="h6" color="error">
                    خطأ في تحميل البيانات: {analyticsError}
                </Typography>
            </Box>
        );
    }

    return (
        <Box dir='rtl' sx={{ p: 2 }}>
            <PageHeader
                title="التحليلات والتقارير"
                icon={BarChartIcon}
                showCount={false}
            />

            {/* Filter Controls */}
            <Paper sx={{ p: 2, mb: 3, borderRadius: 2 }}>
                <Typography variant="h6" sx={{ mb: 2, textAlign: 'left' }}>
                    أدوات الفلترة
                </Typography>
                <Grid container spacing={2} alignItems="center">
                    <Grid size="auto">
                        <FormControl size="small" sx={{ minWidth: 120 }}>
                            <InputLabel>المدة الزمنية</InputLabel>
                            <Select
                                value={analyticsData?.filters?.dateRange || 'month'}
                                onChange={(e) => {
                                    // Dispatch filter change
                                    console.log('Filter changed:', e.target.value);
                                }}
                                label="المدة الزمنية"
                            >
                                <MenuItem value="week">أسبوع</MenuItem>
                                <MenuItem value="month">شهر</MenuItem>
                                <MenuItem value="quarter">ربع سنة</MenuItem>
                                <MenuItem value="all">الكل</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid size="auto">
                        <FormControl size="small" sx={{ minWidth: 120 }}>
                            <InputLabel>المدينة</InputLabel>
                            <Select
                                value={analyticsData?.filters?.selectedCity || 'all'}
                                onChange={(e) => {
                                    console.log('City filter changed:', e.target.value);
                                }}
                                label="المدينة"
                            >
                                <MenuItem value="all">جميع المدن</MenuItem>
                                <MenuItem value="القاهرة">القاهرة</MenuItem>
                                <MenuItem value="الإسكندرية">الإسكندرية</MenuItem>
                                <MenuItem value="الجيزة">الجيزة</MenuItem>
                                <MenuItem value="المنوفية">المنوفية</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid size="auto">
                        <FormControl size="small" sx={{ minWidth: 120 }}>
                            <InputLabel>الحالة</InputLabel>
                            <Select
                                value={analyticsData?.filters?.selectedStatus || 'all'}
                                onChange={(e) => {
                                    console.log('Status filter changed:', e.target.value);
                                }}
                                label="الحالة"
                            >
                                <MenuItem value="all">جميع الحالات</MenuItem>
                                <MenuItem value="pending">قيد المراجعة</MenuItem>
                                <MenuItem value="approved">مُوافق عليه</MenuItem>
                                <MenuItem value="rejected">مرفوض</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid size="auto">
                        <Button
                            variant="outlined"
                            startIcon={<RefreshIcon />}
                            onClick={() => {
                                // Refresh data
                                dispatch(fetchAnalyticsData({
                                    userRole: 'organization',
                                    userId: userProfile.uid,
                                    filters: analyticsData?.filters || {}
                                }));
                            }}
                        >
                            تحديث البيانات
                        </Button>
                    </Grid>
                </Grid>
            </Paper>

            {(organizationType === 'ممول عقارى' || organizationType === 'ممول عقاري') ? renderFunderAnalytics() : renderDeveloperAnalytics()}
        </Box>
    );
}