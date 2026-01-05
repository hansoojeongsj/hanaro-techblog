'use client';

import { ArrowLeft, Eye, Loader2, Save } from 'lucide-react';
import Link from 'next/link';
import { useActionState, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { writePostAction } from '@/app/admin/posts/write/write.action';
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

interface Category {
  id: string;
  name: string;
  color: string;
}

interface WriteFormProps {
  categories: Category[];
}

export function WriteForm({ categories }: WriteFormProps) {
  const [state, formAction, isPending] = useActionState(
    writePostAction,
    undefined,
  );

  const [preview, setPreview] = useState({
    title: '',
    content: '',
    categoryId: '',
    mode: false,
  });

  // 에러 발생 시 토스트 알림
  useEffect(() => {
    if (state?.error) {
      const firstMsg = Object.values(state.error).find((msg) => msg);
      if (firstMsg) {
        toast.error('입력 오류', { description: firstMsg });
      }
    }
  }, [state]);

  // 선택된 카테고리 정보 찾기
  const selectedCategory = categories.find((c) => c.id === preview.categoryId);

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/posts"
            className="inline-flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            전체 글 목록으로
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() =>
              setPreview((prev) => ({ ...prev, mode: !prev.mode }))
            }
            type="button"
          >
            <Eye className="mr-2 h-4 w-4" />
            {preview.mode ? '편집' : '미리보기'}
          </Button>
        </div>
      </div>

      {/* 미리보기 모드 */}
      {preview.mode ? (
        <Card className="animate-fade-in">
          <CardHeader>
            <div className="mb-2 flex items-center gap-2">
              {selectedCategory && (
                <span
                  className="rounded-full px-3 py-1 font-medium text-xs"
                  style={{
                    backgroundColor: `${selectedCategory.color}20`,
                    color: selectedCategory.color,
                  }}
                >
                  {selectedCategory.name}
                </span>
              )}
            </div>
            <CardTitle className="text-3xl leading-tight">
              {preview.title || '제목 없음'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-neutral dark:prose-invert max-w-none whitespace-pre-wrap">
              {preview.content || '내용 없음'}
            </div>
          </CardContent>
        </Card>
      ) : (
        /* 편집 모드 (Form) */
        <form action={formAction} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="category">카테고리</Label>
            <input type="hidden" name="categoryId" value={preview.categoryId} />

            <Select
              onValueChange={(val) =>
                setPreview((prev) => ({ ...prev, categoryId: val }))
              }
              value={preview.categoryId}
            >
              <SelectTrigger
                className={state?.error?.categoryId ? 'border-destructive' : ''}
              >
                <SelectValue placeholder="카테고리를 선택하세요" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    <div className="flex items-center gap-2">
                      <span className="h-3 w-3 rounded-full" />
                      {category.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {state?.error?.categoryId && (
              <p className="font-medium text-destructive text-xs">
                {state.error.categoryId}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">제목</Label>
            <Input
              id="title"
              name="title"
              placeholder="글 제목을 입력하세요"
              className={`h-12 text-lg ${state?.error?.title ? 'border-destructive' : ''}`}
              value={preview.title}
              onChange={(e) =>
                setPreview((prev) => ({ ...prev, title: e.target.value }))
              }
            />
            {state?.error?.title && (
              <p className="font-medium text-destructive text-xs">
                {state.error.title}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">내용</Label>
            <Textarea
              id="content"
              name="content"
              placeholder="글 내용을 작성하세요... (Markdown 지원)"
              className={`min-h-100 resize-none font-mono text-base ${state?.error?.content ? 'border-destructive' : ''}`}
              value={preview.content}
              onChange={(e) =>
                setPreview((prev) => ({ ...prev, content: e.target.value }))
              }
            />
            {state?.error?.content && (
              <p className="font-medium text-destructive text-xs">
                {state.error.content}
              </p>
            )}
          </div>

          <div className="flex justify-end gap-3">
            <Button
              type="submit"
              size="lg"
              disabled={isPending}
              className="w-full sm:w-32"
            >
              {isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              발행하기
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
