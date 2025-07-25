import * as React from 'react';
import { useState, useEffect, useMemo } from 'react';
import { useSelector, useDispatch ,shallowEqual } from 'react-redux';
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
import MessageIcon from '@mui/icons-material/Message';
import NotificationsIcon from '@mui/icons-material/Notifications';
import LogoutIcon from '@mui/icons-material/Logout';
import { logout } from '../../LoginAndRegister/featuresLR/authSlice';
import { addUser, editUser, deleteUser } from '../../reduxToolkit/slice/usersSlice';
import { addOrganization, editOrganization, deleteOrganization } from '../../reduxToolkit/slice/organizationsSlice';
import { addAdmin, editAdmin, deleteAdmin } from '../../reduxToolkit/slice/adminsSlice';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import rtlPlugin from 'stylis-plugin-rtl';
import { StyledEngineProvider } from '@mui/material/styles';

import { DataGrid } from '@mui/x-data-grid';
import { setProfilePic } from '../../reduxToolkit/slice/profilePicSlice';
import { MOCK_ADVERTISEMENTS } from '../mockAds';
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
import { desktopOS, valueFormatter } from './webUsageStats';
//  msg 
import MoreVertIcon from '@mui/icons-material/MoreVert'; // For dropdown menu on inquiry status
import DoneOutlineIcon from '@mui/icons-material/DoneOutline'; // For contacted
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty'; // For pending
import CloseIcon from '@mui/icons-material/Close'; // For closed
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

import {
    updateInquiry,
    deleteInquiry,
    setFilterStat,
} from '../../reduxToolkit/slice/inquiriesSlice';
// import { selectProperties } from '../../reduxToolkit/slice/propertiesSlice';

// org profile
import { fetchUserProfile, updateUserProfile, uploadAndSaveProfileImage } from "../../LoginAndRegister/featuresLR/userSlice";
import sendResetPasswordEmail from "../../FireBase/authService/sendResetPasswordEmail";
import { auth } from "../../FireBase/firebaseConfig";
import { signOut } from "firebase/auth";
import { fetchDeveloperAdsByUser } from "../../feature/ads/developerAdsSlice";
import { fetchFinancingAdsByUser } from "../../feature/ads/financingAdsSlice";
import { 
    // fetchAllHomepageAds, 
    fetchHomepageAdsByUser, 
    createHomepageAd, 
    updateHomepageAd, 
    deleteHomepageAd,
    // approveHomepageAd,
    // rejectHomepageAd,
    // returnHomepageAdToPending,
    // activateHomepageAd,
    // deactivateHomepageAd
} from "../../feature/ads/homepageAdsSlice";
import Notification from '../../FireBase/MessageAndNotification/Notification';
// financing 
import FinancingAdvertisement from '../../FireBase/modelsWithOperations/FinancingAdvertisement';
import FinancingRequest from '../../FireBase/modelsWithOperations/FinancingRequest';
import { fetchFinancialRequests, updateFinancialRequest, deleteFinancialRequest } from '../../reduxToolkit/slice/financialRequestSlice';
// Define shared data (could be moved to a constants file)
const governorates = [
    "القاهرة", "الإسكندرية", "الجيزة", "الشرقية", "الدقهلية", "البحيرة", "المنيا", "أسيوط",
];
const organizationTypes = ["مطور عقاري", "ممول عقاري"];
// Login Logout 
// import { logoutUser } from '../../reduxToolkit/authSlice';
import { useNavigate } from 'react-router-dom';

