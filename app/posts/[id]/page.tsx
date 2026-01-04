import { ArrowLeft, Calendar, Clock, MessageCircle } from 'lucide-react';
import Link from 'next/link';

import { CategoryBadge } from '@/components/blog/CategoryBadge';
import { CommentList } from '@/components/posts/CommentList';
import { PostDetailActions } from '@/components/posts/PostDetailActions';
import { PostLikeButton } from '@/components/posts/PostLikeButton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function PostDetailPage({ params }: PageProps) {
  const session = await auth();

  const { id } = await params;
  const postId = Number(id);
  const currentUserId = session?.user?.id ? Number(session.user.id) : null; // 현재 유저 ID 숫자 변환

  const post = await prisma.post.findUnique({
    where: { id: postId },
    include: {
      writer: true,
      category: true,
      comments: {
        orderBy: { createdAt: 'asc' },
        include: {
          writer: true,
        },
      },
      postLikes: {
        where: { userId: currentUserId || 0 }, // 내가 눌렀는지 확인
      },
      _count: {
        select: { postLikes: true }, // 전체 좋아요 개수만 숫자로 딱 가져옴
      },
    },
  });

  if (!post) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="font-bold text-2xl">게시글을 찾을 수 없습니다</h2>
        <Button asChild className="mt-4" variant="outline">
          <Link href="/posts">목록으로</Link>
        </Button>
      </div>
    );
  }

  // 날짜 포맷팅 헬퍼
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formattedComments = post.comments.map((c) => ({
    id: String(c.id),
    writerId: c.writerId,
    author: {
      name: c.writer.name,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${c.writer.name}`,
    },
    content: c.content,
    createdAt: c.createdAt,
    updatedAt: c.updatedAt,
    parentId: c.parentId ? String(c.parentId) : null,
    isDeleted: c.isDeleted,
  }));
  const likesCount = post._count.postLikes;
  // 2. 내가 좋아요를 눌렀는지 여부 (배열에 데이터가 있으면 누른 것)
  const isLiked = post.postLikes.length > 0;
  return (
    <article className="container mx-auto max-w-4xl px-4 py-12">
      {/* 상단 네비게이션 */}
      <div className="mb-8 flex items-center justify-between">
        <Link
          href="/posts"
          className="inline-flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          목록으로
        </Link>

        {/* 수정/삭제 메뉴 (Client Component) */}
        <PostDetailActions postId={String(post.id)} />
      </div>

      <header className="mb-8 animate-fade-in">
        {post.category && (
          <div className="mb-4">
            <CategoryBadge
              category={{
                ...post.category,
                id: String(post.category.id),
                postCount: 0,
              }}
              size="md"
            />
          </div>
        )}
        <h1 className="mb-4 font-bold text-3xl md:text-4xl">{post.title}</h1>

        <div className="flex flex-wrap items-center gap-4 text-muted-foreground text-sm">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              {/* writer 정보가 없을 수 있으니 옵셔널 체이닝 */}
              <AvatarImage
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${post.writer.name}`}
              />
              <AvatarFallback>{post.writer.name[0]}</AvatarFallback>
            </Avatar>
            <span>{post.writer.name}</span>
          </div>

          <Separator orientation="vertical" className="h-4" />

          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>{formatDate(post.createdAt)}</span>
          </div>

          {/* 수정된 적이 있으면 표시 (createdAt과 updatedAt이 다르면) */}
          {post.updatedAt.getTime() > post.createdAt.getTime() && (
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

      {/* 본문 렌더링 (Markdown 스타일 유지) */}
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
          <PostLikeButton
            postId={postId}
            initialLikes={likesCount}
            initialIsLiked={isLiked}
            userId={currentUserId}
          />

          <Button variant="outline" size="lg" className="gap-2">
            <MessageCircle className="h-5 w-5" />
            댓글
          </Button>
        </div>
      </div>

      <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
        <CommentList
          initialComments={formattedComments}
          postId={postId}
          currentUserId={Number(session?.user?.id)}
          isAdmin={session?.user?.role === 'ADMIN'}
        />
      </div>
    </article>
  );
}
