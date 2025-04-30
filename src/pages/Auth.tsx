import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, ArrowLeft } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

// Schema for the password reset form
const resetPasswordSchema = z.object({
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Password must be at least 6 characters"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type ResetPasswordForm = z.infer<typeof resetPasswordSchema>;

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [verificationError, setVerificationError] = useState<string | null>(null);
  const [resetPasswordMode, setResetPasswordMode] = useState(false);
  const [showResetConfirmation, setShowResetConfirmation] = useState(false);
  const [showNewPasswordForm, setShowNewPasswordForm] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  const resetPasswordForm = useForm<ResetPasswordForm>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  // Check if the user is accessing with a reset token
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const resetToken = queryParams.get('reset') === 'true';
    const type = queryParams.get('type');
    
    if (resetToken || type === 'recovery') {
      // Show the password reset form if the user is accessing with a reset token
      setShowNewPasswordForm(true);
    }
  }, [location]);
  
  // Check if user is already logged in
  useEffect(() => {
    // Special case for handling email confirmation or reset password
    const handleEmailConfirmation = async () => {
      // Handle both code in query params and access_token in hash
      const hasCode = location.search.includes('code=');
      const hasToken = location.hash && (location.hash.includes('access_token') || location.hash.includes('refresh_token'));
      
      if (hasCode || hasToken) {
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
      }
    };

    const checkSession = async () => {
      // Only check for session if not in password reset mode
      if (!showNewPasswordForm) {
        const { data } = await supabase.auth.getSession();
        if (data.session) {
          navigate('/dashboard');
        } else {
          // Try to handle email confirmation
          handleEmailConfirmation();
        }
      }
    };
    
    checkSession();
  }, [navigate, location, showNewPasswordForm]);

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

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth?reset=true`,
      });
      
      if (error) throw error;
      
      setShowResetConfirmation(true);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to send password reset email",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleNewPasswordSubmit = async (values: ResetPasswordForm) => {
    setLoading(true);
    
    try {
      const { error } = await supabase.auth.updateUser({
        password: values.password
      });
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Your password has been updated successfully. Please sign in with your new password.",
      });
      
      // Reset the form and go back to login
      setShowNewPasswordForm(false);
      resetPasswordForm.reset();
    } catch (error: any) {
      toast({
        title: "Error updating password",
        description: error.message || "Failed to update your password",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Show a loading state if we're processing an email verification
  if (verifying) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted/40 px-4 py-12">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Verifying your email</CardTitle>
            <CardDescription className="text-center">Please wait while we verify your email address</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center py-6">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show verification error if any
  if (verificationError) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted/40 px-4 py-12">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl text-center text-destructive">Verification Failed</CardTitle>
            <CardDescription className="text-center">There was a problem verifying your email</CardDescription>
          </CardHeader>
          <CardContent>
            <Alert variant="destructive">
              <AlertDescription>{verificationError}</AlertDescription>
            </Alert>
            <p className="mt-4 text-center">
              This may be due to an expired or invalid verification link.
            </p>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button onClick={() => navigate('/auth')}>Return to Login</Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // Show new password form for password reset
  if (showNewPasswordForm) {
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
  }

  // Password reset mode
  if (resetPasswordMode) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted/40 px-4 py-12">
        <Card className="w-full max-w-md">
          <CardHeader>
            <div className="flex items-center mb-2">
              <Button 
                variant="ghost" 
                className="p-0 h-auto" 
                onClick={() => setResetPasswordMode(false)}
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
                {loading ? "Sending reset link..." : "Send Reset Link"}
              </Button>
            </CardFooter>
          </form>
        </Card>

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
                setResetPasswordMode(false);
              }}>
                Return to Login
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Welcome to Garden App</CardTitle>
          <CardDescription className="text-center">Sign in to manage your garden or create an account</CardDescription>
        </CardHeader>
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login">
            <form onSubmit={handleSignIn}>
              <CardContent className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    placeholder="your@email.com" 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <Button 
                      variant="link" 
                      className="p-0 h-auto text-sm" 
                      type="button"
                      onClick={() => setResetPasswordMode(true)}
                    >
                      Forgot password?
                    </Button>
                  </div>
                  <Input 
                    id="password" 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required 
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Signing in..." : "Sign in"}
                </Button>
              </CardFooter>
            </form>
          </TabsContent>
          
          <TabsContent value="register">
            <form onSubmit={handleSignUp}>
              <CardContent className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input 
                    id="username" 
                    placeholder="gardenlover" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email-register">Email</Label>
                  <Input 
                    id="email-register" 
                    placeholder="your@email.com" 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password-register">Password</Label>
                  <Input 
                    id="password-register" 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    minLength={6}
                    required 
                  />
                </div>
                <Alert>
                  <AlertDescription>
                    After registration, you'll need to verify your email address before logging in.
                  </AlertDescription>
                </Alert>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Creating account..." : "Create account"}
                </Button>
              </CardFooter>
            </form>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default Auth;
