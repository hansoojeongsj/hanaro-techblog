import { prisma } from '@/lib/prisma';
import type { CategoryWithCount, GrassData, PostCardData } from './blog.type';

export const getHomeData = async (): Promise<{
  categories: CategoryWithCount[];
  recentPosts: PostCardData[];
  formattedGrassData: GrassData[];
}> => {
  const [categories, recentPosts, allPostsDates] = await Promise.all([
    prisma.category.findMany({
      include: {
        _count: {
          select: {
            posts: {
              where: { isDeleted: false, writer: { isDeleted: false } },
            },
          },
        },
      },
      orderBy: { name: 'asc' },
    }),
    prisma.post.findMany({
      take: 4,
      where: { isDeleted: false, writer: { isDeleted: false } },
      orderBy: { createdAt: 'desc' },
      include: {
        category: {
          select: { id: true, name: true, slug: true },
        },
        writer: {
          select: { id: true, name: true, image: true, isDeleted: true },
        },
        _count: { select: { comments: true, postLikes: true } },
      },
    }),
    prisma.post.findMany({ select: { createdAt: true, updatedAt: true } }),
  ]);

  const grassStatsMap = new Map<string, { created: number; updated: number }>();
  const getKSTDate = (date: Date) => {
    const kstOffset = 9 * 60 * 60 * 1000;
    return new Date(date.getTime() + kstOffset).toISOString().split('T')[0];
  };

  allPostsDates.forEach((post) => {
    const createDate = getKSTDate(post.createdAt);
    const updateDate = getKSTDate(post.updatedAt);

    const cData = grassStatsMap.get(createDate) || { created: 0, updated: 0 };
    cData.created += 1;
    grassStatsMap.set(createDate, cData);

    if (createDate !== updateDate) {
      const uData = grassStatsMap.get(updateDate) || { created: 0, updated: 0 };
      uData.updated += 1;
      grassStatsMap.set(updateDate, uData);
    }
  });

  const formattedGrassData: GrassData[] = Array.from(
    grassStatsMap.entries(),
  ).map(([date, stats]) => ({
    date,
    count: stats.created + stats.updated,
    createdCount: stats.created,
    updatedCount: stats.updated,
    level: Math.min(Math.ceil((stats.created + stats.updated) / 2), 4),
  }));

  return {
    categories: categories as CategoryWithCount[],
    recentPosts: recentPosts as unknown as PostCardData[],
    formattedGrassData,
  };
};
