# Stage 1: Build
FROM node:20-alpine AS build

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci

# Copy the rest of the application code
COPY . .

# Stage 2: Production Runtime
FROM node:20-alpine

WORKDIR /app

# Copy only production dependencies and source from build stage
COPY --from=build /app/package*.json ./
RUN npm ci --only=production

COPY --from=build /app .

# Use non-root user for security
USER node

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:' + (process.env.PORT || 3000), (res) => res.statusCode === 200 ? process.exit(0) : process.exit(1))" || exit 1

EXPOSE 3001

CMD ["npm", "start"]
