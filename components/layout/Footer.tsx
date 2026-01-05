'use client';

import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';
import { useState } from 'react';
import { toast } from 'sonner';
import { withdrawUserAction } from '@/app/admin/admin.action';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

export default function Footer() {
  const { data: session } = useSession();
  const [isPending, setIsPending] = useState(false);
  const [open, setOpen] = useState(false);

  const handleNotImplemented = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    toast('추후 업데이트 예정입니다.');
  };

  const handleWithdrawal = async () => {
    if (!session?.user?.id) return;

    setIsPending(true);
    try {
      const result = await withdrawUserAction(Number(session.user.id));

      if (result.success) {
        toast.success(
          '탈퇴 처리가 완료되었습니다. 그동안 이용해 주셔서 감사합니다.',
        );
        setOpen(false);
        await signOut({ callbackUrl: '/' });
      } else {
        toast.error(result.message);
      }
    } catch (_) {
      toast.error('탈퇴 처리 중 오류가 발생했습니다.');
    } finally {
      setIsPending(false);
    }
  };

  return (
    <footer className="mt-auto border-border border-t bg-card">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="space-y-4 md:col-span-2">
            <h4 className="flex items-center gap-2 font-bold font-mono text-primary text-xl">
              <span>Hanaro TechBlog</span>
            </h4>
            <p className="text-muted-foreground text-sm">
              프론트엔드 개발자를 위한 기술 블로그입니다.
              <br />
              최신 웹 기술과 개발 트렌드를 공유합니다.
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold">카테고리</h4>
            <ul className="space-y-2 text-muted-foreground text-sm">
              <li>
                <Link
                  href="/categories/javascript"
                  className="transition-colors hover:text-foreground"
                >
                  JavaScript
                </Link>
              </li>
              <li>
                <Link
                  href="/categories/typescript"
                  className="transition-colors hover:text-foreground"
                >
                  TypeScript
                </Link>
              </li>
              <li>
                <Link
                  href="/categories/react"
                  className="transition-colors hover:text-foreground"
                >
                  React
                </Link>
              </li>
              <li>
                <Link
                  href="/categories/nextjs"
                  className="transition-colors hover:text-foreground"
                >
                  Next.js
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold">링크</h4>
            <ul className="space-y-2 text-muted-foreground text-sm">
              <li>
                <Link
                  href="#"
                  onClick={handleNotImplemented}
                  className="transition-colors hover:text-foreground"
                >
                  소개
                </Link>
              </li>
              <li>
                <Link
                  href="/posts"
                  className="transition-colors hover:text-foreground"
                >
                  전체 글
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  onClick={handleNotImplemented}
                  className="transition-colors hover:text-foreground"
                >
                  문의하기
                </Link>
              </li>

              {session && (
                <li>
                  <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                      <button className="transition-colors hover:text-foreground">
                        회원 탈퇴
                      </button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-105">
                      <DialogHeader>
                        <DialogTitle className="flex items-center">
                          정말 탈퇴하시겠습니까?
                        </DialogTitle>
                        <DialogDescription className="space-y-2 pt-2 text-left">
                          정말 탈퇴하시겠습니까? 탈퇴한 회원은 복구가
                          불가능합니다.
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter className="mt-4 flex flex-row justify-end gap-2">
                        <Button
                          variant="outline"
                          onClick={() => setOpen(false)}
                          disabled={isPending}
                        >
                          아니요
                        </Button>
                        <Button
                          variant="default"
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
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="mt-12 border-border border-t pt-8 text-center text-muted-foreground text-sm">
          <p>© 2026 TechBlog. Digital Hana 路 금융서비스개발 8기</p>
        </div>
      </div>
    </footer>
  );
}
