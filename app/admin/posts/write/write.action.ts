'use server';

import { redirect } from 'next/navigation';

// 퍼블리싱용 임시 타입 (나중에 lib/validator.ts로 교체하세요)
type ValidError = {
  error: Record<string, string | undefined>;
  data: Record<string, string | undefined | null>;
};

// 껍데기뿐인 서버 액션 (DB 없이 동작)
export const writePostAction = async (
  prevState: ValidError | undefined,
  formData: FormData,
): Promise<ValidError | undefined> => {
  // 1. 네트워크 딜레이 흉내 (1초 기다림 -> 로딩바 확인용)
  await new Promise((resolve) => setTimeout(resolve, 1000));

  console.log('✅ [Mock Server] 폼 데이터 수신 성공!');
  console.log('제목:', formData.get('title'));
  console.log('내용:', formData.get('content'));
  console.log('카테고리:', formData.get('categoryId'));

  // 2. 간단한 유효성 검사 흉내 (제목 비어있으면 에러 뱉기)
  const title = formData.get('title') as string;
  const content = formData.get('content') as string;

  if (!title || title.trim() === '') {
    return {
      error: { title: '제목을 입력해주세요! (테스트 에러)' },
      data: {
        title,
        content,
        categoryId: formData.get('categoryId') as string,
      },
    };
  }

  // 3. 성공한 척하고 목록으로 이동
  console.log('🎉 글 저장 성공 (흉내)');
  redirect('/posts');
};
