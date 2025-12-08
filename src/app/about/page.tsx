import { Metadata } from 'next';
import Image from 'next/image';
import { BRAND, CONTACT } from '@/lib/constants';

export const metadata: Metadata = {
  title: '회사소개',
  description: `${BRAND.name} - ${BRAND.slogan}`,
};

export default function AboutPage() {
  return (
    <div className="py-8 sm:py-16">
      {/* 히어로 섹션 */}
      <section className="relative h-[300px] sm:h-[400px] flex items-center justify-center bg-gray-900">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-50"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1555244162-803834f70033?w=1920&h=600&fit=crop')`,
          }}
        />
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-3xl sm:text-5xl font-bold mb-4">{BRAND.name}</h1>
          <p className="text-lg sm:text-xl text-gray-200">{BRAND.slogan}</p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 브랜드 스토리 */}
        <section className="py-12 sm:py-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 text-center">
            파티빈 이야기
          </h2>
          <div className="prose prose-lg max-w-none text-gray-600 leading-relaxed">
            <p>
              파티빈은 부산을 대표하는 프리미엄 케이터링 서비스입니다.
              기업행사, 웨딩, 프라이빗 파티 등 모든 특별한 순간을 위한
              최상의 음식과 서비스를 제공합니다.
            </p>
            <p className="mt-4">
              신선한 재료와 정성을 담아 준비하는 파티빈의 음식은
              행사의 품격을 한층 높여드립니다. 고객님의 소중한 순간이
              더욱 특별해질 수 있도록 최선을 다하겠습니다.
            </p>
          </div>
        </section>

        {/* 서비스 특징 */}
        <section className="py-12 sm:py-16 border-t">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8 text-center">
            파티빈만의 특별함
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-[#c9a962]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🍽️</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">신선한 재료</h3>
              <p className="text-gray-600 text-sm">
                매일 엄선된 신선한 재료만을 사용합니다
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-[#c9a962]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">👨‍🍳</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">전문 셰프</h3>
              <p className="text-gray-600 text-sm">
                숙련된 전문 셰프들이 정성을 담아 조리합니다
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-[#c9a962]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">✨</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">맞춤 서비스</h3>
              <p className="text-gray-600 text-sm">
                고객님의 니즈에 맞는 맞춤 서비스를 제공합니다
              </p>
            </div>
          </div>
        </section>

        {/* 연락처 */}
        <section className="py-12 sm:py-16 border-t">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8 text-center">
            문의하기
          </h2>
          <div className="bg-gray-50 rounded-2xl p-6 sm:p-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">연락처</h3>
                <p className="text-gray-600">{CONTACT.phone}</p>
                <p className="text-gray-600">{CONTACT.email}</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">SNS</h3>
                <div className="flex gap-3">
                  <a
                    href={CONTACT.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-[#c9a962]"
                  >
                    인스타그램
                  </a>
                  <a
                    href={CONTACT.blog}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-[#c9a962]"
                  >
                    블로그
                  </a>
                </div>
              </div>
            </div>
            <div className="mt-6 text-center">
              <a
                href={CONTACT.kakaoChannel}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-8 py-3 bg-[#FEE500] text-[#391B1B] font-medium rounded-full hover:opacity-90 transition-opacity"
              >
                카카오톡으로 문의하기
              </a>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
