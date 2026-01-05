import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { put } from '@vercel/blob';
import { authOptions } from '@/auth';
import { Jimp } from 'jimp';

// 워터마크 로고 URL (public 폴더 기준)
const WATERMARK_LOGOS: Record<string, string> = {
  partybeen: '/logo/partybeen.png',
  chef: '/logo/chef.png',
};

// 이미지에 워터마크 합성
async function addWatermark(
  imageBuffer: Buffer,
  watermarkType: string,
  baseUrl: string
): Promise<Buffer> {
  if (!watermarkType || watermarkType === 'none' || !WATERMARK_LOGOS[watermarkType]) {
    return imageBuffer;
  }

  try {
    // 원본 이미지 로드
    const image = await Jimp.read(imageBuffer);
    const imageWidth = image.width;
    const imageHeight = image.height;

    // 워터마크 로고 가져오기
    const logoUrl = `${baseUrl}${WATERMARK_LOGOS[watermarkType]}`;
    const logoResponse = await fetch(logoUrl);
    if (!logoResponse.ok) {
      console.error('Failed to fetch logo:', logoUrl);
      return imageBuffer;
    }
    const logoArrayBuffer = await logoResponse.arrayBuffer();
    const logo = await Jimp.read(Buffer.from(logoArrayBuffer));

    // 워터마크 크기 조절 (이미지의 30%)
    const watermarkWidth = Math.round(imageWidth * 0.3);
    const watermarkHeight = Math.round((logo.height / logo.width) * watermarkWidth);

    logo.resize({ w: watermarkWidth, h: watermarkHeight });

    // 로고 색상 반전 (어두운 색 → 밝은 색) + 투명도 적용
    logo.invert();
    logo.opacity(0.6);

    // 중앙 배치
    const x = Math.round((imageWidth - watermarkWidth) / 2);
    const y = Math.round((imageHeight - watermarkHeight) / 2);

    // 합성
    image.composite(logo, x, y);

    // JPEG로 변환
    const resultBuffer = await image.getBuffer('image/jpeg');
    return Buffer.from(resultBuffer);
  } catch (error) {
    console.error('Watermark processing error:', error);
    return imageBuffer;
  }
}

export async function POST(request: NextRequest) {
  try {
    // 인증 확인
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: '권한이 없습니다' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const watermark = formData.get('watermark') as string || 'none';

    if (!file) {
      return NextResponse.json({ error: '파일이 없습니다' }, { status: 400 });
    }

    // 파일 타입 검증
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: '허용되지 않는 파일 형식입니다. (JPG, PNG, WebP, GIF만 가능)' },
        { status: 400 }
      );
    }

    // 파일 크기 검증 (10MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: '파일 크기가 너무 큽니다. (최대 10MB)' },
        { status: 400 }
      );
    }

    // 파일을 Buffer로 변환
    const arrayBuffer = await file.arrayBuffer();
    let imageBuffer: Buffer = Buffer.from(arrayBuffer);

    // 워터마크 추가
    if (watermark && watermark !== 'none') {
      try {
        // 요청 URL에서 base URL 추출
        const url = new URL(request.url);
        const baseUrl = `${url.protocol}//${url.host}`;
        const result = await addWatermark(imageBuffer, watermark, baseUrl);
        imageBuffer = Buffer.from(result);
      } catch (wmError) {
        console.error('Watermark error:', wmError);
        // 워터마크 실패해도 원본 업로드 진행
      }
    }

    // Vercel Blob에 업로드
    const fileName = file.name.replace(/\.[^/.]+$/, '') + '.jpg';
    const blob = await put(`portfolio/${Date.now()}-${fileName}`, imageBuffer, {
      access: 'public',
      contentType: 'image/jpeg',
    });

    return NextResponse.json({
      success: true,
      url: blob.url,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: '업로드 중 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}
