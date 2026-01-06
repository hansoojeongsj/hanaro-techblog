'use server';

import { revalidatePath } from 'next/cache';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function togglePostLike(postId: number) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error('로그인이 필요한 서비스입니다.');
  }

  const currentUserId = Number(session.user.id);

  const existingLike = await prisma.postLike.findUnique({
    where: {
      userId_postId: {
        userId: currentUserId,
        postId: postId,
      },
    },
  });

  if (existingLike) {
    await prisma.postLike.delete({
      where: {
        userId_postId: {
          userId: currentUserId,
          postId: postId,
        },
      },
    });
  } else {
    await prisma.postLike.create({
      data: {
        userId: currentUserId,
        postId: postId,
      },
    });
  }
  revalidatePath('/', 'layout');
}