// Import the ConfirmDeleteModal
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
    {
        segment: 'integrations',
        title: 'إضافات',
        icon: <LayersIcon />,
        tooltip: 'إضافات',
    },
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
            <Typography variant="h4" display={'flex'} flexDirection={'row-reverse'} gutterBottom>لوحة التحكم</Typography>

            <Grid container spacing={3} direction="row-reverse">

                {/* Main Summary Cards - Arranged for immediate overview */}
                {/* 1. Total Listed Properties */}
                <Grid item xs={12} sm={6} md={3}>
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
                <Grid item xs={12} sm={6} md={3}>
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
                <Grid item xs={12} sm={6} md={3}>
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
                <Grid item xs={12} sm={6} md={3}>
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
                <Grid item xs={12}>
                    <Divider sx={{ my: 2 }} /> {/* Add a divider for clearer separation */}
                </Grid>

                {/* Detailed Panels - Occupy more space below */}



                {/* Number of Agents Card (moved to second row, or keep on first, depending on preference) */}
                {/* Decided to keep with top row, as it's a high-level summary count. */}
                {/* If you prefer it here, uncomment below and comment out its Grid item above. */}
                <Grid item xs={12} md={6}>
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
                <Grid item xs={12} md={6}>
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
                <Grid item xs={12} md={6}>
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
    const [formData, setFormData] = useState({});
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
                    <Grid item xs={12} md={4} lg={3}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                            <UploadAvatars />
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={8} lg={9}>
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
                                value={typeof formData.city === 'object' ? formData.city.full || '' : formData.city}
                                onChange={handleChange}
                                InputProps={{ style: { direction: 'rtl' } }}
                            />

                            <TextField
                                label="العنوان التفصيلي"
                                fullWidth
                                margin="normal"
                                name="address"
                                value={typeof formData.address === 'object' ? formData.address.full || '' : formData.address}
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
            <Typography variant="h4" sx={{ display: 'flex', flexDirection: 'row-reverse' }} gutterBottom>
                إدارة العقارات
            </Typography>

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
                                                <Grid item>
                                                    <HomeIcon fontSize="small" color="primary" />
                                                </Grid>
                                                <Grid item>
                                                    <Typography variant="body1" component="span" sx={{ fontWeight: 'bold', fontSize: '1rem' }}>
                                                        {property.name}
                                                    </Typography>
                                                </Grid>
                                                <Grid item>
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
    const [selectedAd, setSelectedAd] = useState(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState("success");

    // Fetch homepage ads by user when component mounts or userProfile.uid changes
    useEffect(() => {
        if (userProfile?.uid) {
            console.log("Mainadvertisment - Dispatching fetchHomepageAdsByUser for UID:", userProfile.uid);
            dispatch(fetchHomepageAdsByUser(userProfile.uid));
        } else {
            console.log("Mainadvertisment - userProfile.uid not available, skipping fetchHomepageAdsByUser.");
        }
    }, [dispatch, userProfile?.uid]); // Re-fetch if userProfile.uid changes

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

    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbarOpen(false);
    };

    return (
        <Box sx={{ p: 2, textAlign: 'right' }}>
            <Typography variant="h4" sx={{ display: 'flex', flexDirection: 'row-reverse', mb: 3 }} gutterBottom>
                إعلانات القسم الرئيسي
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
                                            تاريخ الإنشاء: {ad.createdAt ? formatDate(ad.createdAt) : 'غير محدد'}
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

                                    {/* Actions (simplified for organization view) */}
                                <Box sx={{ display: 'flex', gap: 1, flexDirection: 'row-reverse' }}>
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
    const userProfile = useSelector((state) => state.user.profile);
    const developerAds = useSelector((state) => state.developerAds?.byUser || []);
    const financingAds = useSelector((state) => state.financingAds?.byUser || []);
    const developerAdsLoading = useSelector((state) => state.developerAds?.loading || false);
    const financingAdsLoading = useSelector((state) => state.financingAds?.loading || false);

    // State to manage the active tab
    const [activeTab, setActiveTab] = React.useState('developer'); // 'developer' or 'funder'

    // Handler for tab changes
    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    // Fetch ads when component mounts or user profile changes
    useEffect(() => {
        if (userProfile?.uid) {
            // Fetch both types of ads for the logged-in user
            dispatch(fetchDeveloperAdsByUser(userProfile.uid));
            dispatch(fetchFinancingAdsByUser(userProfile.uid));
        }
    }, [dispatch, userProfile?.uid]);

    // Determine which ads to show based on organization type
    const getAdsToShow = () => {
        if (!userProfile) return { ads: [], loading: false, type: null };

        const orgType = userProfile.type_of_organization;
        
        if (orgType === "مطور عقاري") {
            return {
                ads: developerAds,
                loading: developerAdsLoading,
                type: "developer"
            };
        } else if (orgType === "ممول عقاري") {
            return {
                ads: financingAds,
                loading: financingAdsLoading,
                type: "funder"
            };
        }
        
        return { ads: [], loading: false, type: null };
    };

    const { ads: currentAds, loading: currentLoading, type: currentType } = getAdsToShow();

    // Define columns for developer ads
    const developerColumns = [
        { field: 'id', headerName: 'ID', width: 90 },
        { field: 'developer_name', headerName: 'اسم المطور', width: 200 },
        { field: 'description', headerName: 'الوصف', width: 300 },
        { field: 'project_types', headerName: 'أنواع المشاريع', width: 150, 
            renderCell: (params) => Array.isArray(params.value) ? params.value.join(', ') : params.value },
        { field: 'price_start_from', headerName: 'السعر من', width: 120, type: 'number' },
        { field: 'price_end_to', headerName: 'السعر إلى', width: 120, type: 'number' },
        { field: 'status', headerName: 'الحالة', width: 120,
            renderCell: (params) => (
                <Chip
                    label={params.value}
                    color={params.value === 'جاهز للسكن' ? 'success' : 'warning'}
                    size="small"
                />
            )
        },
        { field: 'ads', headerName: 'مفعل', width: 100,
            renderCell: (params) => (
                <Chip
                    label={params.value ? 'نعم' : 'لا'}
                    color={params.value ? 'success' : 'default'}
                    size="small"
                />
            )
        },
        { field: 'reviewStatus', headerName: 'حالة المراجعة', width: 120,
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
        }
    ];

    // Define columns for financing ads
    const financingColumns = [
        { field: 'id', headerName: 'ID', width: 90 },
        { field: 'funder_name', headerName: 'اسم الممول', width: 200 },
        { field: 'description', headerName: 'الوصف', width: 300 },
        { field: 'financing_types', headerName: 'أنواع التمويل', width: 150,
            renderCell: (params) => Array.isArray(params.value) ? params.value.join(', ') : params.value },
        { field: 'min_amount', headerName: 'الحد الأدنى', width: 120, type: 'number' },
        { field: 'max_amount', headerName: 'الحد الأقصى', width: 120, type: 'number' },
        { field: 'interest_rate', headerName: 'معدل الفائدة', width: 120 },
        { field: 'ads', headerName: 'مفعل', width: 100,
            renderCell: (params) => (
                <Chip
                    label={params.value ? 'نعم' : 'لا'}
                    color={params.value ? 'success' : 'default'}
                    size="small"
                />
            )
        },
        { field: 'reviewStatus', headerName: 'حالة المراجعة', width: 120,
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
        }
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

        const orgType = userProfile.type_of_organization;
        const columns = orgType === "مطور عقاري" ? developerColumns : financingColumns;

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
                    toolbarQuickFilterPlaceholder: `البحث في إعلانات ${orgType === "مطور عقاري" ? "المطورين" : "الممولين"}`,
                    noRowsLabel: `لا توجد إعلانات ${orgType === "مطور عقاري" ? "مطورين" : "ممولين"} لعرضها`,
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
            />
        );
    };

    // Get the appropriate title based on organization type
    const getPageTitle = () => {
        if (!userProfile) return "إعلاناتي المدفوعة";
        
        const orgType = userProfile.type_of_organization;
        if (orgType === "مطور عقاري") {
            return "إعلاناتي كمطور عقاري";
        } else if (orgType === "ممول عقاري") {
            return "إعلاناتي كممول عقاري";
        }
        return "إعلاناتي المدفوعة";
    };

    return (
        <Box dir={'rtl'} sx={{ p: 2, textAlign: 'right' }}>
            <Typography sx={{ display: 'flex', flexDirection: 'row' }} variant="h4" gutterBottom>
                {getPageTitle()}
            </Typography>
            
            {/* {userProfile && (
                <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                    نوع المنظمة: {userProfile.type_of_organization}
                </Typography>
            )} */}
            
            <Paper dir={'rtl'} sx={{ p: 2, borderRadius: 2, minHeight: 400, textAlign: 'right' }}>
                {/* DataGrid Container */}
                <div style={{ height: 600, width: '100%', padding: '1rem' }}>
                    {renderDataGrid()}
                </div>
            </Paper>
        </Box>
    );
}

