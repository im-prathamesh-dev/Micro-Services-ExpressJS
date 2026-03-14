# Stage 1: Build
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# Stage 2: Production Runtime
FROM node:20-alpine

WORKDIR /app

COPY --from=build /app/package*.json ./
RUN npm ci --only=production

COPY --from=build /app .

USER node

EXPOSE 3003

CMD ["npm", "start"]
