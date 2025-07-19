import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
import {
    Typography, Box, Paper, CssBaseline, AppBar, Toolbar, IconButton, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider, Avatar, Button, Collapse, Grid, Dialog, DialogTitle, DialogContent, DialogActions, TextField,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import DashboardIcon from '@mui/icons-material/Dashboard';
import GroupIcon from '@mui/icons-material/Group';
import HomeIcon from '@mui/icons-material/Home';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import BarChartIcon from '@mui/icons-material/BarChart';
import DescriptionIcon from '@mui/icons-material/Description';
import LayersIcon from '@mui/icons-material/Layers';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import LogoutIcon from '@mui/icons-material/Logout';
import { addUser, editUser, deleteUser } from '../reduxToolkit/slice/usersSlice';
import { addOrganization, editOrganization, deleteOrganization } from '../reduxToolkit/slice/organizationsSlice';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import rtlPlugin from 'stylis-plugin-rtl';
import { StyledEngineProvider } from '@mui/material/styles';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { FormControlLabel, Radio, RadioGroup } from '@mui/material';
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
        title: 'Main items',
    },
    {
        segment: 'dashboard',
        title: 'Dashboard',
        icon: <DashboardIcon />,
    },
    {
        segment: 'users',
        title: 'Users',
        icon: <GroupIcon />,
    },
    {
        segment: 'properties',
        title: 'Properties',
        icon: <HomeIcon />,
    },
    {
        segment: 'orders',
        title: 'Orders',
        icon: <ShoppingCartIcon />,
    },
    {
        kind: 'divider',
    },
    {
        kind: 'header',
        title: 'Analytics',
    },
    {
        segment: 'reports',
        title: 'Reports',
        icon: <BarChartIcon />,
        children: [
            {
                segment: 'sales',
                title: 'Sales',
                icon: <DescriptionIcon />,
            },
            {
                segment: 'traffic',
                title: 'Traffic',
                icon: <DescriptionIcon />,
            },
        ],
    },
    {
        segment: 'integrations',
        title: 'Integrations',
        icon: <LayersIcon />,
    },
];

const ColorModeContext = React.createContext({ toggleColorMode: () => {} });

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
            setEmailHelperText('Email is required');
            hasError = true;
        } else if (!emailRegex.test(email)) {
            setEmailError(true);
            setEmailHelperText('Invalid email format');
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
            <DialogTitle sx={{ textAlign: 'right' }}>Add New User</DialogTitle>
            <DialogContent sx={{ textAlign: 'right' }}>
                <TextField
                    autoFocus
                    margin="dense"
                    label="Name"
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
                    label="Email"
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
                    Add
                </Button>
                <Button onClick={onClose}>Cancel</Button>
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
            setEmailHelperText('Email is required');
            hasError = true;
        } else if (!emailRegex.test(email)) {
            setEmailError(true);
            setEmailHelperText('Invalid email format');
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
            <DialogTitle sx={{ textAlign: 'right' }}>Edit User</DialogTitle>
            <DialogContent sx={{ textAlign: 'right' }}>
                <TextField
                    autoFocus
                    margin="dense"
                    label="Name"
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
                    label="Email"
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
                    Save
                </Button>
                <Button onClick={onClose}>Cancel</Button>
            </DialogActions>
        </Dialog>
    );
}



function ConfirmDeleteModal({ open, onClose, onConfirm, itemType, itemId, itemName }) {
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle sx={{ textAlign: 'right' }}>Confirm Deletion</DialogTitle>
            <DialogContent sx={{ textAlign: 'right' }}>
                <Typography>
                    Are you sure you want to delete this {itemType}: <strong>{itemName} (ID: {itemId})</strong>?
                </Typography>
                <Typography color="error">This action cannot be undone.</Typography>
            </DialogContent>
            <DialogActions sx={{ flexDirection: 'row-reverse' }}>
                <Button onClick={onConfirm} variant="contained" color="error">
                    Delete
                </Button>
                <Button onClick={onClose}>Cancel</Button>
            </DialogActions>
        </Dialog>
    );
}

