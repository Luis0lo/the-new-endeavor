
import { createRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async';
import { ThemeProvider } from './hooks/use-theme';
import App from './App.tsx'
import './index.css'

// Create a React root
const root = createRoot(document.getElementById("root")!);

// Render the app
root.render(
  <HelmetProvider>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </HelmetProvider>
);
