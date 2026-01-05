import { ArrowLeft, Calendar, Clock, MessageCircle, User } from 'lucide-react';
import Link from 'next/link';
import { CategoryBadge } from '@/components/blog/CategoryBadge';
import { CommentList } from '@/components/blog/CommentList';
import { PostDetailActions } from '@/components/blog/PostDetailActions';
import { PostLikeButton } from '@/components/blog/PostLikeButton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { auth } from '@/lib/auth';
import { getPostDetail } from '../post.service';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function PostDetailPage({ params }: PageProps) {
  const session = await auth();
  const { id } = await params;
  const currentUserId = session?.user?.id ? Number(session.user.id) : null;

  // 1. 서비스에서 가공된 데이터 가져오기
  const post = await getPostDetail(Number(id), currentUserId);

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

  // 2. 권한 체크 (관리자이거나 작성자 본인이거나)
  const canManage =
    session?.user?.role === 'ADMIN' || currentUserId === post.writerId;

  return (
    <article className="container mx-auto max-w-4xl px-4 py-12">
      <div className="mb-8 flex items-center justify-between">
        <Link
          href="/posts"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> 목록으로
        </Link>
        {canManage && <PostDetailActions postId={String(post.id)} />}
      </div>

      <header className="mb-8 animate-fade-in">
        {!post.isWriterDeleted && post.category && (
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
        <h1 className="mb-4 break-all font-bold text-3xl md:text-4xl">
          {post.isWriterDeleted ? '삭제된 게시글입니다' : post.title}
        </h1>

        <div className="flex flex-wrap items-center gap-4 text-muted-foreground text-sm">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage
                src={
                  post.isWriterDeleted
                    ? undefined
                    : post.writer.image || undefined
                }
                alt={post.writer.name}
              />
              <AvatarFallback className="bg-muted">
                <User className="h-3 w-3" />
              </AvatarFallback>
            </Avatar>
            <span>
              {post.isWriterDeleted ? '탈퇴한 사용자' : post.writer.name}
            </span>
          </div>
          <Separator orientation="vertical" className="h-4" />
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>{post.formattedDate}</span>
          </div>
          {post.updatedAt > post.createdAt && (
            <>
              <Separator orientation="vertical" className="h-4" />
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>수정됨</span>
              </div>
            </>
          )}
        </div>
      </header>

      <div className="mb-12 animate-slide-up">
        <div className="break-all rounded-xl border border-border bg-card p-8 shadow-sm">
          {post.isWriterDeleted ? (
            <p className="text-muted-foreground italic">
              삭제된 게시글의 내용은 볼 수 없습니다.
            </p>
          ) : (
            <div className="whitespace-pre-wrap text-foreground/90 text-lg leading-relaxed">
              {post.content}
            </div>
          )}
        </div>
      </div>

      <div className="mb-12 flex items-center justify-between border-t py-6">
        <div className="flex items-center gap-4">
          <PostLikeButton
            postId={post.id}
            initialLikes={post.likesCount}
            initialIsLiked={post.isLiked}
            userId={currentUserId}
          />
          <Button variant="outline" size="lg" className="gap-2">
            <MessageCircle className="h-5 w-5" /> 댓글
          </Button>
        </div>
      </div>

      <div className="animate-slide-up">
        <CommentList
          initialComments={post.formattedComments}
          postId={post.id}
          currentUserId={currentUserId || 0}
          isAdmin={session?.user?.role === 'ADMIN'}
          userImage={session?.user?.image}
          userName={session?.user?.name || '사용자'}
        />
      </div>
    </article>
  );
}
