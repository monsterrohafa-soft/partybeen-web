# 파티빈 케이터링 프로젝트 개발 지침

## 프로젝트 정보

| 항목 | 값 |
|------|-----|
| **프로젝트명** | PartyBeen Catering Website |
| **프로덕션 URL** | Vercel (GitHub 연동 자동 배포) |
| **GitHub** | monsterrohafa-soft/partybeen-web |
| **기술스택** | Next.js 16, React 19, TypeScript, Tailwind CSS 4, Prisma, Neon PostgreSQL, NextAuth |
| **작업 경로** | `/Users/riky/project/partybeen` (맥미니 로컬) |

## 규칙 파일 (.claude/rules/)

| 파일 | 내용 |
|------|------|
| `01-user-preferences.md` | 언어, 호칭 |
| `02-path-guidelines.md` | 맥미니 로컬 경로 지침 |
| `03-brand-colors.md` | 브랜드 컬러 팔레트 |
| `04-vercel-deploy.md` | Vercel 자동 배포 + 빌드 |
| `05-portfolio-management.md` | DB 기반 포트폴리오/메뉴 관리 |
| `06-work-logging.md` | 옵시디언 작업 기록 |

## 핵심 규칙 요약

### 언어 & 호칭
- **한국어** 사용, **상규형** 호칭

### 경로
- 작업 경로: `/Users/riky/project/partybeen` (맥미니 로컬)

### 배포 (git push만!)
```bash
git add . && git commit -m "변경 내용" && git push
# → Vercel 자동 배포 (1-2분)
# 빌드: prisma generate && prisma db push && next build
```

## 브랜드 컬러 (빠른 참조)

| 색상 | 코드 | 용도 |
|------|------|------|
| **피콕그린 (메인)** | `#013A46` | 배경, 푸터, 주요 버튼 |
| **피콕그린 라이트** | `#025566` | 호버, 보조 버튼 |
| **베이지** | `#FAF3ED` | 밝은 배경 |
| **카카오 옐로우** | `#FEE500` | 카카오톡 버튼 |

## 핵심 파일 위치

| 파일/폴더 | 용도 |
|-----------|------|
| `prisma/schema.prisma` | DB 스키마 (11개 모델) |
| `src/auth.ts` | NextAuth 설정 |
| `src/lib/prisma.ts` | Prisma 클라이언트 |
| `src/lib/constants.ts` | 연락처, 소셜미디어 정보 |
| `src/app/admin/` | 관리자 페이지 (포트폴리오, 메뉴, 공지, 제안서, 설정) |
| `src/app/api/` | API Routes |
| `src/components/` | 공용 컴포넌트 (home, layout, portfolio, proposal) |
| `public/images/portfolio/` | 포트폴리오 정적 이미지 |

## DB 모델 (Prisma)

| 모델 | 용도 |
|------|------|
| User, Account, Session, VerificationToken | NextAuth 인증 |
| Category, Portfolio | 포트폴리오 (카테고리별, 모달/상세페이지) |
| MenuCategory, Menu | 메뉴 (썸네일/상세 이미지 분리) |
| Notice | 공지사항 (상단고정, 조회수) |
| Proposal | 제안서 PDF (Vercel Blob) |
| SiteSetting | 사이트 설정 (SMTP 등) |

## 주요 기능

- **포트폴리오**: DB 기반, 카테고리 필터, 모달/상세페이지 전환, 이미지 포지션
- **메뉴**: 카테고리별 관리, 썸네일/상세 이미지 분리
- **공지사항**: 상단고정, 공개/숨김, 조회수
- **제안서**: PDF 업로드/관리 (Vercel Blob)
- **이메일**: Nodemailer + 네이버 SMTP, DB 기반 설정
- **관리자**: NextAuth 인증, CRUD 관리, SMTP 설정
- **언론보도**: 외부 URL 자동 파싱 (cheerio)
