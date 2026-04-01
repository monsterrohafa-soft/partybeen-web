import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import { uploadImageToR2 } from '@/lib/r2';

// body 크기 제한 해제 (이미지 업로드용, 최대 50MB)
export const runtime = 'nodejs';
export const maxDuration = 60;

// 포트폴리오 이미지 업로드 (서버사이드 R2 업로드 + sharp 압축)
export async function POST(request: NextRequest) {
  try {
    // 인증 확인
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: '권한이 없습니다' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: '파일이 없습니다' }, { status: 400 });
    }

    // 파일 확장자 검증
    const ext = file.name.split('.').pop()?.toLowerCase();
    const allowedExtensions = ['jpg', 'jpeg', 'png', 'webp', 'gif'];
    if (!ext || !allowedExtensions.includes(ext)) {
      return NextResponse.json(
        { error: '허용되지 않는 파일 형식입니다. (JPG, PNG, WebP, GIF만 가능)' },
        { status: 400 }
      );
    }

    // 파일 크기 검증 (50MB)
    const maxSize = 50 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: '파일 크기가 너무 큽니다. (최대 50MB)' },
        { status: 400 }
      );
    }

    // R2에 업로드 (원본 백업 + WebP q90 압축)
    const buffer = Buffer.from(await file.arrayBuffer());
    const url = await uploadImageToR2(buffer, file.name, 'portfolio');

    return NextResponse.json({ url });
  } catch (error) {
    console.error('Portfolio upload error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '업로드 실패' },
      { status: 500 }
    );
  }
}
