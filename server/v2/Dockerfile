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

# Copy package files and install production dependencies
COPY package*.json ./
# Use npm install with production flag
RUN npm install --omit=dev

# Copy built files from builder stage
COPY --from=builder /app/dist ./dist

# Set environment variables
ENV NODE_ENV=production
ENV PORT=8080

# Expose port
EXPOSE 8080

# Start the application
CMD ["node", "dist/server.js"]