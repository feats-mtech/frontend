import 'src/global.css';

import { Router } from 'src/routes/sections';
import { useScrollToTop } from 'src/hooks/use-scroll-to-top';
import { ThemeProvider } from 'src/theme/theme-provider';
import { AuthProvider } from './context/AuthContext';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { onCLS, onFCP, onLCP, onTTFB, onINP } from 'web-vitals';
import { reportWebVitals } from './otel-init';

export default function App() {
  const location = useLocation();

  // Send each web-vitals metric as a Jaeger span
  useEffect(() => {
    onCLS(reportWebVitals);
    onFCP(reportWebVitals);
    onLCP(reportWebVitals);
    onTTFB(reportWebVitals);
    onINP(reportWebVitals);
  }, [location]);

  useScrollToTop();

  return (
    <ThemeProvider>
      <AuthProvider>
        <Router />
      </AuthProvider>
    </ThemeProvider>
  );
}
