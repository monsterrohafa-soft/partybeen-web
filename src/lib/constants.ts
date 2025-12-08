// 파티빈 연락처 정보
export const CONTACT = {
  phone: '051-806-5644',
  email: 'partybeen@naver.com',
  kakaoChannel: 'https://pf.kakao.com/_DTqwT',
  instagram: 'https://www.instagram.com/partybeen_catering/',
  blog: 'https://blog.naver.com/partybeen',
  youtubeVideo: 'https://youtu.be/jCiI6u95U9k',
} as const;

// 포트폴리오 카테고리
export const CATEGORIES = [
  { id: 'all', name: '전체', slug: 'all' },
  { id: 'catering', name: 'CATERING', slug: 'catering' },
  { id: 'food-box', name: 'FOOD BOX', slug: 'food-box' },
  { id: 'lunch-box', name: 'LUNCH BOX', slug: 'lunch-box' },
  { id: 'box-catering', name: 'BOX CATERING', slug: 'box-catering' },
] as const;

// 네비게이션 메뉴
export const NAV_ITEMS = [
  { name: '홈', href: '/' },
  { name: '포트폴리오', href: '/portfolio' },
  { name: '회사소개', href: '/about' },
  { name: '문의하기', href: '/contact' },
] as const;

// 브랜드 정보
export const BRAND = {
  name: 'PARTY BEEN',
  slogan: '특별한 순간을 만드는 케이터링',
  description: '파티빈 케이터링은 기업행사, 웨딩, 프라이빗 파티 등 모든 특별한 순간을 위한 프리미엄 케이터링 서비스를 제공합니다.',
} as const;
