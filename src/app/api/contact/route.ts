import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import prisma from '@/lib/prisma';

// DB에서 SMTP 설정 가져오기
async function getSmtpSettings() {
  const settings = await prisma.siteSetting.findMany({
    where: {
      key: {
        in: ['smtp_email', 'smtp_password'],
      },
    },
  });

  const settingsMap: Record<string, string> = {};
  settings.forEach((s) => {
    settingsMap[s.key] = s.value;
  });

  return {
    email: settingsMap.smtp_email || process.env.NAVER_EMAIL,
    password: settingsMap.smtp_password || process.env.NAVER_PASSWORD,
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, phone, email, eventType, eventDate, guestCount, message } = body;

    // 필수 필드 검증
    if (!name || !phone || !message) {
      return NextResponse.json(
        { error: '필수 항목을 입력해주세요.' },
        { status: 400 }
      );
    }

    // DB에서 SMTP 설정 가져오기
    const smtp = await getSmtpSettings();

    if (!smtp.email || !smtp.password) {
      console.error('SMTP 설정이 없습니다.');
      return NextResponse.json(
        { error: '이메일 설정이 완료되지 않았습니다. 관리자에게 문의하세요.' },
        { status: 500 }
      );
    }

    // 네이버 SMTP 설정
    const transporter = nodemailer.createTransport({
      host: 'smtp.naver.com',
      port: 587,
      secure: false,
      auth: {
        user: smtp.email,
        pass: smtp.password,
      },
    });

    // 이메일 내용 구성
    const mailContent = `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎉 파티빈 새로운 견적 문의
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📌 고객 정보
────────────────────────────────
• 이름: ${name}
• 연락처: ${phone}
• 이메일: ${email || '미입력'}

📅 행사 정보
────────────────────────────────
• 행사 유형: ${eventType || '미선택'}
• 행사 예정일: ${eventDate || '미정'}
• 예상 인원: ${guestCount || '미선택'}

💬 문의 내용
────────────────────────────────
${message}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
이 메일은 파티빈 홈페이지에서 자동 발송되었습니다.
    `.trim();

    // 이메일 전송
    await transporter.sendMail({
      from: `"파티빈 홈페이지" <${smtp.email}>`,
      to: 'partybeen@naver.com',
      subject: `[파티빈] 새로운 견적 문의 - ${name}`,
      text: mailContent,
    });

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('이메일 전송 오류:', errorMessage);
    console.error('상세 에러:', error);
    return NextResponse.json(
      { error: `이메일 전송 실패: ${errorMessage}` },
      { status: 500 }
    );
  }
}
