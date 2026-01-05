import { auth } from '@/lib/auth';
import Header from './Header';

export default async function SiteHeader() {
  const session = await auth();

  const user = session?.user
    ? {
        id: session.user.id,
        name: session.user.name ?? '',
        email: session.user.email ?? '',
        avatar: session.user.image ?? undefined,
        role: session.user.role as 'ADMIN' | 'USER',
      }
    : undefined;

  return <Header isLoggedIn={!!session} user={user} />;
}
