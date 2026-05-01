import React from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'sonner';
import Router from './router';
import { useUIStore } from './store/uiStore';

function App() {
  const theme = useUIStore((state) => state.theme);

  return (
    <HelmetProvider>
      <div className={theme}>
        <div className="bg-dark min-h-screen">
          <Router />
        </div>
        <Toaster
          theme={theme}
          position="top-right"
          richColors
          closeButton
          expand
          duration={3000}
        />
      </div>
    </HelmetProvider>
  );
}

export default App;
