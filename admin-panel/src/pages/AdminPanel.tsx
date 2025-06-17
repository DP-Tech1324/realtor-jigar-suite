
// src/pages/AdminPanel.tsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const AdminPanel = () => {
  const { isAdmin, isLoading } = useAuth();
  
  // Show loading while checking auth status
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-realtor-gold"></div>
      </div>
    );
  }

  // If user is admin, redirect to the new admin layout
  if (isAdmin) {
    return <Navigate to="/admin" replace />;
  }

  // Non-admin users get redirected to access denied
  return <Navigate to="/access-denied" replace />;
};

export default AdminPanel;
