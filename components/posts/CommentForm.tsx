'use client';

import { Reply } from 'lucide-react';
import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface CommentFormProps {
  onSubmit: (content: string) => void;
  replyToId?: string | null;
  onCancelReply?: () => void;
  placeholder?: string;
}

export function CommentForm({
  onSubmit,
  replyToId,
  onCancelReply,
  placeholder = '댓글을 작성하세요...',
}: CommentFormProps) {
  const [content, setContent] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    onSubmit(content);
    setContent('');
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <div className="flex gap-4">
        <Avatar className="h-10 w-10 shrink-0">
          <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=me" />
          <AvatarFallback>ME</AvatarFallback>
        </Avatar>
        <div className="flex-1 space-y-3">
          {/* 답글 작성 중 표시 */}
          {replyToId && (
            <div className="flex animate-fade-in items-center gap-2 text-muted-foreground text-sm">
              <Reply className="h-4 w-4" />
              <span>답글 작성 중...</span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={onCancelReply}
                className="h-auto p-0 text-destructive hover:bg-transparent hover:text-destructive/80"
              >
                취소
              </Button>
            </div>
          )}

          <Textarea
            placeholder={placeholder}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-25 resize-none focus-visible:ring-primary"
          />
          <div className="flex justify-end">
            <Button type="submit" disabled={!content.trim()}>
              {replyToId ? '답글 작성' : '댓글 작성'}
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}
