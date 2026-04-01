import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import { getR2PublicUrl } from '@/lib/r2';

// 상세페이지 이미지 업로드 정보 발급 (클라이언트 → Worker 직접 업로드)
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

    const workerUrl = process.env.UPLOAD_WORKER_URL;
    const workerSecret = process.env.UPLOAD_WORKER_SECRET;

    if (!workerUrl || !workerSecret) {
      return NextResponse.json({ error: 'Worker 설정이 없습니다' }, { status: 500 });
    }

    const publicUrl = getR2PublicUrl(key);

    return NextResponse.json({
      uploadUrl: `${workerUrl}/upload/${key}`,
      token: workerSecret,
      publicUrl,
    });
  } catch (error) {
    console.error('Detail upload info error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '실패' },
      { status: 500 },
    );
  }
}
