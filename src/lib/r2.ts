import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import sharp from 'sharp';

function getEnvVar(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`환경 변수 ${name}이 설정되지 않았습니다`);
  return value;
}

function getR2Client() {
  const accountId = getEnvVar('R2_ACCOUNT_ID');
  return new S3Client({
    region: 'auto',
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: getEnvVar('R2_ACCESS_KEY_ID'),
      secretAccessKey: getEnvVar('R2_SECRET_ACCESS_KEY'),
    },
  });
}

/** 이미지를 WebP q90으로 압축 (시각적 무손실) */
export async function compressImage(buffer: Buffer): Promise<Buffer> {
  return sharp(buffer)
    .webp({ quality: 90 })
    .toBuffer();
}

/** R2에 파일 업로드 */
export async function uploadToR2(
  buffer: Buffer,
  key: string,
  contentType: string,
): Promise<string> {
  const client = getR2Client();
  const bucket = getEnvVar('R2_BUCKET_NAME');

  await client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: buffer,
      ContentType: contentType,
    }),
  );
  return getR2PublicUrl(key);
}

/** R2에서 파일 삭제 */
export async function deleteFromR2(key: string): Promise<void> {
  const client = getR2Client();
  const bucket = getEnvVar('R2_BUCKET_NAME');

  await client.send(
    new DeleteObjectCommand({
      Bucket: bucket,
      Key: key,
    }),
  );
}

/** R2 퍼블릭 URL 생성 */
export function getR2PublicUrl(key: string): string {
  const publicUrl = process.env.R2_PUBLIC_URL;
  if (!publicUrl) throw new Error('R2_PUBLIC_URL 환경 변수가 설정되지 않았습니다');
  return `${publicUrl}/${key}`;
}

/** R2 URL에서 key 추출 */
export function getR2KeyFromUrl(url: string): string | null {
  const publicUrl = process.env.R2_PUBLIC_URL;
  if (!publicUrl || !url.startsWith(publicUrl)) return null;
  return url.replace(`${publicUrl}/`, '');
}

/** 이미지 파일을 압축하여 R2에 업로드 (원본도 백업) */
export async function uploadImageToR2(
  buffer: Buffer,
  filename: string,
  folder: string = 'portfolio',
): Promise<string> {
  const timestamp = Date.now();
  const baseName = filename.replace(/\.[^.]+$/, '');
  const originalExt = filename.split('.').pop()?.toLowerCase() || 'jpg';

  // 원본 백업
  const originalKey = `originals/${folder}/${timestamp}-${baseName}.${originalExt}`;
  await uploadToR2(buffer, originalKey, `image/${originalExt === 'jpg' ? 'jpeg' : originalExt}`);

  // WebP q90 압축 후 업로드
  const compressed = await compressImage(buffer);
  const compressedKey = `images/${folder}/${timestamp}-${baseName}.webp`;
  const url = await uploadToR2(compressed, compressedKey, 'image/webp');

  return url;
}

/** PDF 파일을 R2에 업로드 (압축 없이) */
export async function uploadPdfToR2(
  buffer: Buffer,
  filename: string,
): Promise<string> {
  const timestamp = Date.now();
  const key = `pdfs/${timestamp}-${filename}`;
  return uploadToR2(buffer, key, 'application/pdf');
}
