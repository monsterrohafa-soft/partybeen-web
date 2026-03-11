# 포트폴리오 & 메뉴 관리 지침

## 관리 방식
- **DB 기반** (Prisma + Neon PostgreSQL)
- **관리자 페이지** (`/admin`)에서 CRUD 관리
- 이미지 업로드: **Vercel Blob** 사용

## 포트폴리오

### DB 모델
- `Category`: 카테고리 (catering, food-box, lunch-box 등)
- `Portfolio`: 아이템 (제목, 설명, 이미지URL, 표시모드, 순서)

### 표시 모드 (DisplayMode)
- `MODAL`: 갤러리에서 모달로 표시
- `DETAIL`: 상세페이지(`/portfolio/[id]`)로 이동

### 특수 기능
- `imagePosition`: 이미지 object-position 커스텀 (예: "50% 30%")
- `externalUrl`: 언론보도용 외부 링크
- `orderIndex`: 표시 순서 제어

## 메뉴

### DB 모델
- `MenuCategory`: 메뉴 카테고리
- `Menu`: 메뉴 아이템 (이름, 설명, 가격, 이미지)

### 이미지 구조
- `imageUrl`: 목록용 썸네일
- `detailImageUrl`: 상세페이지용 큰 이미지 (세로)

## 이미지 가이드
- WebP 또는 최적화된 JPEG 권장
- 외부 이미지: `next.config.ts`의 `remotePatterns`에 도메인 추가 필요
