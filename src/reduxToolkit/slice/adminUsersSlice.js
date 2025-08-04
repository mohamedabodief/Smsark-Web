import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import User from '../../FireBase/modelsWithOperations/User'; // Adjust path as necessary to your User.js file
import { getAuth, createUserWithEmailAndPassword, deleteUser, updateProfile } from 'firebase/auth'; // Import Firebase Auth functions
import { auth } from '../../FireBase/firebaseConfig'; // Import your Firebase auth instance
import { requestForToken } from '../../FireBase/MessageAndNotification/firebaseMessaging'; // Import requestForToken

// Async Thunk to fetch all client users
export const fetchClients = createAsyncThunk(
    'adminUsers/fetchClients',
    async (_, { rejectWithValue }) => {
        try {
            console.log("Fetching client users...");
            const clients = await User.getAllUsersByType('client');
            console.log("Fetched clients:", clients);
            // Convert User instances to plain objects
            const plainClients = clients.map(user => {
                const plain = {};
                for (const key in user) {
                    if (Object.prototype.hasOwnProperty.call(user, key)) {
                        plain[key] = user[key];
                    }
                }
                return plain;
            });
            return plainClients;
        } catch (error) {
            console.error("Error fetching clients:", error);
            return rejectWithValue(error.message || 'Failed to fetch clients.');
        }
    }
);

// Async Thunk to fetch all organization users
export const fetchOrganizations = createAsyncThunk(
    'adminUsers/fetchOrganizations',
    async (_, { rejectWithValue }) => {
        try {
            console.log("Fetching organization users...");
            const organizations = await User.getAllUsersByType('organization');
            console.log("Fetched organizations:", organizations);
            // Convert User instances to plain objects
            const plainOrganizations = organizations.map(user => {
                const plain = {};
                for (const key in user) {
                    if (Object.prototype.hasOwnProperty.call(user, key)) {
                        plain[key] = user[key];
                    }
                }
                return plain;
            });
            return plainOrganizations;
        } catch (error) {
            console.error("Error fetching organizations:", error);
            return rejectWithValue(error.message || 'Failed to fetch organizations.');
        }
    }
);

// Async Thunk to fetch all admin users
export const fetchAdmins = createAsyncThunk(
    'adminUsers/fetchAdmins',
    async (_, { rejectWithValue }) => {
        try {
            console.log("Fetching admin users...");
            const admins = await User.getAllUsersByType('admin');
            console.log("Fetched admins:", admins);
            // Convert User instances to plain objects
            const plainAdmins = admins.map(user => {
                const plain = {};
                for (const key in user) {
                    if (Object.prototype.hasOwnProperty.call(user, key)) {
                        plain[key] = user[key];
                    }
                }
                return plain;
            });
            return plainAdmins;
        } catch (error) {
            console.error("Error fetching admins:", error);
            return rejectWithValue(error.message || 'Failed to fetch admins.');
        }
    }
);

// NEW: Async Thunk to add a new admin (Firebase Auth + Firestore + FCM Token)
export const addAdmin = createAsyncThunk(
    'adminUsers/addAdmin',
    async ({ email, password, adm_name, phone, gender }, { rejectWithValue }) => {
        try {
            // 1. Create user in Firebase Authentication
            console.log("Attempting to create Firebase Auth user for:", email);
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const uid = userCredential.user.uid;
            console.log("Firebase Auth user created. UID:", uid);

            // 2. Prepare admin data for Firestore
            const newAdminData = {
                uid: uid,
                type_of_user: "admin", // Explicitly set type for admin
                adm_name: adm_name,
                phone: phone,
                gender: gender,
                email: email, // Including email in Firestore data for completeness
                // image: null, // Add if you have an image upload feature
            };

            // 3. Save admin profile to Firestore using the User class
            console.log("Saving admin profile to Firestore for UID:", uid);
            const adminUser = new User(newAdminData);
            await adminUser.saveToFirestore();
            console.log("Admin profile saved to Firestore successfully.");

            // 4. Generate and save FCM Token
            console.log("Requesting FCM Token...");
            const fcmToken = await requestForToken();
            if (fcmToken) {
                console.log("FCM Token received:", fcmToken);
                await adminUser.saveFcmToken(fcmToken);
                console.log("FCM Token saved to admin profile.");
            } else {
                console.warn("⚠️ No FCM Token generated for admin during registration.");
            }

            return newAdminData; // Return the data that was saved
        } catch (error) {
            console.error("Error in addAdmin thunk:", error);
            // Firebase Auth errors have a 'code' property
            let errorMessage = error.message;
            if (error.code) {
                switch (error.code) {
                    case 'auth/email-already-in-use':
                        errorMessage = 'البريد الإلكتروني مستخدم بالفعل.';
                        break;
                    case 'auth/invalid-email':
                        errorMessage = 'صيغة البريد الإلكتروني غير صالحة.';
                        break;
                    case 'auth/weak-password':
                        errorMessage = 'كلمة المرور ضعيفة جدًا (يجب أن تكون 6 أحرف على الأقل).';
                        break;
                    default:
                        errorMessage = `خطأ في المصادقة: ${error.message}`;
                }
            }
            return rejectWithValue(errorMessage);
        }
    }
);

