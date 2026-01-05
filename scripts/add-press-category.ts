// 언론보도 카테고리 추가 스크립트
// 실행: npx ts-node scripts/add-press-category.ts

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('언론보도 카테고리 추가 중...');

  const category = await prisma.category.upsert({
    where: { slug: 'press' },
    update: {},
    create: {
      name: '언론보도',
      slug: 'press',
      description: '파티빈 관련 언론보도 및 기사',
    },
  });

  console.log('✅ 언론보도 카테고리 추가 완료:', category);
}

main()
  .catch((e) => {
    console.error('❌ 오류:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
