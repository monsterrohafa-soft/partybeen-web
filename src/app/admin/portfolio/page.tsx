'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
  Plus,
  Trash2,
  Edit,
  LogOut,
  Upload,
  X,
  Loader2,
  Image as ImageIcon,
} from 'lucide-react';

interface Category {
  id: string;
  name: string;
  slug: string;
  _count: { portfolios: number };
}

interface Portfolio {
  id: string;
  title: string;
  description?: string;
  imageUrl: string;
  categoryId: string;
  category: Category;
  orderIndex: number;
  isVisible: boolean;
}

export default function AdminPortfolioPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<Portfolio | null>(null);
  const [uploading, setUploading] = useState(false);

  // 폼 상태
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    imageUrl: '',
    categoryId: '',
  });

  // 데이터 로드
  const loadData = useCallback(async () => {
    try {
      const [portfolioRes, categoryRes] = await Promise.all([
        fetch(`/api/portfolio${selectedCategory !== 'all' ? `?category=${selectedCategory}` : ''}`),
        fetch('/api/categories'),
      ]);

      const portfolioData = await portfolioRes.json();
      const categoryData = await categoryRes.json();

      setPortfolios(Array.isArray(portfolioData) ? portfolioData : []);
      setCategories(Array.isArray(categoryData) ? categoryData : []);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory]);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    } else if (status === 'authenticated') {
      loadData();
    }
  }, [status, router, loadData]);

  // 이미지 업로드
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formDataUpload = new FormData();
    formDataUpload.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formDataUpload,
      });

      const data = await res.json();
      if (data.url) {
        setFormData((prev) => ({ ...prev, imageUrl: data.url }));
      } else {
        alert(data.error || '업로드 실패');
      }
    } catch {
      alert('업로드 중 오류가 발생했습니다');
    } finally {
      setUploading(false);
    }
  };

  // 저장
  const handleSave = async () => {
    if (!formData.title || !formData.imageUrl || !formData.categoryId) {
      alert('제목, 이미지, 카테고리는 필수입니다');
      return;
    }

    try {
      const url = editingItem
        ? `/api/portfolio/${editingItem.id}`
        : '/api/portfolio';
      const method = editingItem ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setShowModal(false);
        setEditingItem(null);
        setFormData({ title: '', description: '', imageUrl: '', categoryId: '' });
        loadData();
      } else {
        const error = await res.json();
        alert(error.error || '저장 실패');
      }
    } catch {
      alert('저장 중 오류가 발생했습니다');
    }
  };

  // 삭제
  const handleDelete = async (id: string) => {
    if (!confirm('정말 삭제하시겠습니까?')) return;

    try {
      const res = await fetch(`/api/portfolio/${id}`, { method: 'DELETE' });
      if (res.ok) {
        loadData();
      }
    } catch {
      alert('삭제 중 오류가 발생했습니다');
    }
  };

  // 수정 모달 열기
  const openEditModal = (item: Portfolio) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      description: item.description || '',
      imageUrl: item.imageUrl,
      categoryId: item.categoryId,
    });
    setShowModal(true);
  };

  // 새 항목 모달 열기
  const openNewModal = () => {
    setEditingItem(null);
    setFormData({ title: '', description: '', imageUrl: '', categoryId: categories[0]?.id || '' });
    setShowModal(true);
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
        {/* 상단 액션 */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">포트폴리오 관리</h2>
            <p className="text-gray-500">이미지를 추가, 수정, 삭제할 수 있습니다</p>
          </div>
          <button
            onClick={openNewModal}
            className="flex items-center gap-2 px-4 py-2 bg-[#025566] text-white rounded-lg hover:bg-[#013A46] transition-colors"
          >
            <Plus className="w-5 h-5" />
            새 항목 추가
          </button>
        </div>

        {/* 카테고리 필터 */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
              selectedCategory === 'all'
                ? 'bg-[#025566] text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            전체
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.slug)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
                selectedCategory === cat.slug
                  ? 'bg-[#025566] text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              {cat.name} ({cat._count?.portfolios || 0})
            </button>
          ))}
        </div>

        {/* 포트폴리오 그리드 */}
        {portfolios.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl">
            <ImageIcon className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500">등록된 포트폴리오가 없습니다</p>
            <button
              onClick={openNewModal}
              className="mt-4 text-[#025566] hover:underline"
            >
              첫 번째 항목 추가하기
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {portfolios.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group"
              >
                <div className="relative aspect-square">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                  {/* 오버레이 액션 */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      onClick={() => openEditModal(item)}
                      className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
                    >
                      <Edit className="w-5 h-5 text-gray-700" />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
                    >
                      <Trash2 className="w-5 h-5 text-red-500" />
                    </button>
                  </div>
                </div>
                <div className="p-3">
                  <h3 className="font-medium text-gray-900 truncate">{item.title}</h3>
                  <p className="text-xs text-gray-500">{item.category?.name}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* 모달 */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex items-center justify-between">
              <h3 className="text-lg font-bold">
                {editingItem ? '포트폴리오 수정' : '새 포트폴리오 추가'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* 이미지 업로드 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  이미지 *
                </label>
                {formData.imageUrl ? (
                  <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={formData.imageUrl}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={() => setFormData((prev) => ({ ...prev, imageUrl: '' }))}
                      className="absolute top-2 right-2 p-1 bg-white rounded-full shadow"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <label className="block cursor-pointer">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-[#025566] transition-colors">
                      {uploading ? (
                        <Loader2 className="w-8 h-8 mx-auto animate-spin text-[#025566]" />
                      ) : (
                        <>
                          <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                          <p className="text-sm text-gray-500">
                            클릭하여 이미지 업로드
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            JPG, PNG, WebP (최대 10MB)
                          </p>
                        </>
                      )}
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      disabled={uploading}
                    />
                  </label>
                )}
              </div>

              {/* 제목 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  제목 *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, title: e.target.value }))
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#025566]"
                  placeholder="포트폴리오 제목"
                />
              </div>

              {/* 설명 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  설명 (선택)
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, description: e.target.value }))
                  }
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#025566] resize-none"
                  placeholder="간단한 설명"
                />
              </div>

              {/* 카테고리 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  카테고리 *
                </label>
                <select
                  value={formData.categoryId}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, categoryId: e.target.value }))
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#025566]"
                >
                  <option value="">선택하세요</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
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
                className="px-4 py-2 bg-[#025566] text-white rounded-lg hover:bg-[#013A46] transition-colors"
              >
                저장
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
