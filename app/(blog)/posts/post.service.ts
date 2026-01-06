import { prisma } from '@/lib/prisma';
import { filterStopWords } from '@/lib/search';

export type PostListData = {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  createdAt: Date;
  writer: string;
  writerId: string;
  writerImage: string | null;
  likes: number;
  commentCount: number;
  categoryId: string;
  category: { id: string; name: string; slug: string };
};

export async function getAllPosts(query?: string) {
  const filteredQuery = await filterStopWords(query || '');

  const posts = await prisma.post.findMany({
    where: {
      isDeleted: false,
      writer: { isDeleted: false },
      ...(query && {
        OR: [
          { title: { search: `${filteredQuery}*` } },
          { content: { search: `${filteredQuery}*` } },
        ],
      }),
    },
    orderBy: { createdAt: 'desc' },
    include: {
      category: true,
      writer: true,
      _count: { select: { comments: true, postLikes: true } },
    },
  });

  return posts.map((post) => ({
    ...post,
    id: String(post.id),
    categoryId: String(post.categoryId),
    excerpt:
      post.content.length > 80
        ? `${post.content.substring(0, 80)}...`
        : post.content,
    writerId: String(post.writerId),
    writer: post.writer.name,
    writerImage: post.writer.image,
    likes: post._count.postLikes,
    commentCount: post._count.comments,
    category: { ...post.category, id: String(post.category.id) },
  }));
}

export const getPostDetail = async (
  postId: number,
  currentUserId: number | null,
) => {
  const post = await prisma.post.findUnique({
    where: { id: postId },
    include: {
      writer: true,
      category: true,
      comments: {
        orderBy: { createdAt: 'asc' },
        include: { writer: true },
      },
      postLikes: { where: { userId: currentUserId || 0 } },
      _count: { select: { postLikes: true } },
    },
  });

  if (!post) return null;

  return {
    ...post,
    id: post.id,
    isWriterDeleted: post.writer.isDeleted,
    likesCount: post._count.postLikes,
    isLiked: post.postLikes.length > 0,
    formattedDate: new Date(post.createdAt).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }),
    formattedComments: post.comments.map((c) => ({
      id: String(c.id),
      writerId: c.writerId,
      author: {
        name: c.writer.isDeleted ? '탈퇴한 사용자' : c.writer.name,
        avatar: c.writer.isDeleted ? undefined : c.writer.image || undefined,
      },
      content: c.content,
      createdAt: c.createdAt,
      updatedAt: c.updatedAt,
      parentId: c.parentId ? String(c.parentId) : null,
      isWriterDeleted: c.writer.isDeleted,
      isDeleted: c.isDeleted,
    })),
  };
};
