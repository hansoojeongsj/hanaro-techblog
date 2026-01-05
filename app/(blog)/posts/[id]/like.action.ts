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
  revalidatePath('/');
  revalidatePath(`/posts/${postId}`);
}
