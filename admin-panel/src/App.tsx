
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/contexts/AuthContext';
import ScrollToTop from '@/components/ScrollToTop';
import AiChatBubble from "@/components/AiChatBubble";

// Import all pages
import Home from '@/pages/Home';
import About from '@/pages/About';
import Listings from '@/pages/Listings';
import Properties from '@/pages/Properties';
import PropertyDetails from '@/pages/PropertyDetails';
import Contact from '@/pages/Contact';
import Buyers from '@/pages/Buyers';
import Sellers from '@/pages/Sellers';
import ServicesPage from '@/pages/ServicesPage';
import ServiceDetail from '@/pages/ServiceDetail';
import Blog from '@/pages/Blog';
import BlogPostPage from '@/pages/BlogPostPage';
import NotFound from '@/pages/NotFound';
import Calculators from '@/pages/Calculators';
import HomeValuation from '@/pages/HomeValuation';
import Resources from '@/pages/Resources';
import AgentsPage from '@/pages/AgentsPage';
import Luxury from '@/pages/Luxury';
import Investment from '@/pages/Investment';
import Commercial from '@/pages/Commercial';
import Relocation from '@/pages/Relocation';
import PropertySales from '@/pages/PropertySales';
import PropertyAcquisition from '@/pages/PropertyAcquisition';
import RlpSearch from '@/pages/RlpSearch';
import Favorites from '@/pages/Favorites';
import ContactPage from '@/pages/ContactPage';

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

import './App.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <ScrollToTop />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/listings" element={<Listings />} />
            <Route path="/properties" element={<Properties />} />
            <Route path="/properties/:propertyId" element={<PropertyDetails />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/buyers" element={<Buyers />} />
            <Route path="/sellers" element={<Sellers />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/services/:serviceId" element={<ServiceDetail />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:postId" element={<BlogPostPage />} />
            <Route path="/calculators" element={<Calculators />} />
            <Route path="/home-valuation" element={<HomeValuation />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/agents" element={<AgentsPage />} />
            <Route path="/luxury" element={<Luxury />} />
            <Route path="/investment" element={<Investment />} />
            <Route path="/commercial" element={<Commercial />} />
            <Route path="/relocation" element={<Relocation />} />
            <Route path="/property-sales" element={<PropertySales />} />
            <Route path="/property-acquisition" element={<PropertyAcquisition />} />
            <Route path="/rlp-search" element={<RlpSearch />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/contact-page" element={<ContactPage />} />
            
            {/* Auth Routes */}
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/access-denied" element={<AccessDenied />} />
            
            {/* Admin Routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={["admin", "superadmin", "editor"]}>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route
                index
                element={
                  <ProtectedRoute allowedRoles={["admin", "superadmin", "editor"]}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="properties"
                element={
                  <ProtectedRoute allowedRoles={["admin", "superadmin", "editor"]}>
                    <AdminProperties />
                  </ProtectedRoute>
                }
              />
              <Route
                path="inquiries"
                element={
                  <ProtectedRoute allowedRoles={["admin", "superadmin", "editor"]}>
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
                  <ProtectedRoute allowedRoles={["admin", "superadmin", "editor"]}>
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
            
            {/* 404 Route */}
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
