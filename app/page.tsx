'use cache';

import { ArrowRight, FileText, Sparkles } from 'lucide-react';
import { cacheLife } from 'next/cache';
import Link from 'next/link';
import { CategoryBadge } from '@/components/blog/CategoryBadge';
import { CategoryList } from '@/components/blog/CategoryList';
import { GrassCalendar } from '@/components/blog/GrassCalendar';
import { PostCard } from '@/components/blog/PostCard';
import { Button } from '@/components/ui/button';
import { getHomeData } from './(blog)/home.service';

export default async function HomePage() {
  cacheLife({ stale: 1, revalidate: 3600 });

  const { categories, recentPosts, formattedGrassData } = await getHomeData();

  return (
    <div className="min-h-screen bg-background">
      <section className="relative overflow-hidden py-20">
        <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-accent/10" />
        <div className="container relative mx-auto px-4 text-center">
          <div className="mx-auto max-w-3xl animate-fade-in">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2 font-medium text-sm">
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
            <div className="flex justify-center gap-4">
              <Button size="lg" asChild>
                <Link href="/posts">
                  글 둘러보기 <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/categories">카테고리 보기</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-muted/30 py-8">
        <div className="container mx-auto flex animate-slide-up justify-center px-4">
          <GrassCalendar data={formattedGrassData} />
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto flex animate-slide-up flex-wrap justify-center gap-3 px-4">
          {categories.map((cat) => (
            <CategoryBadge
              key={cat.id}
              category={{
                ...cat,
                id: String(cat.id),
                postCount: cat._count.posts,
              }}
              showCount
              size="lg"
            />
          ))}
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto grid grid-cols-1 gap-8 px-4 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="mb-8 flex items-center justify-between">
              <h2 className="font-bold text-2xl">최근 게시글</h2>
              <Button variant="ghost" asChild>
                <Link href="/posts" className="flex items-center gap-2">
                  전체 보기 <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>

            {recentPosts.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {recentPosts.map((post, idx) => (
                  <div
                    key={post.id}
                    className="animate-slide-up"
                    style={{ animationDelay: `${0.3 + idx * 0.1}s` }}
                  >
                    <PostCard
                      post={{
                        id: String(post.id),
                        title: post.title,
                        excerpt: post.content.substring(0, 80),
                        createdAt: post.createdAt,
                        writerId: String(post.writerId),
                        writer: post.writer.name,
                        likes: post._count.postLikes,
                        commentCount: post._count.comments,
                        writerImage: post.writer.image,
                      }}
                      category={{
                        ...post.category,
                        id: String(post.category.id),
                      }}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState />
            )}
          </div>

          <aside
            className="animate-slide-up"
            style={{ animationDelay: '0.5s' }}
          >
            <CategoryList
              categories={categories.map((c) => ({ ...c, id: String(c.id) }))}
            />
          </aside>
        </div>
      </section>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex h-75 animate-fade-in flex-col items-center justify-center rounded-lg border border-dashed bg-muted/30 text-center">
      <div className="mb-4 rounded-full bg-background p-3 shadow-sm">
        <FileText className="h-6 w-6 text-muted-foreground" />
      </div>
      <h3 className="mb-1 font-semibold text-lg">아직 게시글이 없어요</h3>
      <p className="text-muted-foreground text-sm">조금만 기다려주세요!</p>
    </div>
  );
}
