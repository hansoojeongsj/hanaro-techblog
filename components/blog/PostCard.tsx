import { Calendar, Heart, MessageCircle, User } from 'lucide-react';
import Link from 'next/link';
import type { CategoryData, PostCardData } from '@/app/(blog)/blog.type';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { formatFullDate } from '@/lib/utils';
import { CategoryBadge } from './CategoryBadge';

type PostCardProps = {
  post: PostCardData;
  category?: CategoryData;
};

export function PostCard({ post, category }: PostCardProps) {
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
            <Calendar className="relative top-px mb-1 h-3 w-3" />
            <span>{formatFullDate(post.createdAt)}</span>
          </div>
        </div>

        <CardTitle className="line-clamp-2 text-lg transition-colors group-hover:text-primary">
          {post.title}
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1">
        <CardDescription className="line-clamp-2">
          {post.content.replace(/[#*`]/g, '').slice(0, 80)}
        </CardDescription>
      </CardContent>

      <CardFooter className="border-t pt-4">
        <div className="flex w-full items-center justify-between">
          <div className="relative z-20 flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarImage
                src={post.writer.image || undefined}
                alt={post.writer.name}
              />
              <AvatarFallback className="bg-muted">
                <User className="h-3 w-3 text-muted-foreground" />
              </AvatarFallback>
            </Avatar>
            <span className="text-[14px] text-muted-foreground">
              {post.writer.name}
            </span>
          </div>

          <div className="flex items-center gap-4 text-muted-foreground text-xs">
            <div className="flex items-center gap-1">
              <Heart className="h-3.5 w-3.5" />
              <span>{post._count.postLikes}</span>
            </div>
            <div className="flex items-center gap-1">
              <MessageCircle className="h-3.5 w-3.5" />
              <span>{post._count.comments}</span>
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
