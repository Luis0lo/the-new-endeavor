
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import DashboardLayout from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { 
  User, Settings, Home, Lock, 
  CreditCard, Bell, UserCircle, 
  MapPin, Mail, LogOut
} from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';

type SettingsTab = 'profile' | 'address' | 'notifications' | 'password' | 'billing';

const AccountSettings = () => {
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');
  const navigate = useNavigate();
  
  // Dummy user data - in a real app, fetch this from Supabase
  const [userData, setUserData] = useState({
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    bio: 'Passionate gardener with 5 years of experience growing organic vegetables.',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane',
    phone: '(555) 123-4567',
    address: {
      street: '123 Garden Lane',
      city: 'Bloomfield',
      state: 'CA',
      zipCode: '94111',
      country: 'United States'
    },
    notifications: {
      emailUpdates: true,
      activityReminders: true,
      marketingEmails: false,
      gardeningTips: true
    }
  });
  
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
  
  const handleSaveProfile = () => {
    // In a real app, save to Supabase here
    toast({
      title: "Profile updated",
      description: "Your profile information has been saved"
    });
  };
  
  const handleSaveAddress = () => {
    // In a real app, save to Supabase here
    toast({
      title: "Address updated",
      description: "Your address information has been saved"
    });
  };
  
  const handleSaveNotifications = () => {
    // In a real app, save to Supabase here
    toast({
      title: "Notification preferences updated",
      description: "Your notification settings have been saved"
    });
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
              
              <div className="grid grid-cols-2 gap-4">
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
                    onChange={(e) => setUserData({...userData, email: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input 
                    id="phone" 
                    type="tel" 
                    value={userData.phone}
                    onChange={(e) => setUserData({...userData, phone: e.target.value})}
                  />
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
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveProfile}>Save Changes</Button>
            </CardFooter>
          </Card>
        );
        
      case 'address':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Address Information</CardTitle>
              <CardDescription>Update your location details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="street">Street Address</Label>
                <Input 
                  id="street" 
                  value={userData.address.street}
                  onChange={(e) => setUserData({
                    ...userData, 
                    address: {...userData.address, street: e.target.value}
                  })}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input 
                    id="city" 
                    value={userData.address.city}
                    onChange={(e) => setUserData({
                      ...userData, 
                      address: {...userData.address, city: e.target.value}
                    })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="state">State/Province</Label>
                  <Input 
                    id="state" 
                    value={userData.address.state}
                    onChange={(e) => setUserData({
                      ...userData, 
                      address: {...userData.address, state: e.target.value}
                    })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="zipCode">Zip/Postal Code</Label>
                  <Input 
                    id="zipCode" 
                    value={userData.address.zipCode}
                    onChange={(e) => setUserData({
                      ...userData, 
                      address: {...userData.address, zipCode: e.target.value}
                    })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Input 
                    id="country" 
                    value={userData.address.country}
                    onChange={(e) => setUserData({
                      ...userData, 
                      address: {...userData.address, country: e.target.value}
                    })}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveAddress}>Save Address</Button>
            </CardFooter>
          </Card>
        );
        
      case 'notifications':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Manage how we contact you</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium">Email Updates</h3>
                  <p className="text-xs text-muted-foreground">Receive updates about your garden activities</p>
                </div>
                <div className="ml-auto">
                  <input 
                    type="checkbox" 
                    checked={userData.notifications.emailUpdates}
                    onChange={(e) => setUserData({
                      ...userData,
                      notifications: {
                        ...userData.notifications,
                        emailUpdates: e.target.checked
                      }
                    })}
                    className="rounded border-gray-300 text-primary focus:ring-primary"
                  />
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium">Activity Reminders</h3>
                  <p className="text-xs text-muted-foreground">Get reminders about upcoming garden activities</p>
                </div>
                <div className="ml-auto">
                  <input 
                    type="checkbox" 
                    checked={userData.notifications.activityReminders}
                    onChange={(e) => setUserData({
                      ...userData,
                      notifications: {
                        ...userData.notifications,
                        activityReminders: e.target.checked
                      }
                    })}
                    className="rounded border-gray-300 text-primary focus:ring-primary"
                  />
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium">Marketing Emails</h3>
                  <p className="text-xs text-muted-foreground">Receive promotional emails about products and services</p>
                </div>
                <div className="ml-auto">
                  <input 
                    type="checkbox" 
                    checked={userData.notifications.marketingEmails}
                    onChange={(e) => setUserData({
                      ...userData,
                      notifications: {
                        ...userData.notifications,
                        marketingEmails: e.target.checked
                      }
                    })}
                    className="rounded border-gray-300 text-primary focus:ring-primary"
                  />
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium">Gardening Tips</h3>
                  <p className="text-xs text-muted-foreground">Receive seasonal gardening advice</p>
                </div>
                <div className="ml-auto">
                  <input 
                    type="checkbox" 
                    checked={userData.notifications.gardeningTips}
                    onChange={(e) => setUserData({
                      ...userData,
                      notifications: {
                        ...userData.notifications,
                        gardeningTips: e.target.checked
                      }
                    })}
                    className="rounded border-gray-300 text-primary focus:ring-primary"
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveNotifications}>Save Preferences</Button>
            </CardFooter>
          </Card>
        );
        
      case 'password':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Password & Security</CardTitle>
              <CardDescription>Update your security settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Current Password</Label>
                <Input id="current-password" type="password" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input id="new-password" type="password" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                <Input id="confirm-password" type="password" />
              </div>
              
              <div className="pt-4">
                <h3 className="text-sm font-medium mb-2">Two-Factor Authentication</h3>
                <Button variant="outline">Enable 2FA</Button>
              </div>
            </CardContent>
            <CardFooter>
              <Button>Update Password</Button>
            </CardFooter>
          </Card>
        );
        
      case 'billing':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Billing Information</CardTitle>
              <CardDescription>Manage your payment details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-6 text-center">
                <CreditCard className="h-12 w-12 mx-auto text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium">No Payment Methods</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  You haven't added any payment methods yet.
                </p>
                <Button className="mt-4">Add Payment Method</Button>
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
                      activeTab === 'address' 
                        ? 'bg-primary/10 text-primary border-l-4 border-primary' 
                        : 'hover:bg-muted'
                    }`}
                    onClick={() => setActiveTab('address')}
                  >
                    <MapPin className="h-5 w-5" />
                    <span>Address</span>
                  </button>
                  
                  <button
                    className={`flex items-center space-x-2 p-3 ${
                      activeTab === 'notifications' 
                        ? 'bg-primary/10 text-primary border-l-4 border-primary' 
                        : 'hover:bg-muted'
                    }`}
                    onClick={() => setActiveTab('notifications')}
                  >
                    <Bell className="h-5 w-5" />
                    <span>Notifications</span>
                  </button>
                  
                  <button
                    className={`flex items-center space-x-2 p-3 ${
                      activeTab === 'password' 
                        ? 'bg-primary/10 text-primary border-l-4 border-primary' 
                        : 'hover:bg-muted'
                    }`}
                    onClick={() => setActiveTab('password')}
                  >
                    <Lock className="h-5 w-5" />
                    <span>Password & Security</span>
                  </button>
                  
                  <button
                    className={`flex items-center space-x-2 p-3 ${
                      activeTab === 'billing' 
                        ? 'bg-primary/10 text-primary border-l-4 border-primary' 
                        : 'hover:bg-muted'
                    }`}
                    onClick={() => setActiveTab('billing')}
                  >
                    <CreditCard className="h-5 w-5" />
                    <span>Billing</span>
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
