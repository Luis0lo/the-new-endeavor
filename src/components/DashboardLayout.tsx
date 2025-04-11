
import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  Calendar, 
  Flower2, 
  Book, 
  Settings, 
  LogOut,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { User } from '@supabase/supabase-js';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar
} from '@/components/ui/sidebar';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

// Create a separate component for the actual sidebar content
const DashboardSidebar = () => {
  const [user, setUser] = React.useState<User | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = useSidebar();
  
  React.useEffect(() => {
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

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b p-2">
        <Link to="/" className="flex items-center gap-2 px-2">
          <Flower2 className="h-6 w-6 text-primary" />
          <span className="text-lg font-semibold">Garden App</span>
        </Link>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  isActive={isActive('/dashboard')}
                  tooltip="Dashboard"
                  asChild
                >
                  <Link to="/dashboard">
                    <LayoutDashboard className="h-5 w-5" />
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  isActive={isActive('/dashboard/calendar')}
                  tooltip="Calendar"
                  asChild
                >
                  <Link to="/dashboard/calendar">
                    <Calendar className="h-5 w-5" />
                    <span>Calendar</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  isActive={isActive('/dashboard/plants')}
                  tooltip="My Plants"
                  asChild
                >
                  <Link to="/dashboard/plants">
                    <Flower2 className="h-5 w-5" />
                    <span>My Plants</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        <SidebarGroup>
          <SidebarGroupLabel>Other</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  isActive={isActive('/blog')}
                  tooltip="Blog"
                  asChild
                >
                  <Link to="/blog">
                    <Book className="h-5 w-5" />
                    <span>Blog</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  isActive={isActive('/dashboard/settings')}
                  tooltip="Settings"
                  asChild
                >
                  <Link to="/dashboard/settings">
                    <Settings className="h-5 w-5" />
                    <span>Settings</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="border-t p-2">
        <Button
          variant="outline"
          className="w-full justify-start"
          onClick={handleSignOut}
        >
          <LogOut className="mr-2 h-5 w-5" />
          <span>Sign Out</span>
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
};

// Sidebar collapse toggle button
const SidebarCollapseButton = () => {
  const { toggleSidebar, state } = useSidebar();
  
  return (
    <Button
      variant="outline"
      size="icon"
      className="fixed bottom-4 left-4 z-50 md:static md:bottom-auto md:left-auto"
      onClick={toggleSidebar}
    >
      {state === 'collapsed' ? (
        <ChevronRight className="h-4 w-4" />
      ) : (
        <ChevronLeft className="h-4 w-4" />
      )}
    </Button>
  );
};

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <DashboardSidebar />
        <div className="flex-1 flex flex-col">
          <div className="flex-1">
            <div className="container p-4">
              {children}
            </div>
          </div>
        </div>
        <SidebarCollapseButton />
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
