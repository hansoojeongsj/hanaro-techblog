'use client';

import {
  Check,
  CornerDownRight,
  Edit,
  MoreHorizontal,
  Reply,
  Trash2,
  X,
} from 'lucide-react';
import { useState } from 'react'; // ✨ useState 추가
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Textarea } from '@/components/ui/textarea'; // ✨ Textarea 추가
import { cn } from '@/lib/utils';

export interface CommentType {
  id: string;
  author: { name: string; avatar?: string };
  content: string;
  createdAt: Date | string;
  isDeleted?: boolean;
  parentId?: string | null;
}

interface CommentItemProps {
  comment: CommentType;
  onReply: (id: string) => void;
  onEdit: (id: string, newContent: string) => void; // ✨ 추가
  onDelete: (id: string) => void; // ✨ 추가
  isReply?: boolean;
}

export function CommentItem({
  comment,
  onReply,
  onEdit,
  onDelete,
  isReply = false,
}: CommentItemProps) {
  const [isEditing, setIsEditing] = useState(false); // 수정 모드 상태
  const [editContent, setEditContent] = useState(comment.content); // 수정 내용 상태

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // 수정 완료 버튼 클릭 시
  const handleSaveEdit = () => {
    if (editContent.trim()) {
      onEdit(comment.id, editContent);
      setIsEditing(false);
    }
  };

  // 수정 취소 버튼 클릭 시
  const handleCancelEdit = () => {
    setEditContent(comment.content); // 원래 내용으로 복구
    setIsEditing(false);
  };

  return (
    <div className={cn('group flex gap-4', isReply && 'pl-10 md:pl-14')}>
      {isReply && (
        <CornerDownRight className="mt-2 h-5 w-5 shrink-0 text-muted-foreground/50" />
      )}

      <Avatar className="h-10 w-10 shrink-0">
        <AvatarImage src={comment.author.avatar} />
        <AvatarFallback>{comment.author.name[0]}</AvatarFallback>
      </Avatar>

      <div className="flex-1">
        <div className="rounded-lg border border-transparent bg-muted/50 p-4 transition-colors group-hover:border-border">
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-medium">{comment.author.name}</span>
              <span className="text-muted-foreground text-xs">
                {formatDate(comment.createdAt)}
              </span>
            </div>

            {/* 삭제된 댓글이 아니고, 수정 모드가 아닐 때만 드롭다운 표시 */}
            {!comment.isDeleted && !isEditing && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 opacity-0 transition-opacity group-hover:opacity-100"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setIsEditing(true)}>
                    {' '}
                    {/* ✨ 수정 모드 켜기 */}
                    <Edit className="mr-2 h-4 w-4" /> 수정
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-destructive"
                    onClick={() => onDelete(comment.id)} // ✨ 삭제 호출
                  >
                    <Trash2 className="mr-2 h-4 w-4" /> 삭제
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          {/* ✨ 내용 부분 분기 처리 */}
          {comment.isDeleted ? (
            <span className="text-muted-foreground italic">
              삭제된 댓글입니다
            </span>
          ) : isEditing ? (
            // ✏️ 수정 모드일 때: Textarea + 버튼
            <div className="space-y-2">
              <Textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="min-h-[80px] resize-none bg-background"
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
            // 📄 일반 모드일 때: 텍스트
            <p className="whitespace-pre-wrap text-foreground/90 leading-relaxed">
              {comment.content}
            </p>
          )}
        </div>

        {/* 답글 버튼 (수정 중이거나 삭제된 댓글에는 안 보임) */}
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
