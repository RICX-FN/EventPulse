FROM node:20-alpine
WORKDIR /app

COPY package*.json ./
RUN mkdir -p apps/api-gateway apps/event-service apps/user-service apps/notification-service
COPY apps/api-gateway/package.json apps/api-gateway/package.json
COPY apps/event-service/package.json apps/event-service/package.json
COPY apps/user-service/package.json apps/user-service/package.json
COPY apps/notification-service/package.json apps/notification-service/package.json
RUN npm ci --omit=dev --ignore-scripts

COPY apps/api-gateway/dist ./apps/api-gateway/dist

EXPOSE 3000
CMD ["node", "apps/api-gateway/dist/main.js"]