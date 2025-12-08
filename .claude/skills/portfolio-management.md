# 포트폴리오 관리 Skill

**목적**: partybeen 포트폴리오 이미지 추가/수정 표준화

## 🎯 이 Skill을 사용해야 하는 상황

### ✅ 자동 실행 트리거

다음 키워드가 포함된 사용자 요청 시 **자동으로 이 Skill 실행**:
- 포트폴리오, portfolio
- 이미지 추가, 사진 추가
- 갤러리
- partybeen.com에서 가져오기

---

## 📋 포트폴리오 이미지 추가 프로세스

### 1단계: 이미지 파일 준비

**저장 위치:**
```
/mnt/nas/backup/app/partybeen/public/images/portfolio/
```

**파일명 규칙:**
- 카테고리-숫자.jpg (예: catering-01.jpg, food-box-01.jpg)
- 영문 소문자, 하이픈 사용
- 확장자: jpg, jpeg, png, webp

**이미지 최적화 권장:**
- 최대 너비: 1200px
- 파일 크기: 500KB 이하
- 형식: WebP 또는 최적화된 JPEG

### 2단계: 데이터 파일 수정

**파일 위치:** `src/data/portfolio.ts`

```typescript
export const portfolioItems: PortfolioItem[] = [
  {
    id: '1',
    title: '기업 행사 케이터링',
    category: 'catering',  // catering | food-box | lunch-box | box-catering
    image: '/images/portfolio/catering-01.jpg',
    description: '50인 기업 세미나 케이터링',
  },
  // 새 항목 추가...
];
```

**카테고리 종류:**
- `catering` - 출장 케이터링
- `food-box` - 푸드박스
- `lunch-box` - 도시락
- `box-catering` - 박스 케이터링

### 3단계: 배포

```bash
cd /mnt/nas/backup/app/partybeen
git add .
git commit -m "📸 포트폴리오 이미지 추가: [설명]"
git push origin main
```

---

## 🌐 외부 사이트에서 이미지 가져오기

### partybeen.com에서 이미지 가져오기

**1. 이미지 URL 확인:**
- 기존 사이트 (http://www.partybeen.com) 접속
- 개발자 도구(F12) → Network 탭에서 이미지 URL 확인
- 또는 이미지 우클릭 → 이미지 주소 복사

**2. 이미지 다운로드:**
```bash
# 예시: 이미지 다운로드
cd /mnt/nas/backup/app/partybeen/public/images/portfolio
wget "http://www.partybeen.com/path/to/image.jpg" -O catering-01.jpg
```

**3. 외부 이미지 직접 사용 (다운로드 없이):**

`next.config.ts`에 도메인 추가:
```typescript
const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'www.partybeen.com',
      },
    ],
  },
};
```

그 후 portfolio.ts에서:
```typescript
{
  id: '1',
  title: '케이터링',
  category: 'catering',
  image: 'http://www.partybeen.com/path/to/image.jpg',
  description: '설명',
},
```

---

## 🛠️ 문제 해결

### 문제 1: 이미지가 안 보임

**체크리스트:**
- [ ] 파일이 `public/images/portfolio/`에 있는가?
- [ ] 경로가 `/images/portfolio/파일명.jpg`로 시작하는가?
- [ ] 파일명에 한글이나 공백이 없는가?
- [ ] 파일 확장자가 올바른가?

### 문제 2: 외부 이미지 에러

**에러 메시지:**
```
Error: Invalid src prop on next/image
```

**해결:** `next.config.ts`에 해당 도메인 추가

### 문제 3: 카테고리 필터 안 됨

**원인:** category 값이 정의된 값과 다름

**확인:** `src/data/portfolio.ts`에서 CATEGORIES 배열 확인
```typescript
export const CATEGORIES = [
  { id: 'all', name: '전체' },
  { id: 'catering', name: '출장 케이터링' },
  { id: 'food-box', name: '푸드박스' },
  { id: 'lunch-box', name: '도시락' },
  { id: 'box-catering', name: '박스 케이터링' },
];
```

---

## 📁 관련 파일

- **포트폴리오 데이터**: `src/data/portfolio.ts`
- **이미지 폴더**: `public/images/portfolio/`
- **갤러리 컴포넌트**: `src/components/portfolio/GalleryGrid.tsx`
- **카테고리 필터**: `src/components/portfolio/CategoryFilter.tsx`
- **Next.js 설정**: `next.config.ts`

---

**마지막 업데이트**: 2024-12-08
