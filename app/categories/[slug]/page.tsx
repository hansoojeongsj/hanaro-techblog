import { ArrowLeft, FileText } from 'lucide-react';
import Link from 'next/link';
import { PostCard } from '@/components/blog/PostCard';
import { Button } from '@/components/ui/button';
import { prisma } from '@/lib/prisma';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function CategoryPostsPage({ params }: PageProps) {
  // URL 파라미터(slug) 꺼내기 (await 필수!)
  const { slug } = await params;

  // DB에서 카테고리와 해당 게시글들을 한 번에 가져오기
  // (Prisma의 강력한 기능: include를 쓰면 조인(Join)해서 가져옵니다)
  const categoryData = await prisma.category.findUnique({
    where: { slug }, // URL의 slug(예: 'git')와 일치하는 카테고리 찾기
    include: {
      // 게시글 가져오기 (최신순 정렬)
      posts: {
        orderBy: { createdAt: 'desc' },
        include: {
          writer: true, // 작성자 정보 (이름 필요)
          category: true, // 게시글의 카테고리 정보 (색상 등)
          _count: {
            select: {
              comments: true,
              postLikes: true,
            },
          },
        },
      },
      _count: {
        select: { posts: true },
      },
    },
  });

  // 예외 처리: DB에 해당 카테고리가 없을 때
  if (!categoryData) {
    // Next.js 기본 404 페이지를 띄우거나, 아래 커스텀 UI를 리턴해도 됩니다.
    // 여기서는 요청하신 스타일대로 리턴합니다.
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="mb-4 font-bold text-2xl">
          존재하지 않는 카테고리입니다.
        </h1>
        <Button variant="outline" asChild>
          <Link href="/categories">카테고리 목록으로</Link>
        </Button>
      </div>
    );
  }

  const posts = categoryData.posts.map((post) => ({
    ...post,
    id: String(post.id),
    // 본문 요약 (80자)
    excerpt:
      post.content.length > 80
        ? `${post.content.substring(0, 80)}...`
        : post.content,
    createdAt: post.createdAt,
    writerId: String(post.writerId),
    writer: post.writer.name, // 작성자 이름
    likes: post._count.postLikes,
    commentCount: post._count.comments,
  }));

  // 카테고리 정보도 가공
  const category = {
    ...categoryData,
    id: String(categoryData.id),
    postCount: categoryData._count.posts,
  };

  return (
    <div className="container mx-auto px-4 pt-12 pb-16">
      {/* Back Button */}
      <Link
        href="/categories"
        className="mb-8 inline-flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        모든 카테고리
      </Link>

      {/* Header */}
      <div className="mb-12 animate-fade-in text-center">
        <span className="mb-4 block text-5xl">{category.icon || '📁'}</span>
        <h1 className="mb-4 font-bold text-3xl md:text-4xl">{category.name}</h1>
        <p className="text-muted-foreground">{category.postCount}개의 게시글</p>
      </div>

      {/* Posts Grid */}
      <div className="mx-auto max-w-6xl">
        {posts.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post, index) => (
              <div
                key={post.id}
                className="animate-slide-up"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <PostCard post={post} category={category} />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex h-75 animate-fade-in flex-col items-center justify-center rounded-lg border border-dashed bg-muted/30 text-center">
            <div className="mb-4 rounded-full bg-background p-3 shadow-sm">
              <FileText className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="mb-1 font-semibold text-lg">
              아직 <strong>{category.name}</strong> 관련 글이 없습니다.
            </h3>
            <p className="mb-4 max-w-sm text-muted-foreground text-sm">
              조금만 기다려주세요!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
