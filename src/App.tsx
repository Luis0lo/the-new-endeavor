import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/hooks/use-theme";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import CalendarPage from "./pages/CalendarPage";
import AccountSettings from "./pages/AccountSettings";
import InventoryPage from "./pages/InventoryPage";
import InventoryShelfPage from "./pages/InventoryShelfPage";
import CompanionPlantsPage from "./pages/CompanionPlantsPage";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Sitemap from "./pages/Sitemap";
import CookiePolicy from "./pages/CookiePolicy";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import NotFound from "./pages/NotFound";
import CookieConsent from "./components/CookieConsent";
import About from "./pages/About";
import { runSeedData } from "./seed";
import GardeningResources from "./pages/GardeningResources";

// Run seed data when the app loads
runSeedData().then(result => {
  console.log("Seed data execution complete, result:", result);
});

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <CookieConsent />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dashboard/calendar" element={<CalendarPage />} />
            <Route path="/dashboard/settings" element={<AccountSettings />} />
            <Route path="/dashboard/inventory" element={<InventoryPage />} />
            <Route path="/dashboard/inventory/:shelfId" element={<InventoryShelfPage />} />
            <Route path="/dashboard/companions" element={<CompanionPlantsPage />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/sitemap" element={<Sitemap />} />
            <Route path="/cookie-policy" element={<CookiePolicy />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-of-service" element={<TermsOfService />} />
            <Route path="/about" element={<About />} />
            <Route path="/resources" element={<GardeningResources />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
