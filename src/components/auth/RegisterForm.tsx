
import React from 'react';
import { CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";

interface RegisterFormProps {
  username: string;
  setUsername: (username: string) => void;
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  loading: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ 
  username, 
  setUsername, 
  email, 
  setEmail, 
  password, 
  setPassword, 
  loading, 
  onSubmit 
}) => {
  return (
    <form onSubmit={onSubmit}>
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
          {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Creating account...</> : "Create account"}
        </Button>
      </CardFooter>
    </form>
  );
};
