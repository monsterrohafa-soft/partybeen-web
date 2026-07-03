import { Metadata } from 'next';
import Link from 'next/link';
import { Pin, Eye, ChevronLeft, ChevronRight, Bell, Megaphone } from 'lucide-react';
import prisma from '@/lib/prisma';
import { BRAND } from '@/lib/constants';

export const metadata: Metadata = {
  title: '공지사항',
  description: `${BRAND.name}의 새로운 소식과 안내사항`,
};

export const dynamic = 'force-dynamic';

interface NoticePageProps {
  searchParams: Promise<{ page?: string }>;
}

async function getNotices(page: number = 1, limit: number = 10) {
  const skip = (page - 1) * limit;

  const [notices, total] = await Promise.all([
    prisma.notice.findMany({
      where: { isVisible: true },
      orderBy: [{ isPinned: 'desc' }, { createdAt: 'desc' }],
      skip,
      take: limit,
    }),
    prisma.notice.count({ where: { isVisible: true } }),
  ]);

  return {
    notices,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

export default async function NoticePage({ searchParams }: NoticePageProps) {
  const params = await searchParams;
  const currentPage = parseInt(params.page || '1');
  const { notices, pagination } = await getNotices(currentPage);

  // 공지사항(안내·규정 등)을 AI 엔진용 FAQ 스키마로 노출
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    inLanguage: 'ko',
    mainEntity: notices.map((notice) => ({
      '@type': 'Question',
      name: notice.title,
      acceptedAnswer: {
        '@type': 'Answer',
        text: notice.content.slice(0, 1000),
      },
    })),
  };

  return (
    <div className="py-8 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {notices.length > 0 && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
          />
        )}
        {/* 페이지 헤더 */}
        <div className="text-center mb-10 sm:mb-14">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#025566] to-[#013A46] rounded-2xl mb-4 shadow-lg">
            <Megaphone className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
            공지사항
          </h1>
          <p className="text-gray-500">
            파티빈의 새로운 소식과 안내사항을 확인하세요
          </p>
        </div>

        {/* 공지사항 목록 */}
        {notices.length === 0 ? (
          <div className="text-center py-20 bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
              <Bell className="w-10 h-10 text-gray-300" />
            </div>
            <p className="text-gray-500 text-lg">등록된 공지사항이 없습니다</p>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {notices.map((notice, index) => (
                <Link
                  key={notice.id}
                  href={`/notice/${notice.id}`}
                  className={`block group relative overflow-hidden rounded-2xl transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
                    notice.isPinned
                      ? 'bg-gradient-to-r from-[#025566] to-[#013A46] text-white'
                      : 'bg-white border border-gray-100 hover:border-[#025566]/20'
                  }`}
                >
                  {/* 고정 배지 */}
                  {notice.isPinned && (
                    <div className="absolute top-0 right-0">
                      <div className="bg-yellow-400 text-yellow-900 px-3 py-1 text-xs font-bold rounded-bl-xl flex items-center gap-1">
                        <Pin className="w-3 h-3" />
                        고정
                      </div>
                    </div>
                  )}

                  <div className="p-5 sm:p-6">
                    <div className="flex items-start gap-4">
                      {/* 번호 또는 아이콘 */}
                      <div
                        className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg ${
                          notice.isPinned
                            ? 'bg-white/20 text-white'
                            : 'bg-[#025566]/10 text-[#025566]'
                        }`}
                      >
                        {notice.isPinned ? (
                          <Megaphone className="w-5 h-5" />
                        ) : (
                          pagination.total - (currentPage - 1) * pagination.limit - index
                        )}
                      </div>

                      {/* 내용 */}
                      <div className="flex-1 min-w-0">
                        <h3
                          className={`text-lg font-semibold mb-2 group-hover:underline decoration-2 underline-offset-4 ${
                            notice.isPinned ? 'text-white' : 'text-gray-900'
                          }`}
                        >
                          {notice.title}
                        </h3>
                        <div
                          className={`flex items-center gap-4 text-sm ${
                            notice.isPinned ? 'text-white/70' : 'text-gray-500'
                          }`}
                        >
                          <span>{formatDate(notice.createdAt)}</span>
                          <span className="flex items-center gap-1">
                            <Eye className="w-4 h-4" />
                            {notice.viewCount}
                          </span>
                        </div>
                      </div>

                      {/* 화살표 */}
                      <div
                        className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-transform group-hover:translate-x-1 ${
                          notice.isPinned
                            ? 'bg-white/20'
                            : 'bg-gray-100 group-hover:bg-[#025566] group-hover:text-white'
                        }`}
                      >
                        <ChevronRight className="w-5 h-5" />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* 페이지네이션 */}
            {pagination.totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-10">
                <Link
                  href={`/notice?page=${Math.max(1, currentPage - 1)}`}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                    currentPage === 1
                      ? 'bg-gray-100 text-gray-400 pointer-events-none'
                      : 'bg-white border border-gray-200 text-gray-700 hover:bg-[#025566] hover:text-white hover:border-[#025566]'
                  }`}
                >
                  <ChevronLeft className="w-5 h-5" />
                </Link>
                <div className="flex gap-1">
                  {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <Link
                        key={page}
                        href={`/notice?page=${page}`}
                        className={`w-10 h-10 flex items-center justify-center rounded-xl font-medium transition-all ${
                          currentPage === page
                            ? 'bg-gradient-to-r from-[#025566] to-[#013A46] text-white shadow-lg'
                            : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </Link>
                    )
                  )}
                </div>
                <Link
                  href={`/notice?page=${Math.min(pagination.totalPages, currentPage + 1)}`}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                    currentPage === pagination.totalPages
                      ? 'bg-gray-100 text-gray-400 pointer-events-none'
                      : 'bg-white border border-gray-200 text-gray-700 hover:bg-[#025566] hover:text-white hover:border-[#025566]'
                  }`}
                >
                  <ChevronRight className="w-5 h-5" />
                </Link>
              </div>
            )}
          </>
        )}

        {/* 문의 CTA */}
        <div className="mt-16 text-center">
          <p className="text-gray-600 mb-4">
            궁금한 점이 있으신가요?
          </p>
          <a
            href="https://pf.kakao.com/_DTqwT"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-3 bg-[#FEE500] text-[#391B1B] font-semibold rounded-full hover:shadow-lg transition-all hover:-translate-y-0.5"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
              <path d="M12 3C6.48 3 2 6.58 2 11c0 2.83 1.89 5.32 4.71 6.72-.17.61-.64 2.21-.73 2.56-.12.45.16.44.34.32.14-.09 2.17-1.47 3.05-2.06.53.07 1.07.11 1.63.11 5.52 0 10-3.58 10-8S17.52 3 12 3z" />
            </svg>
            카카오톡 문의하기
          </a>
        </div>
      </div>
    </div>
  );
}
