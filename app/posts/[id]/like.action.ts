'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';

export async function togglePostLike(postId: number, userId: number) {
  const existingLike = await prisma.postLike.findUnique({
    where: {
      userId_postId: {
        userId: userId,
        postId: postId,
      },
    },
  });

  if (existingLike) {
    await prisma.postLike.delete({
      where: {
        userId_postId: {
          userId: userId,
          postId: postId,
        },
      },
    });
  } else {
    await prisma.postLike.create({
      data: {
        userId: userId,
        postId: postId,
      },
    });
  }

  // 페이지의 좋아요 숫자를 새로고침 없이 갱신
  revalidatePath(`/posts/${postId}`);
}
