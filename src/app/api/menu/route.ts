import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '@/lib/prisma';
import { authOptions } from '@/auth';

// GET: 메뉴 목록
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const includeHidden = searchParams.get('includeHidden') === 'true';

    const where: any = {};
    if (!includeHidden) {
      where.isVisible = true;
    }
    if (category) {
      where.category = { slug: category };
    }

    const menus = await prisma.menu.findMany({
      where,
      include: {
        category: true,
      },
      orderBy: [{ category: { orderIndex: 'asc' } }, { orderIndex: 'asc' }],
    });

    return NextResponse.json(menus);
  } catch (error) {
    console.error('Menu fetch error:', error);
    return NextResponse.json(
      { error: '메뉴를 불러오는데 실패했습니다' },
      { status: 500 }
    );
  }
}

// POST: 새 메뉴 추가 (관리자 전용)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: '권한이 없습니다' }, { status: 401 });
    }

    const body = await request.json();
    const { name, description, content, price, imageUrl, detailImageUrl, displayMode, categoryId } = body;

    if (!name || !imageUrl || !categoryId) {
      return NextResponse.json(
        { error: '이름, 이미지, 카테고리는 필수입니다' },
        { status: 400 }
      );
    }

    // 기존 항목 orderIndex를 +1 밀어내고 새 항목을 맨 위(0)에 삽입
    await prisma.menu.updateMany({
      where: { categoryId },
      data: { orderIndex: { increment: 1 } },
    });

    const menu = await prisma.menu.create({
      data: {
        name,
        description,
        content,
        price,
        imageUrl,
        detailImageUrl,
        displayMode: displayMode || 'MODAL',
        categoryId,
        orderIndex: 0,
      },
      include: {
        category: true,
      },
    });

    return NextResponse.json(menu, { status: 201 });
  } catch (error) {
    console.error('Menu create error:', error);
    return NextResponse.json(
      { error: '메뉴 추가에 실패했습니다' },
      { status: 500 }
    );
  }
}
