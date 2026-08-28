FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN mkdir -p apps/api-gateway apps/event-service apps/user-service apps/notification-service
COPY apps/api-gateway/package.json apps/api-gateway/package.json
COPY apps/event-service/package.json apps/event-service/package.json
COPY apps/user-service/package.json apps/user-service/package.json
COPY apps/notification-service/package.json apps/notification-service/package.json
RUN npm ci --ignore-scripts
COPY apps/event-service ./apps/event-service
RUN npm run generate --workspace=apps/event-service
RUN npm run build --workspace=apps/event-service
RUN npm prune --omit=dev

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/event-service/dist ./apps/event-service/dist
COPY --from=builder /app/apps/event-service/prisma ./apps/event-service/prisma
COPY --from=builder /app/apps/event-service/prisma.config.ts ./apps/event-service/prisma.config.ts

EXPOSE 3001
CMD ["sh", "-c", "cd apps/event-service && npx prisma migrate deploy --config prisma.config.ts && cd /app && node apps/event-service/dist/main/server.js"]