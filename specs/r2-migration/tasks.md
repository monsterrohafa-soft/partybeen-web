# R2 마이그레이션 태스크

## Phase 1: R2 인프라 + 유틸리티

- [ ] [T001] [P0] R2 버킷 생성 + 퍼블릭 액세스 설정 (Cloudflare 대시보드)
- [ ] [T002] [P0] 환경 변수 설정 (.env, Vercel 환경변수)
  - `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET_NAME`, `R2_PUBLIC_URL`
- [ ] [T003] [P0] `src/lib/r2.ts` 생성 — R2 클라이언트 유틸
  - `uploadToR2(file, key)`, `deleteFromR2(key)`, `getR2PublicUrl(key)`
  - `compressImage(buffer)` — sharp WebP q90
- [ ] [T004] [P0] `package.json` — `@aws-sdk/client-s3`, `sharp` 의존성 추가

## Phase 2: 마이그레이션 스크립트

- [ ] [T005] [P0] `scripts/migrate-to-r2.ts` 생성
  - DB에서 Blob URL 전체 조회
  - 다운로드 → 원본 R2 업로드 → 압축 → 압축본 R2 업로드 → DB URL 업데이트
  - PDF는 압축 없이 이전
  - 진행률 표시, 실패 재시도, 결과 리포트
- [ ] [T006] [P0] partybeen 마이그레이션 실행 + 검증

## Phase 3: 업로드/삭제 API 변경 (partybeen)

- [ ] [T007] [P0] `src/app/api/upload/route.ts` 변경 — Blob → R2 + sharp 압축
- [ ] [T008] [P0] `src/app/api/portfolio-upload/route.ts` 변경 — R2 서버 업로드
- [ ] [T009] [P0] `src/app/api/menu-upload/route.ts` 변경 — R2 서버 업로드
- [ ] [T010] [P0] `src/app/api/proposal/upload/route.ts` 변경 — PDF → R2
- [ ] [T011] [P0] `src/app/api/portfolio/[id]/route.ts` 변경 — 삭제 시 R2 정리
- [ ] [T012] [P0] `src/app/api/proposal/[id]/route.ts` 변경 — PDF 삭제 R2
- [ ] [T013] [P0] 관리자 페이지 업로드 방식 변경
  - `src/app/admin/portfolio/page.tsx` — FormData 서버 업로드로 변경
  - `src/app/admin/menu/page.tsx` — 동일
  - `src/app/admin/proposal/page.tsx` — 동일

## Phase 4: 설정 + 정리 (partybeen)

- [ ] [T014] [P0] `next.config.ts` — remotePatterns에 R2 도메인 추가
- [ ] [T015] [P1] `@vercel/blob` 패키지 제거 + 미사용 import 정리
- [ ] [T016] [P1] partybeen 빌드 + 배포 + 프로덕션 이미지 로딩 검증
- [ ] [T017] [P1] 검증 완료 후 Vercel Blob 데이터 삭제

## Phase 5: chefbox 이전

- [ ] [T018] [P0] chefbox R2 버킷 생성 + 환경 변수 설정
- [ ] [T019] [P0] chefbox `src/lib/r2.ts` 생성 (partybeen 복사 + 버킷명 변경)
- [ ] [T020] [P0] chefbox 마이그레이션 스크립트 생성 + 실행
  - `detailImages` (JSON 배열) 내 각 URL 개별 처리
  - `guideImageUrl` 추가 처리
- [ ] [T021] [P0] chefbox 업로드/삭제 API 변경
- [ ] [T022] [P0] chefbox 관리자 페이지 업로드 방식 변경
- [ ] [T023] [P0] chefbox `next.config.ts` + 패키지 정리
- [ ] [T024] [P1] chefbox 빌드 + 배포 + 검증
- [ ] [T025] [P1] chefbox Vercel Blob 데이터 삭제

---

## 요약

| 구분 | P0 | P1 | 합계 |
|------|----|----|------|
| Phase 1 (인프라) | 4 | 0 | 4 |
| Phase 2 (마이그레이션) | 2 | 0 | 2 |
| Phase 3 (API) | 7 | 0 | 7 |
| Phase 4 (정리) | 1 | 3 | 4 |
| Phase 5 (chefbox) | 6 | 2 | 8 |
| **합계** | **20** | **5** | **25** |
