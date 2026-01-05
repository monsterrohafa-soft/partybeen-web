import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import * as cheerio from 'cheerio';

// POST: URL에서 OG 메타데이터 파싱
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: '권한이 없습니다' }, { status: 401 });
    }

    const body = await request.json();
    const { url } = body;

    if (!url) {
      return NextResponse.json({ error: 'URL을 입력해주세요' }, { status: 400 });
    }

    // URL 유효성 검사
    try {
      new URL(url);
    } catch {
      return NextResponse.json({ error: '유효하지 않은 URL입니다' }, { status: 400 });
    }

    // HTML 가져오기 (실제 브라우저처럼 보이게)
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7',
        'Accept-Encoding': 'gzip, deflate, br',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: '페이지를 불러올 수 없습니다' },
        { status: 400 }
      );
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    // OG 메타데이터 추출 (property 또는 name 속성 모두 지원)
    const title =
      $('meta[property="og:title"]').attr('content') ||
      $('meta[name="og:title"]').attr('content') ||
      $('meta[name="twitter:title"]').attr('content') ||
      $('meta[name="title"]').attr('content') ||
      $('title').text() ||
      '';

    const image =
      $('meta[property="og:image"]').attr('content') ||
      $('meta[name="og:image"]').attr('content') ||
      $('meta[name="twitter:image"]').attr('content') ||
      '';

    const siteName =
      $('meta[property="og:site_name"]').attr('content') ||
      $('meta[name="og:site_name"]').attr('content') ||
      new URL(url).hostname.replace('www.', '') ||
      '';

    const description =
      $('meta[property="og:description"]').attr('content') ||
      $('meta[name="og:description"]').attr('content') ||
      $('meta[name="description"]').attr('content') ||
      '';

    // 이미지 URL이 상대 경로인 경우 절대 경로로 변환
    let absoluteImage = image;
    if (image && !image.startsWith('http')) {
      const baseUrl = new URL(url);
      absoluteImage = new URL(image, baseUrl.origin).href;
    }

    return NextResponse.json({
      title: title.trim(),
      image: absoluteImage,
      siteName: siteName.trim(),
      description: description.trim(),
    });
  } catch (error) {
    console.error('OG parse error:', error);
    return NextResponse.json(
      { error: 'OG 메타데이터 파싱에 실패했습니다' },
      { status: 500 }
    );
  }
}
