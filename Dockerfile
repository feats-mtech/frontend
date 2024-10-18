FROM --platform=linux/amd64 node:22-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

ARG VITE_BACKEND_URL
ENV VITE_BACKEND_URL=$VITE_BACKEND_URL

RUN npm run build

FROM --platform=linux/amd64 nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html
COPY --from=build /app/assets /usr/share/nginx/html/assets

# Copy the custom entrypoint script
COPY /scripts/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 80

# CMD ["nginx", "-g", "daemon off;"]

# Use the custom entrypoint
ENTRYPOINT ["/entrypoint.sh"]