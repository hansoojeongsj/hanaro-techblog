'use client';

import { Loader2, LogIn, LogOut, Plus, User, UserX } from 'lucide-react';
import Link from 'next/link';
import { signOut } from 'next-auth/react';
import { useState } from 'react';
import { toast } from 'sonner';
import { withdrawUserAction } from '@/app/admin/admin.action';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type ProfileToggleProps = {
  isLoggedIn: boolean;
  user?: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    role: 'ADMIN' | 'USER';
  };
};

export function ProfileToggle({ isLoggedIn, user }: ProfileToggleProps) {
  const [isPending, setIsPending] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  if (!isLoggedIn || !user) {
    return (
      <Button variant="outline" size="default" asChild>
        <Link
          href="/login"
          className="flex items-center gap-2"
          prefetch={false}
        >
          <LogIn className="h-4 w-4" />
          <span>로그인</span>
        </Link>
      </Button>
    );
  }

  const handleWithdrawal = async () => {
    if (!user?.id) return;

    setIsPending(true);
    try {
      const result = await withdrawUserAction(Number(user.id));
      if (result.success) {
        toast.success('탈퇴가 완료되었습니다.');
        signOut({ callbackUrl: '/' });
        return;
      }
      toast.error(result.message);
    } catch {
      toast.error('오류가 발생했습니다.');
    } finally {
      setIsPending(false);
    }
  };

  return (
    <>
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

          {user.role === 'ADMIN' && (
            <>
              <DropdownMenuItem asChild>
                <Link href="/admin" className="cursor-pointer" prefetch={false}>
                  관리자 대시보드
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/admin/post/write" className="cursor-pointer">
                  <Plus className="mr-2 h-4 w-4" />새 글 작성
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
            </>
          )}

          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => signOut({ callbackUrl: '/' })}
          >
            <LogOut className="mr-2 h-4 w-4" />
            로그아웃
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            className="cursor-pointer text-destructive focus:text-destructive"
            onSelect={(e) => {
              e.preventDefault(); // 드롭다운이 닫히는 기본 동작 방지
              setIsDialogOpen(true); // 다이얼로그 열기
            }}
          >
            <UserX className="mr-2 h-4 w-4" />
            회원 탈퇴
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* 회원 탈퇴 확인 다이얼로그 (DropdownMenu 밖으로 분리) */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-105">
          <DialogHeader>
            <DialogTitle>정말 탈퇴하시겠습니까?</DialogTitle>
            <DialogDescription className="pt-2 text-left">
              탈퇴 신청 후 7일 이내에는 관리자를 통해 복구가 가능하며, 7일이
              지나면 모든 개인정보가 파기되어 복구가 불가능합니다.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4 flex flex-row justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              disabled={isPending}
            >
              아니요
            </Button>
            <Button
              variant="destructive" // 탈퇴는 경고의 의미로 빨간색 추천
              onClick={handleWithdrawal}
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  탈퇴 중...
                </>
              ) : (
                '네, 탈퇴하겠습니다'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
