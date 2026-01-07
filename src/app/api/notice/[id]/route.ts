import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '@/lib/prisma';
import { authOptions } from '@/auth';

// GET: 공지사항 상세 조회
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const notice = await prisma.notice.findUnique({
      where: { id },
      include: {
        author: {
          select: { name: true, email: true },
        },
      },
    });

    if (!notice) {
      return NextResponse.json(
        { error: '공지사항을 찾을 수 없습니다' },
        { status: 404 }
      );
    }

    // 조회수 증가
    await prisma.notice.update({
      where: { id },
      data: { viewCount: { increment: 1 } },
    });

    return NextResponse.json(notice);
  } catch (error) {
    console.error('Notice fetch error:', error);
    return NextResponse.json(
      { error: '공지사항을 불러오는데 실패했습니다' },
      { status: 500 }
    );
  }
}

// PUT: 공지사항 수정 (관리자 전용)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: '권한이 없습니다' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { title, content, isPinned, isVisible } = body;

    const notice = await prisma.notice.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(content && { content }),
        ...(typeof isPinned === 'boolean' && { isPinned }),
        ...(typeof isVisible === 'boolean' && { isVisible }),
      },
      include: {
        author: {
          select: { name: true, email: true },
        },
      },
    });

    return NextResponse.json(notice);
  } catch (error) {
    console.error('Notice update error:', error);
    return NextResponse.json(
      { error: '공지사항 수정에 실패했습니다' },
      { status: 500 }
    );
  }
}

// DELETE: 공지사항 삭제 (관리자 전용)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: '권한이 없습니다' }, { status: 401 });
    }

    const { id } = await params;

    await prisma.notice.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Notice delete error:', error);
    return NextResponse.json(
      { error: '공지사항 삭제에 실패했습니다' },
      { status: 500 }
    );
  }
}
