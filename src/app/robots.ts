import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // 기본: 전체 허용 (admin/api만 차단)
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/'],
      },
      // AI 크롤러 명시 허용 (AI 검색/추천 노출이 사업 목표)
      {
        userAgent: [
          'GPTBot',
          'ClaudeBot',
          'Claude-Web',
          'anthropic-ai',
          'PerplexityBot',
          'Google-Extended',
          'Applebot-Extended',
          'CCBot',
        ],
        allow: '/',
        disallow: ['/admin/', '/api/'],
      },
      // 공격적 스크래퍼 차단
      {
        userAgent: 'Bytespider',
        disallow: '/',
      },
    ],
    sitemap: 'https://www.partybeen.com/sitemap.xml',
  };
}
