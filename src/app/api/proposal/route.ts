import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { put } from '@vercel/blob';
import prisma from '@/lib/prisma';
import { authOptions } from '@/auth';

// GET: 제안서 목록 조회
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const includeHidden = searchParams.get('includeHidden') === 'true';

    const whereClause = includeHidden ? {} : { isVisible: true };

    const proposals = await prisma.proposal.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ proposals });
  } catch (error) {
    console.error('Proposal fetch error:', error);
    return NextResponse.json(
      { error: '제안서 목록을 불러오는데 실패했습니다' },
      { status: 500 }
    );
  }
}

// POST: 제안서 업로드 (관리자 전용)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: '권한이 없습니다' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const title = formData.get('title') as string;

    if (!file) {
      return NextResponse.json({ error: 'PDF 파일이 없습니다' }, { status: 400 });
    }

    if (!title) {
      return NextResponse.json({ error: '제목을 입력해주세요' }, { status: 400 });
    }

    // PDF 파일만 허용
    if (file.type !== 'application/pdf') {
      return NextResponse.json(
        { error: 'PDF 파일만 업로드 가능합니다' },
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

    // Vercel Blob에 업로드
    const blob = await put(`proposals/${Date.now()}-${file.name}`, file, {
      access: 'public',
    });

    // DB에 저장
    const proposal = await prisma.proposal.create({
      data: {
        title,
        filename: file.name,
        fileUrl: blob.url,
      },
    });

    return NextResponse.json(proposal, { status: 201 });
  } catch (error) {
    console.error('Proposal upload error:', error);
    return NextResponse.json(
      { error: '제안서 업로드에 실패했습니다' },
      { status: 500 }
    );
  }
}
