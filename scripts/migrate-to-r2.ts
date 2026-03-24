/**
 * Vercel Blob → Cloudflare R2 마이그레이션 스크립트
 *
 * 사용법:
 *   npx tsx scripts/migrate-to-r2.ts
 *
 * 환경변수 필요:
 *   DATABASE_URL, R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET_NAME, R2_PUBLIC_URL
 */

import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { PrismaClient } from '@prisma/client';
import sharp from 'sharp';

const prisma = new PrismaClient();

const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID!;
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID!;
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY!;
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME!;
const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL!;

const r2 = new S3Client({
  region: 'auto',
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
});

interface MigrationResult {
  model: string;
  id: string;
  field: string;
  oldUrl: string;
  newUrl: string;
  originalSize: number;
  compressedSize: number;
  status: 'success' | 'failed';
  error?: string;
}

const results: MigrationResult[] = [];

async function uploadToR2(buffer: Buffer, key: string, contentType: string): Promise<string> {
  await r2.send(
    new PutObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: key,
      Body: buffer,
      ContentType: contentType,
    }),
  );
  return `${R2_PUBLIC_URL}/${key}`;
}

async function migrateImage(
  url: string,
  folder: string,
  id: string,
): Promise<{ newUrl: string; originalSize: number; compressedSize: number }> {
  // 다운로드
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Download failed: ${response.status}`);

  const buffer = Buffer.from(await response.arrayBuffer());
  const originalSize = buffer.length;

  // 파일명 추출
  const urlPath = new URL(url).pathname;
  const filename = urlPath.split('/').pop() || `${id}.jpg`;
  const baseName = filename.replace(/\.[^.]+$/, '');
  const ext = filename.split('.').pop()?.toLowerCase() || 'jpg';
  const timestamp = Date.now();

  // 원본 백업
  const originalKey = `originals/${folder}/${timestamp}-${baseName}.${ext}`;
  await uploadToR2(buffer, originalKey, `image/${ext === 'jpg' ? 'jpeg' : ext}`);

  // WebP q90 압축
  const compressed = await sharp(buffer).webp({ quality: 90 }).toBuffer();
  const compressedSize = compressed.length;

  // 압축본 업로드
  const compressedKey = `images/${folder}/${timestamp}-${baseName}.webp`;
  const newUrl = await uploadToR2(compressed, compressedKey, 'image/webp');

  return { newUrl, originalSize, compressedSize };
}

async function migratePdf(
  url: string,
  id: string,
): Promise<{ newUrl: string; originalSize: number }> {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Download failed: ${response.status}`);

  const buffer = Buffer.from(await response.arrayBuffer());
  const originalSize = buffer.length;

  const urlPath = new URL(url).pathname;
  const filename = urlPath.split('/').pop() || `${id}.pdf`;
  const timestamp = Date.now();

  const key = `pdfs/${timestamp}-${filename}`;
  const newUrl = await uploadToR2(buffer, key, 'application/pdf');

  return { newUrl, originalSize };
}

function isBlobUrl(url: string | null | undefined): boolean {
  return !!url && url.includes('blob.vercel-storage.com');
}

async function migratePortfolios() {
  console.log('\n📸 포트폴리오 이미지 마이그레이션...');
  const portfolios = await prisma.portfolio.findMany();

  for (const item of portfolios) {
    if (!isBlobUrl(item.imageUrl)) {
      console.log(`  ⏭ ${item.title} — Blob URL 아님, 스킵`);
      continue;
    }

    try {
      console.log(`  ⬆ ${item.title} — 이미지 이전 중...`);
      const { newUrl, originalSize, compressedSize } = await migrateImage(
        item.imageUrl,
        'portfolio',
        item.id,
      );

      await prisma.portfolio.update({
        where: { id: item.id },
        data: { imageUrl: newUrl },
      });

      const savings = ((1 - compressedSize / originalSize) * 100).toFixed(1);
      console.log(
        `  ✅ ${item.title} — ${formatSize(originalSize)} → ${formatSize(compressedSize)} (${savings}% 절감)`,
      );

      results.push({
        model: 'Portfolio',
        id: item.id,
        field: 'imageUrl',
        oldUrl: item.imageUrl,
        newUrl,
        originalSize,
        compressedSize,
        status: 'success',
      });
    } catch (error) {
      console.error(`  ❌ ${item.title} — 실패:`, error);
      results.push({
        model: 'Portfolio',
        id: item.id,
        field: 'imageUrl',
        oldUrl: item.imageUrl,
        newUrl: '',
        originalSize: 0,
        compressedSize: 0,
        status: 'failed',
        error: String(error),
      });
    }
  }
}

