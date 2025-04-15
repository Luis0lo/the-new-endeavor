
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { 
  Home, 
  Calendar, 
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Menu,
  Archive,
  BookOpen,
  Flower2 // Using Flower2 icon instead of Plant (which doesn't exist)
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { User } from '@supabase/supabase-js';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
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

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  // Determine icon size based on sidebar state
  const iconSize = sidebarCollapsed ? 35 : 18;

  return (
    <TooltipProvider delayDuration={300}>
      <div className="flex min-h-screen w-full bg-background">
        {/* Sidebar */}
        <div 
          className={`fixed inset-y-0 left-0 z-50 flex flex-col border-r border-border bg-card transition-all duration-300 ${
            sidebarCollapsed ? "w-[60px]" : "w-[250px]"
          }`}
        >
          {/* Sidebar header */}
          <div className="flex h-16 items-center border-b px-4">
            <Link 
              to="/" 
              className={`flex items-center ${sidebarCollapsed ? "justify-center" : "gap-2"}`}
            >
              <span className="text-primary text-xl font-bold">
                {sidebarCollapsed ? "GA" : "Garden App"}
              </span>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              className="ml-auto"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            >
              {sidebarCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            </Button>
          </div>

          {/* Navigation */}
          <div className="flex-1 overflow-auto py-4">
            <div className="mb-4 px-4">
              {!sidebarCollapsed && <div className="text-xs font-semibold text-muted-foreground mb-2">Navigation</div>}
              <nav className="flex flex-col gap-1">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      to="/dashboard"
                      className={`flex items-center ${sidebarCollapsed ? "justify-center" : "gap-2"} rounded-md px-3 py-2 ${
                        isActive("/dashboard") && !isActive("/dashboard/calendar") && !isActive("/dashboard/settings") && !isActive("/dashboard/inventory") && !isActive("/dashboard/companions")
                          ? "bg-accent text-accent-foreground"
                          : "text-muted-foreground hover:bg-accent/50"
                      }`}
                    >
                      <Home size={iconSize} />
                      {!sidebarCollapsed && <span>Dashboard</span>}
                    </Link>
                  </TooltipTrigger>
                  {sidebarCollapsed && <TooltipContent side="right">Home</TooltipContent>}
                </Tooltip>
                
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      to="/dashboard/calendar"
                      className={`flex items-center ${sidebarCollapsed ? "justify-center" : "gap-2"} rounded-md px-3 py-2 ${
                        isActive("/dashboard/calendar")
                          ? "bg-accent text-accent-foreground"
                          : "text-muted-foreground hover:bg-accent/50"
                      }`}
                    >
                      <Calendar size={iconSize} />
                      {!sidebarCollapsed && <span>Calendar</span>}
                    </Link>
                  </TooltipTrigger>
                  {sidebarCollapsed && <TooltipContent side="right">Calendar</TooltipContent>}
                </Tooltip>
                
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      to="/dashboard/inventory"
                      className={`flex items-center ${sidebarCollapsed ? "justify-center" : "gap-2"} rounded-md px-3 py-2 ${
                        isActive("/dashboard/inventory")
                          ? "bg-accent text-accent-foreground"
                          : "text-muted-foreground hover:bg-accent/50"
                      }`}
                    >
                      <Archive size={iconSize} />
                      {!sidebarCollapsed && <span>Inventory</span>}
                    </Link>
                  </TooltipTrigger>
                  {sidebarCollapsed && <TooltipContent side="right">Inventory</TooltipContent>}
                </Tooltip>
                
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      to="/dashboard/companions"
                      className={`flex items-center ${sidebarCollapsed ? "justify-center" : "gap-2"} rounded-md px-3 py-2 ${
                        isActive("/dashboard/companions")
                          ? "bg-accent text-accent-foreground"
                          : "text-muted-foreground hover:bg-accent/50"
                      }`}
                    >
                      <Flower2 size={iconSize} />
                      {!sidebarCollapsed && <span>Companion Plants</span>}
                    </Link>
                  </TooltipTrigger>
                  {sidebarCollapsed && <TooltipContent side="right">Companion Plants</TooltipContent>}
                </Tooltip>
                
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      to="/blog"
                      className={`flex items-center ${sidebarCollapsed ? "justify-center" : "gap-2"} rounded-md px-3 py-2 ${
                        isActive("/blog")
                          ? "bg-accent text-accent-foreground"
                          : "text-muted-foreground hover:bg-accent/50"
                      }`}
                    >
                      <BookOpen size={iconSize} />
                      {!sidebarCollapsed && <span>Garden Resources</span>}
                    </Link>
                  </TooltipTrigger>
                  {sidebarCollapsed && <TooltipContent side="right">Garden Resources</TooltipContent>}
                </Tooltip>
                
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      to="/dashboard/settings"
                      className={`flex items-center ${sidebarCollapsed ? "justify-center" : "gap-2"} rounded-md px-3 py-2 ${
                        isActive("/dashboard/settings")
                          ? "bg-accent text-accent-foreground"
                          : "text-muted-foreground hover:bg-accent/50"
                      }`}
                    >
                      <Settings size={iconSize} />
                      {!sidebarCollapsed && <span>Account Settings</span>}
                    </Link>
                  </TooltipTrigger>
                  {sidebarCollapsed && <TooltipContent side="right">Account Settings</TooltipContent>}
                </Tooltip>
              </nav>
            </div>
          </div>

          {/* Sidebar footer */}
          <div className="border-t p-4">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  className={`w-full ${sidebarCollapsed ? "justify-center" : "justify-start"}`}
                  onClick={handleSignOut}
                >
                  <LogOut className={`h-4 w-4 ${sidebarCollapsed ? "" : "mr-2"}`} />
                  {!sidebarCollapsed && <span>Logout</span>}
                </Button>
              </TooltipTrigger>
              {sidebarCollapsed && <TooltipContent side="right">Logout</TooltipContent>}
            </Tooltip>
          </div>
        </div>

        {/* Main content */}
        <div 
          className={`flex-1 transition-all ${
            sidebarCollapsed ? "ml-[60px]" : "ml-[250px]"
          }`}
        >
          {children}
        </div>
      </div>
    </TooltipProvider>
  );
};

export default DashboardLayout;
