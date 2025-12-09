import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '@/lib/prisma';
import { authOptions } from '@/auth';
import { del } from '@vercel/blob';

// GET: 단일 포트폴리오 조회
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const portfolio = await prisma.portfolio.findUnique({
      where: { id },
      include: { category: true },
    });

    if (!portfolio) {
      return NextResponse.json(
        { error: '포트폴리오를 찾을 수 없습니다' },
        { status: 404 }
      );
    }

    return NextResponse.json(portfolio);
  } catch (error) {
    console.error('Portfolio fetch error:', error);
    return NextResponse.json(
      { error: '포트폴리오를 불러오는데 실패했습니다' },
      { status: 500 }
    );
  }
}

// PUT: 포트폴리오 수정
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: '권한이 없습니다' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { title, description, imageUrl, categoryId, orderIndex, isVisible } = body;

    const portfolio = await prisma.portfolio.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(description !== undefined && { description }),
        ...(imageUrl && { imageUrl }),
        ...(categoryId && { categoryId }),
        ...(orderIndex !== undefined && { orderIndex }),
        ...(isVisible !== undefined && { isVisible }),
      },
      include: { category: true },
    });

    return NextResponse.json(portfolio);
  } catch (error) {
    console.error('Portfolio update error:', error);
    return NextResponse.json(
      { error: '포트폴리오 수정에 실패했습니다' },
      { status: 500 }
    );
  }
}

// DELETE: 포트폴리오 삭제
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: '권한이 없습니다' }, { status: 401 });
    }

    const { id } = await params;

    // 기존 이미지 URL 가져오기
    const existing = await prisma.portfolio.findUnique({
      where: { id },
      select: { imageUrl: true },
    });

    // 포트폴리오 삭제
    await prisma.portfolio.delete({
      where: { id },
    });

    // Vercel Blob에서 이미지 삭제 (URL이 blob.vercel-storage.com인 경우만)
    if (existing?.imageUrl?.includes('blob.vercel-storage.com')) {
      try {
        await del(existing.imageUrl);
      } catch (e) {
        console.warn('Failed to delete blob:', e);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Portfolio delete error:', error);
    return NextResponse.json(
      { error: '포트폴리오 삭제에 실패했습니다' },
      { status: 500 }
    );
  }
}
