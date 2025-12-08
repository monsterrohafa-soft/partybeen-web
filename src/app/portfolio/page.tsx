import { Metadata } from 'next';
import { Suspense } from 'react';
import CategoryFilter from '@/components/portfolio/CategoryFilter';
import GalleryGrid from '@/components/portfolio/GalleryGrid';
import { getPortfolioByCategory } from '@/data/portfolio';
import { BRAND } from '@/lib/constants';

export const metadata: Metadata = {
  title: '포트폴리오',
  description: `${BRAND.name}의 다양한 케이터링 포트폴리오를 확인하세요.`,
};

interface PortfolioPageProps {
  searchParams: Promise<{ category?: string }>;
}

export default async function PortfolioPage({ searchParams }: PortfolioPageProps) {
  const params = await searchParams;
  const category = params.category || 'all';
  const items = getPortfolioByCategory(category);

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
            className="inline-block px-8 py-3 bg-[#025566] text-white font-medium rounded-full hover:bg-[#013A46] transition-colors"
          >
            견적 문의하기
          </a>
        </div>
      </div>
    </div>
  );
}
