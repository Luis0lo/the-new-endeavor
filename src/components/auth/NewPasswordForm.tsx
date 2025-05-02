
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
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const resetPasswordForm = useForm<ResetPasswordForm>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  // Ensure we're not already logged in - this runs once when component mounts
  useEffect(() => {
    const prepareResetFlow = async () => {
      setInitializing(true);
      
      // Get the reset code - we need this for the password update
      const code = searchParams.get('code');
      
      if (!code) {
        toast({
          title: "Error",
          description: "Reset code not found in URL. Please request a new password reset link.",
          variant: "destructive"
        });
        navigate('/auth');
        return;
      }
      
      // Force sign out any existing session to prevent auto-redirect
      // This is crucial to ensure we stay on the password reset page
      await supabase.auth.signOut();
      
      // Delay to ensure the UI updates
      setTimeout(() => {
        setInitializing(false);
      }, 500);
    };

    prepareResetFlow();
  }, [searchParams, navigate]);

  const handleNewPasswordSubmit = async (values: ResetPasswordForm) => {
    setLoading(true);
    
    try {
      // For password reset, we need to extract the code from URL
      const code = searchParams.get('code');
      
      if (!code) {
        throw new Error("Reset code not found in URL. Please request a new password reset link.");
      }
      
      console.log("Starting password reset with code and new password");
      
      // IMPORTANT: We need to first verify the recovery code before updating the password
      const { error: verifyError } = await supabase.auth.verifyOtp({
        token_hash: code,
        type: 'recovery'
      });
      
      if (verifyError) {
        throw verifyError;
      }
      
      // Now that we've verified the code, update the user's password
      const { error } = await supabase.auth.updateUser({ 
        password: values.password
      });
      
      if (error) {
        console.error("Password update error:", error);
        throw error;
      }
      
      toast({
        title: "Success",
        description: "Your password has been updated successfully. Please sign in with your new password.",
      });
      
      // Reset the form
      resetPasswordForm.reset();
      
      // Clear any existing session
      await supabase.auth.signOut();
      
      // Small delay to show the success message before redirecting
      setTimeout(() => {
        navigate('/auth');
      }, 1500);
    } catch (error: any) {
      console.error("Password reset error:", error);
      toast({
        title: "Error updating password",
        description: error.message || "Failed to update your password. Please try again or request a new reset link.",
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
