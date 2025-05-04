
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { AuthViewType } from '@/hooks/auth/types';

export const useAuthCheck = () => {
  const [currentView, setCurrentView] = useState<AuthViewType>('default');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleAuthFlow = async () => {
      // Don't do any auth checks if we're on the reset-password path
      // This allows the reset password page to handle the auth flow
      if (location.pathname === '/auth/reset-password') {
        console.log("On reset password path, skipping auth checks");
        return;
      }
      
      // Parse URL parameters
      const queryParams = new URLSearchParams(location.search);
      
      // Check for password reset parameters (type=recovery and code)
      const resetType = queryParams.get('type') === 'recovery';
      const resetCode = queryParams.get('code');
      const hasResetParams = resetType && resetCode;
      
      // Check for explicit reset=true parameter from our custom redirect
      const isResetRedirect = queryParams.get('reset') === 'true';
      
      // Check for access_token in URL hash
      const hasToken = location.hash && (
        location.hash.includes('access_token') || 
        location.hash.includes('refresh_token')
      );
      
      console.log("Auth flow URL check:", {
        path: location.pathname,
        search: location.search,
        hash: location.hash,
        resetType,
        resetCode,
        hasResetParams,
        hasToken,
        isResetRedirect,
        currentView
      });

      // Password reset flow detection (highest priority)
      if (hasResetParams) {
        console.log("Password reset with code flow detected - showing new password form");
        
        try {
          // Critical: Immediately sign out any existing session
          // This prevents auto-login and ensures the reset flow works properly
          await supabase.auth.signOut();
          console.log("Signed out successfully before password reset flow");
          
          // Display new password form
          setCurrentView('newPassword');
        } catch (error) {
          console.error("Error signing out before password reset:", error);
        }
        return; // Exit early to prevent other flows from running
      } else if (isResetRedirect) {
        // This handles our custom redirect without code (first phase of reset)
        console.log("Initial password reset request detected");
        setCurrentView('passwordReset');
        return; // Exit early
      }
      
      // Email verification flow (second priority)
      if (hasToken && !hasResetParams) {
        console.log("Email verification flow detected");
        setCurrentView('verifying');
        return; // Exit early
      }
      
      // Default login check - lowest priority
      // Only check if not handling password reset or verification
      if (!hasResetParams && !hasToken && currentView === 'default') {
        console.log("Checking existing session");
        const { data } = await supabase.auth.getSession();
        console.log("Session check result:", !!data.session);
        if (data.session) {
          navigate('/dashboard');
        }
      }
    };

    handleAuthFlow();
  }, [location, navigate, currentView]);

  return {
    currentView,
    setCurrentView,
  };
};
