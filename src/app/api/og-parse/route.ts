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

    // 모든 이미지 수집 (OG, Twitter, 본문 이미지)
    const images: string[] = [];

    // OG 이미지들
    $('meta[property="og:image"]').each((_, el) => {
      const content = $(el).attr('content');
      if (content) images.push(content);
    });
    $('meta[name="og:image"]').each((_, el) => {
      const content = $(el).attr('content');
      if (content && !images.includes(content)) images.push(content);
    });

    // Twitter 이미지
    const twitterImage = $('meta[name="twitter:image"]').attr('content');
    if (twitterImage && !images.includes(twitterImage)) images.push(twitterImage);

    // 본문의 주요 이미지들 (최대 5개 추가)
    $('article img, .article img, .content img, .post img, #article img').each((_, el) => {
      const src = $(el).attr('src');
      if (src && !images.includes(src) && images.length < 10) {
        images.push(src);
      }
    });

    const image = images[0] || '';

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

    // 이미지 URL들을 절대 경로로 변환
    const baseUrl = new URL(url);
    const absoluteImages = images.map((img) => {
      if (img && !img.startsWith('http')) {
        return new URL(img, baseUrl.origin).href;
      }
      return img;
    }).filter(Boolean);

    return NextResponse.json({
      title: title.trim(),
      image: absoluteImages[0] || '',
      images: absoluteImages, // 모든 이미지 배열
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
