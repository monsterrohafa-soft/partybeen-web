'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink } from 'lucide-react';

// DB에서 가져온 포트폴리오 아이템 타입
interface PortfolioItem {
  id: string;
  title: string;
  description?: string | null;
  image: string;
  imagePosition?: string | null; // 이미지 위치 (예: "50% 30%")
  category: string;
  externalUrl?: string | null; // 언론보도용 외부 링크
}

interface GalleryGridProps {
  items: PortfolioItem[];
}

export default function GalleryGrid({ items }: GalleryGridProps) {
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);

  // 아이템 클릭 핸들러
  const handleItemClick = (item: PortfolioItem) => {
    if (item.externalUrl) {
      // 언론보도: 외부 링크로 이동
      window.open(item.externalUrl, '_blank', 'noopener,noreferrer');
    } else {
      // 일반 포트폴리오: 모달 열기
      setSelectedItem(item);
    }
  };

  return (
    <>
      {/* 갤러리 그리드 */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
        {items.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
            className="group cursor-pointer"
            onClick={() => handleItemClick(item)}
          >
            <div className="relative aspect-square overflow-hidden rounded-xl bg-gray-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.image}
                alt={item.title}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                style={{ objectPosition: item.imagePosition || '50% 50%' }}
              />
              {/* 오버레이 */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300" />

              {/* 호버 시 텍스트 */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="text-white font-medium text-sm sm:text-base px-4 text-center">
                  {item.title}
                </span>
              </div>

              {/* 외부 링크 아이콘 (언론보도) */}
              {item.externalUrl && (
                <div className="absolute top-2 right-2 p-1.5 bg-white/90 rounded-full shadow opacity-0 group-hover:opacity-100 transition-opacity">
                  <ExternalLink className="w-4 h-4 text-gray-700" />
                </div>
              )}
            </div>

            {/* 제목 (모바일) */}
            <div className="mt-2 sm:hidden">
              <h3 className="text-sm font-medium text-gray-900 truncate flex items-center gap-1">
                {item.title}
                {item.externalUrl && <ExternalLink className="w-3 h-3 text-gray-400" />}
              </h3>
            </div>
          </motion.div>
        ))}
      </div>

      {/* 이미지 모달 */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
            onClick={() => setSelectedItem(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-4xl w-full max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* 닫기 버튼 */}
              <button
                onClick={() => setSelectedItem(null)}
                className="absolute -top-12 right-0 text-white hover:text-[#025566] transition-colors"
                aria-label="닫기"
              >
                <X size={32} />
              </button>

              {/* 이미지 */}
              <div className="relative aspect-[4/3] bg-gray-900 rounded-lg overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={selectedItem.image}
                  alt={selectedItem.title}
                  className="absolute inset-0 w-full h-full object-contain"
                />
              </div>

              {/* 정보 */}
              <div className="mt-4 text-white">
                <h3 className="text-xl font-bold">{selectedItem.title}</h3>
                {selectedItem.description && (
                  <p className="mt-1 text-gray-400">{selectedItem.description}</p>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
