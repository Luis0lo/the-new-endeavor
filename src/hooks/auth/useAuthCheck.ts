
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
      // Parse URL parameters
      const queryParams = new URLSearchParams(location.search);
      
      // Check for password reset parameters (type=recovery and code)
      const resetType = queryParams.get('type') === 'recovery';
      const resetCode = queryParams.get('code');
      const hasResetParams = resetType && resetCode;
      
      // Check for access_token in URL hash
      const hasToken = location.hash && (
        location.hash.includes('access_token') || 
        location.hash.includes('refresh_token')
      );
      
      console.log("Auth flow URL check:", {
        search: location.search,
        hash: location.hash,
        resetType,
        resetCode,
        hasToken,
        hasResetParams
      });

      // Password reset flow detection (highest priority)
      if (hasResetParams) {
        console.log("Password reset flow detected - forcing sign out first");
        
        // Critical: Immediately sign out any existing session
        // This prevents auto-login and ensures the reset flow works properly
        await supabase.auth.signOut();
        
        setCurrentView('newPassword');
        return; // Exit early to prevent other flows from running
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
