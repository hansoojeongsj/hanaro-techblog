'use client';

import { Reply, User } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import type { CurrentUser } from '@/app/(blog)/blog.type';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

type CommentFormProps = {
  onSubmit: (content: string) => void;
  replyToId?: string | null;
  onCancelReply?: () => void;
  placeholder?: string;
  currentUser: CurrentUser | null;
};

export function CommentForm({
  onSubmit,
  replyToId,
  onCancelReply,
  placeholder = '댓글을 작성하세요.',
  currentUser,
}: CommentFormProps) {
  const [content, setContent] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const previousReplyIdRef = useRef(replyToId);

  useEffect(() => {
    if (replyToId && previousReplyIdRef.current !== replyToId) {
      if (textareaRef.current) {
        textareaRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }
    }

    previousReplyIdRef.current = replyToId;
  }, [replyToId]);

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
          <AvatarImage
            src={currentUser?.image || undefined}
            alt={currentUser?.name || '사용자'}
          />
          <AvatarFallback className="bg-muted">
            <User className="h-5 w-5 text-muted-foreground" />
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 space-y-3">
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
            ref={textareaRef}
            name="comment"
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
