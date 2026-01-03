import { ChevronRight } from 'lucide-react';
import Link from 'next/link';

// 타입 임시 정의
type Category = {
  id: string;
  name: string;
  slug: string;
  postCount: number;
};

interface CategoryListProps {
  categories: Category[];
}

const categoryIcons: Record<string, string> = {
  javascript: '🟨',
  typescript: '🔷',
  react: '⚛️',
  nextjs: '▲',
  css: '🎨',
  git: '🔀',
};

export function CategoryList({ categories }: CategoryListProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <h3 className="mb-4 font-semibold text-lg">카테고리</h3>
      <ul className="space-y-2">
        {categories.map((category) => (
          <li key={category.id}>
            <Link
              href={`/categories/${category.slug}`}
              className="group flex items-center justify-between rounded-lg p-3 transition-colors hover:bg-muted"
            >
              <div className="flex items-center gap-3">
                <span className="text-lg">
                  {categoryIcons[category.slug] || '📁'}
                </span>
                <span className="font-medium transition-colors group-hover:text-primary">
                  {category.name}
                </span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <span className="text-sm">{category.postCount}</span>
                <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
