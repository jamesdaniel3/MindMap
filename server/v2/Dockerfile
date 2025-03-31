FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
# Use regular npm install instead of npm ci
RUN npm install

# Copy source code
COPY tsconfig.json ./
COPY . .

# Build TypeScript code
RUN npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install ts-node and typescript for runtime migration support
RUN npm install --omit=dev && npm install ts-node typescript @types/node

# Copy built files from builder stage
COPY --from=builder /app/dist ./dist

# Copy migrations directory
COPY --from=builder /app/db ./db

# Copy knexfile for migrations
# COPY --from=builder /app/knexfile.js ./
COPY --from=builder /app/tsconfig.json ./

# Set environment variables
ENV NODE_ENV=production
ENV PORT=8080

# Expose port
EXPOSE 8080

# Start the application
CMD ["node", "dist/server.js"]