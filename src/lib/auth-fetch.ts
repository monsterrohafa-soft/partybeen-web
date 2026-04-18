import { signOut } from 'next-auth/react';

/** 인증이 필요한 API fetch — 401 시 자동 로그아웃 + 로그인 리다이렉트 */
export async function authFetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  const res = await fetch(input, init);

  if (res.status === 401) {
    alert('로그인이 만료되었습니다. 다시 로그인해주세요.');
    await signOut({ callbackUrl: '/admin/login' });
    throw new Error('세션 만료');
  }

  return res;
}
