import { Metadata } from 'next';
import Link from 'next/link';
import { Pin, Eye, ChevronLeft, ChevronRight, FileText } from 'lucide-react';
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

  return (
    <div className="py-8 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 페이지 헤더 */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            공지사항
          </h1>
          <p className="text-gray-600">
            파티빈의 새로운 소식과 안내사항을 확인하세요
          </p>
        </div>

        {/* 공지사항 목록 */}
        {notices.length === 0 ? (
          <div className="text-center py-16">
            <FileText className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500">등록된 공지사항이 없습니다</p>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm border">
              {notices.map((notice, index) => (
                <Link
                  key={notice.id}
                  href={`/notice/${notice.id}`}
                  className={`block p-5 sm:p-6 hover:bg-gray-50 transition-colors ${
                    index !== notices.length - 1 ? 'border-b' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {notice.isPinned && (
                      <span className="flex-shrink-0 mt-1">
                        <Pin className="w-4 h-4 text-[#025566]" />
                      </span>
                    )}
                    <div className="flex-1 min-w-0">
                      <h3
                        className={`text-base sm:text-lg font-medium truncate ${
                          notice.isPinned ? 'text-[#013A46]' : 'text-gray-900'
                        }`}
                      >
                        {notice.title}
                      </h3>
                      <div className="flex items-center gap-3 mt-2 text-sm text-gray-500">
                        <span>{formatDate(notice.createdAt)}</span>
                        <span className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          {notice.viewCount}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* 페이지네이션 */}
            {pagination.totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-8">
                <Link
                  href={`/notice?page=${Math.max(1, currentPage - 1)}`}
                  className={`p-2 rounded-lg bg-white border hover:bg-gray-50 transition-colors ${
                    currentPage === 1 ? 'opacity-50 pointer-events-none' : ''
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
                        className={`w-10 h-10 flex items-center justify-center rounded-lg font-medium transition-colors ${
                          currentPage === page
                            ? 'bg-[#025566] text-white'
                            : 'bg-white border text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </Link>
                    )
                  )}
                </div>
                <Link
                  href={`/notice?page=${Math.min(pagination.totalPages, currentPage + 1)}`}
                  className={`p-2 rounded-lg bg-white border hover:bg-gray-50 transition-colors ${
                    currentPage === pagination.totalPages
                      ? 'opacity-50 pointer-events-none'
                      : ''
                  }`}
                >
                  <ChevronRight className="w-5 h-5" />
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
