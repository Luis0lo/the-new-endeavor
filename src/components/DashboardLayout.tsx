
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  Calendar, 
  Flower2, 
  Book, 
  Settings, 
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { User } from '@supabase/supabase-js';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

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

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      {/* Mobile sidebar toggle */}
      <div className="md:hidden sticky top-0 z-30 flex h-16 items-center gap-x-4 border-b bg-background px-4">
        <button
          type="button"
          className="text-gray-700 focus:outline-none"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-xl font-semibold">Garden Dashboard</h1>
        </div>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-background border-r transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:inset-auto md:h-screen ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 shrink-0 items-center border-b px-6">
          <Link to="/" className="flex items-center gap-2">
            <Flower2 className="h-6 w-6 text-primary" />
            <span className="font-semibold">Garden App</span>
          </Link>
        </div>
        <div className="space-y-4 py-4">
          <div className="px-3 py-2">
            <h2 className="mb-2 px-4 text-xs font-semibold uppercase tracking-wider">
              Main
            </h2>
            <div className="space-y-1">
              <Link
                to="/dashboard"
                className="flex items-center rounded-md px-4 py-2 hover:bg-accent hover:text-accent-foreground"
                onClick={() => setSidebarOpen(false)}
              >
                <LayoutDashboard className="mr-2 h-5 w-5" />
                Dashboard
              </Link>
              <Link
                to="/dashboard/calendar"
                className="flex items-center rounded-md px-4 py-2 hover:bg-accent hover:text-accent-foreground"
                onClick={() => setSidebarOpen(false)}
              >
                <Calendar className="mr-2 h-5 w-5" />
                Calendar
              </Link>
              <Link
                to="/dashboard/plants"
                className="flex items-center rounded-md px-4 py-2 hover:bg-accent hover:text-accent-foreground"
                onClick={() => setSidebarOpen(false)}
              >
                <Flower2 className="mr-2 h-5 w-5" />
                My Plants
              </Link>
            </div>
          </div>
          <div className="px-3 py-2">
            <h2 className="mb-2 px-4 text-xs font-semibold uppercase tracking-wider">
              Other
            </h2>
            <div className="space-y-1">
              <Link
                to="/blog"
                className="flex items-center rounded-md px-4 py-2 hover:bg-accent hover:text-accent-foreground"
                onClick={() => setSidebarOpen(false)}
              >
                <Book className="mr-2 h-5 w-5" />
                Blog
              </Link>
              <Link
                to="/dashboard/settings"
                className="flex items-center rounded-md px-4 py-2 hover:bg-accent hover:text-accent-foreground"
                onClick={() => setSidebarOpen(false)}
              >
                <Settings className="mr-2 h-5 w-5" />
                Settings
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute bottom-4 left-0 right-0 px-3">
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={handleSignOut}
          >
            <LogOut className="mr-2 h-5 w-5" />
            Sign Out
          </Button>
        </div>
      </div>

      {/* Main content */}
      <main className="flex-1">{children}</main>
    </div>
  );
};

export default DashboardLayout;
