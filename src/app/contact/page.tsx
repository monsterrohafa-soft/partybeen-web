import { Metadata } from 'next';
import { Phone, Mail, MessageCircle, Instagram } from 'lucide-react';
import { BRAND, CONTACT } from '@/lib/constants';

export const metadata: Metadata = {
  title: '문의하기',
  description: `${BRAND.name}에 문의하세요. 친절하고 빠른 상담을 약속드립니다.`,
};

export default function ContactPage() {
  return (
    <div className="py-8 sm:py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 페이지 헤더 */}
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            문의하기
          </h1>
          <p className="text-gray-600">
            언제든지 편하게 문의해 주세요. 친절하고 빠른 상담을 약속드립니다.
          </p>
        </div>

        {/* 카카오톡 (가장 강조) */}
        <div className="mb-8">
          <a
            href={CONTACT.kakaoChannel}
            target="_blank"
            rel="noopener noreferrer"
            className="block p-6 sm:p-8 bg-[#FEE500] rounded-2xl text-center hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center justify-center gap-3 mb-3">
              <svg viewBox="0 0 24 24" className="w-8 h-8 fill-[#391B1B]">
                <path d="M12 3C6.48 3 2 6.58 2 11c0 2.83 1.89 5.32 4.71 6.72-.17.61-.64 2.21-.73 2.56-.12.45.16.44.34.32.14-.09 2.17-1.47 3.05-2.06.53.07 1.07.11 1.63.11 5.52 0 10-3.58 10-8S17.52 3 12 3z"/>
              </svg>
              <span className="text-xl sm:text-2xl font-bold text-[#391B1B]">
                카카오톡 문의
              </span>
            </div>
            <p className="text-[#391B1B]/80">가장 빠른 답변을 받으실 수 있어요!</p>
          </a>
        </div>

        {/* 다른 연락 방법 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
          {/* 전화 */}
          <a
            href={`tel:${CONTACT.phone}`}
            className="flex items-center gap-4 p-5 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
          >
            <div className="w-12 h-12 bg-[#c9a962] rounded-full flex items-center justify-center text-white">
              <Phone size={20} />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">전화 문의</h3>
              <p className="text-gray-600">{CONTACT.phone}</p>
            </div>
          </a>

          {/* 이메일 */}
          <a
            href={`mailto:${CONTACT.email}`}
            className="flex items-center gap-4 p-5 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
          >
            <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center text-white">
              <Mail size={20} />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">이메일 문의</h3>
              <p className="text-gray-600 text-sm break-all">{CONTACT.email}</p>
            </div>
          </a>
        </div>

        {/* SNS */}
        <div className="border-t pt-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 text-center">
            SNS에서 더 많은 소식을 만나보세요
          </h2>
          <div className="flex justify-center gap-4">
            <a
              href={CONTACT.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full hover:opacity-90 transition-opacity"
            >
              <Instagram size={18} />
              인스타그램
            </a>
            <a
              href={CONTACT.blog}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-3 bg-[#03C75A] text-white rounded-full hover:opacity-90 transition-opacity"
            >
              <span className="font-bold">N</span>
              블로그
            </a>
          </div>
        </div>

        {/* 운영 시간 */}
        <div className="mt-12 p-6 bg-gray-50 rounded-xl text-center">
          <h3 className="font-semibold text-gray-900 mb-2">운영 시간</h3>
          <p className="text-gray-600">평일 09:00 - 18:00</p>
          <p className="text-gray-500 text-sm mt-1">주말 및 공휴일 휴무</p>
        </div>
      </div>
    </div>
  );
}
