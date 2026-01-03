import { ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { CategoryBadge } from '@/components/blog/CategoryBadge';
import { CategoryList } from '@/components/blog/CategoryList';
import { GrassCalendar } from '@/components/blog/GrassCalendar';
import { PostCard } from '@/components/blog/PostCard';
import { Button } from '@/components/ui/button';
import { categories, grassData, posts } from '@/data/mockData';

export default function HomePage() {
  const recentPosts = posts.slice(0, 4);
  // 간단한 find 함수 (타입 안전하게 사용)
  const getCategoryById = (id: string) => categories.find((c) => c.id === id);

  return (
    // Layout 컴포넌트는 app/layout.tsx에 이미 있으므로 div로 시작해도 됩니다.
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20">
        <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-accent/10" />
        <div className="container relative mx-auto px-4">
          <div className="mx-auto max-w-3xl animate-fade-in text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2 font-medium text-accent-foreground text-sm">
              <Sparkles className="h-4 w-4" />
              <span>Digital Hana 路 금융서비스개발 8기</span>
            </div>
            <h1 className="mb-6 font-bold text-4xl tracking-tight md:text-5xl lg:text-6xl">
              프론트엔드 개발의
              <br />
              <span className="text-primary">모든 것</span>을 담다
            </h1>
            <p className="mx-auto mb-8 max-w-xl text-lg text-muted-foreground">
              JavaScript, TypeScript, React 등 프론트엔드 기술에 대한
              <br />
              깊이 있는 글과 실전 팁을 공유합니다.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" asChild>
                <Link href="/posts">
                  글 둘러보기
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/categories">카테고리 보기</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Grass Calendar */}
      <section className="bg-muted/30 pb-8">
        <div className="container mx-auto px-4">
          <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <GrassCalendar data={grassData} />
          </div>
        </div>
      </section>

      {/* Categories Pills */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div
            className="flex animate-slide-up flex-wrap justify-center gap-3"
            style={{ animationDelay: '0.2s' }}
          >
            {categories.map((category) => (
              <CategoryBadge
                key={category.id}
                category={category}
                showCount
                size="lg"
              />
            ))}
          </div>
        </div>
      </section>

      {/* Recent Posts & Sidebar */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <div className="mb-8 flex items-center justify-between">
                <h2 className="font-bold text-2xl">최근 게시글</h2>
                <Button variant="ghost" asChild>
                  <Link href="/posts" className="flex items-center gap-2">
                    전체 보기
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {recentPosts.map((post, index) => (
                  <div
                    key={post.id}
                    className="animate-slide-up"
                    style={{ animationDelay: `${0.3 + index * 0.1}s` }}
                  >
                    <PostCard
                      post={post}
                      category={getCategoryById(post.categoryId)}
                    />
                  </div>
                ))}
              </div>
            </div>

            <aside
              className="animate-slide-up"
              style={{ animationDelay: '0.5s' }}
            >
              <CategoryList categories={categories} />
            </aside>
          </div>
        </div>
      </section>
    </div>
  );
}
