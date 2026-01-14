import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { del } from '@vercel/blob';
import prisma from '@/lib/prisma';
import { authOptions } from '@/auth';

// GET: 제안서 상세 조회
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const proposal = await prisma.proposal.findUnique({
      where: { id },
    });

    if (!proposal) {
      return NextResponse.json(
        { error: '제안서를 찾을 수 없습니다' },
        { status: 404 }
      );
    }

    return NextResponse.json(proposal);
  } catch (error) {
    console.error('Proposal fetch error:', error);
    return NextResponse.json(
      { error: '제안서를 불러오는데 실패했습니다' },
      { status: 500 }
    );
  }
}

// PUT: 제안서 수정 (관리자 전용)
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
    const { title, isVisible } = body;

    const proposal = await prisma.proposal.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(typeof isVisible === 'boolean' && { isVisible }),
      },
    });

    return NextResponse.json(proposal);
  } catch (error) {
    console.error('Proposal update error:', error);
    return NextResponse.json(
      { error: '제안서 수정에 실패했습니다' },
      { status: 500 }
    );
  }
}

// DELETE: 제안서 삭제 (관리자 전용)
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

    // 기존 제안서 조회
    const proposal = await prisma.proposal.findUnique({ where: { id } });
    if (!proposal) {
      return NextResponse.json(
        { error: '제안서를 찾을 수 없습니다' },
        { status: 404 }
      );
    }

    // Vercel Blob에서 파일 삭제
    try {
      await del(proposal.fileUrl);
    } catch (blobError) {
      console.error('Blob delete error:', blobError);
    }

    // DB에서 삭제
    await prisma.proposal.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Proposal delete error:', error);
    return NextResponse.json(
      { error: '제안서 삭제에 실패했습니다' },
      { status: 500 }
    );
  }
}
