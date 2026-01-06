'use client';

import Link from 'next/link';

export type CategoryBadgeCategory = {
  id: string | number;
  name: string;
  slug: string;
  postCount?: number;
};

type CategoryBadgeProps = {
  category: CategoryBadgeCategory;
  showCount?: boolean;
  size?: 'sm' | 'md' | 'lg';
};

const categoryColors: Record<string, string> = {
  javascript: 'bg-yellow-500/10 text-yellow-600 hover:bg-yellow-500/20',
  typescript: 'bg-blue-500/10 text-blue-600 hover:bg-blue-500/20',
  react: 'bg-cyan-500/10 text-cyan-600 hover:bg-cyan-500/20',
  nextjs: 'bg-foreground/10 text-foreground hover:bg-foreground/20',
  css: 'bg-pink-500/10 text-pink-600 hover:bg-pink-500/20',
  git: 'bg-orange-500/10 text-orange-600 hover:bg-orange-500/20',
};

export function CategoryBadge({
  category,
  showCount = false,
  size = 'md',
}: CategoryBadgeProps) {
  if (!category) return null;

  const colorClass =
    categoryColors[category.slug] ||
    'bg-primary/10 text-primary hover:bg-primary/20';

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base',
  };
  return (
    <Link
      href={`/categories/${category.slug}`}
      className={`category-badge ${colorClass} ${sizeClasses[size]} inline-flex items-center rounded-full font-medium transition-colors`}
    >
      {category.name}
      {showCount && (
        <span className="ml-1.5 opacity-70">({category.postCount})</span>
      )}
    </Link>
  );
}
