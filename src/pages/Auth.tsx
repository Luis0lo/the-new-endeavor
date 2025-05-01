
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from "@/hooks/use-toast";
import { AuthTabs } from '@/components/auth/AuthTabs';
import { PasswordReset } from '@/components/auth/PasswordReset';
import { NewPasswordForm } from '@/components/auth/NewPasswordForm';
import { EmailVerificationLoading } from '@/components/auth/EmailVerificationLoading';
import { EmailVerificationError } from '@/components/auth/EmailVerificationError';

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [verificationError, setVerificationError] = useState<string | null>(null);
  const [resetPasswordMode, setResetPasswordMode] = useState(false);
  const [showNewPasswordForm, setShowNewPasswordForm] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  // Check for password reset or email verification
  useEffect(() => {
    // Check for code in query parameters (used in password reset)
    const code = searchParams.get('code');
    
    // Parse URL parameters - Handle both query params and hash fragments
    const queryParams = new URLSearchParams(location.search);
    const hashParams = new URLSearchParams(location.hash.replace(/^#/, ''));
    
    // Check for password reset type in query params
    const resetType = queryParams.get('type') === 'recovery';
    
    // Check for access_token in URL hash (happens with email verification and password reset)
    const hasToken = location.hash && (
      location.hash.includes('access_token') || 
      location.hash.includes('refresh_token')
    );
    
    console.log("URL check:", {
      search: location.search,
      hash: location.hash,
      resetType,
      hasToken,
      code
    });
    
    // If this is a password reset flow with a code
    if (code) {
      console.log("Password reset code detected:", code);
      setShowNewPasswordForm(true);
      return;
    }
    
    // If this is a password reset flow with hash params
    if (resetType || (hasToken && queryParams.get('type') === 'recovery')) {
      console.log("Showing password reset form");
      setShowNewPasswordForm(true);
      return;
    }
    
    // Handle email verification flow
    if (hasToken) {
      handleEmailConfirmation();
    }
  }, [location, searchParams]);
  
  // Check if user is already logged in
  useEffect(() => {
    // Only check for session if not in password reset mode
    if (!showNewPasswordForm) {
      const checkSession = async () => {
        const { data } = await supabase.auth.getSession();
        if (data.session) {
          navigate('/dashboard');
        }
      };
      
      checkSession();
    }
  }, [navigate, showNewPasswordForm]);

  // Handle email confirmation
  const handleEmailConfirmation = async () => {
    setVerifying(true);
    setVerificationError(null);
    
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
      
      toast({
        title: "Verification error",
        description: error.message || "Failed to verify your email",
        variant: "destructive"
      });
    } finally {
      setVerifying(false);
    }
  };

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

  // Show a loading state if we're processing an email verification
  if (verifying) {
    return <EmailVerificationLoading />;
  }

  // Show verification error if any
  if (verificationError) {
    return <EmailVerificationError error={verificationError} />;
  }

  // Show new password form for password reset
  if (showNewPasswordForm) {
    return <NewPasswordForm />;
  }

  // Password reset mode
  if (resetPasswordMode) {
    return <PasswordReset 
      email={email} 
      setEmail={setEmail} 
      onBack={() => setResetPasswordMode(false)} 
    />;
  }

  return (
    <AuthTabs
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      username={username}
      setUsername={setUsername}
      loading={loading}
      handleSignIn={handleSignIn}
      handleSignUp={handleSignUp}
      setResetPasswordMode={setResetPasswordMode}
    />
  );
};

export default Auth;
