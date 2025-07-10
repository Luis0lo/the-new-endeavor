
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import Footer from '@/components/Footer';
import { User } from '@supabase/supabase-js';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/components/ui/theme-provider';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();

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

  const navLinks = [
    { name: 'Home', href: '/', path: '/' },
    { name: 'Greenlink', href: '/greenlink', path: '/greenlink' },
    { name: 'Dashboard', href: '/dashboard', path: '/dashboard' },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <div className="mr-4 hidden md:flex">
            <Link to="/" className="mr-6 flex items-center space-x-2">
              <img src="/lovable-uploads/cd6396a1-0ff4-4b6f-80a6-c4bb67137f91.png" alt="2day garden" className="h-6 w-6" />
              <span className="text-xl font-bold">2day garden</span>
            </Link>
            <nav className="flex items-center space-x-6 text-sm font-medium">
              {navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  to={link.href} 
                  className={`transition-colors hover:text-foreground/80 px-2 py-1 rounded-md ${
                    location.pathname === link.path 
                      ? 'bg-primary/10 text-primary font-semibold' 
                      : ''
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
            <div className="w-full flex-1 md:w-auto md:flex-none">
              <button
                className="inline-flex items-center justify-center md:hidden"
                onClick={() => setMenuOpen(!menuOpen)}
              >
                {menuOpen ? "✕" : "☰"}
              </button>
            </div>
            <nav className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>
              
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">Account</Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link to="/dashboard">Dashboard</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleSignOut}>
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link to="/auth">
                  <Button size="sm">Sign In</Button>
                </Link>
              )}
            </nav>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="container md:hidden">
            <nav className="flex flex-col space-y-3 pb-3 text-sm font-medium">
              {navLinks.map((link) => (
                <Link 
                  key={link.name}
                  to={link.href} 
                  className={`transition-colors hover:text-foreground/80 px-2 py-1 rounded-md ${
                    location.pathname === link.path 
                      ? 'bg-primary/10 text-primary font-semibold' 
                      : ''
                  }`}
                  onClick={() => setMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              {user && (
                <Link to="/dashboard" className="transition-colors hover:text-foreground/80" onClick={() => setMenuOpen(false)}>
                  Dashboard
                </Link>
              )}
              <Link to="/cookie-policy" className="transition-colors hover:text-foreground/80" onClick={() => setMenuOpen(false)}>
                Cookie Policy
              </Link>
            </nav>
          </div>
        )}
      </header>

      {/* Main content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default MainLayout;
