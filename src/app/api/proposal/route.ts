import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
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

// POST: 제안서 DB 저장 (클라이언트 업로드 완료 후)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: '권한이 없습니다' }, { status: 401 });
    }

    const body = await request.json();
    const { title, filename, fileUrl } = body;

    if (!title || !filename || !fileUrl) {
      return NextResponse.json(
        { error: '필수 정보가 누락되었습니다' },
        { status: 400 }
      );
    }

    // DB에 저장
    const proposal = await prisma.proposal.create({
      data: {
        title,
        filename,
        fileUrl,
      },
    });

    return NextResponse.json(proposal, { status: 201 });
  } catch (error) {
    console.error('Proposal save error:', error);
    return NextResponse.json(
      { error: '제안서 저장에 실패했습니다' },
      { status: 500 }
    );
  }
}
