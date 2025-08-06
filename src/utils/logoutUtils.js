import { logout } from '../LoginAndRegister/featuresLR/authSlice';
import { clearProfile } from '../LoginAndRegister/featuresLR/userSlice';

// Import other slice actions that need to be cleared on logout
// Add these imports as needed based on your Redux store structure

/**
 * Comprehensive logout utility that clears all relevant Redux state
 * @param {Function} dispatch - Redux dispatch function
 * @param {Function} signOut - Firebase signOut function
 * @param {Object} auth - Firebase auth instance
 * @param {Function} navigate - React Router navigate function
 */
export const performLogout = async (dispatch, signOut, auth, navigate) => {
  console.log('جارى تسجيل الخروج');
  
  try {
    // Sign out from Firebase
    await signOut(auth);
    
    // Clear all Redux state slices
    dispatch(logout()); // Clear auth state
    dispatch(clearProfile()); // Clear user profile
    
    // Add other state clearing actions here as needed
    // Example:
    // dispatch(clearAdvertisements());
    // dispatch(clearProperties());
    // dispatch(clearNotifications());
    // dispatch(clearFavorites());
    // dispatch(clearAnalytics());
    // dispatch(clearInquiries());
    // dispatch(clearFinancialRequests());
    // dispatch(clearHomepageAds());
    // dispatch(clearPaidAds());
    // dispatch(clearAdminUsers());
    // dispatch(clearOrganizations());
    // dispatch(clearProperties());
    // dispatch(clearInquiries());
    // dispatch(clearAnalytics());
    
    // Redirect to login page
    setTimeout(() => {
      navigate('/login');
    }, 2000);
    
    console.log('تم تسجيل الخروج بنجاح.');
  } catch (error) {
    console.error('خطأ في تسجيل الخروج:', error);
    // You might want to show a Snackbar or Alert here for the user
  }
};

/**
 * Clear specific state slices without logging out
 * Useful for clearing sensitive data when switching users
 * @param {Function} dispatch - Redux dispatch function
 */
export const clearUserData = (dispatch) => {
  dispatch(clearProfile());
  
  // Add other state clearing actions here as needed
  // Example:
  // dispatch(clearAdvertisements());
  // dispatch(clearProperties());
  // dispatch(clearNotifications());
  // dispatch(clearFavorites());
  // dispatch(clearAnalytics());
  // dispatch(clearInquiries());
  // dispatch(clearFinancialRequests());
  // dispatch(clearHomepageAds());
  // dispatch(clearPaidAds());
  // dispatch(clearAdminUsers());
  // dispatch(clearOrganizations());
  // dispatch(clearProperties());
  // dispatch(clearInquiries());
  // dispatch(clearAnalytics());
}; 