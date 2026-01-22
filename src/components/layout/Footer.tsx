import Link from 'next/link';
import { Phone, Mail, ArrowUpRight } from 'lucide-react';
import { CONTACT, NAV_ITEMS, BRAND, SISTER_BRAND, COMPANY } from '@/lib/constants';

export default function Footer() {
  return (
    <footer className="bg-[#013A46] text-white relative overflow-hidden">
      {/* 배경 장식 */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#025566]/20 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8">
          {/* 브랜드 정보 - 더 넓게 */}
          <div className="md:col-span-5">
            <h3 className="text-2xl font-bold mb-4">{BRAND.nameKo}</h3>
            <p className="text-gray-300 text-sm leading-relaxed mb-6 max-w-sm">
              {BRAND.description}
            </p>

            {/* SNS 링크 */}
            <div className="flex gap-3">
              <a
                href={CONTACT.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 flex items-center justify-center rounded-xl bg-gradient-to-tr from-[#FFDC80] via-[#F56040] via-[#C13584] to-[#833AB4] hover:opacity-80 transition-opacity"
                aria-label="인스타그램"
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a
                href={CONTACT.blog}
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 flex items-center justify-center rounded-xl bg-[#03C75A] hover:opacity-80 transition-opacity text-sm font-bold"
                aria-label="네이버 블로그"
              >
                N
              </a>
              <a
                href={CONTACT.kakaoChannel}
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 flex items-center justify-center rounded-xl bg-[#FEE500] text-[#391B1B] hover:opacity-80 transition-opacity"
                aria-label="카카오톡 채널"
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                  <path d="M12 3C6.48 3 2 6.58 2 11c0 2.83 1.89 5.32 4.71 6.72-.17.61-.64 2.21-.73 2.56-.12.45.16.44.34.32.14-.09 2.17-1.47 3.05-2.06.53.07 1.07.11 1.63.11 5.52 0 10-3.58 10-8S17.52 3 12 3z" />
                </svg>
              </a>
            </div>

            {/* 자매 브랜드 */}
            <div className="mt-6 pt-6 border-t border-white/10">
              <p className="text-xs text-gray-400 mb-2">자매 브랜드</p>
              <a
                href={SISTER_BRAND.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-gray-300 hover:text-white transition-colors"
              >
                {SISTER_BRAND.nameKo}
                <ArrowUpRight size={14} />
              </a>
            </div>
          </div>

          {/* 메뉴 */}
          <div className="md:col-span-3">
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-5 text-gray-400">
              메뉴
            </h4>
            <nav className="flex flex-col gap-3">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="group flex items-center gap-1 text-gray-300 hover:text-white transition-colors text-sm"
                >
                  <span>{item.name}</span>
                  <ArrowUpRight
                    size={14}
                    className="opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all"
                  />
                </Link>
              ))}
            </nav>
          </div>

          {/* 연락처 */}
          <div className="md:col-span-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-5 text-gray-400">
              연락처
            </h4>
            <div className="flex flex-col gap-4">
              <a
                href={`tel:${CONTACT.phone}`}
                className="flex items-center gap-3 text-gray-300 hover:text-white transition-colors group"
              >
                <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/10 group-hover:bg-white/20 transition-colors">
                  <Phone size={18} />
                </div>
                <div>
                  <span className="text-xs text-gray-500 block">전화</span>
                  <span className="text-sm font-medium">{CONTACT.phone}</span>
                </div>
              </a>
              <a
                href={`mailto:${CONTACT.email}`}
                className="flex items-center gap-3 text-gray-300 hover:text-white transition-colors group"
              >
                <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/10 group-hover:bg-white/20 transition-colors">
                  <Mail size={18} />
                </div>
                <div>
                  <span className="text-xs text-gray-500 block">이메일</span>
                  <span className="text-sm font-medium">{CONTACT.email}</span>
                </div>
              </a>
            </div>
          </div>
        </div>

        {/* 구분선 */}
        <div className="border-t border-white/10 my-10" />

        {/* 회사 정보 */}
        <div className="text-xs text-gray-400 space-y-1 mb-8">
          <p>
            <span className="font-medium text-gray-300">상호</span> {COMPANY.name} |
            <span className="font-medium text-gray-300 ml-2">사업자등록번호</span> {COMPANY.businessNumber} |
            <span className="font-medium text-gray-300 ml-2">통신판매업 신고</span> {COMPANY.onlineSalesNumber}
          </p>
          <p>
            <span className="font-medium text-gray-300">전화</span> {COMPANY.phone} |
            <span className="font-medium text-gray-300 ml-2">주소</span> {COMPANY.address}
          </p>
          <p>
            <span className="font-medium text-gray-300">개인정보관리책임자</span> {COMPANY.privacyOfficer} {COMPANY.privacyEmail}
          </p>
        </div>

        {/* 하단 저작권 */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-400">
          <p>
            &copy; {new Date().getFullYear()} {BRAND.nameKo}. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-gray-300 transition-colors">
              개인정보처리방침
            </Link>
            <Link href="/terms" className="hover:text-gray-300 transition-colors">
              이용약관
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
