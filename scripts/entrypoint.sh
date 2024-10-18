#!/bin/sh

# Create a config.js file with environment variables
cat <<EOF > /usr/share/nginx/html/config.js
window.RUNTIME_CONFIG = {
  VITE_BACKEND_URL: "${VITE_BACKEND_URL}"
};
EOF

# Start Nginx
nginx -g 'daemon off;'