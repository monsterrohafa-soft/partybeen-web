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
  Upload as UploadIcon,
  X,
  Loader2,
  Image as ImageIcon,
  Images,
  FileText,
  UtensilsCrossed,
  Eye,
  EyeOff,
  Monitor,
  Maximize2,
  Upload,
  Settings,
} from 'lucide-react';

interface MenuCategory {
  id: string;
  name: string;
  slug: string;
}

interface Menu {
  id: string;
  name: string;
  description?: string;
  content?: string;
  price?: string;
  imageUrl: string;
  detailImageUrl?: string;
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
  const [loading, setLoading] = useState(true);
  const [showMenuModal, setShowMenuModal] = useState(false);
  const [editingMenu, setEditingMenu] = useState<Menu | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadingDetail, setUploadingDetail] = useState(false);

  const [menuForm, setMenuForm] = useState({
    name: '',
    description: '',
    content: '',
    price: '',
    imageUrl: '',
    detailImageUrl: '',
    displayMode: 'MODAL' as 'MODAL' | 'DETAIL',
    categoryId: '',
  });

  const loadData = useCallback(async () => {
    try {
      const [menusRes, categoriesRes] = await Promise.all([
        fetch('/api/menu?includeHidden=true'),
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
  }, []);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    } else if (status === 'authenticated') {
      loadData();
    }
  }, [status, router, loadData]);

  // 썸네일 이미지 업로드 (서버사이드 R2 업로드 + sharp 압축)
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/menu-upload', { method: 'POST', body: formData });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || '업로드 실패');
      }
      const { url } = await res.json();
      setMenuForm((prev) => ({ ...prev, imageUrl: url }));
    } catch (error) {
      console.error('Image upload error:', error);
      alert('업로드 중 오류가 발생했습니다: ' + (error instanceof Error ? error.message : '알 수 없는 오류'));
    } finally {
      setUploading(false);
    }
  };

  // 상세페이지 이미지 업로드 (서버사이드 R2 업로드 + sharp 압축)
  const handleDetailImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingDetail(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/menu-upload', { method: 'POST', body: formData });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || '업로드 실패');
      }
      const { url } = await res.json();
      setMenuForm((prev) => ({ ...prev, detailImageUrl: url }));
    } catch (error) {
      console.error('Detail image upload error:', error);
      alert('업로드 중 오류가 발생했습니다: ' + (error instanceof Error ? error.message : '알 수 없는 오류'));
    } finally {
      setUploadingDetail(false);
    }
  };

  // 메뉴 저장
  const handleSaveMenu = async () => {
    if (!menuForm.name || !menuForm.imageUrl) {
      alert('이름과 이미지는 필수입니다');
      return;
    }

    // 카테고리가 없으면 첫번째 카테고리 자동 선택
    const categoryId = menuForm.categoryId || categories[0]?.id;
    if (!categoryId) {
      alert('카테고리가 없습니다. 먼저 카테고리를 추가해주세요.');
      return;
    }

    try {
      const url = editingMenu ? `/api/menu/${editingMenu.id}` : '/api/menu';
      const method = editingMenu ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...menuForm, categoryId }),
      });

      if (res.ok) {
        setShowMenuModal(false);
        setEditingMenu(null);
        setMenuForm({ name: '', description: '', content: '', price: '', imageUrl: '', detailImageUrl: '', displayMode: 'MODAL', categoryId: '' });
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

  // 메뉴 수정 모달 열기
  const openEditMenuModal = (menu: Menu) => {
    setEditingMenu(menu);
    setMenuForm({
      name: menu.name,
      description: menu.description || '',
      content: menu.content || '',
      price: menu.price || '',
      imageUrl: menu.imageUrl,
      detailImageUrl: menu.detailImageUrl || '',
      displayMode: menu.displayMode,
      categoryId: menu.categoryId,
    });
    setShowMenuModal(true);
  };

  // 새 메뉴 모달 열기
  const openNewMenuModal = () => {
    setEditingMenu(null);
    setMenuForm({ name: '', description: '', content: '', price: '', imageUrl: '', detailImageUrl: '', displayMode: 'MODAL', categoryId: categories[0]?.id || '' });
    setShowMenuModal(true);
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
          <Link href="/admin/proposal" className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white text-gray-700 hover:bg-gray-50 transition-colors whitespace-nowrap">
            <Upload className="w-4 h-4" />
            제안서
          </Link>
          <Link href="/admin/settings" className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white text-gray-700 hover:bg-gray-50 transition-colors whitespace-nowrap">
            <Settings className="w-4 h-4" />
            설정
          </Link>
        </div>

        {/* 상단 액션 */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">메뉴 관리</h2>
            <p className="text-gray-500">메뉴를 추가, 수정, 삭제할 수 있습니다</p>
          </div>
          <button
            onClick={openNewMenuModal}
            className="flex items-center gap-2 px-4 py-2 bg-[#025566] text-white rounded-lg hover:bg-[#013A46] transition-colors"
          >
            <Plus className="w-5 h-5" />
            새 메뉴 추가
          </button>
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
                  {menu.price && <span className="text-xs font-medium text-[#025566]">{menu.price}</span>}
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

              {/* 썸네일 이미지 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  썸네일 이미지 * <span className="text-xs text-gray-400 font-normal">(목록에서 보여지는 정사각형 이미지)</span>
                </label>
                {menuForm.imageUrl ? (
                  <div className="relative aspect-square w-32 rounded-lg overflow-hidden bg-gray-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={menuForm.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                    <button
                      onClick={() => setMenuForm((prev) => ({ ...prev, imageUrl: '' }))}
                      className="absolute top-1 right-1 p-1 bg-white rounded-full shadow"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <label className="block cursor-pointer w-32">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-[#025566] transition-colors aspect-square flex flex-col items-center justify-center">
                      {uploading ? (
                        <Loader2 className="w-6 h-6 animate-spin text-[#025566]" />
                      ) : (
                        <>
                          <UploadIcon className="w-6 h-6 text-gray-400 mb-1" />
                          <p className="text-xs text-gray-500">업로드</p>
                        </>
                      )}
                    </div>
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={uploading} />
                  </label>
                )}
              </div>

              {/* 상세페이지 이미지 (상세페이지 모드일 때만) */}
              {menuForm.displayMode === 'DETAIL' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    상세페이지 이미지 <span className="text-xs text-gray-400 font-normal">(세로로 긴 이미지 권장, 없으면 썸네일 사용)</span>
                  </label>
                  {menuForm.detailImageUrl ? (
                    <div className="relative w-full max-w-xs rounded-lg overflow-hidden bg-gray-100">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={menuForm.detailImageUrl} alt="Detail Preview" className="w-full h-auto" />
                      <button
                        onClick={() => setMenuForm((prev) => ({ ...prev, detailImageUrl: '' }))}
                        className="absolute top-2 right-2 p-1 bg-white rounded-full shadow"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <label className="block cursor-pointer">
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#025566] transition-colors max-w-xs">
                        {uploadingDetail ? (
                          <Loader2 className="w-8 h-8 mx-auto animate-spin text-[#025566]" />
                        ) : (
                          <>
                            <UploadIcon className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                            <p className="text-sm text-gray-500">상세페이지용 이미지 업로드</p>
                            <p className="text-xs text-gray-400 mt-1">세로로 긴 이미지도 전체가 보입니다</p>
                          </>
                        )}
                      </div>
                      <input type="file" accept="image/*" onChange={handleDetailImageUpload} className="hidden" disabled={uploadingDetail} />
                    </label>
                  )}
                </div>
              )}

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
    </div>
  );
}
