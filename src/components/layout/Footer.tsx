import Link from 'next/link';
import { Instagram, Phone, Mail } from 'lucide-react';
import { CONTACT, NAV_ITEMS, BRAND } from '@/lib/constants';

export default function Footer() {
  return (
    <footer className="bg-[#2d2d2d] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {/* 브랜드 정보 */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-[#c9a962]">{BRAND.name}</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              {BRAND.description}
            </p>
          </div>

          {/* 메뉴 */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-4">
              메뉴
            </h4>
            <nav className="flex flex-col gap-2">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-gray-400 hover:text-[#c9a962] transition-colors text-sm"
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* 연락처 */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-4">
              연락처
            </h4>
            <div className="flex flex-col gap-3 text-sm text-gray-400">
              <a
                href={`tel:${CONTACT.phone}`}
                className="flex items-center gap-2 hover:text-[#c9a962] transition-colors"
              >
                <Phone size={16} />
                {CONTACT.phone}
              </a>
              <a
                href={`mailto:${CONTACT.email}`}
                className="flex items-center gap-2 hover:text-[#c9a962] transition-colors"
              >
                <Mail size={16} />
                {CONTACT.email}
              </a>
            </div>

            {/* SNS 링크 */}
            <div className="flex gap-4 mt-6">
              <a
                href={CONTACT.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-700 hover:bg-[#c9a962] transition-colors"
                aria-label="인스타그램"
              >
                <Instagram size={18} />
              </a>
              <a
                href={CONTACT.blog}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-700 hover:bg-[#c9a962] transition-colors text-xs font-bold"
                aria-label="네이버 블로그"
              >
                N
              </a>
              <a
                href={CONTACT.kakaoChannel}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center rounded-full bg-[#FEE500] text-[#391B1B] hover:opacity-80 transition-opacity"
                aria-label="카카오톡 채널"
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                  <path d="M12 3C6.48 3 2 6.58 2 11c0 2.83 1.89 5.32 4.71 6.72-.17.61-.64 2.21-.73 2.56-.12.45.16.44.34.32.14-.09 2.17-1.47 3.05-2.06.53.07 1.07.11 1.63.11 5.52 0 10-3.58 10-8S17.52 3 12 3z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* 하단 저작권 */}
        <div className="mt-12 pt-8 border-t border-gray-700 text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} {BRAND.name}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
