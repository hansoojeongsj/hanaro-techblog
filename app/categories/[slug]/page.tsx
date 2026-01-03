import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { PostCard } from '@/components/blog/PostCard'; // 이미 있는 컴포넌트
import { Button } from '@/components/ui/button';
import { categories, posts } from '@/data/mockData';

// 아이콘 매핑 (필요하다면 util로 빼도 됨)
const categoryIcons: Record<string, string> = {
  javascript: '🟨',
  typescript: '🔷',
  react: '⚛️',
  nextjs: '▲',
  css: '🎨',
  git: '🔀',
};

// Next.js 15+ 에서는 params가 Promise입니다.
interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function CategoryPostsPage({ params }: PageProps) {
  // 1. URL 파라미터(slug) 꺼내기 (await 필수!)
  const { slug } = await params;

  // 2. 데이터 찾기
  const category = categories.find((c) => c.slug === slug);

  // 3. 해당 카테고리의 글만 필터링
  const categoryPosts = posts.filter((p) =>
    category ? p.categoryId === category.id : false,
  );

  // 4. 예외 처리: 카테고리가 없을 때
  if (!category) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="mb-4 font-bold text-2xl">카테고리를 찾을 수 없습니다</h1>
        <Button asChild>
          <Link href="/categories">카테고리 목록으로</Link>
        </Button>
      </div>
    );
  }

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
        <span className="mb-4 block text-5xl">
          {categoryIcons[category.slug] || '📁'}
        </span>
        <h1 className="mb-4 font-bold text-3xl md:text-4xl">{category.name}</h1>
        <p className="text-muted-foreground">
          {categoryPosts.length}개의 게시글
        </p>
      </div>

      {/* Posts Grid */}
      <div className="mx-auto max-w-6xl">
        {categoryPosts.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {categoryPosts.map((post, index) => (
              <div
                key={post.id}
                className="animate-slide-up"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                {/* PostCard는 이미 있으니까 바로 사용! 
                  category prop을 넘겨주면 카드 상단에 뱃지가 뜹니다.
                */}
                <PostCard post={post} category={category} />
              </div>
            ))}
          </div>
        ) : (
          // 글이 없을 때 표시할 UI
          <div className="pt-5 pb-20 text-center">
            <p className="mb-4 text-muted-foreground">
              이 카테고리에 게시글이 없습니다.
            </p>
            <Button variant="outline" asChild>
              <Link href="/posts">전체 글 보기</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
