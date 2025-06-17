
import React from 'react';
import { Outlet, useLocation, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import AdminSidebar from '@/components/AdminSidebar';
import NotificationPanel from '@/components/ui/NotificationPanel';
import { Button } from '@/components/ui/button';
import { LogOut, Menu, X, RefreshCw } from 'lucide-react';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAdmin, userRole, signOut, user, isLoading, refreshProfile } = useAuth();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const [refreshing, setRefreshing] = React.useState(false);

  const handleLogout = async () => {
    await signOut();
    navigate('/auth');
  };

  const handleRefreshProfile = async () => {
    setRefreshing(true);
    await refreshProfile();
    setTimeout(() => setRefreshing(false), 1000);
  };

  // Show loading while auth state is being determined
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  // Only allow access to authenticated admin users
  if (!isAdmin) {
    return <Navigate to="/access-denied" state={{ from: location }} replace />;
  }

  return (
    <div className="min-h-screen flex bg-gray-50 w-full">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <AdminSidebar />
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/40" onClick={() => setSidebarOpen(false)}>
          <div className="bg-white w-64 h-full shadow-xl" onClick={e => e.stopPropagation()}>
            <div className="p-4 border-b flex items-center justify-between">
              <h2 className="font-semibold text-lg text-realtor-navy">Admin Panel</h2>
              <Button size="icon" variant="ghost" onClick={() => setSidebarOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <AdminSidebar />
          </div>
        </div>
      )}

      {/* Main content area */}
      <main className="flex-1 flex flex-col min-h-screen lg:ml-0">
        {/* Enhanced top header bar */}
        <header className="flex items-center justify-between p-3 sm:p-4 bg-white shadow-sm border-b sticky top-0 z-40">
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Mobile menu button */}
            <Button 
              size="icon" 
              variant="ghost" 
              className="lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-4 w-4" />
            </Button>
            
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="text-xs sm:text-sm text-gray-600">
                <span className="hidden sm:inline">Logged in as: </span>
                <span className="capitalize font-semibold text-realtor-navy">{userRole}</span>
              </div>
              
              {/* Refresh profile button */}
              <Button
                size="sm"
                variant="ghost"
                onClick={handleRefreshProfile}
                disabled={refreshing}
                className="text-gray-500 hover:text-realtor-navy p-1 sm:p-2"
              >
                <RefreshCw className={`h-3 w-3 sm:h-4 sm:w-4 ${refreshing ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-1 sm:gap-2">
            {/* Notifications Panel */}
            <NotificationPanel />
            
            {/* Logout button - visible on mobile */}
            <Button 
              variant="outline" 
              onClick={handleLogout} 
              size="sm"
              className="lg:hidden text-red-600 border-red-200 hover:bg-red-50 px-2 py-1 text-xs"
            >
              <LogOut className="h-3 w-3 mr-1" />
              <span className="hidden xs:inline">Logout</span>
            </Button>
          </div>
        </header>

        {/* Page content with better spacing */}
        <section className="flex-1 p-3 sm:p-4 lg:p-6 overflow-auto">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </section>
      </main>
    </div>
  );
};

export default AdminLayout;
