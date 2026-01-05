'use client';

import {
  Edit,
  Loader2,
  MoreHorizontal,
  RotateCcw,
  Trash2,
  User,
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
import {
  restoreUserAction,
  withdrawUserAction,
} from '../../app/admin/admin.action';
import { Badge } from '../ui/badge';
import { AdminTableShell } from './AdminTableShell';

type UserData = {
  id: number;
  name: string;
  email: string;
  image: string | null;
  role: string;
  createdAt: Date;
  isDeleted: boolean;
  deletedAt: Date | null;
};

type UserTabProps = {
  initialUsers: UserData[];
  currentPage: number;
  totalPages: number;
};

export function UserTab({
  initialUsers,
  currentPage,
  totalPages,
}: UserTabProps) {
  const [isProcessing, setIsProcessing] = useState<number | null>(null);

  const handleAction = async (id: number, type: 'delete' | 'restore') => {
    const confirmMsg =
      type === 'delete' ? '탈퇴 처리하시겠습니까?' : '복구하시겠습니까?';
    if (!confirm(confirmMsg)) return;

    setIsProcessing(id);
    const result =
      type === 'delete'
        ? await withdrawUserAction(id)
        : await restoreUserAction(id);
    result.success
      ? toast.success(result.message)
      : toast.error(result.message);
    setIsProcessing(null);
  };

  return (
    <AdminTableShell
      searchPlaceholder="이름 또는 이메일로 검색..."
      searchParamKey="search"
      pageParamKey="page"
      currentPage={currentPage}
      totalPages={totalPages}
    >
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>회원</TableHead>
            <TableHead>이메일</TableHead>
            <TableHead>상태/권한</TableHead>
            <TableHead>가입일/탈퇴예정일</TableHead>
            <TableHead className="w-12.5" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {initialUsers.length > 0 ? (
            initialUsers.map((user) => (
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
                          user.isDeleted ? undefined : (user.image ?? undefined)
                        }
                      />
                      <AvatarFallback>
                        <User className="h-3 w-3" />
                      </AvatarFallback>
                    </Avatar>
                    <span
                      className={
                        user.isDeleted
                          ? 'text-destructive/50 italic'
                          : 'max-w-xs truncate'
                      }
                    >
                      {user.isDeleted ? '탈퇴한 사용자' : user.name}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground italic">
                  {user.isDeleted ? '알 수 없음' : user.email}
                </TableCell>
                <TableCell>
                  {user.isDeleted ? (
                    <Badge
                      variant={
                        user.email.startsWith('deleted_')
                          ? 'outline'
                          : 'secondary'
                      }
                    >
                      {user.email.startsWith('deleted_')
                        ? '탈퇴 완료'
                        : '탈퇴 유예'}
                    </Badge>
                  ) : (
                    <Badge
                      variant={user.role === 'ADMIN' ? 'default' : 'secondary'}
                    >
                      {user.role === 'ADMIN' ? '관리자' : '일반'}
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="text-muted-foreground text-xs">
                  {user.isDeleted && user.deletedAt ? (
                    user.email.startsWith('deleted_') ? (
                      <span>{formatDate(user.deletedAt)} 탈퇴됨</span>
                    ) : (
                      <span className="font-medium text-destructive">
                        {formatDate(
                          new Date(
                            new Date(user.deletedAt).getTime() +
                              7 * 24 * 60 * 60 * 1000,
                          ),
                        )}{' '}
                        삭제 예정
                      </span>
                    )
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
                        !user.email.startsWith('deleted_') && (
                          <DropdownMenuItem
                            onClick={() => handleAction(user.id, 'restore')}
                          >
                            <RotateCcw className="mr-2 h-4 w-4" /> 복구
                          </DropdownMenuItem>
                        )
                      ) : (
                        <>
                          <DropdownMenuItem
                            onClick={() => toast.info('준비 중')}
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
