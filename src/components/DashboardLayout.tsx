import React, { useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  ChevronLeft,
  Menu,
  Calendar,
  Settings,
  Archive,
  LayoutDashboard,
  Leaf
} from "lucide-react";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useUser } from '@/hooks/use-user';
import { supabase } from '@/integrations/supabase/client';

interface NavItem {
  title: string;
  href: string;
  icon: React.ReactNode;
}

const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isLoading } = useUser();
  
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  
  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const items: NavItem[] = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      title: "Calendar",
      href: "/dashboard/calendar",
      icon: <Calendar className="h-5 w-5" />,
    },
    {
      title: "Inventory",
      href: "/dashboard/inventory",
      icon: <Archive className="h-5 w-5" />,
    },
    {
      title: "Companion Plants",
      href: "/dashboard/companions",
      icon: <Leaf className="h-5 w-5" />,
    },
    {
      title: "Settings",
      href: "/dashboard/settings",
      icon: <Settings className="h-5 w-5" />,
    },
  ];

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate('/auth');
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      {/* Mobile Sidebar */}
      <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
        <SheetTrigger asChild>
          <button
            onClick={toggleSidebar}
            className="p-2 text-gray-500 hover:bg-gray-200 rounded-md focus:outline-none focus:bg-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 md:hidden"
          >
            <Menu className="h-6 w-6" />
          </button>
        </SheetTrigger>
        <SheetContent className="w-64 flex flex-col gap-4 p-4 z-50">
          <SheetHeader className="text-left">
            <SheetTitle>Menu</SheetTitle>
            <SheetDescription>
              Navigate your dashboard.
            </SheetDescription>
          </SheetHeader>
          {items.map((item) => (
            <Link
              key={item.title}
              to={item.href}
              className={`flex items-center px-2 py-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 ${location.pathname === item.href ? 'bg-gray-200 dark:bg-gray-700' : ''}`}
              onClick={closeSidebar}
            >
              {item.icon}
              <span className="ml-2">{item.title}</span>
            </Link>
          ))}
          <button onClick={signOut} className="mt-auto py-2 px-4 bg-red-500 text-white rounded hover:bg-red-700">
            Sign Out
          </button>
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <div className="hidden md:flex flex-col w-64 bg-gray-50 dark:bg-gray-800 border-r dark:border-gray-700">
        <div className="flex items-center justify-between h-16 px-4 border-b dark:border-gray-700">
          <Link to="/dashboard" className="text-lg font-semibold text-gray-800 dark:text-gray-100">
            My Garden
          </Link>
        </div>
        <nav className="flex-1 p-4">
          {items.map((item) => (
            <Link
              key={item.title}
              to={item.href}
              className={`flex items-center px-2 py-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 ${location.pathname === item.href ? 'bg-gray-200 dark:bg-gray-700' : ''}`}
            >
              {item.icon}
              <span className="ml-2">{item.title}</span>
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t dark:border-gray-700">
          {isLoading ? (
            <div>Loading...</div>
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="w-full flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <Avatar>
                      <AvatarImage src={user.user_metadata?.avatar_url} alt={user.user_metadata?.full_name || "Avatar"} />
                      <AvatarFallback>{user.user_metadata?.full_name?.slice(0, 2).toUpperCase() || "UN"}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">{user.user_metadata?.full_name || "Unknown User"}</span>
                  </div>
                  <ChevronLeft className="h-4 w-4 rotate-180" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/dashboard/settings')}>Settings</DropdownMenuItem>
                <DropdownMenuItem onClick={signOut}>Sign out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link to="/auth" className="block py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-700">
              Sign In
            </Link>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-x-hidden">
        <main className="py-4">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
