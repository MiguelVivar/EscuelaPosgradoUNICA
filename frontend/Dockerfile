# check=skip=JSONArgsRecommended
# Dockerfile para Next.js con TypeScript y TailwindCSS
# Utilizando multi-stage build para optimizar el tamaño de la imagen

# ==========================================
# Imagen base con Node.js
# ==========================================
FROM node:22-alpine AS base

# Instalar libc6-compat para compatibilidad con Alpine
RUN apk add --no-cache libc6-compat

# Habilitar corepack para usar pnpm
RUN corepack enable

WORKDIR /app

# ==========================================
# Stage 1: Instalación de dependencias
# ==========================================
FROM base AS deps

# Copiar archivos de configuración de pnpm
COPY package.json pnpm-lock.yaml ./

# Instalar dependencias
RUN pnpm install --frozen-lockfile

# ==========================================
# Stage 2: Build de la aplicación
# ==========================================
FROM base AS builder

WORKDIR /app

# Copiar dependencias desde la etapa anterior
COPY --from=deps /app/node_modules ./node_modules

# Copiar código fuente
COPY . .

# Variables de entorno para Next.js
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# Build de la aplicación
RUN pnpm build

# Listar contenido para debug
RUN ls -la .next/

# ==========================================
# Stage 3: Imagen de producción
# ==========================================
FROM base AS runner

WORKDIR /app

# Configurar usuario no root
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copiar package.json y pnpm-lock.yaml
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./
COPY --from=builder --chown=nextjs:nodejs /app/pnpm-lock.yaml ./

# Copiar archivos públicos
COPY --from=builder --chown=nextjs:nodejs /app/public ./public/

# Copiar toda la carpeta .next
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next/

# Instalar solo dependencias de producción
RUN pnpm install --prod --frozen-lockfile

# Cambiar a usuario no root
USER nextjs

# Exponer puerto
EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Comando para ejecutar la aplicación
CMD ["pnpm", "start"]