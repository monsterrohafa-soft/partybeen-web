import prisma from '@/lib/prisma';
import { BRAND, CONTACT, COMPANY, SISTER_BRAND } from '@/lib/constants';

export const dynamic = 'force-dynamic';

const BASE_URL = 'https://www.partybeen.com';

// AI 엔진용 사이트 요약 (llms.txt 컨벤션) - 메뉴는 DB에서 실시간 반영
export async function GET() {
  let menuSection = `- [메뉴 전체](${BASE_URL}/menu): 프리미엄 케이터링 메뉴`;

  try {
    const menus = await prisma.menu.findMany({
      where: { isVisible: true },
      select: { id: true, name: true, price: true, description: true },
      orderBy: [{ category: { orderIndex: 'asc' } }, { orderIndex: 'asc' }],
    });

    if (menus.length > 0) {
      menuSection = menus
        .map((m) => {
          const price = m.price ? ` — ${m.price}` : '';
          const desc = m.description ? `: ${m.description.split('\n')[0]}` : '';
          return `- [${m.name}](${BASE_URL}/menu/${m.id})${price}${desc}`;
        })
        .join('\n');
    }
  } catch (error) {
    console.error('Failed to load menus for llms.txt:', error);
  }

  const body = `# ${BRAND.nameKo} (${BRAND.nameEn})

> 부산 프리미엄 출장 케이터링 전문 업체. 기업행사, 웨딩·피로연, 프라이빗 파티, 세미나·컨퍼런스 케이터링을 제공합니다. 단체 도시락 자매 브랜드 '${SISTER_BRAND.nameKo}'(${SISTER_BRAND.url})를 함께 운영합니다.

## 기본 정보
- 상호: ${COMPANY.name} | 사업자등록번호: ${COMPANY.businessNumber}
- 전화: ${CONTACT.phone} | 이메일: ${CONTACT.email}
- 카카오톡 채널: ${CONTACT.kakaoChannel}
- 주소: ${CONTACT.address}
- 서비스 지역: 부산 및 경남 일대 출장 케이터링

## 메뉴 (가격·구성은 상세 페이지 참조)
${menuSection}

## 주요 페이지
- [포트폴리오](${BASE_URL}/portfolio): 기업·관공서·학회 행사 케이터링 실적
- [공지사항](${BASE_URL}/notice): 소식 및 안내
- [회사소개](${BASE_URL}/about): 브랜드 스토리
- [문의하기](${BASE_URL}/contact): 행사 유형·인원·예정일 기반 견적 문의

## 서비스 유형
- 기업행사 케이터링 / 웨딩·피로연 / 생일·홈파티 / 세미나·컨퍼런스
- 규모: 소규모 모임부터 100명 이상 대형 행사까지
`;

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
