import packageJson from '../package.json';

export type ConfigValue = {
  appName: string;
  appVersion: string;
};

export const CONFIG: ConfigValue = {
  appName: 'fEATs',
  appVersion: packageJson.version,
};

// For handling runtime configuration
declare global {
  interface Window {
    RUNTIME_CONFIG?: {
      VITE_BACKEND_URL?: string;
    };
  }
}
