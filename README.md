# PartyBeen - 부산 프리미엄 케이터링

파티빈 케이터링 공식 웹사이트

## 기술 스택

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- Prisma + Neon Postgres
- NextAuth.js
- Vercel Blob Storage
- Framer Motion

## 배포

GitHub에 push하면 Vercel에서 자동 배포됩니다.

```bash
git add .
git commit -m "변경 내용"
git push
```

## 프로젝트 구조

```
src/
├── app/
│   ├── admin/          # 관리자 페이지
│   ├── api/            # API 라우트
│   ├── portfolio/      # 포트폴리오 페이지
│   └── ...
├── components/         # 컴포넌트
├── lib/                # 유틸리티
└── data/               # 정적 데이터
```

## 관리자 페이지

- **URL**: https://partybeen.vercel.app/admin
- **계정**: admin / admin

### 기능

- 포트폴리오 관리 (추가/수정/삭제)
- 언론보도 등록 (URL 입력 → 자동 파싱)
- 이미지 업로드 (Vercel Blob)

## 연락처

- 전화: 051-806-5644
- 이메일: partybeen@naver.com
- 카카오톡: https://pf.kakao.com/_DTqwT

## 작업 기록

→ [logs/](./logs/) 폴더 참조