async function migrateMenus() {
  console.log('\n🍽 메뉴 이미지 마이그레이션...');
  const menus = await prisma.menu.findMany();

  for (const item of menus) {
    // 썸네일
    if (isBlobUrl(item.imageUrl)) {
      try {
        console.log(`  ⬆ ${item.name} (썸네일) — 이전 중...`);
        const { newUrl, originalSize, compressedSize } = await migrateImage(
          item.imageUrl,
          'menu',
          item.id,
        );

        await prisma.menu.update({
          where: { id: item.id },
          data: { imageUrl: newUrl },
        });

        const savings = ((1 - compressedSize / originalSize) * 100).toFixed(1);
        console.log(
          `  ✅ ${item.name} (썸네일) — ${formatSize(originalSize)} → ${formatSize(compressedSize)} (${savings}% 절감)`,
        );

        results.push({
          model: 'Menu',
          id: item.id,
          field: 'imageUrl',
          oldUrl: item.imageUrl,
          newUrl,
          originalSize,
          compressedSize,
          status: 'success',
        });
      } catch (error) {
        console.error(`  ❌ ${item.name} (썸네일) — 실패:`, error);
        results.push({
          model: 'Menu',
          id: item.id,
          field: 'imageUrl',
          oldUrl: item.imageUrl,
          newUrl: '',
          originalSize: 0,
          compressedSize: 0,
          status: 'failed',
          error: String(error),
        });
      }
    }

    // 상세 이미지
    if (isBlobUrl(item.detailImageUrl)) {
      try {
        console.log(`  ⬆ ${item.name} (상세) — 이전 중...`);
        const { newUrl, originalSize, compressedSize } = await migrateImage(
          item.detailImageUrl!,
          'menu',
          `${item.id}-detail`,
        );

        await prisma.menu.update({
          where: { id: item.id },
          data: { detailImageUrl: newUrl },
        });

        const savings = ((1 - compressedSize / originalSize) * 100).toFixed(1);
        console.log(
          `  ✅ ${item.name} (상세) — ${formatSize(originalSize)} → ${formatSize(compressedSize)} (${savings}% 절감)`,
        );

        results.push({
          model: 'Menu',
          id: item.id,
          field: 'detailImageUrl',
          oldUrl: item.detailImageUrl!,
          newUrl,
          originalSize,
          compressedSize,
          status: 'success',
        });
      } catch (error) {
        console.error(`  ❌ ${item.name} (상세) — 실패:`, error);
        results.push({
          model: 'Menu',
          id: item.id,
          field: 'detailImageUrl',
          oldUrl: item.detailImageUrl!,
          newUrl: '',
          originalSize: 0,
          compressedSize: 0,
          status: 'failed',
          error: String(error),
        });
      }
    }
  }
}

async function migrateProposals() {
  console.log('\n📄 제안서 PDF 마이그레이션...');

  // Proposal 모델이 없을 수 있음 (chefbox)
  try {
    const proposals = await (prisma as any).proposal.findMany();

    for (const item of proposals) {
      if (!isBlobUrl(item.fileUrl)) {
        console.log(`  ⏭ ${item.title} — Blob URL 아님, 스킵`);
        continue;
      }

      try {
        console.log(`  ⬆ ${item.title} — PDF 이전 중...`);
        const { newUrl, originalSize } = await migratePdf(item.fileUrl, item.id);

        await (prisma as any).proposal.update({
          where: { id: item.id },
          data: { fileUrl: newUrl },
        });

        console.log(`  ✅ ${item.title} — ${formatSize(originalSize)} (PDF, 압축 없이)`);

        results.push({
          model: 'Proposal',
          id: item.id,
          field: 'fileUrl',
          oldUrl: item.fileUrl,
          newUrl,
          originalSize,
          compressedSize: originalSize,
          status: 'success',
        });
      } catch (error) {
        console.error(`  ❌ ${item.title} — 실패:`, error);
        results.push({
          model: 'Proposal',
          id: item.id,
          field: 'fileUrl',
          oldUrl: item.fileUrl,
          newUrl: '',
          originalSize: 0,
          compressedSize: 0,
          status: 'failed',
          error: String(error),
        });
      }
    }
  } catch {
    console.log('  ⏭ Proposal 모델 없음, 스킵');
  }
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes}B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
}

function printReport() {
  console.log('\n' + '='.repeat(60));
  console.log('📊 마이그레이션 리포트');
  console.log('='.repeat(60));

  const success = results.filter((r) => r.status === 'success');
  const failed = results.filter((r) => r.status === 'failed');

  const totalOriginal = success.reduce((sum, r) => sum + r.originalSize, 0);
  const totalCompressed = success.reduce((sum, r) => sum + r.compressedSize, 0);
  const totalSavings = totalOriginal > 0 ? ((1 - totalCompressed / totalOriginal) * 100).toFixed(1) : '0';

  console.log(`\n성공: ${success.length}개`);
  console.log(`실패: ${failed.length}개`);
  console.log(`\n총 원본 용량: ${formatSize(totalOriginal)}`);
  console.log(`총 압축 용량: ${formatSize(totalCompressed)}`);
  console.log(`총 절감: ${formatSize(totalOriginal - totalCompressed)} (${totalSavings}%)`);

  if (failed.length > 0) {
    console.log('\n❌ 실패 목록:');
    for (const f of failed) {
      console.log(`  - ${f.model} ${f.id} (${f.field}): ${f.error}`);
    }
  }
}

async function main() {
  console.log('🚀 Vercel Blob → Cloudflare R2 마이그레이션 시작');
  console.log(`   버킷: ${R2_BUCKET_NAME}`);
  console.log(`   퍼블릭 URL: ${R2_PUBLIC_URL}`);

  await migratePortfolios();
  await migrateMenus();
  await migrateProposals();

  printReport();

  await prisma.$disconnect();
}

main().catch((error) => {
  console.error('마이그레이션 실패:', error);
  prisma.$disconnect();
  process.exit(1);
});
