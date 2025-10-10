// Initialize Elastic APM RUM in the browser. This file is safe to import in tests
// and Node environments because it guards access to `window`.
import { init as initApm } from '@elastic/apm-rum';

// Read config from runtime or build-time env. We prefer a runtime config object
// if the app injects configuration into window.RUNTIME_CONFIG for deployments.
const getConfig = () => {
  const runtime = (window as any).RUNTIME_CONFIG;
  const serverUrl = runtime?.VITE_ELASTIC_APM_URL || import.meta.env.VITE_ELASTIC_APM_URL;
  const serviceName = runtime?.VITE_APP_NAME || import.meta.env.VITE_APP_NAME || 'feats-frontend';
  const environment =
    runtime?.VITE_ENVIRONMENT ||
    import.meta.env.VITE_ENVIRONMENT ||
    import.meta.env.NODE_ENV ||
    'development';
  return { serverUrl, serviceName, environment };
};

export let apm: any = null;

try {
  if (typeof window !== 'undefined') {
    const cfg = getConfig();
    if (cfg.serverUrl) {
      apm = initApm({
        serviceName: cfg.serviceName,
        serviceVersion: '1.0.0',
        serverUrl: cfg.serverUrl,
        environment: cfg.environment,
        // capture errors and page-load/navigation performance
        distributedTracingOrigins: [window.location.origin],
        // adjust as needed for production
        active: true,
      });
    } else {
      // Fallback: do not initialize APM if there's no server URL
      apm = null;
    }
  }
} catch (e) {
  // Do not let APM initialization crash the app. Keep apm null on error.
  // eslint-disable-next-line no-console
  console.warn('Elastic APM initialization failed', e);
  apm = null;
}

export default apm;
