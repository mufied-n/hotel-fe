# ------------------------------------------------------------
# Stage 1: Build Nuxt 4 Application
# ------------------------------------------------------------
FROM node:22-alpine AS builder

WORKDIR /app

# Install dependencies based on package-lock.json
COPY package.json package-lock.json ./
RUN npm ci

# Copy application source code
COPY . .

# Build production bundle (.output/server & .output/public)
ENV NODE_ENV=production
RUN npx nuxt prepare && npm run build

# ------------------------------------------------------------
# Stage 2: Minimal Production Runtime
# ------------------------------------------------------------
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NITRO_HOST=0.0.0.0
ENV NITRO_PORT=3000
ENV PORT=3000

# Create dedicated non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nuxtjs

# Copy build artifacts
COPY --from=builder --chown=nuxtjs:nodejs /app/.output ./.output

USER nuxtjs

EXPOSE 3000

HEALTHCHECK --interval=15s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://127.0.0.1:3000/booking || exit 1

CMD ["node", ".output/server/index.mjs"]
