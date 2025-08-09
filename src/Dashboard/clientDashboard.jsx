import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
import {
    Typography, Box, Paper, Tabs, Tab, CssBaseline, AppBar, Toolbar, IconButton, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider, Avatar, Button, Collapse, Grid, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, TextField, ListItemAvatar, Tooltip,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Alert,
    CircularProgress,
    Snackbar,
    Badge,
    Menu,
    Card,
    CardContent,
    Chip,
    Popover
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
import NotificationsIcon from '@mui/icons-material/Notifications';
import NotificationList from '../pages/notificationList';
import CloseIcon from '@mui/icons-material/Close';

import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import LogoutIcon from '@mui/icons-material/Logout';
import { logout } from '../LoginAndRegister/featuresLR/authSlice';
import { performLogout } from '../utils/logoutUtils';
import SettingsIcon from '@mui/icons-material/Settings';
import FavoriteIcon from '@mui/icons-material/Favorite';

import { addUser, editUser, deleteUser } from '../reduxToolkit/slice/usersSlice';
import { addOrganization, editOrganization, deleteOrganization } from '../reduxToolkit/slice/organizationsSlice';
import { addAdmin, editAdmin, deleteAdmin } from '../reduxToolkit/slice/adminsSlice';
import { 
    fetchAdvertisements, 
    fetchAdvertisementsByUserId,
    clientReturnAdvertisementToPending, 
    clearAdvertisementsError 
} from '../reduxToolkit/slice/ClientAdvertismentSlice';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import rtlPlugin from 'stylis-plugin-rtl';
import { StyledEngineProvider } from '@mui/material/styles';

import { DataGrid } from '@mui/x-data-grid';
// import { useDemoData } from '@mui/x-data-grid-generator';

import { Link, Stack } from '@mui/material';
import { Timestamp } from 'firebase/firestore';
import LocationOnIcon from '@mui/icons-material/LocationOn';

import HomeWorkIcon from '@mui/icons-material/HomeWork';     // For Rental
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import RefreshIcon from '@mui/icons-material/Refresh';
// user profile
import { fetchUserProfile, updateUserProfile, uploadAndSaveProfileImage, clearProfile } from "../LoginAndRegister/featuresLR/userSlice";
import sendResetPasswordEmail from "../FireBase/authService/sendResetPasswordEmail";
import { auth } from "../FireBase/firebaseConfig"; // Adjust path if necessary
// import { setProfilePic } from "../LoginAndRegister/featuresLR/profilePicSlice";

// Import Notification class for real-time notifications
import Notification from '../FireBase/MessageAndNotification/Notification';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import deleteUserAccount from '../FireBase/authService/deleteUserAccount';
import FinancingRequest from '../FireBase/modelsWithOperations/FinancingRequest';
import FinancingAdvertisement from '../FireBase/modelsWithOperations/FinancingAdvertisement';
import ClientAdvertisement from '../FireBase/modelsWithOperations/ClientAdvertisemen';
import PageHeader from '../componenents/PageHeader';
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
        segment: 'profile',
        title: 'الملف الشخصي',
        icon: <AccountBoxIcon />,
        tooltip: 'الملف الشخصي',
    },
    {
        segment: 'orders',
        title: 'الطلبات',
        icon: <ShoppingCartIcon />,
        tooltip: 'الطلبات',
    },
    {
        segment: 'clientadvertisment',
        title: 'الإعلانات',
        icon: <SupervisedUserCircleIcon />,
        tooltip: 'الإعلانات',
    },
    {
        segment: 'settings',
        title: 'إعدادات الحساب',
        icon: <SettingsIcon />,
        tooltip: 'إعدادات الحساب',
    },
];

import { useTheme } from '../context/ThemeContext';


