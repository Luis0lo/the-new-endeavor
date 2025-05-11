import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import DashboardLayout from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  User, Settings, Home, Lock, 
  CreditCard, Bell, UserCircle, 
  MapPin, Mail, LogOut,
  Moon, Sun, Calendar, Archive,
  Flower2, LayoutGrid, Sprout
} from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { useTheme } from '@/hooks/use-theme';
import { useDefaultLandingPage } from '@/hooks/use-default-landing-page';
import { DefaultLandingPage } from '@/hooks/auth/types';
import { useDefaultCalendarView, DefaultCalendarView } from '@/hooks/use-default-calendar-view';

// Keep profile as the active tab and add preferences tab
type SettingsTab = 'profile' | 'preferences';

interface NavigationItem {
  title: string;
  path: DefaultLandingPage;
  icon: React.ElementType;
}

const AccountSettings = () => {
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const { theme, setTheme } = useTheme();
  const { defaultLandingPage, setDefaultLandingPage } = useDefaultLandingPage();
  const { defaultCalendarView, setDefaultCalendarView } = useDefaultCalendarView();
  
  // Navigation items to display in the dropdown
  const navigationItems: NavigationItem[] = [
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
    {
      title: 'Garden Layout',
      icon: LayoutGrid,
      path: '/dashboard/garden-layout'
    },
    {
      title: 'Companion Plants',
      icon: Flower2,
      path: '/dashboard/companions'
    }
  ];
  
  // Real user data from Supabase
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    bio: '',
    avatar: '',
  });
  
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        
        // Get the current user
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          throw new Error('User not found');
        }
        
        // Get the user's profile data
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
          
        if (error) throw error;
        
        setUserData({
          name: profile?.username || user.user_metadata?.full_name || '',
          email: user.email || '',
          bio: profile?.bio || '',
          avatar: profile?.avatar_url || 'https://api.dicebear.com/7.x/avataaars/svg?seed=User',
        });
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message || "Failed to load user data",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, []);
  
  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account"
      });
      navigate('/');
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to log out",
        variant: "destructive"
      });
    }
  };
  
  const handleSaveProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not found');
      }
      
      // Update the profile in Supabase
      const { error } = await supabase
        .from('profiles')
        .update({
          username: userData.name,
          bio: userData.bio,
        })
        .eq('id', user.id);
        
      if (error) throw error;
      
      toast({
        title: "Profile updated",
        description: "Your profile information has been saved"
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update profile",
        variant: "destructive"
      });
    }
  };
  
  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your personal details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {loading ? (
                <div className="flex items-center justify-center p-8">
                  <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
                </div>
              ) : (
                <>
                  <div className="flex items-center space-x-4">
                    <div className="w-20 h-20 rounded-full bg-gray-200 overflow-hidden">
                      <img 
                        src={userData.avatar} 
                        alt="Profile" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <Button variant="outline">Change Avatar</Button>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input 
                        id="name" 
                        value={userData.name}
                        onChange={(e) => setUserData({...userData, name: e.target.value})}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        value={userData.email}
                        disabled
                        className="bg-muted"
                      />
                      <p className="text-xs text-muted-foreground">Email address cannot be changed</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea 
                      id="bio" 
                      placeholder="Tell us about yourself"
                      value={userData.bio}
                      onChange={(e) => setUserData({...userData, bio: e.target.value})}
                      className="min-h-[100px]"
                    />
                  </div>
                </>
              )}
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveProfile} disabled={loading}>Save Changes</Button>
            </CardFooter>
          </Card>
        );
      case 'preferences':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Preferences</CardTitle>
              <CardDescription>Customize your application experience</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Appearance</h3>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="dark-mode">Dark Mode</Label>
                    <p className="text-sm text-muted-foreground">
                      Switch between light and dark theme
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="dark-mode"
                      checked={theme === 'dark'} 
                      onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
                    />
                    {theme === 'dark' ? 
                      <Moon size={20} className="text-muted-foreground" /> : 
                      <Sun size={20} className="text-muted-foreground" />
                    }
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Navigation</h3>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="default-page">Default Landing Page</Label>
                    <p className="text-sm text-muted-foreground">
                      Choose which page to load after login
                    </p>
                  </div>
                  <div className="w-[200px]">
                    <Select 
                      value={defaultLandingPage} 
                      onValueChange={(value) => setDefaultLandingPage(value as DefaultLandingPage)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a page" />
                      </SelectTrigger>
                      <SelectContent>
                        {navigationItems.map((item) => (
                          <SelectItem key={item.path} value={item.path}>
                            <div className="flex items-center">
                              <item.icon className="mr-2 h-4 w-4 text-muted-foreground" />
                              <span>{item.title}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="default-calendar-view">Default Calendar View</Label>
                    <p className="text-sm text-muted-foreground">
                      Choose the default view for your garden calendar
                    </p>
                  </div>
                  <div className="w-[200px]">
                    <Select 
                      value={defaultCalendarView} 
                      onValueChange={(value) => setDefaultCalendarView(value as DefaultCalendarView)}
                    >
                      <SelectTrigger id="default-calendar-view">
                        <SelectValue placeholder="Select a view" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="day">
                          <div className="flex items-center">
                            <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                            <span>Day</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="week">
                          <div className="flex items-center">
                            <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                            <span>Week</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="month">
                          <div className="flex items-center">
                            <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                            <span>Month</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      default:
        return null;
    }
  };
  
  
  return (
    <DashboardLayout>
      <div className="container mx-auto py-6 max-w-6xl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Account Settings</h1>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
        
        <div className="grid grid-cols-12 gap-6">
          {/* Sidebar */}
          <div className="col-span-12 md:col-span-3">
            <Card>
              <CardContent className="p-0">
                <div className="flex flex-col">
                  <button
                    className={`flex items-center space-x-2 p-3 ${
                      activeTab === 'profile' 
                        ? 'bg-primary/10 text-primary border-l-4 border-primary' 
                        : 'hover:bg-muted'
                    }`}
                    onClick={() => setActiveTab('profile')}
                  >
                    <UserCircle className="h-5 w-5" />
                    <span>Profile</span>
                  </button>
                  
                  <button
                    className={`flex items-center space-x-2 p-3 ${
                      activeTab === 'preferences' 
                        ? 'bg-primary/10 text-primary border-l-4 border-primary' 
                        : 'hover:bg-muted'
                    }`}
                    onClick={() => setActiveTab('preferences')}
                  >
                    <Settings className="h-5 w-5" />
                    <span>Preferences</span>
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Main content */}
          <div className="col-span-12 md:col-span-9">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AccountSettings;
