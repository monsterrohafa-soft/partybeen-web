'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, Phone } from 'lucide-react';
import { NAV_ITEMS, CONTACT, BRAND } from '@/lib/constants';
import { motion, AnimatePresence } from 'framer-motion';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* 로고 */}
          <Link href="/" className="flex items-center">
            <span className="text-xl sm:text-2xl font-bold text-[#013A46] tracking-wider">
              {BRAND.name}
            </span>
          </Link>

          {/* 데스크톱 네비게이션 */}
          <nav className="hidden md:flex items-center gap-8">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm font-medium text-gray-700 hover:text-[#013A46] transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* 데스크톱 CTA 버튼 */}
          <div className="hidden md:flex items-center gap-4">
            <a
              href={`tel:${CONTACT.phone}`}
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-[#013A46] transition-colors"
            >
              <Phone size={16} />
              {CONTACT.phone}
            </a>
            <a
              href={CONTACT.kakaoChannel}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 bg-[#013A46] text-white text-sm font-medium rounded-full hover:bg-[#025566] transition-colors"
            >
              견적 문의
            </a>
          </div>

          {/* 모바일 메뉴 버튼 */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-gray-700"
            aria-label="메뉴 열기"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* 모바일 메뉴 */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t"
          >
            <nav className="flex flex-col py-4">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="px-6 py-3 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-[#025566]"
                >
                  {item.name}
                </Link>
              ))}
              <div className="px-6 py-4 border-t mt-2">
                <a
                  href={CONTACT.kakaoChannel}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full py-3 bg-[#FEE500] text-[#391B1B] text-center font-medium rounded-lg"
                >
                  카카오톡 문의
                </a>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
