'use client';

import { ArrowLeft, Eye, Loader2, Save } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
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
import { categories, posts } from '@/data/mockData';

export default function EditPage() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  // 데이터 찾기
  const existingPost = posts.find((p) => p.id === id);

  const [isLoading, setIsLoading] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  // 초기값 설정
  const [formData, setFormData] = useState({
    title: existingPost?.title || '',
    content: existingPost?.content || '',
    categoryId: existingPost?.categoryId || '',
  });

  // 데이터가 늦게 로드되거나, URL 이동 시 데이터 동기화
  useEffect(() => {
    if (existingPost) {
      setFormData({
        title: existingPost.title,
        content: existingPost.content,
        categoryId: existingPost.categoryId,
      });
    }
  }, [existingPost]);

  // 게시글이 없을 경우 예외 처리
  if (!existingPost) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="font-bold text-2xl">게시글을 찾을 수 없습니다</h2>
        <Button asChild className="mt-4" variant="outline">
          <Link href="/posts">목록으로</Link>
        </Button>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast.success('수정 완료 (퍼블리싱 테스트)', {
        description: '실제 서버에는 저장되지 않았습니다.',
      });
    }, 1000);
  };

  return (
    <div className="container mx-auto px-4 pt-10.5 pb-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href={`/posts/${id}`}
              className="inline-flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              게시글로 돌아가기
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => setPreviewMode(!previewMode)}
              type="button"
            >
              <Eye className="mr-2 h-4 w-4" />
              {previewMode ? '편집 모드' : '미리보기'}
            </Button>
          </div>
        </div>

        <h1 className="mb-6 font-bold text-2xl">게시글 수정</h1>

        {previewMode ? (
          <Card>
            <CardHeader>
              <div className="mb-2 flex items-center gap-2">
                {formData.categoryId && (
                  <span
                    className="rounded-full px-3 py-1 font-medium text-xs"
                    style={{
                      backgroundColor: `${categories.find((c) => c.id === formData.categoryId)?.color}20`,
                      color: categories.find(
                        (c) => c.id === formData.categoryId,
                      )?.color,
                    }}
                  >
                    {categories.find((c) => c.id === formData.categoryId)?.name}
                  </span>
                )}
              </div>
              <CardTitle className="text-3xl">
                {formData.title || '제목 없음'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-invert max-w-none whitespace-pre-wrap">
                {formData.content || '내용 없음'}
              </div>
            </CardContent>
          </Card>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="category">카테고리</Label>
              {/* key를 주면 데이터가 바뀔 때 강제로 다시 그려서 선택값을 확실하게 보여줌 */}
              <Select
                key={formData.categoryId}
                value={formData.categoryId}
                onValueChange={(val) =>
                  setFormData((prev) => ({ ...prev, categoryId: val }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="카테고리 선택" />
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
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">제목</Label>
              <Input
                id="title"
                name="title"
                placeholder="제목을 입력하세요"
                value={formData.title}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, title: e.target.value }))
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">내용</Label>
              <Textarea
                id="content"
                name="content"
                placeholder="내용을 입력하세요..."
                className="min-h-100 resize-none font-mono"
                value={formData.content}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, content: e.target.value }))
                }
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" asChild>
                <Link href={`/posts/${id}`}>취소</Link>
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                수정 완료
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
