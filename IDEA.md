# 파티빈 웹사이트 - 향후 개발 아이디어

## 🎯 우선순위 높음

### 1. 포트폴리오 워터마크 자동 삽입
**설명**: 관리자가 포트폴리오 이미지 업로드 시 파티빈 로고 워터마크 자동 삽입

**구현 방법**:
- Sharp 라이브러리 사용 (Node.js 이미지 처리)
- 업로드 API에서 자동 처리

**설정 옵션**:
- 워터마크 위치: 우측 하단 / 중앙 / 전체 반복
- 워터마크 투명도: 30~50%
- 워터마크 크기: 이미지 대비 비율

**필요 리소스**:
- 파티빈 로고 PNG (투명 배경)

**예상 코드**:
```typescript
import sharp from 'sharp';

async function addWatermark(inputPath: string, outputPath: string) {
  const watermark = await sharp('public/images/logo-watermark.png')
    .resize(200) // 워터마크 크기
    .toBuffer();

  await sharp(inputPath)
    .composite([{
      input: watermark,
      gravity: 'southeast', // 우측 하단
      blend: 'over',
    }])
    .toFile(outputPath);
}
```

---

### 2. 관리자 페이지
**설명**: 포트폴리오, 공지사항 등 콘텐츠 관리

**기능**:
- [ ] 포트폴리오 이미지 업로드/삭제
- [ ] 카테고리 관리
- [ ] 공지사항 작성
- [ ] 문의 내역 확인

**인증**:
- NextAuth.js 사용
- 간단한 비밀번호 인증 또는 카카오 로그인

---

### 3. 포트폴리오 실제 이미지 적용
**설명**: 기존 파티빈 사이트 및 인스타그램에서 실제 포트폴리오 이미지 수집

**작업**:
- [ ] 기존 사이트(partybeen.com) 이미지 다운로드
- [ ] 인스타그램 이미지 수집
- [ ] 카테고리별 분류
- [ ] 최적화 (WebP 변환, 리사이징)

---

## 🔄 우선순위 중간

### 4. SEO 최적화
- [ ] 메타 태그 최적화
- [ ] Open Graph 이미지
- [ ] 구조화된 데이터 (JSON-LD)
- [ ] 사이트맵 생성
- [ ] robots.txt

### 5. 성능 최적화
- [ ] 이미지 lazy loading
- [ ] 모바일 영상 용량 최적화 (별도 저해상도 버전)
- [ ] 폰트 최적화

### 6. 애널리틱스
- [ ] Google Analytics 4 연동
- [ ] 전환 추적 (문의 폼 제출)

---

## 💡 우선순위 낮음 (나중에)

### 7. 다국어 지원
- 영어, 일본어 (해외 고객용)

### 8. 견적 계산기
- 인원, 메뉴 선택하면 대략적인 견적 제공

### 9. 리뷰/후기 섹션
- 고객 후기 표시
- 별점 시스템

### 10. 블로그 연동
- 네이버 블로그 RSS 연동하여 최신 글 표시

---

## 📝 메모

### 브랜드 색상
- **피콕그린**: RGB(1, 58, 70) / CMYK(95, 73, 63, 33)
- **베이지**: RGB(250, 243, 237) / CMYK(3, 6, 8, 0)

### 연락처
- 카카오톡: https://pf.kakao.com/_DTqwT
- 인스타그램: https://www.instagram.com/partybeen_catering/
- 블로그: https://blog.naver.com/partybeen
- 이메일: partybeen@naver.com
- 전화: 051-806-5644

---

*마지막 업데이트: 2025-12-08*
