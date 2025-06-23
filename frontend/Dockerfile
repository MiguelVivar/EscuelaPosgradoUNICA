# frontend/Dockerfile
FROM node:20-alpine AS builder

# Instalar pnpm y herramientas necesarias
RUN npm install -g pnpm

# Configurar variables de entorno para el build
ENV NODE_ENV=production
ENV GENERATE_SOURCEMAP=false

WORKDIR /app

# Copiar archivos de dependencias primero para aprovechar el cache de Docker
COPY package.json pnpm-lock.yaml ./

# Instalar dependencias
RUN pnpm install --frozen-lockfile

# Copiar el resto del código fuente (excluyendo node_modules)
COPY src ./src
COPY public ./public
COPY index.html ./
COPY vite.config.ts ./
COPY tsconfig*.json ./
COPY eslint.config.js ./

# Construir la aplicación
RUN pnpm run build

# Etapa de producción con Nginx
FROM nginx:alpine

# Copiar archivos construidos
COPY --from=builder /app/dist /usr/share/nginx/html

# Copiar configuración personalizada de Nginx (opcional)
# COPY nginx.conf /etc/nginx/nginx.conf

# Exponer puerto 80
EXPOSE 80

# Comando por defecto
CMD ["nginx", "-g", "daemon off;"]