function DashboardPage() {
    return (
        <Box sx={{ p: 2, textAlign: 'right' }}>
            <PageHeader
                title="لوحة التحكم"
                icon={DashboardIcon}
                showCount={false}
            />
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

    // Get the UID directly from auth state
    const authUid = useSelector((state) => state.auth.uid);
    const authStatus = useSelector((state) => state.auth.status);

    // Select the full profile data from the user slice
    const userProfile = useSelector((state) => state.user.profile);
    const userProfileStatus = useSelector((state) => state.user.status);
    const userProfileError = useSelector((state) => state.user.error);



    // Local state for form inputs, initialized with default values to prevent controlled/uncontrolled issues
    const [formData, setFormData] = useState({
        cli_name: "",
        org_name: "",
        phone: "",
        email: "",
        gender: "",
        age: "",
        type_of_organization: "",
        governorate: "",
        city: "",
        address: "",
    });
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState("success");
    const [resetPasswordLoading, setResetPasswordLoading] = useState(false);

    // Use the UID directly from auth state
    const actualUid = authUid;

    // Effect to fetch user profile when component mounts or UID changes
    useEffect(() => {
        const loadProfile = async () => {
            console.log("ProfilePage useEffect (start): actualUid =", actualUid, "Type =", typeof actualUid);

            if (typeof actualUid !== 'string' || actualUid.trim() === '') {
                console.warn("ProfilePage: Skipping fetchUserProfile due to invalid or empty actualUid:", actualUid);
                return;
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
    }, [actualUid, userProfileStatus, userProfile]);// Removed dispatch from dependencies to prevent unnecessary refetches

    // Helper function to map gender values from database to form values
    const mapGenderValue = (dbGender) => {
        if (!dbGender) return "";
        const genderMap = {
            "male": "ذكر",
            "female": "أنثى",
            "other": "غير محدد",
            "ذكر": "ذكر",
            "أنثى": "أنثى",
            "غير محدد": "غير محدد"
        };
        return genderMap[dbGender] || "";
    };

    // Effect to update local form data when Redux userProfile changes
    const initialized = useRef(false);
    useEffect(() => {
        if (userProfile && !initialized.current) {
            setFormData({
                cli_name: userProfile.cli_name || "",
                org_name: userProfile.org_name || "",
                phone: userProfile.phone || "",
                email: auth.currentUser?.email || userProfile.email || "", // Get email from auth first, then fallback to profile
                gender: mapGenderValue(userProfile.gender),
                age: userProfile.age || "",
                type_of_organization: userProfile.type_of_organization || "",
                governorate: userProfile.governorate || "",
                city: userProfile.city || "",
                address: userProfile.address || "",
            });
            initialized.current = true;
        } else if (!userProfile) {
            setFormData({
                cli_name: "",
                org_name: "",
                phone: "",
                email: "",
                gender: "",
                age: "",
                type_of_organization: "",
                governorate: "",
                city: "",
                address: "",
            });
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

    // Helper function to map gender values from form to database values
    const mapGenderToDatabase = (formGender) => {
        if (!formGender) return "";
        const reverseGenderMap = {
            "ذكر": "male",
            "أنثى": "female",
            "غير محدد": "other"
        };
        return reverseGenderMap[formGender] || formGender;
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
            updates.gender = mapGenderToDatabase(formData.gender);
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
    if (authStatus === "loading") {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
                <Typography sx={{ ml: 2 }}>جاري تحميل البيانات...</Typography>
            </Box>
        );
    }

    if (userProfileStatus === "loading") {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
                <Typography sx={{ ml: 2 }}>جاري تحميل الملف الشخصي...</Typography>
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

    if (!userProfile && userProfileStatus !== "loading") {
        return (
            <Box sx={{ p: 3 }}>
                <Alert severity="error">فشل في تحميل الملف الشخصي. يرجى المحاولة مرة أخرى.</Alert>
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
                                sx={{ 
                                    '& .MuiInputBase-input.Mui-disabled': {
                                        WebkitTextFillColor: 'rgba(0, 0, 0, 0.87)', // Make disabled text visible
                                    }
                                }}
                            />
                            {/* Password field with reset button */}
                            <Box dir='rtl' sx={{ display: 'flex', gap: 2, alignItems: 'flex-end' }}>
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
                                        "إعادة تعيين"
                                    )}
                                </Button>
                            </Box>

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

                {/* Snackbar for notifications */}
                <Snackbar
                    open={snackbarOpen}
                    autoHideDuration={6000}
                    onClose={() => setSnackbarOpen(false)}
                    anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                >
                    <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity} sx={{ width: '100%' }}>
                        {snackbarMessage}
                    </Alert>
                </Snackbar>
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

function ClientAdvertismentPage() {
    const authUid = useSelector((state) => state.auth.uid);
    const navigate = useNavigate();
    
    // Local state for real-time advertisements
    const [advertisements, setAdvertisements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [openReturnDialog, setOpenReturnDialog] = useState(false);
    const [adToReturn, setAdToReturn] = useState(null);
    
    // State for delete confirmation
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [adToDelete, setAdToDelete] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);
    
    // State for filtering
    const [statusFilter, setStatusFilter] = useState('all');
    const [activationFilter, setActivationFilter] = useState('all');
    const [adTypeFilter, setAdTypeFilter] = useState('all');

    // Real-time subscription to user's advertisements
    useEffect(() => {
        if (!authUid) {
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);

        console.log("ClientAdvertismentPage: Setting up real-time subscription for user:", authUid);
        
        const unsubscribe = ClientAdvertisement.subscribeByUserId(authUid, (ads) => {
            console.log("ClientAdvertismentPage: Received real-time advertisements:", ads);
            setAdvertisements(ads);
            setLoading(false);
        });

        // Cleanup function to unsubscribe when component unmounts or authUid changes
        return () => {
            console.log("ClientAdvertismentPage: Cleaning up real-time subscription");
            unsubscribe();
        };
    }, [authUid]);

    // Filter advertisements to show only the current user's ads (already filtered by onSnapshot)
    const userAdvertisements = advertisements;
    
    // Apply additional filters
    const filteredAdvertisements = userAdvertisements.filter(ad => {
        const statusMatch = statusFilter === 'all' || ad.reviewStatus === statusFilter;
        const activationMatch = activationFilter === 'all' || 
            (activationFilter === 'active' && ad.ads) || 
            (activationFilter === 'inactive' && !ad.ads);
        const adTypeMatch = adTypeFilter === 'all' || ad.ad_type === adTypeFilter;
        return statusMatch && activationMatch && adTypeMatch;
    });

    const handleReturnToPending = (ad) => {
        setAdToReturn(ad);
        setOpenReturnDialog(true);
    };

    const handleConfirmReturn = async () => {
        if (adToReturn) {
            try {
                // Get the advertisement instance and call the method directly
                const adInstance = await ClientAdvertisement.getById(adToReturn.id);
                await adInstance.clientReturnToPending();
                
                setSnackbar({ 
                    open: true, 
                    message: "تم إعادة الإعلان إلى حالة المراجعة بنجاح! سيتم إشعار الإدارة.", 
                    severity: "success" 
                });
            } catch (err) {
                console.error("Error returning advertisement to pending:", err);
                setSnackbar({ 
                    open: true, 
                    message: `فشل إعادة الإعلان: ${err.message || 'خطأ غير معروف'}`, 
                    severity: "error" 
                });
            } finally {
                setOpenReturnDialog(false);
                setAdToReturn(null);
            }
        }
    };

    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbar({ ...snackbar, open: false });
        setError(null);
    };

    // Edit advertisement handler
    const handleEditAd = (ad) => {
        console.log('[DEBUG] Edit advertisement clicked:', ad);
        console.log('[DEBUG] Advertisement ID:', ad.id);
        console.log('[DEBUG] Full advertisement object:', JSON.stringify(ad, null, 2));
        
        if (!ad.id) {
            setSnackbar({ 
                open: true, 
                message: 'خطأ: لا يمكن تعديل إعلان بدون معرف صالح', 
                severity: 'error' 
            });
            return;
        }

        const navigationState = { 
            adData: { ...ad, id: ad.id }, // Explicitly ensure ID is included
            editMode: true 
        };
        
        console.log('[DEBUG] Navigation state being passed:', JSON.stringify(navigationState, null, 2));
        console.log('[DEBUG] Advertisement ID in navigation state:', navigationState.adData.id);

        // Navigate to AddAdvertisement route with ad data
        navigate('/AddAdvertisement', { 
            state: navigationState
        });
    };

    // Delete advertisement handlers
    const handleDeleteAd = (ad) => {
        console.log('[DEBUG] Delete advertisement clicked:', ad);
        console.log('[DEBUG] Advertisement ID:', ad.id);
        
        if (!ad.id) {
            setSnackbar({ 
                open: true, 
                message: 'خطأ: لا يمكن حذف إعلان بدون معرف صالح', 
                severity: 'error' 
            });
            return;
        }

        setAdToDelete(ad);
        setOpenDeleteDialog(true);
    };

    const handleConfirmDelete = async () => {
        if (!adToDelete) return;

        setDeleteLoading(true);
        try {
            console.log('[DEBUG] Deleting advertisement with ID:', adToDelete.id);
            
            // Validate that we have a valid ID
            if (!adToDelete.id) {
                throw new Error('معرف الإعلان غير صالح');
            }
            
            // Get the advertisement instance and delete it
            const adInstance = await ClientAdvertisement.getById(adToDelete.id);
            if (!adInstance) {
                throw new Error('الإعلان غير موجود');
            }
            
            await adInstance.delete();
            
            setSnackbar({ 
                open: true, 
                message: 'تم حذف الإعلان بنجاح!', 
                severity: 'success' 
            });
        } catch (err) {
            console.error('[DEBUG] Error deleting advertisement:', err);
            setSnackbar({ 
                open: true, 
                message: `فشل حذف الإعلان: ${err.message || 'خطأ غير معروف'}`, 
                severity: 'error' 
            });
        } finally {
            setDeleteLoading(false);
            setOpenDeleteDialog(false);
            setAdToDelete(null);
        }
    };

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
            case 'approved': return 'تمت الموافقة';
            case 'rejected': return 'مرفوض';
            default: return status;
        }
    };

    const getAdStatusColor = (status) => {
        switch (status) {
            case 'تحت العرض': return 'primary';
            case 'تحت التفاوض': return 'info';
            case 'منتهي': return 'default';
            default: return 'default';
        }
    };

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
            field: 'statusChips',
            headerName: 'الحالة',
            width: 300,
            editable: false,
            renderCell: (params) => {
                const ad = params.row;
                return (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Chip
                            label={getStatusLabel(ad.reviewStatus)}
                            color={getStatusColor(ad.reviewStatus)}
                    size="small"
                />
                        <Chip
                            label={ad.status}
                            color={getAdStatusColor(ad.status)}
                            size="small"
                        />
                        <Chip
                            label={ad.ads ? 'مفعل' : 'غير مفعل'}
                            color={ad.ads ? 'success' : 'default'}
                            size="small"
                        />
                    </Box>
                );
            },
        },
        {
            field: 'actions',
            headerName: 'الإجراءات',
            width: 300,
            editable: false,
            renderCell: (params) => {
                const ad = params.row;
                return (
                    <Stack direction="row" spacing={1}>
                        {/* Edit button - always visible */}
                        <Button
                            variant="outlined"
                            size="small"
                            color="primary"
                            onClick={() => handleEditAd(ad)}
                            startIcon={<EditIcon />}
                        >
                            تعديل
                        </Button>
                        
                        {/* Delete button - always visible */}
                        <Button
                            variant="outlined"
                            size="small"
                            color="error"
                            onClick={() => handleDeleteAd(ad)}
                            startIcon={<DeleteIcon />}
                        >
                            حذف
                        </Button>
                        
                        {/* Return to pending button - only for rejected ads */}
                        {ad.reviewStatus === 'rejected' && (
                            <Button
                                variant="outlined"
                                size="small"
                                color="warning"
                                onClick={() => handleReturnToPending(ad)}
                                startIcon={<RefreshIcon />}
                            >
                                إعادة إرسال
                            </Button>
                        )}
                        
                        {/* Activation needed chip - only for approved but inactive ads */}
                        {ad.reviewStatus === 'approved' && !ad.ads && (
                            <Chip
                                label="تحتاج تفعيل"
                                color="warning"
                                size="small"
                            />
                        )}
                    </Stack>
                );
            },
        },
        { field: 'address', headerName: 'العنوان التفصيلي', width: 300, editable: false },
        { field: 'date_of_building', headerName: 'تاريخ الإنشاء', width: 150, editable: false },
    ];

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
                <CircularProgress />
            </Box>
        );
    }

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

            {/* Statistics */}
            <Box sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
                <Chip label={`الكل: ${filteredAdvertisements.length}`} color="primary" />
                <Chip label={`قيد المراجعة: ${filteredAdvertisements.filter(ad => ad.reviewStatus === 'pending').length}`} color="warning" />
                <Chip label={`تمت الموافقة: ${filteredAdvertisements.filter(ad => ad.reviewStatus === 'approved').length}`} color="success" />
                <Chip label={`مرفوض: ${filteredAdvertisements.filter(ad => ad.reviewStatus === 'rejected').length}`} color="error" />
                <Chip label={`مفعل: ${filteredAdvertisements.filter(ad => ad.ads === true).length}`} color="info" />
                <Chip label={`غير مفعل: ${filteredAdvertisements.filter(ad => ad.ads === false).length}`} color="default" />
            </Box>

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
                    قائمة إعلاناتى ({filteredAdvertisements.length})
                </Typography>

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
                            <MenuItem value="approved">تمت الموافقة</MenuItem>
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
                    
                    <FormControl size="small" sx={{ minWidth: 150 }}>
                        <InputLabel>نوع الإعلان</InputLabel>
                        <Select
                            value={adTypeFilter}
                            onChange={(e) => setAdTypeFilter(e.target.value)}
                            label="نوع الإعلان"
                        >
                            <MenuItem value="all">الكل</MenuItem>
                            <MenuItem value="بيع">بيع</MenuItem>
                            <MenuItem value="إيجار">إيجار</MenuItem>
                        </Select>
                    </FormControl>
                </Box>

                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

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
                        rows={filteredAdvertisements}
                        columns={columns}
                        pageSizeOptions={[5, 10, 20, 30, 50]}
                        initialState={{
                            pagination: {
                                paginationModel: { pageSize: 10, page: 0 },
                            },
                        }}
                        disableRowSelectionOnClick
                        getRowId={(row) => row.id || Math.random().toString()}
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

            {/* Return to Pending Dialog */}
            <Dialog open={openReturnDialog} onClose={() => setOpenReturnDialog(false)}>
                <DialogTitle>إعادة إرسال الإعلان</DialogTitle>
                <DialogContent>
                    <Typography>
                        هل أنت متأكد من إعادة إرسال الإعلان "{adToReturn?.title}" إلى الإدارة للمراجعة؟
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenReturnDialog(false)}>إلغاء</Button>
                    <Button onClick={handleConfirmReturn} color="warning" variant="contained">
                        إعادة إرسال
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
                <DialogTitle>حذف الإعلان</DialogTitle>
                <DialogContent>
                    <Typography>
                        هل أنت متأكد من حذف الإعلان "{adToDelete?.title}"؟ هذا الإجراء لا يمكن التراجع عنه.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDeleteDialog(false)} disabled={deleteLoading}>
                        إلغاء
                    </Button>
                    <Button 
                        onClick={handleConfirmDelete} 
                        color="error" 
                        variant="contained"
                        disabled={deleteLoading}
                    >
                        {deleteLoading ? 'جاري الحذف...' : 'حذف'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar for notifications */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
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
    const navigate = useNavigate();
    const authUid = useSelector((state) => state.auth.uid);
    
    // Local state for real-time data
    const [fundingRequests, setFundingRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // New state for modals and actions
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [requestToDelete, setRequestToDelete] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [requestToEdit, setRequestToEdit] = useState(null);
    const [adForEdit, setAdForEdit] = useState(null);
    const [actionLoading, setActionLoading] = useState({});
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    // Real-time listener for user's financial requests
    useEffect(() => {
        if (!authUid) return;

        setLoading(true);
        setError(null);

        // Subscribe to user's financial requests
        const unsubscribeRequests = FinancingRequest.subscribeByUser(authUid, (requestsData) => {
            setFundingRequests(requestsData);
            setLoading(false);
        });

        // Cleanup function to unsubscribe when component unmounts
        return () => {
            unsubscribeRequests();
        };
    }, [authUid]);

    // Helper functions for review status
    const getReviewStatusLabel = (status) => {
        switch (status) {
            case 'pending': return 'قيد المراجعة';
            case 'approved': return 'مقبول';
            case 'rejected': return 'مرفوض';
            default: return status;
        }
    };

    const getReviewStatusColor = (status) => {
        switch (status) {
            case 'pending': return 'warning';
            case 'approved': return 'success';
            case 'rejected': return 'error';
            default: return 'default';
        }
    };

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

    // Handle delete request
    const handleDeleteRequest = async (request) => {
        setRequestToDelete(request);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!requestToDelete) return;
        
        setActionLoading(prev => ({ ...prev, [requestToDelete.id]: true }));
        try {
            // Delete the request directly using the FinancingRequest model
            const requestInstance = await FinancingRequest.getById(requestToDelete.id);
            if (requestInstance) {
                await requestInstance.delete();
            setSnackbar({ open: true, message: 'تم حذف الطلب بنجاح', severity: 'success' });
            } else {
                throw new Error('الطلب غير موجود');
            }
        } catch (error) {
            setSnackbar({ open: true, message: error.message || 'فشل حذف الطلب', severity: 'error' });
        } finally {
            setActionLoading(prev => ({ ...prev, [requestToDelete.id]: false }));
            setIsDeleteModalOpen(false);
            setRequestToDelete(null);
        }
    };

    // Handle edit request (return to pending)
    const handleEditRequest = async (request) => {
        setActionLoading(prev => ({ ...prev, [request.id]: true }));
        try {
            // Get the advertisement data
            const ad = await FinancingAdvertisement.getById(request.advertisement_id);
            if (!ad) {
                throw new Error('الإعلان غير موجود');
            }
            
            // Navigate to the financing request form with the ad data and request data
            navigate('/financing-request', { 
                state: { 
                    advertisementId: request.advertisement_id,
                    editRequestId: request.id,
                    editRequestData: request,
                    advertisementData: ad
                } 
            });
        } catch (error) {
            setSnackbar({ open: true, message: error.message || 'فشل تحميل بيانات الإعلان', severity: 'error' });
        } finally {
            setActionLoading(prev => ({ ...prev, [request.id]: false }));
        }
    };

    // Handle submit edited request
    const handleSubmitEditedRequest = async (updatedData) => {
        if (!requestToEdit) return;
        
        setActionLoading(prev => ({ ...prev, [requestToEdit.id]: true }));
        try {
            // Update the request with new data and set status to pending
            const updates = {
                ...updatedData,
                reviewStatus: 'pending',
                review_note: null, // Clear any previous rejection notes
                submitted_at: new Date() // Update submission time
            };
            
            // Update the request directly using the FinancingRequest model
            const requestInstance = await FinancingRequest.getById(requestToEdit.id);
            if (requestInstance) {
                await requestInstance.update(updates);
            
            // Send notification to the organization
            const notif = new Notification({
                receiver_id: adForEdit.userId, // Organization owner
                title: 'طلب تمويل معدل بانتظار المراجعة',
                body: `تم تعديل طلب التمويل على إعلانك: ${adForEdit.title}`,
                type: 'system',
                link: `/admin/financing-requests/${requestToEdit.id}`,
            });
            await notif.send();
            
            setSnackbar({ open: true, message: 'تم إرسال الطلب المعدل للمراجعة', severity: 'success' });
            setIsEditModalOpen(false);
            setRequestToEdit(null);
            setAdForEdit(null);
            } else {
                throw new Error('الطلب غير موجود');
            }
        } catch (error) {
            setSnackbar({ open: true, message: error.message || 'فشل إرسال الطلب المعدل', severity: 'error' });
        } finally {
            setActionLoading(prev => ({ ...prev, [requestToEdit.id]: false }));
        }
    };

    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') return;
        setSnackbar(prev => ({ ...prev, open: false }));
    };

    return (
        <Box sx={{ p: 2, textAlign: 'right' }}>
            <Typography variant="h4" sx={{ display: 'flex', flexDirection: 'row-reverse' }} gutterBottom>
                طلبات التمويل
            </Typography>

            {/* Main Content Area */}
            <Paper sx={{ p: 2, borderRadius: 2, minHeight: 400, textAlign: 'right', direction: 'rtl' }}>
                {loading && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 4 }}>
                        <CircularProgress />
                        <Typography sx={{ ml: 2 }}>جاري تحميل طلبات التمويل...</Typography>
                    </Box>
                )}
                {error && (
                    <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>
                )}
                {!loading && (!fundingRequests || fundingRequests.length === 0) ? (
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
                                                        مبلغ التمويل: {request.financing_amount} ج.م
                                                    </Typography>
                                                </Grid>
                                                <Grid item>
                                                    <Chip
                                                        label={getReviewStatusLabel(request.reviewStatus)}
                                                        size="small"
                                                        color={getReviewStatusColor(request.reviewStatus)}
                                                        sx={{ mr: 1 }}
                                                    />
                                                </Grid>
                                                {request.status && (
                                                <Grid item>
                                                    <Chip
                                                        label={request.status}
                                                        size="small"
                                                        color={getStatusColor(request.status)}
                                                        sx={{ mr: 1 }}
                                                    />
                                                </Grid>
                                                )}
                                            </Grid>
                                        }
                                        secondary={
                                            <Stack direction="column" spacing={0.5} sx={{ mt: 0.5 }}>
                                                <Typography variant="body2" color="text.primary">
                                                    معرّف الإعلان: {request.advertisement_id}
                                                </Typography>
                                                <Typography variant="body2" color="text.primary">
                                                    الدخل الشهري: {request.monthly_income}
                                                </Typography>
                                                <Typography variant="body2" color="text.primary">
                                                    الوظيفة: {request.job_title}
                                                </Typography>
                                                <Typography variant="body2" color="text.primary">
                                                    السن: {request.age}
                                                </Typography>
                                                <Typography variant="body2" color="text.primary">
                                                    جهة العمل: {request.employer}
                                                </Typography>
                                                <Typography variant="body2" color="text.primary">
                                                    الحالة الاجتماعية: {request.marital_status}
                                                </Typography>
                                                <Typography variant="body2" color="text.primary">
                                                    عدد المعالين: {request.dependents}
                                                </Typography>
                                                <Typography variant="body2" color="text.primary">
                                                    مدة السداد: {request.repayment_years} سنة
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    تاريخ التقديم: {request.submitted_at && request.submitted_at.toDate ? request.submitted_at.toDate().toLocaleDateString('ar-EG') : ''}
                                                </Typography>
                                                {request.review_note && (
                                                    <Typography variant="caption" color="error">
                                                        ملاحظة الرفض: {request.review_note}
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
                                    {/* Action buttons */}
                                    <Stack direction="row" spacing={1} sx={{ mr: 2 }}>
                                        {/* Edit button for rejected requests */}
                                        {request.reviewStatus === 'rejected' && (
                                            <Button
                                                variant="outlined"
                                                color="primary"
                                                size="small"
                                                disabled={actionLoading[request.id]}
                                                onClick={() => handleEditRequest(request)}
                                                startIcon={<EditIcon />}
                                            >
                                                تعديل وإعادة إرسال
                                            </Button>
                                        )}
                                        {/* Delete button */}
                                        <Button
                                            variant="outlined"
                                            color="error"
                                            size="small"
                                            disabled={actionLoading[request.id]}
                                            onClick={() => handleDeleteRequest(request)}
                                            startIcon={<DeleteIcon />}
                                        >
                                            حذف
                                        </Button>
                                    </Stack>
                                </ListItem>
                                {index < fundingRequests.length - 1 && <Divider component="li" sx={{ my: 1 }} />}
                            </React.Fragment>
                        ))}
                    </List>
                )}
            </Paper>

            {/* Delete Confirmation Modal */}
            <Dialog
                open={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
            >
                <DialogTitle>تأكيد الحذف</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        هل أنت متأكد من حذف طلب التمويل هذا؟ لا يمكن التراجع عن هذا الإجراء.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setIsDeleteModalOpen(false)}>إلغاء</Button>
                    <Button onClick={handleConfirmDelete} color="error" variant="contained">
                        حذف
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Edit Request Modal */}
            {isEditModalOpen && requestToEdit && adForEdit && (
                <EditFinancialRequestModal
                    open={isEditModalOpen}
                    onClose={() => {
                        setIsEditModalOpen(false);
                        setRequestToEdit(null);
                        setAdForEdit(null);
                    }}
                    onSubmit={handleSubmitEditedRequest}
                    request={requestToEdit}
                    advertisement={adForEdit}
                    loading={actionLoading[requestToEdit.id]}
                />
            )}

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

