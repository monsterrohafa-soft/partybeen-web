# PartyBeen - 부산 프리미엄 케이터링

파티빈 케이터링 공식 웹사이트

## 기술 스택
- Next.js 16
- TypeScript
- Tailwind CSS
- Framer Motion

## 개발 환경 설정

```bash
# 패키지 설치
npm install

# 개발 서버 실행
npm run dev

# 빌드
npm run build
```

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
├── app/                    # 페이지
├── components/             # 컴포넌트
├── data/                   # 데이터
└── lib/                    # 유틸리티
```

## 연락처

- 전화: 051-806-5644
- 이메일: partybeen@naver.com
- 카카오톡: https://pf.kakao.com/_DTqwT

---

## 작업 기록

### 2024-12-08: 프로젝트 초기 설정

**완료된 작업:**
- Next.js 16 + TypeScript + Tailwind CSS 프로젝트 생성
- 기본 레이아웃 (Header, Footer, MobileBottomBar)
- 메인 페이지 (Hero 영상, 서비스 카테고리, CTA)
- 포트폴리오 페이지 (카테고리 필터, 갤러리 그리드)
- About, Contact 페이지
- 빌드 테스트 성공

**다음 단계:**
- 실제 이미지로 교체
- SEO 최적화

### 2024-12-08: GitHub + Vercel 배포 완료

**완료된 작업:**
- GitHub 저장소 연결 (monsterrohafa-soft/partybeen-web)
- Vercel 자동 배포 설정

### 2024-12-08: 브랜드 컬러 통일

**완료된 작업:**
- 기존 골드색(#c9a962) → 피콕그린(#025566, #013A46)으로 전체 통일
- 수정된 파일:
  - globals.css (CSS 변수, 스크롤바)
  - about/page.tsx
  - contact/page.tsx
  - portfolio/page.tsx
  - Header.tsx
  - Footer.tsx
  - HeroSection.tsx
  - ContactCTA.tsx
  - ServiceCategories.tsx
  - MobileBottomBar.tsx
  - GalleryGrid.tsx

### 2024-12-09: UI 업그레이드 및 관리자 시스템 구축

**UI 업그레이드:**
- 글래스모피즘, 그라디언트, 애니메이션 효과 추가
- HeroSection: 신뢰 지표 (500+ 행사, 98% 만족도, 10+ 년)
- ServiceCategories: stagger 애니메이션
- ContactCTA: 글래스모피즘 카드
- Header: 스크롤 시 배경 변화
- Footer: 레이아웃 개선

**관리자 시스템:**
- Prisma + Neon Postgres 연동
- NextAuth 인증 시스템
- 포트폴리오 CRUD API (/api/portfolio)
- Vercel Blob 이미지 업로드 (/api/upload)
- 관리자 페이지 (/admin/portfolio)

**Vercel 환경 설정:**
- Blob Storage 생성 (partybeen-images)
- Neon Postgres 연동
- 환경변수 설정 완료

**접속 정보:**
- 사이트: https://partybeen-web.vercel.app
- 관리자: https://partybeen-web.vercel.app/admin/login
- 관리자 계정: admin@partybeen.com / partybeen2024!

**다음 단계:**
- DB 시드 데이터 (카테고리) 생성
- 실제 포트폴리오 이미지 업로드
- SEO 최적화

### 2024-12-09: 헤더 UI 수정

**완료된 작업:**
- 헤더 배경을 항상 흰색으로 고정 (투명 제거)
- 메뉴 텍스트 색상 어두운색으로 통일
- 스크롤 상태와 관계없이 일관된 디자인
