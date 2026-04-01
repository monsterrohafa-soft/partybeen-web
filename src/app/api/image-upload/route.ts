import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import { getR2PublicUrl } from '@/lib/r2';

// 통합 이미지 업로드 URL 발급 (Worker 경유)
// folder: 'menu' | 'menu-detail' | 'portfolio'
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: '권한이 없습니다' }, { status: 401 });
    }

    const { filename, contentType, folder } = await request.json();

    if (!filename || !contentType || !folder) {
      return NextResponse.json({ error: '파일 정보가 없습니다' }, { status: 400 });
    }

    const allowedFolders = ['menu', 'menu-detail', 'portfolio'];
    if (!allowedFolders.includes(folder)) {
      return NextResponse.json({ error: '잘못된 폴더입니다' }, { status: 400 });
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
    const key = `images/${folder}/${timestamp}-${safeName}.${ext}`;

    const workerUrl = process.env.UPLOAD_WORKER_URL;
    const workerSecret = process.env.UPLOAD_WORKER_SECRET;

    if (!workerUrl || !workerSecret) {
      return NextResponse.json({ error: 'Worker 설정이 없습니다' }, { status: 500 });
    }

    return NextResponse.json({
      uploadUrl: `${workerUrl}/upload/${key}`,
      token: workerSecret,
      publicUrl: getR2PublicUrl(key),
    });
  } catch (error) {
    console.error('Image upload error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '실패' },
      { status: 500 },
    );
  }
}
