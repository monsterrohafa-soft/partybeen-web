# 🎯 파티빈 케이터링 프로젝트 개발 지침

## 📍 프로젝트 정보

| 항목 | 값 |
|------|-----|
| **프로젝트명** | PartyBeen Catering Website |
| **프로덕션 URL** | Vercel (GitHub 연동 자동 배포) |
| **GitHub** | monsterrohafa-soft/partybeen-web |
| **기술스택** | Next.js 16, TypeScript, Tailwind CSS |

## 📂 규칙 파일 (.claude/rules/)

| 파일 | 내용 |
|------|------|
| `01-user-preferences.md` | 언어, 호칭 |
| `02-path-guidelines.md` | NAS 경로 지침 |
| `03-brand-colors.md` | 브랜드 컬러 팔레트 |
| `04-vercel-deploy.md` | Vercel 자동 배포 |
| `05-portfolio-management.md` | 포트폴리오 관리 |
| `06-work-logging.md` | 일자별 작업 기록 |

## 🔴 핵심 규칙 요약

### 언어 & 호칭
- **한국어** 사용, **상규형** 호칭

### 경로
- 상규형에게: `/volume1/backup/app/partybeen`
- Claude 파일 작업: `/mnt/nas/backup/app/partybeen`

### 배포 (git push만!)
```bash
git add . && git commit -m "변경 내용" && git push
# → Vercel 자동 배포 (1-2분)
```

## 🎨 브랜드 컬러 (빠른 참조)

| 색상 | 코드 | 용도 |
|------|------|------|
| **피콕그린 (메인)** | `#013A46` | 배경, 푸터, 주요 버튼 |
| **피콕그린 라이트** | `#025566` | 호버, 보조 버튼 |
| **베이지** | `#FAF3ED` | 밝은 배경 |
| **카카오 옐로우** | `#FEE500` | 카카오톡 버튼 |

⚠️ 폐기: `#c9a962` (골드) → `#025566`으로 대체

## 📁 Skills

`.claude/skills/` 폴더:
- `vercel-deploy.md` - 배포 가이드
- `portfolio-management.md` - 포트폴리오 관리
- `brand-colors.md` - 브랜드 컬러 상세

## 📂 핵심 파일 위치

| 파일 | 용도 |
|------|------|
| `src/data/portfolio.ts` | 포트폴리오 데이터 |
| `src/lib/constants.ts` | 연락처 정보 |
| `public/images/portfolio/` | 포트폴리오 이미지 |
