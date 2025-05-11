export type AuthViewType =
  | 'default'
  | 'signUp'
  | 'signIn'
  | 'passwordReset'
  | 'newPassword'
  | 'verifying'
  | 'verificationError';

export type DefaultLandingPage = 
  | '/dashboard'
  | '/dashboard/calendar'
  | '/dashboard/seed-calendar'
  | '/dashboard/inventory'
  | '/dashboard/garden-layout'
  | '/dashboard/companions';
