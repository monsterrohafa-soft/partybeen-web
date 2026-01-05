# 포트폴리오 관리 지침

## 이미지 추가 방법

1. 이미지를 `public/images/portfolio/` 폴더에 추가
2. `src/data/portfolio.ts`에 데이터 추가
3. git push로 배포

## 데이터 수정

`src/data/portfolio.ts`:
```typescript
export const portfolioItems: PortfolioItem[] = [
  {
    id: '1',
    title: '제목',
    category: 'catering', // catering, food-box, lunch-box, box-catering
    image: '/images/portfolio/파일명.jpg',
    description: '설명',
  },
  // ...
];
```

## 이미지 가이드

- WebP 또는 최적화된 JPEG 권장
- 외부 이미지: `next.config.ts`의 `remotePatterns`에 도메인 추가 필요
