import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '@/lib/prisma';
import { authOptions } from '@/auth';

// GET: 포트폴리오 목록 조회
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    const portfolios = await prisma.portfolio.findMany({
      where: {
        isVisible: true,
        ...(category && category !== 'all' ? { category: { slug: category } } : {}),
      },
      include: {
        category: true,
      },
      orderBy: [{ orderIndex: 'asc' }, { createdAt: 'desc' }],
    });

    return NextResponse.json(portfolios);
  } catch (error) {
    console.error('Portfolio fetch error:', error);
    return NextResponse.json(
      { error: '포트폴리오를 불러오는데 실패했습니다' },
      { status: 500 }
    );
  }
}

// POST: 포트폴리오 추가
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: '권한이 없습니다' }, { status: 401 });
    }

    const body = await request.json();
    const { title, description, imageUrl, categoryId } = body;

    if (!title || !imageUrl || !categoryId) {
      return NextResponse.json(
        { error: '필수 항목을 입력해주세요' },
        { status: 400 }
      );
    }

    // 가장 큰 orderIndex 찾기
    const maxOrder = await prisma.portfolio.findFirst({
      where: { categoryId },
      orderBy: { orderIndex: 'desc' },
      select: { orderIndex: true },
    });

    const portfolio = await prisma.portfolio.create({
      data: {
        title,
        description,
        imageUrl,
        categoryId,
        orderIndex: (maxOrder?.orderIndex ?? 0) + 1,
      },
      include: {
        category: true,
      },
    });

    return NextResponse.json(portfolio, { status: 201 });
  } catch (error) {
    console.error('Portfolio create error:', error);
    return NextResponse.json(
      { error: '포트폴리오 추가에 실패했습니다' },
      { status: 500 }
    );
  }
}
