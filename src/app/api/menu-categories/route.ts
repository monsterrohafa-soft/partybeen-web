import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '@/lib/prisma';
import { authOptions } from '@/auth';

// GET: 메뉴 카테고리 목록
export async function GET() {
  try {
    const categories = await prisma.menuCategory.findMany({
      where: { isVisible: true },
      include: {
        _count: { select: { menus: true } },
      },
      orderBy: { orderIndex: 'asc' },
    });

    return NextResponse.json(categories);
  } catch (error) {
    console.error('Menu categories fetch error:', error);
    return NextResponse.json(
      { error: '카테고리를 불러오는데 실패했습니다' },
      { status: 500 }
    );
  }
}

// POST: 새 카테고리 생성 (관리자 전용)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: '권한이 없습니다' }, { status: 401 });
    }

    const body = await request.json();
    const { name, slug, description } = body;

    if (!name || !slug) {
      return NextResponse.json(
        { error: '이름과 슬러그는 필수입니다' },
        { status: 400 }
      );
    }

    // 마지막 orderIndex 가져오기
    const lastCategory = await prisma.menuCategory.findFirst({
      orderBy: { orderIndex: 'desc' },
    });

    const category = await prisma.menuCategory.create({
      data: {
        name,
        slug,
        description,
        orderIndex: (lastCategory?.orderIndex || 0) + 1,
      },
    });

    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    console.error('Menu category create error:', error);
    return NextResponse.json(
      { error: '카테고리 생성에 실패했습니다' },
      { status: 500 }
    );
  }
}
