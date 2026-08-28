FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN mkdir -p apps/api-gateway apps/event-service apps/user-service apps/notification-service
COPY apps/api-gateway/package.json apps/api-gateway/package.json
COPY apps/event-service/package.json apps/event-service/package.json
COPY apps/user-service/package.json apps/user-service/package.json
COPY apps/notification-service/package.json apps/notification-service/package.json
RUN npm ci --ignore-scripts
COPY apps/api-gateway ./apps/api-gateway
RUN npm run build --workspace=apps/api-gateway
RUN npm prune --omit=dev

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/api-gateway/dist ./apps/api-gateway/dist

EXPOSE 3000
CMD ["node", "apps/api-gateway/dist/main.js"]