function AddOrgModal({ open, onClose, onAdd }) {
    const [name, setName] = React.useState('');
    const [contact, setContact] = React.useState('');
    const [nameError, setNameError] = React.useState(false);
    const [contactError, setContactError] = React.useState(false);

    React.useEffect(() => {
        if (open) {
            setName('');
            setContact('');
            setNameError(false);
            setContactError(false);
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

        if (!contact.trim()) {
            setContactError(true);
            hasError = true;
        } else {
            setContactError(false);
        }

        if (!hasError) {
            onAdd({ name, contact });
            setName('');
            setContact('');
            onClose();
        }
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle sx={{ textAlign: 'right' }}>Add New Organization</DialogTitle>
            <DialogContent sx={{ textAlign: 'right' }}>
                <TextField
                    autoFocus
                    margin="dense"
                    label="Organization Name"
                    type="text"
                    fullWidth
                    variant="outlined"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    error={nameError}
                    helperText={nameError ? 'Organization Name is required' : ''}
                    sx={{ mb: 2 }}
                />
                <TextField
                    margin="dense"
                    label="Contact Info"
                    type="text"
                    fullWidth
                    variant="outlined"
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    error={contactError}
                    helperText={contactError ? 'Contact Info is required' : ''}
                />
            </DialogContent>
            <DialogActions sx={{ flexDirection: 'row-reverse' }}>
                <Button onClick={handleAdd} variant="contained" sx={{ bgcolor: 'purple' }}>
                    Add
                </Button>
                <Button onClick={onClose}>Cancel</Button>
            </DialogActions>
        </Dialog>
    );
}

function EditOrgModal({ open, onClose, onSave, organization }) {
    const [name, setName] = React.useState(organization ? organization.name : '');
    const [contact, setContact] = React.useState(organization ? organization.contact : '');
    const [nameError, setNameError] = React.useState(false);
    const [contactError, setContactError] = React.useState(false);

    React.useEffect(() => {
        if (organization) {
            setName(organization.name);
            setContact(organization.contact);
            setNameError(false);
            setContactError(false);
        }
    }, [organization, open]);

    const handleSave = () => {
        let hasError = false;
        if (!name.trim()) {
            setNameError(true);
            hasError = true;
        } else {
            setNameError(false);
        }

        if (!contact.trim()) {
            setContactError(true);
            hasError = true;
        } else {
            setContactError(false);
        }

        if (!hasError) {
            onSave({ ...organization, name, contact });
            onClose();
        }
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle sx={{ textAlign: 'right' }}>Edit Organization</DialogTitle>
            <DialogContent sx={{ textAlign: 'right' }}>
                <TextField
                    autoFocus
                    margin="dense"
                    label="Organization Name"
                    type="text"
                    fullWidth
                    variant="outlined"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    error={nameError}
                    helperText={nameError ? 'Organization Name is required' : ''}
                    sx={{ mb: 2 }}
                />
                <TextField
                    margin="dense"
                    label="Contact Info"
                    type="text"
                    fullWidth
                    variant="outlined"
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    error={contactError}
                    helperText={contactError ? 'Contact Info is required' : ''}
                />
            </DialogContent>
            <DialogActions sx={{ flexDirection: 'row-reverse' }}>
                <Button onClick={handleSave} variant="contained" sx={{ bgcolor: 'purple' }}>
                    Save
                </Button>
                <Button onClick={onClose}>Cancel</Button>
            </DialogActions>
        </Dialog>
    );
}

function AddAdminModal({ open, onClose, onAdd }) {
    const [name, setName] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [role, setRole] = React.useState('admin'); // Default role for admin modal

    const handleSubmit = () => {
        if (name && email && password) {
            onAdd({ name, email, password, role });
            setName('');
            setEmail('');
            setPassword('');
            onClose();
        }
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Add New Admin</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    label="Admin Name"
                    type="text"
                    fullWidth
                    variant="outlined"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    sx={{ mb: 2 }}
                />
                <TextField
                    margin="dense"
                    label="Email"
                    type="email"
                    fullWidth
                    variant="outlined"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    sx={{ mb: 2 }}
                />
                <TextField
                    margin="dense"
                    label="Password"
                    type="password"
                    fullWidth
                    variant="outlined"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    sx={{ mb: 2 }}
                />
                <Typography variant="subtitle1" sx={{ mt: 1 }}>Role:</Typography>
                <RadioGroup row value={role} onChange={(e) => setRole(e.target.value)}>
                    <FormControlLabel value="admin" control={<Radio />} label="Admin" />
                    <FormControlLabel value="super_admin" control={<Radio />} label="Super Admin" />
                </RadioGroup>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={handleSubmit} variant="contained">Add</Button>
            </DialogActions>
        </Dialog>
    );
}

function EditAdminModal({ open, onClose, onSave, admin }) {
    const [name, setName] = React.useState(admin?.name || '');
    const [email, setEmail] = React.useState(admin?.email || '');
    const [role, setRole] = React.useState(admin?.role || 'admin');

    React.useEffect(() => {
        if (admin) {
            setName(admin.name);
            setEmail(admin.email);
            setRole(admin.role);
        }
    }, [admin]);

    const handleSubmit = () => {
        if (name && email && admin) {
            onSave({ ...admin, name, email, role });
            onClose();
        }
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Edit Admin</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    label="Admin Name"
                    type="text"
                    fullWidth
                    variant="outlined"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    sx={{ mb: 2 }}
                />
                <TextField
                    margin="dense"
                    label="Email"
                    type="email"
                    fullWidth
                    variant="outlined"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    sx={{ mb: 2 }}
                />
                <Typography variant="subtitle1" sx={{ mt: 1 }}>Role:</Typography>
                <RadioGroup row value={role} onChange={(e) => setRole(e.target.value)}>
                    <FormControlLabel value="admin" control={<Radio />} label="Admin" />
                    <FormControlLabel value="super_admin" control={<Radio />} label="Super Admin" />
                </RadioGroup>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={handleSubmit} variant="contained">Save</Button>
            </DialogActions>
        </Dialog>
    );
}


function DashboardPage() {
    return (
        <Box sx={{ p: 2, textAlign: 'right' }}>
            <Typography variant="h4" display={'flex'} flexDirection={'row-reverse'} gutterBottom>Dashboard Overview</Typography>
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

function UsersPage() {
    const dispatch = useDispatch();
    const users = useSelector((state) => state.users.users);
    const organizations = useSelector((state) => state.organizations.organizations);
    const admins = useSelector((state) => state.admins.admins);

    const [activeTab, setActiveTab] = React.useState('users');

    // State for Modals
    const [isAddUserModalOpen, setIsAddUserModalOpen] = React.useState(false);
    const [isEditUserModalOpen, setIsEditUserModalOpen] = React.useState(false);
    const [userToEdit, setUserToEdit] = React.useState(null);

    const [isAddOrgModalOpen, setIsAddOrgModalOpen] = React.useState(false);
    const [isEditOrgModalOpen, setIsEditOrgModalOpen] = React.useState(false);
    const [orgToEdit, setOrgToEdit] = React.useState(null);

    const [isAddAdminModalOpen, setIsAddAdminModalOpen] = React.useState(false);
    const [isEditAdminModalOpen, setIsEditAdminModalOpen] = React.useState(false);
    const [adminToEdit, setAdminToEdit] = React.useState(null);

    const [isDeleteConfirmModalOpen, setIsDeleteConfirmModalOpen] = React.useState(false);
    const [itemToDelete, setItemToDelete] = React.useState(null); // { id, type, name }

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    // User Handlers
    const handleAddUser = () => setIsAddUserModalOpen(true);
    const handleAddUserConfirm = (newUser) => {
        const newId = `usr-${Date.now()}`; // Generate a unique ID
        dispatch(addUser({ id: newId, ...newUser }));
    };
    const handleEditUser = (user) => {
        setUserToEdit(user);
        setIsEditUserModalOpen(true);
    };
    const handleEditUserSave = (updatedUser) => {
        dispatch(editUser(updatedUser));
        setUserToEdit(null);
    };

    // Organization Handlers
    const handleAddOrg = () => setIsAddOrgModalOpen(true);
    const handleAddOrgConfirm = (newOrg) => {
        const newId = `org-${Date.now()}`; // Generate a unique ID
        dispatch(addOrganization({ id: newId, ...newOrg }));
    };
    const handleEditOrg = (org) => {
        setOrgToEdit(org);
        setIsEditOrgModalOpen(true);
    };
    const handleEditOrgSave = (updatedOrg) => {
        dispatch(editOrganization(updatedOrg));
        setOrgToEdit(null);
    };

    // Admin Handlers
    const handleAddAdmin = () => setIsAddAdminModalOpen(true);
    const handleAddAdminConfirm = (newAdmin) => {
        const newId = `admin-${Date.now()}`; // Generate a unique ID
        dispatch(addAdmin({ id: newId, ...newAdmin }));
    };
    const handleEditAdmin = (admin) => {
        setAdminToEdit(admin);
        setIsEditAdminModalOpen(true);
    };
    const handleEditAdminSave = (updatedAdmin) => {
        dispatch(editAdmin(updatedAdmin));
        setAdminToEdit(null);
    };

    // Generic Delete Handler
    const handleDeleteItem = (id, type, name) => {
        setItemToDelete({ id, type, name });
        setIsDeleteConfirmModalOpen(true);
    };

    const handleDeleteConfirm = (id, type) => {
        if (type === 'user') {
            dispatch(deleteUser(id));
        } else if (type === 'organization') {
            dispatch(deleteOrganization(id));
        } else if (type === 'admin') {
            dispatch(deleteAdmin(id));
        }
        setItemToDelete(null);
    };

    return (
        <Box sx={{ p: 2, textAlign: 'right' }}>
            <Typography variant="h4" gutterBottom>User & Organization Management</Typography>
            <Paper sx={{ p: 2, borderRadius: 2, minHeight: 400, textAlign: 'right' }}>
                <Tabs value={activeTab} onChange={handleTabChange} aria-label="user management tabs" centered>
                    <Tab label="Users" value="users" />
                    <Tab label="Organizations" value="organizations" />
                    <Tab label="Admins" value="admins" />
                </Tabs>
                <Divider sx={{ mb: 2 }} />

                {/* Users Tab Content */}
                {activeTab === 'users' && (
                    <>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexDirection: 'row-reverse' }}>
                            <Typography variant="h6" color="text.secondary">List of Users</Typography>
                            <Button variant="outlined" startIcon={<AddIcon />} onClick={handleAddUser}>
                                Add User
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
                                        secondary={`ID: ${user.id} | Email: ${user.email} | Role: ${user.role || 'user'}`}
                                    />
                                </ListItem>
                            ))}
                        </List>
                    </>
                )}

                {/* Organizations Tab Content */}
                {activeTab === 'organizations' && (
                    <>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexDirection: 'row-reverse' }}>
                            <Typography variant="h6" color="text.secondary">List of Organizations</Typography>
                            <Button variant="outlined" startIcon={<AddIcon />} onClick={handleAddOrg}>
                                Add Org
                            </Button>
                        </Box>
                        <List>
                            {organizations.map((org) => (
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

                {/* Admins Tab Content */}
                {activeTab === 'admins' && (
                    <>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexDirection: 'row-reverse' }}>
                            <Typography variant="h6" color="text.secondary">List of Administrators</Typography>
                            <Button variant="outlined" startIcon={<AddIcon />} onClick={handleAddAdmin}>
                                Add Admin
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
                                        secondary={`ID: ${admin.id} | Email: ${admin.email} | Role: ${admin.role}`}
                                    />
                                </ListItem>
                            ))}
                        </List>
                    </>
                )}
            </Paper>

            {/* User Modals */}
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
            {/* Organization Modals */}
            <AddOrgModal
                open={isAddOrgModalOpen}
                onClose={() => setIsAddOrgModalOpen(false)}
                onAdd={handleAddOrgConfirm}
            />
            {orgToEdit && (
                <EditOrgModal
                    open={isEditOrgModalOpen}
                    onClose={() => setIsEditOrgModalOpen(false)}
                    onSave={handleEditOrgSave}
                    organization={orgToEdit}
                />
            )}
            {/* Admin Modals */}
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
            {/* Delete Confirmation Modal (Reused) */}
            <ConfirmDeleteModal
                open={isDeleteConfirmModalOpen}
                onClose={() => setIsDeleteConfirmModalOpen(false)}
                onConfirm={handleDeleteConfirm}
                itemType={itemToDelete?.type}
                itemId={itemToDelete?.id}
                itemName={itemToDelete?.name}
            />
        </Box>
    );
}

