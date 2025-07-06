
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { 
  Home, 
  Calendar, 
  Settings,
  LogOut,
  Menu,
  Archive,
  Flower2,
  ChevronLeft,
  ChevronRight,
  Sprout,
  LayoutGrid,
  BookOpen,
  Shield
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { User } from '@supabase/supabase-js';
import { useTheme } from '@/hooks/use-theme';
import { useIsMobile } from '@/hooks/use-mobile';
import { isDevelopment } from '@/utils/environment';
import { useAdminCheck } from '@/hooks/useAdminCheck';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    const savedState = localStorage.getItem('sidebarCollapsed');
    return savedState !== null ? JSON.parse(savedState) : false;
  });
  
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAdmin } = useAdminCheck();
  
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        if (!session?.user) {
          navigate('/auth');
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (!session?.user) {
        navigate('/auth');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  // Save sidebar state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('sidebarCollapsed', JSON.stringify(sidebarCollapsed));
  }, [sidebarCollapsed]);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Signed out",
        description: "You have been signed out successfully.",
      });
      navigate('/');
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to sign out",
        variant: "destructive"
      });
    }
  };

  const navigationItems = [
    {
      title: 'Dashboard',
      icon: Home,
      path: '/dashboard'
    },
    {
      title: 'Calendar',
      icon: Calendar,
      path: '/dashboard/calendar'
    },
    {
      title: 'Seed Calendar',
      icon: Sprout,
      path: '/dashboard/seed-calendar'
    },
    {
      title: 'Inventory',
      icon: Archive,
      path: '/dashboard/inventory'
    },
    // Conditionally add Garden Layout only in development
    ...(isDevelopment() ? [{
      title: 'Garden Layout',
      icon: LayoutGrid,
      path: '/dashboard/garden-layout'
    }] : []),
    {
      title: 'Companion Plants',
      icon: Flower2,
      path: '/dashboard/companions'
    },
    {
      title: 'Garden Resources',
      icon: BookOpen,
      path: '/dashboard/resources'
    },
    // Add admin link for admin users
    ...(isAdmin ? [{
      title: 'Admin',
      icon: Shield,
      path: '/admin'
    }] : []),
    {
      title: 'Account Settings',
      icon: Settings,
      path: '/dashboard/settings'
    }
  ];

  const isActive = (path: string) => {
    // Fix for the dashboard route being active on all /dashboard/* routes
    if (path === '/dashboard') {
      return location.pathname === '/dashboard';
    }
    // For other routes, check if the path matches exactly or starts with the path followed by a slash
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  const iconSize = sidebarCollapsed ? 24 : 18;

  return (
    <div className="flex min-h-screen w-full bg-background">
      {/* Desktop Sidebar - Hidden on Mobile */}
      {!isMobile && (
        <div 
          className={`fixed inset-y-0 left-0 z-50 flex flex-col border-r border-border bg-card transition-all duration-300 ${
            sidebarCollapsed ? "w-[60px]" : "w-[250px]"
          }`}
        >
          {/* Sidebar header */}
          <div className="flex h-16 items-center justify-between border-b px-4">
            <Link 
              to="/" 
              className={`flex items-center ${sidebarCollapsed ? "justify-center" : "gap-2"}`}
            >
              <span className="text-primary text-xl font-bold">
                {sidebarCollapsed ? "GA" : "2day Garden"}
              </span>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              className={sidebarCollapsed ? "hidden" : ""}
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            >
              <ChevronLeft size={18} />
            </Button>
            {sidebarCollapsed && (
              <Button
                variant="ghost"
                size="icon"
                className="ml-auto"
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              >
                {/* Changed from ChevronLeft to ChevronRight to point right when collapsed */}
                <ChevronRight size={18} />
              </Button>
            )}
          </div>

          {/* Navigation */}
          <div className="flex-1 overflow-auto py-4">
            <div className="mb-4 px-4">
              <nav className="flex flex-col gap-1">
                {navigationItems.map((item) => (
                  <Link
                    key={item.title}
                    to={item.path}
                    className={`flex items-center ${sidebarCollapsed ? "justify-center px-0" : "gap-2 px-3"} rounded-md py-1 ${
                      isActive(item.path)
                        ? "bg-accent text-accent-foreground"
                        : "text-muted-foreground hover:bg-accent/50"
                    }`}
                  >
                    <item.icon size={iconSize} />
                    {!sidebarCollapsed && <span>{item.title}</span>}
                  </Link>
                ))}
              </nav>
            </div>
          </div>

          {/* Sidebar footer */}
          <div className="border-t p-4">
            <Button
              variant="outline"
              className={`w-full ${sidebarCollapsed ? "justify-center" : "justify-start"}`}
              onClick={handleSignOut}
            >
              <LogOut className={`h-4 w-4 ${sidebarCollapsed ? "" : "mr-2"}`} />
              {!sidebarCollapsed && <span>Logout</span>}
            </Button>
          </div>
        </div>
      )}

      {/* Mobile Top Navigation - Only shown on mobile */}
      {isMobile && (
        <div className="fixed top-0 left-0 right-0 z-40 h-14 border-b bg-background px-4">
          <div className="flex h-full items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-semibold">2day Garden</span>
            </div>
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[80%] max-w-[300px] p-0">
                  <SheetHeader className="p-4 border-b">
                    <SheetTitle>2day Garden</SheetTitle>
                  </SheetHeader>
                  <div className="flex flex-col py-2">
                    {navigationItems.map((item) => (
                      <Link
                        key={item.title}
                        to={item.path}
                        onClick={() => setIsMenuOpen(false)}
                        className={`flex items-center gap-3 px-4 py-3 hover:bg-accent ${
                          isActive(item.path) ? 'bg-accent text-accent-foreground' : 'text-foreground'
                        }`}
                      >
                        <item.icon className="h-5 w-5" />
                        <span>{item.title}</span>
                      </Link>
                    ))}
                    <button
                      onClick={handleSignOut}
                      className="flex items-center gap-3 px-4 py-3 text-foreground hover:bg-accent mt-auto"
                    >
                      <LogOut className="h-5 w-5" />
                      <span>Log Out</span>
                    </button>
                  </div>
                </SheetContent>
            </Sheet>
          </div>
        </div>
      )}

      {/* Main content */}
      <div 
        className={`flex-1 transition-all ${
          !isMobile ? (sidebarCollapsed ? "ml-[60px]" : "ml-[250px]") : "mt-14"
        }`}
      >
        {children}
      </div>
    </div>
  );
};

export default DashboardLayout;
