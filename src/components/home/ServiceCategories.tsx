'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { CATEGORIES } from '@/lib/constants';

// 카테고리별 샘플 이미지 및 설명 (나중에 실제 이미지로 교체)
const categoryDetails = {
  catering: {
    image: '/images/portfolio/catering-sample.jpg',
    description: '기업행사, 웨딩, 프라이빗 파티를 위한 프리미엄 출장 케이터링',
    placeholder: 'https://images.unsplash.com/photo-1555244162-803834f70033?w=600&h=400&fit=crop',
  },
  'food-box': {
    image: '/images/portfolio/foodbox-sample.jpg',
    description: '다양한 메뉴를 한 박스에 담은 스페셜 푸드 박스',
    placeholder: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&h=400&fit=crop',
  },
  'lunch-box': {
    image: '/images/portfolio/lunchbox-sample.jpg',
    description: '정성을 담은 프리미엄 도시락 서비스',
    placeholder: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&h=400&fit=crop',
  },
  'box-catering': {
    image: '/images/portfolio/boxcatering-sample.jpg',
    description: '소규모 행사에 적합한 박스형 케이터링',
    placeholder: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&h=400&fit=crop',
  },
};

export default function ServiceCategories() {
  const categories = CATEGORIES.filter((cat) => cat.id !== 'all');

  return (
    <section id="services" className="py-16 sm:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 섹션 헤더 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 sm:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            서비스 카테고리
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            파티빈의 다양한 케이터링 서비스를 만나보세요
          </p>
        </motion.div>

        {/* 카테고리 그리드 */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {categories.map((category, index) => {
            const details = categoryDetails[category.slug as keyof typeof categoryDetails];
            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Link
                  href={`/portfolio?category=${category.slug}`}
                  className="group block relative overflow-hidden rounded-2xl aspect-[3/4] sm:aspect-square"
                >
                  {/* 이미지 */}
                  <Image
                    src={details.placeholder}
                    alt={category.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 25vw"
                  />

                  {/* 오버레이 */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  {/* 텍스트 */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
                    <h3 className="text-lg sm:text-xl font-bold text-white mb-1 sm:mb-2">
                      {category.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-300 line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      {details.description}
                    </p>
                  </div>

                  {/* 호버 효과 */}
                  <div className="absolute inset-0 border-4 border-[#c9a962] opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
