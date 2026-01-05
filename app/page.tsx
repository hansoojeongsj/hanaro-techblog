'use cache';

import { ArrowRight, FileText, Sparkles } from 'lucide-react';
import { cacheLife } from 'next/cache';
import Link from 'next/link';
import { CategoryBadge } from '@/components/blog/CategoryBadge';
import { CategoryList } from '@/components/blog/CategoryList';
import { GrassCalendar } from '@/components/blog/GrassCalendar';
import { PostCard } from '@/components/blog/PostCard';
import { Button } from '@/components/ui/button';
import { prisma } from '@/lib/prisma';

export default async function HomePage() {
  cacheLife({
    stale: 10,
    revalidate: 3600,
  });

  // 카테고리 데이터 가져오기
  const categories = await prisma.category.findMany({
    include: {
      _count: {
        select: {
          posts: { where: { isDeleted: false, writer: { isDeleted: false } } },
        },
      },
    },
    orderBy: { name: 'asc' },
  });

  // 최근 게시글 가져오기
  const recentPosts = await prisma.post.findMany({
    take: 4,
    where: {
      isDeleted: false,
      writer: { isDeleted: false },
    },
    orderBy: { createdAt: 'desc' },
    include: {
      category: true,
      writer: true,
      _count: {
        select: {
          comments: true,
          postLikes: true,
        },
      },
    },
  });

  // 잔디밭 데이터
  const allPostsDates = await prisma.post.findMany({
    select: {
      createdAt: true,
      updatedAt: true,
    },
  });

  // 데이터를 한국 시간(KST) 기준의 이름표(Key)로 가공
  const grassStatsMap = new Map<string, { created: number; updated: number }>();

  allPostsDates.forEach((post) => {
    // UTC 시간에 9시간을 더해 한국 날짜 객체를 생성한 뒤 YYYY-MM-DD 추출
    const getKSTDate = (date: Date) => {
      const kstOffset = 9 * 60 * 60 * 1000;
      return new Date(date.getTime() + kstOffset).toISOString().split('T')[0];
    };

    const createDate = getKSTDate(post.createdAt);
    const updateDate = getKSTDate(post.updatedAt);

    // 생성 수 카운트
    const cData = grassStatsMap.get(createDate) || { created: 0, updated: 0 };
    cData.created += 1;
    grassStatsMap.set(createDate, cData);

    // 수정 수 카운트 (생성일과 수정일이 다를 때만)
    if (createDate !== updateDate) {
      const uData = grassStatsMap.get(updateDate) || { created: 0, updated: 0 };
      uData.updated += 1;
      grassStatsMap.set(updateDate, uData);
    }
  });

  // GrassCalendar용 배열로 변환
  const formattedGrassData = Array.from(grassStatsMap.entries()).map(
    ([date, stats]) => ({
      date,
      count: stats.created + stats.updated,
      createdCount: stats.created,
      updatedCount: stats.updated,
      level: Math.min(Math.ceil((stats.created + stats.updated) / 2), 4),
    }),
  );

  return (
    <div className="min-h-screen bg-background">
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

      {/* 잔디 */}
      <section className="bg-muted/30 py-8">
        <div className="container mx-auto px-4">
          <div
            className="flex animate-slide-up justify-center"
            style={{ animationDelay: '0.1s' }}
          >
            <GrassCalendar data={formattedGrassData} />
          </div>
        </div>
      </section>

      {/* 카테고리 배지 섹션 */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div
            className="flex animate-slide-up flex-wrap justify-center gap-3"
            style={{ animationDelay: '0.2s' }}
          >
            {categories.map((category) => (
              <CategoryBadge
                key={category.id}
                category={{
                  ...category,
                  id: String(category.id),
                  postCount: category._count.posts,
                }}
                showCount
                size="lg"
              />
            ))}
          </div>
        </div>
      </section>

      {/* 최근 게시글 & 사이드바 */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <div className="mb-8 flex items-center justify-between">
                <h2 className="font-bold text-2xl">최근 게시글</h2>
                {recentPosts.length > 0 && (
                  <Button variant="ghost" asChild>
                    <Link href="/posts" className="flex items-center gap-2">
                      전체 보기
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                )}
              </div>

              {recentPosts.length > 0 ? (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {recentPosts.map((post, index) => (
                    <div
                      key={post.id}
                      className="animate-slide-up"
                      style={{ animationDelay: `${0.3 + index * 0.1}s` }}
                    >
                      <PostCard
                        post={{
                          id: String(post.id),
                          title: post.title,
                          excerpt:
                            post.content.length > 80
                              ? `${post.content.substring(0, 80)}...`
                              : post.content,
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
                <div className="flex h-75 animate-fade-in flex-col items-center justify-center rounded-lg border border-dashed bg-muted/30 text-center">
                  <div className="mb-4 rounded-full bg-background p-3 shadow-sm">
                    <FileText className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <h3 className="mb-1 font-semibold text-lg">
                    아직 게시글이 없어요
                  </h3>
                  <p className="mb-4 max-w-sm text-muted-foreground text-sm">
                    좋은 지식을 공유하기 위해 준비중이에요.
                    <br />
                    조금만 기다려주세요!
                  </p>
                </div>
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
        </div>
      </section>
    </div>
  );
}
