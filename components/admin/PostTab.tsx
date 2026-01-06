'use client';

import { Edit, Loader2, MoreHorizontal, Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'sonner';
import { deletePostAction } from '@/app/admin/admin.action';
import { Badge } from '@/components/ui/badge';
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

type PostWithRelation = {
  id: number;
  title: string;
  createdAt: Date;
  writer: { name: string; isDeleted: boolean };
  category: { name: string } | null;
  isDeleted: boolean;
};

type PostTabProps = {
  initialPosts: PostWithRelation[];
  currentPage: number;
  totalPages: number;
};

export function PostTab({
  initialPosts,
  currentPage,
  totalPages,
}: PostTabProps) {
  const [isDeleting, setIsDeleting] = useState<number | null>(null);

  const handleDelete = async (id: number) => {
    if (!confirm('정말 삭제하시겠습니까?')) return;
    setIsDeleting(id);
    const res = await deletePostAction(id);
    res.success ? toast.success(res.message) : toast.error('실패했습니다.');
    setIsDeleting(null);
  };

  return (
    <AdminTableShell
      searchPlaceholder="제목으로 검색..."
      searchParamKey="search"
      pageParamKey="postPage"
      currentPage={currentPage}
      totalPages={totalPages}
      extraActions={
        <Button asChild>
          <Link href="/admin/post/write">
            <Plus className="mr-1 h-4 w-4" /> 새 글
          </Link>
        </Button>
      }
    >
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>제목</TableHead>
            <TableHead>카테고리</TableHead>
            <TableHead>작성자</TableHead>
            <TableHead>작성일</TableHead>
            <TableHead className="w-12" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {initialPosts.length > 0 ? (
            initialPosts.map((post) => (
              <TableRow key={post.id}>
                <TableCell className="max-w-xs truncate font-medium">
                  {post.isDeleted ? (
                    <span className="text-destructive/50 italic">
                      삭제된 게시글
                    </span>
                  ) : (
                    <Link
                      href={`/posts/${post.id}`}
                      className="hover:text-primary hover:underline"
                    >
                      {post.title}
                    </Link>
                  )}
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">
                    {post.category?.name || '미지정'}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {post.writer.isDeleted ? '탈퇴한 사용자' : post.writer.name}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {formatDate(post.createdAt)}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        disabled={isDeleting === post.id}
                      >
                        {isDeleting === post.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <MoreHorizontal className="h-4 w-4" />
                        )}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem disabled={post.isDeleted}>
                        <Edit className="mr-2 h-4 w-4" /> 수정
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => handleDelete(post.id)}
                        disabled={post.isDeleted}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />{' '}
                        {post.isDeleted ? '삭제됨' : '삭제'}
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
