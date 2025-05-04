
import React, { useEffect } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { NewPasswordForm } from '@/components/auth/NewPasswordForm';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Extract query parameters
  const type = searchParams.get('type');
  const code = searchParams.get('code');
  
  useEffect(() => {
    // Sign out any existing session immediately to prevent auto-redirect
    const signOutExistingSession = async () => {
      try {
        await supabase.auth.signOut();
        console.log("Signed out existing session on reset password page");
      } catch (error) {
        console.error("Error signing out on reset page:", error);
      }
    };

    signOutExistingSession();
  }, []);
  
  console.log("Reset Password page accessed with:", {
    search: location.search,
    hash: location.hash,
    type,
    code,
    fullUrl: window.location.href
  });
  
  // Check if we have the required parameters
  const hasValidParams = type === 'recovery' && code;
  
  // If parameters are missing, show error instead of the form
  if (!hasValidParams) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted/40 px-4 py-12">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Password Reset Error</CardTitle>
          </CardHeader>
          <CardContent>
            <Alert variant="destructive" className="mb-4">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                The password reset link is invalid or has expired. Please request a new one.
              </AlertDescription>
            </Alert>
            <div className="flex justify-center mt-4">
              <Button onClick={() => navigate('/auth')}>Return to login</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  // If parameters are valid, render the password reset form
  return <NewPasswordForm />;
};

export default ResetPassword;
