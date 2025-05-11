
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from "@/hooks/use-toast";
import { DefaultLandingPage } from '@/hooks/auth/types';

export const useSignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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
      
      // Get user's default landing page preference from localStorage or use dashboard as fallback
      const defaultPage = localStorage.getItem('defaultLandingPage') as DefaultLandingPage || '/dashboard';
      navigate(defaultPage);
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
    loading,
    handleSignIn,
  };
};
