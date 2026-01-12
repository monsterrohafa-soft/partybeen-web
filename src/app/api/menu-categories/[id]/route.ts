import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '@/lib/prisma';
import { authOptions } from '@/auth';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET: 단일 카테고리
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const category = await prisma.menuCategory.findUnique({
      where: { id },
      include: {
        menus: {
          where: { isVisible: true },
          orderBy: { orderIndex: 'asc' },
        },
      },
    });

    if (!category) {
      return NextResponse.json(
        { error: '카테고리를 찾을 수 없습니다' },
        { status: 404 }
      );
    }

    return NextResponse.json(category);
  } catch (error) {
    console.error('Menu category fetch error:', error);
    return NextResponse.json(
      { error: '카테고리를 불러오는데 실패했습니다' },
      { status: 500 }
    );
  }
}

// PUT: 카테고리 수정 (관리자 전용)
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: '권한이 없습니다' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    const category = await prisma.menuCategory.update({
      where: { id },
      data: body,
    });

    return NextResponse.json(category);
  } catch (error) {
    console.error('Menu category update error:', error);
    return NextResponse.json(
      { error: '카테고리 수정에 실패했습니다' },
      { status: 500 }
    );
  }
}

// DELETE: 카테고리 삭제 (관리자 전용)
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: '권한이 없습니다' }, { status: 401 });
    }

    const { id } = await params;

    // 카테고리에 속한 메뉴가 있는지 확인
    const menuCount = await prisma.menu.count({ where: { categoryId: id } });
    if (menuCount > 0) {
      return NextResponse.json(
        { error: '카테고리에 메뉴가 있어 삭제할 수 없습니다' },
        { status: 400 }
      );
    }

    await prisma.menuCategory.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Menu category delete error:', error);
    return NextResponse.json(
      { error: '카테고리 삭제에 실패했습니다' },
      { status: 500 }
    );
  }
}
