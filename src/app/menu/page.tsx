import { Metadata } from 'next';
import prisma from '@/lib/prisma';
import { BRAND } from '@/lib/constants';
import MenuGrid, { MenuItem } from '@/components/menu/MenuGrid';

export const metadata: Metadata = {
  title: '메뉴',
  description: `${BRAND.nameKo}의 프리미엄 케이터링 메뉴와 가격을 확인하세요.`,
};

// 동적 렌더링 (DB 데이터 실시간 반영)
export const dynamic = 'force-dynamic';

const BASE_URL = 'https://www.partybeen.com';

async function getMenus(): Promise<MenuItem[]> {
  try {
    const menus = await prisma.menu.findMany({
      where: { isVisible: true },
      include: { category: true },
      orderBy: [{ category: { orderIndex: 'asc' } }, { orderIndex: 'asc' }],
    });

    return menus.map((m) => ({
      id: m.id,
      name: m.name,
      description: m.description,
      content: m.content,
      price: m.price,
      imageUrl: m.imageUrl,
      displayMode: m.displayMode,
      category: {
        id: m.category.id,
        name: m.category.name,
        slug: m.category.slug,
      },
    }));
  } catch (error) {
    console.error('Failed to load menu data:', error);
    return [];
  }
}

// 가격 문자열("10,000원~")에서 숫자만 추출 (JSON-LD offers용)
function parsePrice(price: string | null): string | null {
  if (!price) return null;
  const digits = price.replace(/[^0-9]/g, '');
  return digits.length > 0 ? digits : null;
}

export default async function MenuPage() {
  const menus = await getMenus();

  const menuJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Menu',
    name: `${BRAND.nameKo} 메뉴`,
    inLanguage: 'ko',
    hasMenuItem: menus.map((m) => {
      const price = parsePrice(m.price);
      return {
        '@type': 'MenuItem',
        name: m.name,
        ...(m.description ? { description: m.description } : {}),
        image: m.imageUrl,
        ...(m.displayMode === 'DETAIL' ? { url: `${BASE_URL}/menu/${m.id}` } : {}),
        ...(price
          ? {
              offers: {
                '@type': 'Offer',
                price,
                priceCurrency: 'KRW',
              },
            }
          : {}),
      };
    }),
  };

  return (
    <div className="py-8 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(menuJsonLd) }}
        />

        {/* 페이지 헤더 */}
        <div className="text-center mb-10 sm:mb-14">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
            메뉴
          </h1>
          <p className="text-gray-500">
            파티빈의 다양한 케이터링 메뉴를 만나보세요
          </p>
        </div>

        <MenuGrid menus={menus} />
      </div>
    </div>
  );
}
