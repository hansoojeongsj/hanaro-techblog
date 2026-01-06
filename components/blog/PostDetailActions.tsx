'use client';

import { Loader2, MoreVertical, Pencil, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { deletePostAction } from '@/app/admin/admin.action';
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type PostDetailActionsProps = {
  postId: number;
};

export function PostDetailActions({ postId }: PostDetailActionsProps) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [open, setOpen] = useState(false);

  const handleDelete = async () => {
    setIsPending(true);
    try {
      const result = await deletePostAction(postId);

      if (result.success) {
        toast.success('게시글이 삭제되었습니다.');
        setOpen(false);
        router.push('/posts');
        router.refresh();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error('게시글 삭제 에러:', error);
      toast.error('삭제 처리 중 오류가 발생했습니다.');
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Dialog open={open} onOpenChange={setOpen}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <MoreVertical className="h-5 w-5" />
              <span className="sr-only">메뉴 열기</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild className="cursor-pointer">
              <Link
                href={`/admin/post/edit?id=${postId}`}
                className="flex w-full items-center"
              >
                <Pencil className="mr-2 h-4 w-4" />
                수정하기
              </Link>
            </DropdownMenuItem>

            <DialogTrigger asChild>
              <DropdownMenuItem className="cursor-pointer text-destructive focus:text-destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                삭제하기
              </DropdownMenuItem>
            </DialogTrigger>
          </DropdownMenuContent>
        </DropdownMenu>

        <DialogContent className="sm:max-w-105">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              정말 게시글을 삭제하시겠습니까?
            </DialogTitle>
            <DialogDescription className="space-y-2 pt-2 text-left">
              정말 삭제하시겠습니까? 삭제한 게시글은 복구가 불가능합니다.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4 gap-2">
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isPending}
            >
              아니요
            </Button>
            <Button
              variant="default"
              onClick={handleDelete}
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  삭제 중...
                </>
              ) : (
                '네, 삭제하겠습니다'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
