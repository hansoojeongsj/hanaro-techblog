'use client';

import { FileText, Search, X } from 'lucide-react';
import { useState } from 'react';
import { PostCard } from '@/components/blog/PostCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { categories, posts } from '@/data/mockData';

export default function PostsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // 헬퍼 함수: ID로 카테고리 객체 찾기
  const getCategoryById = (id: string) => categories.find((c) => c.id === id);

  // 임시
  // 필터링 로직 (검색어 + 카테고리)
  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      searchQuery === '' ||
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === null || post.categoryId === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // 필터 초기화
  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory(null);
  };

  return (
    <div className="container mx-auto px-4 py-12">
      {/* 헤더 영역 */}
      <div className="mb-12 animate-fade-in text-center">
        <h1 className="mb-4 font-bold text-3xl md:text-4xl">전체 게시글</h1>
        <p className="mx-auto max-w-xl text-muted-foreground">
          프론트엔드 개발에 관한 다양한 주제의 글을 읽어보세요.
        </p>
      </div>

      {/* 검색 및 필터 영역 */}
      <div className="mx-auto mb-12 max-w-4xl animate-slide-up space-y-6">
        {/* 검색바 (Shadcn Input) */}
        <div className="relative">
          <Search className="-translate-y-1/2 absolute top-1/2 left-4 h-5 w-5 text-muted-foreground" />
          <Input
            type="search"
            placeholder="제목 또는 내용으로 검색해주세요."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-14 bg-card pl-12 text-lg shadow-sm"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="-translate-y-1/2 absolute top-1/2 right-4 text-muted-foreground transition-colors hover:text-foreground"
            >
              <X className="h-5 w-5" />
              <span className="sr-only">검색어 지우기</span>
            </button>
          )}
        </div>

        {/* 카테고리 필터 버튼 그룹 */}
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-muted-foreground text-sm">카테고리:</span>
          <button
            onClick={() => setSelectedCategory(null)}
            className={`rounded-full px-3 py-1.5 font-medium text-sm transition-colors ${
              selectedCategory === null
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground'
            }`}
          >
            전체
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`rounded-full px-3 py-1.5 font-medium text-sm transition-colors ${
                selectedCategory === category.id
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* 현재 필터 상태 요약 & 초기화 버튼 */}
        {(searchQuery || selectedCategory) && (
          <div className="flex animate-fade-in items-center justify-between rounded-lg border border-border/50 bg-muted/30 p-4">
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <FileText className="h-4 w-4" />
              <span>
                총{' '}
                <span className="font-semibold text-foreground">
                  {filteredPosts.length}
                </span>
                개의 글을 찾았습니다.
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="h-8 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
            >
              <X className="mr-2 h-3.5 w-3.5" />
              필터 초기화
            </Button>
          </div>
        )}
      </div>

      {/* 게시글 그리드 (PostCard) */}
      <div className="mx-auto max-w-6xl">
        {filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredPosts.map((post, index) => (
              <div
                key={post.id}
                className="animate-slide-up"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <PostCard
                  post={post}
                  category={getCategoryById(post.categoryId)}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="animate-fade-in rounded-xl border border-border border-dashed bg-muted/10 py-24 text-center">
            <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <Search className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="mb-2 font-semibold text-xl">검색 결과가 없습니다</h3>
            <p className="mb-6 text-muted-foreground">
              다른 검색어나 카테고리를 선택해보세요.
            </p>
            <Button variant="outline" onClick={clearFilters}>
              필터 초기화
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
