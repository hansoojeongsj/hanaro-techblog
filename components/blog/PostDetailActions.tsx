'use client';

import { MoreVertical, Pencil, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface PostDetailActionsProps {
  postId: string; // 게시글 ID 받기
}

export function PostDetailActions({ postId }: PostDetailActionsProps) {
  const handleDelete = () => {
    if (confirm('정말 삭제하시겠습니까?')) {
      // 나중에 실제 삭제 API 호출 로직이 들어갈 곳
      toast.success('삭제되었습니다', {
        description: '게시글이 목록에서 삭제되었습니다.',
      });
    }
  };

  return (
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
            href={`/admin/posts/edit?id=${postId}`}
            className="flex w-full items-center"
          >
            <Pencil className="mr-2 h-4 w-4" />
            수정하기
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={handleDelete}
          className="cursor-pointer text-destructive focus:text-destructive"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          삭제하기
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
