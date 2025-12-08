export interface PortfolioItem {
  id: string;
  title: string;
  category: 'catering' | 'food-box' | 'lunch-box' | 'box-catering';
  image: string;
  description?: string;
  date?: string;
}

// 샘플 포트폴리오 데이터 (실제 이미지로 교체 필요)
export const portfolioItems: PortfolioItem[] = [
  // CATERING
  {
    id: '1',
    title: '기업 신년회 케이터링',
    category: 'catering',
    image: 'https://images.unsplash.com/photo-1555244162-803834f70033?w=800&h=600&fit=crop',
    description: '100인 규모의 기업 신년회 프리미엄 케이터링',
  },
  {
    id: '2',
    title: '웨딩 피로연',
    category: 'catering',
    image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&h=600&fit=crop',
    description: '야외 웨딩 피로연 케이터링',
  },
  {
    id: '3',
    title: '브랜드 런칭 파티',
    category: 'catering',
    image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800&h=600&fit=crop',
    description: '신규 브랜드 런칭 이벤트 케이터링',
  },
  // FOOD BOX
  {
    id: '4',
    title: '프리미엄 푸드박스 A',
    category: 'food-box',
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=600&fit=crop',
    description: '다양한 메뉴를 한 박스에',
  },
  {
    id: '5',
    title: '시그니처 푸드박스',
    category: 'food-box',
    image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&h=600&fit=crop',
    description: '파티빈 시그니처 구성',
  },
  {
    id: '6',
    title: '한식 푸드박스',
    category: 'food-box',
    image: 'https://images.unsplash.com/photo-1498654896293-37aacf113fd9?w=800&h=600&fit=crop',
    description: '정성을 담은 한식 메뉴',
  },
  // LUNCH BOX
  {
    id: '7',
    title: '프리미엄 도시락',
    category: 'lunch-box',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&h=600&fit=crop',
    description: '건강한 프리미엄 도시락',
  },
  {
    id: '8',
    title: '회의용 도시락',
    category: 'lunch-box',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=600&fit=crop',
    description: '비즈니스 회의에 적합한 구성',
  },
  {
    id: '9',
    title: '행사용 도시락',
    category: 'lunch-box',
    image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&h=600&fit=crop',
    description: '대규모 행사를 위한 도시락',
  },
  // BOX CATERING
  {
    id: '10',
    title: '미니 박스 케이터링',
    category: 'box-catering',
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&h=600&fit=crop',
    description: '소규모 행사에 딱 맞는 구성',
  },
  {
    id: '11',
    title: '스탠다드 박스',
    category: 'box-catering',
    image: 'https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=800&h=600&fit=crop',
    description: '가장 인기 있는 구성',
  },
  {
    id: '12',
    title: '프리미엄 박스',
    category: 'box-catering',
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop',
    description: '특별한 날을 위한 프리미엄',
  },
];

export function getPortfolioByCategory(category: string): PortfolioItem[] {
  if (category === 'all') return portfolioItems;
  return portfolioItems.filter((item) => item.category === category);
}
