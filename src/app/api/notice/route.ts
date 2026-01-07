import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '@/lib/prisma';
import { authOptions } from '@/auth';

// GET: 공지사항 목록 조회
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const includeHidden = searchParams.get('includeHidden') === 'true';
    const skip = (page - 1) * limit;

    // includeHidden=true면 모든 공지사항 (관리자용)
    const whereClause = includeHidden ? {} : { isVisible: true };

    const [notices, total] = await Promise.all([
      prisma.notice.findMany({
        where: whereClause,
        include: {
          author: {
            select: { name: true, email: true },
          },
        },
        orderBy: [{ isPinned: 'desc' }, { createdAt: 'desc' }],
        skip,
        take: limit,
      }),
      prisma.notice.count({ where: whereClause }),
    ]);

    return NextResponse.json({
      notices,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Notice fetch error:', error);
    return NextResponse.json(
      { error: '공지사항을 불러오는데 실패했습니다' },
      { status: 500 }
    );
  }
}

// POST: 공지사항 작성 (관리자 전용)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: '권한이 없습니다' }, { status: 401 });
    }

    const body = await request.json();
    const { title, content, isPinned } = body;

    if (!title || !content) {
      return NextResponse.json(
        { error: '제목과 내용을 입력해주세요' },
        { status: 400 }
      );
    }

    const notice = await prisma.notice.create({
      data: {
        title,
        content,
        isPinned: isPinned || false,
        authorId: (session.user as any).id,
      },
      include: {
        author: {
          select: { name: true, email: true },
        },
      },
    });

    return NextResponse.json(notice, { status: 201 });
  } catch (error) {
    console.error('Notice create error:', error);
    return NextResponse.json(
      { error: '공지사항 작성에 실패했습니다' },
      { status: 500 }
    );
  }
}
