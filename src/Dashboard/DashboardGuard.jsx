import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, CircularProgress, Typography } from '@mui/material';

const DashboardGuard = ({ children }) => {
  const authUid = useSelector((state) => state.auth.uid);
  const authUserType = useSelector((state) => state.auth.type_of_user);
  const userProfile = useSelector((state) => state.user.profile);
  const userProfileStatus = useSelector((state) => state.user.status);
  const navigate = useNavigate();
  const location = useLocation();

  // Determine the correct dashboard based on user type
  const getCorrectDashboardRoute = () => {
    // Only admin users should access admin dashboard
    if (userProfile?.type_of_user === 'admin' || authUserType === 'admin') {
      return '/admin-dashboard';
    }
    
    // For non-admin users, redirect to home page
    return '/home';
  };

  // Check if user is on the correct dashboard
  const isOnCorrectDashboard = () => {
    const correctRoute = getCorrectDashboardRoute();
    return location.pathname === correctRoute;
  };

  useEffect(() => {
    // Only redirect if we have user data and the user is not on the correct dashboard
    if (authUid && userProfileStatus !== 'loading') {
      if (!isOnCorrectDashboard()) {
        const correctRoute = getCorrectDashboardRoute();
        console.log(`DashboardGuard: Redirecting from ${location.pathname} to ${correctRoute}`);
        navigate(correctRoute, { replace: true });
      }
    }
  }, [authUid, userProfile, userProfileStatus, authUserType, location.pathname, navigate]);

  // Show loading while profile is being fetched
  if (userProfileStatus === 'loading') {
    return (
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        gap: 2
      }}>
        <CircularProgress size={60} />
        <Typography variant="h6" color="text.secondary">
          جاري تحميل لوحة التحكم...
        </Typography>
      </Box>
    );
  }

  // If user is on the correct dashboard, render the children
  if (isOnCorrectDashboard()) {
    return children;
  }

  // Show loading while redirecting
  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column',
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh',
      gap: 2
    }}>
      <CircularProgress size={60} />
      <Typography variant="h6" color="text.secondary">
        جاري تحويلك إلى لوحة التحكم الصحيحة...
      </Typography>
    </Box>
  );
};

export default DashboardGuard; 