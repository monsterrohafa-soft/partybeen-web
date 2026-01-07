'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Pin, Eye, ChevronLeft, ChevronRight, FileText } from 'lucide-react';

interface Notice {
  id: string;
  title: string;
  content: string;
  isPinned: boolean;
  viewCount: number;
  createdAt: string;
  author: { name: string | null; email: string };
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export default function NoticePage() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchNotices = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/notice?page=${currentPage}&limit=10`);
        const data = await res.json();
        setNotices(data.notices || []);
        setPagination(data.pagination);
      } catch (error) {
        console.error('Failed to fetch notices:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotices();
  }, [currentPage]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-[#FAF3ED]">
      {/* 히어로 섹션 */}
      <section className="bg-[#013A46] text-white py-16 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">공지사항</h1>
          <p className="text-gray-300">
            파티빈의 새로운 소식과 안내사항을 확인하세요
          </p>
        </div>
      </section>

      {/* 공지사항 목록 */}
      <section className="py-12 sm:py-16">
        <div className="max-w-4xl mx-auto px-4">
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-8 h-8 border-4 border-[#025566] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : notices.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl">
              <FileText className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">등록된 공지사항이 없습니다</p>
            </div>
          ) : (
            <>
              <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
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
                        <h3 className={`text-base sm:text-lg font-medium text-gray-900 truncate ${notice.isPinned ? 'text-[#013A46]' : ''}`}>
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
              {pagination && pagination.totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-8">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <div className="flex gap-1">
                    {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                          currentPage === page
                            ? 'bg-[#025566] text-white'
                            : 'bg-white text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => setCurrentPage((p) => Math.min(pagination.totalPages, p + 1))}
                    disabled={currentPage === pagination.totalPages}
                    className="p-2 rounded-lg bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
}
