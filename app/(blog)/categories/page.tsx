'use cache';

import { cacheLife } from 'next/cache';
import { CategoryCard } from '@/components/blog/CategoryCard';
import { prisma } from '@/lib/prisma';

export default async function CategoriesPage() {
  cacheLife({
    stale: 10,
    revalidate: 3600,
  });

  const categoriesData = await prisma.category.findMany({
    orderBy: { name: 'asc' },
    include: {
      _count: {
        select: { posts: true },
      },
      posts: {
        take: 1,
        orderBy: { createdAt: 'desc' },
        select: { title: true },
      },
    },
  });

  return (
    <div className="container mx-auto px-4 pt-12 pb-16">
      <div className="mb-12 animate-fade-in text-center">
        <h1 className="mb-4 font-bold text-3xl md:text-4xl">카테고리</h1>
        <p className="mx-auto max-w-xl text-muted-foreground">
          관심 있는 기술 분야를 선택해보세요.
        </p>
      </div>

      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {categoriesData.map((data, index) => {
          const latestPostTitle = data.posts[0]?.title;

          return (
            <div
              key={data.id}
              className="animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CategoryCard
                category={{
                  ...data,
                  id: String(data.id),
                  postCount: data._count.posts,
                }}
                latestPostTitle={latestPostTitle}
                categoryDescriptions={data.description || ''}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
