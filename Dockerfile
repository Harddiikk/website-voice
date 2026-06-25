# ============================================================
#  AURELIA — production image for Coolify (Next.js standalone)
#  Multi-stage, pnpm via corepack, non-root, ~180MB final image.
# ============================================================

FROM node:22-alpine AS base
# libc6-compat: needed by some native deps on Alpine
RUN apk add --no-cache libc6-compat
RUN corepack enable

# ---- build (install all deps + next build) ----
FROM base AS builder
WORKDIR /app

# Install deps from the lockfile first for better layer caching.
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# NEXT_PUBLIC_* are inlined at BUILD time — pass them as Coolify "Build Variables"
# (declared here as build args). All have safe defaults in code, so they're optional.
ARG NEXT_PUBLIC_SITE_URL
ARG NEXT_PUBLIC_GEMINI_MODEL
ENV NEXT_PUBLIC_SITE_URL=${NEXT_PUBLIC_SITE_URL}
ENV NEXT_PUBLIC_GEMINI_MODEL=${NEXT_PUBLIC_GEMINI_MODEL}
ENV NEXT_TELEMETRY_DISABLED=1

COPY . .
RUN pnpm build

# ---- runner (minimal standalone server) ----
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
# MUST be 0.0.0.0 inside a container so Coolify's proxy can reach the app.
ENV HOSTNAME=0.0.0.0

# Run as an unprivileged user.
RUN addgroup -S nodejs && adduser -S nextjs -G nodejs

# Standalone output already contains a minimal node_modules + server.js.
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000

# GEMINI_API_KEY is injected at RUNTIME by Coolify's environment variables.
CMD ["node", "server.js"]
