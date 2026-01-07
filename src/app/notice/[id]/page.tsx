'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Eye, Pin, Calendar } from 'lucide-react';

interface Notice {
  id: string;
  title: string;
  content: string;
  isPinned: boolean;
  viewCount: number;
  createdAt: string;
  author: { name: string | null; email: string };
}

export default function NoticeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [notice, setNotice] = useState<Notice | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNotice = async () => {
      try {
        const res = await fetch(`/api/notice/${id}`);
        if (!res.ok) {
          throw new Error('공지사항을 찾을 수 없습니다');
        }
        const data = await res.json();
        setNotice(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : '오류가 발생했습니다');
      } finally {
        setLoading(false);
      }
    };

    fetchNotice();
  }, [id]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF3ED] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#025566] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !notice) {
    return (
      <div className="min-h-screen bg-[#FAF3ED] flex flex-col items-center justify-center px-4">
        <p className="text-gray-500 mb-4">{error || '공지사항을 찾을 수 없습니다'}</p>
        <Link
          href="/notice"
          className="px-4 py-2 bg-[#025566] text-white rounded-lg hover:bg-[#013A46] transition-colors"
        >
          목록으로 돌아가기
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF3ED]">
      {/* 상단 바 */}
      <div className="bg-[#013A46] text-white py-4">
        <div className="max-w-4xl mx-auto px-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>뒤로가기</span>
          </button>
        </div>
      </div>

      {/* 본문 */}
      <article className="py-8 sm:py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
            {/* 헤더 */}
            <div className="p-6 sm:p-8 border-b">
              <div className="flex items-start gap-3 mb-4">
                {notice.isPinned && (
                  <span className="flex-shrink-0 px-2 py-1 bg-[#025566]/10 text-[#025566] text-xs font-medium rounded-full flex items-center gap-1">
                    <Pin className="w-3 h-3" />
                    고정됨
                  </span>
                )}
              </div>
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
                  조회 {notice.viewCount}
                </span>
              </div>
            </div>

            {/* 본문 */}
            <div className="p-6 sm:p-8">
              <div className="prose prose-gray max-w-none whitespace-pre-wrap">
                {notice.content}
              </div>
            </div>
          </div>

          {/* 목록으로 버튼 */}
          <div className="mt-6 text-center">
            <Link
              href="/notice"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#025566] text-white rounded-full hover:bg-[#013A46] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              목록으로
            </Link>
          </div>
        </div>
      </article>
    </div>
  );
}
