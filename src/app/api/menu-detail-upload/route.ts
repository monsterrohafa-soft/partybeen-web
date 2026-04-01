import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import { getPresignedUploadUrl } from '@/lib/r2';

// 메뉴 상세페이지 이미지용 presigned URL 발급 (압축 없이, 용량 제한 없음)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: '권한이 없습니다' }, { status: 401 });
    }

    const { filename, contentType } = await request.json();

    if (!filename || !contentType) {
      return NextResponse.json({ error: '파일 정보가 없습니다' }, { status: 400 });
    }

    // 이미지 파일만 허용
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(contentType)) {
      return NextResponse.json(
        { error: '허용되지 않는 파일 형식입니다. (JPG, PNG, WebP, GIF만 가능)' },
        { status: 400 },
      );
    }

    const timestamp = Date.now();
    const safeName = filename
      .replace(/\.[^.]+$/, '')
      .replace(/[^a-zA-Z0-9._-]/g, '_')
      .replace(/_+/g, '_')
      .replace(/^_|_$/g, '');
    const ext = filename.split('.').pop()?.toLowerCase() || 'jpg';
    const key = `images/menu-detail/${timestamp}-${safeName}.${ext}`;

    const { uploadUrl, publicUrl } = await getPresignedUploadUrl(key, contentType);

    return NextResponse.json({ uploadUrl, publicUrl });
  } catch (error) {
    console.error('Presigned URL error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'URL 발급 실패' },
      { status: 500 },
    );
  }
}
