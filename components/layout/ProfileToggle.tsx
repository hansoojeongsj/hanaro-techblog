'use client';

import { Plus, User } from 'lucide-react';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface ProfileToggleProps {
  isLoggedIn: boolean;
  user?: {
    name: string;
    email: string;
    avatar?: string;
    role: 'admin' | 'user';
  };
}

export function ProfileToggle({ isLoggedIn, user }: ProfileToggleProps) {
  if (!isLoggedIn || !user) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon">
            <User className="h-5 w-5" />
            <span className="sr-only">로그인</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem asChild>
            <Link href="/login">로그인이 필요합니다</Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  // ✅ 로그인 한 경우
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-9 w-9 rounded-full">
          <Avatar className="h-9 w-9">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback>{user.name[0]}</AvatarFallback>
          </Avatar>
          <span className="sr-only">사용자 메뉴</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-56" align="end">
        <div className="flex flex-col gap-1 p-2">
          <p className="font-medium leading-none">{user.name}</p>
          <p className="text-muted-foreground text-xs">{user.email}</p>
        </div>

        <DropdownMenuSeparator />

        {user.role === 'admin' && (
          <>
            <DropdownMenuItem asChild>
              <Link href="/admin">관리자 페이지</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/admin/posts/write">
                <Plus className="h-4 w-4" />새 글 작성
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        )}

        <DropdownMenuItem className="text-destructive">
          로그아웃
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
