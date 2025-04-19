
import { createRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async';
import App from './App.tsx'
import './index.css'

// Create a React root
const root = createRoot(document.getElementById("root")!);

// Render the app
root.render(
  <HelmetProvider>
    <App />
  </HelmetProvider>
);
