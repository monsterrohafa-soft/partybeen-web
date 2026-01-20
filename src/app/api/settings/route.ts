import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '@/lib/prisma';
import { authOptions } from '@/auth';

// 설정 조회
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 });
    }

    const settings = await prisma.siteSetting.findMany();

    // key-value 형태로 변환
    const settingsMap: Record<string, string> = {};
    settings.forEach(s => {
      // 비밀번호는 마스킹 처리
      if (s.key === 'smtp_password' && s.value) {
        settingsMap[s.key] = '********';
      } else {
        settingsMap[s.key] = s.value;
      }
    });

    return NextResponse.json(settingsMap);
  } catch (error) {
    console.error('설정 조회 오류:', error);
    return NextResponse.json({ error: '설정 조회에 실패했습니다.' }, { status: 500 });
  }
}

// 설정 저장
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 });
    }

    const body = await request.json();
    const { smtp_email, smtp_password } = body;

    // SMTP 이메일 저장
    if (smtp_email !== undefined) {
      await prisma.siteSetting.upsert({
        where: { key: 'smtp_email' },
        update: { value: smtp_email },
        create: { key: 'smtp_email', value: smtp_email },
      });
    }

    // SMTP 비밀번호 저장 (빈 값이 아닐 때만)
    if (smtp_password && smtp_password !== '********') {
      await prisma.siteSetting.upsert({
        where: { key: 'smtp_password' },
        update: { value: smtp_password },
        create: { key: 'smtp_password', value: smtp_password },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('설정 저장 오류:', error);
    return NextResponse.json({ error: '설정 저장에 실패했습니다.' }, { status: 500 });
  }
}
