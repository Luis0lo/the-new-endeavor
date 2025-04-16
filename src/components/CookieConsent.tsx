
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';  // Add this import
import { X, Check, Settings, Cookie } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';

interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  preferences: boolean;
}

const CookieConsent = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [hasUserChoices, setHasUserChoices] = useState(false);
  const { toast } = useToast();
  
  const [cookiePreferences, setCookiePreferences] = useState<CookiePreferences>({
    necessary: true, // Always true, can't be changed
    analytics: false,
    marketing: false,
    preferences: false,
  });

  useEffect(() => {
    // Check if user has already made a choice
    const consentStatus = localStorage.getItem('cookieConsent');
    
    if (!consentStatus) {
      // If no preference stored, show the banner
      setShowBanner(true);
      setHasUserChoices(false);
    } else {
      // Otherwise, apply the stored preferences
      const savedPreferences = JSON.parse(consentStatus);
      setCookiePreferences(savedPreferences);
      setHasUserChoices(true);
    }
  }, []);

  const savePreferences = (prefs: CookiePreferences) => {
    localStorage.setItem('cookieConsent', JSON.stringify(prefs));
    setCookiePreferences(prefs);
    setShowBanner(false);
    setShowSettings(false);
    setHasUserChoices(true);
    
    toast({
      title: "Cookie preferences saved",
      description: "Your cookie preferences have been updated.",
    });
    
    // Here you would also apply the cookie settings
    // e.g., enable/disable analytics based on prefs.analytics
  };

  const acceptAll = () => {
    const allAccepted = {
      necessary: true,
      analytics: true,
      marketing: true,
      preferences: true,
    };
    savePreferences(allAccepted);
  };

  const rejectAll = () => {
    const allRejected = {
      necessary: true, // Necessary cookies are always enabled
      analytics: false,
      marketing: false,
      preferences: false,
    };
    savePreferences(allRejected);
  };

  if (!showBanner && !showSettings) {
    // Only show the settings button if the user has previously made choices
    return hasUserChoices ? (
      <Button 
        onClick={() => setShowSettings(true)}
        variant="outline" 
        size="sm"
        className="fixed bottom-4 left-4 z-50 flex items-center gap-2 text-xs"
      >
        <Cookie size={16} />
        Cookie Settings
      </Button>
    ) : null;
  }

  return (
    <>
      {showBanner && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t p-4 shadow-lg">
          <div className="container mx-auto">
            <div className="flex flex-col space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <Cookie className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold">Cookie Consent</h3>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => rejectAll()}
                  aria-label="Close cookie banner"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              <p className="text-sm text-muted-foreground">
                We use cookies to enhance your browsing experience, serve personalized ads or content, and analyze our traffic. By clicking "Accept All", you consent to our use of cookies. Visit our <Link to="/cookie-policy" className="text-primary hover:underline">Cookie Policy</Link> for more information.
              </p>
              
              <div className="flex flex-wrap gap-2 justify-end sm:justify-between">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setShowSettings(true)}
                  className="flex items-center gap-1"
                >
                  <Settings className="h-4 w-4" />
                  <span>Cookie Settings</span>
                </Button>
                
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => rejectAll()}
                  >
                    Reject All
                  </Button>
                  <Button 
                    variant="default" 
                    size="sm" 
                    onClick={() => acceptAll()}
                    className="flex items-center gap-1"
                  >
                    <Check className="h-4 w-4" />
                    <span>Accept All</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Cookie Settings</DialogTitle>
            <DialogDescription>
              Manage your cookie preferences. Necessary cookies help make a website usable by enabling basic functions.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            <div className="flex items-start space-x-4 justify-between">
              <div>
                <p className="font-medium">Necessary Cookies</p>
                <p className="text-sm text-muted-foreground">
                  These cookies are required for the website to function and cannot be disabled.
                </p>
              </div>
              <Checkbox 
                id="necessary" 
                checked={cookiePreferences.necessary} 
                disabled 
              />
            </div>
            
            <Separator />
            
            <div className="flex items-start space-x-4 justify-between">
              <div>
                <p className="font-medium">Analytics Cookies</p>
                <p className="text-sm text-muted-foreground">
                  Help us understand how visitors interact with our website.
                </p>
              </div>
              <Checkbox 
                id="analytics" 
                checked={cookiePreferences.analytics} 
                onCheckedChange={(checked) => {
                  setCookiePreferences(prev => ({
                    ...prev,
                    analytics: checked === true,
                  }));
                }}
              />
            </div>
            
            <Separator />
            
            <div className="flex items-start space-x-4 justify-between">
              <div>
                <p className="font-medium">Marketing Cookies</p>
                <p className="text-sm text-muted-foreground">
                  Used to track visitors across websites to display relevant advertisements.
                </p>
              </div>
              <Checkbox 
                id="marketing" 
                checked={cookiePreferences.marketing} 
                onCheckedChange={(checked) => {
                  setCookiePreferences(prev => ({
                    ...prev,
                    marketing: checked === true,
                  }));
                }}
              />
            </div>
            
            <Separator />
            
            <div className="flex items-start space-x-4 justify-between">
              <div>
                <p className="font-medium">Preference Cookies</p>
                <p className="text-sm text-muted-foreground">
                  Allow the website to remember choices you make to provide better functionality.
                </p>
              </div>
              <Checkbox 
                id="preferences" 
                checked={cookiePreferences.preferences} 
                onCheckedChange={(checked) => {
                  setCookiePreferences(prev => ({
                    ...prev,
                    preferences: checked === true,
                  }));
                }}
              />
            </div>
          </div>
          
          <DialogFooter className="flex sm:justify-between">
            <Button 
              variant="outline" 
              onClick={() => rejectAll()}
            >
              Reject All
            </Button>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={() => setShowSettings(false)}
              >
                Cancel
              </Button>
              <Button 
                variant="default" 
                onClick={() => savePreferences(cookiePreferences)}
                className="flex items-center gap-1"
              >
                Save Preferences
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CookieConsent;
