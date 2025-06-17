
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import { AuthProvider } from "@/components/auth/AuthContext";
import AdminRoute from "@/components/AdminRoute";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// Auth Page
import Auth from "./pages/Auth";

// Calculators Pages
import Calculators from "./pages/Calculators";
import MortgageCalculator from "./pages/calculators/MortgageCalculator";
import LandTransferTaxCalculator from "./pages/calculators/LandTransferTaxCalculator";
import AffordabilityCalculator from "./pages/calculators/AffordabilityCalculator";

// Buyers Pages
import Buyers from "./pages/Buyers";
import FinancingOptions from "./pages/buyers/FinancingOptions";
import FirstTimeGuide from "./pages/buyers/FirstTimeGuide";
import HomeBuyingProcess from "./pages/buyers/HomeBuyingProcess";

// Sellers Pages
import Sellers from "./pages/Sellers";
import HomeValuation from "./pages/sellers/HomeValuation";
import MarketingStrategy from "./pages/sellers/MarketingStrategy";
import StagingTips from "./pages/sellers/StagingTips";

// New Pages
import PropertyDetails from "./pages/PropertyDetails";
import PropertySearch from "./pages/PropertySearch";
import FAQ from "./pages/FAQ";
import Blog from "./pages/Blog";
import Favorites from "./pages/Favorites";
import AdminDashboard from "./pages/AdminDashboard";
import Contact from "./pages/Contact";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
        <ScrollToTop />
          <Routes>
            <Route path="/" element={<Index />} />
            
            {/* Auth Page */}
            <Route path="/auth" element={<Auth />} />
            
            {/* Property Pages */}
            <Route path="/property/:id" element={<PropertyDetails />} />
            <Route path="/search" element={<PropertySearch />} />
            <Route path="/favorites" element={<Favorites />} />
            
            {/* Information Pages */}
            <Route path="/faq" element={<FAQ />} />
            <Route path="/blog" element={<Blog />} />
            
            {/* Admin - Protected by AdminRoute component */}
            <Route path="/admin" element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            } />
            
            {/* Calculators Routes */}
            <Route path="/calculators" element={<Calculators />} />
            <Route path="/calculators/mortgage" element={<MortgageCalculator />} />
            <Route path="/calculators/land-transfer-tax" element={<LandTransferTaxCalculator />} />
            <Route path="/calculators/affordability" element={<AffordabilityCalculator />} />
            
            {/* Buyers Routes */}
            <Route path="/buyers" element={<Buyers />} />
            <Route path="/buyers/financing-options" element={<FinancingOptions />} />
            <Route path="/buyers/first-time-guide" element={<FirstTimeGuide />} />
            <Route path="/buyers/home-buying-process" element={<HomeBuyingProcess />} />
            
            {/* Sellers Routes */}
            <Route path="/sellers" element={<Sellers />} />
            <Route path="/sellers/valuation" element={<HomeValuation />} />
            <Route path="/sellers/marketing-strategy" element={<MarketingStrategy />} />
            <Route path="/sellers/staging-tips" element={<StagingTips />} />
            <Route path="/contact" element={<Contact />} />
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
