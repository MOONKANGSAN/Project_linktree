# Linktree

포트폴리오 웹사이트의 접근성과 노출도를 높이기 위한 링크트리 형태의 서비스입니다.

## 기술 스택

- Backend: Spring Boot 4.1.0 (Java 21), Spring Data JPA, Spring Security, JWT
- Frontend: React 19 + TypeScript (Vite), Nginx
- Database: MySQL 8.0
- Infra: Docker, Docker Compose

## 프로젝트 구조

```
.
├── linktree/         # Spring Boot 백엔드
├── frontend/          # React 프론트엔드 (Nginx로 서빙)
└── docker-compose.yml
```

## 실행 방법

```bash
docker compose up --build
```

- 프론트엔드: http://localhost
- 백엔드 API: http://localhost:8080

## API

- `POST /api/members/signup` — 회원가입

## 회원 정책

- 아이디: 최대 20자
- 비밀번호: 8자 이상, 특수문자 1개 이상 포함
