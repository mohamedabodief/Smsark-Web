import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

/**
 * PrivateRoute component to protect routes.
 * It checks if a user is authenticated (has a UID in Redux state).
 * If authenticated, it renders the child routes/components.
 * If not authenticated, it redirects to the login page.
 */
export default function PrivateRoute() {
  // Get the UID from the Redux auth slice
  const uid = useSelector((state) => state.auth.uid);
  const authStatus = useSelector((state) => state.auth.status);

  // While authentication status is loading, you might want to show a loading spinner
  // or a blank page to prevent flickering before redirection.
  // For simplicity, we'll proceed directly. In a real app, consider a loading state.
  if (authStatus === 'loading') {
    // You could return a loading spinner here:
    // return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Loading...</div>;
    return null; // Or null to render nothing while loading
  }

  // If a UID exists, the user is considered authenticated, so render the protected content
  if (uid) {
    return <Outlet />; // Outlet renders child routes
  } else {
    // If no UID, redirect to the login page.
    // The 'replace' prop ensures that the login page replaces the current entry in the history stack,
    // so the user cannot go back to the protected page using the browser's back button.
    return <Navigate to="/login" replace />;
  }
}
