'use server';

import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';

// 리턴값의 타입 정의
export type SignUpState = {
  message: string;
  type: 'success' | 'error' | ''; // 성공, 에러, 혹은 초기값
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

  // 이메일 중복 확인 (탈퇴하지 않은 활동 중인 유저만 확인)
  const exists = await prisma.user.findFirst({
    where: {
      email,
      isDeleted: false,
    },
  });

  if (exists) {
    return { type: 'error', message: '이미 사용 중인 이메일입니다.' };
  }

  // 탈퇴 대기 중인 이메일인지 확인 (유예 기간 7일 체크)
  const deletedUser = await prisma.user.findFirst({
    where: {
      email,
      isDeleted: true,
    },
  });

  if (deletedUser) {
    return {
      type: 'error',
      message:
        '탈퇴 처리 중인 이메일입니다. 탈퇴 신청 7일 이후에 다시 가입하실 수 있습니다.',
    };
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
