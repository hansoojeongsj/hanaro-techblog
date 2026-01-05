'use client';

import {
  ChevronLeft,
  ChevronRight,
  Edit,
  Loader2,
  MoreHorizontal,
  Plus,
  Search,
  Trash2,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
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
import { deletePostAction } from '../../app/admin/admin.action';

interface PostWithRelation {
  id: number;
  title: string;
  createdAt: Date;
  writer: { name: string; isDeleted: boolean };
  category: { name: string } | null;
  isDeleted: boolean;
}

export function PostTab({
  initialPosts,
  currentPage,
  totalPages,
}: {
  initialPosts: PostWithRelation[];
  currentPage: number;
  totalPages: number;
}) {
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

        params.set('postPage', '1'); // 검색 시 1페이지로 리셋
        router.push(`/admin?${params.toString()}`);
      }, 500);
    };
  }, [router]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    debouncedSearch(value);
  };

  // 서버에서 받은 데이터를 그대로 사용
  const posts = initialPosts;

  const handleDelete = async (id: number) => {
    if (!confirm('정말 게시글을 삭제하시겠습니까?')) return;
    setIsDeleting(id);
    try {
      const result = await deletePostAction(id);
      if (result.success) toast.success(result.message);
    } catch {
      toast.error('삭제 실패');
    } finally {
      setIsDeleting(null);
    }
  };

  const handleEditClick = () => {
    toast.info('수정 기능은 추후 업데이트 예정입니다.');
  };

  const goToPage = (page: number) => {
    const params = new URLSearchParams(window.location.search);
    params.set('postPage', page.toString());
    router.push(`/admin?${params.toString()}`);
  };

  const formatDate = (date: Date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    // 월과 일이 한 자리일 경우 앞에 0을 붙여줍니다.
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');

    return `${year}/${month}/${day}`;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="relative mr-2 w-full max-w-sm">
          <Search className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="제목으로 검색하세요."
            value={inputValue}
            onChange={handleSearch}
            className="pl-10"
          />
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={() => router.push('/admin/posts/write')}>
            <Plus className="mr-1 h-4 w-4" /> 새 글 작성
          </Button>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>제목</TableHead>
              <TableHead>카테고리</TableHead>
              <TableHead>작성자</TableHead>
              <TableHead>작성일</TableHead>
              <TableHead className="w-12.5"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {posts.length > 0 ? (
              posts.map((post) => (
                <TableRow key={post.id}>
                  <TableCell className="max-w-xs truncate font-medium">
                    {post.isDeleted ? (
                      <span className="text-destructive/50 italic">
                        삭제된 게시글
                      </span>
                    ) : (
                      <Link
                        href={`/posts/${post.id}`}
                        className="transition-colors hover:text-primary hover:underline"
                      >
                        {post.title}
                      </Link>
                    )}
                  </TableCell>

                  <TableCell>
                    {!post.isDeleted && (
                      <Badge variant="secondary">
                        {post.category?.name || '미지정'}
                      </Badge>
                    )}
                  </TableCell>

                  <TableCell className="text-muted-foreground">
                    {post.writer.isDeleted ? (
                      <span className="text-destructive/50 italic">
                        탈퇴한 사용자
                      </span>
                    ) : (
                      post.writer.name
                    )}
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
                        <DropdownMenuItem
                          onClick={handleEditClick}
                          disabled={post.isDeleted}
                        >
                          <Edit className="mr-2 h-4 w-4" /> 수정
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => handleDelete(post.id)}
                          disabled={post.isDeleted}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          {post.isDeleted ? '삭제됨' : '삭제'}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-40 text-center">
                  <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
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