function PropertiesPage() {
    return (
        <Box sx={{ p: 2, textAlign: 'right' }}>
            <Typography variant="h4" gutterBottom>Properties List</Typography>
            <Paper sx={{ p: 2, borderRadius: 2, minHeight: 400, textAlign: 'right' }}>
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

function OrdersPage() {
    return (
        <Box sx={{ p: 2, textAlign: 'right' }}>
            <Typography variant="h4" gutterBottom>Orders List</Typography>
            <Paper sx={{ p: 2, borderRadius: 2, minHeight: 400, textAlign: 'right' }}>
                <Typography variant="h6" color="text.secondary">Table of recent orders (placeholder)</Typography>
                <Box sx={{ mt: 2, p: 2, border: '1px dashed #ccc', borderRadius: 1, textAlign: 'right' }}>
                    <Typography variant="body1" color="text.secondary">
                        Here you would integrate a data grid component (like `@mui/x-data-grid`) to display a list of orders,
                        with features like sorting, filtering, and pagination.
                    </Typography>
                    <ul style={{ listStyle: 'none', padding: 0, textAlign: 'right' }}>
                        <li>Order #12345: John Doe - $150.00 - Pending</li>
                        <li>Order #12346: Jane Smith - $220.50 - Shipped</li>
                        <li>Order #12347: Peter Jones - $75.25 - Delivered</li>
                    </ul>
                </Box>
            </Paper>
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

export default function AdminDashboard(props) {
    const { window } = props;
    const [open, setOpen] = React.useState(true);
    const [openReports, setOpenReports] = React.useState(false);
    const [mode, setMode] = React.useState('light');

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

    const handleLogout = () => {
        console.log('Logging out...');
        alert('You have been logged out!');
    };

    const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
        ({ theme, open }) => ({
            flexGrow: 1,
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
        case '/users':
            currentPageContent = <UsersPage />;
            break;
        case '/properties':
            currentPageContent = <PropertiesPage />;
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
                    <Typography variant="h5" color="error">Page Not Found</Typography>
                    <Typography variant="body1">The requested page "{router.pathname}" does not exist.</Typography>
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
                                            style={{ height: 60, marginRight:8, scale: 3 }}
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
                                        sx={{ mr: 2, borderRadius: 2, direction:'' }}
                                    >
                                        Logout
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
                                            src="./admin.jpg"
                                            sx={{ width: 80, height: 80, mb: 1, boxShadow: '0px 0px 8px rgba(0,0,0,0.2)' }}
                                        />
                                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                            Hello, Admin!
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Welcome back
                                        </Typography>
                                    </Box>
                                )}
                                {open && <Divider sx={{ mb: 2 }} />}
                                <List>
                                    {NAVIGATION.map((item) => {
                                        if (item.kind === 'header') {
                                            return open ? (
                                                <List key={item.title} component="nav" sx={{ px: 2, pt: 2 }}>
                                                    <Typography variant="overline" color="text.secondary" sx={{ textTransform: 'uppercase', fontWeight: 'bold', textAlign: 'right' }}>
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
                                                    <ListItemButton
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
                                                        {open && <ListItemText primary={item.title} sx={{ opacity: open ? 1 : 0, textAlign: 'right' }} />}
                                                        {open && (isOpen ? <ExpandLess /> : <ExpandMore />)}
                                                    </ListItemButton>
                                                    <Collapse in={isOpen && open} timeout="auto" unmountOnExit>
                                                        <List component="div" disablePadding>
                                                            {item.children.map((child) => (
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
                                                            ))}
                                                        </List>
                                                    </Collapse>
                                                </React.Fragment>
                                            );
                                        }
                                        return (
                                            <ListItem key={item.segment} disablePadding>
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
                                                    <ListItemIcon sx={{ minWidth: 0, ml: open ? 3 : 'auto', justifyContent: 'center' }}>
                                                        {item.icon}
                                                    </ListItemIcon>
                                                    {open && <ListItemText primary={item.title} sx={{ opacity: open ? 1 : 0, textAlign: 'right' }} />}
                                                </ListItemButton>
                                            </ListItem>
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
