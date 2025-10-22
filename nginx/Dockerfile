# Etapa 1: construir el frontend
FROM node:18-alpine AS builder
WORKDIR /app

# Copiar archivos necesarios del frontend
COPY frontend/package*.json ./frontend/
COPY frontend/vite.config.ts frontend/
COPY frontend/tsconfig.json frontend/
COPY frontend/tsconfig.node.json frontend/
COPY frontend/public frontend/public
COPY frontend/src frontend/src
COPY frontend/index.html frontend/  #

# Construir el frontend
WORKDIR /app/frontend
RUN npm install
RUN npm run build

# Etapa 2: servir con nginx
FROM nginx:stable-alpine
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/frontend/dist /usr/share/nginx/html
EXPOSE 80
CMD ["/bin/sh", "-c", "nginx -g 'daemon off;'"]
