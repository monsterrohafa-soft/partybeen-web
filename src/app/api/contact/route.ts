import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

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

    // 네이버 SMTP 설정
    const transporter = nodemailer.createTransport({
      host: 'smtp.naver.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.NAVER_EMAIL,
        pass: process.env.NAVER_PASSWORD,
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
      from: `"파티빈 홈페이지" <${process.env.NAVER_EMAIL}>`,
      to: 'partybeen@naver.com',
      subject: `[파티빈] 새로운 견적 문의 - ${name}`,
      text: mailContent,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('이메일 전송 오류:', error);
    return NextResponse.json(
      { error: '이메일 전송에 실패했습니다.' },
      { status: 500 }
    );
  }
}
