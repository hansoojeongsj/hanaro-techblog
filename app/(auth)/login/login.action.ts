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
    const email = formData.get('email');
    const passwd = formData.get('passwd');

    await signIn('credentials', {
      email,
      passwd,
      redirectTo: '/',
    });

    return { message: '로그인 성공', type: 'success' };
  } catch (error) {
    if (error instanceof AuthError) {
      const errorMessage = error.cause?.err?.message || '';

      if (errorMessage.includes('탈퇴 처리 중인 계정')) {
        return {
          message: errorMessage,
          type: 'error',
        };
      }

      switch (error.type) {
        case 'CredentialsSignin':
          return {
            message: '이메일 또는 비밀번호가 일치하지 않습니다.',
            type: 'error',
          };
        default:
          return {
            message: '로그인 중 오류가 발생했습니다.',
            type: 'error',
          };
      }
    }
    throw error;
  }
}

export async function handleGithubLogin() {
  await signIn('github', { redirectTo: '/' });
}
