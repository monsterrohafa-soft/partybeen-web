'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Plus,
  Trash2,
  Edit,
  LogOut,
  X,
  Loader2,
  Pin,
  PinOff,
  Eye,
  EyeOff,
  FileText,
  Images,
  UtensilsCrossed,
} from 'lucide-react';

interface Notice {
  id: string;
  title: string;
  content: string;
  isPinned: boolean;
  isVisible: boolean;
  viewCount: number;
  createdAt: string;
  author: { name: string | null; email: string };
}

export default function AdminNoticePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<Notice | null>(null);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    isPinned: false,
  });

  const loadData = useCallback(async () => {
    try {
      // includeHidden=true로 숨김 공지사항도 포함
      const res = await fetch('/api/notice?limit=100&includeHidden=true');
      const data = await res.json();
      setNotices(data.notices || []);
    } catch (error) {
      console.error('Failed to load notices:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    } else if (status === 'authenticated') {
      loadData();
    }
  }, [status, router, loadData]);

  const handleSave = async () => {
    if (!formData.title.trim() || !formData.content.trim()) {
      alert('제목과 내용을 입력해주세요');
      return;
    }

    setSaving(true);
    try {
      const url = editingItem ? `/api/notice/${editingItem.id}` : '/api/notice';
      const method = editingItem ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setShowModal(false);
        setEditingItem(null);
        setFormData({ title: '', content: '', isPinned: false });
        loadData();
      } else {
        const error = await res.json();
        alert(error.error || '저장 실패');
      }
    } catch {
      alert('저장 중 오류가 발생했습니다');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('정말 삭제하시겠습니까?')) return;

    try {
      const res = await fetch(`/api/notice/${id}`, { method: 'DELETE' });
      if (res.ok) {
        loadData();
      }
    } catch {
      alert('삭제 중 오류가 발생했습니다');
    }
  };

  const handleTogglePin = async (notice: Notice) => {
    try {
      const res = await fetch(`/api/notice/${notice.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPinned: !notice.isPinned }),
      });
      if (res.ok) {
        loadData();
      }
    } catch {
      alert('수정 중 오류가 발생했습니다');
    }
  };

  const handleToggleVisible = async (notice: Notice) => {
    try {
      const res = await fetch(`/api/notice/${notice.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isVisible: !notice.isVisible }),
      });
      if (res.ok) {
        loadData();
      }
    } catch {
      alert('수정 중 오류가 발생했습니다');
    }
  };

  const openEditModal = (notice: Notice) => {
    setEditingItem(notice);
    setFormData({
      title: notice.title,
      content: notice.content,
      isPinned: notice.isPinned,
    });
    setShowModal(true);
  };

  const openNewModal = () => {
    setEditingItem(null);
    setFormData({ title: '', content: '', isPinned: false });
    setShowModal(true);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <Loader2 className="w-8 h-8 animate-spin text-[#025566]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* 헤더 */}
      <header className="bg-[#013A46] text-white">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold">PARTY BEEN 관리자</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-300">{session?.user?.email}</span>
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="flex items-center gap-2 px-3 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors text-sm"
            >
              <LogOut className="w-4 h-4" />
              로그아웃
            </button>
          </div>
        </div>
      </header>

      {/* 메인 */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* 탭 네비게이션 */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          <Link
            href="/admin/portfolio"
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white text-gray-700 hover:bg-gray-50 transition-colors whitespace-nowrap"
          >
            <Images className="w-4 h-4" />
            포트폴리오
          </Link>
          <Link
            href="/admin/menu"
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white text-gray-700 hover:bg-gray-50 transition-colors whitespace-nowrap"
          >
            <UtensilsCrossed className="w-4 h-4" />
            메뉴
          </Link>
          <Link
            href="/admin/notice"
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#025566] text-white whitespace-nowrap"
          >
            <FileText className="w-4 h-4" />
            공지사항
          </Link>
        </div>

        {/* 상단 액션 */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">공지사항 관리</h2>
            <p className="text-gray-500">공지사항을 추가, 수정, 삭제할 수 있습니다</p>
          </div>
          <button
            onClick={openNewModal}
            className="flex items-center gap-2 px-4 py-2 bg-[#025566] text-white rounded-lg hover:bg-[#013A46] transition-colors"
          >
            <Plus className="w-5 h-5" />
            새 공지사항
          </button>
        </div>

        {/* 공지사항 목록 */}
        {notices.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl">
            <FileText className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500">등록된 공지사항이 없습니다</p>
            <button onClick={openNewModal} className="mt-4 text-[#025566] hover:underline">
              첫 번째 공지사항 작성하기
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-xl overflow-hidden shadow-sm">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">상태</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">제목</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-gray-500 hidden sm:table-cell">조회</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-gray-500 hidden sm:table-cell">작성일</th>
                  <th className="text-right px-4 py-3 text-sm font-medium text-gray-500">관리</th>
                </tr>
              </thead>
              <tbody>
                {notices.map((notice) => (
                  <tr key={notice.id} className="border-b last:border-b-0 hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleTogglePin(notice)}
                          className={`p-1.5 rounded-lg transition-colors ${
                            notice.isPinned ? 'bg-[#025566] text-white' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                          }`}
                          title={notice.isPinned ? '고정 해제' : '상단 고정'}
                        >
                          {notice.isPinned ? <Pin className="w-4 h-4" /> : <PinOff className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => handleToggleVisible(notice)}
                          className={`p-1.5 rounded-lg transition-colors ${
                            notice.isVisible ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                          }`}
                          title={notice.isVisible ? '숨기기' : '공개하기'}
                        >
                          {notice.isVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`font-medium ${!notice.isVisible ? 'text-gray-400' : 'text-gray-900'}`}>
                        {notice.title}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500 hidden sm:table-cell">{notice.viewCount}</td>
                    <td className="px-4 py-3 text-sm text-gray-500 hidden sm:table-cell">{formatDate(notice.createdAt)}</td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1">
                        <button
                          onClick={() => openEditModal(notice)}
                          className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(notice.id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {/* 모달 */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex items-center justify-between">
              <h3 className="text-lg font-bold">
                {editingItem ? '공지사항 수정' : '새 공지사항 작성'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* 제목 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">제목 *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#025566]"
                  placeholder="공지사항 제목"
                />
              </div>

              {/* 내용 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">내용 *</label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData((prev) => ({ ...prev, content: e.target.value }))}
                  rows={10}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#025566] resize-none"
                  placeholder="공지사항 내용을 입력하세요"
                />
              </div>

              {/* 옵션 */}
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isPinned}
                    onChange={(e) => setFormData((prev) => ({ ...prev, isPinned: e.target.checked }))}
                    className="w-4 h-4 text-[#025566] rounded focus:ring-[#025566]"
                  />
                  <span className="text-sm text-gray-700">상단 고정</span>
                </label>
              </div>
            </div>

            {/* 모달 푸터 */}
            <div className="p-6 border-t flex gap-3 justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                취소
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-4 py-2 bg-[#025566] text-white rounded-lg hover:bg-[#013A46] transition-colors disabled:opacity-50"
              >
                {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : '저장'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
