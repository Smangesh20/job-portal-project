# ---------- Frontend build ----------
FROM node:20-alpine AS frontend-build

WORKDIR /app/frontend

COPY frontend/package*.json ./
COPY frontend/.npmrc ./
RUN npm ci

COPY frontend/ ./
RUN npm run build

# ---------- Backend runtime ----------
FROM node:20-alpine AS backend-runtime

WORKDIR /app/backend

COPY backend/package*.json ./
RUN npm ci --omit=dev

COPY backend/ ./
COPY --from=frontend-build /app/frontend/build /app/frontend/build

ENV NODE_ENV=production
ENV PORT=4444

EXPOSE 4444

CMD ["node", "server.js"]

