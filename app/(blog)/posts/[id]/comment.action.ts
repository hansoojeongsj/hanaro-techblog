'use server';

import { revalidatePath } from 'next/cache';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function createComment(formData: {
  postId: number;
  content: string;
  parentId?: number | null;
  writerId: number;
}) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error('로그인이 필요한 서비스입니다.');
  }

  const currentUserId = Number(session.user.id);
  try {
    await prisma.comment.create({
      data: {
        content: formData.content,
        postId: formData.postId,
        parentId: formData.parentId || null,
        writerId: currentUserId,
      },
    });

    revalidatePath('/', 'layout');
    return { success: true };
  } catch (error) {
    console.error('댓글 생성 에러:', error);
    throw new Error('댓글 작성 중 오류가 발생했습니다.');
  }
}

export async function deleteComment(id: number, postId: number) {
  await prisma.comment.update({
    where: { id },
    data: { isDeleted: true },
  });
  revalidatePath(`/posts/${postId}`);
}

export async function updateComment(
  id: number,
  content: string,
  postId: number,
) {
  await prisma.comment.update({
    where: { id },
    data: { content },
  });

  revalidatePath(`/posts/${postId}`);
}
