
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from "@/hooks/use-toast";

export const useVerification = () => {
  const [verifying, setVerifying] = useState(false);
  const [verificationError, setVerificationError] = useState<string | null>(null);
  const navigate = useNavigate();

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

  return {
    verifying,
    verificationError,
    handleEmailConfirmation,
  };
};
