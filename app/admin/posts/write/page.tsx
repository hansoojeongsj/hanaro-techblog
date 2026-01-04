'use client';

import { ArrowLeft, Eye, Loader2, Save } from 'lucide-react';
import Link from 'next/link';
import { useActionState, useEffect, useState } from 'react';
import { toast } from 'sonner';

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
import { categories } from '@/data/mockData';
import { writePostAction } from './write.action';

export default function WritePage() {
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

  useEffect(() => {
    if (state?.error) {
      const firstMsg = Object.values(state.error).find((msg) => msg);
      if (firstMsg) {
        toast.error('입력 오류', { description: firstMsg });
      }
    }
  }, [state]);

  return (
    <div className="container mx-auto px-4 py-8">
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

        {/* 1. 미리보기 모드 */}
        {preview.mode ? (
          <Card>
            <CardHeader>
              <div className="mb-2 flex items-center gap-2">
                {preview.categoryId && (
                  <span
                    className="rounded-full px-3 py-1 font-medium text-xs"
                    style={{
                      // 🛠️ 수정됨: 템플릿 리터럴 사용
                      backgroundColor: `${categories.find((c) => c.id === preview.categoryId)?.color}20`,
                      color: categories.find((c) => c.id === preview.categoryId)
                        ?.color,
                    }}
                  >
                    {categories.find((c) => c.id === preview.categoryId)?.name}
                  </span>
                )}
              </div>
              <CardTitle className="text-3xl">
                {preview.title || '제목 없음'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-invert max-w-none whitespace-pre-wrap">
                {preview.content || '내용 없음'}
              </div>
            </CardContent>
          </Card>
        ) : (
          /* 2. 편집 모드 */
          <form action={formAction} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="category">카테고리</Label>
              <input
                type="hidden"
                name="categoryId"
                value={preview.categoryId}
              />

              <Select
                onValueChange={(val) =>
                  setPreview((prev) => ({ ...prev, categoryId: val }))
                }
                value={preview.categoryId}
                defaultValue={state?.data?.categoryId as string}
              >
                <SelectTrigger
                  className={
                    state?.error?.categoryId ? 'border-destructive' : ''
                  }
                >
                  <SelectValue placeholder="카테고리를 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      <div className="flex items-center gap-2">
                        <span
                          className="h-3 w-3 rounded-full"
                          style={{ backgroundColor: category.color }}
                        />
                        {category.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {state?.error?.categoryId && (
                <p className="text-destructive text-sm">
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
                className={`text-lg ${state?.error?.title ? 'border-destructive' : ''}`}
                onChange={(e) =>
                  setPreview((prev) => ({ ...prev, title: e.target.value }))
                }
                defaultValue={state?.data?.title as string}
              />
              {state?.error?.title && (
                <p className="text-destructive text-sm">{state.error.title}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">내용</Label>
              <Textarea
                id="content"
                name="content"
                placeholder="글 내용을 작성하세요... (Markdown 지원)"
                className={`min-h-100 resize-none font-mono text-sm ${state?.error?.content ? 'border-destructive' : ''}`}
                onChange={(e) =>
                  setPreview((prev) => ({ ...prev, content: e.target.value }))
                }
                defaultValue={state?.data?.content as string}
              />
              {state?.error?.content && (
                <p className="text-destructive text-sm">
                  {state.error.content}
                </p>
              )}
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={isPending}>
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
    </div>
  );
}
