'use cache';

import { cacheLife } from 'next/cache';
import { PostsClient } from '@/components/blog/PostsClient';
import { prisma } from '@/lib/prisma';

export default async function PostsPage() {
  cacheLife({
    stale: 60,
    revalidate: 3600,
  });

  // 카테고리 전체 가져오기
  const categories = await prisma.category.findMany({
    orderBy: { name: 'asc' },
  });

  // 게시글 전체 가져오기
  const postsData = await prisma.post.findMany({
    where: {
      isDeleted: false,
      writer: { isDeleted: false },
    },
    orderBy: { createdAt: 'desc' },
    include: {
      category: true,
      writer: true,
      _count: {
        select: {
          comments: true,
          postLikes: true,
        },
      },
    },
  });

  const formattedPosts = postsData.map((post) => ({
    ...post,
    id: String(post.id),
    categoryId: String(post.categoryId),
    excerpt:
      post.content.length > 80
        ? `${post.content.substring(0, 80)}...`
        : post.content,
    createdAt: post.createdAt,
    writerId: String(post.writerId),
    writer: post.writer.name,
    writerImage: post.writer.image,
    likes: post._count.postLikes,
    commentCount: post._count.comments,
    category: {
      ...post.category,
      id: String(post.category.id),
    },
  }));

  return (
    <PostsClient
      initialPosts={formattedPosts}
      categories={categories.map((c) => ({ ...c, id: String(c.id) }))}
    />
  );
}
