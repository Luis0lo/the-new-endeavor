
import React from 'react';
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

  // If we're processing an email verification, show the loading screen
  if (currentView === 'verifying') {
    handleEmailConfirmation();
    return <EmailVerificationLoading />;
  }

  // Show verification error if any
  if (currentView === 'verificationError') {
    return <EmailVerificationError error={verificationError || ''} />;
  }

  // Show new password form for password reset
  if (currentView === 'newPassword') {
    return <NewPasswordForm />;
  }

  // Password reset mode
  if (currentView === 'passwordReset') {
    return <PasswordReset 
      email={email} 
      setEmail={setEmail} 
      onBack={() => setCurrentView('default')} 
    />;
  }

  // Default login/signup view
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
