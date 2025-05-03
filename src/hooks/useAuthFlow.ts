import { useState, useEffect } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from "@/hooks/use-toast";

export type AuthViewType = 
  | 'login' 
  | 'verifying' 
  | 'verificationError' 
  | 'passwordReset' 
  | 'newPassword'
  | 'default';

export const useAuthFlow = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [verificationError, setVerificationError] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<AuthViewType>('default');
  
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  // Check for password reset or email verification
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
        handleEmailConfirmation();
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
  }, [location, searchParams, navigate, currentView]);

  // Handle email confirmation
  const handleEmailConfirmation = async () => {
    setVerifying(true);
    setVerificationError(null);
    setCurrentView('verifying');
    
    try {
      // The PKCE flow will automatically exchange the code for a session
      const { data, error } = await supabase.auth.getSession();
      
      if (error) throw error;
      
      if (data.session) {
        toast({
          title: "Authentication successful!",
          description: "Your account has been verified successfully.",
        });
        
        navigate('/dashboard');
      } else {
        throw new Error("No session found after verification");
      }
    } catch (error: any) {
      console.error("Verification error:", error);
      setVerificationError(error.message || "Failed to verify your email");
      setCurrentView('verificationError');
      
      toast({
        title: "Verification error",
        description: error.message || "Failed to verify your email",
        variant: "destructive"
      });
    } finally {
      setVerifying(false);
    }
  };

  // Sign up handler
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: {
            username
          }
        }
      });
      
      if (error) throw error;
      
      toast({
        title: "Account created",
        description: "Please check your email for verification.",
      });
      
      if (data.user && data.user.identities && data.user.identities.length === 0) {
        toast({
          title: "Account already exists",
          description: "Please sign in instead.",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create account",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Sign in handler
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) throw error;
      
      toast({
        title: "Welcome back!",
        description: "Successfully logged in.",
      });
      
      navigate('/dashboard');
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Invalid login credentials",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    username,
    setUsername,
    loading,
    verifying,
    verificationError,
    currentView,
    setCurrentView,
    handleSignIn,
    handleSignUp,
  };
};
