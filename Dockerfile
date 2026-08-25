# ============================================
# Stage 1: Build React + Vite frontend
# ============================================

FROM node:22-bookworm-slim AS frontend-build

WORKDIR /app/frontend

COPY frontend/package.json frontend/package-lock.json ./

RUN npm ci

COPY frontend/ ./

# Vite environment variables are needed at BUILD time
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_KEY

ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL
ENV VITE_SUPABASE_KEY=$VITE_SUPABASE_KEY

RUN npm run build


# ============================================
# Stage 2: Prepare backend
# ============================================

FROM node:22-bookworm-slim AS backend-build

WORKDIR /app

COPY backend/package.json backend/package-lock.json ./

RUN npm ci

COPY backend/ ./


# ============================================
# Stage 3: Production image
# ============================================

FROM node:22-bookworm-slim AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Install only production dependencies
COPY backend/package.json backend/package-lock.json ./

RUN npm ci --omit=dev && npm cache clean --force

# Copy backend
COPY --from=backend-build /app ./backend

# Copy React production build
COPY --from=frontend-build /app/frontend/dist ./backend/public

EXPOSE 3000

USER node

CMD ["node", "backend/index.js"]