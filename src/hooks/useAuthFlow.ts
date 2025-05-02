
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
      const queryParams = new URLSearchParams(location.search);
      
      // Check for password reset type in query params
      const resetType = queryParams.get('type') === 'recovery';
      const hasCode = queryParams.get('code') !== null;
      
      // Check for access_token in URL hash
      const hasToken = location.hash && (
        location.hash.includes('access_token') || 
        location.hash.includes('refresh_token')
      );
      
      console.log("URL check:", {
        search: location.search,
        hash: location.hash,
        resetType,
        hasToken,
        hasCode
      });

      // Password reset detection
      if (resetType || (hasToken && queryParams.get('type') === 'recovery')) {
        console.log("Password reset flow detected, showing password form");
        // Sign out any existing session to prevent auto-redirect
        await supabase.auth.signOut();
        setCurrentView('newPassword');
        return;
      }
      
      // Handle email verification flow - only if not a password reset
      if (hasToken && !resetType && currentView !== 'newPassword') {
        handleEmailConfirmation();
      } else if (currentView !== 'newPassword') {
        // Only check for existing session if not in password reset mode
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
