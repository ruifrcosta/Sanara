# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./
COPY services/patients/package.json ./services/patients/
COPY packages/types/package.json ./packages/types/

# Install dependencies
RUN npm ci

# Copy source files
COPY tsconfig.json ./
COPY services/patients ./services/patients
COPY packages/types ./packages/types

# Build the application
RUN npm run build -w @sanara/patients-service

# Production stage
FROM node:20-alpine AS runner

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./
COPY services/patients/package.json ./services/patients/
COPY packages/types/package.json ./packages/types/

# Install production dependencies only
RUN npm ci --production

# Copy built files
COPY --from=builder /app/services/patients/dist ./services/patients/dist
COPY --from=builder /app/packages/types/dist ./packages/types/dist

# Set environment variables
ENV NODE_ENV=production
ENV PORT=4000

# Expose port
EXPOSE 4000

# Start the application
CMD ["node", "services/patients/dist/index.js"] 