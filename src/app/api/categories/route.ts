import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET: 카테고리 목록 조회
export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: { portfolios: true },
        },
      },
      orderBy: { name: 'asc' },
    });

    return NextResponse.json(categories);
  } catch (error) {
    console.error('Categories fetch error:', error);
    return NextResponse.json(
      { error: '카테고리를 불러오는데 실패했습니다' },
      { status: 500 }
    );
  }
}
