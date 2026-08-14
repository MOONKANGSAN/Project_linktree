# ── Stage 1 (dev): docker compose watch 전용 Vite 개발 서버 ──────
# node_modules는 컨테이너 안에서만 관리 (호스트와 격리)
FROM node:20-alpine AS dev
WORKDIR /app
COPY package*.json ./
RUN npm install
EXPOSE 5173
CMD ["npm", "run", "dev", "--", "--host"]

# ── Stage 2: Vite로 React 빌드 ──────────────────────────────────
FROM node:20-alpine AS builder
WORKDIR /app

# 의존성 캐시 레이어 (소스 변경 시 재설치 방지)
COPY package*.json ./
RUN npm install

# 소스 복사 후 프로덕션 빌드
COPY . .
RUN npm run build

# ── Stage 3: Nginx로 정적 파일 서빙 + API 프록시 ─────────────────
FROM nginx:alpine
WORKDIR /usr/share/nginx/html

# 빌드 결과물 복사
COPY --from=builder /app/dist .

# Nginx 설정 복사 (API 프록시 포함)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
