'use client';

import Link from 'next/link';
import type { CategoryBase } from '@/app/(blog)/categories/category.service';

type CategoryBadgeProps = {
  category: CategoryBase;
  showCount?: boolean;
  size?: 'sm' | 'md' | 'lg';
};

export function CategoryBadge({
  category,
  showCount = false,
  size = 'md',
}: CategoryBadgeProps) {
  if (!category) return null;

  const brandColor = category.color || '#6366f1';

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base',
  };

  return (
    <Link
      href={`/categories/${category.slug}`}
      className={`inline-flex items-center rounded-full font-medium transition-all hover:brightness-90 ${sizeClasses[size]}`}
      style={{
        backgroundColor: `${brandColor}20`,

        color: brandColor,

        filter: 'brightness(0.9)',

        border: `1px solid ${brandColor}30`,
      }}
    >
      {category.name}
      {showCount && (
        <span className="ml-1.5 opacity-70">({category.postCount})</span>
      )}
    </Link>
  );
}
