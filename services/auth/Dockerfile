# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./
COPY services/auth/package.json ./services/auth/
COPY packages/types/package.json ./packages/types/

# Install dependencies
RUN npm ci

# Copy source files
COPY tsconfig.json ./
COPY services/auth ./services/auth
COPY packages/types ./packages/types

# Build the application
RUN npm run build -w @sanara/auth-service

# Production stage
FROM node:20-alpine AS runner

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./
COPY services/auth/package.json ./services/auth/
COPY packages/types/package.json ./packages/types/

# Install production dependencies only
RUN npm ci --production

# Copy built files
COPY --from=builder /app/services/auth/dist ./services/auth/dist
COPY --from=builder /app/packages/types/dist ./packages/types/dist

# Set environment variables
ENV NODE_ENV=production
ENV PORT=4000

# Expose port
EXPOSE 4000

# Start the application
CMD ["node", "services/auth/dist/index.js"] 