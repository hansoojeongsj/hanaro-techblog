'use client';

import { ArrowLeft, Calendar, Clock, Heart, MessageCircle } from 'lucide-react';
import Link from 'next/link';
import { use, useState } from 'react';
import { toast } from 'sonner';

import { CategoryBadge } from '@/components/blog/CategoryBadge';
import { CommentList } from '@/components/posts/CommentList';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { categories, posts, users } from '@/data/mockData';

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

  const post = posts.find((p) => p.id === id);
  const category = post
    ? categories.find((c) => c.id === post.categoryId)
    : null;
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
            {/* 댓글 수는 CommentList 내부 데이터와 연동되지 않아 임시로 0 또는 post.comments 사용 */}
            댓글
          </Button>
        </div>
      </div>

      {/* 댓글 섹션 ✨ */}
      <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
        <CommentList />
      </div>
    </article>
  );
}
