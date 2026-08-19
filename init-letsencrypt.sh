#!/bin/bash
# init-letsencrypt.sh
#
# 이 프로젝트는 nginx.conf가 443(ssl_certificate)을 참조하는데, 그 인증서 파일은
# Let's Encrypt한테 처음 발급받기 전까지는 존재하지 않는다. 그런데 발급을 받으려면
# (HTTP-01 방식) nginx가 80번으로 이미 떠서 검증 요청에 응답해야 한다 — 즉 "인증서가
# 있어야 nginx가 뜨는데, nginx가 떠야 인증서를 받을 수 있는" 순환 문제가 생긴다.
#
# 그래서 아래 순서로 한 번만 우회한다:
#   1) 가짜(self-signed) 인증서를 그 경로에 만들어 nginx가 일단 기동되게 함
#   2) nginx 기동 (80/443 다 뜨지만 443은 가짜 인증서라 브라우저 경고가 뜸 — 잠깐뿐)
#   3) 가짜 인증서를 지우고, 진짜 인증서를 Let's Encrypt에 요청 (80번 경로로 검증됨)
#   4) nginx를 재시작해서 진짜 인증서를 읽어들이게 함
#
# 최초 1회만 실행하면 되고, 이후 갱신은 docker-compose.prod.yml의 certbot 서비스가
# 12시간마다 자동으로 처리한다 (만료 30일 이내가 아니면 조용히 스킵).
set -e

if [ ! -f .env ]; then
  echo "오류: .env 파일이 없습니다. .env.example을 복사해서 먼저 값을 채워주세요."
  exit 1
fi

# .env에서 DOMAIN, CERTBOT_EMAIL 읽어오기
export $(grep -E '^(DOMAIN|CERTBOT_EMAIL)=' .env | xargs)

if [ -z "$DOMAIN" ] || [ "$DOMAIN" = "linktree-kangsan.duckdns.org" ]; then
  echo "오류: .env의 DOMAIN 값을 실제 도메인으로 바꿔주세요 (지금은 예시값이거나 비어있음)."
  exit 1
fi
if [ -z "$CERTBOT_EMAIL" ] || [ "$CERTBOT_EMAIL" = "you@example.com" ]; then
  echo "오류: .env의 CERTBOT_EMAIL 값을 실제 이메일로 바꿔주세요."
  exit 1
fi

COMPOSE="docker compose -f docker-compose.yml -f docker-compose.prod.yml --env-file .env"

echo "### [1/5] 가짜 인증서 생성 (도메인: $DOMAIN) ###"
$COMPOSE run --rm --entrypoint "sh -c '\
  mkdir -p /etc/letsencrypt/live/$DOMAIN && \
  openssl req -x509 -nodes -newkey rsa:2048 -days 1 \
    -keyout /etc/letsencrypt/live/$DOMAIN/privkey.pem \
    -out /etc/letsencrypt/live/$DOMAIN/fullchain.pem \
    -subj \"/CN=localhost\"'" certbot

echo "### [2/5] Nginx 기동 (가짜 인증서로 일단 뜨게) ###"
$COMPOSE up -d --build frontend backend db

echo "### [3/5] 가짜 인증서 삭제 ###"
$COMPOSE run --rm --entrypoint "sh -c '\
  rm -rf /etc/letsencrypt/live/$DOMAIN && \
  rm -rf /etc/letsencrypt/archive/$DOMAIN && \
  rm -rf /etc/letsencrypt/renewal/$DOMAIN.conf'" certbot

echo "### [4/5] 실제 인증서 발급 요청 (Let's Encrypt) ###"
$COMPOSE run --rm --entrypoint "\
  certbot certonly --webroot -w /var/www/certbot \
    -d $DOMAIN \
    --email $CERTBOT_EMAIL \
    --rsa-key-size 2048 \
    --agree-tos \
    --no-eff-email \
    --force-renewal" certbot

echo "### [5/5] Nginx 무중단 재적용 (컨테이너 재시작 없이 진짜 인증서만 다시 읽어들임) ###"
$COMPOSE exec frontend nginx -s reload

echo ""
echo "완료! https://$DOMAIN 으로 접속해보세요."
echo "(80번 포트로 들어온 요청은 nginx.conf 설정에 따라 자동으로 https로 리다이렉트됩니다)"
