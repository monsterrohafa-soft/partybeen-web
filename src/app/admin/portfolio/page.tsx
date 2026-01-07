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
  Link as LinkIcon,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Move,
  Images,
  FileText,
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
  imagePosition?: string;
  externalUrl?: string;
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

  // 언론보도 URL 입력용
  const [urlInput, setUrlInput] = useState('');
  const [parsingUrl, setParsingUrl] = useState(false);
  const [availableImages, setAvailableImages] = useState<string[]>([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // 이미지 위치 조정용
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [imagePosition, setImagePosition] = useState({ x: 50, y: 50 });

  // 워터마크 선택
  const [selectedWatermark, setSelectedWatermark] = useState<'none' | 'partybeen' | 'chef'>('none');
  const [watermarkOpacity, setWatermarkOpacity] = useState(85); // 투명도 (0-100%)

  // 폼 상태
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    imageUrl: '',
    imagePosition: '50% 50%',
    categoryId: '',
    externalUrl: '',
  });

  // 현재 선택된 카테고리가 언론보도인지 확인
  const selectedCategoryData = categories.find(c => c.id === formData.categoryId);
  const isPressCategory = selectedCategoryData?.slug === 'press';

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

  // URL에서 OG 메타데이터 파싱 (언론보도용)
  const handleParseUrl = async () => {
    if (!urlInput.trim()) {
      alert('URL을 입력해주세요');
      return;
    }

    setParsingUrl(true);
    try {
      const res = await fetch('/api/og-parse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: urlInput.trim() }),
      });

      const data = await res.json();
      if (res.ok) {
        // 이미지 목록 저장
        const images = data.images || (data.image ? [data.image] : []);
        setAvailableImages(images);
        setSelectedImageIndex(0);
        setImagePosition({ x: 50, y: 50 });

        setFormData(prev => ({
          ...prev,
          title: data.title || '',
          description: data.siteName || '', // 언론사명을 설명에
          imageUrl: images[0] || '',
          imagePosition: '50% 50%',
          externalUrl: urlInput.trim(),
        }));
      } else {
        alert(data.error || 'URL 파싱에 실패했습니다');
      }
    } catch {
      alert('URL 파싱 중 오류가 발생했습니다');
    } finally {
      setParsingUrl(false);
    }
  };

  // 이미지 선택 변경
  const handleImageSelect = (index: number) => {
    setSelectedImageIndex(index);
    setImagePosition({ x: 50, y: 50 });
    setFormData(prev => ({
      ...prev,
      imageUrl: availableImages[index] || '',
      imagePosition: '50% 50%',
    }));
  };

  // 이미지 드래그로 위치 조정
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isPressCategory) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const dx = (e.clientX - dragStart.x) * 0.5;
    const dy = (e.clientY - dragStart.y) * 0.5;

    setImagePosition(prev => ({
      x: Math.max(0, Math.min(100, prev.x - dx)),
      y: Math.max(0, Math.min(100, prev.y - dy)),
    }));
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    if (isDragging) {
      setIsDragging(false);
      setFormData(prev => ({
        ...prev,
        imagePosition: `${imagePosition.x}% ${imagePosition.y}%`,
      }));
    }
  };

  // 캔버스에 워터마크 적용 (클라이언트 사이드)
  const applyWatermark = (
    imageFile: File,
    watermarkType: 'partybeen' | 'chef',
    opacity: number // 0-100
  ): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const watermarkImg = new Image();

      // 이미지 로드
      img.onload = () => {
        // 워터마크 이미지 로드
        watermarkImg.onload = () => {
          // 캔버스 생성
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('Canvas context not available'));
            return;
          }

          // 원본 이미지 크기로 캔버스 설정
          canvas.width = img.width;
          canvas.height = img.height;

          // 원본 이미지 그리기
          ctx.drawImage(img, 0, 0);

          // 워터마크 크기 계산 (이미지의 50%)
          const watermarkWidth = img.width * 0.5;
          const watermarkHeight = (watermarkImg.height / watermarkImg.width) * watermarkWidth;

          // 워터마크 위치 (중앙)
          const x = (img.width - watermarkWidth) / 2;
          const y = (img.height - watermarkHeight) / 2;

          // 워터마크를 흰색으로 변환하고 반투명하게 적용
          // 임시 캔버스에 워터마크 그리기
          const tempCanvas = document.createElement('canvas');
          const tempCtx = tempCanvas.getContext('2d');
          if (!tempCtx) {
            reject(new Error('Temp canvas context not available'));
            return;
          }

          tempCanvas.width = watermarkImg.width;
          tempCanvas.height = watermarkImg.height;

          // 워터마크 이미지 그리기
          tempCtx.drawImage(watermarkImg, 0, 0);

          // 이미지 데이터 가져오기
          const imageData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
          const data = imageData.data;

          // 모든 픽셀을 흰색으로 변환 (알파 유지)
          const opacityRatio = opacity / 100;
          for (let i = 0; i < data.length; i += 4) {
            if (data[i + 3] > 0) { // 알파가 있는 픽셀만
              data[i] = 255;     // R
              data[i + 1] = 255; // G
              data[i + 2] = 255; // B
              // 알파는 유지하되 지정된 투명도로 감소
              data[i + 3] = Math.round(data[i + 3] * opacityRatio);
            }
          }

          tempCtx.putImageData(imageData, 0, 0);

          // 메인 캔버스에 워터마크 그리기
          ctx.drawImage(tempCanvas, x, y, watermarkWidth, watermarkHeight);

          // Blob으로 변환
          canvas.toBlob(
            (blob) => {
              if (blob) {
                resolve(blob);
              } else {
                reject(new Error('Failed to create blob'));
              }
            },
            'image/jpeg',
            0.9
          );
        };

        watermarkImg.onerror = () => reject(new Error('Failed to load watermark'));
        watermarkImg.crossOrigin = 'anonymous';
        watermarkImg.src = `/logo/${watermarkType}.png`;
      };

      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = URL.createObjectURL(imageFile);
    });
  };

  // 이미지 업로드
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);

    try {
      let fileToUpload: File | Blob = file;
      let fileName = file.name;

      // 워터마크 적용 (클라이언트 사이드 Canvas API)
      if (selectedWatermark !== 'none') {
        const watermarkedBlob = await applyWatermark(file, selectedWatermark, watermarkOpacity);
        fileToUpload = watermarkedBlob;
        // 파일명에서 확장자 제거 후 .jpg 추가
        fileName = file.name.replace(/\.[^/.]+$/, '') + '_watermarked.jpg';
      }

      const formDataUpload = new FormData();
      formDataUpload.append('file', fileToUpload, fileName);

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
    } catch (error) {
      console.error('Upload error:', error);
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
        setFormData({ title: '', description: '', imageUrl: '', imagePosition: '50% 50%', categoryId: '', externalUrl: '' });
        setUrlInput('');
        setAvailableImages([]);
        setSelectedImageIndex(0);
        setImagePosition({ x: 50, y: 50 });
        setSelectedWatermark('partybeen');
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
    const pos = item.imagePosition?.split(' ') || ['50%', '50%'];
    const posX = parseFloat(pos[0]) || 50;
    const posY = parseFloat(pos[1]) || 50;
    setImagePosition({ x: posX, y: posY });
    setFormData({
      title: item.title,
      description: item.description || '',
      imageUrl: item.imageUrl,
      imagePosition: item.imagePosition || '50% 50%',
      categoryId: item.categoryId,
      externalUrl: item.externalUrl || '',
    });
    setUrlInput(item.externalUrl || '');
    setAvailableImages(item.imageUrl ? [item.imageUrl] : []);
    setSelectedImageIndex(0);
    setShowModal(true);
  };

  // 새 항목 모달 열기
  const openNewModal = () => {
    setEditingItem(null);
    setFormData({ title: '', description: '', imageUrl: '', imagePosition: '50% 50%', categoryId: categories[0]?.id || '', externalUrl: '' });
    setUrlInput('');
    setAvailableImages([]);
    setSelectedImageIndex(0);
    setImagePosition({ x: 50, y: 50 });
    setSelectedWatermark('partybeen'); // 기본값: 파티빈 워터마크
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
        {/* 탭 네비게이션 */}
        <div className="flex gap-2 mb-6">
          <Link
            href="/admin/portfolio"
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#025566] text-white"
          >
            <Images className="w-4 h-4" />
            포트폴리오
          </Link>
          <Link
            href="/admin/notice"
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <FileText className="w-4 h-4" />
            공지사항
          </Link>
        </div>

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
              {/* 카테고리 (먼저 선택해야 모드 결정) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  카테고리 *
                </label>
                <select
                  value={formData.categoryId}
                  onChange={(e) => {
                    setFormData((prev) => ({ ...prev, categoryId: e.target.value, imageUrl: '', title: '', description: '', externalUrl: '' }));
                    setUrlInput('');
                  }}
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

              {/* 언론보도 카테고리: URL 입력 모드 */}
              {isPressCategory && (
                <div className="bg-blue-50 p-4 rounded-lg space-y-4">
                  <div className="flex items-center gap-2 text-blue-700">
                    <LinkIcon className="w-5 h-5" />
                    <span className="font-medium">언론보도 URL 입력</span>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={urlInput}
                      onChange={(e) => setUrlInput(e.target.value)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#025566]"
                      placeholder="https://news.example.com/article..."
                    />
                    <button
                      onClick={handleParseUrl}
                      disabled={parsingUrl}
                      className="px-4 py-2 bg-[#025566] text-white rounded-lg hover:bg-[#013A46] transition-colors disabled:opacity-50 whitespace-nowrap"
                    >
                      {parsingUrl ? <Loader2 className="w-5 h-5 animate-spin" /> : '불러오기'}
                    </button>
                  </div>
                  <p className="text-xs text-blue-600">
                    URL을 입력하고 불러오기를 누르면 제목과 썸네일이 자동으로 가져와집니다
                  </p>
                </div>
              )}

              {/* 워터마크 선택 (일반 포트폴리오만) */}
              {!isPressCategory && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    워터마크 로고 선택
                  </label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedWatermark('none')}
                      className={`flex-1 px-3 py-2 rounded-lg border-2 text-sm font-medium transition-colors ${
                        selectedWatermark === 'none'
                          ? 'border-[#025566] bg-[#025566]/5 text-[#025566]'
                          : 'border-gray-200 text-gray-600 hover:border-gray-300'
                      }`}
                    >
                      없음
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedWatermark('partybeen')}
                      className={`flex-1 px-3 py-2 rounded-lg border-2 text-sm font-medium transition-colors ${
                        selectedWatermark === 'partybeen'
                          ? 'border-[#025566] bg-[#025566]/5 text-[#025566]'
                          : 'border-gray-200 text-gray-600 hover:border-gray-300'
                      }`}
                    >
                      파티빈
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedWatermark('chef')}
                      className={`flex-1 px-3 py-2 rounded-lg border-2 text-sm font-medium transition-colors ${
                        selectedWatermark === 'chef'
                          ? 'border-[#025566] bg-[#025566]/5 text-[#025566]'
                          : 'border-gray-200 text-gray-600 hover:border-gray-300'
                      }`}
                    >
                      쉐프의도시락
                    </button>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    이미지 업로드 시 선택한 로고가 워터마크로 자동 삽입됩니다
                  </p>

                  {/* 투명도 조절 슬라이더 */}
                  {selectedWatermark !== 'none' && (
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        워터마크 투명도: {watermarkOpacity}%
                      </label>
                      <input
                        type="range"
                        min="10"
                        max="100"
                        value={watermarkOpacity}
                        onChange={(e) => setWatermarkOpacity(Number(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#025566]"
                      />
                      <div className="flex justify-between text-xs text-gray-400 mt-1">
                        <span>연하게</span>
                        <span>진하게</span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* 이미지 미리보기 (언론보도) 또는 이미지 업로드 (일반) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {isPressCategory ? '썸네일 미리보기' : '이미지 *'}
                  {isPressCategory && formData.imageUrl && (
                    <span className="ml-2 text-xs text-gray-400 font-normal">
                      드래그하여 위치 조정
                    </span>
                  )}
                </label>
                {formData.imageUrl ? (
                  <div
                    className={`relative aspect-video rounded-lg overflow-hidden bg-gray-100 ${isPressCategory ? 'cursor-move select-none' : ''}`}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={formData.imageUrl}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      style={{ objectPosition: `${imagePosition.x}% ${imagePosition.y}%` }}
                      draggable={false}
                    />
                    {!isPressCategory && (
                      <button
                        onClick={() => setFormData((prev) => ({ ...prev, imageUrl: '' }))}
                        className="absolute top-2 right-2 p-1 bg-white rounded-full shadow"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                    {isPressCategory && (
                      <div className="absolute top-2 left-2 px-2 py-1 bg-black/50 rounded text-white text-xs flex items-center gap-1">
                        <Move className="w-3 h-3" />
                        위치: {Math.round(imagePosition.x)}%, {Math.round(imagePosition.y)}%
                      </div>
                    )}
                    {isPressCategory && formData.externalUrl && (
                      <a
                        href={formData.externalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="absolute bottom-2 right-2 p-2 bg-white/90 rounded-full shadow hover:bg-white transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <ExternalLink className="w-4 h-4 text-gray-700" />
                      </a>
                    )}
                  </div>
                ) : !isPressCategory ? (
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
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center text-gray-400">
                    <ImageIcon className="w-8 h-8 mx-auto mb-2" />
                    <p className="text-sm">URL을 입력하면 썸네일이 표시됩니다</p>
                  </div>
                )}

                {/* 이미지 선택 UI (언론보도, 여러 이미지 있을 때) */}
                {isPressCategory && availableImages.length > 1 && (
                  <div className="mt-3">
                    <p className="text-xs text-gray-500 mb-2">
                      다른 이미지 선택 ({selectedImageIndex + 1}/{availableImages.length})
                    </p>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleImageSelect(Math.max(0, selectedImageIndex - 1))}
                        disabled={selectedImageIndex === 0}
                        className="p-1 rounded bg-gray-100 hover:bg-gray-200 disabled:opacity-30"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <div className="flex gap-2 overflow-x-auto flex-1 py-1">
                        {availableImages.map((img, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleImageSelect(idx)}
                            className={`flex-shrink-0 w-16 h-12 rounded overflow-hidden border-2 transition-colors ${
                              idx === selectedImageIndex ? 'border-[#025566]' : 'border-transparent hover:border-gray-300'
                            }`}
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={img} alt={`옵션 ${idx + 1}`} className="w-full h-full object-cover" />
                          </button>
                        ))}
                      </div>
                      <button
                        onClick={() => handleImageSelect(Math.min(availableImages.length - 1, selectedImageIndex + 1))}
                        disabled={selectedImageIndex === availableImages.length - 1}
                        className="p-1 rounded bg-gray-100 hover:bg-gray-200 disabled:opacity-30"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
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
                  placeholder={isPressCategory ? '기사 제목' : '포트폴리오 제목'}
                />
              </div>

              {/* 설명 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {isPressCategory ? '언론사명 (선택)' : '설명 (선택)'}
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, description: e.target.value }))
                  }
                  rows={isPressCategory ? 1 : 3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#025566] resize-none"
                  placeholder={isPressCategory ? '예: 부산일보' : '간단한 설명'}
                />
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
