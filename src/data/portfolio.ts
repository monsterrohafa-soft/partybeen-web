export interface PortfolioItem {
  id: string;
  title: string;
  category: 'catering' | 'food-box' | 'lunch-box' | 'box-catering';
  image: string;
  description?: string;
  date?: string;
}

// 파티빈 포트폴리오 데이터 (partybeen.com에서 가져온 실제 이미지)
export const portfolioItems: PortfolioItem[] = [
  // CATERING
  {
    id: '1',
    title: '민락행정복지센터',
    category: 'catering',
    image: '/images/portfolio/812518548_1.jpg',
    description: '민락행정복지센터 케이터링',
  },
  {
    id: '2',
    title: '양산',
    category: 'catering',
    image: '/images/portfolio/846869710_1.JPG',
    description: '양산 케이터링',
  },
  {
    id: '3',
    title: '지안인터내셔널',
    category: 'catering',
    image: '/images/portfolio/811924488_1.JPG',
    description: '지안인터내셔널 케이터링',
  },
  {
    id: '4',
    title: '수산포럼',
    category: 'catering',
    image: '/images/portfolio/484800921_1.JPG',
    description: '수산포럼 케이터링',
  },
  {
    id: '5',
    title: '도모헌',
    category: 'catering',
    image: '/images/portfolio/982002390_1.jpg',
    description: '도모헌 케이터링',
  },
  {
    id: '6',
    title: '일본영사관',
    category: 'catering',
    image: '/images/portfolio/94329889_1.jpg',
    description: '일본영사관 케이터링',
  },
  // FOOD BOX
  {
    id: '7',
    title: '시슬리',
    category: 'food-box',
    image: '/images/portfolio/1982018076_1.JPG',
    description: '시슬리 푸드박스',
  },
  {
    id: '8',
    title: '마세라티',
    category: 'food-box',
    image: '/images/portfolio/1878678299_1.JPG',
    description: '마세라티 푸드박스',
  },
  {
    id: '9',
    title: '김해',
    category: 'food-box',
    image: '/images/portfolio/233458333_1.jpg',
    description: '김해 푸드박스',
  },
  {
    id: '10',
    title: '리컨벤션',
    category: 'food-box',
    image: '/images/portfolio/215751460_1.jpg',
    description: '리컨벤션 푸드박스',
  },
  // LUNCH BOX
  {
    id: '11',
    title: '고신대학교',
    category: 'lunch-box',
    image: '/images/portfolio/1150916187_1.jpg',
    description: '고신대학교 도시락',
  },
  {
    id: '12',
    title: '치과교정학회',
    category: 'lunch-box',
    image: '/images/portfolio/1971419380_1.jpg',
    description: '치과교정학회 도시락',
  },
  {
    id: '13',
    title: '도모헌',
    category: 'lunch-box',
    image: '/images/portfolio/1920721804_1.jpg',
    description: '도모헌 도시락',
  },
  {
    id: '14',
    title: '신라스테이',
    category: 'lunch-box',
    image: '/images/portfolio/1018930997_1.jpg',
    description: '신라스테이 도시락',
  },
  // BOX CATERING
  {
    id: '15',
    title: '센탑',
    category: 'box-catering',
    image: '/images/portfolio/2005674040_1.JPG',
    description: '센탑 박스케이터링',
  },
  {
    id: '16',
    title: '부산 국제저축은행',
    category: 'box-catering',
    image: '/images/portfolio/1626746175_1.JPG',
    description: '부산 국제저축은행 박스케이터링',
  },
  {
    id: '17',
    title: '고신대',
    category: 'box-catering',
    image: '/images/portfolio/1135681125_1.jpg',
    description: '고신대 박스케이터링',
  },
  {
    id: '18',
    title: '시네포엠',
    category: 'box-catering',
    image: '/images/portfolio/31945901_1.jpg',
    description: '시네포엠 박스케이터링',
  },
];

export function getPortfolioByCategory(category: string): PortfolioItem[] {
  if (category === 'all') return portfolioItems;
  return portfolioItems.filter((item) => item.category === category);
}
