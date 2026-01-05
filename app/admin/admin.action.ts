'use server';

import { revalidatePath } from 'next/cache';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

/**
 * 유저 삭제 액션 (소프트 삭제)
 */
export async function deleteUserAction(userId: number) {
  try {
    const session = await auth();
    if (session?.user?.role !== 'ADMIN')
      return { success: false, message: '권한 부족' };

    await prisma.user.update({
      where: { id: userId },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
      },
    });

    revalidatePath('/admin');
    return {
      success: true,
      message: '회원이 탈퇴 처리되었습니다. (유예 기간 시작)',
    };
  } catch (error) {
    console.error('유저 삭제 에러:', error);
    return { success: false, message: '탈퇴 처리 중 오류 발생' };
  }
}

/**
 * 유저 복구 액션
 */
export async function restoreUserAction(userId: number) {
  try {
    const session = await auth();
    if (session?.user?.role !== 'ADMIN')
      return { success: false, message: '권한 부족' };

    await prisma.user.update({
      where: { id: userId },
      data: {
        isDeleted: false,
        deletedAt: null, // 삭제 기록 초기화
      },
    });

    revalidatePath('/admin');
    return { success: true, message: '회원 계정이 성공적으로 복구되었습니다.' };
  } catch (error) {
    console.error('유저 복구 에러:', error);
    return { success: false, message: '복구 중 오류 발생' };
  }
}

/**
 * 게시글 삭제 액션 (Soft Delete)
 */
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

    revalidatePath('/admin');
    revalidatePath('/posts');

    return { success: true, message: '게시글이 삭제 처리되었습니다.' };
  } catch (error) {
    console.error('게시글 삭제 에러:', error);
    return { success: false, message: '게시글 삭제 중 오류가 발생했습니다.' };
  }
}

/**
 * 댓글 삭제 액션 (Soft Delete)
 */
export async function deleteCommentAction(commentId: number) {
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
    return { success: true, message: '댓글이 삭제 처리되었습니다.' };
  } catch (error) {
    console.error('댓글 삭제 에러:', error);
    return { success: false, message: '댓글 삭제 중 오류가 발생했습니다.' };
  }
}
