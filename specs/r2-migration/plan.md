# R2 마이그레이션 구현 계획

## Phase 1: R2 인프라 + 유틸리티 (partybeen)

### 변경/생성 파일
- `src/lib/r2.ts` (신규) — R2 클라이언트, upload/delete/getPublicUrl 함수
- `package.json` — `@aws-sdk/client-s3`, `sharp` 추가
- `.env` — R2 자격증명 추가

### 검증
- R2 업로드/다운로드/삭제 테스트 (스크립트)
- 퍼블릭 URL 접근 확인

---

## Phase 2: 마이그레이션 스크립트 (partybeen)

### 변경/생성 파일
- `scripts/migrate-to-r2.ts` (신규)

### 동작
1. DB에서 모든 Blob URL 조회 (Portfolio, Menu, Proposal)
2. 각 URL에서 이미지 다운로드
3. 원본 → R2 `originals/` 업로드
4. sharp로 WebP q90 변환 → R2 `images/` 업로드 (PDF는 변환 없이)
5. DB URL 업데이트 (Blob → R2)
6. 결과 리포트 출력 (성공/실패/용량 비교)

### 검증
- 마이그레이션 후 모든 이미지 URL 접근 확인
- 용량 비교 리포트 확인

---

## Phase 3: 업로드/삭제 API 변경 (partybeen)

### 변경 파일
- `src/app/api/upload/route.ts` — Blob → R2 + sharp 압축
- `src/app/api/portfolio-upload/route.ts` — 클라이언트 업로드 → 서버 업로드로 변경 (R2는 서버사이드)
- `src/app/api/menu-upload/route.ts` — 동일
- `src/app/api/proposal/upload/route.ts` — PDF → R2 (압축 없이)
- `src/app/api/portfolio/[id]/route.ts` — 삭제 시 R2 정리
- `src/app/api/proposal/[id]/route.ts` — PDF 삭제
- `src/app/admin/portfolio/page.tsx` — 업로드 방식 변경 (클라이언트→서버)
- `src/app/admin/menu/page.tsx` — 동일
- `src/app/admin/proposal/page.tsx` — 동일

### 주의: 업로드 방식 변경
- 기존: `@vercel/blob/client`의 클라이언트 직접 업로드 (토큰 방식)
- 변경: FormData → 서버 API → sharp 압축 → R2 업로드
- 이유: R2는 S3 SDK로 서버에서 업로드해야 함

### 검증
- 관리자에서 이미지 업로드 테스트
- 삭제 테스트
- 빌드 성공 확인

---

## Phase 4: 설정 + 정리 (partybeen)

### 변경 파일
- `next.config.ts` — remotePatterns에 R2 도메인 추가
- `package.json` — `@vercel/blob` 제거

### 검증
- 프로덕션 배포 후 전체 이미지 로딩 확인
- Vercel Blob 대시보드에서 데이터 삭제

---

## Phase 5: chefbox 이전

### partybeen과 동일한 작업 반복
- `src/lib/r2.ts` 복사 + 버킷명 변경
- 마이그레이션 스크립트 실행 (추가 필드: `detailImages`, `guideImageUrl`)
- API 변경
- 빌드 + 배포 + 검증

### chefbox 추가 고려사항
- `Portfolio.detailImages`: JSON 배열 내 각 URL 개별 처리
- `Menu.guideImageUrl`: 추가 이미지 필드

---

## 의존성 관계

```
Phase 1 (인프라) → Phase 2 (마이그레이션) → Phase 3 (API 변경) → Phase 4 (정리)
                                                                         ↓
                                                                  Phase 5 (chefbox)
```

## 환경 변수 (추가 필요)

```env
R2_ACCOUNT_ID=xxx
R2_ACCESS_KEY_ID=xxx
R2_SECRET_ACCESS_KEY=xxx
R2_BUCKET_NAME=partybeen
R2_PUBLIC_URL=https://pub-xxx.r2.dev
```

## 롤백 계획
- R2 `originals/`에 원본 보관 → 언제든 복원 가능
- DB URL 롤백 스크립트 준비 (R2 → Blob URL 복원)
- Vercel Blob 데이터는 Phase 4 완료 후에만 삭제