// NEW: Async Thunk to edit an existing admin's Firestore data
export const editAdmin = createAsyncThunk(
    'adminUsers/editAdmin',
    async ({ uid, adm_name, phone, gender }, { rejectWithValue }) => {
        try {
            // Create a User instance to use its updateInFirestore method
            const adminUser = new User({ uid }); // Create an instance with just the UID
            const updates = {
                adm_name: adm_name,
                phone: phone,
                gender: gender,
                // Do NOT include email or password here unless you're explicitly updating Auth
            };
            console.log("Updating admin profile in Firestore for UID:", uid, "Updates:", updates);
            await adminUser.updateInFirestore(updates);
            console.log("Admin profile updated successfully.");

            // Return the updated data to reflect in Redux state
            return { uid, ...updates };
        } catch (error) {
            console.error("Error in editAdmin thunk:", error);
            return rejectWithValue(error.message || 'Failed to update admin.');
        }
    }
);

// NEW: Async Thunk to delete an admin (Firebase Auth + Firestore)
export const deleteAdmin = createAsyncThunk(
    'adminUsers/deleteAdmin',
    async (uid, { rejectWithValue }) => {
        try {
            // IMPORTANT: Deleting a user from Firebase Auth requires admin SDK or Callable Cloud Function
            // For client-side, you can only delete the *currently logged-in* user.
            // If this is meant for an admin to delete *any* user, you'll need a Cloud Function.
            // For now, this will only delete the Firestore document.
            // If you need to delete from Auth, you'll need to set up a Firebase Cloud Function.
            console.warn("Client-side deleteAdmin will only delete the Firestore document. To delete from Firebase Auth, a Cloud Function is required.");

            const adminUser = new User({ uid });
            await adminUser.deleteFromFirestore();
            console.log("Admin Firestore document deleted for UID:", uid);

            // You might also want to delete the Firebase Auth user. This typically requires
            // a backend (Cloud Function) because client-side deletion is restricted to the current user.
            // Example for a Cloud Function call (conceptual):
            // await fetch('/deleteUserCallableFunction', { method: 'POST', body: JSON.stringify({ uid }) });

            return uid; // Return the UID of the deleted admin
        } catch (error) {
            console.error("Error in deleteAdmin thunk:", error);
            return rejectWithValue(error.message || 'Failed to delete admin.');
        }
    }
);
// NEW: Async Thunk to delete a client (Firestore)
export const deleteClientAsync = createAsyncThunk(
    'adminUsers/deleteClientAsync',
    async (uid, { rejectWithValue }) => {
        try {
            console.log("Deleting client with UID:", uid);
            const clientUser = new User({ uid });
            await clientUser.deleteFromFirestore();
            console.log("Client Firestore document deleted for UID:", uid);
            return uid; // Return the UID of the deleted client
        } catch (error) {
            console.error("Error in deleteClientAsync thunk:", error);
            return rejectWithValue(error.message || 'Failed to delete client.');
        }
    }
);

// NEW: Async Thunk to delete an organization (Firestore)
export const deleteOrganizationAsync = createAsyncThunk(
    'adminUsers/deleteOrganizationAsync',
    async (uid, { rejectWithValue }) => {
        try {
            console.log("Deleting organization with UID:", uid);
            const orgUser = new User({ uid });
            await orgUser.deleteFromFirestore();
            console.log("Organization Firestore document deleted for UID:", uid);
            return uid; // Return the UID of the deleted organization
        } catch (error) {
            console.error("Error in deleteOrganizationAsync thunk:", error);
            return rejectWithValue(error.message || 'Failed to delete organization.');
        }
    }
);

