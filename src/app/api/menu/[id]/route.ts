import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '@/lib/prisma';
import { authOptions } from '@/auth';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET: 단일 메뉴
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const menu = await prisma.menu.findUnique({
      where: { id },
      include: {
        category: true,
      },
    });

    if (!menu) {
      return NextResponse.json(
        { error: '메뉴를 찾을 수 없습니다' },
        { status: 404 }
      );
    }

    return NextResponse.json(menu);
  } catch (error) {
    console.error('Menu fetch error:', error);
    return NextResponse.json(
      { error: '메뉴를 불러오는데 실패했습니다' },
      { status: 500 }
    );
  }
}

// PUT: 메뉴 수정 (관리자 전용)
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: '권한이 없습니다' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    const menu = await prisma.menu.update({
      where: { id },
      data: body,
      include: {
        category: true,
      },
    });

    return NextResponse.json(menu);
  } catch (error) {
    console.error('Menu update error:', error);
    return NextResponse.json(
      { error: '메뉴 수정에 실패했습니다' },
      { status: 500 }
    );
  }
}

// DELETE: 메뉴 삭제 (관리자 전용)
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: '권한이 없습니다' }, { status: 401 });
    }

    const { id } = await params;
    await prisma.menu.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Menu delete error:', error);
    return NextResponse.json(
      { error: '메뉴 삭제에 실패했습니다' },
      { status: 500 }
    );
  }
}
