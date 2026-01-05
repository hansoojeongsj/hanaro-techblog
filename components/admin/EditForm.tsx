'use client';

import { ArrowLeft, Loader2, Save } from 'lucide-react';
import Link from 'next/link';
import { useActionState, useState } from 'react';
import {
  type EditState,
  updatePostAction,
} from '@/app/admin/posts/edit/edit.action';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Textarea } from '../ui/textarea';

export interface Category {
  id: string;
  name: string;
  color?: string;
}

export interface PostInitialData {
  id: string;
  title: string;
  content: string;
  categoryId: string;
}

interface EditFormProps {
  initialPost: PostInitialData;
  categories: Category[];
}

export function EditForm({ initialPost, categories }: EditFormProps) {
  const [state, formAction, isPending] = useActionState<EditState, FormData>(
    updatePostAction,
    { error: undefined, data: undefined },
  );

  const [previewMode, setPreviewMode] = useState<boolean>(false);
  const [formData, setFormData] = useState<PostInitialData>(initialPost);

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-8 flex items-center justify-between">
        <Link
          href={`/posts/${initialPost.id}`}
          className="flex items-center gap-2 text-muted-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> 돌아가기
        </Link>
        <Button variant="outline" onClick={() => setPreviewMode(!previewMode)}>
          {previewMode ? '편집 모드' : '미리보기'}
        </Button>
      </div>

      {previewMode ? (
        <Card>
          <CardHeader>
            <CardTitle>{formData.title}</CardTitle>
          </CardHeader>
          <CardContent className="prose dark:prose-invert">
            <div className="whitespace-pre-wrap">{formData.content}</div>
          </CardContent>
        </Card>
      ) : (
        <form action={formAction} className="space-y-6">
          <input type="hidden" name="id" value={initialPost.id} />
          <input type="hidden" name="categoryId" value={formData.categoryId} />

          <div className="space-y-2">
            <Label>카테고리</Label>
            <Select
              value={formData.categoryId}
              onValueChange={(val: string) =>
                setFormData({ ...formData, categoryId: val })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {state?.error &&
              typeof state.error === 'object' &&
              state.error.categoryId && (
                <p className="text-destructive text-sm">
                  {state.error.categoryId}
                </p>
              )}
          </div>

          <div className="space-y-2">
            <Label>제목</Label>
            <Input
              name="title"
              value={formData.title}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setFormData({ ...formData, title: e.target.value })
              }
            />
            {state?.error &&
              typeof state.error === 'object' &&
              state.error.title && (
                <p className="text-destructive text-sm">{state.error.title}</p>
              )}
          </div>

          <div className="space-y-2">
            <Label>내용</Label>
            <Textarea
              name="content"
              className="min-h-100"
              value={formData.content}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setFormData({ ...formData, content: e.target.value })
              }
            />
            {state?.error &&
              typeof state.error === 'object' &&
              state.error.content && (
                <p className="text-destructive text-sm">
                  {state.error.content}
                </p>
              )}
          </div>

          <div className="flex justify-end gap-2">
            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <Loader2 className="animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              수정 완료
            </Button>
          </div>
          {state?.error && typeof state.error === 'string' && (
            <p className="text-center text-destructive text-sm">
              {state.error}
            </p>
          )}
        </form>
      )}
    </div>
  );
}
