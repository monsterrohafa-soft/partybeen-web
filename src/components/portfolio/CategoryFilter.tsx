'use client';

import { useRouter, useSearchParams } from 'next/navigation';
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
    <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-8 sm:mb-12">
      {CATEGORIES.map((category) => (
        <button
          key={category.id}
          onClick={() => handleCategoryChange(category.slug)}
          className={`px-4 sm:px-6 py-2 sm:py-2.5 rounded-full text-sm font-medium transition-all ${
            currentCategory === category.slug
              ? 'bg-[#2d2d2d] text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
}
