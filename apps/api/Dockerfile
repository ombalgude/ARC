FROM node:22-alpine AS builder
# Set working directory
WORKDIR /app
# Install pnpm
RUN corepack enable pnpm

# Install turbo
RUN pnpm install -g turbo

# Copy monorepo source
COPY . .

# Prune the workspace for the api app
RUN turbo prune api --docker

FROM node:22-alpine AS installer
WORKDIR /app
RUN corepack enable pnpm

# First install the dependencies (as they change less often)
COPY .gitignore .gitignore
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
RUN pnpm install --frozen-lockfile

# Build the project
COPY --from=builder /app/out/full/ .
COPY turbo.json turbo.json
RUN pnpm turbo run build --filter=api

FROM node:22-alpine AS runner
WORKDIR /app
RUN corepack enable pnpm

# Don't run production as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 expressjs
USER expressjs

COPY --from=installer /app .

EXPOSE 8080
ENV PORT=8080
ENV NODE_ENV=production

CMD ["node", "apps/api/dist/index.js"]
