import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
  requireAgent?: boolean;
  allowedRoles?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireAdmin = false,
  requireAgent = false,
  allowedRoles = [],
}) => {
  const { user, isLoading, isAdmin, isAgent, userRole } = useAuth();
  const location = useLocation();

  const resolvedRole = userRole || localStorage.getItem('userRole');
  const resolvedAdmin = isAdmin || localStorage.getItem('isAdmin') === 'true';

  console.log('🔐 ProtectedRoute DEBUG', {
    isLoading,
    user: !!user,
    resolvedRole,
    resolvedAdmin,
    location: location.pathname,
  });

  // Wait for auth to fully load
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-realtor-gold"></div>
      </div>
    );
  }

  // If not authenticated
  if (!user) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // Role check
  if (allowedRoles.length > 0 && (!resolvedRole || !allowedRoles.includes(resolvedRole))) {
    return <Navigate to="/access-denied" replace />;
  }

  // Admin check
  if (requireAdmin && !resolvedAdmin) {
    return <Navigate to="/access-denied" replace />;
  }

  // Agent check
  if (requireAgent && !isAgent) {
    return <Navigate to="/access-denied" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
