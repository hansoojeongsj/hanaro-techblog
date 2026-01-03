import { ArrowRight, FileText } from 'lucide-react';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

// 타입 정의 (나중에 types 폴더로 빼셔도 됩니다)
type Category = {
  id: string;
  name: string;
  slug: string;
  postCount: number;
};

// 아이콘 매핑이나 설명은 여기서 관리하거나, DB에서 받아오도록 확장 가능
const categoryIcons: Record<string, string> = {
  javascript: '🟨',
  typescript: '🔷',
  react: '⚛️',
  nextjs: '▲',
  css: '🎨',
  git: '🔀',
};

interface CategoryCardProps {
  category: Category;
  latestPostTitle?: string;
  categoryDescriptions?: string;
}

export function CategoryCard({
  category,
  latestPostTitle,
  categoryDescriptions,
}: CategoryCardProps) {
  return (
    <Link href={`/categories/${category.slug}`} className="block h-full">
      <Card className="group flex h-full flex-col transition-all duration-300 hover:border-primary/50 hover:shadow-md hover:shadow-primary/5">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <span className="text-3xl">
                {categoryIcons[category.slug] || '📁'}
              </span>
              <div>
                <CardTitle className="text-xl transition-colors group-hover:text-primary">
                  {category.name}
                </CardTitle>
                <div className="mt-1 flex items-center gap-1 text-muted-foreground text-sm">
                  <FileText className="h-3.5 w-3.5" />
                  <span>{category.postCount}개의 글</span>
                </div>
              </div>
            </div>
            <ArrowRight className="h-5 w-5 text-muted-foreground transition-all group-hover:translate-x-1 group-hover:text-primary" />
          </div>
        </CardHeader>

        <CardContent className="flex-1">
          <CardDescription>{categoryDescriptions}</CardDescription>
        </CardContent>

        {latestPostTitle && (
          <CardFooter className="mt-auto border-t bg-muted/5 pt-4">
            <div className="w-full">
              <p className="mb-1 text-muted-foreground text-xs">최신 글</p>
              <p className="line-clamp-1 truncate font-medium text-sm">
                {latestPostTitle}
              </p>
            </div>
          </CardFooter>
        )}
      </Card>
    </Link>
  );
}
