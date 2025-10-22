# Multi-stage: build frontend then serve with nginx and proxy /api to backend
FROM node:18-alpine AS builder
WORKDIR /app
# Copy frontend sources
COPY frontend/package*.json ./frontend/
COPY frontend/vite.config.ts frontend/
COPY frontend/tsconfig.json frontend/
COPY frontend/tsconfig.node.json frontend/
COPY frontend/public frontend/public
COPY frontend/src frontend/src
WORKDIR /app/frontend
RUN npm install
RUN npm run build

FROM nginx:stable-alpine
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf
# copy built frontend
COPY --from=builder /app/frontend/dist /usr/share/nginx/html
EXPOSE 80
CMD ["/bin/sh", "-c", "nginx -g 'daemon off;'"]
