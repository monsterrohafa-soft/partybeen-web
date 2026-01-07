import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Eye, Pin, Calendar } from 'lucide-react';
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

  return (
    <div className="py-8 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 뒤로가기 */}
        <Link
          href="/notice"
          className="inline-flex items-center gap-2 text-gray-500 hover:text-[#025566] transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>목록으로</span>
        </Link>

        {/* 본문 카드 */}
        <article className="bg-white rounded-2xl overflow-hidden shadow-sm border">
          {/* 헤더 */}
          <div className="p-6 sm:p-8 border-b">
            {notice.isPinned && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-[#025566]/10 text-[#025566] text-xs font-medium rounded-full mb-4">
                <Pin className="w-3 h-3" />
                고정됨
              </span>
            )}
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
              {notice.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {formatDate(notice.createdAt)}
              </span>
              <span className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                조회 {notice.viewCount + 1}
              </span>
            </div>
          </div>

          {/* 본문 */}
          <div className="p-6 sm:p-8">
            <div className="prose prose-gray max-w-none whitespace-pre-wrap leading-relaxed text-gray-700">
              {notice.content}
            </div>
          </div>
        </article>

        {/* 목록 버튼 */}
        <div className="mt-8 text-center">
          <Link
            href="/notice"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#025566] text-white font-medium rounded-full hover:bg-[#013A46] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            목록으로
          </Link>
        </div>
      </div>
    </div>
  );
}
