# ── Stage 1 (dev): docker compose watch 전용 Vite 개발 서버 ──────
# node_modules는 컨테이너 안에서만 관리 (호스트와 격리)
FROM node:20-alpine AS dev
WORKDIR /app
COPY package*.json ./
RUN npm install
# 초기 소스 복사 (watch의 sync는 변경분만 덮어씀 → COPY가 없으면 404)
COPY . .
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
# target 이름 지정 → docker compose build --target production 으로 운영 스테이지 선택 가능
FROM nginx:alpine AS production
WORKDIR /usr/share/nginx/html

# 빌드 결과물 복사
COPY --from=builder /app/dist .

# Nginx 설정 복사 (API 프록시 포함)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
