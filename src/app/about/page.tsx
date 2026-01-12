import { Metadata } from 'next';
import Image from 'next/image';
import { BRAND, CONTACT } from '@/lib/constants';

export const metadata: Metadata = {
  title: '회사소개',
  description: `${BRAND.name} - ${BRAND.slogan}`,
};

export default function AboutPage() {
  return (
    <div>
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

      <div className="py-8 sm:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* 메인 이미지 */}
          <div className="mb-12">
            <Image
              src="/images/about-01.jpg"
              alt="파티빈 케이터링 소개"
              width={1200}
              height={1600}
              className="w-full h-auto rounded-2xl shadow-lg"
              priority
            />
          </div>

          {/* 카카오톡 문의 CTA */}
          <div className="text-center">
            <p className="text-gray-600 mb-4">
              문의사항이 있으신가요?
            </p>
            <a
              href={CONTACT.kakaoChannel}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-3 bg-[#FEE500] text-[#391B1B] font-semibold rounded-full hover:shadow-lg transition-shadow"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                <path d="M12 3C6.48 3 2 6.58 2 11c0 2.83 1.89 5.32 4.71 6.72-.17.61-.64 2.21-.73 2.56-.12.45.16.44.34.32.14-.09 2.17-1.47 3.05-2.06.53.07 1.07.11 1.63.11 5.52 0 10-3.58 10-8S17.52 3 12 3z" />
              </svg>
              카카오톡으로 문의하기
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
