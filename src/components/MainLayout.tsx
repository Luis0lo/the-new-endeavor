import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import Footer from '@/components/Footer';
import { User } from '@supabase/supabase-js';
import { Moon, Sun, Menu } from 'lucide-react';
import { useTheme } from '@/hooks/use-theme';
import { useIsMobile } from '@/hooks/use-mobile';
import { BottomNav } from './BottomNav';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const isMobile = useIsMobile();
  const location = useLocation();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  // Helper function to get the current page name from the path
  const getPageName = () => {
    const path = location.pathname;
    if (path === '/') return 'Home';
    return path.charAt(1).toUpperCase() + path.slice(2);
  };

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header/Navbar */}
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          {isMobile ? (
            <>
              <Link to="/" className="mr-6 flex items-center space-x-2">
                <span className="text-xl font-bold">2day garden</span>
              </Link>
              <div className="flex-1 text-center">
                <span className="text-sm font-medium">{getPageName()}</span>
              </div>
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <nav className="flex flex-col space-y-4">
                    <Link to="/" className="text-lg">Home</Link>
                    <Link to="/blog" className="text-lg">Blog</Link>
                    {user && <Link to="/dashboard" className="text-lg">Dashboard</Link>}
                    <Link to="/cookie-policy" className="text-lg">Cookie Policy</Link>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                      className="justify-start px-0"
                    >
                      {theme === 'dark' ? (
                        <>
                          <Sun className="h-5 w-5" />
                          <span className="ml-2">Light Mode</span>
                        </>
                      ) : (
                        <>
                          <Moon className="h-5 w-5" />
                          <span className="ml-2">Dark Mode</span>
                        </>
                      )}
                    </Button>
                    {user ? (
                      <Button variant="ghost" onClick={handleSignOut} className="justify-start px-0">
                        Sign Out
                      </Button>
                    ) : (
                      <Link to="/auth" className="text-lg">Sign In</Link>
                    )}
                  </nav>
                </SheetContent>
              </Sheet>
            </>
          ) : (
            <div className="mr-4 hidden md:flex">
              <Link to="/" className="mr-6 flex items-center space-x-2">
                <span className="text-xl font-bold">2day garden</span>
              </Link>
              <nav className="flex items-center space-x-6 text-sm font-medium">
                <Link to="/" className="transition-colors hover:text-foreground/80">Home</Link>
                <Link to="/blog" className="transition-colors hover:text-foreground/80">Blog</Link>
                {user && <Link to="/dashboard" className="transition-colors hover:text-foreground/80">Dashboard</Link>}
                <Link to="/cookie-policy" className="transition-colors hover:text-foreground/80">Cookie Policy</Link>
              </nav>
            </div>

          )}
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 pb-16 md:pb-0">
        {children}
      </main>

      {/* Bottom Navigation for Mobile */}
      <BottomNav />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default MainLayout;
