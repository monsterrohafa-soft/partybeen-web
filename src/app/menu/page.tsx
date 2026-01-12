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
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [menus, setMenus] = useState<Menu[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedMenu, setSelectedMenu] = useState<Menu | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [categoriesRes, menusRes] = await Promise.all([
          fetch('/api/menu-categories'),
          fetch('/api/menu'),
        ]);
        const categoriesData = await categoriesRes.json();
        const menusData = await menusRes.json();
        setCategories(Array.isArray(categoriesData) ? categoriesData : []);
        setMenus(Array.isArray(menusData) ? menusData : []);
      } catch (error) {
        console.error('Failed to load menu data:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const filteredMenus = selectedCategory === 'all'
    ? menus
    : menus.filter(menu => menu.category.slug === selectedCategory);

  const handleMenuClick = (menu: Menu) => {
    if (menu.displayMode === 'DETAIL') {
      // 상세페이지로 이동은 Link로 처리
      return;
    }
    // 모달로 표시
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
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#025566] to-[#013A46] rounded-2xl mb-4 shadow-lg">
            <UtensilsCrossed className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
            메뉴
          </h1>
          <p className="text-gray-500">
            파티빈의 다양한 케이터링 메뉴를 만나보세요
          </p>
        </div>

        {/* 카테고리 필터 */}
        {categories.length > 0 && (
          <div className="flex justify-center gap-2 mb-10 flex-wrap">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                selectedCategory === 'all'
                  ? 'bg-[#025566] text-white shadow-lg'
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              전체
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.slug)}
                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === cat.slug
                    ? 'bg-[#025566] text-white shadow-lg'
                    : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        )}

        {/* 메뉴 없을 때 */}
        {filteredMenus.length === 0 ? (
          <div className="text-center py-20 bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl">
            <UtensilsCrossed className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">등록된 메뉴가 없습니다</p>
          </div>
        ) : (
          /* 메뉴 그리드 */
          <motion.div
            layout
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6"
          >
            <AnimatePresence mode="popLayout">
              {filteredMenus.map((menu) => (
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
                    <div>
                      <span className="text-sm text-[#025566] font-medium">
                        {selectedMenu.category.name}
                      </span>
                      <h2 className="text-2xl font-bold text-gray-900 mt-1">
                        {selectedMenu.name}
                      </h2>
                    </div>
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
        <span className="text-xs text-white/70 mb-1">{menu.category.name}</span>
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
