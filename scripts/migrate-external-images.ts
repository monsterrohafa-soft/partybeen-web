/**
 * 외부 뉴스 이미지를 R2로 이전하는 스크립트
 *
 * 실행: npx tsx scripts/migrate-external-images.ts
 */
import { PrismaClient } from '@prisma/client';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import sharp from 'sharp';

const prisma = new PrismaClient();

const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID!;
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID!;
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY!;
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME!;
const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL!;

const r2Client = new S3Client({
  region: 'auto',
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
});

async function downloadImage(url: string): Promise<Buffer | null> {
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        'Accept': 'image/webp,image/apng,image/*,*/*',
      },
    });
    if (!res.ok) {
      console.error(`  ❌ HTTP ${res.status} for ${url}`);
      return null;
    }
    return Buffer.from(await res.arrayBuffer());
  } catch (err) {
    console.error(`  ❌ Download failed: ${url}`, err);
    return null;
  }
}

async function uploadToR2(buffer: Buffer, key: string): Promise<string> {
  const compressed = await sharp(buffer)
    .resize({ width: 4096, height: 16383, fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 90 })
    .toBuffer();

  await r2Client.send(
    new PutObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: key,
      Body: compressed,
      ContentType: 'image/webp',
      CacheControl: 'public, max-age=31536000, immutable',
    }),
  );

  return `${R2_PUBLIC_URL}/${key}`;
}

async function main() {
  // R2 URL이 아니고, 로컬 경로가 아닌 외부 URL을 가진 포트폴리오 찾기
  const portfolios = await prisma.portfolio.findMany({
    where: {
      imageUrl: {
        startsWith: 'http',
        not: { contains: 'r2.dev' },
      },
    },
    select: { id: true, title: true, imageUrl: true },
  });

  console.log(`\n🔍 외부 이미지 ${portfolios.length}개 발견\n`);

  let success = 0;
  let failed = 0;

  for (const p of portfolios) {
    console.log(`📷 ${p.title}`);
    console.log(`   원본: ${p.imageUrl}`);

    const buffer = await downloadImage(p.imageUrl);
    if (!buffer) {
      failed++;
      continue;
    }

    const timestamp = Date.now();
    const key = `images/portfolio/${timestamp}-migrated.webp`;
    const newUrl = await uploadToR2(buffer, key);

    await prisma.portfolio.update({
      where: { id: p.id },
      data: { imageUrl: newUrl },
    });

    console.log(`   ✅ → ${newUrl}`);
    success++;

    // Rate limiting
    await new Promise((r) => setTimeout(r, 500));
  }

  console.log(`\n📊 결과: 성공 ${success}, 실패 ${failed}`);
  await prisma.$disconnect();
}

main().catch(console.error);
