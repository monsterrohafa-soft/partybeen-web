import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import { uploadToR2 } from '@/lib/r2';

// 메뉴 상세페이지 이미지 업로드 (서버에서 추가 압축 없이 원본 그대로 R2 저장)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: '권한이 없습니다' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: '파일이 없습니다' }, { status: 400 });
    }

    const ext = file.name.split('.').pop()?.toLowerCase();
    const allowedExtensions = ['jpg', 'jpeg', 'png', 'webp', 'gif'];
    if (!ext || !allowedExtensions.includes(ext)) {
      return NextResponse.json(
        { error: '허용되지 않는 파일 형식입니다. (JPG, PNG, WebP, GIF만 가능)' },
        { status: 400 },
      );
    }

    // 원본 그대로 R2에 업로드 (sharp 압축 없음)
    const buffer = Buffer.from(await file.arrayBuffer());
    const timestamp = Date.now();
    const safeName = file.name
      .replace(/\.[^.]+$/, '')
      .replace(/[^a-zA-Z0-9._-]/g, '_')
      .replace(/_+/g, '_')
      .replace(/^_|_$/g, '');

    const contentType = file.type || `image/${ext}`;
    const key = `images/menu-detail/${timestamp}-${safeName}.${ext}`;
    const url = await uploadToR2(buffer, key, contentType);

    return NextResponse.json({ url });
  } catch (error) {
    console.error('Menu detail upload error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '업로드 실패' },
      { status: 500 },
    );
  }
}
