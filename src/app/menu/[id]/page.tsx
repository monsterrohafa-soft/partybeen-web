import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, UtensilsCrossed } from 'lucide-react';
import prisma from '@/lib/prisma';
import { BRAND } from '@/lib/constants';

interface MenuDetailPageProps {
  params: Promise<{ id: string }>;
}

async function getMenu(id: string) {
  const menu = await prisma.menu.findUnique({
    where: { id, isVisible: true },
    include: {
      category: true,
    },
  });
  return menu;
}

async function getRelatedMenus(categoryId: string, currentId: string) {
  const menus = await prisma.menu.findMany({
    where: {
      categoryId,
      isVisible: true,
      id: { not: currentId },
    },
    take: 4,
    orderBy: { orderIndex: 'asc' },
    include: {
      category: true,
    },
  });
  return menus;
}

export async function generateMetadata({
  params,
}: MenuDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const menu = await prisma.menu.findUnique({
    where: { id },
    select: { name: true, description: true },
  });

  return {
    title: menu?.name || '메뉴',
    description: menu?.description || `${BRAND.name} 케이터링 메뉴`,
  };
}

export default async function MenuDetailPage({ params }: MenuDetailPageProps) {
  const { id } = await params;
  const menu = await getMenu(id);

  if (!menu) {
    notFound();
  }

  const relatedMenus = await getRelatedMenus(menu.categoryId, id);

  return (
    <div className="py-8 sm:py-16 bg-gradient-to-b from-gray-50 to-white min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 뒤로가기 */}
        <Link
          href="/menu"
          className="inline-flex items-center gap-2 text-gray-500 hover:text-[#025566] transition-colors mb-6 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>메뉴 목록으로</span>
        </Link>

        {/* 메인 카드 */}
        <article className="bg-white rounded-3xl overflow-hidden shadow-xl">
          {/* 이미지 */}
          <div className="relative aspect-video sm:aspect-[16/9]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={menu.imageUrl}
              alt={menu.name}
              className="w-full h-full object-cover"
            />
            {/* 카테고리 뱃지 */}
            <div className="absolute top-4 left-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#025566] text-white text-sm font-medium rounded-full">
                <UtensilsCrossed className="w-3.5 h-3.5" />
                {menu.category.name}
              </span>
            </div>
          </div>

          {/* 내용 */}
          <div className="p-6 sm:p-10">
            <div className="flex items-start justify-between gap-4 mb-6">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                {menu.name}
              </h1>
              {menu.price && (
                <span className="text-xl sm:text-2xl font-bold text-[#025566] whitespace-nowrap">
                  {menu.price}
                </span>
              )}
            </div>

            {menu.description && (
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                {menu.description}
              </p>
            )}

            {menu.content && (
              <div className="prose prose-lg max-w-none text-gray-700 whitespace-pre-wrap border-t pt-6">
                {menu.content}
              </div>
            )}

            {/* 문의 CTA */}
            <div className="mt-8 pt-6 border-t">
              <p className="text-gray-600 mb-4 text-center">
                이 메뉴가 마음에 드시나요?
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <a
                  href="https://pf.kakao.com/_DTqwT"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-[#FEE500] text-[#391B1B] font-semibold rounded-full hover:shadow-lg transition-all hover:-translate-y-0.5"
                >
                  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                    <path d="M12 3C6.48 3 2 6.58 2 11c0 2.83 1.89 5.32 4.71 6.72-.17.61-.64 2.21-.73 2.56-.12.45.16.44.34.32.14-.09 2.17-1.47 3.05-2.06.53.07 1.07.11 1.63.11 5.52 0 10-3.58 10-8S17.52 3 12 3z" />
                  </svg>
                  카카오톡 문의하기
                </a>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-[#025566] text-white font-semibold rounded-full hover:bg-[#013A46] transition-all hover:-translate-y-0.5"
                >
                  견적 문의하기
                </Link>
              </div>
            </div>
          </div>
        </article>

        {/* 관련 메뉴 */}
        {relatedMenus.length > 0 && (
          <div className="mt-12">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              같은 카테고리의 다른 메뉴
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {relatedMenus.map((item) => (
                <Link
                  key={item.id}
                  href={item.displayMode === 'DETAIL' ? `/menu/${item.id}` : `/menu?open=${item.id}`}
                  className="group relative aspect-square rounded-2xl overflow-hidden shadow-card hover:shadow-xl transition-all"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute inset-0 p-3 flex flex-col justify-end">
                    <h3 className="text-sm font-bold text-white leading-tight">
                      {item.name}
                    </h3>
                    {item.price && (
                      <span className="text-xs text-[#FEE500] mt-0.5">{item.price}</span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
