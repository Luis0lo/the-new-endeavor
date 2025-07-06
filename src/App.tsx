
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import CalendarPage from "./pages/CalendarPage";
import SeedCalendarPage from "./pages/SeedCalendarPage";
import InventoryPage from "./pages/InventoryPage";
import InventoryShelfPage from "./pages/InventoryShelfPage";
import GardenLayoutPage from "./pages/GardenLayoutPage";
import CustomShapeDrawerPage from "./pages/CustomShapeDrawerPage";
import CompanionPlantsPage from "./pages/CompanionPlantsPage";
import AccountSettings from "./pages/AccountSettings";
import Auth from "./pages/Auth";
import ResetPassword from "./pages/ResetPassword";
import AdminPage from "./pages/AdminPage";
import About from "./pages/About";
import CookiePolicy from "./pages/CookiePolicy";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import Sitemap from "./pages/Sitemap";
import NotFound from "./pages/NotFound";
import Greenlink from "./pages/Greenlink";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <HelmetProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/auth/reset-password" element={<ResetPassword />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dashboard/calendar" element={<CalendarPage />} />
            <Route path="/dashboard/seed-calendar" element={<SeedCalendarPage />} />
            <Route path="/dashboard/inventory" element={<InventoryPage />} />
            <Route path="/dashboard/inventory/:shelfId" element={<InventoryShelfPage />} />
            <Route path="/dashboard/garden-layout" element={<GardenLayoutPage />} />
            <Route path="/dashboard/garden-layout/custom-shapes" element={<CustomShapeDrawerPage />} />
            <Route path="/dashboard/companions" element={<CompanionPlantsPage />} />
            <Route path="/dashboard/settings" element={<AccountSettings />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/about" element={<About />} />
            <Route path="/greenlink" element={<Greenlink />} />
            <Route path="/cookie-policy" element={<CookiePolicy />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-of-service" element={<TermsOfService />} />
            <Route path="/sitemap" element={<Sitemap />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </HelmetProvider>
  </QueryClientProvider>
);

export default App;
