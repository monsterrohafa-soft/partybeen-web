'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { upload } from '@vercel/blob/client';
import {
  Plus,
  Trash2,
  Edit,
  LogOut,
  X,
  Loader2,
  Eye,
  EyeOff,
  FileText,
  Images,
  UtensilsCrossed,
  Upload,
  Copy,
  Check,
  ExternalLink,
  Settings,
} from 'lucide-react';

interface Proposal {
  id: string;
  title: string;
  filename: string;
  fileUrl: string;
  isVisible: boolean;
  createdAt: string;
}

export default function AdminProposalPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<Proposal | null>(null);
  const [saving, setSaving] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    file: null as File | null,
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadData = useCallback(async () => {
    try {
      const res = await fetch('/api/proposal?includeHidden=true');
      const data = await res.json();
      setProposals(data.proposals || []);
    } catch (error) {
      console.error('Failed to load proposals:', error);
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
    if (!formData.title.trim()) {
      alert('제목을 입력해주세요');
      return;
    }

    if (!editingItem && !formData.file) {
      alert('PDF 파일을 선택해주세요');
      return;
    }

    setSaving(true);
    try {
      if (editingItem) {
        // 수정
        const res = await fetch(`/api/proposal/${editingItem.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title: formData.title }),
        });

        if (!res.ok) {
          const error = await res.json();
          alert(error.error || '저장 실패');
          return;
        }
      } else {
        // 1. 클라이언트에서 직접 Blob에 업로드
        const blob = await upload(formData.file!.name, formData.file!, {
          access: 'public',
          handleUploadUrl: '/api/proposal/upload',
        });

        // 2. DB에 저장
        const res = await fetch('/api/proposal', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: formData.title,
            filename: formData.file!.name,
            fileUrl: blob.url,
          }),
        });

        if (!res.ok) {
          const error = await res.json();
          alert(error.error || '저장 실패');
          return;
        }
      }

      setShowModal(false);
      setEditingItem(null);
      setFormData({ title: '', file: null });
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      loadData();
    } catch (err) {
      console.error('Upload error:', err);
      alert('저장 중 오류가 발생했습니다');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('정말 삭제하시겠습니까?')) return;

    try {
      const res = await fetch(`/api/proposal/${id}`, { method: 'DELETE' });
      if (res.ok) {
        loadData();
      }
    } catch {
      alert('삭제 중 오류가 발생했습니다');
    }
  };

  const handleToggleVisible = async (proposal: Proposal) => {
    try {
      const res = await fetch(`/api/proposal/${proposal.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isVisible: !proposal.isVisible }),
      });
      if (res.ok) {
        loadData();
      }
    } catch {
      alert('수정 중 오류가 발생했습니다');
    }
  };

  const openEditModal = (proposal: Proposal) => {
    setEditingItem(proposal);
    setFormData({
      title: proposal.title,
      file: null,
    });
    setShowModal(true);
  };

  const openNewModal = () => {
    setEditingItem(null);
    setFormData({ title: '', file: null });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setShowModal(true);
  };

  const copyLink = async (id: string) => {
    const url = `${window.location.origin}/proposal/${id}`;
    await navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
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
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white text-gray-700 hover:bg-gray-50 transition-colors whitespace-nowrap"
          >
            <FileText className="w-4 h-4" />
            공지사항
          </Link>
          <Link
            href="/admin/proposal"
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#025566] text-white whitespace-nowrap"
          >
            <Upload className="w-4 h-4" />
            제안서
          </Link>
          <Link
            href="/admin/settings"
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white text-gray-700 hover:bg-gray-50 transition-colors whitespace-nowrap"
          >
            <Settings className="w-4 h-4" />
            설정
          </Link>
        </div>

        {/* 상단 액션 */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">제안서 관리</h2>
            <p className="text-gray-500">PDF 제안서를 업로드하고 링크를 공유하세요</p>
          </div>
          <button
            onClick={openNewModal}
            className="flex items-center gap-2 px-4 py-2 bg-[#025566] text-white rounded-lg hover:bg-[#013A46] transition-colors"
          >
            <Plus className="w-5 h-5" />
            새 제안서
          </button>
        </div>

        {/* 제안서 목록 */}
        {proposals.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl">
            <Upload className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500">등록된 제안서가 없습니다</p>
            <button onClick={openNewModal} className="mt-4 text-[#025566] hover:underline">
              첫 번째 제안서 업로드하기
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-xl overflow-hidden shadow-sm">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">상태</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">제목</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-gray-500 hidden sm:table-cell">파일명</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-gray-500 hidden sm:table-cell">등록일</th>
                  <th className="text-right px-4 py-3 text-sm font-medium text-gray-500">관리</th>
                </tr>
              </thead>
              <tbody>
                {proposals.map((proposal) => (
                  <tr key={proposal.id} className="border-b last:border-b-0 hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleToggleVisible(proposal)}
                        className={`p-1.5 rounded-lg transition-colors ${
                          proposal.isVisible ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                        }`}
                        title={proposal.isVisible ? '숨기기' : '공개하기'}
                      >
                        {proposal.isVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`font-medium ${!proposal.isVisible ? 'text-gray-400' : 'text-gray-900'}`}>
                        {proposal.title}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500 hidden sm:table-cell">{proposal.filename}</td>
                    <td className="px-4 py-3 text-sm text-gray-500 hidden sm:table-cell">{formatDate(proposal.createdAt)}</td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1">
                        <button
                          onClick={() => copyLink(proposal.id)}
                          className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
                          title="링크 복사"
                        >
                          {copiedId === proposal.id ? (
                            <Check className="w-4 h-4 text-green-500" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                        <a
                          href={`/proposal/${proposal.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
                          title="미리보기"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                        <button
                          onClick={() => openEditModal(proposal)}
                          className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(proposal.id)}
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
          <div className="bg-white rounded-2xl max-w-lg w-full">
            <div className="p-6 border-b flex items-center justify-between">
              <h3 className="text-lg font-bold">
                {editingItem ? '제안서 수정' : '새 제안서 업로드'}
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
                  placeholder="제안서 제목"
                />
              </div>

              {/* PDF 파일 */}
              {!editingItem && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">PDF 파일 *</label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,application/pdf"
                    onChange={(e) => setFormData((prev) => ({ ...prev, file: e.target.files?.[0] || null }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#025566]"
                  />
                  <p className="mt-1 text-xs text-gray-500">최대 50MB</p>
                </div>
              )}

              {editingItem && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">
                    <strong>현재 파일:</strong> {editingItem.filename}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    파일 변경은 삭제 후 새로 업로드해주세요
                  </p>
                </div>
              )}
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
