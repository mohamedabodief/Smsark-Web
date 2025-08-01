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
  const uid = useSelector((state) => state.auth.uid);
  const authStatus = useSelector((state) => state.auth.status);

  if (authStatus === 'loading') {
    return null;
  }

  if (uid) {
    return <Outlet />;
  } else {
    // alert("يجب تسجيل الدخول أولاً");
    return <Navigate to="/login" replace />;
  }
}
