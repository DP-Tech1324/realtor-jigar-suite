import React from 'react';
export default function ProtectedRoute({ allowedRoles, children }) {
  const userRole = localStorage.getItem('user_role');
  if (!allowedRoles.includes(userRole)) {
    return <div style={{ color: 'red' }}>Access Denied</div>;
  }
  return <>{children}</>;
}
