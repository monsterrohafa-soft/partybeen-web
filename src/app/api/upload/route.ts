import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { put } from '@vercel/blob';
import { authOptions } from '@/auth';

export async function POST(request: NextRequest) {
  try {
    // 인증 확인
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: '권한이 없습니다' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    // 워터마크는 클라이언트 사이드에서 처리 예정
    // const watermark = formData.get('watermark') as string || 'none';

    if (!file) {
      return NextResponse.json({ error: '파일이 없습니다' }, { status: 400 });
    }

    // 파일 타입 검증
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: '허용되지 않는 파일 형식입니다. (JPG, PNG, WebP, GIF만 가능)' },
        { status: 400 }
      );
    }

    // 파일 크기 검증 (10MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: '파일 크기가 너무 큽니다. (최대 10MB)' },
        { status: 400 }
      );
    }

    // Vercel Blob에 업로드
    const blob = await put(`portfolio/${Date.now()}-${file.name}`, file, {
      access: 'public',
    });

    return NextResponse.json({
      success: true,
      url: blob.url,
    });
  } catch (error) {
    console.error('Upload error:', error);
    const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류';
    return NextResponse.json(
      { error: `업로드 중 오류가 발생했습니다: ${errorMessage}` },
      { status: 500 }
    );
  }
}
