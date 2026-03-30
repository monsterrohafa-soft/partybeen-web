# partybeen CLAUDE.md

## 기본 원칙
- 항상 한국어로 답하고, 사용자는 `상규형`이라고 부른다.
- 작업 전 `PROJECT_STATUS.md`, 최근 `logs/`, `SESSION_HANDOFF.md`, `HARNESS.md`를 먼저 확인한다.
- 인증/DB/브랜드 연계 기능은 영향 범위를 먼저 적는다.

## 프로젝트 정보
- 프로젝트명: partybeen
- 저장소 경로: `/Users/riky/project/partybeen`
- GitHub: `monsterrohafa-soft/partybeen-web`
- 기술 스택: Next.js, React 19, Prisma, Neon PostgreSQL, NextAuth, Vercel
- 관련 문서: `/Users/riky/nas-obsidian/02. share/00. 프로젝트관리/partybeen/`

## 주요 명령
```bash
pnpm dev
pnpm build
pnpm start
pnpm lint
pnpm db:push
pnpm db:seed
pnpm db:studio
```

## 핵심 규칙
- Prisma/인증 수정은 운영 로그인 흐름 영향 확인 후 진행한다.
- 브랜드 컬러/사이트 톤은 기존 방향을 존중한다.
- Vercel 자동 배포 전 빌드 영향 범위를 확인한다.

## 작업 후
- 변경 파일/검증 결과/남은 이슈를 정리한다.
- 옵시디언 프로젝트 문서에 로그와 상태를 업데이트한다.
