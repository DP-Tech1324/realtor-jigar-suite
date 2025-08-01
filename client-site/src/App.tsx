import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import { AuthProvider } from "@/components/auth/AuthContext";


// 💡 Add these:
import AgentBar from "@/components/AgentBar";

import TaglineBar from "@/components/TaglineBar";
import ListingsPage from "@/pages/Listings";
import MapSearch from "@/pages/MapSearch";


// Pages
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import Calculators from "./pages/Calculators";
import MortgageCalculator from "./pages/calculators/MortgageCalculator";
import LandTransferTaxCalculator from "./pages/calculators/LandTransferTaxCalculator";
import AffordabilityCalculator from "./pages/calculators/AffordabilityCalculator";
import Buyers from "./pages/Buyers";
import FinancingOptions from "./pages/buyers/FinancingOptions";
import FirstTimeGuide from "./pages/buyers/FirstTimeGuide";
import HomeBuyingProcess from "./pages/buyers/HomeBuyingProcess";
import Sellers from "./pages/Sellers";
import HomeValuation from "./pages/sellers/HomeValuation";
import MarketingStrategy from "./pages/sellers/MarketingStrategy";
import StagingTips from "./pages/sellers/StagingTips";
import PropertyDetails from "./pages/PropertyDetails";
import FAQ from "./pages/FAQ";
import Blog from "./pages/Blog";
import Favorites from "./pages/Favorites";

import Contact from "./pages/Contact";
import ClassicNavbar from "@/components/Navbar";
import Layout from "@/components/Layout";

const queryClient = new QueryClient();

import React, { useRef } from "react";

const App = () => {
  const headerRef = useRef<HTMLDivElement>(null);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <ScrollToTop />
            <Layout>
              {/* -------- ROUTES -------- */}
              <Routes>
                <Route path="/" element={<Index />} />
                {/* Auth Page */}
                <Route path="/auth" element={<Auth />} />
                {/* Property Pages */}
                <Route path="/property/:id" element={<PropertyDetails />} />
                
                <Route path="/favorites" element={<Favorites />} />
                <Route path="/listings" element={<ListingsPage />} />
                {/* Information Pages */}
                <Route path="/faq" element={<FAQ />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/map-search" element={<MapSearch />} />
                {/* Search Page */}
                <Route path="/search" element={<ListingsPage />} />
                {/* Calculators */}
                <Route path="/calculators" element={<Calculators />} />
                <Route path="/calculators/mortgage" element={<MortgageCalculator />} />
                <Route path="/calculators/land-transfer-tax" element={<LandTransferTaxCalculator />} />
                <Route path="/calculators/affordability" element={<AffordabilityCalculator />} />
                {/* Buyers */}
                <Route path="/buyers" element={<Buyers />} />
                <Route path="/buyers/financing-options" element={<FinancingOptions />} />
                <Route path="/buyers/first-time-guide" element={<FirstTimeGuide />} />
                <Route path="/buyers/home-buying-process" element={<HomeBuyingProcess />} />
                {/* Sellers */}
                <Route path="/sellers" element={<Sellers />} />
                <Route path="/sellers/valuation" element={<HomeValuation />} />
                <Route path="/sellers/marketing-strategy" element={<MarketingStrategy />} />
                <Route path="/sellers/staging-tips" element={<StagingTips />} />
                <Route path="/contact" element={<Contact />} />
                {/* Not found */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Layout>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
