'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';

// 댓글 등록
export async function createComment(formData: {
  postId: number;
  content: string;
  parentId?: number | null;
  writerId: number; // 실제로는 auth 세션에서 가져와야 함
}) {
  await prisma.comment.create({
    data: {
      content: formData.content,
      postId: formData.postId,
      writerId: formData.writerId,
      parentId: formData.parentId || null,
    },
  });

  // 페이지 새로고침 없이 데이터 갱신
  revalidatePath(`/posts/${formData.postId}`);
}

// 댓글 삭제
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
