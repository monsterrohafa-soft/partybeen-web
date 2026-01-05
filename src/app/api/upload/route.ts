import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { put } from '@vercel/blob';
import { authOptions } from '@/auth';
import sharp from 'sharp';

// 워터마크 로고 URL (public 폴더 기준)
const WATERMARK_LOGOS: Record<string, string> = {
  partybeen: '/logo/partybeen.png',
  chef: '/logo/chef.png',
};

// 로고를 흰색으로 변환하고 반투명 처리
async function prepareWatermark(logoUrl: string, baseUrl: string, targetWidth: number): Promise<Buffer> {
  // fetch로 로고 파일 가져오기
  const fullUrl = `${baseUrl}${logoUrl}`;
  const response = await fetch(fullUrl);
  if (!response.ok) {
    throw new Error(`Failed to fetch logo: ${fullUrl}`);
  }
  const logoBuffer = Buffer.from(await response.arrayBuffer());

  // 로고 메타데이터 가져오기
  const logoMeta = await sharp(logoBuffer).metadata();
  const logoWidth = logoMeta.width || 400;

  // 타겟 이미지의 30% 크기로 조절
  const watermarkWidth = Math.round(targetWidth * 0.3);
  const scale = watermarkWidth / logoWidth;
  const watermarkHeight = Math.round((logoMeta.height || 200) * scale);

  // 로고를 흰색으로 변환 + 리사이즈
  const resizedLogo = await sharp(logoBuffer)
    .resize(watermarkWidth, watermarkHeight, { fit: 'inside' })
    .toBuffer();

  // 로고의 알파 채널만 추출하여 흰색으로 변환
  const { data, info } = await sharp(resizedLogo)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  // RGBA 데이터를 흰색으로 변환 (알파는 유지하되 60% 투명도)
  const whiteData = Buffer.alloc(data.length);
  for (let i = 0; i < data.length; i += 4) {
    const alpha = data[i + 3];
    whiteData[i] = 255;     // R - 흰색
    whiteData[i + 1] = 255; // G - 흰색
    whiteData[i + 2] = 255; // B - 흰색
    whiteData[i + 3] = Math.round(alpha * 0.6); // A - 60% 투명도
  }

  return sharp(whiteData, {
    raw: {
      width: info.width,
      height: info.height,
      channels: 4,
    },
  })
    .png()
    .toBuffer();
}

// 이미지에 워터마크 합성
async function addWatermark(
  imageBuffer: Buffer,
  watermarkType: string,
  baseUrl: string
): Promise<Buffer> {
  if (!watermarkType || watermarkType === 'none' || !WATERMARK_LOGOS[watermarkType]) {
    return imageBuffer;
  }

  // 원본 이미지 메타데이터
  const imageMeta = await sharp(imageBuffer).metadata();
  const imageWidth = imageMeta.width || 1200;
  const imageHeight = imageMeta.height || 800;

  // 워터마크 준비 (흰색 변환 + 크기 조절)
  const watermarkBuffer = await prepareWatermark(
    WATERMARK_LOGOS[watermarkType],
    baseUrl,
    imageWidth
  );

  // 워터마크 메타데이터
  const watermarkMeta = await sharp(watermarkBuffer).metadata();
  const wmWidth = watermarkMeta.width || 200;
  const wmHeight = watermarkMeta.height || 100;

  // 중앙 배치
  const left = Math.round((imageWidth - wmWidth) / 2);
  const top = Math.round((imageHeight - wmHeight) / 2);

  // 합성
  return sharp(imageBuffer)
    .composite([
      {
        input: watermarkBuffer,
        left,
        top,
        blend: 'over',
      },
    ])
    .jpeg({ quality: 90 })
    .toBuffer();
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
    let imageBuffer = Buffer.from(arrayBuffer);

    // 워터마크 추가
    if (watermark && watermark !== 'none') {
      try {
        // 요청 URL에서 base URL 추출
        const url = new URL(request.url);
        const baseUrl = `${url.protocol}//${url.host}`;
        imageBuffer = await addWatermark(imageBuffer, watermark, baseUrl);
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
