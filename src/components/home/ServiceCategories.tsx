'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { CATEGORIES } from '@/lib/constants';

// 카테고리별 샘플 이미지 및 설명
const categoryDetails = {
  catering: {
    image: '/images/portfolio/812518548_1.jpg',
    description: '기업행사, 웨딩, 프라이빗 파티를 위한 프리미엄 출장 케이터링',
    icon: '🎉',
  },
  'food-box': {
    image: '/images/portfolio/1982018076_1.jpg',
    description: '다양한 메뉴를 한 박스에 담은 스페셜 푸드 박스',
    icon: '📦',
  },
  'lunch-box': {
    image: '/images/portfolio/1150916187_1.jpg',
    description: '정성을 담은 프리미엄 도시락 서비스',
    icon: '🍱',
  },
  'box-catering': {
    image: '/images/portfolio/2005674040_1.jpg',
    description: '소규모 행사에 적합한 박스형 케이터링',
    icon: '🎁',
  },
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' as const },
  },
};

export default function ServiceCategories() {
  const categories = CATEGORIES.filter((cat) => cat.id !== 'all');

  return (
    <section id="services" className="py-20 sm:py-32 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden">
      {/* 배경 장식 */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-[#025566]/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#025566]/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* 섹션 헤더 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 sm:mb-20"
        >
          <span className="inline-block px-4 py-1.5 mb-4 text-sm font-medium text-[#025566] bg-[#025566]/10 rounded-full">
            Our Services
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            서비스 카테고리
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            파티빈의 다양한 케이터링 서비스를 만나보세요
          </p>
        </motion.div>

        {/* 카테고리 그리드 */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8"
        >
          {categories.map((category) => {
            const details = categoryDetails[category.slug as keyof typeof categoryDetails];
            if (!details) return null;
            return (
              <motion.div key={category.id} variants={itemVariants}>
                <Link
                  href={`/portfolio?category=${category.slug}`}
                  className="group block relative overflow-hidden rounded-3xl aspect-[4/5] shadow-card hover-lift"
                >
                  {/* 이미지 */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={details.image}
                    alt={category.name}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />

                  {/* 그라디언트 오버레이 */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#013A46]/95 via-[#013A46]/40 to-transparent" />

                  {/* 콘텐츠 */}
                  <div className="absolute inset-0 p-6 flex flex-col justify-end">
                    {/* 아이콘 뱃지 */}
                    <div className="absolute top-4 right-4 w-12 h-12 glass rounded-2xl flex items-center justify-center text-2xl opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                      {details.icon}
                    </div>

                    <div className="transform transition-transform duration-300 group-hover:translate-y-0">
                      <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
                        {category.name}
                      </h3>
                      <p className="text-sm text-gray-200 mb-4 line-clamp-2 opacity-80 group-hover:opacity-100 transition-opacity">
                        {details.description}
                      </p>

                      {/* 더보기 버튼 */}
                      <div className="flex items-center gap-2 text-white/80 group-hover:text-white transition-colors">
                        <span className="text-sm font-medium">자세히 보기</span>
                        <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                      </div>
                    </div>
                  </div>

                  {/* 호버 시 테두리 */}
                  <div className="absolute inset-0 rounded-3xl ring-2 ring-white/0 group-hover:ring-white/30 transition-all duration-300" />
                </Link>
              </motion.div>
            );
          })}
        </motion.div>

        {/* 하단 CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-16"
        >
          <Link
            href="/portfolio"
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#013A46] text-white font-semibold rounded-full hover:bg-[#025566] transition-all duration-300 hover:shadow-lg hover:shadow-[#013A46]/20"
          >
            <span>전체 포트폴리오 보기</span>
            <ArrowRight size={18} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
