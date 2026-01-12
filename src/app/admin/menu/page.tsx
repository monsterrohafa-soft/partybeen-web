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
  Upload,
  X,
  Loader2,
  Image as ImageIcon,
  Images,
  FileText,
  UtensilsCrossed,
  Settings,
  Eye,
  EyeOff,
  Monitor,
  Maximize2,
} from 'lucide-react';

interface MenuCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  orderIndex: number;
  isVisible: boolean;
  _count?: { menus: number };
}

interface Menu {
  id: string;
  name: string;
  description?: string;
  content?: string;
  price?: string;
  imageUrl: string;
  displayMode: 'MODAL' | 'DETAIL';
  categoryId: string;
  category: MenuCategory;
  orderIndex: number;
  isVisible: boolean;
}

export default function AdminMenuPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [menus, setMenus] = useState<Menu[]>([]);
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [showMenuModal, setShowMenuModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingMenu, setEditingMenu] = useState<Menu | null>(null);
  const [editingCategory, setEditingCategory] = useState<MenuCategory | null>(null);
  const [uploading, setUploading] = useState(false);

  const [menuForm, setMenuForm] = useState({
    name: '',
    description: '',
    content: '',
    price: '',
    imageUrl: '',
    displayMode: 'MODAL' as 'MODAL' | 'DETAIL',
    categoryId: '',
  });

  const [categoryForm, setCategoryForm] = useState({
    name: '',
    slug: '',
    description: '',
  });

  const loadData = useCallback(async () => {
    try {
      const [menusRes, categoriesRes] = await Promise.all([
        fetch(`/api/menu?includeHidden=true${selectedCategory !== 'all' ? `&category=${selectedCategory}` : ''}`),
        fetch('/api/menu-categories'),
      ]);

      const menusData = await menusRes.json();
      const categoriesData = await categoriesRes.json();

      setMenus(Array.isArray(menusData) ? menusData : []);
      setCategories(Array.isArray(categoriesData) ? categoriesData : []);
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
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (data.url) {
        setMenuForm((prev) => ({ ...prev, imageUrl: data.url }));
      } else {
        alert(data.error || '업로드 실패');
      }
    } catch {
      alert('업로드 중 오류가 발생했습니다');
    } finally {
      setUploading(false);
    }
  };

  // 메뉴 저장
  const handleSaveMenu = async () => {
    if (!menuForm.name || !menuForm.imageUrl || !menuForm.categoryId) {
      alert('이름, 이미지, 카테고리는 필수입니다');
      return;
    }

    try {
      const url = editingMenu ? `/api/menu/${editingMenu.id}` : '/api/menu';
      const method = editingMenu ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(menuForm),
      });

      if (res.ok) {
        setShowMenuModal(false);
        setEditingMenu(null);
        setMenuForm({ name: '', description: '', content: '', price: '', imageUrl: '', displayMode: 'MODAL', categoryId: '' });
        loadData();
      } else {
        const error = await res.json();
        alert(error.error || '저장 실패');
      }
    } catch {
      alert('저장 중 오류가 발생했습니다');
    }
  };

  // 메뉴 삭제
  const handleDeleteMenu = async (id: string) => {
    if (!confirm('정말 삭제하시겠습니까?')) return;

    try {
      const res = await fetch(`/api/menu/${id}`, { method: 'DELETE' });
      if (res.ok) {
        loadData();
      }
    } catch {
      alert('삭제 중 오류가 발생했습니다');
    }
  };

  // 메뉴 표시/숨김 토글
  const handleToggleVisible = async (menu: Menu) => {
    try {
      const res = await fetch(`/api/menu/${menu.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isVisible: !menu.isVisible }),
      });
      if (res.ok) {
        loadData();
      }
    } catch {
      alert('수정 중 오류가 발생했습니다');
    }
  };

  // 카테고리 저장
  const handleSaveCategory = async () => {
    if (!categoryForm.name || !categoryForm.slug) {
      alert('이름과 슬러그는 필수입니다');
      return;
    }

    try {
      const url = editingCategory ? `/api/menu-categories/${editingCategory.id}` : '/api/menu-categories';
      const method = editingCategory ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(categoryForm),
      });

      if (res.ok) {
        setShowCategoryModal(false);
        setEditingCategory(null);
        setCategoryForm({ name: '', slug: '', description: '' });
        loadData();
      } else {
        const error = await res.json();
        alert(error.error || '저장 실패');
      }
    } catch {
      alert('저장 중 오류가 발생했습니다');
    }
  };

  // 카테고리 삭제
  const handleDeleteCategory = async (id: string) => {
    if (!confirm('정말 삭제하시겠습니까? 이 카테고리에 메뉴가 있으면 삭제할 수 없습니다.')) return;

    try {
      const res = await fetch(`/api/menu-categories/${id}`, { method: 'DELETE' });
      if (res.ok) {
        loadData();
      } else {
        const error = await res.json();
        alert(error.error || '삭제 실패');
      }
    } catch {
      alert('삭제 중 오류가 발생했습니다');
    }
  };

  // 메뉴 수정 모달 열기
  const openEditMenuModal = (menu: Menu) => {
    setEditingMenu(menu);
    setMenuForm({
      name: menu.name,
      description: menu.description || '',
      content: menu.content || '',
      price: menu.price || '',
      imageUrl: menu.imageUrl,
      displayMode: menu.displayMode,
      categoryId: menu.categoryId,
    });
    setShowMenuModal(true);
  };

  // 새 메뉴 모달 열기
  const openNewMenuModal = () => {
    setEditingMenu(null);
    setMenuForm({ name: '', description: '', content: '', price: '', imageUrl: '', displayMode: 'MODAL', categoryId: categories[0]?.id || '' });
    setShowMenuModal(true);
  };

  // 카테고리 수정 모달 열기
  const openEditCategoryModal = (cat: MenuCategory) => {
    setEditingCategory(cat);
    setCategoryForm({
      name: cat.name,
      slug: cat.slug,
      description: cat.description || '',
    });
    setShowCategoryModal(true);
  };

  // 새 카테고리 모달 열기
  const openNewCategoryModal = () => {
    setEditingCategory(null);
    setCategoryForm({ name: '', slug: '', description: '' });
    setShowCategoryModal(true);
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
          <Link href="/admin/portfolio" className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white text-gray-700 hover:bg-gray-50 transition-colors whitespace-nowrap">
            <Images className="w-4 h-4" />
            포트폴리오
          </Link>
          <Link href="/admin/menu" className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#025566] text-white whitespace-nowrap">
            <UtensilsCrossed className="w-4 h-4" />
            메뉴
          </Link>
          <Link href="/admin/notice" className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white text-gray-700 hover:bg-gray-50 transition-colors whitespace-nowrap">
            <FileText className="w-4 h-4" />
            공지사항
          </Link>
        </div>

        {/* 상단 액션 */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">메뉴 관리</h2>
            <p className="text-gray-500">메뉴와 카테고리를 추가, 수정, 삭제할 수 있습니다</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={openNewCategoryModal}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Settings className="w-4 h-4" />
              카테고리 관리
            </button>
            <button
              onClick={openNewMenuModal}
              className="flex items-center gap-2 px-4 py-2 bg-[#025566] text-white rounded-lg hover:bg-[#013A46] transition-colors"
            >
              <Plus className="w-5 h-5" />
              새 메뉴 추가
            </button>
          </div>
        </div>

        {/* 카테고리 필터 */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
              selectedCategory === 'all' ? 'bg-[#025566] text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            전체
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.slug)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
                selectedCategory === cat.slug ? 'bg-[#025566] text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              {cat.name} ({cat._count?.menus || 0})
            </button>
          ))}
        </div>

        {/* 메뉴 그리드 */}
        {menus.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl">
            <ImageIcon className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500">등록된 메뉴가 없습니다</p>
            <button onClick={openNewMenuModal} className="mt-4 text-[#025566] hover:underline">
              첫 번째 메뉴 추가하기
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {menus.map((menu) => (
              <div
                key={menu.id}
                className={`bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group ${!menu.isVisible ? 'opacity-60' : ''}`}
              >
                <div className="relative aspect-square">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={menu.imageUrl} alt={menu.name} className="w-full h-full object-cover" />
                  {/* 표시 모드 뱃지 */}
                  <div className="absolute top-2 left-2">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded ${
                      menu.displayMode === 'DETAIL' ? 'bg-blue-500 text-white' : 'bg-gray-700 text-white'
                    }`}>
                      {menu.displayMode === 'DETAIL' ? <Maximize2 className="w-3 h-3" /> : <Monitor className="w-3 h-3" />}
                      {menu.displayMode === 'DETAIL' ? '상세' : '모달'}
                    </span>
                  </div>
                  {/* 오버레이 액션 */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      onClick={() => handleToggleVisible(menu)}
                      className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
                      title={menu.isVisible ? '숨기기' : '공개하기'}
                    >
                      {menu.isVisible ? <Eye className="w-5 h-5 text-green-500" /> : <EyeOff className="w-5 h-5 text-gray-400" />}
                    </button>
                    <button
                      onClick={() => openEditMenuModal(menu)}
                      className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
                    >
                      <Edit className="w-5 h-5 text-gray-700" />
                    </button>
                    <button
                      onClick={() => handleDeleteMenu(menu.id)}
                      className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
                    >
                      <Trash2 className="w-5 h-5 text-red-500" />
                    </button>
                  </div>
                </div>
                <div className="p-3">
                  <h3 className="font-medium text-gray-900 truncate">{menu.name}</h3>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs text-gray-500">{menu.category?.name}</span>
                    {menu.price && <span className="text-xs font-medium text-[#025566]">{menu.price}</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* 메뉴 추가/수정 모달 */}
      {showMenuModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex items-center justify-between">
              <h3 className="text-lg font-bold">{editingMenu ? '메뉴 수정' : '새 메뉴 추가'}</h3>
              <button onClick={() => setShowMenuModal(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* 카테고리 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">카테고리 *</label>
                <select
                  value={menuForm.categoryId}
                  onChange={(e) => setMenuForm((prev) => ({ ...prev, categoryId: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#025566]"
                >
                  <option value="">선택하세요</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              {/* 표시 모드 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">표시 방식 *</label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setMenuForm((prev) => ({ ...prev, displayMode: 'MODAL' }))}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 transition-colors ${
                      menuForm.displayMode === 'MODAL' ? 'border-[#025566] bg-[#025566]/5 text-[#025566]' : 'border-gray-200 text-gray-600'
                    }`}
                  >
                    <Monitor className="w-5 h-5" />
                    <span>모달</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setMenuForm((prev) => ({ ...prev, displayMode: 'DETAIL' }))}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 transition-colors ${
                      menuForm.displayMode === 'DETAIL' ? 'border-[#025566] bg-[#025566]/5 text-[#025566]' : 'border-gray-200 text-gray-600'
                    }`}
                  >
                    <Maximize2 className="w-5 h-5" />
                    <span>상세페이지</span>
                  </button>
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  모달: 클릭 시 팝업으로 표시 / 상세페이지: 별도 페이지로 이동
                </p>
              </div>

              {/* 이미지 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">이미지 *</label>
                {menuForm.imageUrl ? (
                  <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={menuForm.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                    <button
                      onClick={() => setMenuForm((prev) => ({ ...prev, imageUrl: '' }))}
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
                          <p className="text-sm text-gray-500">클릭하여 이미지 업로드</p>
                        </>
                      )}
                    </div>
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={uploading} />
                  </label>
                )}
              </div>

              {/* 메뉴명 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">메뉴명 *</label>
                <input
                  type="text"
                  value={menuForm.name}
                  onChange={(e) => setMenuForm((prev) => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#025566]"
                  placeholder="메뉴 이름"
                />
              </div>

              {/* 가격 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">가격 (선택)</label>
                <input
                  type="text"
                  value={menuForm.price}
                  onChange={(e) => setMenuForm((prev) => ({ ...prev, price: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#025566]"
                  placeholder="예: 15,000원~"
                />
              </div>

              {/* 간단 설명 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">간단 설명 (선택)</label>
                <textarea
                  value={menuForm.description}
                  onChange={(e) => setMenuForm((prev) => ({ ...prev, description: e.target.value }))}
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#025566] resize-none"
                  placeholder="한 줄 설명"
                />
              </div>

              {/* 상세 내용 (상세페이지 모드일 때만) */}
              {menuForm.displayMode === 'DETAIL' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">상세 내용</label>
                  <textarea
                    value={menuForm.content}
                    onChange={(e) => setMenuForm((prev) => ({ ...prev, content: e.target.value }))}
                    rows={6}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#025566] resize-none"
                    placeholder="상세 페이지에 표시될 내용을 입력하세요"
                  />
                </div>
              )}
            </div>

            <div className="p-6 border-t flex gap-3 justify-end">
              <button onClick={() => setShowMenuModal(false)} className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                취소
              </button>
              <button onClick={handleSaveMenu} className="px-4 py-2 bg-[#025566] text-white rounded-lg hover:bg-[#013A46] transition-colors">
                저장
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 카테고리 관리 모달 */}
      {showCategoryModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex items-center justify-between">
              <h3 className="text-lg font-bold">카테고리 관리</h3>
              <button onClick={() => setShowCategoryModal(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              {/* 기존 카테고리 목록 */}
              {categories.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">기존 카테고리</h4>
                  <div className="space-y-2">
                    {categories.map((cat) => (
                      <div key={cat.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <span className="font-medium text-gray-900">{cat.name}</span>
                          <span className="text-xs text-gray-500 ml-2">({cat.slug})</span>
                        </div>
                        <div className="flex gap-1">
                          <button
                            onClick={() => openEditCategoryModal(cat)}
                            className="p-1.5 text-gray-500 hover:bg-gray-200 rounded transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteCategory(cat.id)}
                            className="p-1.5 text-red-500 hover:bg-red-50 rounded transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 새 카테고리 / 수정 폼 */}
              <div className="border-t pt-6">
                <h4 className="text-sm font-medium text-gray-700 mb-3">
                  {editingCategory ? '카테고리 수정' : '새 카테고리 추가'}
                </h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">이름 *</label>
                    <input
                      type="text"
                      value={categoryForm.name}
                      onChange={(e) => setCategoryForm((prev) => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#025566]"
                      placeholder="예: 메인 요리"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">슬러그 * (URL용, 영문)</label>
                    <input
                      type="text"
                      value={categoryForm.slug}
                      onChange={(e) => setCategoryForm((prev) => ({ ...prev, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#025566]"
                      placeholder="예: main-dish"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">설명 (선택)</label>
                    <input
                      type="text"
                      value={categoryForm.description}
                      onChange={(e) => setCategoryForm((prev) => ({ ...prev, description: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#025566]"
                      placeholder="카테고리 설명"
                    />
                  </div>
                  <div className="flex gap-2">
                    {editingCategory && (
                      <button
                        onClick={() => {
                          setEditingCategory(null);
                          setCategoryForm({ name: '', slug: '', description: '' });
                        }}
                        className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        취소
                      </button>
                    )}
                    <button
                      onClick={handleSaveCategory}
                      className="flex-1 px-4 py-2 bg-[#025566] text-white rounded-lg hover:bg-[#013A46] transition-colors"
                    >
                      {editingCategory ? '수정' : '추가'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
