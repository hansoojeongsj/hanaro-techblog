import type { PostForList } from '@/components/blog/PostsClient';
import { prisma } from '@/lib/prisma';
import { filterStopWords } from '@/lib/search';
import type { PostDetailData } from '../blog.type';

export type PostListData = {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  createdAt: Date;
  writer: string;
  writerId: string;
  writerImage: string | null;
  likes: number;
  commentCount: number;
  categoryId: number;
  category: { id: number; name: string; slug: string };
};

export async function getAllPosts(query?: string): Promise<PostForList[]> {
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
    id: post.id,
    title: post.title,
    content: post.content,
    createdAt: post.createdAt,
    // blog.type.ts의 PostCardData 구조에 맞게 수정
    writer: {
      id: post.writer.id,
      name: post.writer.name,
      image: post.writer.image,
      isDeleted: post.writer.isDeleted,
    },
    category: {
      id: post.category.id,
      name: post.category.name,
      slug: post.category.slug,
    },
    _count: {
      comments: post._count.comments,
      postLikes: post._count.postLikes,
    },
    categoryId: post.categoryId,
  }));
}

export const getPostDetail = async (
  postId: number,
  currentUserId: number | null,
): Promise<PostDetailData | null> => {
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
      _count: { select: { postLikes: true, comments: true } },
    },
  });

  if (!post) return null;

  return {
    ...post,
    id: post.id,
    writerId: post.writerId,
    isWriterDeleted: post.writer.isDeleted,
    likesCount: post._count.postLikes,
    isLiked: post.postLikes.length > 0,
    formattedDate: post.createdAt.toLocaleDateString(),
    formattedComments: post.comments.map((c) => ({
      id: c.id,
      content: c.content,
      isDeleted: c.isDeleted,
      writerId: c.writerId,
      postId: post.id,
      parentId: c.parentId,
      createdAt: c.createdAt,
      updatedAt: c.updatedAt,
      writer: {
        id: c.writer.id,
        name: c.writer.name,
        image: c.writer.image,
        isDeleted: c.writer.isDeleted,
      },
      isWriterDeleted: c.writer.isDeleted,
    })),
    writer: {
      id: post.writer.id,
      name: post.writer.name,
      image: post.writer.image,
      isDeleted: post.writer.isDeleted,
    },
    category: {
      id: post.category.id,
      name: post.category.name,
      slug: post.category.slug,
    },
  } as PostDetailData;
};
