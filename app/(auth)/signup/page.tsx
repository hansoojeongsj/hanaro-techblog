'use client';

import { Eye, EyeOff, Mail, User } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 비밀번호 확인 로직
    if (password !== confirmPassword) {
      toast.error('비밀번호 불일치', {
        description: '비밀번호가 일치하지 않습니다.',
      });
      return;
    }

    setIsLoading(true);

    // 회원가입 시뮬레이션 (1초 딜레이)
    // 나중에 여기에 실제 서버 액션(Server Action)을 연결하면 됩니다.
    await new Promise((resolve) => setTimeout(resolve, 1000));

    toast.success('회원가입 성공', {
      description: '가입이 완료되었습니다!',
    });

    setIsLoading(false);
  };

  const handleGithubLogin = () => {
    toast.info('GitHub 로그인', {
      description: 'GitHub OAuth 연동이 필요합니다.',
    });
  };

  return (
    <div className="flex min-h-[calc(100vh-200px)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md animate-scale-in">
        <div className="rounded-2xl border border-border bg-card p-8 shadow-lg">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="mb-2 font-bold text-2xl">회원가입</h1>
            <p className="text-muted-foreground">
              새 계정을 만들어 블로그를 시작하세요
            </p>
          </div>

          {/* OAuth Buttons */}
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

          {/* Signup Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* 이름 입력 */}
            <div className="space-y-2">
              <Label htmlFor="name">이름</Label>
              <div className="relative">
                <User className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="name"
                  type="text"
                  placeholder="홍길동"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-12 pl-10"
                  required
                />
              </div>
            </div>

            {/* 이메일 입력 */}
            <div className="space-y-2">
              <Label htmlFor="email">이메일</Label>
              <div className="relative">
                <Mail className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 pl-10"
                  required
                />
              </div>
            </div>

            {/* 비밀번호 입력 */}
            <div className="space-y-2">
              <Label htmlFor="password">비밀번호</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 pr-10"
                  required
                  minLength={8}
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

            {/* 비밀번호 확인 입력 */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">비밀번호 확인</Label>
              <Input
                id="confirmPassword"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="h-12"
                required
              />
            </div>

            <Button type="submit" className="h-12 w-full" disabled={isLoading}>
              {isLoading ? '가입 중...' : '회원가입'}
            </Button>
          </form>

          {/* Footer */}
          <p className="mt-6 text-center text-muted-foreground text-sm">
            이미 계정이 있으신가요?{' '}
            <Link
              href="/login"
              className="font-medium text-primary hover:underline"
            >
              로그인
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
