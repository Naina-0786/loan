import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { HelmetProvider } from 'react-helmet-async'
import { Toaster } from 'sonner'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HelmetProvider>
    <App />
      <Toaster position="top-center" richColors />
    </HelmetProvider>
  </StrictMode>
);
