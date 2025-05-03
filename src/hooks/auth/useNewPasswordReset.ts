
import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from "@/hooks/use-toast";
import { ResetPasswordForm } from "@/components/auth/password-reset/PasswordResetForm";

export const useNewPasswordReset = () => {
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Validate the reset parameters and prepare
  useEffect(() => {
    const validateResetParams = async () => {
      setInitializing(true);
      setError(null);
      
      // Get the reset parameters from URL
      const type = searchParams.get('type');
      const code = searchParams.get('code');
      
      console.log("Password reset params check:", { 
        type, 
        code,
        allParams: Object.fromEntries(searchParams.entries())
      });
      
      // Validate reset parameters
      if (!code || type !== 'recovery') {
        console.error("Invalid reset parameters:", { type, code });
        setError("The password reset link is invalid or has expired. Please request a new one.");
        setInitializing(false);
        return;
      }

      // Force sign out any existing session to prevent auto-redirect
      try {
        console.log("Attempting to sign out before password reset form loads");
        const { error: signOutError } = await supabase.auth.signOut();
        
        if (signOutError) {
          console.error("Error signing out:", signOutError);
        } else {
          console.log("Successfully signed out before password reset");
        }
      } catch (signOutError) {
        console.error("Exception signing out:", signOutError);
      }
      
      // Short delay to ensure UI updates
      setTimeout(() => {
        setInitializing(false);
      }, 300);
    };

    validateResetParams();
  }, [searchParams]);

  const handleNewPasswordSubmit = async (values: ResetPasswordForm) => {
    setLoading(true);
    setError(null);
    
    try {
      // Get the reset code from URL
      const code = searchParams.get('code');
      
      if (!code) {
        throw new Error("Reset code not found. Please request a new password reset link.");
      }
      
      console.log("Starting password reset with code:", code);

      // Per Supabase docs, we should verify the OTP (one-time password) first
      // This will exchange the recovery token for a session
      const { data: verifyData, error: verifyError } = await supabase.auth.verifyOtp({
        token_hash: code,
        type: 'recovery',
      });
      
      console.log("Verify OTP result:", { 
        success: !verifyError, 
        error: verifyError?.message,
        data: verifyData
      });
      
      if (verifyError) {
        console.error("OTP verification error:", verifyError);
        throw verifyError;
      }
      
      // Now update the user's password
      console.log("Updating user password");
      const { data: updateData, error: updateError } = await supabase.auth.updateUser({
        password: values.password
      });
      
      console.log("Update password result:", { 
        success: !updateError, 
        error: updateError?.message,
        data: updateData
      });
      
      if (updateError) {
        console.error("Password update error:", updateError);
        throw updateError;
      }
      
      toast({
        title: "Success",
        description: "Your password has been updated successfully. Please sign in with your new password.",
      });
      
      // Sign out to ensure clean state before redirecting to login
      console.log("Signing out after password update");
      await supabase.auth.signOut();
      
      // Small delay to show the success message before redirecting
      setTimeout(() => {
        navigate('/auth');
      }, 1500);
    } catch (error: any) {
      console.error("Password reset error:", error);
      setError(error.message || "Failed to update your password. Please try again or request a new reset link.");
      
      toast({
        title: "Error updating password",
        description: error.message || "Failed to update your password.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    initializing,
    error,
    handleNewPasswordSubmit,
  };
};
