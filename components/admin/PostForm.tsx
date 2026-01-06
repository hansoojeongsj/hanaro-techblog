'use client';

import { ArrowLeft, Eye, Loader2, Save } from 'lucide-react';
import Link from 'next/link';
import { useActionState, useEffect, useState } from 'react';
import { toast } from 'sonner';
import type { CategoryData } from '@/app/(blog)/blog.type';
import type { FormState, PostFormData } from '@/app/admin/post/post.types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { CategoryBadge } from '../blog/CategoryBadge';

type PostFormProps = {
  initialData?: PostFormData;
  categories: CategoryData[];
  action: (
    state: FormState | undefined,
    formData: FormData,
  ) => Promise<FormState>;
  submitLabel: string;
};

export function PostForm({
  initialData,
  categories,
  action,
  submitLabel,
}: PostFormProps) {
  const [state, formAction, isPending] = useActionState(action, undefined);
  const [preview, setPreview] = useState({
    title: initialData?.title || '',
    content: initialData?.content || '',
    categoryId: initialData?.categoryId || '',
    isMode: false,
  });

  useEffect(() => {
    if (state?.error) {
      const msg =
        typeof state.error === 'string'
          ? state.error
          : Object.values(state.error)[0];
      if (msg) toast.error(msg);
    }
  }, [state]);

  const selectedCategory = categories.find((c) => c.id === preview.categoryId);

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-8 flex items-center justify-between">
        <Link
          href="/posts"
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> 목록으로
        </Link>
        <Button
          variant="outline"
          onClick={() => setPreview((p) => ({ ...p, isMode: !p.isMode }))}
        >
          <Eye className="mr-2 h-4 w-4" />{' '}
          {preview.isMode ? '편집' : '미리보기'}
        </Button>
      </div>

      {preview.isMode ? (
        <Card className="animate-fade-in">
          <CardHeader>
            <div className="mb-2">
              {selectedCategory && (
                <CategoryBadge
                  category={{
                    ...selectedCategory,
                  }}
                  size="sm"
                />
              )}
            </div>
            <CardTitle className="text-3xl">
              {preview.title || '제목 없음'}
            </CardTitle>
          </CardHeader>
          <CardContent className="whitespace-pre-wrap text-lg leading-relaxed">
            {preview.content || '내용 없음'}
          </CardContent>
        </Card>
      ) : (
        <form action={formAction} className="space-y-6">
          {initialData?.id && (
            <input type="hidden" name="id" value={initialData.id} />
          )}
          <div className="space-y-2">
            <Label htmlFor="category-select">카테고리</Label>
            <input type="hidden" name="categoryId" value={preview.categoryId} />
            <Select
              value={preview.categoryId}
              onValueChange={(val) =>
                setPreview((p) => ({ ...p, categoryId: val }))
              }
            >
              <SelectTrigger id="category-select">
                <SelectValue placeholder="선택하세요" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">제목</Label>
            <Input
              id="title"
              name="title"
              value={preview.title}
              onChange={(e) =>
                setPreview((p) => ({ ...p, title: e.target.value }))
              }
              className="h-12 text-lg"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">내용</Label>
            <Textarea
              id="content"
              name="content"
              value={preview.content}
              onChange={(e) =>
                setPreview((p) => ({ ...p, content: e.target.value }))
              }
              className="min-h-100 resize-none text-base"
            />
          </div>

          <Button
            type="submit"
            size="lg"
            disabled={isPending}
            className="ml-auto flex w-full sm:w-32"
          >
            {isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            {submitLabel}
          </Button>
        </form>
      )}
    </div>
  );
}
