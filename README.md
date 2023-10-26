# 웹관제 node.js 배포 서버

---

## 시작

```bash
yarn install
```

## 배포 주소

    관제: http://골프장 IP:5050
    서버: http://골프장 IP:3000

---

## 배포방법

1. client 폴더내 dist 폴더가 해당 업장인지 확인
2. .env 파일 데이터베이스 접속정보 변경
3. 실행
   - windows) run.bat
   - linux) run.sh

---

## 명령어

```bash
시작) yarn pm2 ecosystem.config.js
재시작) yarn pm2 restart (server or client)
종료) yarn pm2 kill
```

---

## 패치

- 2023.07.28
  - client, server 실해파일, 명령어 통합
  - .env 파일 통합
  - pm2 cluster모드 사용
