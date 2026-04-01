import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import sharp from 'sharp';

function getEnvVar(name: string): string {
  const value = process.env[name]?.trim();
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

/** 이미지를 WebP q90으로 압축 (시각적 무손실, 초대형 이미지 자동 리사이즈) */
export async function compressImage(buffer: Buffer): Promise<Buffer> {
  return sharp(buffer)
    .resize({ width: 4096, height: 16383, fit: 'inside', withoutEnlargement: true })
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
      CacheControl: 'public, max-age=31536000, immutable',
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

/** 파일명을 URL-safe하게 변환 (공백, 괄호, 한글 등 제거) */
function sanitizeFilename(name: string): string {
  return name
    .replace(/[^a-zA-Z0-9._-]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '');
}

/** 이미지 파일을 압축하여 R2에 업로드 */
export async function uploadImageToR2(
  buffer: Buffer,
  filename: string,
  folder: string = 'portfolio',
): Promise<string> {
  const timestamp = Date.now();
  const baseName = sanitizeFilename(filename.replace(/\.[^.]+$/, ''));

  const compressed = await compressImage(buffer);
  const key = `images/${folder}/${timestamp}-${baseName}.webp`;
  return uploadToR2(compressed, key, 'image/webp');
}

/** Presigned URL 발급 (클라이언트 직접 업로드용) */
export async function getPresignedUploadUrl(
  key: string,
): Promise<{ uploadUrl: string; publicUrl: string }> {
  const accountId = getEnvVar('R2_ACCOUNT_ID');
  const bucket = getEnvVar('R2_BUCKET_NAME');

  // virtual-hosted style: bucket.accountid.r2.cloudflarestorage.com/key
  const presignClient = new S3Client({
    region: 'auto',
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    forcePathStyle: false,
    credentials: {
      accessKeyId: getEnvVar('R2_ACCESS_KEY_ID'),
      secretAccessKey: getEnvVar('R2_SECRET_ACCESS_KEY'),
    },
  });

  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const uploadUrl = await getSignedUrl(presignClient as any, command, { expiresIn: 600 });
  const publicUrl = getR2PublicUrl(key);

  return { uploadUrl, publicUrl };
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
