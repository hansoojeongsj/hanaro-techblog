'use client';

import { LogIn, LogOut, Plus, User } from 'lucide-react'; // LogIn, LogOut 아이콘 추가
import Link from 'next/link';
import { signOut } from 'next-auth/react'; // 로그아웃 기능 추가
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
    role: 'ADMIN' | 'USER';
  };
}

export function ProfileToggle({ isLoggedIn, user }: ProfileToggleProps) {
  // 로그인 안 했을 때
  if (!isLoggedIn || !user) {
    return (
      <Button variant="outline" size="default" asChild>
        <Link href="/login" className="flex items-center gap-2">
          <LogIn className="h-4 w-4" />
          <span>로그인</span>
        </Link>
      </Button>
    );
  }

  // 로그인 했을 때
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-9 w-9 rounded-full">
          <Avatar className="h-9 w-9">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback className="bg-muted">
              <User className="h-5 w-5 text-muted-foreground" />
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-56" align="end">
        <div className="flex flex-col gap-1 p-2">
          <p className="font-medium leading-none">{user.name}</p>
          <p className="text-muted-foreground text-xs">{user.email}</p>
        </div>

        <DropdownMenuSeparator />

        {/* 관리자일 때만 보이는 메뉴 */}
        {user.role === 'ADMIN' && (
          <>
            <DropdownMenuItem asChild>
              <Link href="/admin" className="cursor-pointer">
                관리자 대시보드
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem asChild>
              <Link href="/admin/posts/write" className="cursor-pointer">
                <Plus className="mr-2 h-4 w-4" />새 글 작성
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        )}

        {/* 로그아웃 버튼 (onClick 이벤트 연결) */}
        <DropdownMenuItem
          className="cursor-pointer text-destructive focus:text-destructive"
          onClick={() => signOut({ callbackUrl: '/' })}
        >
          <LogOut className="mr-2 h-4 w-4" />
          로그아웃
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
