
FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json yarn.lock* package-lock.json* ./
RUN npm install
COPY prisma ./prisma
RUN npx prisma generate
COPY . .
RUN npm run build
FROM node:20-alpine
WORKDIR /app
COPY package.json yarn.lock* package-lock.json* ./
RUN npm install --only=production
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/dist ./dist
RUN mkdir -p /app/public/temp
EXPOSE 3000
ENV NODE_ENV=production
CMD ["node", "dist/index.js"]
