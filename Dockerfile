# Dockerfile pour Next.js - Optimisé pour Coolify
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json package-lock.json* ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Clean any cached builds and node_modules cache
RUN rm -rf .next node_modules/.cache npm-cache

# Generate Prisma client before building
RUN npx prisma generate

# Build the application with fresh cache and explicit env
ENV NEXT_PUBLIC_BETTER_AUTH_URL=https://trybetterads.com
ENV BETTER_AUTH_URL=https://trybetterads.com
RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy Prisma files for runtime
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

# No startup script needed

COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Set default auth URLs (will be overridden by Coolify env vars)
ENV BETTER_AUTH_URL=https://trybetterads.com
ENV NEXT_PUBLIC_BETTER_AUTH_URL=https://trybetterads.com

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]