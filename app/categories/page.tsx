import { CategoryCard } from '@/components/category/CategoryCard';
import { categories, posts } from '@/data/mockData';

const categoryDescriptions: Record<string, string> = {
  javascript: '웹의 근간이 되는 프로그래밍 언어 JavaScript에 대한 글',
  typescript: '타입 안정성을 제공하는 TypeScript 관련 글',
  react: 'Facebook이 만든 UI 라이브러리 React 관련 글',
  nextjs: 'React 기반 풀스택 프레임워크 Next.js 관련 글',
  css: '스타일링과 레이아웃에 관한 CSS 글',
  git: '버전 관리 시스템 Git 관련 글',
};

export default function CategoriesPage() {
  return (
    <div className="container mx-auto px-4 pt-12 pb-16">
      <div className="mb-12 animate-fade-in text-center">
        <h1 className="mb-4 font-bold text-3xl md:text-4xl">카테고리</h1>
        <p className="mx-auto max-w-xl text-muted-foreground">
          관심 있는 기술 분야를 선택해보세요.
        </p>
      </div>

      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {categories.map((category, index) => {
          // 각 카테고리의 최신 글 찾기
          const latestPost = posts.find((p) => p.categoryId === category.id);

          return (
            <div
              key={category.id}
              className="animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* ⭐ 여기서 CategoryCard 사용! */}
              <CategoryCard
                category={category}
                latestPostTitle={latestPost?.title}
                categoryDescriptions={categoryDescriptions[category.slug]}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
