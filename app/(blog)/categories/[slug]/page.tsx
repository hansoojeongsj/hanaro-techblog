import { ArrowLeft, FileText } from 'lucide-react';
import Link from 'next/link';
import { PostCard } from '@/components/blog/PostCard';
import { Button } from '@/components/ui/button';
import { categoryIcons } from '@/lib/utils';
import { getCategoryDetailBySlug } from '../category.service';

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function CategoryPostsPage({ params }: PageProps) {
  const { slug } = await params;

  const category = await getCategoryDetailBySlug(slug);

  if (!category) {
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
  const categoryIcon = categoryIcons[slug] || '📁';

  return (
    <div className="container mx-auto px-4 pt-12 pb-16">
      <Link
        href="/categories"
        className="mb-8 inline-flex items-center gap-2 text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> 모든 카테고리
      </Link>

      <div className="mb-12 animate-fade-in text-center">
        <span className="mb-4 block text-5xl">{categoryIcon}</span>
        <h1 className="mb-4 font-bold text-3xl md:text-4xl">{category.name}</h1>
        <p className="text-muted-foreground">{category.postCount}개의 게시글</p>
      </div>

      <div className="mx-auto max-w-6xl">
        {category.posts.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {category.posts.map((post, index) => (
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
          <div className="flex h-75 animate-fade-in flex-col items-center justify-center rounded-lg border border-dashed text-center">
            <FileText className="mb-4 h-6 w-6 text-muted-foreground" />
            <h3 className="mb-1 font-semibold text-lg">아직 글이 없습니다.</h3>
          </div>
        )}
      </div>
    </div>
  );
}
