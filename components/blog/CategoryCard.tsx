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

type Category = {
  id: string;
  name: string;
  slug: string;
  postCount: number;
  icon?: string | null;
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
              <span className="text-3xl">{category.icon || '📁'}</span>
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
          <CardDescription>{categoryDescriptions || ''}</CardDescription>
        </CardContent>

        {latestPostTitle ? (
          <CardFooter className="mt-auto border-t bg-muted/5 pt-4">
            <div className="w-full">
              <p className="mb-1 text-muted-foreground text-xs">최신 글</p>
              <p className="line-clamp-1 truncate font-medium text-sm">
                {latestPostTitle}
              </p>
            </div>
          </CardFooter>
        ) : (
          <CardFooter className="mt-auto border-t bg-muted/5 pt-4 opacity-50">
            <p className="text-muted-foreground text-xs">
              아직 작성된 글이 없습니다.
            </p>
          </CardFooter>
        )}
      </Card>
    </Link>
  );
}
