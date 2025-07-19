import * as React from 'react';
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
import {
    Typography, Box, Paper, Tabs, Tab, CssBaseline, AppBar, Toolbar, IconButton, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider, Avatar, Button, Collapse, Grid, Dialog, DialogTitle, DialogContent, DialogActions, TextField, ListItemAvatar, Tooltip,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Alert,
    CircularProgress,
    Snackbar,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import DashboardIcon from '@mui/icons-material/Dashboard';
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
import PaymentsTwoToneIcon from '@mui/icons-material/PaymentsTwoTone';

import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import LogoutIcon from '@mui/icons-material/Logout';
import { logout } from '../LoginAndRegister/featuresLR/authSlice';
import SettingsIcon from '@mui/icons-material/Settings';
import FavoriteIcon from '@mui/icons-material/Favorite';

import { addUser, editUser, deleteUser } from '../reduxToolkit/slice/usersSlice';
import { addOrganization, editOrganization, deleteOrganization } from '../reduxToolkit/slice/organizationsSlice';
import { addAdmin, editAdmin, deleteAdmin } from '../reduxToolkit/slice/adminsSlice';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import rtlPlugin from 'stylis-plugin-rtl';
import { StyledEngineProvider } from '@mui/material/styles';

import { DataGrid } from '@mui/x-data-grid';
import { useDemoData } from '@mui/x-data-grid-generator';
import { setProfilePic } from '../reduxToolkit/slice/profilePicSlice';
import { MOCK_ADVERTISEMENTS } from './mockAds';
import { Chip, Link, Stack } from '@mui/material';
import { Timestamp } from 'firebase/firestore';
import LocationOnIcon from '@mui/icons-material/LocationOn';

import HomeWorkIcon from '@mui/icons-material/HomeWork';     // For Rental
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
// user profile
import { fetchUserProfile, updateUserProfile } from "../LoginAndRegister/featuresLR/userSlice"; // Adjust path if necessary
// import { setProfilePic } from "../LoginAndRegister/featuresLR/profilePicSlice";
// Define shared data of users profile
const governorates = [
    "القاهرة", "الإسكندرية", "الجيزة", "الشرقية", "الدقهلية", "البحيرة", "المنيا", "أسيوط",
];
const organizationTypes = ["مطور عقاري", "ممول عقاري"];
const genders = ["ذكر", "أنثى", "غير محدد"];

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
        segment: 'dashboard',
        title: 'لوحة التحكم',
        icon: <DashboardIcon />,
        tooltip: 'لوحة التحكم',
    },
    {
        segment: 'profile',
        title: 'الملف الشخصي',
        icon: <AccountBoxIcon />,
        tooltip: 'الملف الشخصي',
    },
    {
        segment: 'favproperties',
        title: 'المفضلة',
        icon: <FavoriteIcon />,
        tooltip: 'المفضلة',
    },
    {
        segment: 'orders',
        title: 'الطلبات',
        icon: <ShoppingCartIcon />,
        tooltip: 'الطلبات',
    },
    {
        segment: 'clientadvertisment',
        title: 'إعلاناتى المجانية',
        icon: <SupervisedUserCircleIcon />,
        tooltip: 'إعلاناتى ',
    },
    {
        segment: 'paidclientadvertisment',
        title: 'إعلاناتى المدفوعة',
        icon: <PaymentsTwoToneIcon />,
        tooltip: 'إعلاناتى المدفوعة',
    },

    {
        kind: 'divider',
    },
    {
        kind: 'header',
        title: 'التحليلات',

    },
    {
        segment: 'charts',
        title: 'الرسم البيانى',
        icon: <BarChartIcon />,
        tooltip: 'الرسم البيانى',
    },
    {
        segment: 'reports',
        title: 'التقرير',
        icon: <DescriptionIcon />,
        tooltip: 'التقرير',
    },
    // {
    //     segment: 'reports',
    //     title: 'التقارير',
    //     icon: <BarChartIcon />,
    //     tooltip: 'التقارير',
    //     children: [

    //     ],
    // },
    {
        segment: 'settings',
        title: 'إعدادات الحساب',
        icon: <SettingsIcon />,
        tooltip: 'إعدادات الحساب',
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

function ProfilePage() {
    const dispatch = useDispatch();

    // This line correctly selects the UID string from Redux.
    // If 'authUid' is still an object here, it's being passed as a prop from a parent.
    const authUidFromRedux = useSelector((state) => state.auth.uid);
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

    // Determine the actual UID to use, prioritizing the string if passed as object
    const actualUid = typeof authUidFromRedux === 'object' && authUidFromRedux !== null
        ? authUidFromRedux.uid // If it's an object, extract the uid property
        : authUidFromRedux; // Otherwise, use it directly (should be a string)

    // Effect to fetch user profile when component mounts or UID changes
    useEffect(() => {
        const loadProfile = async () => {
            // Log the actual UID being used and its type
            console.log("ProfilePage useEffect (start): actualUid =", actualUid, "Type =", typeof actualUid);

            // Defensive check: Ensure actualUid is a non-empty string.
            if (typeof actualUid !== 'string' || actualUid.trim() === '') {
                console.warn("ProfilePage: Skipping fetchUserProfile due to invalid or empty actualUid:", actualUid);
                return; // Exit early if actualUid is not a valid string
            }

            // Only proceed if userProfile is not already loaded and status is idle
            if (userProfileStatus === "idle" && !userProfile) {
                try {
                    console.log("ProfilePage: Dispatching fetchUserProfile for UID:", actualUid);
                    await dispatch(fetchUserProfile(actualUid)).unwrap();
                    console.log("ProfilePage: fetchUserProfile fulfilled successfully.");
                } catch (error) {
                    console.error("ProfilePage: fetchUserProfile rejected with error:", error);
                }
            } else {
                console.log("ProfilePage: fetchUserProfile not dispatched (already loaded or not idle). Conditions:", {
                    actualUid: actualUid,
                    userProfileStatus: userProfileStatus,
                    userProfileExists: !!userProfile
                });
            }
        };
        loadProfile();
    }, [actualUid, userProfileStatus, userProfile, dispatch]); // Dependencies for useEffect

    // Effect to update local form data when Redux userProfile changes
    useEffect(() => {
        if (userProfile) {
            console.log("ProfilePage: userProfile updated in Redux, setting formData:", userProfile);
            setFormData({
                ...userProfile,
                email: userProfile.email || "",
            });
        } else {
            console.log("ProfilePage: userProfile is null or undefined, clearing formData.");
            setFormData({});
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
        // Basic validation (can be expanded)
        if (!formData.phone || !formData.city || !formData.governorate || !formData.address) {
            setSnackbarMessage("الرجاء ملء جميع الحقول المطلوبة.");
            setSnackbarSeverity("error");
            setSnackbarOpen(true);
            return;
        }

        // Prepare updates object based on user type
        const updates = {
            phone: formData.phone,
            city: formData.city,
            governorate: formData.governorate,
            address: formData.address,
            email: formData.email,
        };

        if (userProfile.type_of_user === "client") {
            updates.cli_name = formData.cli_name;
            updates.gender = formData.gender;
            updates.age = formData.age;
        } else if (userProfile.type_of_user === "organization") {
            updates.org_name = formData.org_name;
            updates.type_of_organization = formData.type_of_organization;
        }

        try {
            console.log("ProfilePage: Dispatching updateUserProfile for UID:", actualUid, "Updates:", updates);
            await dispatch(updateUserProfile({ uid: actualUid, updates })).unwrap();
            setSnackbarMessage("تم حفظ التغييرات بنجاح!");
            setSnackbarSeverity("success");
            setSnackbarOpen(true);
            console.log("ProfilePage: updateUserProfile fulfilled successfully.");
        } catch (error) {
            console.error("ProfilePage: updateUserProfile rejected with error:", error);
            setSnackbarMessage(error || "حدث خطأ أثناء حفظ التغييرات.");
            setSnackbarSeverity("error");
            setSnackbarOpen(true);
        }
    };

    // UploadAvatars sub-component
    const UploadAvatars = () => {
        const handleImageChange = (event) => {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    const newImageUrl = reader.result;
                    dispatch(setProfilePic(newImageUrl));
                };
                reader.readAsDataURL(file);
            }
        };

        const handleRemoveImage = () => {
            dispatch(setProfilePic("./admin.jpg"));
        };

        return (
            <Box sx={{ p: 2, borderRadius: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                <Avatar
                    src={currentProfilePic}
                    sx={{ width: 120, height: 120, mb: 3, boxShadow: '0px 4px 10px rgba(0,0,0,0.1)' }}
                />
                <input
                    accept="image/*"
                    style={{ display: 'none' }}
                    id="profile-pic-upload"
                    type="file"
                    onChange={handleImageChange}
                />
                <label htmlFor="profile-pic-upload">
                    <Button variant="contained" component="span" sx={{ mb: 1, mr: 1 }}>
                        تغيير الصورة
                    </Button>
                </label>
                <Button
                    variant="outlined"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={handleRemoveImage}
                >
                    إزالة الصورة
                </Button>
            </Box>
        );
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
                <Alert severity="warning">Please log in to view your profile.</Alert>
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
                <Alert severity="warning">Profile data not found. Please ensure your profile is complete.</Alert>
            </Box>
        );
    }

    return (
        <Box sx={{ p: 2, textAlign: 'right' }}>
            <Typography variant="h3" sx={{ display: 'flex', flexDirection: 'row-reverse', mb: 3 }}>حسابي</Typography>
            <Paper sx={{ p: 4, borderRadius: 2, minHeight: 400, textAlign: 'right', boxShadow: '0px 0px 8px rgba(0,0,0,0.2)' }}>
                <Grid container spacing={4} direction="row-reverse">
                    <Grid item xs={12} md={4} lg={3}> {/* Adjusted column width for avatar */}
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                            <UploadAvatars />
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={8} lg={9}> {/* Adjusted column width for fields */}
                        <Box>
                            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', fontSize: '1.5rem', display: 'flex', flexDirection: 'row-reverse' }}>المعلومات الشخصية</Typography>

                            {/* Common Fields */}
                            {userProfile.type_of_user === "client" ? (
                                <TextField
                                    label="الاسم الكامل"
                                    fullWidth
                                    margin="normal"
                                    name="cli_name"
                                    value={formData.cli_name || ""}
                                    onChange={handleChange}
                                    InputProps={{ style: { direction: 'rtl' } }}
                                />
                            ) : (
                                <TextField
                                    label="اسم المنظمة"
                                    fullWidth
                                    margin="normal"
                                    name="org_name"
                                    value={formData.org_name || ""}
                                    onChange={handleChange}
                                    InputProps={{ style: { direction: 'rtl' } }}
                                />
                            )}

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
                            <TextField
                                label="البريد الإلكتروني"
                                fullWidth
                                margin="normal"
                                name="email"
                                value={formData.email || ""}
                                onChange={handleChange}
                                type="email"
                                InputProps={{ style: { direction: 'ltr' } }}
                                disabled // Email is usually not editable after registration
                            />
                            {/* Password field - typically not pre-filled for security. User would change it via a separate flow. */}
                            <TextField
                                label="كلمة المرور"
                                fullWidth
                                margin="normal"
                                type="password"
                                placeholder="******"
                                InputProps={{ style: { direction: 'ltr' } }}
                                disabled // Disable for direct editing, suggest a separate "Change Password" feature
                            />

                            {/* Client-specific fields */}
                            {userProfile.type_of_user === "client" && (
                                <>
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

                                    <TextField
                                        label="العمر"
                                        fullWidth
                                        margin="normal"
                                        name="age"
                                        value={formData.age || ""}
                                        onChange={handleChange}
                                        type="number"
                                        InputProps={{ style: { direction: 'ltr' } }}
                                    />
                                </>
                            )}

                            {/* Organization-specific fields */}
                            {userProfile.type_of_user === "organization" && (
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
                                    >
                                        {organizationTypes.map((type) => (
                                            <MenuItem key={type} value={type}>{type}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            )}

                            {/* Location Fields (Common to both) */}
                            <TextField
                                label="المحافظة"
                                fullWidth
                                margin="normal"
                                name="governorate"
                                value={formData.governorate || ""}
                                onChange={handleChange}
                                select // Use select for dropdown
                                InputProps={{ style: { direction: 'rtl' } }}
                            >
                                {governorates.map((gov) => (
                                    <MenuItem key={gov} value={gov}>{gov}</MenuItem>
                                ))}
                            </TextField>

                            <TextField
                                label="المدينة"
                                fullWidth
                                margin="normal"
                                name="city"
                                value={formData.city || ""}
                                onChange={handleChange}
                                InputProps={{ style: { direction: 'rtl' } }}
                            />

                            <TextField
                                label="العنوان التفصيلي"
                                fullWidth
                                margin="normal"
                                name="address"
                                value={formData.address || ""}
                                onChange={handleChange}
                                multiline
                                rows={3}
                                InputProps={{ style: { direction: 'rtl' } }}
                            />

                            <Button variant="contained" color="primary" onClick={handleSave} sx={{ mt: 2, fontSize: '1.2rem' }}>
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

                {activeTab === 'admins' && (
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
                )}
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


function FavPropertiesPage() {
    // Mock data for favorite properties as plain JavaScript objects,
    // but structured like your FavoriteData class properties.
    const [favoriteProperties, setFavoriteProperties] = useState([
        {
            id: 'FAV001',
            user_id: 'user123',
            advertisement_id: 'ADV12345',
            saved_at: Timestamp.fromDate(new Date('2025-06-15T10:00:00Z')),
            property_name: 'منزل العائلة الفاخر', // Luxurious Family Home
            property_address: 'حي الزهور، القاهرة الجديدة', // Al-Zuhour District, New Cairo
            property_type: 'Home',
            status: 'For Sale',
        },
        {
            id: 'FAV002',
            user_id: 'user123',
            advertisement_id: 'ADV12346',
            saved_at: Timestamp.fromDate(new Date('2025-06-20T14:30:00Z')),
            property_name: 'فيلا مطلة على النيل', // Villa with Nile View
            property_address: 'الزمالك، القاهرة', // Zamalek, Cairo
            property_type: 'Villa',
            status: 'For Rent',
        },
        {
            id: 'FAV003',
            user_id: 'user123',
            advertisement_id: 'ADV12347',
            saved_at: Timestamp.fromDate(new Date('2025-07-01T09:15:00Z')),
            property_name: 'شقة عصرية بوسط المدينة', // Modern Apartment Downtown
            property_address: 'المهندسين، الجيزة', // Mohandessin, Giza
            property_type: 'Apartment',
            status: 'Financing',
        },
        {
            id: 'FAV004',
            user_id: 'user456',
            advertisement_id: 'ADV12348',
            saved_at: Timestamp.fromDate(new Date('2025-06-25T11:00:00Z')),
            property_name: 'استوديو أنيق', // Elegant Studio
            property_address: 'الساحل الشمالي', // North Coast
            property_type: 'Studio',
            status: 'For Sale',
        },
    ]);

    const handleDeleteFavorite = (favoriteId) => {
        // This still works because we're just filtering based on the 'id' property
        setFavoriteProperties((prevFavs) => prevFavs.filter((fav) => fav.id !== favoriteId));
        alert('تم حذف العقار من المفضلة بنجاح!'); // Property removed from favorites successfully!
    };

    return (
        <Box sx={{ p: 2, textAlign: 'right' }}>
            <Typography variant="h4" sx={{ display: 'flex', flexDirection: 'row-reverse' }} gutterBottom>
                العقارات المفضلة
            </Typography>
            <Paper sx={{ p: 2, borderRadius: 2, minHeight: 400, textAlign: 'right', direction: 'rtl' }}>
                <Typography variant="h6" color="text.secondary" sx={{ mb: 2, textAlign: 'left' }}>
                    : قائمة العقارات المفضلة لديك
                </Typography>

                {favoriteProperties.length === 0 ? (
                    <Typography variant="body1" color="text.secondary" sx={{ mt: 4, textAlign: 'center' }}>
                        لا توجد عقارات مفضلة حتى الآن.
                    </Typography>
                ) : (
                    <List>
                        {favoriteProperties.map((fav) => (
                            <ListItem
                                key={fav.id}
                                disablePadding
                                divider
                                secondaryAction={
                                    <IconButton
                                        edge="end"
                                        aria-label="delete"
                                        onClick={() => handleDeleteFavorite(fav.id)}
                                        sx={{ color: 'red' }}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                }
                                sx={{ py: 1 }}
                            >
                                <ListItemText
                                    primary={
                                        <Grid container alignItems="center" spacing={1} direction="row-reverse">
                                            <Grid item>
                                                <FavoriteIcon fontSize="small" color="primary" />
                                            </Grid>
                                            <Grid item>
                                                <Typography variant="body1" component="span" sx={{ fontWeight: 'bold' }}>
                                                    {fav.property_name}
                                                </Typography>
                                            </Grid>
                                            <Grid item>
                                                <Chip
                                                    label={fav.status === 'For Sale' ? 'للبيع' : fav.status === 'For Rent' ? 'للإيجار' : 'تمويل'}
                                                    size="small"
                                                    color={fav.status === 'For Sale' ? 'success' : fav.status === 'For Rent' ? 'warning' : 'info'}
                                                    sx={{ mr: 1 }}
                                                />
                                            </Grid>
                                        </Grid>
                                    }
                                    secondary={
                                        // This Stack component renders as a <div> by default, which was inside <p>
                                        <Stack direction="column" spacing={0.5} sx={{ mt: 0.5 }}>
                                            <Box display="flex" alignItems="center" flexDirection="row-reverse">
                                                <LocationOnIcon fontSize="small" sx={{ color: 'text.secondary', ml: 0.5 }} />
                                                <Typography variant="body2" color="text.secondary">
                                                    {fav.property_address}
                                                </Typography>
                                            </Box>
                                            <Typography variant="caption" color="text.disabled">
                                                ID: {fav.advertisement_id} | النوع: {fav.property_type} | تمت الإضافة في: {fav.saved_at.toDate().toLocaleDateString('ar-EG')}
                                            </Typography>
                                        </Stack>
                                    }
                                    primaryTypographyProps={{ component: 'div' }}
                                    // Add this line to render the secondary content within a <div>
                                    secondaryTypographyProps={{ component: 'div' }}
                                />
                            </ListItem>
                        ))}
                    </List>
                )}
            </Paper>
        </Box>
    );
}

function Mainadvertisment() {
    const adverts = [
        { id: 1, title: 'Advert 1', description: 'Description for Advert 1' },
        { id: 2, title: 'Advert 2', description: 'Description for Advert 2' },
        { id: 3, title: 'Advert 3', description: 'Description for Advert 3' },
    ]
    return (
        <Box>
            <Typography variant="h4" sx={{ display: 'flex', flexDirection: 'row-reverse' }} gutterBottom>إعلانات القسم الرئيسي</Typography>
            <Paper sx={{ p: 2, borderRadius: 2, minHeight: 400, textAlign: 'right' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexDirection: 'row-reverse' }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', fontSize: 18 }} color="text.secondary">قائمة الإعلانات</Typography>
                    <Tooltip title="إضافة" >
                        <Button sx={{ fontWeight: 'bold', fontSize: 16 }} variant="outlined" startIcon={<AddIcon sx={{ ml: 1 }} />} >
                            إضافة إعلان
                        </Button>
                    </Tooltip>
                </Box>
                <List>
                    {adverts.map((advert) =>
                        <ListItem
                            key={advert.id}
                            disablePadding
                            secondaryAction={
                                <Box sx={{ display: 'flex', gap: 1, flexDirection: 'row-reverse' }}>
                                    <Tooltip title="تعديل">
                                        <IconButton edge="start" aria-label="edit">
                                            <EditIcon sx={{ color: 'purple' }} />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="حذف">
                                        <IconButton edge="start" aria-label="delete" >
                                            <DeleteIcon sx={{ color: 'red' }} />
                                        </IconButton>
                                    </Tooltip>
                                </Box>
                            }
                            sx={{ mb: 1.5, p: 1 }}
                        >

                            <ListItemText
                                primary={advert.title}
                                secondary={advert.description}

                            />
                            <ListItemAvatar sx={{ display: 'flex', flexDirection: 'row-reverse' }}>
                                <img
                                    src='./home.jpg'
                                    style={{ height: 20, marginRight: 8, scale: 2 }}
                                />

                            </ListItemAvatar>
                        </ListItem>
                    )
                    }
                </List>
            </Paper>
        </Box>
    )
}

function PaidAdvertismentPage() {
    // State to manage the active tab
    const [activeTab, setActiveTab] = React.useState('paidAds'); // 'paidAds' or 'freeAds'

    // Handler for tab changes
    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    // Data for the 'Paid Advertisements' tab
    const { data: paidAdsData, loading: paidAdsLoading } = useDemoData({
        dataSet: 'Commodity', // Or a different dataset for paid ads
        rowLength: 4,
        maxColumns: 6,
    });

    // Data for the 'Free Advertisements' tab
    // Let's use a different dataSet or modify rowLength/maxColumns to distinguish
    const { data: freeAdsData, loading: freeAdsLoading } = useDemoData({
        dataSet: 'Employee', // Using 'Employee' dataset for the second tab as an example
        rowLength: 5,
        maxColumns: 5,
    });

    // Function to get the DataGrid content based on the active tab
    const renderDataGrid = () => {
        if (activeTab === 'paidAds') {
            return (
                <DataGrid
                    {...paidAdsData}
                    loading={paidAdsLoading} // Pass loading state
                    localeText={{
                        toolbarQuickFilterPlaceholder: 'البحث عن إعلان', // Arabic for 'Search commodities'
                        // Add other Arabic translations for the paid ads DataGrid
                        // filterPanelOperator: 'المشغل',
                        // ...

                    }}
                    showToolbar
                />
            );
        } else if (activeTab === 'freeAds') {
            return (
                <DataGrid
                    {...freeAdsData}
                    loading={freeAdsLoading} // Pass loading state
                    localeText={{
                        toolbarQuickFilterPlaceholder: 'البحث عن موظفين', // Arabic for 'Search employees'
                        // Add other Arabic translations for the free ads DataGrid
                        // filterPanelOperator: 'المشغل',
                        // ...
                    }}
                    showToolbar
                />
            );
        }
        return null; // Should not happen, but good practice
    };

    return (
        <Box dir={'rtl'} sx={{ p: 2, textAlign: 'right' }}>

            <Typography sx={{ display: 'flex', flexDirection: 'row' }} variant="h4" gutterBottom>
                إلاعلانات المدفوعة
            </Typography>
            <Paper dir={'rtl'} sx={{ p: 2, borderRadius: 2, minHeight: 400, textAlign: 'right' }}>
                {/* Header and Title */}

                {/* Tabs for switching */}
                <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
                    <Tabs
                        variant='scrollable'
                        value={activeTab}
                        onChange={handleTabChange}
                        aria-label="advertisement tabs"
                        centered
                        textColor="primary"
                        indicatorColor="primary"
                    >
                        <Tab value="paidAds" label="إعلانات مطوريين عقاريين" />
                        <Tab value="freeAds" label="إعلانات ممولين عقاريين" />
                    </Tabs>
                </Box>

                {/* DataGrid Container */}
                <div style={{ height: 400, width: '100%', padding: '1rem' }}>
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
                إعلاناتى
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
function PaidClientAdvertismentPage() {
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
                إعلاناتى المدفوعة
            </Typography>
            <Paper sx={{ p: 2, textAlign: 'left', flexGrow: 1, minHeight: '480px' }}>
                <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
                    قائمة الإعلانات المدفوعة
                </Typography>
            </Paper>
        </Box>
    );
}
function OrdersPage() {
    const [activeSubTab, setActiveSubTab] = useState('rental'); // Default to 'rental'

    // Mock data for each activity type (replace with actual data or Redux state)
    const rentalActivity = [
        {
            id: 'RENT001',
            property: 'شقة سكنية بالدقي', // Residential apartment in Dokki
            details: 'غرفتين نوم، حمام واحد، مفروش بالكامل', // 2 bedrooms, 1 bathroom, fully furnished
            startDate: '2024-01-01',
            endDate: '2025-01-01',
            status: 'نشط', // Active
            amount: '15,000 ج.م/شهر' // 15,000 EGP/month
        },
        {
            id: 'RENT002',
            property: 'فيلا بمدينة الشيخ زايد', // Villa in Sheikh Zayed City
            details: '5 غرف نوم، 3 حمامات، حديقة خاصة', // 5 bedrooms, 3 bathrooms, private garden
            startDate: '2023-07-15',
            endDate: '2024-07-14',
            status: 'منتهي', // Expired
            amount: '30,000 ج.م/شهر'
        },
        {
            id: 'RENT003',
            property: 'مكتب إداري بالمعادي', // Administrative office in Maadi
            details: 'مساحة 120 متر مربع، إطلالة على النيل', // 120 sqm, Nile view
            startDate: '2024-03-20',
            endDate: '2025-03-19',
            status: 'معلق', // Pending
            amount: '10,000 ج.م/شهر'
        },
    ];

    const purchaseActivity = [
        {
            id: 'BUY001',
            property: 'قطعة أرض بالتجمع الخامس', // Plot of land in New Cairo
            details: 'مساحة 500 متر مربع، جاهزة للبناء', // 500 sqm, ready for construction
            purchaseDate: '2024-05-10',
            amount: '5,000,000 ج.م', // 5,000,000 EGP
            status: 'مكتمل', // Completed
        },
        {
            id: 'BUY002',
            property: 'شقة استثمارية بالساحل الشمالي', // Investment apartment in North Coast
            details: 'غرفتين نوم، شرفة مطلة على البحر', // 2 bedrooms, sea view balcony
            purchaseDate: '2024-02-28',
            amount: '2,200,000 ج.م', // 2,200,000 EGP
            status: 'تحت المراجعة', // Under Review
        },
    ];

    const fundingRequests = [
        {
            id: 'FUNDREQ001',
            amount: '1,500,000 ج.م',
            purpose: 'تمويل شراء عقار سكني', // Financing for residential property purchase
            status: 'قيد الانتظار', // Pending
            requestDate: '2024-06-01',
            notes: 'طلب تمويل لشقة جديدة في العاصمة الإدارية', // Funding request for new apartment in Administrative Capital
        },
        {
            id: 'FUNDREQ002',
            amount: '800,000 ج.م',
            purpose: 'تمويل ترميم عقار', // Financing for property renovation
            status: 'موافق عليه', // Approved
            requestDate: '2024-04-10',
            notes: 'ترميم فيلا تاريخية في الزمالك', // Renovation of a historic villa in Zamalek
        },
        {
            id: 'FUNDREQ003',
            amount: '3,000,000 ج.م',
            purpose: 'تمويل مشروع تجاري', // Financing for commercial project
            status: 'مرفوض', // Rejected
            requestDate: '2024-03-05',
            notes: 'بناء مركز تجاري جديد', // Construction of a new commercial center
        },
    ];

    // Helper to get status color
    const getStatusColor = (status) => {
        switch (status) {
            case 'نشط':
            case 'مكتمل':
            case 'موافق عليه':
                return 'success';
            case 'منتهي':
            case 'مرفوض':
                return 'error';
            case 'معلق':
            case 'تحت المراجعة':
            case 'قيد الانتظار':
                return 'warning';
            default:
                return 'default';
        }
    };

    // Function to render content based on active tab
    const renderContent = () => {
        switch (activeSubTab) {
            case 'rental':
                return (
                    <Box>
                        <Typography variant="h6" color="text.secondary" sx={{ mb: 2, textAlign: 'left' }}>
                            نشاط الإيجار الخاص بي
                        </Typography>
                        {rentalActivity.length === 0 ? (
                            <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', mt: 4 }}>
                                لا يوجد نشاط إيجار حتى الآن.
                            </Typography>
                        ) : (
                            <List>
                                {rentalActivity.map((activity, index) => (
                                    <React.Fragment key={activity.id}>
                                        <ListItem
                                            disablePadding
                                            sx={{ flexDirection: 'row-reverse', py: 1 }}
                                        // Fix hydration error: Ensure primary and secondary props use component="div"
                                        // if they contain block-level elements like Grid or Stack.
                                        // ListItemText defaults secondary to <p>, primary to <span>
                                        >
                                            <ListItemText
                                                primary={
                                                    <Grid container alignItems="center" spacing={1} direction="row-reverse">
                                                        <Grid item>
                                                            <HomeWorkIcon fontSize="small" color="primary" />
                                                        </Grid>
                                                        <Grid item>
                                                            <Typography variant="body1" component="span" sx={{ fontWeight: 'bold' }}>
                                                                {activity.property}
                                                            </Typography>
                                                        </Grid>
                                                        <Grid item>
                                                            <Chip
                                                                label={activity.status}
                                                                size="small"
                                                                color={getStatusColor(activity.status)}
                                                                sx={{ mr: 1 }}
                                                            />
                                                        </Grid>
                                                    </Grid>
                                                }
                                                secondary={
                                                    <Stack direction="column" spacing={0.5} sx={{ mt: 0.5 }}>
                                                        <Typography variant="body2" color="text.primary">
                                                            {activity.details}
                                                        </Typography>
                                                        <Typography variant="caption" color="text.secondary">
                                                            الفترة: {activity.startDate} - {activity.endDate} | المبلغ: {activity.amount}
                                                        </Typography>
                                                        <Typography variant="caption" color="text.disabled">
                                                            ID: {activity.id}
                                                        </Typography>
                                                    </Stack>
                                                }
                                                primaryTypographyProps={{ component: 'div' }}
                                                secondaryTypographyProps={{ component: 'div' }}
                                            />
                                        </ListItem>
                                        {index < rentalActivity.length - 1 && <Divider component="li" sx={{ my: 1 }} />}
                                    </React.Fragment>
                                ))}
                            </List>
                        )}
                    </Box>
                );
            case 'purchase':
                return (
                    <Box>
                        <Typography variant="h6" color="text.secondary" sx={{ mb: 2, textAlign: 'left' }}>
                            نشاط الشراء الخاص بي
                        </Typography>
                        {purchaseActivity.length === 0 ? (
                            <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', mt: 4 }}>
                                لا يوجد نشاط شراء حتى الآن.
                            </Typography>
                        ) : (
                            <List>
                                {purchaseActivity.map((activity, index) => (
                                    <React.Fragment key={activity.id}>
                                        <ListItem
                                            disablePadding
                                            sx={{ flexDirection: 'row-reverse', py: 1 }}
                                        >
                                            <ListItemText
                                                primary={
                                                    <Grid container alignItems="center" spacing={1} direction="row-reverse">
                                                        <Grid item>
                                                            <ShoppingCartIcon fontSize="small" color="primary" />
                                                        </Grid>
                                                        <Grid item>
                                                            <Typography variant="body1" component="span" sx={{ fontWeight: 'bold' }}>
                                                                {activity.property}
                                                            </Typography>
                                                        </Grid>
                                                        <Grid item>
                                                            <Chip
                                                                label={activity.status}
                                                                size="small"
                                                                color={getStatusColor(activity.status)}
                                                                sx={{ mr: 1 }}
                                                            />
                                                        </Grid>
                                                    </Grid>
                                                }
                                                secondary={
                                                    <Stack direction="column" spacing={0.5} sx={{ mt: 0.5 }}>
                                                        <Typography variant="body2" color="text.primary">
                                                            {activity.details}
                                                        </Typography>
                                                        <Typography variant="caption" color="text.secondary">
                                                            تاريخ الشراء: {activity.purchaseDate} | المبلغ: {activity.amount}
                                                        </Typography>
                                                        <Typography variant="caption" color="text.disabled">
                                                            ID: {activity.id}
                                                        </Typography>
                                                    </Stack>
                                                }
                                                primaryTypographyProps={{ component: 'div' }}
                                                secondaryTypographyProps={{ component: 'div' }}
                                            />
                                        </ListItem>
                                        {index < purchaseActivity.length - 1 && <Divider component="li" sx={{ my: 1 }} />}
                                    </React.Fragment>
                                ))}
                            </List>
                        )}
                    </Box>
                );
            case 'funding':
                return (
                    <Box>
                        <Typography variant="h6" color="text.secondary" sx={{ mb: 2, textAlign: 'left' }}>
                            طلبات التمويل
                        </Typography>
                        {fundingRequests.length === 0 ? (
                            <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', mt: 4 }}>
                                لا توجد طلبات تمويل حتى الآن.
                            </Typography>
                        ) : (
                            <List>
                                {fundingRequests.map((request, index) => (
                                    <React.Fragment key={request.id}>
                                        <ListItem
                                            disablePadding
                                            sx={{ flexDirection: 'row-reverse', py: 1 }}
                                        >
                                            <ListItemText
                                                primary={
                                                    <Grid container alignItems="center" spacing={1} direction="row-reverse">
                                                        <Grid item>
                                                            <AccountBalanceWalletIcon fontSize="small" color="primary" />
                                                        </Grid>
                                                        <Grid item>
                                                            <Typography variant="body1" component="span" sx={{ fontWeight: 'bold' }}>
                                                                الغرض: {request.purpose}
                                                            </Typography>
                                                        </Grid>
                                                        <Grid item>
                                                            <Chip
                                                                label={request.status}
                                                                size="small"
                                                                color={getStatusColor(request.status)}
                                                                sx={{ mr: 1 }}
                                                            />
                                                        </Grid>
                                                    </Grid>
                                                }
                                                secondary={
                                                    <Stack direction="column" spacing={0.5} sx={{ mt: 0.5 }}>
                                                        <Typography variant="body2" color="text.primary">
                                                            المبلغ المطلوب: {request.amount}
                                                        </Typography>
                                                        <Typography variant="caption" color="text.secondary">
                                                            تاريخ الطلب: {request.requestDate}
                                                        </Typography>
                                                        {request.notes && (
                                                            <Typography variant="caption" color="text.disabled">
                                                                ملاحظات: {request.notes}
                                                            </Typography>
                                                        )}
                                                        <Typography variant="caption" color="text.disabled">
                                                            ID: {request.id}
                                                        </Typography>
                                                    </Stack>
                                                }
                                                primaryTypographyProps={{ component: 'div' }}
                                                secondaryTypographyProps={{ component: 'div' }}
                                            />
                                        </ListItem>
                                        {index < fundingRequests.length - 1 && <Divider component="li" sx={{ my: 1 }} />}
                                    </React.Fragment>
                                ))}
                            </List>
                        )}
                    </Box>
                );
            default:
                return null;
        }
    };

    return (
        <Box sx={{ p: 2, textAlign: 'right' }}>
            <Typography variant="h4" sx={{ display: 'flex', flexDirection: 'row-reverse' }} gutterBottom>
                سجل الأنشطة والطلبات
            </Typography>

            {/* Navigation Buttons */}
            <Box sx={{ mb: 2, display: 'flex', gap: 1, flexDirection: 'row-reverse' }}>
                <Button
                    variant={activeSubTab === 'rental' ? 'contained' : 'outlined'}
                    onClick={() => setActiveSubTab('rental')}
                    sx={{ borderRadius: 2, fontSize: '17px' }}
                >
                    نشاط الإيجار الخاص بي
                </Button>
                <Button
                    variant={activeSubTab === 'purchase' ? 'contained' : 'outlined'}
                    onClick={() => setActiveSubTab('purchase')}
                    sx={{ borderRadius: 2, fontSize: '17px' }}
                >
                    نشاط الشراء الخاص بي
                </Button>
                <Button
                    variant={activeSubTab === 'funding' ? 'contained' : 'outlined'}
                    onClick={() => setActiveSubTab('funding')}
                    sx={{ borderRadius: 2, fontSize: '17px' }}
                >
                    طلبات التمويل
                </Button>
            </Box>

            {/* Main Content Area */}
            <Paper sx={{ p: 2, borderRadius: 2, minHeight: 400, textAlign: 'right', direction: 'rtl' }}>
                {renderContent()}
            </Paper>
        </Box>
    );
}

function ChartsPage() {
    return (
        <Box sx={{ p: 2, textAlign: 'right' }}>
            <Typography variant="h4" gutterBottom>Charts Reports</Typography>
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

function ReportsPage() {
    return (
        <Box sx={{ p: 2, textAlign: 'right' }}>
            <Typography variant="h4" gutterBottom>Reports Reports</Typography>
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

function SettingsPage() {
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

export default function ClientDashboard(props) {
    const { window } = props;
    const [open, setOpen] = React.useState(true);
    const [openReports, setOpenReports] = React.useState(false);
    const [mode, setMode] = React.useState('light');
    const profilePicInDrawer = useSelector((state) => state.profilePic.profilePicUrl);
    const userProfile = useSelector((state) => state.user.profile);
    const userName = userProfile?.adm_name || userProfile?.cli_name || userProfile?.org_name || 'Client';
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

    const router = useDemoRouter('/dashboard');

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
            navigate('/login'); // Redirect to login page
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
        case '/favproperties':
            currentPageContent = <FavPropertiesPage />;
            break;
        // case '/mainadvertisment':
        //     currentPageContent = <Mainadvertisment />;
        //     break;
        case '/clientadvertisment':
            currentPageContent = <ClientAdvertismentPage />;
            break;
        case '/paidclientadvertisment':
            currentPageContent = <PaidClientAdvertismentPage />;
            break;
        case '/orders':
            currentPageContent = <OrdersPage />;
            break;
        case '/charts':
            currentPageContent = <ChartsPage />;
            break;
        case '/reports':
            currentPageContent = <ReportsPage />;
            break;
        case '/settings':
            currentPageContent = <SettingsPage />;
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
                                            src={profilePicInDrawer || './admin.jpg'}
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