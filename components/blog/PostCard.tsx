import { Calendar, Heart, MessageCircle } from 'lucide-react';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'; // 👈 Shadcn Card 컴포넌트 불러오기
import { CategoryBadge } from './CategoryBadge';

// 타입 정의
type Post = {
  id: string;
  title: string;
  excerpt: string;
  categoryId: string;
  createdAt: Date;
  updatedAt: Date;
  authorId: string;
  likes: number;
  commentCount: number;
};

type Category = {
  id: string;
  name: string;
  slug: string;
  postCount: number;
};

interface PostCardProps {
  post: Post;
  category?: Category;
}

export function PostCard({ post, category }: PostCardProps) {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    // 1️⃣ Card: 전체 감싸기 (article 대신 사용)
    // 기존의 hover 효과나 transition은 그대로 className에 넣어줍니다.
    <Card className="group relative flex h-full flex-col overflow-hidden transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
      {/* 카드 전체 클릭 링크 (absolute position) */}
      <Link href={`/posts/${post.id}`} className="absolute inset-0 z-10">
        <span className="sr-only">상세보기</span>
      </Link>

      {/* 2️⃣ CardHeader: 카테고리, 날짜, 제목 */}
      <CardHeader>
        {/* 카테고리 & 날짜 (제목 위쪽 메타데이터) */}
        <div className="mb-2 flex items-center justify-between">
          {category ? (
            <div className="relative z-20">
              <CategoryBadge category={category} size="sm" />
            </div>
          ) : (
            <div /> /* 공간 채우기용 */
          )}
          <div className="flex items-center gap-1 text-muted-foreground text-xs">
            <Calendar className="h-3 w-3" />
            <span>{formatDate(post.createdAt)}</span>
          </div>
        </div>

        {/* 제목 (CardTitle 사용) */}
        <CardTitle className="line-clamp-2 text-lg transition-colors group-hover:text-primary">
          {post.title}
        </CardTitle>
      </CardHeader>

      {/* 3️⃣ CardContent: 내용 요약 */}
      <CardContent className="flex-1">
        {/* 요약글 (CardDescription 사용) */}
        <CardDescription className="line-clamp-2">
          {post.excerpt}
        </CardDescription>
      </CardContent>

      {/* 4️⃣ CardFooter: 작성자 및 통계 (하단 고정) */}
      <CardFooter className="border-t pt-4">
        <div className="flex w-full items-center justify-between">
          {/* Author */}
          <div className="relative z-20 flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarImage
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${post.authorId}`}
              />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
            <span className="text-muted-foreground text-xs">작성자</span>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-4 text-muted-foreground text-xs">
            <div className="flex items-center gap-1">
              <Heart className="h-3.5 w-3.5" />
              <span>{post.likes}</span>
            </div>
            <div className="flex items-center gap-1">
              <MessageCircle className="h-3.5 w-3.5" />
              <span>{post.commentCount}</span>
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
