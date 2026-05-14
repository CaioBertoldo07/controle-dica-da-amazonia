# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app
RUN npm install -g npm@11.9.0
COPY package*.json ./
RUN npm ci
COPY . .
RUN npx prisma generate
RUN npm run build

# Stage 2: Production
FROM node:20-alpine AS production
WORKDIR /app
RUN apk add --no-cache openssl
RUN npm install -g npm@11.9.0
COPY package*.json ./
RUN npm ci --omit=dev
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/prisma ./prisma
EXPOSE 3333
CMD ["node", "dist/server.js"]
