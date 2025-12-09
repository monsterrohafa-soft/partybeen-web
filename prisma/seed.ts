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
  const adminEmail = process.env.ADMIN_EMAIL || 'admin';
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin';
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

  // 3. 기존 포트폴리오 데이터 마이그레이션
  const portfolioData = [
    // CATERING
    { title: '민락행정복지센터', categorySlug: 'catering', imageUrl: '/images/portfolio/812518548_1.jpg', description: '민락행정복지센터 케이터링' },
    { title: '양산', categorySlug: 'catering', imageUrl: '/images/portfolio/846869710_1.jpg', description: '양산 케이터링' },
    { title: '지안인터내셔널', categorySlug: 'catering', imageUrl: '/images/portfolio/811924488_1.jpg', description: '지안인터내셔널 케이터링' },
    { title: '수산포럼', categorySlug: 'catering', imageUrl: '/images/portfolio/484800921_1.jpg', description: '수산포럼 케이터링' },
    { title: '도모헌', categorySlug: 'catering', imageUrl: '/images/portfolio/982002390_1.jpg', description: '도모헌 케이터링' },
    { title: '일본영사관', categorySlug: 'catering', imageUrl: '/images/portfolio/94329889_1.jpg', description: '일본영사관 케이터링' },
    // FOOD BOX
    { title: '시슬리', categorySlug: 'food-box', imageUrl: '/images/portfolio/1982018076_1.jpg', description: '시슬리 푸드박스' },
    { title: '마세라티', categorySlug: 'food-box', imageUrl: '/images/portfolio/1878678299_1.jpg', description: '마세라티 푸드박스' },
    { title: '김해', categorySlug: 'food-box', imageUrl: '/images/portfolio/233458333_1.jpg', description: '김해 푸드박스' },
    { title: '리컨벤션', categorySlug: 'food-box', imageUrl: '/images/portfolio/215751460_1.jpg', description: '리컨벤션 푸드박스' },
    // LUNCH BOX
    { title: '고신대학교', categorySlug: 'lunch-box', imageUrl: '/images/portfolio/1150916187_1.jpg', description: '고신대학교 도시락' },
    { title: '치과교정학회', categorySlug: 'lunch-box', imageUrl: '/images/portfolio/1971419380_1.jpg', description: '치과교정학회 도시락' },
    { title: '도모헌', categorySlug: 'lunch-box', imageUrl: '/images/portfolio/1920721804_1.jpg', description: '도모헌 도시락' },
    { title: '신라스테이', categorySlug: 'lunch-box', imageUrl: '/images/portfolio/1018930997_1.jpg', description: '신라스테이 도시락' },
    // BOX CATERING
    { title: '센탑', categorySlug: 'box-catering', imageUrl: '/images/portfolio/2005674040_1.jpg', description: '센탑 박스케이터링' },
    { title: '부산 국제저축은행', categorySlug: 'box-catering', imageUrl: '/images/portfolio/1626746175_1.jpg', description: '부산 국제저축은행 박스케이터링' },
    { title: '고신대', categorySlug: 'box-catering', imageUrl: '/images/portfolio/1135681125_1.jpg', description: '고신대 박스케이터링' },
    { title: '시네포엠', categorySlug: 'box-catering', imageUrl: '/images/portfolio/31945901_1.jpg', description: '시네포엠 박스케이터링' },
  ];

  // 카테고리별로 포트폴리오 생성
  for (let i = 0; i < portfolioData.length; i++) {
    const item = portfolioData[i];
    const category = await prisma.category.findUnique({
      where: { slug: item.categorySlug },
    });

    if (category) {
      // 중복 체크 (같은 제목 + 카테고리)
      const existing = await prisma.portfolio.findFirst({
        where: {
          title: item.title,
          categoryId: category.id,
        },
      });

      if (!existing) {
        await prisma.portfolio.create({
          data: {
            title: item.title,
            description: item.description,
            imageUrl: item.imageUrl,
            categoryId: category.id,
            orderIndex: i + 1,
            isVisible: true,
          },
        });
      }
    }
  }
  console.log('✅ Portfolio items migrated');

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
