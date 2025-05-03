import { useAuthCheck } from '@/hooks/auth/useAuthCheck';
import { useSignIn } from '@/hooks/auth/useSignIn';
import { useSignUp } from '@/hooks/auth/useSignUp';
import { useVerification } from '@/hooks/auth/useVerification';
import { AuthViewType } from '@/hooks/auth/types';

export { AuthViewType };

export const useAuthFlow = () => {
  const { currentView, setCurrentView } = useAuthCheck();
  const { verifying, verificationError, handleEmailConfirmation } = useVerification();
  const { email: signInEmail, setEmail: setSignInEmail, password: signInPassword, setPassword: setSignInPassword, loading: signInLoading, handleSignIn } = useSignIn();
  const { email: signUpEmail, setEmail: setSignUpEmail, password: signUpPassword, setPassword: setSignUpPassword, username, setUsername, loading: signUpLoading, handleSignUp } = useSignUp();

  // When switching between login and signup, keep the email in sync
  const setEmail = (email: string) => {
    setSignInEmail(email);
    setSignUpEmail(email);
  };

  // When switching between login and signup, keep the password in sync
  const setPassword = (password: string) => {
    setSignInPassword(password);
    setSignUpPassword(password);
  };

  return {
    // Common state
    email: signInEmail, // Use signInEmail as the "current" email
    setEmail,
    password: signInPassword, // Use signInPassword as the "current" password
    setPassword,
    
    // Sign up specific
    username,
    setUsername,
    
    // Loading states
    loading: signInLoading || signUpLoading,
    verifying,
    
    // Error states
    verificationError,
    
    // View management
    currentView,
    setCurrentView,
    
    // Handlers
    handleSignIn,
    handleSignUp,
    handleEmailConfirmation,
  };
};
