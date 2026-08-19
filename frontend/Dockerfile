# ── Stage 1 (dev): docker compose watch 전용 Vite 개발 서버 ──────
# node_modules는 컨테이너 안에서만 관리 (호스트와 격리)
FROM node:20-alpine AS dev
WORKDIR /app
COPY package*.json ./
RUN npm install
# lightningcss(Tailwind v4가 내부적으로 쓰는 CSS 엔진)의 네이티브 바이너리 문제 보정
# package-lock.json이 Windows에서 생성돼 Alpine(musl) 전용 바이너리가 npm install만으로는
# 설치되지 않는 알려진 이슈가 있어, 명시적으로 musl 바이너리를 추가 설치함
RUN npm install lightningcss-linux-x64-musl@1.33.0 --no-save
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
# lightningcss(Tailwind v4가 내부적으로 쓰는 CSS 엔진)의 네이티브 바이너리 문제 보정
# package-lock.json이 Windows에서 생성돼 Alpine(musl) 전용 바이너리가 npm install만으로는
# 설치되지 않는 알려진 이슈가 있어, 명시적으로 musl 바이너리를 추가 설치함
RUN npm install lightningcss-linux-x64-musl@1.33.0 --no-save

# 소스 복사 후 프로덕션 빌드
COPY . .
RUN npm run build

# ── Stage 3: Nginx로 정적 파일 서빙 + API 프록시 ─────────────────
# target 이름 지정 → docker compose build --target production 으로 운영 스테이지 선택 가능
FROM nginx:alpine AS production
WORKDIR /usr/share/nginx/html

# 빌드 결과물 복사
COPY --from=builder /app/dist .

# nginx.conf를 /etc/nginx/templates/ 밑에 *.template로 넣으면, nginx 공식 이미지의
# 시작 스크립트가 자동으로 envsubst를 돌려서 ${DOMAIN} 같은 변수를 컨테이너 기동 시점의
# 환경변수 값으로 치환한 뒤 /etc/nginx/conf.d/default.conf로 생성해줌
# (도메인 값을 이미지 빌드에 굽지 않고 docker-compose.prod.yml의 environment로 주입하기 위함)
COPY nginx.conf /etc/nginx/templates/default.conf.template

EXPOSE 80 443
CMD ["nginx", "-g", "daemon off;"]
