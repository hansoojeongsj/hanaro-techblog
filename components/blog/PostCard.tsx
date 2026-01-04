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
} from '@/components/ui/card';
import { CategoryBadge } from './CategoryBadge';

export type PostCardData = {
  id: string | number;
  title: string;
  excerpt: string;
  createdAt: Date;
  writerId: string | number;
  writer: string;
  likes: number;
  commentCount: number;
};

export type CategoryData = {
  id: string | number;
  name: string;
  slug: string;
  color?: string | null;
  icon?: string | null;
};

interface PostCardProps {
  post: PostCardData;
  category?: CategoryData;
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
    <Card className="group relative flex h-full flex-col overflow-hidden transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
      <Link href={`/posts/${post.id}`} className="absolute inset-0 z-10">
        <span className="sr-only">상세보기</span>
      </Link>

      <CardHeader>
        <div className="mb-2 flex items-center justify-between">
          {category ? (
            <div className="relative z-20">
              <CategoryBadge
                category={{
                  ...category,
                  id: String(category.id),
                  postCount: 0,
                }}
                size="sm"
              />
            </div>
          ) : (
            <div />
          )}
          <div className="flex items-center gap-1 text-muted-foreground text-xs leading-none">
            <Calendar className="relative top-px h-3 w-3" />
            <span>{formatDate(post.createdAt)}</span>
          </div>
        </div>

        <CardTitle className="line-clamp-2 text-lg transition-colors group-hover:text-primary">
          {post.title}
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1">
        <CardDescription className="line-clamp-2">
          {post.excerpt}
        </CardDescription>
      </CardContent>

      <CardFooter className="border-t pt-4">
        <div className="flex w-full items-center justify-between">
          <div className="relative z-20 flex items-center gap-2">
            <Avatar className="h-6 w-6">
              {/* writerId를 사용하여 아바타 생성 */}
              <AvatarImage
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${post.writerId}`}
              />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
            <span className="text-muted-foreground text-xs">{post.writer}</span>
          </div>

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
