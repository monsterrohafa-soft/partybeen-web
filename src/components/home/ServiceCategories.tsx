'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, X, UtensilsCrossed } from 'lucide-react';

interface Menu {
  id: string;
  name: string;
  description?: string;
  content?: string;
  price?: string;
  imageUrl: string;
  displayMode: 'MODAL' | 'DETAIL';
}

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
  const [menus, setMenus] = useState<Menu[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMenu, setSelectedMenu] = useState<Menu | null>(null);

  useEffect(() => {
    const loadMenus = async () => {
      try {
        const res = await fetch('/api/menu');
        const data = await res.json();
        // 최대 6개만 가져오기
        setMenus(Array.isArray(data) ? data.slice(0, 6) : []);
      } catch (error) {
        console.error('Failed to load menus:', error);
      } finally {
        setLoading(false);
      }
    };
    loadMenus();
  }, []);

  const handleMenuClick = (menu: Menu) => {
    if (menu.displayMode === 'DETAIL') {
      return; // Link로 처리됨
    }
    setSelectedMenu(menu);
  };

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
            Our Menu
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            메뉴
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            파티빈의 다양한 케이터링 메뉴를 만나보세요
          </p>
        </motion.div>

        {/* 로딩 상태 */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#025566]"></div>
          </div>
        ) : menus.length === 0 ? (
          <div className="text-center py-20 bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl">
            <UtensilsCrossed className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">등록된 메뉴가 없습니다</p>
          </div>
        ) : (
          /* 메뉴 그리드 - 6개 (2x3 모바일, 3x2 데스크톱) */
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6"
          >
            {menus.map((menu) => (
              <motion.div key={menu.id} variants={itemVariants}>
                {menu.displayMode === 'DETAIL' ? (
                  <Link
                    href={`/menu/${menu.id}`}
                    className="group block relative overflow-hidden rounded-2xl sm:rounded-3xl aspect-square shadow-card hover-lift"
                  >
                    <MenuCard menu={menu} />
                  </Link>
                ) : (
                  <button
                    onClick={() => handleMenuClick(menu)}
                    className="group block relative overflow-hidden rounded-2xl sm:rounded-3xl aspect-square shadow-card hover-lift w-full text-left"
                  >
                    <MenuCard menu={menu} />
                  </button>
                )}
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* 하단 CTA - 메뉴 페이지로 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-16"
        >
          <Link
            href="/menu"
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#013A46] text-white font-semibold rounded-full hover:bg-[#025566] transition-all duration-300 hover:shadow-lg hover:shadow-[#013A46]/20"
          >
            <span>전체 메뉴 보기</span>
            <ArrowRight size={18} />
          </Link>
        </motion.div>
      </div>

      {/* 모달 */}
      <AnimatePresence>
        {selectedMenu && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedMenu(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* 이미지 */}
              <div className="relative aspect-video">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={selectedMenu.imageUrl}
                  alt={selectedMenu.name}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => setSelectedMenu(null)}
                  className="absolute top-4 right-4 w-10 h-10 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* 내용 */}
              <div className="p-6">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {selectedMenu.name}
                  </h2>
                  {selectedMenu.price && (
                    <span className="text-lg font-bold text-[#025566] whitespace-nowrap">
                      {selectedMenu.price}
                    </span>
                  )}
                </div>

                {selectedMenu.description && (
                  <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                    {selectedMenu.description}
                  </p>
                )}

                {selectedMenu.content && (
                  <div className="mt-4 pt-4 border-t">
                    <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-wrap">
                      {selectedMenu.content}
                    </div>
                  </div>
                )}

                {/* 문의 버튼 */}
                <div className="mt-6 pt-4 border-t">
                  <a
                    href="https://pf.kakao.com/_DTqwT"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full py-3 bg-[#FEE500] text-[#391B1B] font-semibold rounded-xl text-center hover:shadow-lg transition-shadow"
                  >
                    카카오톡으로 문의하기
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

function MenuCard({ menu }: { menu: Menu }) {
  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={menu.imageUrl}
        alt={menu.name}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
      />

      {/* 그라디언트 오버레이 */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#013A46]/95 via-[#013A46]/40 to-transparent" />

      {/* 콘텐츠 */}
      <div className="absolute inset-0 p-4 sm:p-6 flex flex-col justify-end">
        <div className="transform transition-transform duration-300 group-hover:translate-y-0">
          <h3 className="text-lg sm:text-xl font-bold text-white mb-1 sm:mb-2">
            {menu.name}
          </h3>
          {menu.price && (
            <span className="text-sm text-[#FEE500] font-medium">{menu.price}</span>
          )}
        </div>
      </div>

      {/* 호버 시 테두리 */}
      <div className="absolute inset-0 rounded-2xl sm:rounded-3xl ring-2 ring-white/0 group-hover:ring-white/30 transition-all duration-300" />
    </>
  );
}
