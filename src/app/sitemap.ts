import type { MetadataRoute } from 'next';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

const BASE_URL = 'https://www.partybeen.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/`, changeFrequency: 'weekly', priority: 1 },
    { url: `${BASE_URL}/portfolio`, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/menu`, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/notice`, changeFrequency: 'weekly', priority: 0.6 },
    { url: `${BASE_URL}/about`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/contact`, changeFrequency: 'monthly', priority: 0.7 },
  ];

  try {
    const [menus, notices] = await Promise.all([
      prisma.menu.findMany({
        where: { isVisible: true },
        select: { id: true, updatedAt: true },
      }),
      prisma.notice.findMany({
        where: { isVisible: true },
        select: { id: true, updatedAt: true },
      }),
    ]);

    const dynamicRoutes: MetadataRoute.Sitemap = [
      ...menus.map((m) => ({
        url: `${BASE_URL}/menu/${m.id}`,
        lastModified: m.updatedAt,
        priority: 0.8,
      })),
      ...notices.map((n) => ({
        url: `${BASE_URL}/notice/${n.id}`,
        lastModified: n.updatedAt,
        priority: 0.5,
      })),
    ];

    return [...staticRoutes, ...dynamicRoutes];
  } catch (error) {
    console.error('Failed to build dynamic sitemap entries:', error);
    return staticRoutes;
  }
}
