'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, Phone, ChevronRight } from 'lucide-react';
import { NAV_ITEMS, CONTACT, BRAND } from '@/lib/constants';
import { motion, AnimatePresence } from 'framer-motion';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* 로고 */}
          <Link href="/" className="flex items-center group">
            <span className="text-xl sm:text-2xl font-bold tracking-wider text-[#013A46]">
              {BRAND.name}
            </span>
          </Link>

          {/* 데스크톱 네비게이션 */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="relative px-4 py-2 text-sm font-medium text-gray-700 hover:text-[#013A46] hover:bg-gray-100 transition-colors rounded-full"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* 데스크톱 CTA 버튼 */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href={`tel:${CONTACT.phone}`}
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-[#013A46] hover:bg-gray-100 transition-colors px-3 py-2 rounded-full"
            >
              <Phone size={16} />
              <span className="hidden lg:inline">{CONTACT.phone}</span>
            </a>
            <a
              href={CONTACT.kakaoChannel}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 text-sm font-medium rounded-full bg-[#013A46] text-white hover:bg-[#025566] hover:shadow-lg transition-all duration-300"
            >
              견적 문의
            </a>
          </div>

          {/* 모바일 메뉴 버튼 */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-full text-gray-700 hover:bg-gray-100 transition-colors"
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
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-white border-t shadow-lg"
          >
            <nav className="flex flex-col py-2">
              {NAV_ITEMS.map((item, index) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center justify-between px-6 py-4 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-[#025566] transition-colors"
                  >
                    <span>{item.name}</span>
                    <ChevronRight size={18} className="text-gray-400" />
                  </Link>
                </motion.div>
              ))}
              <div className="px-4 py-4 mt-2 border-t">
                <a
                  href={CONTACT.kakaoChannel}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3.5 bg-[#FEE500] text-[#391B1B] font-semibold rounded-xl transition-transform active:scale-[0.98]"
                >
                  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                    <path d="M12 3C6.48 3 2 6.58 2 11c0 2.83 1.89 5.32 4.71 6.72-.17.61-.64 2.21-.73 2.56-.12.45.16.44.34.32.14-.09 2.17-1.47 3.05-2.06.53.07 1.07.11 1.63.11 5.52 0 10-3.58 10-8S17.52 3 12 3z" />
                  </svg>
                  카카오톡 문의
                </a>
                <a
                  href={`tel:${CONTACT.phone}`}
                  className="flex items-center justify-center gap-2 w-full py-3.5 mt-2 bg-gray-100 text-gray-700 font-medium rounded-xl"
                >
                  <Phone size={18} />
                  {CONTACT.phone}
                </a>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
