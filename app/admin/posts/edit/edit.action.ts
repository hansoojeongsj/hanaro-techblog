'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';

export type EditState = {
  error?: string | { title?: string; content?: string; categoryId?: string };
  data?: { title: string; content: string; categoryId: string };
  success?: boolean;
};

export async function updatePostAction(
  _prevState: EditState | undefined,
  formData: FormData,
): Promise<EditState> {
  const id = Number(formData.get('id'));
  const title = formData.get('title') as string;
  const content = formData.get('content') as string;
  const categoryId = Number(formData.get('categoryId'));

  try {
    await prisma.post.update({
      where: { id },
      data: {
        title,
        content,
        categoryId,
      },
    });

    revalidatePath(`/posts/${id}`);
    revalidatePath('/posts');
  } catch (_) {
    return { error: '수정 중 오류가 발생했습니다.' };
  }

  // 수정 완료 후 해당 글 상세페이지로 이동
  redirect(`/posts/${id}`);
}
