
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import { ThemeProvider } from "@/components/ui/theme-provider";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
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
import SeedCalendarGuide from "./pages/SeedCalendarGuide";
import GardenCalendarGuide from "./pages/GardenCalendarGuide";
import InventoryGuide from "./pages/InventoryGuide";

const queryClient = new QueryClient();

// Protected Route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);
    };

    getSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <HelmetProvider>
      <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/auth/reset-password" element={<ResetPassword />} />
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/dashboard/calendar" element={<ProtectedRoute><CalendarPage /></ProtectedRoute>} />
              <Route path="/dashboard/seed-calendar" element={<ProtectedRoute><SeedCalendarPage /></ProtectedRoute>} />
              <Route path="/dashboard/inventory" element={<ProtectedRoute><InventoryPage /></ProtectedRoute>} />
              <Route path="/dashboard/inventory/:shelfId" element={<ProtectedRoute><InventoryShelfPage /></ProtectedRoute>} />
              <Route path="/dashboard/garden-layout" element={<ProtectedRoute><GardenLayoutPage /></ProtectedRoute>} />
              <Route path="/dashboard/garden-layout/custom-shapes" element={<ProtectedRoute><CustomShapeDrawerPage /></ProtectedRoute>} />
              <Route path="/dashboard/companions" element={<ProtectedRoute><CompanionPlantsPage /></ProtectedRoute>} />
              <Route path="/dashboard/settings" element={<ProtectedRoute><AccountSettings /></ProtectedRoute>} />
              <Route path="/admin" element={<ProtectedRoute><AdminPage /></ProtectedRoute>} />
              <Route path="/about" element={<About />} />
              <Route path="/greenlink" element={<Greenlink />} />
              <Route path="/seed-calendar-guide" element={<SeedCalendarGuide />} />
              <Route path="/garden-calendar-guide" element={<GardenCalendarGuide />} />
              <Route path="/inventory-guide" element={<InventoryGuide />} />
              <Route path="/cookie-policy" element={<CookiePolicy />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms-of-service" element={<TermsOfService />} />
              <Route path="/sitemap" element={<Sitemap />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </HelmetProvider>
  </QueryClientProvider>
);

export default App;
