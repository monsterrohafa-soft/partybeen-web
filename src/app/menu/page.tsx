'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { X, UtensilsCrossed } from 'lucide-react';

interface MenuCategory {
  id: string;
  name: string;
  slug: string;
}

interface Menu {
  id: string;
  name: string;
  description?: string;
  content?: string;
  price?: string;
  imageUrl: string;
  displayMode: 'MODAL' | 'DETAIL';
  category: MenuCategory;
}

export default function MenuPage() {
  const [menus, setMenus] = useState<Menu[]>([]);
  const [selectedMenu, setSelectedMenu] = useState<Menu | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await fetch('/api/menu');
        const data = await res.json();
        setMenus(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Failed to load menu data:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleMenuClick = (menu: Menu) => {
    if (menu.displayMode === 'DETAIL') {
      return;
    }
    setSelectedMenu(menu);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#025566]"></div>
      </div>
    );
  }

  return (
    <div className="py-8 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 페이지 헤더 */}
        <div className="text-center mb-10 sm:mb-14">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
            메뉴
          </h1>
          <p className="text-gray-500">
            파티빈의 다양한 케이터링 메뉴를 만나보세요
          </p>
        </div>

        {/* 메뉴 없을 때 */}
        {menus.length === 0 ? (
          <div className="text-center py-20 bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl">
            <UtensilsCrossed className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">등록된 메뉴가 없습니다</p>
          </div>
        ) : (
          /* 메뉴 그리드 */
          <motion.div
            layout
            className="grid grid-cols-3 gap-2 sm:gap-6"
          >
            <AnimatePresence mode="popLayout">
              {menus.map((menu) => (
                <motion.div
                  key={menu.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                >
                  {menu.displayMode === 'DETAIL' ? (
                    <Link
                      href={`/menu/${menu.id}`}
                      className="group block relative overflow-hidden rounded-2xl aspect-square shadow-card hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                    >
                      <MenuCard menu={menu} />
                    </Link>
                  ) : (
                    <button
                      onClick={() => handleMenuClick(menu)}
                      className="group block relative overflow-hidden rounded-2xl aspect-square shadow-card hover:shadow-xl transition-all duration-300 hover:-translate-y-1 w-full text-left"
                    >
                      <MenuCard menu={menu} />
                    </button>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* 문의 CTA */}
        <div className="mt-16 text-center">
          <p className="text-gray-600 mb-4">
            원하시는 메뉴가 있으신가요?
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
      </div>
    </div>
  );
}

function MenuCard({ menu }: { menu: Menu }) {
  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={menu.imageUrl}
        alt={menu.name}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
      />
      {/* 그라데이션 오버레이 */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
      {/* 정보 */}
      <div className="absolute inset-0 p-4 flex flex-col justify-end">
        <h3 className="text-lg font-bold text-white leading-tight mb-1">
          {menu.name}
        </h3>
        {menu.price && (
          <span className="text-sm text-[#FEE500] font-medium">{menu.price}</span>
        )}
      </div>
    </>
  );
}
