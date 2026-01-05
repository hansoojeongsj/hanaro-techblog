import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import Github from 'next-auth/providers/github';
import { prisma } from './prisma';
import { comparePassword } from './validator';

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  secret: process.env.AUTH_SECRET,

  providers: [
    Credentials({
      name: 'Email',
      credentials: {
        email: { label: '이메일', type: 'email' },
        passwd: { label: '비밀번호', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.passwd) {
          throw new Error('이메일과 비밀번호를 입력해주세요.');
        }

        const email = credentials.email as string;
        const password = credentials.passwd as string;

        const user = await prisma.user.findUnique({
          where: { email },
        });

        if (!user) {
          throw new Error('가입되지 않은 이메일입니다.');
        }

        if (user.isDeleted) {
          throw new Error(
            '탈퇴 처리 중인 계정입니다. 재가입은 탈퇴 7일 후 가능합니다.',
          );
        }

        if (!user.passwd) {
          throw new Error('소셜 로그인으로 가입된 계정입니다.');
        }

        const isMatch = await comparePassword(password, user.passwd);
        if (!isMatch) {
          throw new Error('비밀번호가 일치하지 않습니다.');
        }

        return {
          id: String(user.id),
          name: user.name,
          email: user.email,
          image: user.image,
          role: (user.role ?? 'USER') as 'ADMIN' | 'USER',
        };
      },
    }),
    Github({
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === 'credentials') return true;
      if (account?.provider === 'github') {
        try {
          const email = user.email;
          if (!email) return false;
          const existingUser = await prisma.user.findUnique({
            where: { email },
          });
          if (!existingUser) {
            await prisma.user.create({
              data: {
                email,
                name: user.name || 'User',
                image: user.image,
                role: 'USER',
              },
            });
          }
          return true;
        } catch (error) {
          console.error('Social Login Error:', error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      if (trigger === 'update' && session) return { ...token, ...session };
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.role = token.role as 'ADMIN' | 'USER';
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  session: {
    strategy: 'jwt',
  },
});