const adminUsersSlice = createSlice({
    name: 'adminUsers',
    initialState: {
        clients: [],
        organizations: [],
        admins: [],
        clientsStatus: 'idle',
        organizationsStatus: 'idle',
        adminsStatus: 'idle',
        clientsError: null,
        organizationsError: null,
        adminsError: null,
    },
    reducers: {
        // These are now handled by extraReducers for async thunks
        // addClient: (state, action) => { state.clients.push(action.payload); },
        // editClient: (state, action) => { /* ... */ },
        // deleteClient: (state, action) => { /* ... */ },
        // addOrganization: (state, action) => { /* ... */ },
        // editOrganization: (state, action) => { /* ... */ },
        // deleteOrganization: (state, action) => { /* ... */ },
        // addAdmin: (state, action) => { state.admins.push(action.payload); }, // REMOVED
        // editAdmin: (state, action) => { /* ... */ }, // REMOVED
        // deleteAdmin: (state, action) => { /* ... */ }, // REMOVED

        // Keep synchronous reducers if they are still needed for direct state manipulation
        // For example, if addClient/editClient/deleteClient are NOT going through Firebase directly
        // and are just for local Redux state updates, keep them.
        // For now, I'll keep them as they were, but they won't trigger Firebase actions.
        addClient: (state, action) => {
            state.clients.push(action.payload);
        },
        editClient: (state, action) => {
            const index = state.clients.findIndex(client => client.uid === action.payload.uid);
            if (index !== -1) {
                state.clients[index] = { ...state.clients[index], ...action.payload };
            }
        },
        deleteClient: (state, action) => {
            state.clients = state.clients.filter(client => client.uid !== action.payload);
        },
        addOrganization: (state, action) => {
            state.organizations.push(action.payload);
        },
        editOrganization: (state, action) => {
            const index = state.organizations.findIndex(org => org.uid === action.payload.uid);
            if (index !== -1) {
                state.organizations[index] = { ...state.organizations[index], ...action.payload };
            }
        },
        deleteOrganization: (state, action) => {
            state.organizations = state.organizations.filter(org => org.uid !== action.payload);
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch Clients
            .addCase(fetchClients.pending, (state) => {
                state.clientsStatus = 'loading';
            })
            .addCase(fetchClients.fulfilled, (state, action) => {
                state.clientsStatus = 'succeeded';
                state.clients = action.payload;
            })
            .addCase(fetchClients.rejected, (state, action) => {
                state.clientsStatus = 'failed';
                state.clientsError = action.payload;
            })
            // Fetch Organizations
            .addCase(fetchOrganizations.pending, (state) => {
                state.organizationsStatus = 'loading';
            })
            .addCase(fetchOrganizations.fulfilled, (state, action) => {
                state.organizationsStatus = 'succeeded';
                state.organizations = action.payload;
            })
            .addCase(fetchOrganizations.rejected, (state, action) => {
                state.organizationsStatus = 'failed';
                state.organizationsError = action.payload;
            })
            // Fetch Admins
            .addCase(fetchAdmins.pending, (state) => {
                state.adminsStatus = 'loading';
            })
            .addCase(fetchAdmins.fulfilled, (state, action) => {
                state.adminsStatus = 'succeeded';
                state.admins = action.payload;
            })
            .addCase(fetchAdmins.rejected, (state, action) => {
                state.adminsStatus = 'failed';
                state.adminsError = action.payload;
            })
            // Add Admin
            .addCase(addAdmin.pending, (state) => {
                state.adminsStatus = 'loading'; // Or a specific 'addAdminStatus'
                state.adminsError = null;
            })
            .addCase(addAdmin.fulfilled, (state, action) => {
                state.adminsStatus = 'succeeded';
                state.admins.push(action.payload); // Add the new admin to the list
            })
            .addCase(addAdmin.rejected, (state, action) => {
                state.adminsStatus = 'failed';
                state.adminsError = action.payload;
            })
            // Edit Admin
            .addCase(editAdmin.pending, (state) => {
                state.adminsStatus = 'loading'; // Or a specific 'editAdminStatus'
                state.adminsError = null;
            })
            .addCase(editAdmin.fulfilled, (state, action) => {
                state.adminsStatus = 'succeeded';
                const index = state.admins.findIndex(admin => admin.uid === action.payload.uid);
                if (index !== -1) {
                    state.admins[index] = { ...state.admins[index], ...action.payload };
                }
            })
            .addCase(editAdmin.rejected, (state, action) => {
                state.adminsStatus = 'failed';
                state.adminsError = action.payload;
            })
            // Delete Admin
            .addCase(deleteAdmin.pending, (state) => {
                state.adminsStatus = 'loading'; // Or a specific 'deleteAdminStatus'
                state.adminsError = null;
            })
            .addCase(deleteAdmin.fulfilled, (state, action) => {
                state.adminsStatus = 'succeeded';
                state.admins = state.admins.filter(admin => admin.uid !== action.payload);
            })
            .addCase(deleteAdmin.rejected, (state, action) => {
                state.adminsStatus = 'failed';
                state.adminsError = action.payload;
            })
             // Delete Client Async
            .addCase(deleteClientAsync.pending, (state) => {
                state.clientsStatus = 'loading';
                state.clientsError = null;
            })
            .addCase(deleteClientAsync.fulfilled, (state, action) => {
                state.clientsStatus = 'succeeded';
                state.clients = state.clients.filter(client => client.uid !== action.payload);
            })
            .addCase(deleteClientAsync.rejected, (state, action) => {
                state.clientsStatus = 'failed';
                state.clientsError = action.payload;
            })
            // Delete Organization Async
            .addCase(deleteOrganizationAsync.pending, (state) => {
                state.organizationsStatus = 'loading';
                state.organizationsError = null;
            })
            .addCase(deleteOrganizationAsync.fulfilled, (state, action) => {
                state.organizationsStatus = 'succeeded';
                state.organizations = state.organizations.filter(org => org.uid !== action.payload);
            })
            .addCase(deleteOrganizationAsync.rejected, (state, action) => {
                state.organizationsStatus = 'failed';
                state.organizationsError = action.payload;
            });
    },
});

export const { addClient, editClient, deleteClient, addOrganization, editOrganization, deleteOrganization } = adminUsersSlice.actions; // Export only synchronous actions
export default adminUsersSlice.reducer;
