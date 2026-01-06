import { prisma } from '@/lib/prisma';
import type { PostCardData } from '../blog.type';

export type CategoryBase = {
  id: string;
  name: string;
  slug: string;
  icon?: string | null;
  description?: string | null;
  postCount: number;
};

export type CategoryWithLatest = CategoryBase & {
  latestPostTitle?: string;
};

export type CategoryDetail = CategoryBase & {
  posts: PostCardData[];
};

export const getCategoriesWithStats = async (): Promise<
  CategoryWithLatest[]
> => {
  const categories = await prisma.category.findMany({
    orderBy: { name: 'asc' },
    include: {
      _count: {
        select: {
          posts: { where: { isDeleted: false, writer: { isDeleted: false } } },
        },
      },
      posts: {
        where: { isDeleted: false, writer: { isDeleted: false } },
        take: 1,
        orderBy: { createdAt: 'desc' },
        select: { title: true },
      },
    },
  });

  return categories.map((data) => ({
    id: String(data.id),
    name: data.name,
    slug: data.slug,
    description: data.description,
    icon: data.icon,
    postCount: data._count.posts,
    latestPostTitle: data.posts[0]?.title,
  }));
};

export const getCategoryDetailBySlug = async (
  slug: string,
): Promise<CategoryDetail | null> => {
  const data = await prisma.category.findUnique({
    where: { slug },
    include: {
      posts: {
        where: { isDeleted: false, writer: { isDeleted: false } },
        orderBy: { createdAt: 'desc' },
        include: {
          writer: true,
          _count: { select: { comments: true, postLikes: true } },
        },
      },
      _count: {
        select: {
          posts: { where: { isDeleted: false, writer: { isDeleted: false } } },
        },
      },
    },
  });

  if (!data) return null;

  return {
    id: String(data.id),
    name: data.name,
    slug: data.slug,
    icon: data.icon,
    postCount: data._count.posts,
    description: data.description,
    posts: data.posts.map((post) => ({
      id: String(post.id),
      title: post.title,
      excerpt: post.content.substring(0, 80),
      content: post.content,
      createdAt: post.createdAt,
      writer: post.writer.name,
      writerId: String(post.writerId),
      writerImage: post.writer.image,
      likes: post._count.postLikes,
      commentCount: post._count.comments,
      categoryId: String(data.id),
      category: {
        id: String(data.id),
        name: data.name,
        slug: data.slug,
      },
    })),
  };
};
