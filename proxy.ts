import { type NextRequest, NextResponse } from 'next/server';
import { auth } from './lib/auth'; // auth.ts에서 가져오기

// export default로 바꿔야 작동합니다!
export default async function proxy(req: NextRequest) {
  // 1. 로그인 세션 확인
  const session = await auth();
  const didLogin = !!session?.user;

  // 2. 로그인 안 했으면 로그인 페이지로 쫓아내기
  if (!didLogin) {
    // 원래 가려던 페이지 주소를 기억해뒀다가, 로그인 후 거기로 다시 보내줌
    const callbackUrl = encodeURIComponent(req.nextUrl.pathname);

    // '/sign' -> '/login'으로 수정 (우리가 만든 페이지 경로)
    return NextResponse.redirect(
      new URL(`/login?callbackUrl=${callbackUrl}`, req.url),
    );
  }

  // 3. 통과! 원래 가려던 곳으로 진행
  return NextResponse.next();
}

// 이 미들웨어가 적용될 경로 설정
export const config = {
  matcher: [
    // '/admin'으로 시작하는 모든 경로는 로그인 검사
    '/admin/:path*',

    // 필요하면 아래 주석 풀어서 추가 가능
    // '/my/:path*', // 마이페이지도 보호하고 싶으면 추가
  ],
};
