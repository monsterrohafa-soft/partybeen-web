import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // 1. 카테고리 생성
  const categories = [
    { name: 'CATERING', slug: 'catering', description: '기업행사, 웨딩, 프라이빗 파티를 위한 프리미엄 출장 케이터링' },
    { name: 'FOOD BOX', slug: 'food-box', description: '다양한 메뉴를 한 박스에 담은 스페셜 푸드 박스' },
    { name: 'LUNCH BOX', slug: 'lunch-box', description: '정성을 담은 프리미엄 도시락 서비스' },
    { name: 'BOX CATERING', slug: 'box-catering', description: '소규모 행사에 적합한 박스형 케이터링' },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
  }
  console.log('✅ Categories created');

  // 2. 관리자 계정 생성
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@partybeen.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'partybeen2024!';
  const hashedPassword = await bcrypt.hash(adminPassword, 12);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      name: 'Admin',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });
  console.log(`✅ Admin user created: ${adminEmail}`);

  console.log('🎉 Seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
