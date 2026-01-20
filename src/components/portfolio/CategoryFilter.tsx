'use client';

import { useRouter } from 'next/navigation';
import { CATEGORIES } from '@/lib/constants';

interface CategoryFilterProps {
  currentCategory: string;
}

export default function CategoryFilter({ currentCategory }: CategoryFilterProps) {
  const router = useRouter();

  const handleCategoryChange = (slug: string) => {
    if (slug === 'all') {
      router.push('/portfolio');
    } else {
      router.push(`/portfolio?category=${slug}`);
    }
  };

  return (
    <div className="mb-8 sm:mb-12">
      {/* 모바일: 가로 스크롤 / 데스크톱: 중앙 정렬 */}
      <div className="flex sm:justify-center overflow-x-auto scrollbar-hide pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
        <div className="flex gap-2 sm:gap-3 sm:flex-wrap sm:justify-center">
          {CATEGORIES.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryChange(category.slug)}
              className={`flex-shrink-0 px-5 sm:px-6 py-3 sm:py-2.5 rounded-full text-sm font-medium transition-all min-h-[44px] touch-manipulation ${
                currentCategory === category.slug
                  ? 'bg-[#2d2d2d] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 active:bg-gray-300 active:scale-95'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
