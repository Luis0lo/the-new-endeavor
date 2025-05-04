
import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface PasswordResetProps {
  email: string;
  setEmail: (email: string) => void;
  onBack: () => void;
}

export const PasswordReset: React.FC<PasswordResetProps> = ({ email, setEmail, onBack }) => {
  const [loading, setLoading] = useState(false);
  const [showResetConfirmation, setShowResetConfirmation] = useState(false);

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      console.log("Starting password reset request for email:", email);
      
      // Get the current URL origin (domain)
      const origin = window.location.origin;
      console.log("Using origin for redirectTo:", origin);
      
      // Create a specific URL for the new password form with FULL path
      const resetRedirectTo = `${origin}/auth/reset-password`;
      console.log("Using reset redirect:", resetRedirectTo);
      
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: resetRedirectTo,
      });
      
      if (error) {
        console.error("Password reset request error:", error);
        throw error;
      }
      
      console.log("Password reset email sent successfully:", data);
      setShowResetConfirmation(true);
    } catch (error: any) {
      console.error("Exception in password reset:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to send password reset email",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center mb-2">
            <Button 
              variant="ghost" 
              className="p-0 h-auto" 
              onClick={onBack}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </div>
          <CardTitle className="text-2xl text-center">Reset Your Password</CardTitle>
          <CardDescription className="text-center">Enter your email address and we'll send you a password reset link</CardDescription>
        </CardHeader>
        <form onSubmit={handlePasswordReset}>
          <CardContent className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="reset-email">Email</Label>
              <Input 
                id="reset-email" 
                placeholder="your@email.com" 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Sending reset link...</> : "Send Reset Link"}
            </Button>
          </CardFooter>
        </form>

        {/* Password reset confirmation dialog */}
        <Dialog open={showResetConfirmation} onOpenChange={setShowResetConfirmation}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Password Reset Email Sent</DialogTitle>
              <DialogDescription>
                We've sent a password reset link to <strong>{email}</strong>. 
                Please check your email and follow the instructions to reset your password.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button onClick={() => {
                setShowResetConfirmation(false);
                onBack();
              }}>
                Return to Login
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </Card>
    </div>
  );
};
