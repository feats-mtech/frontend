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
      VITE_BACKEND_AUTHENTICATE_URL?: string;
      VITE_BACKEND_AUTHENTICATE_PORT?: string;
      VITE_BACKEND_INGREDIENT_URL?: string;
      VITE_BACKEND_INGREDIENT_PORT?: string;
      VITE_BACKEND_RECIPE_URL?: string;
      VITE_BACKEND_RECIPE_PORT?: string;
      VITE_BACKEND_USER_URL?: string;
      VITE_BACKEND_USER_PORT?: string;
      VITE_BACKEND_NOTIFICATION_URL?: string;
      VITE_BACKEND_NOTIFICATION_PORT?: string;
      VITE_BACKEND_REVIEW_URL?: string;
      VITE_BACKEND_REVIEW_PORT?: string;
    };
  }
}
