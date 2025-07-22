import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export default function RequireNotAuth({ children }) {
  const authStatus = useSelector((state) => state.auth.status);
  const authUid = useSelector((state) => state.auth.uid);
  const authUserType = useSelector((state) => state.auth.type_of_user);

  if (authStatus === "loading") {
    // Optionally show a spinner
    return null;
  }

  if (authUid && authUserType) {
    // Already authenticated, redirect to dashboard ONLY for admin
    if (authUserType === "admin") return <Navigate to="/admin-dashboard" replace />;
    // For client/org, redirect to home, NOT dashboard
    return <Navigate to="/home" replace />;
  }

  // Not authenticated, show login/register
  return children;
} 