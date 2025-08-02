import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';


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
