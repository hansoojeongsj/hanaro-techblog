'use cache';

import { cacheLife } from 'next/cache';
import { PostsClient } from '@/components/blog/PostsClient';
import { prisma } from '@/lib/prisma';

export default async function PostsPage() {
  // 캐시 설정 (새 글이 올라오면 1시간 뒤, 혹은 1분 뒤 갱신)
  cacheLife({
    stale: 60, // 1분 (목록 페이지는 자주 갱신되는 게 좋음)
    revalidate: 3600,
  });

  // 카테고리 전체 가져오기
  const categories = await prisma.category.findMany({
    orderBy: { name: 'asc' },
  });

  // 게시글 전체 가져오기 (작성자, 카테고리 포함)
  const postsData = await prisma.post.findMany({
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

  // 데이터 가공 (PostCard가 좋아하는 모양으로 변환)
  const formattedPosts = postsData.map((post) => ({
    ...post,
    id: String(post.id),
    categoryId: String(post.categoryId), // 필터링용 ID 변환
    excerpt:
      post.content.length > 100
        ? `${post.content.substring(0, 100)}...`
        : post.content,
    createdAt: post.createdAt,
    writerId: String(post.writerId),
    writer: post.writer.name,
    likes: post._count.postLikes,
    commentCount: post._count.comments,
    // 카테고리 객체도 ID 변환해서 넣어둠
    category: {
      ...post.category,
      id: String(post.category.id),
    },
  }));

  // 클라이언트 컴포넌트에 데이터 전달
  return (
    <PostsClient
      initialPosts={formattedPosts}
      categories={categories.map((c) => ({ ...c, id: String(c.id) }))}
    />
  );
}
