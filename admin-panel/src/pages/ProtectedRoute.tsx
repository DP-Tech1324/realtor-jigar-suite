import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

export default function ProtectedRoute({ allowedRoles, children }) {
  const userRole = localStorage.getItem('user_role');
  const location = useLocation();

  if (!userRole) {
    // Not logged in, redirect to /auth and preserve intended page
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }
  if (!allowedRoles.includes(userRole)) {
    // Logged in, but not allowed
    return <div style={{ color: 'red', padding: 40, fontSize: 24 }}>
      Access Denied
    </div>;
  }
  return <>{children}</>;
}
