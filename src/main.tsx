import ReactDOM from 'react-dom/client';
import { Suspense, StrictMode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

import { onCLS, onFCP, onLCP, onTTFB, onINP } from 'web-vitals';
import { tracer } from './otel-init';

import App from './App';

// Send each web-vitals metric as a Jaeger span
const reportWebVitals = (metric: any) => {
  const span = tracer.startSpan(`WebVital:${metric.name}`);
  span.setAttribute('value', metric.value);
  span.setAttribute('rating', metric.rating);
  span.setAttribute('delta', metric.delta);
  span.setAttribute('id', metric.id);
  if (metric.entries) {
    span.setAttribute('entries.length', metric.entries.length);
  }
  span.end();
};

onCLS(reportWebVitals);
onFCP(reportWebVitals);
onLCP(reportWebVitals);
onTTFB(reportWebVitals);
onINP(reportWebVitals);

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <Suspense>
          <App />
        </Suspense>
      </BrowserRouter>
    </HelmetProvider>
  </StrictMode>,
);
