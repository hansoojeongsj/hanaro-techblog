'use client';

import { Eye, EyeOff, Mail } from 'lucide-react';
import Link from 'next/link';
import { useActionState, useEffect, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { toast } from 'sonner';
import { GithubLoginButton } from '@/components/auth/GithubLoginButton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { type ActionState, loginAction } from './login.action';

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
            <GithubLoginButton />
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
              prefetch={false}
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
