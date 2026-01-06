'use server';

import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';

export type SignUpState = {
  message: string;
  type: 'success' | 'error' | '';
};

export async function signUp(
  _prevState: SignUpState,
  formData: FormData,
): Promise<SignUpState> {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!name || !email || !password) {
    return { type: 'error', message: '모든 항목을 입력해주세요.' };
  }

  const exists = await prisma.user.findFirst({
    where: {
      email,
      isDeleted: false,
    },
  });

  if (exists) {
    return { type: 'error', message: '이미 사용 중인 이메일입니다.' };
  }

  const deletedUser = await prisma.user.findFirst({
    where: {
      email,
      isDeleted: true,
    },
  });

  if (deletedUser) {
    return {
      type: 'error',
      message: '탈퇴 처리 중인 계정입니다. 재가입은 탈퇴 7일 후 가능합니다.',
    };
  }

  const hashed = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: {
      name,
      email,
      passwd: hashed,
      role: 'USER',
    },
  });

  return {
    type: 'success',
    message: '회원가입이 완료되었습니다! 로그인 페이지로 이동합니다.',
  };
}
