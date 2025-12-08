import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import MobileBottomBar from "@/components/layout/MobileBottomBar";
import { BRAND, CONTACT } from "@/lib/constants";

export const metadata: Metadata = {
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
  },
  robots: {
    index: true,
    follow: true,
  },
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
      </head>
      <body className="antialiased">
        <Header />
        <main className="min-h-screen pt-16 sm:pt-20 pb-20 md:pb-0">
          {children}
        </main>
        <Footer />
        <MobileBottomBar />
      </body>
    </html>
  );
}
