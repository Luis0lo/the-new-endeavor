
import React from 'react';

/**
 * Utility functions for environment detection
 */

/**
 * Check if the app is running in development mode
 * This checks multiple indicators to determine if we're in a dev environment
 */
export const isDevelopment = (): boolean => {
  // Check if we're running on localhost or common dev ports
  const isLocalhost = window.location.hostname === 'localhost' || 
                     window.location.hostname === '127.0.0.1' ||
                     window.location.hostname === '0.0.0.0';
  
  // Check if we're running on common development ports
  const devPorts = ['3000', '5173', '8080', '4000'];
  const isDevPort = devPorts.includes(window.location.port);
  
  // Check if the URL contains .lovable.app (Lovable's staging environment)
  const isLovableStaging = window.location.hostname.includes('.lovable.app');
  
  // Consider it development if it's localhost with dev port OR Lovable staging
  return (isLocalhost && isDevPort) || isLovableStaging;
};

/**
 * Check if we're in production (published app)
 */
export const isProduction = (): boolean => {
  return !isDevelopment();
};

/**
 * Conditionally render content only in development
 */
export const DevOnly: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  if (!isDevelopment()) {
    return null;
  }
  return React.createElement(React.Fragment, null, children);
};
