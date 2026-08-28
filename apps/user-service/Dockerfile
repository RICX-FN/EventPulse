FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN mkdir -p apps/api-gateway apps/event-service apps/user-service apps/notification-service
COPY apps/api-gateway/package.json apps/api-gateway/package.json
COPY apps/event-service/package.json apps/event-service/package.json
COPY apps/user-service/package.json apps/user-service/package.json
COPY apps/notification-service/package.json apps/notification-service/package.json
RUN npm ci --ignore-scripts
COPY apps/user-service ./apps/user-service
RUN npm run generate --workspace=apps/user-service
RUN npm run build --workspace=apps/user-service
RUN npm prune --omit=dev

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/user-service/dist ./apps/user-service/dist
COPY --from=builder /app/apps/user-service/prisma ./apps/user-service/prisma
COPY --from=builder /app/apps/user-service/prisma.config.ts ./apps/user-service/prisma.config.ts

EXPOSE 3002
CMD ["sh", "-c", "cd apps/user-service && npx prisma migrate deploy --config prisma.config.ts && cd /app && node apps/user-service/dist/src/domain/main/server.js"]