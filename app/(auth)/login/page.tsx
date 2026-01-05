'use client';

import { Eye, EyeOff, Mail } from 'lucide-react';
import Link from 'next/link';
import { useActionState, useEffect, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
  type ActionState,
  githubLoginAction,
  loginAction,
} from './login.action';

export default function LoginPage() {
  const [state, formAction] = useActionState(loginAction, {
    message: '',
    type: '',
  } as ActionState);

  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (state?.message && state?.type === 'error') {
      toast.error(state.message);
    }
  }, [state]);

  const handleGithubLogin = async () => {
    await githubLoginAction();
  };

  const handleForgotPassword = () => {
    toast.info('알림', { description: '추후 업데이트 예정입니다.' });
  };

  return (
    <div className="flex min-h-[calc(100vh-200px)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md animate-scale-in">
        <div className="rounded-2xl border border-border bg-card p-8 shadow-lg">
          <div className="mb-8 text-center">
            <h1 className="mb-2 font-bold text-2xl">로그인</h1>
            <p className="text-muted-foreground">
              계정에 로그인하여 블로그를 이용하세요
            </p>
          </div>

          <div className="mb-6 space-y-3">
            <Button
              variant="outline"
              className="h-12 w-full"
              onClick={handleGithubLogin}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <title>Github</title>
                <path d="M12 0C5.37 0 0 5.373 0 12c0 5.303 3.438 9.8 8.205 11.387.6.113.82-.262.82-.583 0-.288-.01-1.05-.015-2.06-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.09-.745.083-.73.083-.73 1.205.084 1.84 1.238 1.84 1.238 1.07 1.834 2.807 1.304 3.492.997.108-.775.418-1.305.76-1.605-2.665-.305-5.467-1.334-5.467-5.934 0-1.31.465-2.382 1.235-3.222-.124-.303-.535-1.523.117-3.176 0 0 1.008-.323 3.3 1.23a11.51 11.51 0 013.003-.403c1.018.005 2.045.137 3.003.403 2.29-1.554 3.296-1.23 3.296-1.23.655 1.653.244 2.873.12 3.176.77.84 1.234 1.912 1.234 3.222 0 4.61-2.807 5.625-5.48 5.922.43.37.815 1.102.815 2.222 0 1.605-.015 2.897-.015 3.292 0 .322.217.698.825.58C20.565 21.796 24 17.303 24 12c0-6.627-5.373-12-12-12z" />
              </svg>
              <span className="font-medium text-sm">GitHub로 로그인</span>
            </Button>
          </div>

          <div className="relative mb-6">
            <Separator />
            <span className="-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2 bg-card px-4 text-muted-foreground text-sm">
              또는
            </span>
          </div>

          {/* Email Form */}
          <form action={formAction} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">이메일</Label>
              <div className="relative">
                <Mail className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="email@example.com"
                  className="h-12 pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">비밀번호</Label>
                <Link
                  href="#"
                  onClick={handleForgotPassword}
                  className="text-primary text-sm hover:underline"
                >
                  비밀번호 찾기
                </Link>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  name="passwd"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="h-12 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="-translate-y-1/2 absolute top-1/2 right-3 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <LoginButton />
          </form>

          <p className="mt-6 text-center text-muted-foreground text-sm">
            아직 계정이 없으신가요?{' '}
            <Link
              href="/signup"
              className="font-medium text-primary hover:underline"
            >
              회원가입
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

function LoginButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" className="h-12 w-full" disabled={pending}>
      {pending ? '로그인 중...' : '로그인'}
    </Button>
  );
}
