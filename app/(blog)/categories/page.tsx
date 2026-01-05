'use cache';

import { cacheLife } from 'next/cache';
import { CategoryCard } from '@/components/blog/CategoryCard';
import { getCategoriesWithStats } from './category.service';

export default async function CategoriesPage() {
  cacheLife({
    stale: 10,
    revalidate: 3600,
  });

  const categoriesData = await getCategoriesWithStats();

  return (
    <div className="container mx-auto px-4 pt-12 pb-16">
      <div className="mb-12 text-center">
        <h1 className="mb-4 font-bold text-3xl md:text-4xl">카테고리</h1>
        <p className="text-muted-foreground">기술 분야별로 모아보기</p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {categoriesData.map((data) => (
          <CategoryCard
            key={data.id}
            category={{
              ...data,
              id: String(data.id),
            }}
            latestPostTitle={data.latestPostTitle}
          />
        ))}
      </div>
    </div>
  );
}
