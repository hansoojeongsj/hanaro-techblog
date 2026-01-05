'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';

export async function createComment(formData: {
  postId: number;
  content: string;
  parentId?: number | null;
  writerId: number;
}) {
  await prisma.comment.create({
    data: {
      content: formData.content,
      postId: formData.postId,
      writerId: formData.writerId,
      parentId: formData.parentId || null,
    },
  });

  revalidatePath(`/posts/${formData.postId}`);
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
