
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

// Schema for the password reset form
const resetPasswordSchema = z.object({
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Password must be at least 6 characters"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type ResetPasswordForm = z.infer<typeof resetPasswordSchema>;

export const NewPasswordForm: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const resetPasswordForm = useForm<ResetPasswordForm>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  // Validate the reset parameters and prepare
  useEffect(() => {
    const validateResetParams = async () => {
      setInitializing(true);
      setError(null);
      
      // Get the reset parameters from URL
      const type = searchParams.get('type');
      const code = searchParams.get('code');
      
      console.log("Reset params check:", { type, code });
      
      // Validate reset parameters
      if (!code || type !== 'recovery') {
        setError("The password reset link is invalid or has expired. Please request a new one.");
        setInitializing(false);
        return;
      }

      // Force sign out any existing session to prevent auto-redirect
      try {
        await supabase.auth.signOut();
        console.log("Successfully signed out before password reset");
      } catch (signOutError) {
        console.error("Error signing out:", signOutError);
      }
      
      // Short delay to ensure UI updates
      setTimeout(() => {
        setInitializing(false);
      }, 300);
    };

    validateResetParams();
  }, [searchParams, navigate]);

  const handleNewPasswordSubmit = async (values: ResetPasswordForm) => {
    setLoading(true);
    setError(null);
    
    try {
      // Get the reset code from URL
      const code = searchParams.get('code');
      
      if (!code) {
        throw new Error("Reset code not found. Please request a new password reset link.");
      }
      
      console.log("Starting password reset with code");

      // Per Supabase docs, we should verify the OTP (one-time password) first
      // This will exchange the recovery token for a session
      const { error: verifyError } = await supabase.auth.verifyOtp({
        token_hash: code,
        type: 'recovery',
      });
      
      if (verifyError) {
        console.error("OTP verification error:", verifyError);
        throw verifyError;
      }
      
      // Now update the user's password
      const { error: updateError } = await supabase.auth.updateUser({
        password: values.password
      });
      
      if (updateError) {
        console.error("Password update error:", updateError);
        throw updateError;
      }
      
      toast({
        title: "Success",
        description: "Your password has been updated successfully. Please sign in with your new password.",
      });
      
      // Reset form
      resetPasswordForm.reset();
      
      // Small delay to show the success message
      setTimeout(() => {
        // Sign out to ensure clean state
        supabase.auth.signOut().then(() => {
          navigate('/auth');
        });
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

  if (initializing) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted/40 px-4 py-12">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Preparing Password Reset</CardTitle>
            <CardDescription className="text-center">Please wait while we prepare your password reset form</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center py-6">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted/40 px-4 py-12">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Password Reset Error</CardTitle>
          </CardHeader>
          <CardContent>
            <Alert variant="destructive" className="mb-4">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
            <div className="flex justify-center mt-4">
              <Button onClick={() => navigate('/auth')}>Return to login</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Set New Password</CardTitle>
          <CardDescription className="text-center">Enter your new password below</CardDescription>
        </CardHeader>
        <Form {...resetPasswordForm}>
          <form onSubmit={resetPasswordForm.handleSubmit(handleNewPasswordSubmit)}>
            <CardContent className="space-y-4 pt-4">
              <FormField
                control={resetPasswordForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Enter new password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={resetPasswordForm.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Confirm your password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Updating password...</> : "Update Password"}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
};
