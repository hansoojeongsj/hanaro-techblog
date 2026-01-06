import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import Github from 'next-auth/providers/github';
import Google from 'next-auth/providers/google';
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
    Github,
    Google,
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (!user.email) return false;

      let dbUser = await prisma.user.findUnique({
        where: { email: user.email },
      });

      if (account?.provider !== 'credentials') {
        if (dbUser) {
          if (dbUser.isDeleted) {
            throw new Error(
              '탈퇴 처리 중인 계정입니다. 재가입은 탈퇴 7일 후 가능합니다.',
            );
          }

          const savedProvider = dbUser.provider;
          const currentProvider = account?.provider;

          if (savedProvider && savedProvider !== currentProvider) {
            const providerName =
              savedProvider === 'github'
                ? '깃허브'
                : savedProvider === 'google'
                  ? '구글'
                  : '이메일';
            throw new Error(
              `해당 이메일은 이미 ${providerName}로 가입되어 있습니다. ${providerName}로 로그인해 주세요.`,
            );
          }
        } else {
          dbUser = await prisma.user.create({
            data: {
              email: user.email,
              name: user.name || user.email.split('@')[0],
              image: user.image,
              role: 'USER',
              provider: account?.provider,
            },
          });
        }

        user.id = String(dbUser.id);
        user.role = dbUser.role;
      }

      return true;
    },
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }

      if (trigger === 'update' && session) {
        return { ...token, ...session };
      }

      return token;
    },

    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = String(token.id);
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
