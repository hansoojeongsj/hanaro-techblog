'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import type { FormState } from './post.types';

export const handlePostAction = async (
  _prevState: FormState | undefined,
  formData: FormData,
): Promise<FormState> => {
  const session = await auth();

  if (session?.user?.role !== 'ADMIN') {
    return { error: { auth: '관리자 권한이 없습니다.' } };
  }

  const id = formData.get('id') ? Number(formData.get('id')) : null;
  const title = formData.get('title') as string;
  const content = formData.get('content') as string;
  const categoryId = formData.get('categoryId') as string;

  const errors: FormState['error'] = {};
  if (!title) errors.title = '제목을 입력해주세요.';
  if (!content) errors.content = '내용을 입력해주세요.';
  if (!categoryId) errors.categoryId = '카테고리를 선택해주세요.';

  if (Object.keys(errors).length > 0) {
    return { error: errors, data: { title, content, categoryId } };
  }

  try {
    if (id) {
      await prisma.post.update({
        where: { id },
        data: { title, content, categoryId: Number(categoryId) },
      });
    } else {
      await prisma.post.create({
        data: {
          title,
          content,
          categoryId: Number(categoryId),
          writerId: Number(session.user.id),
        },
      });
    }

    revalidatePath('/');
    revalidatePath('/posts');
    if (id) revalidatePath(`/posts/${id}`);
  } catch (_) {
    return {
      error: { title: '저장 중 오류가 발생했습니다.' },
      data: { title, content, categoryId },
    };
  }

  redirect(id ? `/posts/${id}` : '/posts');
};
