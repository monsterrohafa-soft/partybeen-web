import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Eye, Pin, Calendar, Share2, ChevronLeft, ChevronRight } from 'lucide-react';
import prisma from '@/lib/prisma';
import { BRAND } from '@/lib/constants';

interface NoticeDetailPageProps {
  params: Promise<{ id: string }>;
}

async function getNotice(id: string) {
  const notice = await prisma.notice.findUnique({
    where: { id },
  });

  if (notice) {
    // 조회수 증가
    await prisma.notice.update({
      where: { id },
      data: { viewCount: { increment: 1 } },
    });
  }

  return notice;
}

async function getAdjacentNotices(currentId: string, createdAt: Date) {
  const [prev, next] = await Promise.all([
    prisma.notice.findFirst({
      where: {
        isVisible: true,
        createdAt: { lt: createdAt },
      },
      orderBy: { createdAt: 'desc' },
      select: { id: true, title: true },
    }),
    prisma.notice.findFirst({
      where: {
        isVisible: true,
        createdAt: { gt: createdAt },
      },
      orderBy: { createdAt: 'asc' },
      select: { id: true, title: true },
    }),
  ]);

  return { prev, next };
}

export async function generateMetadata({
  params,
}: NoticeDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const notice = await prisma.notice.findUnique({
    where: { id },
    select: { title: true },
  });

  return {
    title: notice?.title || '공지사항',
    description: `${BRAND.name} 공지사항`,
  };
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

export default async function NoticeDetailPage({ params }: NoticeDetailPageProps) {
  const { id } = await params;
  const notice = await getNotice(id);

  if (!notice) {
    notFound();
  }

  const { prev, next } = await getAdjacentNotices(id, notice.createdAt);

  return (
    <div className="py-8 sm:py-16 bg-gradient-to-b from-gray-50 to-white min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 뒤로가기 */}
        <Link
          href="/notice"
          className="inline-flex items-center gap-2 text-gray-500 hover:text-[#025566] transition-colors mb-6 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>목록으로 돌아가기</span>
        </Link>

        {/* 본문 카드 */}
        <article className="bg-white rounded-3xl overflow-hidden shadow-xl">
          {/* 헤더 */}
          <div className={`p-6 sm:p-10 ${notice.isPinned ? 'bg-gradient-to-r from-[#025566] to-[#013A46]' : 'border-b border-gray-100'}`}>
            {notice.isPinned && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-yellow-400 text-yellow-900 text-xs font-bold rounded-full mb-4">
                <Pin className="w-3 h-3" />
                중요 공지
              </span>
            )}
            <h1 className={`text-2xl sm:text-3xl font-bold mb-4 leading-tight ${notice.isPinned ? 'text-white' : 'text-gray-900'}`}>
              {notice.title}
            </h1>
            <div className={`flex flex-wrap items-center gap-4 text-sm ${notice.isPinned ? 'text-white/70' : 'text-gray-500'}`}>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                {formatDate(notice.createdAt)}
              </span>
              <span className="flex items-center gap-1.5">
                <Eye className="w-4 h-4" />
                조회 {notice.viewCount + 1}
              </span>
            </div>
          </div>

          {/* 본문 */}
          <div className="p-6 sm:p-10">
            <div className="prose prose-lg max-w-none whitespace-pre-wrap leading-relaxed text-gray-700">
              {notice.content}
            </div>
          </div>

          {/* 하단 액션 */}
          <div className="px-6 sm:px-10 py-6 bg-gray-50 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <Link
                href="/notice"
                className="inline-flex items-center gap-2 px-5 py-2.5 text-gray-600 hover:text-[#025566] transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                목록으로
              </Link>
              <button
                className="inline-flex items-center gap-2 px-5 py-2.5 text-gray-600 hover:text-[#025566] transition-colors"
                onClick={() => {}}
              >
                <Share2 className="w-4 h-4" />
                공유하기
              </button>
            </div>
          </div>
        </article>

        {/* 이전/다음 공지 */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {prev ? (
            <Link
              href={`/notice/${prev.id}`}
              className="group flex items-center gap-3 p-4 bg-white rounded-2xl border border-gray-100 hover:border-[#025566]/30 hover:shadow-lg transition-all"
            >
              <div className="w-10 h-10 rounded-xl bg-gray-100 group-hover:bg-[#025566] flex items-center justify-center transition-colors">
                <ChevronLeft className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-400 mb-1">이전 글</p>
                <p className="text-sm font-medium text-gray-900 truncate group-hover:text-[#025566] transition-colors">
                  {prev.title}
                </p>
              </div>
            </Link>
          ) : (
            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 opacity-50">
              <p className="text-xs text-gray-400 mb-1">이전 글</p>
              <p className="text-sm text-gray-400">이전 글이 없습니다</p>
            </div>
          )}

          {next ? (
            <Link
              href={`/notice/${next.id}`}
              className="group flex items-center gap-3 p-4 bg-white rounded-2xl border border-gray-100 hover:border-[#025566]/30 hover:shadow-lg transition-all text-right"
            >
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-400 mb-1">다음 글</p>
                <p className="text-sm font-medium text-gray-900 truncate group-hover:text-[#025566] transition-colors">
                  {next.title}
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-gray-100 group-hover:bg-[#025566] flex items-center justify-center transition-colors">
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
              </div>
            </Link>
          ) : (
            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 opacity-50 text-right">
              <p className="text-xs text-gray-400 mb-1">다음 글</p>
              <p className="text-sm text-gray-400">다음 글이 없습니다</p>
            </div>
          )}
        </div>

        {/* 문의 CTA */}
        <div className="mt-12 text-center">
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
