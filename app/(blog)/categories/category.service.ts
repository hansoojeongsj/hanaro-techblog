import { prisma } from '@/lib/prisma';
import type { CategoryData, PostCardData } from '../blog.type';

export type CategoryBase = CategoryData & {
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
    id: data.id,
    name: data.name,
    slug: data.slug,
    description: data.description,
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
          writer: {
            select: { id: true, name: true, image: true, isDeleted: true },
          },
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
    id: data.id,
    name: data.name,
    slug: data.slug,
    postCount: data._count.posts,
    description: data.description,
    posts: data.posts.map((post) => ({
      id: post.id,
      title: post.title,
      content: post.content,
      createdAt: post.createdAt,
      writer: {
        id: post.writer.id,
        name: post.writer.name,
        image: post.writer.image,
        isDeleted: post.writer.isDeleted,
      },
      category: {
        id: data.id,
        name: data.name,
        slug: data.slug,
      },
      _count: {
        comments: post._count.comments,
        postLikes: post._count.postLikes,
      },
    })),
  };
};
