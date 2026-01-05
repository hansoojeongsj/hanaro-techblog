'use server';

import { AuthError } from 'next-auth';
import { signIn } from '@/lib/auth';

export type ActionState = {
  message: string;
  type: 'success' | 'error' | '';
};

export async function loginAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    // formData에서 값 꺼내기
    const email = formData.get('email');
    const passwd = formData.get('passwd'); // Input name=passwd 확인

    // signIn 함수에 객체로 전달
    // formData를 통째로 넘기지 말고, 필요한 것만
    await signIn('credentials', {
      email,
      passwd,
      redirectTo: '/',
    });

    return { message: '로그인 성공', type: 'success' };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return {
            message: '이메일 또는 비밀번호가 일치하지 않습니다.',
            type: 'error',
          };
        case 'CallbackRouteError':
          return {
            message: '로그인 중 오류가 발생했습니다.',
            type: 'error',
          };
        default:
          return {
            message: '알 수 없는 오류가 발생했습니다.',
            type: 'error',
          };
      }
    }
    throw error;
  }
}

export async function githubLoginAction() {
  await signIn('github', { redirectTo: '/' });
}
