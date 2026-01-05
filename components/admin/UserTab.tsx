'use client';

import {
  ChevronLeft,
  ChevronRight,
  Edit,
  Loader2,
  MoreHorizontal,
  RotateCcw,
  Search,
  Trash2,
  User,
} from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
import {
  restoreUserAction,
  withdrawUserAction,
} from '../../app/admin/admin.action';

interface UserData {
  id: number;
  name: string;
  email: string;
  image: string | null;
  role: string;
  createdAt: Date;
  isDeleted: boolean;
  deletedAt: Date | null;
}

export function UserTab({
  initialUsers,
  currentPage,
  totalPages,
}: {
  initialUsers: UserData[];
  currentPage: number;
  totalPages: number;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // 상태 관리: 입력값만 관리합니다. (필터링 상태 제거)
  const [inputValue, setInputValue] = useState(
    searchParams.get('search') || '',
  );
  const [isProcessing, setIsProcessing] = useState<number | null>(null);

  // 서버 사이드 디바운스 검색: URL 파라미터를 변경하여 서버를 호출합니다.
  const debouncedSearch = useMemo(() => {
    let timer: NodeJS.Timeout;
    return (value: string) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        const params = new URLSearchParams(window.location.search);
        if (value) params.set('search', value);
        else params.delete('search');

        params.set('page', '1'); // 검색 시 항상 1페이지로

        // shallow: false (기본값)로 전체 페이지를 서버에서 다시 가져옵니다.
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
  const users = initialUsers;

  const handleAction = async (id: number, type: 'delete' | 'restore') => {
    const confirmMsg =
      type === 'delete'
        ? '정말 회원을 탈퇴 처리하시겠습니까?\n데이터는 7일간 보관 후 완전히 삭제됩니다.'
        : '이 회원을 복구하시겠습니까?';

    if (!confirm(confirmMsg)) return;

    setIsProcessing(id);
    try {
      const result =
        type === 'delete'
          ? await withdrawUserAction(id)
          : await restoreUserAction(id);
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    } catch {
      toast.error('작업 수행 중 오류가 발생했습니다.');
    } finally {
      setIsProcessing(null);
    }
  };

  const goToPage = (page: number) => {
    const params = new URLSearchParams(window.location.search);
    params.set('page', page.toString());
    router.push(`/admin?${params.toString()}`);
  };

  const formatDate = (date: Date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');

    return `${year}/${month}/${day}`;
  };

  const getDeletionDeadline = (deletedAt: Date) => {
    const deadline = new Date(
      new Date(deletedAt).getTime() + 7 * 24 * 60 * 60 * 1000,
    );

    return formatDate(deadline);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="회원 이름 또는 이메일로 검색하세요."
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
              <TableHead>회원</TableHead>
              <TableHead>이메일</TableHead>
              <TableHead>상태/권한</TableHead>
              <TableHead>가입일/탈퇴예정일</TableHead>
              <TableHead className="w-12.5"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length > 0 ? (
              users.map((user) => (
                <TableRow
                  key={user.id}
                  className={user.isDeleted ? 'bg-muted/30' : ''}
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar
                        className={`h-8 w-8 ${user.isDeleted ? 'opacity-50 grayscale' : ''}`}
                      >
                        <AvatarImage
                          src={
                            user.isDeleted
                              ? undefined
                              : (user.image ?? undefined)
                          }
                          alt={user.name}
                        />
                        <AvatarFallback className="bg-muted">
                          <User className="h-3 w-3 text-muted-foreground" />
                        </AvatarFallback>
                      </Avatar>
                      <span
                        className={`font-medium ${user.isDeleted ? 'text-muted-foreground italic' : ''}`}
                      >
                        {user.isDeleted ? '탈퇴한 회원' : user.name}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground italic">
                    {user.isDeleted ? '알 수 없음' : user.email}
                  </TableCell>
                  <TableCell>
                    {user.isDeleted ? (
                      <Badge variant="destructive">탈퇴 유예</Badge>
                    ) : (
                      <Badge
                        variant={
                          user.role === 'ADMIN' ? 'default' : 'secondary'
                        }
                      >
                        {user.role === 'ADMIN' ? '관리자' : '일반'}
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-xs">
                    {user.isDeleted && user.deletedAt ? (
                      <span className="text-destructive">
                        {getDeletionDeadline(user.deletedAt)} 삭제 예정
                      </span>
                    ) : (
                      formatDate(user.createdAt)
                    )}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          disabled={isProcessing === user.id}
                        >
                          {isProcessing === user.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <MoreHorizontal className="h-4 w-4" />
                          )}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {user.isDeleted ? (
                          <DropdownMenuItem
                            onClick={() => handleAction(user.id, 'restore')}
                          >
                            <RotateCcw className="mr-2 h-4 w-4" /> 복구하기
                          </DropdownMenuItem>
                        ) : (
                          <>
                            <DropdownMenuItem
                              onClick={() => toast.info('수정 기능 준비 중')}
                            >
                              <Edit className="mr-2 h-4 w-4" /> 수정
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => handleAction(user.id, 'delete')}
                            >
                              <Trash2 className="mr-2 h-4 w-4" /> 탈퇴
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-40 text-center">
                  <p className="text-muted-foreground">검색 결과가 없습니다.</p>
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
        <div className="font-medium text-sm">
          {currentPage} / {totalPages}
        </div>
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
