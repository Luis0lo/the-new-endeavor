
import React, { useEffect } from 'react';
import { useAuthFlow } from '@/hooks/auth/useAuthFlow';
import { AuthTabs } from '@/components/auth/AuthTabs';
import { PasswordReset } from '@/components/auth/PasswordReset';
import { NewPasswordForm } from '@/components/auth/NewPasswordForm';
import { EmailVerificationLoading } from '@/components/auth/EmailVerificationLoading';
import { EmailVerificationError } from '@/components/auth/EmailVerificationError';

const Auth = () => {
  const {
    email,
    setEmail,
    password,
    setPassword,
    username,
    setUsername,
    loading,
    verificationError,
    currentView,
    setCurrentView,
    handleSignIn,
    handleSignUp,
    handleEmailConfirmation,
  } = useAuthFlow();

  useEffect(() => {
    console.log("Auth component rendered with view:", currentView);
  }, [currentView]);

  // If we're processing an email verification, show the loading screen
  if (currentView === 'verifying') {
    console.log("Starting email verification process");
    handleEmailConfirmation();
    return <EmailVerificationLoading />;
  }

  // Show verification error if any
  if (currentView === 'verificationError') {
    console.log("Showing verification error:", verificationError);
    return <EmailVerificationError error={verificationError || ''} />;
  }

  // Show new password form for password reset
  if (currentView === 'newPassword') {
    console.log("Showing new password form");
    return <NewPasswordForm />;
  }

  // Password reset mode
  if (currentView === 'passwordReset') {
    console.log("Showing password reset request form");
    return <PasswordReset 
      email={email} 
      setEmail={setEmail} 
      onBack={() => setCurrentView('default')} 
    />;
  }

  // Default login/signup view
  console.log("Showing default login/signup view");
  return (
    <AuthTabs
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      username={username}
      setUsername={setUsername}
      loading={loading}
      handleSignIn={handleSignIn}
      handleSignUp={handleSignUp}
      setResetPasswordMode={() => setCurrentView('passwordReset')}
    />
  );
};

export default Auth;
