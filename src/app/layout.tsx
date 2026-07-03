import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import MobileBottomBar from "@/components/layout/MobileBottomBar";
import { BRAND, CONTACT, COMPANY, SISTER_BRAND } from "@/lib/constants";

export const metadata: Metadata = {
  metadataBase: new URL('https://www.partybeen.com'),
  title: {
    default: `${BRAND.name} | 부산 프리미엄 케이터링`,
    template: `%s | ${BRAND.name}`,
  },
  description: BRAND.description,
  keywords: ['케이터링', '부산 케이터링', '출장 케이터링', '기업행사', '웨딩 케이터링', '파티빈', '푸드박스', '도시락'],
  openGraph: {
    title: `${BRAND.name} | 부산 프리미엄 케이터링`,
    description: BRAND.description,
    type: 'website',
    locale: 'ko_KR',
    images: [
      {
        url: '/logo/main.png',
        width: 800,
        height: 400,
        alt: BRAND.name,
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
  },
};

// AI 엔진·검색엔진용 사업장 정보 (schema.org)
const businessJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FoodEstablishment',
  name: BRAND.nameKo,
  alternateName: BRAND.nameEn,
  description: BRAND.description,
  url: 'https://www.partybeen.com',
  image: 'https://www.partybeen.com/logo/main.png',
  telephone: COMPANY.phone,
  email: CONTACT.email,
  address: {
    '@type': 'PostalAddress',
    streetAddress: '과정로344번길 43 (연산동) 1층',
    addressLocality: '연제구',
    addressRegion: '부산광역시',
    addressCountry: 'KR',
  },
  servesCuisine: '케이터링, 한식',
  areaServed: '부산광역시 및 경남 일대',
  taxID: COMPANY.businessNumber,
  sameAs: [CONTACT.instagram, CONTACT.blog, SISTER_BRAND.url],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        {/* Pretendard 폰트 */}
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(businessJsonLd) }}
        />
      </head>
      <body className="antialiased">
        <Header />
        <main className="min-h-screen pt-24 sm:pt-28 pb-20 md:pb-0">
          {children}
        </main>
        <Footer />
        <MobileBottomBar />
      </body>
    </html>
  );
}
