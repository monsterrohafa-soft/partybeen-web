import { Metadata } from 'next';
import { Suspense } from 'react';
import CategoryFilter from '@/components/portfolio/CategoryFilter';
import GalleryGrid from '@/components/portfolio/GalleryGrid';
import prisma from '@/lib/prisma';
import { BRAND } from '@/lib/constants';

export const metadata: Metadata = {
  title: '포트폴리오',
  description: `${BRAND.name}의 다양한 케이터링 포트폴리오를 확인하세요.`,
};

// 동적 렌더링 (DB 데이터 실시간 반영)
export const dynamic = 'force-dynamic';

interface PortfolioPageProps {
  searchParams: Promise<{ category?: string }>;
}

// DB에서 포트폴리오 데이터 가져오기
async function getPortfolios(categorySlug?: string) {
  const portfolios = await prisma.portfolio.findMany({
    where: {
      isVisible: true,
      ...(categorySlug && categorySlug !== 'all'
        ? { category: { slug: categorySlug } }
        : {}),
    },
    include: {
      category: true,
    },
    orderBy: [{ orderIndex: 'asc' }, { createdAt: 'desc' }],
  });

  // GalleryGrid 컴포넌트용 데이터 형식으로 변환
  return portfolios.map((p) => ({
    id: p.id,
    title: p.title,
    description: p.description,
    image: p.imageUrl, // DB의 imageUrl을 image로 매핑
    imagePosition: p.imagePosition, // 이미지 위치
    category: p.category?.slug || 'catering',
    externalUrl: p.externalUrl, // 언론보도용 외부 링크
  }));
}

export default async function PortfolioPage({ searchParams }: PortfolioPageProps) {
  const params = await searchParams;
  const category = params.category || 'all';
  const items = await getPortfolios(category);

  return (
    <div className="py-8 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 페이지 헤더 */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            포트폴리오
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            파티빈이 만들어온 특별한 순간들을 확인해보세요
          </p>
        </div>

        {/* 카테고리 필터 */}
        <Suspense fallback={<div className="h-12" />}>
          <CategoryFilter currentCategory={category} />
        </Suspense>

        {/* 갤러리 그리드 */}
        {items.length > 0 ? (
          <GalleryGrid items={items} />
        ) : (
          <div className="text-center py-16 text-gray-500">
            해당 카테고리에 포트폴리오가 없습니다.
          </div>
        )}

        {/* 문의 CTA */}
        <div className="mt-16 text-center">
          <p className="text-gray-600 mb-4">
            마음에 드는 스타일이 있으신가요?
          </p>
          <a
            href="https://pf.kakao.com/_DTqwT"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-3 bg-[#FEE500] text-[#391B1B] font-semibold rounded-full hover:shadow-lg transition-all hover:-translate-y-0.5"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
              <path d="M12 3C6.48 3 2 6.58 2 11c0 2.83 1.89 5.32 4.71 6.72-.17.61-.64 2.21-.73 2.56-.12.45.16.44.34.32.14-.09 2.17-1.47 3.05-2.06.53.07 1.07.11 1.63.11 5.52 0 10-3.58 10-8S17.52 3 12 3z" />
            </svg>
            카카오톡 문의하기
          </a>
        </div>
      </div>
    </div>
  );
}
