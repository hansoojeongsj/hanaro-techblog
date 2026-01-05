'use client';

import {
  Check,
  CornerDownRight,
  Edit,
  MoreVertical,
  Reply,
  Trash2,
  X,
} from 'lucide-react';
import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

export interface CommentType {
  id: string;
  writerId: number;
  author: { name: string; avatar?: string };
  content: string;
  createdAt: Date | string;
  updatedAt?: Date | string;
  isDeleted?: boolean;
  parentId?: string | null;
}

interface CommentItemProps {
  comment: CommentType;
  onReply: (id: string) => void;
  onEdit: (id: string, newContent: string) => void;
  onDelete: (id: string) => void;
  isReply?: boolean;
  currentUserId: number;
  isAdmin: boolean;
}

export function CommentItem({
  comment,
  onReply,
  onEdit,
  onDelete,
  isReply = false,
  currentUserId,
  isAdmin,
}: CommentItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit', // 시간까지 보이면 더 정확하겠죠?
      minute: '2-digit',
    });
  };

  const handleSaveEdit = () => {
    if (editContent.trim()) {
      onEdit(comment.id, editContent);
      setIsEditing(false);
    }
  };

  const handleCancelEdit = () => {
    setEditContent(comment.content);
    setIsEditing(false);
  };

  const canManage = isAdmin || Number(comment.writerId) === currentUserId;
  const isUpdated =
    comment.updatedAt &&
    new Date(comment.updatedAt).getTime() >
      new Date(comment.createdAt).getTime();

  return (
    <div className={cn('group flex gap-4', isReply && 'pl-10 md:pl-14')}>
      {isReply && (
        <CornerDownRight className="mt-2 h-5 w-5 shrink-0 text-muted-foreground/50" />
      )}

      {/* 아바타 처리: 삭제되면 기본 아이콘 표시 */}
      <Avatar className="h-10 w-10 shrink-0">
        <AvatarImage
          src={comment.isDeleted ? undefined : comment.author.avatar}
        />
        <AvatarFallback>
          {comment.isDeleted ? '?' : comment.author.name[0]}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1">
        <div className="rounded-lg border border-transparent bg-muted/50 p-4 transition-colors group-hover:border-border">
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span
                className={cn(comment.isDeleted && 'text-muted-foreground')}
              >
                {comment.isDeleted ? '(알 수 없음)' : comment.author.name}
              </span>
              <span className="text-muted-foreground text-xs">
                {formatDate(comment.createdAt)}
              </span>
              {!comment.isDeleted && isUpdated && comment.updatedAt && (
                <span className="flex gap-1 text-muted-foreground text-xs before:mr-1 before:content-['•']">
                  <span>수정: </span>
                  {formatDate(comment.updatedAt)}
                </span>
              )}
            </div>

            {/* canManage가 true일 때만 수정/삭제 메뉴 노출 */}
            {!comment.isDeleted && !isEditing && canManage && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setIsEditing(true)}>
                    <Edit className="mr-2 h-4 w-4" /> 수정
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-destructive"
                    onClick={() => onDelete(comment.id)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" /> 삭제
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          {/* 내용 처리 */}
          {comment.isDeleted ? (
            <span className="text-muted-foreground italic">
              삭제된 댓글입니다
            </span>
          ) : isEditing ? (
            <div className="space-y-2">
              <Textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="min-h-20 resize-none bg-background"
              />
              <div className="flex justify-end gap-2">
                <Button size="sm" variant="ghost" onClick={handleCancelEdit}>
                  <X className="mr-1 h-4 w-4" /> 취소
                </Button>
                <Button size="sm" onClick={handleSaveEdit}>
                  <Check className="mr-1 h-4 w-4" /> 저장
                </Button>
              </div>
            </div>
          ) : (
            <p className="whitespace-pre-wrap text-foreground/90 leading-relaxed">
              {comment.content}
            </p>
          )}
        </div>

        {/* 답글 버튼 */}
        {!comment.isDeleted && !isReply && !isEditing && (
          <div className="mt-2">
            <Button
              variant="ghost"
              size="sm"
              className="h-auto px-2 py-1 text-muted-foreground hover:text-foreground"
              onClick={() => onReply(comment.id)}
            >
              <Reply className="mr-1.5 h-3.5 w-3.5" />
              답글
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
