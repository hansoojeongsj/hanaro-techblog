import { PostsClient } from '@/components/blog/PostsClient';
import { prisma } from '@/lib/prisma';
import { getAllPosts } from './post.service';

type PostsPageProps = {
  searchParams: Promise<{ q?: string }>;
};

export default async function PostsPage({ searchParams }: PostsPageProps) {
  const { q: query } = await searchParams;

  const [categories, formattedPosts] = await Promise.all([
    prisma.category.findMany({ orderBy: { name: 'asc' } }),
    getAllPosts(query),
  ]);

  return (
    <PostsClient
      initialPosts={formattedPosts}
      categories={categories.map((c) => ({ ...c, id: c.id }))}
      searchQuery={query || ''}
    />
  );
}