function ClientAdvertismentPage() {
    const columns = [
        { field: 'title', headerName: 'العنوان', width: 250, editable: false },
        {
            field: 'images',
            headerName: 'الصورة',
            width: 100,
            renderCell: (params) => (
                <Avatar
                    src={params.value && params.value.length > 0 ? params.value[0] : ''}
                    variant="rounded"
                    sx={{ width: 50, height: 50 }}
                />
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
            field: 'ad_status',
            headerName: 'الحالة',
            width: 120,
            editable: false,
            renderCell: (params) => (
                <Chip
                    label={params.value}
                    color={params.value === 'تحت العرض' ? 'primary' : 'default'}
                    size="small"
                />
            ),
        },
        { field: 'address', headerName: 'العنوان التفصيلي', width: 300, editable: false },
        { field: 'date_of_building', headerName: 'تاريخ الإنشاء', width: 150, editable: false },
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
                minHeight: 'calc(100% - 64px - 48px)',
            }}
        >
            <Typography sx={{ display: 'flex', flexDirection: 'row' }} variant="h4" gutterBottom>
                إعلانات العملاء
            </Typography>

            <Paper
                dir={'rtl'}
                sx={{
                    p: 2,
                    textAlign: 'left',
                    display: 'flex',
                    flexDirection: 'column',
                    flexGrow: 1,
                    minHeight: 'calc(100vh - 64px - 48px)',
                }}
            >
                <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
                    قائمة الإعلانات الحالية
                </Typography>

                <Box
                    sx={{
                        flexGrow: 1,
                        height: '100vh',
                        width: '100%',
                        minHeight: 0,
                        overflow: 'auto',
                    }}
                >
                    <DataGrid
                        rows={MOCK_ADVERTISEMENTS}
                        columns={columns}
                        pageSizeOptions={[5, 10, 20, 30, 50]}
                        initialState={{
                            pagination: {
                                paginationModel: { pageSize: 10, page: 0 },
                            },
                        }}
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

                        }}
                        showToolbar
                    />
                </Box>
            </Paper>
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
    const dispatch = useDispatch();
    const [ads, setAds] = useState([]);
    const [loadingAds, setLoadingAds] = useState(true);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    // Redux slice state
    const requests = useSelector((state) => state.financialRequests.list);
    const requestsLoading = useSelector((state) => state.financialRequests.loading);
    const requestsError = useSelector((state) => state.financialRequests.error);
    const [actionLoading, setActionLoading] = useState({});

    // Fetch all financing ads for this org
    useEffect(() => {
        let isMounted = true;
        if (!userProfile?.uid) return;
        setLoadingAds(true);
        FinancingAdvertisement.getByUserId(userProfile.uid)
            .then((ads) => {
                if (isMounted) setAds(ads);
            })
            .catch(() => {
                setSnackbar({ open: true, message: 'فشل تحميل الإعلانات', severity: 'error' });
            })
            .finally(() => {
                if (isMounted) setLoadingAds(false);
            });
        return () => { isMounted = false; };
    }, [userProfile?.uid]);

    // Fetch all financing requests on mount
    useEffect(() => {
        dispatch(fetchFinancialRequests());
    }, [dispatch]);

    // Action handlers using Redux slice
    const handleRequestAction = async (reqId, action, adId, ...args) => {
        setActionLoading((prev) => ({ ...prev, [reqId]: true }));
        try {
            if (action === 'pending') {
                await dispatch(updateFinancialRequest({ id: reqId, updates: { reviewStatus: 'pending' } })).unwrap();
                setSnackbar({ open: true, message: 'تمت إعادة الطلب للمراجعة', severity: 'info' });
            } else if (action === 'reject') {
                await dispatch(updateFinancialRequest({ id: reqId, updates: { reviewStatus: 'rejected', review_note: args[0] || '' } })).unwrap();
                setSnackbar({ open: true, message: 'تم رفض الطلب', severity: 'error' });
            } else if (action === 'delete') {
                await dispatch(deleteFinancialRequest(reqId)).unwrap();
                setSnackbar({ open: true, message: 'تم حذف الطلب', severity: 'success' });
            }
        } catch (e) {
            setSnackbar({ open: true, message: e.message || 'خطأ في تنفيذ العملية', severity: 'error' });
        } finally {
            setActionLoading((prev) => ({ ...prev, [reqId]: false }));
        }
    };

    return (
        <Box  sx={{ p: 2, textAlign: 'left' }}>
            <Typography variant="h4" gutterBottom>طلبات التمويل على إعلاناتك</Typography>
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
                ) : requestsLoading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
                        <CircularProgress />
                        <Typography sx={{ ml: 2 }}>جاري تحميل الطلبات...</Typography>
                    </Box>
                ) : requestsError ? (
                    <Alert severity="error">{requestsError}</Alert>
                ) : (
                    ads.map((ad) => {
                        const requestsForAd = requests.filter((r) => r.advertisement_id === ad.id);
                        return (
                            <Box key={ad.id}  sx={{ mb: 4, border: '1px solid #eee', borderRadius: 2, p: 2 }}>
                                <Box dir='ltr' sx={{ textAlign: 'left' }}>
                                <Typography variant="h6" color="primary" sx={{ mb: 1 }}>{ad.title}</Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>الحد الأدنى: {ad.start_limit} | الحد الأقصى: {ad.end_limit}</Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>نسبة الفائدة حتى 5 سنوات: {ad.interest_rate_upto_5}% | حتى 10 سنوات: {ad.interest_rate_upto_10}% | أكثر من 10 سنوات: {ad.interest_rate_above_10}%</Typography>
                                </Box>
                                {requestsForAd.length > 0 ? (
                                    <List>
                                        {requestsForAd.map((req) => (
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
                                                    <Button
                                                        variant="outlined"
                                                        color="success"
                                                        size="small"
                                                        disabled={actionLoading[req.id]}
                                                        onClick={() => handleRequestAction(req.id, 'pending', ad.id)}
                                                    >
                                                        إعادة للمراجعة
                                                    </Button>
                                                    <Button
                                                        variant="outlined"
                                                        color="error"
                                                        size="small"
                                                        disabled={actionLoading[req.id]}
                                                        onClick={() => handleRequestAction(req.id, 'reject', ad.id, 'تم الرفض من قبل المؤسسة')}
                                                    >
                                                        رفض
                                                    </Button>
                                                    <Button
                                                        variant="outlined"
                                                        color="secondary"
                                                        size="small"
                                                        disabled={actionLoading[req.id]}
                                                        onClick={() => handleRequestAction(req.id, 'delete', ad.id)}
                                                    >
                                                        حذف
                                                    </Button>
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
            <Typography variant="h4" gutterBottom>Sales Reports</Typography>
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

export default function OrganizationDashboard(props) {
    const { window } = props;
    const [open, setOpen] = React.useState(true);
    const [openReports, setOpenReports] = React.useState(false);
    const [mode, setMode] = React.useState('light');
    const profilePicInDrawer = useSelector((state) => state.profilePic.profilePicUrl);
    const userProfile = useSelector((state) => state.user.profile);
    const userName = userProfile?.adm_name || userProfile?.cli_name || userProfile?.org_name || 'Organization';
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

    const handleDrawerToggle = () => {
        setOpen(!open);
    };

    const handleReportsClick = () => {
        setOpenReports(!openReports);
    };


    // logout
    const dispatch = useDispatch();
    const navigate = useNavigate();
    // const authStatus = useSelector((state) => state.auth.status); // Get auth status to disable button

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
        case '/inquiries':
            currentPageContent = <InquiriesPage />;
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

    // Notification state
    const [notifications, setNotifications] = React.useState([]);
    const [notificationAnchorEl, setNotificationAnchorEl] = React.useState(null);
    const [unreadCount, setUnreadCount] = React.useState(0);
    const [snackbarOpen, setSnackbarOpen] = React.useState(false);
    const [snackbarMessage, setSnackbarMessage] = React.useState('');
    const [snackbarSeverity, setSnackbarSeverity] = React.useState('success');
    const authUid = useSelector((state) => state.auth.uid);
    // Notification handlers
    const handleNotificationClick = (event) => {
        event.preventDefault();
        event.stopPropagation();
        setNotificationAnchorEl(event.currentTarget);
    };
    const handleNotificationClose = () => {
        setNotificationAnchorEl(null);
    };
    const handleMarkAsRead = async (notificationId) => {
        try {
            await Notification.markAsRead(notificationId);
            setNotifications(prev => prev.map(notif => notif.id === notificationId ? { ...notif, is_read: true } : notif));
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };
    const handleMarkAllAsRead = async () => {
        if (!authUid) return;
        try {
            await Notification.markAllAsRead(authUid);
            setNotifications(prev => prev.map(notif => ({ ...notif, is_read: true })));
            setUnreadCount(0);
        } catch (error) {
            console.error('Error marking all notifications as read:', error);
        }
    };
    // Real-time notification effect
    React.useEffect(() => {
        if (!authUid) return;
        const unsubscribeNotifications = Notification.subscribeByUser(authUid, (notifs) => {
            setNotifications(notifs);
        });
        const unsubscribeUnreadCount = Notification.subscribeUnreadCount(authUid, (count) => {
            setUnreadCount(count);
        });
        return () => {
            unsubscribeNotifications();
            unsubscribeUnreadCount();
        };
    }, [authUid]);

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
                                    {/* Notification Bell Icon */}
                                    <IconButton 
                                        sx={{ mr: -1 }} 
                                        onClick={handleNotificationClick} 
                                        color="inherit"
                                    >
                                        <Badge badgeContent={unreadCount} color="error">
                                            <NotificationsIcon />
                                        </Badge>
                                    </IconButton>
                                    {/* Notification Menu */}
                                    {notificationAnchorEl && (
                                        <Box sx={{ 
                                            position: 'absolute', 
                                            top: 60, 
                                            right: 20, 
                                            width: 400, 
                                            maxHeight: 500,
                                            backgroundColor: 'white',
                                            border: '1px solid #ccc',
                                            borderRadius: 1,
                                            zIndex: 1000,
                                            p: 2
                                        }}>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                                    الإشعارات ({notifications.length})
                                                </Typography>
                                                <Button size="small" onClick={handleMarkAllAsRead} disabled={unreadCount === 0}>
                                                    تعليم الكل كمقروء
                                                </Button>
                                                <IconButton size="small" onClick={handleNotificationClose}>
                                                    <CloseIcon />
                                                </IconButton>
                                            </Box>
                                            <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
                                                {notifications.length === 0 ? (
                                                    <Box sx={{ p: 3, textAlign: 'center' }}>
                                                        <Typography variant="body2" color="text.secondary">
                                                            لا توجد إشعارات
                                                        </Typography>
                                                    </Box>
                                                ) : (
                                                    notifications.map((notification) => (
                                                        <Card 
                                                            key={notification.id} 
                                                            sx={{ 
                                                                m: 1, 
                                                                cursor: 'pointer',
                                                                backgroundColor: notification.is_read ? 'transparent' : 'action.hover',
                                                                '&:hover': { backgroundColor: 'action.selected' },
                                                            }}
                                                            onClick={() => handleMarkAsRead(notification.id)}
                                                        >
                                                            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                                                                    <Typography 
                                                                        variant="subtitle2" 
                                                                        sx={{ fontWeight: notification.is_read ? 'normal' : 'bold', color: notification.is_read ? 'text.secondary' : 'text.primary' }}
                                                                    >
                                                                        {notification.title}
                                                                    </Typography>
                                                                    {!notification.is_read && (
                                                                        <Chip label="جديد" size="small" color="error" sx={{ fontSize: '0.6rem', height: 20 }} />
                                                                    )}
                                                                </Box>
                                                                <Typography variant="body2" color="text.secondary" sx={{ mb: 1, lineHeight: 1.4 }}>
                                                                    {notification.body}
                                                                </Typography>
                                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                                    <Typography variant="caption" color="text.secondary">
                                                                        {notification.timestamp?.toDate ? notification.timestamp.toDate().toLocaleString('ar-EG') : new Date(notification.timestamp).toLocaleString('ar-EG')}
                                                                    </Typography>
                                                                    {notification.type && (
                                                                        <Chip label={notification.type === 'system' ? 'نظام' : notification.type} size="small" variant="outlined" sx={{ fontSize: '0.6rem', height: 20 }} />
                                                                    )}
                                                                </Box>
                                                            </CardContent>
                                                        </Card>
                                                    ))
                                                )}
                                            </Box>
                                        </Box>
                                    )}
                                    <IconButton
                                        sx={{ ml: 1 }}
                                        color="inherit"
                                        onClick={() => navigate('/home')}
                                        title="العودة للصفحة الرئيسية"
                                    >
                                        <HomeIcon />
                                    </IconButton>
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