import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import { uploadPdfToR2 } from '@/lib/r2';

// body 크기 제한 해제 (PDF 업로드용, 최대 50MB)
export const runtime = 'nodejs';
export const maxDuration = 60;

// 제안서 PDF 업로드 (서버사이드 R2 업로드, 압축 없이)
export async function POST(request: NextRequest) {
  try {
    // 인증 확인
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: '권한이 없습니다' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: '파일이 없습니다' }, { status: 400 });
    }

    // PDF만 허용
    if (file.type !== 'application/pdf') {
      return NextResponse.json(
        { error: 'PDF 파일만 업로드할 수 있습니다.' },
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

    // R2에 업로드 (PDF는 압축 없이)
    const buffer = Buffer.from(await file.arrayBuffer());
    const url = await uploadPdfToR2(buffer, file.name);

    return NextResponse.json({ url });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 }
    );
  }
}
