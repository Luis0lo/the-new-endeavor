
import { useState, useEffect } from 'react';
import { DefaultLandingPage } from '@/hooks/auth/types';

export function useDefaultLandingPage() {
  const [defaultLandingPage, setDefaultLandingPageState] = useState<DefaultLandingPage>('/dashboard');

  // Load saved preference on mount
  useEffect(() => {
    const savedPage = localStorage.getItem('defaultLandingPage') as DefaultLandingPage;
    if (savedPage) {
      setDefaultLandingPageState(savedPage);
    }
  }, []);

  // Function to update and save the default landing page
  const setDefaultLandingPage = (page: DefaultLandingPage) => {
    localStorage.setItem('defaultLandingPage', page);
    setDefaultLandingPageState(page);
  };

  return {
    defaultLandingPage,
    setDefaultLandingPage
  };
}
