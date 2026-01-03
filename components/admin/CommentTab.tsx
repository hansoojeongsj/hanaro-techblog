'use client';

import { Loader2, MoreHorizontal, Search, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
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
import { comments, posts, users } from '@/data/mockData';
import { deleteCommentAction } from '../../app/admin/admin.action';

export function CommentTab() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const filteredComments = comments.filter((c) =>
    c.content.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const handleDelete = async (id: string) => {
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

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="댓글 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
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
            {filteredComments.map((comment) => {
              const author = users.find((u) => u.id === comment.authorId);
              const post = posts.find((p) => p.id === comment.postId);

              return (
                <TableRow key={comment.id}>
                  <TableCell className="max-w-xs truncate">
                    {comment.isDeleted ? (
                      <span className="text-muted-foreground italic">
                        삭제된 댓글입니다
                      </span>
                    ) : (
                      comment.content
                    )}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {author?.name}
                  </TableCell>
                  <TableCell className="max-w-xs truncate text-muted-foreground">
                    {post?.title}
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
                        >
                          <Trash2 className="mr-2 h-4 w-4" /> 삭제
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
