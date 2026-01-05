'use cache';

import { cacheLife } from 'next/cache';
import { PostsClient } from '@/components/blog/PostsClient';
import { prisma } from '@/lib/prisma';
import { getAllPosts } from './post.service';

export default async function PostsPage() {
  cacheLife({ stale: 60, revalidate: 3600 });

  const [categories, formattedPosts] = await Promise.all([
    prisma.category.findMany({ orderBy: { name: 'asc' } }),
    getAllPosts(),
  ]);

  return (
    <PostsClient
      initialPosts={formattedPosts}
      categories={categories.map((c) => ({ ...c, id: String(c.id) }))}
    />
  );
}
