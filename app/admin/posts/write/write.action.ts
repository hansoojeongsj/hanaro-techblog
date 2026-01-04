'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// 1.5초 대기를 위한 헬퍼 함수
const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));

type ValidError = {
  error: Record<string, string | undefined>;
  data: Record<string, string | undefined | null>;
  success?: boolean; // 성공 여부 추가
};

export const writePostAction = async (
  _prevState: ValidError | undefined,
  formData: FormData,
): Promise<ValidError | undefined> => {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: { title: '로그인이 필요한 서비스입니다.' }, data: {} };
  }

  const title = formData.get('title') as string;
  const content = formData.get('content') as string;
  const categoryId = formData.get('categoryId') as string;

  const errors: Record<string, string> = {};
  if (!title) errors.title = '제목을 입력해주세요.';
  if (!content) errors.content = '내용을 입력해주세요.';
  if (!categoryId) errors.categoryId = '카테고리를 선택해주세요.';

  if (Object.keys(errors).length > 0) {
    return { error: errors, data: { title, content, categoryId } };
  }

  try {
    await prisma.post.create({
      data: {
        title,
        content,
        categoryId: Number(categoryId),
        writerId: Number(session.user.id),
      },
    });

    revalidatePath('/posts');

    await sleep(1500);
  } catch (e) {
    console.error(e);
    return {
      error: { title: 'DB 저장 중 오류가 발생했습니다.' },
      data: { title, content, categoryId },
    };
  }

  // 성공 시 목록으로 이동
  redirect('/posts');
};
