'use server';

import { revalidatePath } from 'next/cache';

// 가짜 딜레이
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function deleteUserAction(userId: string) {
  await sleep(500);
  console.log(`🗑️ [Server] 유저 삭제 요청: ${userId}`);
  // DB 삭제 로직이 들어갈 자리
  // await prisma.user.delete({ where: { id: userId } });
  revalidatePath('/admin'); // 데이터 갱신
  return { success: true, message: '회원이 삭제되었습니다.' };
}

export async function deletePostAction(postId: string) {
  await sleep(500);
  console.log(`🗑️ [Server] 게시글 삭제 요청: ${postId}`);
  revalidatePath('/admin');
  return { success: true, message: '게시글이 삭제되었습니다.' };
}

export async function deleteCommentAction(commentId: string) {
  await sleep(500);
  console.log(`🗑️ [Server] 댓글 삭제 요청: ${commentId}`);
  revalidatePath('/admin');
  return { success: true, message: '댓글이 삭제되었습니다.' };
}
