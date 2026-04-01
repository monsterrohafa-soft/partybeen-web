interface Env {
  R2: R2Bucket;
  UPLOAD_SECRET: string;
}

const ALLOWED_ORIGINS = [
  'https://partybeen.com',
  'https://www.partybeen.com',
  'http://localhost:3000',
];

function corsHeaders(origin: string): HeadersInit {
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'PUT, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-Upload-Token',
    'Access-Control-Max-Age': '86400',
  };
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const origin = request.headers.get('Origin') || '';
    const isAllowed = ALLOWED_ORIGINS.includes(origin);
    const headers = isAllowed ? corsHeaders(origin) : {};

    // CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers });
    }

    // PUT만 허용
    if (request.method !== 'PUT') {
      return new Response('Method not allowed', { status: 405, headers });
    }

    // 인증 토큰 확인
    const token = request.headers.get('X-Upload-Token');
    if (!token || token !== env.UPLOAD_SECRET) {
      return new Response('Unauthorized', { status: 401, headers });
    }

    // URL에서 key 추출: /upload/{key}
    const url = new URL(request.url);
    const key = url.pathname.replace(/^\/upload\//, '');
    if (!key) {
      return new Response('Missing key', { status: 400, headers });
    }

    // R2에 직접 업로드 (원본 그대로, 압축 없음)
    const contentType = request.headers.get('Content-Type') || 'application/octet-stream';
    await env.R2.put(key, request.body, {
      httpMetadata: {
        contentType,
        cacheControl: 'public, max-age=31536000, immutable',
      },
    });

    return new Response(JSON.stringify({ success: true, key }), {
      status: 200,
      headers: { ...headers, 'Content-Type': 'application/json' },
    });
  },
};
