'use cache';

import { cacheLife } from 'next/cache';
import { CategoryCard } from '@/components/blog/CategoryCard';
import { getCategoriesWithStats } from './category.service';

export default async function CategoriesPage() {
  cacheLife({ stale: 10, revalidate: 3600 });

  const categoriesData = await getCategoriesWithStats();

  return (
    <div className="container mx-auto px-4 pt-12 pb-16">
      <div className="mb-12 text-center">
        <h1 className="mb-4 font-bold text-3xl md:text-4xl">카테고리</h1>
        <p className="text-muted-foreground">
          관심 있는 기술 분야를 선택해보세요.
        </p>
      </div>

      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {categoriesData.map((data, index) => (
          <div
            key={data.id}
            className="animate-slide-up"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <CategoryCard category={data} />
          </div>
        ))}
      </div>
    </div>
  );
}
