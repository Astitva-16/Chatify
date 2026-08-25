# ============================================
# Stage 1: Build frontend
# ============================================

FROM node:22-bookworm-slim AS frontend-build

WORKDIR /app/frontend

COPY frontend/package.json frontend/package-lock.json ./

RUN npm ci

COPY frontend/ ./

ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_KEY

ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL
ENV VITE_SUPABASE_KEY=$VITE_SUPABASE_KEY

RUN npm run build


# ============================================
# Stage 2: Production
# ============================================

FROM node:22-bookworm-slim

WORKDIR /app

ENV NODE_ENV=production

COPY backend/package.json backend/package-lock.json ./

RUN npm ci --omit=dev

COPY backend/src ./src

COPY --from=frontend-build /app/frontend/dist ./public

EXPOSE 3000

USER node

CMD ["node", "src/index.js"]