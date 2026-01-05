'use client';

import {
  ChevronLeft,
  ChevronRight,
  Loader2,
  MoreHorizontal,
  Search,
  Trash2,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { deleteCommentAction } from '@/app/admin/admin.action';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface CommentWithRelation {
  id: number;
  content: string;
  isDeleted: boolean;
  createdAt: Date;
  writer: {
    name: string;
    isDeleted: boolean;
  };
  post: {
    title: string;
    isDeleted: boolean;
    id: number;
  };
}

interface CommentTabProps {
  initialComments: CommentWithRelation[];
  currentPage: number;
  totalPages: number;
}

export function CommentTab({
  initialComments,
  currentPage,
  totalPages,
}: CommentTabProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // 입력값만 관리
  const [inputValue, setInputValue] = useState(
    searchParams.get('search') || '',
  );
  const [isDeleting, setIsDeleting] = useState<number | null>(null);

  // 서버 사이드 디바운스 검색
  const debouncedSearch = useMemo(() => {
    let timer: NodeJS.Timeout;
    return (value: string) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        const params = new URLSearchParams(window.location.search);
        if (value) params.set('search', value);
        else params.delete('search');

        params.set('commentPage', '1'); // 검색 시 1페이지로
        router.push(`/admin?${params.toString()}`);
      }, 500);
    };
  }, [router]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    debouncedSearch(value);
  };

  // 서버에서 받은 데이터를 그대로 사용 (클라이언트 filter 제거)
  const comments = initialComments;

  const handleDelete = async (id: number) => {
    if (!confirm('정말 댓글을 삭제하시겠습니까?')) return;
    setIsDeleting(id);
    try {
      const result = await deleteCommentAction(id);
      if (result.success) toast.success(result.message);
    } catch {
      toast.error('삭제 실패');
    } finally {
      setIsDeleting(null);
    }
  };

  const goToPage = (page: number) => {
    const params = new URLSearchParams(window.location.search);
    params.set('commentPage', page.toString());
    router.push(`/admin?${params.toString()}`);
  };

  const formatDate = (date: Date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');

    return `${year}/${month}/${day}`;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="relative w-full max-w-sm max-sm:max-w-xs">
          <Search className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="댓글 내용으로 검색하세요."
            value={inputValue}
            onChange={handleSearch}
            className="pl-10"
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>내용</TableHead>
              <TableHead>작성자</TableHead>
              <TableHead>게시글</TableHead>
              <TableHead>작성일</TableHead>
              <TableHead className="w-12.5"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {comments.length > 0 ? (
              comments.map((comment) => (
                <TableRow key={comment.id}>
                  <TableCell className="max-w-xs truncate">
                    {comment.isDeleted ? (
                      <span className="text-destructive/50 italic">
                        삭제된 댓글
                      </span>
                    ) : (
                      comment.content
                    )}
                  </TableCell>

                  <TableCell className="text-muted-foreground">
                    {comment.writer.isDeleted ? (
                      <span className="text-destructive/50 italic">
                        탈퇴한 사용자
                      </span>
                    ) : (
                      comment.writer.name
                    )}
                  </TableCell>

                  <TableCell className="max-w-xs truncate text-muted-foreground">
                    {comment.post.isDeleted ? (
                      <span className="text-destructive/50 italic">
                        삭제된 게시글
                      </span>
                    ) : (
                      <Link
                        href={`/posts/${comment.post.id}`}
                        className="transition-colors hover:text-primary hover:underline"
                      >
                        {comment.post.title}
                      </Link>
                    )}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDate(comment.createdAt)}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          disabled={isDeleting === comment.id}
                        >
                          {isDeleting === comment.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <MoreHorizontal className="h-4 w-4" />
                          )}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => handleDelete(comment.id)}
                          disabled={comment.isDeleted}
                        >
                          <Trash2 className="mr-2 h-4 w-4" /> 삭제
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="h-40 text-center text-muted-foreground"
                >
                  <div className="flex flex-col items-center justify-center gap-2">
                    <p className="font-medium text-sm">검색 결과가 없습니다.</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-center gap-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage <= 1}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="font-medium text-sm">
          {currentPage} / {totalPages}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage >= totalPages}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
