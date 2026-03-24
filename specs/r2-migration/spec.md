# Vercel Blob → Cloudflare R2 마이그레이션 + 이미지 압축

## 개요

Vercel Blob에 저장된 이미지/PDF를 Cloudflare R2로 이전하고, 이미지를 WebP q90으로 압축하여 스토리지 비용을 절감한다. 대상: partybeen, chefbox 두 프로젝트.

## 배경

- Vercel Blob 추가 요금 과다 발생
- R2는 저장 $0.015/GB/월 (Blob 대비 15배 저렴), 읽기 10M/월 무료

## 대상 프로젝트

### partybeen
| DB 모델 | 이미지 필드 | 용도 |
|---------|------------|------|
| Portfolio | `imageUrl` | 포트폴리오 썸네일 |
| Menu | `imageUrl` | 메뉴 썸네일 |
| Menu | `detailImageUrl` | 메뉴 상세 이미지 |
| Proposal | `fileUrl` | 제안서 PDF |

### chefbox
| DB 모델 | 이미지 필드 | 용도 |
|---------|------------|------|
| Portfolio | `imageUrl` | 포트폴리오 썸네일 |
| Portfolio | `detailImages` | 상세 이미지 (JSON 배열) |
| Menu | `imageUrl` | 메뉴 썸네일 |
| Menu | `detailImageUrl` | 메뉴 상세 이미지 |
| Menu | `guideImageUrl` | 안내사항 이미지 |

## 요구사항

### P0 (Must Have)
- [ ] R2 버킷 생성 (퍼블릭 액세스, 프로젝트별 분리)
- [ ] 기존 Vercel Blob 이미지 → R2 마이그레이션 스크립트
- [ ] 이미지 압축: sharp WebP q90 (시각적 무손실)
- [ ] 원본 백업: R2 `originals/` 경로에 보관
- [ ] DB URL 일괄 업데이트 (Blob URL → R2 URL)
- [ ] 업로드 API 변경: `@vercel/blob` → R2 SDK (`@aws-sdk/client-s3`)
- [ ] 삭제 API 변경: Blob `del` → R2 `DeleteObject`
- [ ] 신규 업로드 시 자동 WebP q90 압축
- [ ] PDF 파일은 압축 없이 그대로 R2 이전 (partybeen만)
- [ ] `next.config.ts` remotePatterns 업데이트

### P1 (Should Have)
- [ ] 마이그레이션 검증 스크립트 (URL 접근 가능 확인)
- [ ] Vercel Blob 데이터 정리 (이전 완료 후)
- [ ] `@vercel/blob` 패키지 제거

### P2 (Nice to Have)
- [ ] 업로드 시 이미지 리사이즈 (최대 너비 제한)
- [ ] R2 커스텀 도메인 연결

## 기술 결정

| 항목 | 결정 |
|------|------|
| R2 접근 | 퍼블릭 URL (나중에 커스텀 도메인 가능) |
| SDK | `@aws-sdk/client-s3` (R2는 S3 호환) |
| 압축 | sharp → WebP quality 90 |
| PDF 처리 | 압축 없이 그대로 이전 |
| 이전 순서 | partybeen 먼저 → 검증 → chefbox |
| 버킷 구조 | `images/` (서비스용), `originals/` (원본 백업) |

## 영향 범위

### partybeen 변경 파일
1. `src/app/api/upload/route.ts` - 서버 업로드
2. `src/app/api/portfolio-upload/route.ts` - 클라이언트 업로드
3. `src/app/api/menu-upload/route.ts` - 메뉴 업로드
4. `src/app/api/proposal/upload/route.ts` - PDF 업로드
5. `src/app/api/portfolio/[id]/route.ts` - 삭제 시 Blob 정리
6. `src/app/api/proposal/[id]/route.ts` - PDF 삭제
7. `src/lib/r2.ts` (신규) - R2 클라이언트 유틸
8. `next.config.ts` - remotePatterns
9. `package.json` - 의존성 변경
10. `scripts/migrate-to-r2.ts` (신규) - 마이그레이션 스크립트

### chefbox 변경 파일
동일 구조 (제안서 관련 제외)

## 비기능 요구사항
- 마이그레이션 중 서비스 중단 없음 (기존 URL 유지 → DB 스위치)
- 이미지 로딩 성능 유지 또는 개선
- 관리자 업로드 UX 변경 없음
