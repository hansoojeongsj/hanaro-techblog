'use server';

import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';

// 리턴값의 타입 정의
export type SignUpState = {
  message: string;
  type: 'success' | 'error' | ''; // 성공, 에러, 혹은 초기값
};

export async function signUp(
  _prevState: SignUpState, // 타입 적용 + 안 쓰는 변수는 _ 붙이기
  formData: FormData,
): Promise<SignUpState> {
  // 리턴 타입
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!name || !email || !password) {
    return { type: 'error', message: '모든 항목을 입력해주세요.' };
  }

  // 이메일 중복 확인
  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) {
    return { type: 'error', message: '이미 가입된 이메일입니다.' };
  }

  // 비밀번호 해싱
  const hashed = await bcrypt.hash(password, 10);

  // 유저 생성
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
