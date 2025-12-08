# 파티빈 케이터링 웹사이트 프로젝트 지침

## 프로젝트 개요
- **프로젝트명**: PartyBeen Catering Website
- **기술 스택**: Next.js 16 + TypeScript + Tailwind CSS
- **배포**: Vercel (GitHub 연동 자동 배포)
- **GitHub**: monsterrohafa-soft/partybeen-web

## 경로 정보
- **NAS 경로**: `/volume1/backup/app/partybeen`
- **로컬 마운트**: `/mnt/nas/backup/app/partybeen`

## 개발 워크플로우

### 일반적인 작업 흐름
```
코드 수정 → git add → git commit → git push → Vercel 자동 배포 (1-2분)
```

### 빌드 및 테스트
```bash
# 개발 서버 실행 (NAS에서)
ssh rohafa2@rohafa88.synology.me "export PATH=/usr/local/bin:\$PATH && cd /volume1/backup/app/partybeen && npm run dev"

# 빌드 테스트
ssh rohafa2@rohafa88.synology.me "export PATH=/usr/local/bin:\$PATH && cd /volume1/backup/app/partybeen && npm run build"
```

### 배포 (git push만 하면 자동)
```bash
cd /volume1/backup/app/partybeen
git add .
git commit -m "변경 내용"
git push
```

## 디렉토리 구조
```
partybeen/
├── src/
│   ├── app/                    # 페이지 라우트
│   │   ├── page.tsx            # 메인 페이지
│   │   ├── about/              # 회사소개
│   │   ├── portfolio/          # 포트폴리오
│   │   └── contact/            # 문의하기
│   ├── components/
│   │   ├── layout/             # 레이아웃 컴포넌트
│   │   ├── home/               # 메인 페이지 섹션
│   │   └── portfolio/          # 포트폴리오 컴포넌트
│   ├── data/
│   │   └── portfolio.ts        # 포트폴리오 데이터
│   └── lib/
│       └── constants.ts        # 상수 (연락처 등)
└── public/
    └── images/                 # 이미지 파일
```

## 연락처 정보 수정

`src/lib/constants.ts` 파일에서 수정:
```typescript
export const CONTACT = {
  phone: '051-806-5644',
  email: 'partybeen@naver.com',
  kakaoChannel: 'https://pf.kakao.com/_DTqwT',
  // ...
};
```

## 포트폴리오 추가/수정

`src/data/portfolio.ts` 파일에서 수정:
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

## 이미지 추가
1. 이미지를 `public/images/portfolio/` 폴더에 추가
2. `src/data/portfolio.ts`에 데이터 추가
3. git push로 배포

## 주의사항
- 이미지는 WebP 또는 최적화된 JPEG 사용 권장
- 외부 이미지는 `next.config.ts`의 `remotePatterns`에 도메인 추가 필요
- 모바일 최적화: 터치 타겟 최소 44px × 44px

## 트러블슈팅

### 빌드 에러 시
```bash
# node_modules 재설치
ssh rohafa2@rohafa88.synology.me "export PATH=/usr/local/bin:\$PATH && cd /volume1/backup/app/partybeen && rm -rf node_modules && npm install"
```

### Vercel 배포 실패 시
- Vercel 대시보드에서 로그 확인
- 빌드 에러 메시지 확인 후 수정
