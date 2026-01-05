'use client';

import { FileText, Search, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  type CategoryData,
  PostCard,
  type PostCardData,
} from '@/components/blog/PostCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export interface PostForList extends PostCardData {
  content: string;
  categoryId: string;
  category: CategoryData;
}

interface PostsClientProps {
  initialPosts: PostForList[];
  categories: { id: string; name: string }[];
  searchQuery: string;
}

export function PostsClient({
  initialPosts,
  categories,
  searchQuery,
}: PostsClientProps) {
  const router = useRouter();
  const [localQuery, setLocalQuery] = useState(searchQuery);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams();
      if (localQuery) params.set('q', localQuery);
      router.push(`/posts?${params.toString()}`);
    }, 500);

    return () => clearTimeout(timer);
  }, [localQuery, router]);

  const filteredPosts = initialPosts.filter((post) => {
    return selectedCategory === null || post.categoryId === selectedCategory;
  });

  const clearFilters = () => {
    setLocalQuery('');
    setSelectedCategory(null);
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-12 text-center">
        <h1 className="mb-4 font-bold text-3xl">전체 게시글</h1>
        <p className="mx-auto max-w-xl text-muted-foreground">
          프론트엔드 개발에 관한 다양한 주제의 글을 읽어보세요.
        </p>
      </div>

      <div className="mx-auto mb-12 max-w-4xl space-y-6">
        <div className="relative">
          <Search className="-translate-y-1/2 absolute top-1/2 left-4 h-5 w-5 text-muted-foreground" />
          <Input
            type="search"
            placeholder="제목 또는 내용으로 검색해주세요."
            value={localQuery}
            onChange={(e) => setLocalQuery(e.target.value)}
            className="h-14 bg-card pl-12 text-lg shadow-sm"
          />
          {localQuery && (
            <button
              onClick={() => setLocalQuery('')}
              className="-translate-y-1/2 absolute top-1/2 right-4 text-muted-foreground transition-colors hover:text-foreground"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <span className="text-muted-foreground text-sm">카테고리:</span>
          <button
            onClick={() => setSelectedCategory(null)}
            className={`rounded-full px-4 py-1.5 font-medium text-sm transition-colors ${
              selectedCategory === null
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            전체
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`rounded-full px-4 py-1.5 font-medium text-sm transition-colors ${
                selectedCategory === category.id
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {(searchQuery || selectedCategory) && (
          <div className="fade-in flex animate-in items-center justify-between rounded-lg border border-border/50 bg-muted/30 p-4">
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <FileText className="h-4 w-4" />
              <span>
                총{' '}
                <span className="font-semibold text-foreground">
                  {filteredPosts.length}
                </span>{' '}
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

      <div className="mx-auto max-w-6xl">
        {filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredPosts.map((post) => (
              <PostCard key={post.id} post={post} category={post.category} />
            ))}
          </div>
        ) : (
          <div className="zoom-in-95 animate-in rounded-xl border border-border border-dashed bg-muted/10 py-24 text-center duration-300">
            <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <Search className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="mb-2 font-semibold text-lg">검색 결과가 없습니다</h3>
            <p className="mb-6 text-muted-foreground">
              다른 검색어나 카테고리를 선택해보세요.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
