import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/contexts/AuthContext';
import ScrollToTop from '@/components/ScrollToTop';
import AiChatBubble from "@/components/AiChatBubble";

// Admin pages
import AuthPage from '@/pages/auth/AuthPage';
import AdminLayout from '@/layouts/AdminLayout';
import AdminDashboard from '@/pages/admin/AdminDashboard';
import AdminProperties from '@/pages/admin/AdminProperties';
import AdminInquiries from '@/pages/admin/AdminInquiries';
import AdminUsers from '@/pages/admin/AdminUsers';
import AdminAnalytics from '@/pages/admin/AdminAnalytics';
import AdminImages from '@/pages/admin/AdminImages';
import AdminMarketing from '@/pages/admin/AdminMarketing';
import ProtectedRoute from '@/components/ProtectedRoute';
import AccessDenied from '@/pages/AccessDenied';
import NotFound from '@/pages/NotFound';

import './App.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

const allowedRoles = ["admin", "superadmin", "editor"];

function isLoggedIn() {
  const role = localStorage.getItem('user_role');
  return allowedRoles.includes(role);
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <ScrollToTop />
          <Routes>
            {/* Force root to /auth or /admin */}
            <Route
              path="/"
              element={
                isLoggedIn()
                  ? <Navigate to="/admin" replace />
                  : <Navigate to="/auth" replace />
              }
            />

            {/* Auth Route always accessible */}
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/access-denied" element={<AccessDenied />} />

            {/* Admin Routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={allowedRoles}>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route
                index
                element={
                  <ProtectedRoute allowedRoles={allowedRoles}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="properties"
                element={
                  <ProtectedRoute allowedRoles={allowedRoles}>
                    <AdminProperties />
                  </ProtectedRoute>
                }
              />
              <Route
                path="inquiries"
                element={
                  <ProtectedRoute allowedRoles={allowedRoles}>
                    <AdminInquiries />
                  </ProtectedRoute>
                }
              />
              <Route
                path="users"
                element={
                  <ProtectedRoute allowedRoles={["superadmin"]}>
                    <AdminUsers />
                  </ProtectedRoute>
                }
              />
              <Route
                path="analytics"
                element={
                  <ProtectedRoute allowedRoles={["admin", "superadmin"]}>
                    <AdminAnalytics />
                  </ProtectedRoute>
                }
              />
              <Route
                path="images"
                element={
                  <ProtectedRoute allowedRoles={allowedRoles}>
                    <AdminImages />
                  </ProtectedRoute>
                }
              />
              <Route
                path="marketing"
                element={
                  <ProtectedRoute allowedRoles={["admin", "superadmin"]}>
                    <AdminMarketing />
                  </ProtectedRoute>
                }
              />
            </Route>

            {/* 404 Not Found */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
          <AiChatBubble />
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
