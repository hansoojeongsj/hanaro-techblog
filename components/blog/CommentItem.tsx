'use client';

import {
  Check,
  CornerDownRight,
  Edit,
  MoreVertical,
  Reply,
  Trash2,
  User,
  X,
} from 'lucide-react';
import { useState } from 'react';
import type { Comment, CurrentUser } from '@/app/(blog)/blog.type';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Textarea } from '@/components/ui/textarea';
import { cn, formatFullDate } from '@/lib/utils';

type CommentItemProps = {
  comment: Comment;
  onReply: (id: number) => void;
  onEdit: (id: number, newContent: string) => void;
  onDelete: (id: number) => void;
  isReply?: boolean;
  currentUser: CurrentUser | null;
  onEditStart?: () => void;
};

export function CommentItem({
  comment,
  onReply,
  onEdit,
  onDelete,
  isReply = false,
  currentUser,
  onEditStart,
}: CommentItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);

  const isUserMasked = comment.isWriterDeleted;
  const isContentMasked = comment.isDeleted || comment.isWriterDeleted;

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

  const handleStartEdit = () => {
    if (onEditStart) onEditStart();
    setIsEditing(true);
  };

  const canManage =
    currentUser?.role === 'ADMIN' || comment.writer.id === currentUser?.id;

  const isUpdated =
    comment.updatedAt &&
    new Date(comment.updatedAt).getTime() >
      new Date(comment.createdAt).getTime();

  return (
    <div className={cn('group flex gap-4', isReply && 'pl-10 md:pl-14')}>
      {isReply && (
        <CornerDownRight className="mt-2 h-5 w-5 shrink-0 text-muted-foreground/50" />
      )}

      <Avatar className="h-10 w-10 shrink-0">
        <AvatarImage
          src={isUserMasked ? undefined : comment.writer.image || undefined}
        />
        <AvatarFallback>
          <User className="h-3 w-3 text-muted-foreground" />
        </AvatarFallback>
      </Avatar>

      <div className="flex-1">
        <div className="rounded-lg border border-transparent bg-muted/50 p-4 transition-colors group-hover:border-border">
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span
                className={cn(isUserMasked && 'text-muted-foreground italic')}
              >
                {isUserMasked ? '탈퇴한 사용자' : comment.writer.name}
              </span>
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    'text-muted-foreground text-xs',
                    !isContentMasked && isUpdated && 'hidden sm:inline',
                  )}
                >
                  {formatFullDate(comment.createdAt)}
                </span>
                {!isContentMasked && isUpdated && comment.updatedAt && (
                  <span className="flex items-center text-muted-foreground text-xs before:content-['•'] sm:before:mr-1">
                    <span className="mr-1 sm:inline">수정:</span>
                    {formatFullDate(comment.updatedAt)}
                  </span>
                )}
              </div>
            </div>

            {!isContentMasked && !isEditing && canManage && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleStartEdit}>
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
          {isContentMasked ? (
            <span className="text-muted-foreground italic">
              삭제된 댓글입니다
            </span>
          ) : isEditing ? (
            <div className="space-y-2">
              <Textarea
                name="comment"
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
            <p className="whitespace-pre-wrap break-all text-foreground/90 leading-relaxed">
              {comment.content}
            </p>
          )}
        </div>

        {!isContentMasked && !isReply && !isEditing && (
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
