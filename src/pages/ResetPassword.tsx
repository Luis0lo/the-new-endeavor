
import React from 'react';
import { useLocation } from 'react-router-dom';
import { NewPasswordForm } from '@/components/auth/NewPasswordForm';

const ResetPassword = () => {
  const location = useLocation();
  console.log("Reset Password page accessed with query:", location.search);
  console.log("Reset Password page accessed with hash:", location.hash);
  
  // We don't need any extra logic here as the NewPasswordForm component
  // already handles all the reset password functionality
  return <NewPasswordForm />;
};

export default ResetPassword;
