'use client';

import { Loader2, MoreHorizontal, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'sonner';
import { deleteCommentAction } from '@/app/admin/admin.action';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatDate } from '@/lib/utils';
import { AdminTableShell } from './AdminTableShell';

type CommentWithRelation = {
  id: number;
  content: string;
  isDeleted: boolean;
  createdAt: Date;
  writer: { name: string; isDeleted: boolean };
  post: { title: string; isDeleted: boolean; id: number };
};

type CommentTabProps = {
  initialComments: CommentWithRelation[];
  currentPage: number;
  totalPages: number;
};

export function CommentTab({
  initialComments,
  currentPage,
  totalPages,
}: CommentTabProps) {
  const [isDeleting, setIsDeleting] = useState<number | null>(null);

  const handleDelete = async (id: number) => {
    if (!confirm('정말 댓글을 삭제하시겠습니까?')) return;
    setIsDeleting(id);
    const result = await deleteCommentAction(id);
    if (result.success) toast.success(result.message);
    setIsDeleting(null);
  };

  return (
    <AdminTableShell
      searchPlaceholder="댓글 내용으로 검색하세요."
      searchParamKey="search"
      pageParamKey="commentPage"
      currentPage={currentPage}
      totalPages={totalPages}
    >
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>내용</TableHead>
            <TableHead>작성자</TableHead>
            <TableHead>게시글</TableHead>
            <TableHead>작성일</TableHead>
            <TableHead className="w-12.5" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {initialComments.length > 0 ? (
            initialComments.map((comment) => (
              <TableRow key={comment.id}>
                <TableCell className="max-w-xs truncate">
                  {comment.isDeleted || comment.writer.isDeleted ? (
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
                결과가 없습니다.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </AdminTableShell>
  );
}
