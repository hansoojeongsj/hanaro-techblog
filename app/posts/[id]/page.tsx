'use client';

import {
  ArrowLeft,
  Calendar,
  Clock,
  Edit,
  Heart,
  MessageCircle,
  MoreHorizontal,
  Reply,
  Trash2,
} from 'lucide-react';
import Link from 'next/link';
import { use, useState } from 'react';
import { toast } from 'sonner';
import { CategoryBadge } from '@/components/blog/CategoryBadge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';

import { categories, comments, posts, users } from '@/data/mockData';

// 타입 정의
interface CommentType {
  id: string;
  postId: string;
  authorId: string;
  content: string;
  createdAt: string | Date;
  isDeleted?: boolean;
}

interface UserType {
  id: string;
  name: string;
  avatar?: string;
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function PostDetailPage({ params }: PageProps) {
  const { id } = use(params);

  const [isLiked, setIsLiked] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [replyTo, setReplyTo] = useState<string | null>(null);

  const post = posts.find((p) => p.id === id);
  const category = post
    ? categories.find((c) => c.id === post.categoryId)
    : null;
  const postComments =
    (comments as CommentType[])?.filter((c) => c.postId === id) || [];
  const author = (users as UserType[])?.find((u) => u.id === post?.authorId);

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    if (!isLiked) {
      toast('좋아요!', {
        description: '이 글을 좋아합니다.',
      });
    } else {
      toast('좋아요 취소', {
        description: '좋아요를 취소했습니다.',
      });
    }
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    toast.success(replyTo ? '답글 작성 완료' : '댓글 작성 완료', {
      description: '댓글이 성공적으로 등록되었습니다.',
    });

    setNewComment('');
    setReplyTo(null);
  };

  if (!post) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="mb-4 font-bold text-2xl">게시글을 찾을 수 없습니다</h1>
        <Button asChild>
          <Link href="/posts">목록으로 돌아가기</Link>
        </Button>
      </div>
    );
  }

  return (
    <article className="container mx-auto max-w-4xl px-4 py-12">
      <Link
        href="/posts"
        className="mb-8 inline-flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        목록으로
      </Link>

      <header className="mb-8 animate-fade-in">
        {category && (
          <div className="mb-4">
            <CategoryBadge category={category} size="md" />
          </div>
        )}
        <h1 className="mb-4 font-bold text-3xl md:text-4xl">{post.title}</h1>

        <div className="flex flex-wrap items-center gap-4 text-muted-foreground text-sm">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={author?.avatar} />
              <AvatarFallback>{author?.name?.[0] || 'U'}</AvatarFallback>
            </Avatar>
            <span>{author?.name || '알 수 없음'}</span>
          </div>

          <Separator orientation="vertical" className="h-4" />

          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>{formatDate(post.createdAt)}</span>
          </div>

          {post.updatedAt > post.createdAt && (
            <>
              <Separator orientation="vertical" className="h-4" />
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>수정: {formatDate(post.updatedAt)}</span>
              </div>
            </>
          )}
        </div>
      </header>

      {/* 본문 렌더링 */}
      <div className="prose prose-lg dark:prose-invert mb-12 max-w-none animate-slide-up">
        <div className="rounded-xl border border-border bg-card p-8">
          {post.content.split('\n').map((paragraph, idx) => {
            const key = `p-${idx}`;

            if (paragraph.startsWith('```')) return null;
            if (paragraph.startsWith('## ')) {
              return (
                <h2 key={key} className="mt-6 mb-3 font-bold text-xl">
                  {paragraph.replace('## ', '')}
                </h2>
              );
            }
            if (paragraph.startsWith('# ')) {
              return (
                <h1 key={key} className="mt-8 mb-4 font-bold text-2xl">
                  {paragraph.replace('# ', '')}
                </h1>
              );
            }
            if (paragraph.trim() === '') return <br key={key} />;

            return (
              <p key={key} className="mb-4 text-foreground/90 leading-relaxed">
                {paragraph}
              </p>
            );
          })}
        </div>
      </div>

      <div className="mb-12 flex items-center justify-between border-border border-y py-6">
        <div className="flex items-center gap-4">
          <Button
            variant={'outline'}
            size="lg"
            onClick={handleLike}
            className={`gap-2 ${
              isLiked
                ? 'border-primary/10 bg-primary/10 text-primary hover:border-primary/10 hover:bg-primary/10 hover:text-primary'
                : 'hover:border-primary/10 hover:bg-primary/10 hover:text-primary'
            }`}
          >
            <Heart className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`} />
            {post.likes + (isLiked ? 1 : 0)}
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="gap-2 hover:border-inherit hover:bg-transparent hover:text-inherit"
          >
            <MessageCircle className="h-5 w-5" />
            {postComments.length}
          </Button>
        </div>
      </div>

      <section className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
        <h2 className="mb-6 font-bold text-xl">댓글 {postComments.length}개</h2>

        <form onSubmit={handleCommentSubmit} className="mb-8">
          <div className="flex gap-4">
            <Avatar className="h-10 w-10 shrink-0">
              <AvatarImage src="[https://api.dicebear.com/7.x/avataaars/svg?seed=me](https://api.dicebear.com/7.x/avataaars/svg?seed=me)" />
              <AvatarFallback>ME</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-3">
              {replyTo && (
                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                  <Reply className="h-4 w-4" />
                  <span>답글 작성 중</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setReplyTo(null)}
                    className="h-auto p-0 text-destructive hover:bg-transparent hover:text-destructive/80"
                  >
                    취소
                  </Button>
                </div>
              )}
              <Textarea
                placeholder="댓글을 작성하세요..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="min-h-25 resize-none focus-visible:ring-primary"
              />
              <div className="flex justify-end">
                <Button type="submit" disabled={!newComment.trim()}>
                  {replyTo ? '답글 작성' : '댓글 작성'}
                </Button>
              </div>
            </div>
          </div>
        </form>

        <div className="space-y-6">
          {postComments.map((comment) => {
            const commentAuthor = (users as UserType[])?.find(
              (u) => u.id === comment.authorId,
            );

            return (
              <div key={comment.id} className="flex gap-4">
                <Avatar className="h-10 w-10 shrink-0">
                  <AvatarImage src={commentAuthor?.avatar} />
                  <AvatarFallback>
                    {commentAuthor?.name?.[0] || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="rounded-lg bg-muted/50 p-4">
                    <div className="mb-2 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">
                          {commentAuthor?.name || '알 수 없음'}
                        </span>
                        <span className="text-muted-foreground text-xs">
                          {formatDate(comment.createdAt)}
                        </span>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            수정
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="mr-2 h-4 w-4" />
                            삭제
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <p className="text-foreground/90 leading-relaxed">
                      {comment.isDeleted ? (
                        <span className="text-muted-foreground italic">
                          삭제된 댓글입니다
                        </span>
                      ) : (
                        comment.content
                      )}
                    </p>
                  </div>
                  <div className="mt-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-auto px-2 py-1 text-muted-foreground hover:text-foreground"
                      onClick={() => setReplyTo(comment.id)}
                    >
                      <Reply className="mr-1.5 h-3.5 w-3.5" />
                      답글
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </article>
  );
}
