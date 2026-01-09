FROM node:20-alpine AS base

FROM base AS deps

RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

COPY . .
ARG NEXT_PUBLIC_BACKEND_URL
ENV NEXT_PUBLIC_BACKEND_URL=$NEXT_PUBLIC_BACKEND_URL
ARG NEXT_PUBLIC_AUTH_ZONE_URL
ENV NEXT_PUBLIC_AUTH_ZONE_URL=$NEXT_PUBLIC_AUTH_ZONE_URL
ENV NEXT_CONFIG_OUTPUT=standalone
RUN npm run build

FROM base AS production
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_SHARP_PATH=/app/node_modules/sharp

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=deps /app/public ./public

RUN mkdir .next
RUN chown nextjs:nodejs .next

COPY --from=deps /app/next.config.ts ./
COPY --from=deps --chown=nextjs:nodejs /app/.next/standalone/. ./
COPY --from=deps --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3001

ENV PORT=3001
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