// Edit Financial Request Modal Component
function EditFinancialRequestModal({ open, onClose, onSubmit, request, advertisement, loading }) {
    const [formData, setFormData] = useState({
        monthly_income: request?.monthly_income || '',
        job_title: request?.job_title || '',
        employer: request?.employer || '',
        age: request?.age || '',
        marital_status: request?.marital_status || '',
        dependents: request?.dependents || '',
        financing_amount: request?.financing_amount || '',
        repayment_years: request?.repayment_years || '',
        phone_number: request?.phone_number || ''
    });

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = () => {
        onSubmit(formData);
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>تعديل طلب التمويل</DialogTitle>
            <DialogContent>
                <Box sx={{ mt: 2 }}>
                    {/* Advertisement Info */}
                    <Typography variant="h6" gutterBottom>معلومات الإعلان</Typography>
                    <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1, mb: 3 }}>
                        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>{advertisement.title}</Typography>
                        <Typography variant="body2" color="text.secondary">
                            الحد الأدنى: {advertisement.start_limit} | الحد الأقصى: {advertisement.end_limit}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            نسبة الفائدة: حتى 5 سنوات {advertisement.interest_rate_upto_5}% | 
                            حتى 10 سنوات {advertisement.interest_rate_upto_10}% | 
                            أكثر من 10 سنوات {advertisement.interest_rate_above_10}%
                        </Typography>
                    </Box>

                    {/* Form Fields */}
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="الدخل الشهري"
                                value={formData.monthly_income}
                                onChange={(e) => handleChange('monthly_income', e.target.value)}
                                type="number"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="المسمى الوظيفي"
                                value={formData.job_title}
                                onChange={(e) => handleChange('job_title', e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="جهة العمل"
                                value={formData.employer}
                                onChange={(e) => handleChange('employer', e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="السن"
                                value={formData.age}
                                onChange={(e) => handleChange('age', e.target.value)}
                                type="number"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
                                <InputLabel>الحالة الاجتماعية</InputLabel>
                                <Select
                                    value={formData.marital_status}
                                    label="الحالة الاجتماعية"
                                    onChange={(e) => handleChange('marital_status', e.target.value)}
                                >
                                    <MenuItem value="أعزب">أعزب</MenuItem>
                                    <MenuItem value="متزوج">متزوج</MenuItem>
                                    <MenuItem value="مطلق">مطلق</MenuItem>
                                    <MenuItem value="أرمل">أرمل</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="عدد المعالين"
                                value={formData.dependents}
                                onChange={(e) => handleChange('dependents', e.target.value)}
                                type="number"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="مبلغ التمويل"
                                value={formData.financing_amount}
                                onChange={(e) => handleChange('financing_amount', e.target.value)}
                                type="number"
                                helperText={`يجب أن يكون بين ${advertisement.start_limit} و ${advertisement.end_limit}`}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="مدة السداد (بالسنوات)"
                                value={formData.repayment_years}
                                onChange={(e) => handleChange('repayment_years', e.target.value)}
                                type="number"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="رقم الهاتف"
                                value={formData.phone_number}
                                onChange={(e) => handleChange('phone_number', e.target.value)}
                            />
                        </Grid>
                    </Grid>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>إلغاء</Button>
                <Button 
                    onClick={handleSubmit} 
                    variant="contained" 
                    disabled={loading}
                >
                    {loading ? 'جاري الإرسال...' : 'إرسال الطلب المعدل'}
                </Button>
            </DialogActions>
        </Dialog>
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
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const authUid = useSelector((state) => state.auth.uid);
    const userProfile = useSelector((state) => state.user.profile);
    
    // State for account deletion
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    const handleDeleteAccount = () => {
        setDeleteDialogOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!authUid) {
            setSnackbarMessage('خطأ: لم يتم العثور على معرف المستخدم');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
            return;
        }

        setDeleteLoading(true);
        try {
            const result = await deleteUserAccount(authUid);
            
            if (result.success) {
                setSnackbarMessage('تم حذف الحساب بنجاح');
                setSnackbarSeverity('success');
                setSnackbarOpen(true);
                
                // Redirect to login page after a short delay
                setTimeout(() => {
                    navigate('/login');
                }, 2000);
            } else {
                setSnackbarMessage(result.error || 'حدث خطأ أثناء حذف الحساب');
                setSnackbarSeverity('error');
                setSnackbarOpen(true);
            }
        } catch (error) {
            console.error('Error deleting account:', error);
            setSnackbarMessage('حدث خطأ غير متوقع أثناء حذف الحساب');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        } finally {
            setDeleteLoading(false);
            setDeleteDialogOpen(false);
        }
    };

    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbarOpen(false);
    };

    return (
        <Box dir='rtl' sx={{ p: 2 }}>
            <Typography variant="h4" gutterBottom>إعدادات الحساب</Typography>
            
            <Paper dir='rtl' sx={{ p: 2, borderRadius: 2, minHeight: 200, textAlign: 'left' }}>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                    إدارة الحساب
                </Typography>
                
                <Box sx={{ mt: 3 }}>
                    <Typography variant="body1" color="text.secondary" gutterBottom>
                        معلومات الحساب الحالي:
                    </Typography>
                    <Box sx={{ p: 2, bgcolor: 'background.default', border: 1, borderColor: 'divider', borderRadius: 1, mb: 3 }}>
                        <Typography variant="body2">
                            <strong>الاسم:</strong> {userProfile?.cli_name || userProfile?.org_name || userProfile?.adm_name || 'غير محدد'}
                        </Typography>
                        <Typography variant="body2">
                            <strong>البريد الإلكتروني:</strong> {auth.currentUser?.email || 'غير محدد'}
                        </Typography>
                        <Typography variant="body2">
                            <strong>نوع المستخدم:</strong> {userProfile?.type_of_user || 'غير محدد'}
                    </Typography>
                    </Box>
                </Box>

                <Box sx={{ mt: 4 }}>
                    <Typography variant="h6" color="error" gutterBottom>
                        منطقة الخطر
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        حذف الحساب إجراء نهائي لا يمكن التراجع عنه. سيتم حذف جميع بياناتك نهائياً.
                    </Typography>
                    
                    <Button
                        variant="outlined"
                        color="error"
                        onClick={handleDeleteAccount}
                        startIcon={<DeleteIcon />}
                        sx={{ mt: 1 }}
                    >
                        حذف الحساب نهائياً
                    </Button>
                </Box>
            </Paper>

            {/* Delete Account Confirmation Dialog */}
            <Dialog
                open={deleteDialogOpen}
                onClose={() => !deleteLoading && setDeleteDialogOpen(false)}
                aria-labelledby="delete-account-dialog-title"
                aria-describedby="delete-account-dialog-description"
                dir="rtl"
            >
                <DialogTitle id="delete-account-dialog-title">
                    تأكيد حذف الحساب
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="delete-account-dialog-description" sx={{ mb: 2 }}>
                        هل أنت متأكد أنك تريد حذف حسابك نهائياً؟
                    </DialogContentText>
                    <Alert severity="warning" sx={{ mb: 2 }}>
                        <Typography variant="body2">
                            <strong>تحذير:</strong> هذا الإجراء لا يمكن التراجع عنه. سيتم حذف:
                        </Typography>
                        <ul style={{ margin: '8px 0', paddingRight: '20px' }}>
                            <li>جميع بياناتك الشخصية</li>
                            <li>جميع إعلاناتك</li>
                            <li>جميع طلبات التمويل</li>
                            <li>جميع المفضلة</li>
                            <li>جميع الإشعارات</li>
                        </ul>
                    </Alert>
                    <Typography variant="body2" color="text.secondary">
                        اكتب "حذف" في الحقل أدناه لتأكيد رغبتك في حذف الحساب:
                    </Typography>
                    <TextField
                        fullWidth
                        label="اكتب 'حذف' للتأكيد"
                        variant="outlined"
                        size="small"
                        sx={{ mt: 1 }}
                        id="delete-confirmation"
                    />
                </DialogContent>
                <DialogActions>
                    <Button 
                        onClick={() => setDeleteDialogOpen(false)} 
                        color="primary" 
                        disabled={deleteLoading}
                    >
                        إلغاء
                    </Button>
                    <Button 
                        onClick={handleConfirmDelete} 
                        color="error" 
                        disabled={deleteLoading}
                        autoFocus
                    >
                        {deleteLoading ? <CircularProgress size={20} /> : 'حذف الحساب نهائياً'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar for notifications */}
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
    const { window: windowProp } = props;
    const dispatch = useDispatch();
    const navigate = useNavigate();
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
    // // Auto-close Drawer at <=600px
    // React.useEffect(() => {
    //     if (typeof window === 'undefined') return;
    //     function handleResize() {
    //         if (window.innerWidth <= 600) {
    //             setOpen(false);
    //         }
    //     }
    //     window.addEventListener('resize', handleResize);
    //     // Run once on mount to handle initial load
    //     handleResize();
    //     return () => window.removeEventListener('resize', handleResize);
    // }, []);

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
    const userProfileStatus = useSelector((state) => state.user.status);
    
    // Notification state
    const [notificationAnchorEl, setNotificationAnchorEl] = React.useState(null);
    const [unreadCount, setUnreadCount] = React.useState(0);
    const [snackbarOpen, setSnackbarOpen] = React.useState(false);
    const [snackbarMessage, setSnackbarMessage] = React.useState('');
    const [snackbarSeverity, setSnackbarSeverity] = React.useState('success');
    const authUid = useSelector((state) => state.auth.uid);
    
    // Get user name with loading state
    const getUserName = () => {
        if (userProfileStatus === 'loading') {
            return 'جاري التحميل...';
        }
        if (userProfile) {
            return userProfile.adm_name || userProfile.cli_name || userProfile.org_name || 'Client';
        }
        return 'Client';
    };
    
    const userName = getUserName();
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

    // Notification handlers - memoized to prevent unnecessary re-renders
    const handleNotificationClick = React.useCallback((event) => {
        event.preventDefault();
        event.stopPropagation();
        setNotificationAnchorEl(event.currentTarget);
    }, []);

    const handleNotificationClose = React.useCallback(() => {
        setNotificationAnchorEl(null);
    }, []);

    // Effect to fetch user profile when dashboard mounts (only if not already loaded)
    useEffect(() => {
        if (authUid && userProfileStatus === "idle" && !userProfile) {
            console.log("ClientDashboard: Fetching user profile for drawer display, UID:", authUid);
            dispatch(fetchUserProfile(authUid));
        }
    }, [authUid, userProfileStatus, userProfile, dispatch]);

    // Real-time notification subscription
    React.useEffect(() => {
        if (authUid) {
            const unsubscribe = Notification.subscribeUnreadCount(authUid, (count) => {
            setUnreadCount(count);
        });
            return () => unsubscribe();
        }
    }, [authUid]);


    const handleReportsClick = () => {
        setOpenReports(!openReports);
    };

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
                                        width: isMobile ? '80%' : (open ? drawerWidth : closedDrawerWidth),
                                        boxSizing: 'border-box',
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
                                            alt="User"
                                            src={userProfile?.image || './admin.jpg'}
                                            sx={{ width: 80, height: 80, mb: 1, boxShadow: '0px 0px 8px rgba(0,0,0,0.2)' , border: '3px solid', borderColor: 'primary.main' }}
                                        />
                                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                            {userProfileStatus === 'loading' ? (
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <CircularProgress size={16} />
                                                    جاري التحميل...
                                                </Box>
                                            ) : (
                                                `مرحباً، ${userName}`
                                            )}
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
                        
                        {/* Success/Error Snackbar */}
                        <Snackbar
                            open={snackbarOpen}
                            autoHideDuration={6000}
                            onClose={() => setSnackbarOpen(false)}
                            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                        >
                            <Alert 
                                onClose={() => setSnackbarOpen(false)} 
                                severity={snackbarSeverity}
                                sx={{ width: '100%' }}
                            >
                                {snackbarMessage}
                            </Alert>
                        </Snackbar>
                    </ThemeProvider>
            </CacheProvider>
        </StyledEngineProvider>
    );
}