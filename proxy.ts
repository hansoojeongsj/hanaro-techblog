import { type NextRequest, NextResponse } from 'next/server';
import { auth } from './lib/auth'; // auth.ts에서 가져오기

export default async function proxy(req: NextRequest) {
  const session = await auth();
  const didLogin = !!session?.user;

  const isAdmin = session?.user?.role === 'ADMIN';

  if (!didLogin) {
    const callbackUrl = encodeURIComponent(req.nextUrl.pathname);

    return NextResponse.redirect(
      new URL(`/login?callbackUrl=${callbackUrl}`, req.url),
    );
  }
  if (!isAdmin) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
