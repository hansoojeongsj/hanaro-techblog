import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { categoryIcons } from '@/lib/utils';

type CategoryWithCount = {
  id: number;
  name: string;
  slug: string;
  _count: {
    posts: number;
  };
};

type CategoryListProps = {
  categories: CategoryWithCount[];
};

export function CategoryList({ categories }: CategoryListProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <h3 className="mb-4 font-semibold text-lg">카테고리</h3>
      <ul className="space-y-2">
        {categories.map((category) => {
          const icon = categoryIcons[category.slug] || '📁';

          return (
            <li key={category.id}>
              <Link
                href={`/categories/${category.slug}`}
                className="group flex items-center justify-between rounded-lg p-3 transition-colors hover:bg-muted"
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">{icon}</span>
                  <span className="font-medium transition-colors group-hover:text-primary">
                    {category.name}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <span className="text-sm">{category._count.posts}</span>
                  <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
