'use server';

import { revalidatePath } from 'next/cache';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function withdrawUserAction(userId: number) {
  try {
    const session = await auth();

    if (
      !session ||
      (session.user.role !== 'ADMIN' && Number(session.user.id) !== userId)
    ) {
      return { success: false, message: '권한이 없습니다.' };
    }

    await prisma.user.update({
      where: { id: userId },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
      },
    });

    revalidatePath('/', 'layout');

    return {
      success: true,
      message: '탈퇴 유예 처리가 완료되었습니다. (7일 후 정보 파기)',
    };
  } catch (error) {
    console.error('유저 삭제 에러:', error);
    return { success: false, message: '탈퇴 처리 중 오류 발생' };
  }
}

export async function anonymizeOldUsersAction() {
  try {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const targets = await prisma.user.findMany({
      where: {
        isDeleted: true,
        deletedAt: { lte: sevenDaysAgo },
        NOT: { email: { startsWith: 'deleted_' } },
      },
    });

    if (targets.length === 0) return;

    const tasks = targets.map((user) =>
      prisma.user.update({
        where: { id: user.id },
        data: {
          name: '탈퇴한 사용자',
          email: `deleted_${user.id}_${Date.now()}@deleted.com`,
          passwd: null,
          image: null,
        },
      }),
    );

    await Promise.all(tasks);
    revalidatePath('/admin');
    console.log(`${targets.length}명의 유저 정보가 익명화되었습니다.`);
  } catch (error) {
    console.error('익명화 작업 중 에러:', error);
  }
}

export async function restoreUserAction(userId: number) {
  try {
    const session = await auth();
    if (session?.user?.role !== 'ADMIN')
      return { success: false, message: '권한 부족' };

    await prisma.user.update({
      where: { id: userId },
      data: {
        isDeleted: false,
        deletedAt: null,
      },
    });

    revalidatePath('/', 'layout');
    return { success: true, message: '회원 계정이 성공적으로 복구되었습니다.' };
  } catch (error) {
    console.error('유저 복구 에러:', error);
    return { success: false, message: '복구 중 오류 발생' };
  }
}

export async function deletePostAction(postId: number) {
  try {
    const session = await auth();
    if (session?.user?.role !== 'ADMIN') {
      return { success: false, message: '권한이 없습니다.' };
    }

    await prisma.post.update({
      where: { id: postId },
      data: { isDeleted: true },
    });

    revalidatePath('/', 'layout');
    return { success: true, message: '게시글이 삭제 처리되었습니다.' };
  } catch (error) {
    console.error('게시글 삭제 에러:', error);
    return { success: false, message: '게시글 삭제 중 오류가 발생했습니다.' };
  }
}

export async function deleteCommentAction(commentId: number, postId: number) {
  try {
    const session = await auth();
    if (session?.user?.role !== 'ADMIN') {
      return { success: false, message: '권한이 없습니다.' };
    }

    await prisma.comment.update({
      where: { id: commentId },
      data: { isDeleted: true },
    });

    revalidatePath('/admin');
    revalidatePath(`/posts/${postId}`);

    return { success: true, message: '댓글이 삭제 처리되었습니다.' };
  } catch (error) {
    console.error('댓글 삭제 에러:', error);
    return { success: false, message: '댓글 삭제 중 오류가 발생했습니다.' };
  }
}
