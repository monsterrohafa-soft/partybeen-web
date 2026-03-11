# Vercel 배포 지침

## 자동 배포 (GitHub 연동)

```bash
git add . && git commit -m "변경 내용" && git push
# → Vercel 자동 배포 시작 (1-2분)
```

## 빌드 스크립트

```bash
# Vercel 빌드 명령어 (package.json)
prisma generate && prisma db push && next build
```

## 로컬 빌드 테스트

```bash
cd /Users/riky/project/partybeen
pnpm build
```

## 트러블슈팅

### 빌드 에러 시
```bash
rm -rf node_modules .next
pnpm install
pnpm build
```

### Prisma 관련 에러
```bash
pnpm prisma generate
pnpm prisma db push
```

### Vercel 배포 실패 시
- Vercel 대시보드에서 로그 확인
- 빌드 에러 메시지 확인 후 수정
