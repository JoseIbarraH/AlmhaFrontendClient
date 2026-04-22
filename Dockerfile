# ======================================================================
# AlmhaFrontendClient — production Dockerfile (Astro SSR / Node adapter)
#
# Multi-stage build: builder (full deps + Astro build) → runner (prod deps).
# Designed for Dokploy behind Traefik.
#
# Build:
#   docker build --build-arg PUBLIC_API_URL=https://api.almhaplasticsurgery.com \
#                -t almha-frontend .
#
# Run:
#   docker run -p 3000:3000 almha-frontend
# ======================================================================

# ----------------------------------------------------------------------
# Stage 1 — builder
# ----------------------------------------------------------------------
FROM node:20-alpine AS builder

WORKDIR /app

# PUBLIC_* vars are BAKED INTO the client bundle at build time.
# Pass via `--build-arg PUBLIC_API_URL=...` or Dokploy's Build Args UI.
ARG PUBLIC_API_URL
ENV PUBLIC_API_URL=$PUBLIC_API_URL

# Install deps from lockfile (deterministic, respects package-lock.json).
# --legacy-peer-deps is required because the project has ESLint 9 +
# @astrojs/check peer conflicts that are expected and ignored.
COPY package.json package-lock.json ./
RUN npm ci --legacy-peer-deps

# Copy source and build the SSR bundle (writes to dist/)
COPY . .
RUN npm run build

# Prune dev dependencies from node_modules so we can copy only prod deps
# into the runtime stage. Faster than reinstalling in stage 2.
RUN npm prune --omit=dev --legacy-peer-deps


# ----------------------------------------------------------------------
# Stage 2 — runtime
# ----------------------------------------------------------------------
FROM node:20-alpine AS runner

WORKDIR /app

# Astro's Node adapter listens on HOST:PORT from env.
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3000

# Copy only what's needed to run: pruned node_modules + built dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist         ./dist
COPY --from=builder /app/package.json ./package.json

# Drop root for runtime (node:alpine already includes the 'node' user).
USER node

EXPOSE 3000

# Health endpoint: the SSR server responds 200 on any page. Using '/' is
# cheap and doesn't hit the backend (the layout caches navbar per-worker).
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
    CMD wget -qO- http://127.0.0.1:3000/ >/dev/null || exit 1

# Astro standalone adapter entrypoint
CMD ["node", "./dist/server/entry.mjs"]
